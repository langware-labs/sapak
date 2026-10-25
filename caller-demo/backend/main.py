"""FastAPI backend.

Run with: .venv/bin/uvicorn main:app --reload --port 8080

In development the Next.js frontend proxies /api/* here (next.config.ts
rewrite), so browser code calls relative /api/... paths on port 3000.
Interactive docs: http://localhost:8080/docs
"""

import asyncio
import json
import os

import httpx
import websockets
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
# Secrets live in .env.local (gitignored); it overrides .env defaults.
load_dotenv(".env.local", override=True)

OPENAI_CLIENT_SECRETS_URL = "https://api.openai.com/v1/realtime/client_secrets"
OPENAI_CALLS_URL = "https://api.openai.com/v1/realtime/calls"
REALTIME_MODEL = os.getenv("REALTIME_MODEL", "gpt-realtime-2")
REALTIME_VOICE = os.getenv("REALTIME_VOICE", "marin")

# Outbound phone calls (Twilio bridges PSTN -> OpenAI SIP connector)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")
OPENAI_PROJECT_ID = os.getenv("OPENAI_PROJECT_ID")  # proj_... of the API key's project

PHONE_ASSISTANT_INSTRUCTIONS = os.getenv(
    "PHONE_ASSISTANT_INSTRUCTIONS",
    "You are a friendly assistant on a phone call. Speak Hebrew by default; "
    "switch to English if the caller does. Be concise and natural. "
    "Start by greeting the person warmly in Hebrew and explaining you are an "
    "AI assistant calling for a quick demo.",
)

app = FastAPI(title="Web App API", version="0.1.0")

# CORS for direct (non-proxied) calls from the dev frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    service: str


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Health check — also used by the landing-page status board."""
    return HealthResponse(status="ok", service="fastapi")


class EchoRequest(BaseModel):
    text: str


@app.post("/api/echo")
async def echo(req: EchoRequest) -> dict:
    """Example endpoint — replace with real Python-powered routes."""
    return {"echo": req.text}


@app.post("/api/realtime/token")
async def realtime_token() -> dict:
    """Mint an ephemeral OpenAI Realtime client secret for the browser.

    The browser never sees the real API key — it gets a one-minute token it
    uses to POST its WebRTC SDP offer to https://api.openai.com/v1/realtime/calls.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY is not set — add it to backend/.env and restart.",
        )

    session = {
        "type": "realtime",
        "model": REALTIME_MODEL,
        "audio": {"output": {"voice": REALTIME_VOICE}},
    }
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            OPENAI_CLIENT_SECRETS_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={"session": session},
        )
    if resp.status_code >= 400:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"OpenAI client_secrets error: {resp.text}",
        )
    data = resp.json()
    return {"value": data.get("value"), "session": session}


class OutboundCallRequest(BaseModel):
    to: str  # E.164, e.g. +9725XXXXXXXX


@app.post("/api/calls/outbound")
async def outbound_call(req: OutboundCallRequest) -> dict:
    """Place an outbound phone call: Twilio dials the number, then bridges
    the answered call to the OpenAI Realtime SIP connector. OpenAI fires a
    realtime.call.incoming webhook (handled below), which accepts the call
    with our assistant instructions.
    """
    missing = [
        name
        for name, val in {
            "TWILIO_ACCOUNT_SID": TWILIO_ACCOUNT_SID,
            "TWILIO_AUTH_TOKEN": TWILIO_AUTH_TOKEN,
            "TWILIO_FROM_NUMBER": TWILIO_FROM_NUMBER,
            "OPENAI_PROJECT_ID": OPENAI_PROJECT_ID,
        }.items()
        if not val
    ]
    if missing:
        raise HTTPException(503, f"Missing env vars: {', '.join(missing)}")
    if not req.to.startswith("+"):
        raise HTTPException(422, "Phone number must be E.164, e.g. +972501234567")

    twiml = (
        "<Response><Dial answerOnBridge=\"true\">"
        f"<Sip>sip:{OPENAI_PROJECT_ID}@sip.api.openai.com;transport=tls</Sip>"
        "</Dial></Response>"
    )
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Calls.json",
            auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),
            data={"To": req.to, "From": TWILIO_FROM_NUMBER, "Twiml": twiml},
        )
    if resp.status_code >= 400:
        raise HTTPException(resp.status_code, f"Twilio error: {resp.text}")
    call = resp.json()
    return {"call_sid": call.get("sid"), "status": call.get("status"), "to": req.to}


async def _greet_first(call_id: str, api_key: str) -> None:
    """Attach to the accepted call's event socket and ask the model to speak
    first, so the callee hears a greeting instead of silence."""
    uri = f"wss://api.openai.com/v1/realtime?call_id={call_id}"
    try:
        async with websockets.connect(
            uri, additional_headers={"Authorization": f"Bearer {api_key}"}
        ) as ws:
            await ws.send(json.dumps({"type": "response.create"}))
            await asyncio.sleep(1)  # let the server ingest the event
    except Exception as exc:  # demo: log, don't crash the webhook
        print(f"greet_first failed for {call_id}: {exc}")


@app.post("/api/openai/webhook")
async def openai_webhook(request: Request) -> dict:
    """OpenAI webhook receiver. On realtime.call.incoming, accept the call
    with our session config. (Demo: signature verification omitted.)"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(503, "OPENAI_API_KEY is not set")
    event = await request.json()
    if event.get("type") != "realtime.call.incoming":
        return {"ignored": event.get("type")}

    call_id = event["data"]["call_id"]
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            f"{OPENAI_CALLS_URL}/{call_id}/accept",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "type": "realtime",
                "model": REALTIME_MODEL,
                "instructions": PHONE_ASSISTANT_INSTRUCTIONS,
                "audio": {"output": {"voice": REALTIME_VOICE}},
            },
        )
    if resp.status_code >= 400:
        print(f"accept failed for {call_id}: {resp.status_code} {resp.text}")
        raise HTTPException(resp.status_code, f"Accept failed: {resp.text}")

    asyncio.create_task(_greet_first(call_id, api_key))
    return {"accepted": call_id}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
