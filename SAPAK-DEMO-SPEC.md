---
id: b173e37b-1f99-5c17-b5d1-c7aa93c29c6d
---

# Sapak Demo — Delivery Specification

**Audience:** external provider commissioned to supply this demo.
**Goal:** reproduce, as delivered software, the demo we already have running in-house. This document is the source of truth for scope, behavior, and acceptance. Everything described here exists and works today; the provider's deliverable must match it.

---

## 1. What Sapak is (context)

Sapak is an AI procurement agent for businesses. A buyer opens a purchase request; the Sapak agent contacts relevant suppliers, runs the RFQ/negotiation over email and **phone calls**, collects offers, and presents an audit-ready comparison so the buyer can pick a winner.

The demo has two parts:

1. **Calls agent demo (working app)** — a full-stack web app demonstrating the voice channel: a live browser voice conversation with the agent, and the agent placing a real outbound phone call to any number.
2. **Product UI design reference (mock)** — a React mock of the Sapak product: dashboard, deal/RFQ view with offer comparison and per-supplier email threads, and auth screens.

---

## 2. Part A — Calls agent demo (working app)

### 2.1 Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | FastAPI (Python), uvicorn |
| Database | Supabase Postgres (Drizzle ORM on the frontend side) — present in the template, not load-bearing for the call demo |
| Voice AI | OpenAI Realtime API, model `gpt-realtime-2`, voice `marin` (both env-configurable) |
| Telephony | Twilio Programmable Voice → OpenAI Realtime **SIP connector** |

Dev topology: frontend on **:3000**, backend on **:8080**. `next.config.ts` rewrites `/api/:path*` to the backend (Next.js route handlers under `app/api/` win first), so all browser code calls relative `/api/...` paths. CORS is additionally open from `http://localhost:3000` for direct calls. Deployment target: Vercel (frontend, with `BACKEND_URL` env pointing at the deployed backend), any container host for the backend (Dockerfile provided), hosted Supabase for DB.

### 2.2 Backend API (FastAPI)

All endpoints under `/api/*`:

| Endpoint | Method | Behavior |
|---|---|---|
| `/api/health` | GET | Returns `{status: "ok", service: "fastapi"}`; consumed by the landing-page status board. |
| `/api/echo` | POST | `{text}` → `{echo: text}` (template sample). |
| `/api/realtime/token` | POST | Mints a **one-minute ephemeral client secret** from `POST https://api.openai.com/v1/realtime/client_secrets` using the server-side `OPENAI_API_KEY`, with session config `{type: "realtime", model, audio.output.voice}`. Returns `{value, session}`. The real API key never reaches the browser. 503 with a clear message if the key is unset; upstream errors are surfaced with status + body. |
| `/api/calls/outbound` | POST | `{to}` (must be E.164, validated → 422 otherwise). Places a Twilio call: `POST /2010-04-01/Accounts/{SID}/Calls.json` with inline TwiML `<Response><Dial answerOnBridge="true"><Sip>sip:{OPENAI_PROJECT_ID}@sip.api.openai.com;transport=tls</Sip></Dial></Response>` — Twilio dials the callee and bridges the answered leg to OpenAI's SIP connector. Returns `{call_sid, status, to}`. 503 listing any missing env vars. |
| `/api/openai/webhook` | POST | OpenAI webhook receiver. On `realtime.call.incoming` (fired when the SIP leg reaches OpenAI): accepts the call via `POST https://api.openai.com/v1/realtime/calls/{call_id}/accept` with `{type: "realtime", model, instructions, audio.output.voice}`. Then, as a background task, opens `wss://api.openai.com/v1/realtime?call_id={call_id}` and sends `{"type": "response.create"}` so the **agent speaks first** — the callee hears a greeting, not silence. Other event types return `{ignored: <type>}`. (Demo scope: webhook signature verification intentionally omitted — note this in code.) |

**Phone-agent persona** (env-overridable `PHONE_ASSISTANT_INSTRUCTIONS`): friendly assistant on a phone call; concise and natural; opens by greeting the person warmly and explaining it is an AI assistant calling for a quick demo.

### 2.3 Frontend UI

**Landing page `/`** — bootstrap status board with four live status cards (Next.js frontend, Next.js route handlers via `GET /api/hello`, FastAPI backend via `GET /api/health`, Supabase config detection), green/red/pulsing-grey dots, a "Re-check" button, and a link **"Open voice call demo →"** to `/call`.

**Call page `/call`** — the demo centerpiece, three cards:

1. **Realtime Voice Call card** — live browser ↔ agent conversation over WebRTC.
   - State machine with labeled status dot: `idle → token → mic → connecting → connected` (+ `error`), e.g. "Live — speak now", amber pulse while in progress, red on error with the error detail shown.
   - **Start call** flow: ① POST `/api/realtime/token` → ephemeral key; ② `getUserMedia` microphone; ③ `RTCPeerConnection`, mic track added, remote audio track attached to a hidden autoplaying `<audio>`; a data channel named **`oai-events`**; ④ SDP offer POSTed directly to `https://api.openai.com/v1/realtime/calls` with `Authorization: Bearer <ephemeral>` and `Content-Type: application/sdp`; answer applied. Audio then flows browser↔OpenAI directly (not through our backend).
   - While connected: **End call** (closes peer connection, stops mic tracks) and **Make it speak** — sends `response.create` over the data channel with instructions to greet the caller briefly (proves audio-out without requiring the user to talk).
2. **Event log card** — scrolling monospace log (auto-scroll, capped ~200 entries) of Realtime API events from the `oai-events` data channel: user and assistant **turn transcripts** rendered as `you: "..."` / `assistant: "..."` (transcript delta events suppressed as too chatty), other event types by name, errors in red, info in neutral, timestamps on every line.
3. **Outbound phone call card** — a phone-number input (E.164) and a **"Call this number"** button → POST `/api/calls/outbound`; shows progress ("Placing call…"), then `Calling <to> — Twilio <status> (<call_sid>)` or the error detail.

All interactive elements carry `data-testid` attributes (`start-call`, `end-call`, `greet`, `call-state`, `call-state-dot`, `call-error`, `event-log`, `outbound-to`, `outbound-call`, `outbound-status`) — keep these for automated acceptance testing.

### 2.4 Call flows (summary)

**Inbound (browser) call:**
```
Browser ── POST /api/realtime/token ──▶ FastAPI ── client_secrets ──▶ OpenAI
Browser ── SDP offer (ephemeral key) ─────────────────────────────▶ OpenAI /v1/realtime/calls
Browser ◀━━━━━━━━━━━ WebRTC audio + oai-events data channel ━━━━━▶ OpenAI (gpt-realtime-2)
```

**Outbound (phone) call:**
```
Browser ── POST /api/calls/outbound ──▶ FastAPI ── REST ──▶ Twilio dials callee
Twilio ── <Dial answerOnBridge><Sip> ──▶ sip:{PROJECT_ID}@sip.api.openai.com (TLS)
OpenAI ── realtime.call.incoming webhook ──▶ FastAPI /api/openai/webhook
FastAPI ── accept(call_id, instructions, voice) ──▶ OpenAI
FastAPI ── WSS response.create ──▶ agent greets the callee first
```

### 2.5 Configuration

Backend env (`.env` defaults + gitignored `.env.local` overrides): `OPENAI_API_KEY`, `REALTIME_MODEL` (default `gpt-realtime-2`), `REALTIME_VOICE` (default `marin`), `PHONE_ASSISTANT_INSTRUCTIONS`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `OPENAI_PROJECT_ID`. Frontend env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `BACKEND_URL`, `DATABASE_URL`.

External prerequisites the provider must wire up: an OpenAI project with Realtime API access, its **SIP connector / webhook** configured to point at the deployed `/api/openai/webhook` (the webhook must be publicly reachable — e.g. a tunnel in dev), and a Twilio account with a voice-capable from-number.

Setup must be one command (`python3 setup.py` equivalent): install frontend deps, create the backend venv + deps, seed env files. Supabase local stack (`supabase start` + migrations) is optional for the call demo.

### 2.6 Acceptance criteria — Part A

1. `/` shows all status cards green with frontend + backend running.
2. On `/call`, **Start call** reaches "Live — speak now" within ~5 s; speaking gets a spoken response; both sides' transcripts appear in the event log.
3. **Make it speak** produces an audible greeting.
4. **End call** returns to idle and releases the microphone.
5. Entering a real mobile number and clicking **Call this number** rings the phone within seconds; on answer, the AI agent **greets first** and holds a natural conversation. The UI shows the Twilio call SID/status.
6. The OpenAI API key is never exposed to the browser (only the one-minute ephemeral token).
7. Clear, user-visible error states for: missing env vars (503 with names), non-E.164 number (422), token/SDP/Twilio failures.

---

## 3. Part B — Sapak product UI (design reference)

A static React mock (no backend) defining the product look-and-feel the demo narrative is anchored to. Reference implementation and screenshot are provided to the vendor (`design/reference/` — `Sapak.html`, `src/{app-shell,home,deal,auth,chrome,icons,data}.jsx`; `sapak-home.png`).

Required characteristics:

- **Home/dashboard**: active deals list — each deal shows a reference number, title, category, status (e.g. review/negotiating), suppliers contacted vs offers received, days open, and deadline.
- **Deal view**: the request spec as a bullet list (quantity, requirements, delivery constraints); an **offer comparison table** across suppliers (delivery time, status — winner / received / negotiating, notes); and per-supplier **email threads** showing the Sapak agent's RFQ + negotiation correspondence (agent asks clarifying questions, supplier replies), audit-ready with timestamps and subjects.
- **Supplier directory data**: name, category, rating, past deal count, avatar initials/color.
- **Auth screens** per the reference.
- Demo dataset: one sample deal with several suppliers and offers, structured as in the reference data, using placeholder names.

Acceptance: side-by-side visual match with `sapak-home.png` and the reference mock.

---

## 4. Deliverables

1. Source code for Part A (frontend + backend + setup script + Dockerfile) and Part B, matching this spec.
2. A deployed, publicly reachable instance of Part A with the OpenAI webhook and Twilio wiring live, so the outbound-call demo works end-to-end.
3. A one-page runbook: env vars, how to run locally, how to point Twilio/OpenAI at a new deployment, and the demo script (open `/call` → browser call → outbound call to a volunteer's phone).
4. Handover walkthrough demonstrating every acceptance criterion in §2.6 and §3.

Out of scope: webhook signature verification, call recording/persistence, authentication on the demo app, production hardening — unless separately agreed.
