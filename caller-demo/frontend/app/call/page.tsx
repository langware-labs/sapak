"use client";

// Minimal OpenAI Realtime voice call over WebRTC.
//
// Flow: fetch ephemeral token from FastAPI (/api/realtime/token) → open
// RTCPeerConnection with the mic track → POST the SDP offer to
// https://api.openai.com/v1/realtime/calls → play the remote audio track.
// Server events arrive on the "oai-events" data channel and land in the log.

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CallState =
  | "idle"
  | "token"
  | "mic"
  | "connecting"
  | "connected"
  | "error";

const STATE_LABEL: Record<CallState, string> = {
  idle: "Idle — not in a call",
  token: "Fetching ephemeral token…",
  mic: "Requesting microphone…",
  connecting: "Connecting WebRTC to OpenAI…",
  connected: "Live — speak now",
  error: "Error",
};

const STATE_DOT: Record<CallState, string> = {
  idle: "bg-zinc-400",
  token: "bg-amber-500 animate-pulse",
  mic: "bg-amber-500 animate-pulse",
  connecting: "bg-amber-500 animate-pulse",
  connected: "bg-emerald-500",
  error: "bg-red-500",
};

interface LogEntry {
  ts: string;
  kind: "info" | "event" | "error";
  text: string;
}

export default function CallPage() {
  const [state, setState] = useState<CallState>("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const addLog = useCallback((kind: LogEntry["kind"], text: string) => {
    const ts = new Date().toLocaleTimeString();
    setLog((prev) => [...prev.slice(-199), { ts, kind, text }]);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const greet = useCallback(() => {
    // Prove audio-out without needing the user to speak: ask the model to talk.
    dcRef.current?.send(
      JSON.stringify({
        type: "response.create",
        response: {
          instructions:
            "Greet the caller briefly in Hebrew, then say the same greeting in English.",
        },
      }),
    );
    addLog("info", "Sent response.create (greet request)");
  }, [addLog]);

  const stopCall = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    dcRef.current = null;
    micRef.current?.getTracks().forEach((t) => t.stop());
    micRef.current = null;
    if (audioRef.current) audioRef.current.srcObject = null;
    setState("idle");
    addLog("info", "Call ended.");
  }, [addLog]);

  useEffect(() => stopCall, [stopCall]); // cleanup on unmount

  const startCall = useCallback(async () => {
    setErrorDetail(null);
    setLog([]);
    try {
      // 1. Ephemeral token from our backend (real API key stays server-side)
      setState("token");
      addLog("info", "POST /api/realtime/token");
      const tokenResp = await fetch("/api/realtime/token", { method: "POST" });
      if (!tokenResp.ok) {
        const body = await tokenResp.json().catch(() => null);
        throw new Error(body?.detail ?? `Token endpoint: HTTP ${tokenResp.status}`);
      }
      const { value: ephemeralKey, session } = await tokenResp.json();
      addLog("info", `Token OK — model ${session.model}, voice ${session.audio.output.voice}`);

      // 2. Microphone
      setState("mic");
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      micRef.current = mic;
      addLog("info", "Microphone acquired");

      // 3. WebRTC peer connection
      setState("connecting");
      const pc = new RTCPeerConnection();
      pcRef.current = pc;
      pc.addTrack(mic.getTracks()[0]);
      pc.ontrack = (e) => {
        if (audioRef.current) audioRef.current.srcObject = e.streams[0];
        addLog("info", "Remote audio track received");
      };
      pc.onconnectionstatechange = () => {
        addLog("info", `Peer connection: ${pc.connectionState}`);
        if (pc.connectionState === "connected") setState("connected");
        if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
          if (pcRef.current) {
            setErrorDetail(`Peer connection ${pc.connectionState}`);
            setState("error");
          }
        }
      };

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.addEventListener("open", () => addLog("info", "Data channel open"));
      dc.addEventListener("message", (e) => {
        try {
          const ev = JSON.parse(e.data);
          if (ev.type === "response.output_audio_transcript.delta") return; // too chatty
          if (ev.type === "response.output_audio_transcript.done") {
            addLog("event", `assistant: "${ev.transcript}"`);
          } else if (ev.type === "conversation.item.input_audio_transcription.completed") {
            addLog("event", `you: "${ev.transcript}"`);
          } else if (ev.type === "error") {
            addLog("error", JSON.stringify(ev.error ?? ev));
          } else {
            addLog("event", ev.type);
          }
        } catch {
          addLog("event", String(e.data));
        }
      });

      // 4. SDP offer → OpenAI Realtime
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      addLog("info", "POST https://api.openai.com/v1/realtime/calls (SDP offer)");
      const sdpResp = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
      });
      if (!sdpResp.ok) {
        throw new Error(`SDP exchange failed: HTTP ${sdpResp.status} ${await sdpResp.text()}`);
      }
      await pc.setRemoteDescription({ type: "answer", sdp: await sdpResp.text() });
      addLog("info", "SDP answer applied — waiting for connection…");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog("error", msg);
      setErrorDetail(msg);
      setState("error");
      pcRef.current?.close();
      pcRef.current = null;
      micRef.current?.getTracks().forEach((t) => t.stop());
      micRef.current = null;
    }
  }, [addLog]);

  const inCall = state !== "idle" && state !== "error";

  return (
    <main className="container mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Realtime Voice Call
      </h1>
      <p className="mt-2 text-muted-foreground">
        Browser ↔ OpenAI <code>gpt-realtime-2</code> over WebRTC. The FastAPI
        backend mints a one-minute ephemeral token; audio flows directly
        between your browser and OpenAI.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span
              className={`inline-block size-2.5 rounded-full ${STATE_DOT[state]}`}
              data-testid="call-state-dot"
            />
            <span data-testid="call-state">{STATE_LABEL[state]}</span>
          </CardTitle>
          {errorDetail && (
            <CardDescription className="text-red-500" data-testid="call-error">
              {errorDetail}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex gap-3">
          {!inCall ? (
            <Button onClick={startCall} data-testid="start-call">
              Start call
            </Button>
          ) : (
            <>
              <Button variant="destructive" onClick={stopCall} data-testid="end-call">
                End call
              </Button>
              <Button
                variant="secondary"
                onClick={greet}
                disabled={state !== "connected"}
                data-testid="greet"
              >
                Make it speak
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Event log</CardTitle>
          <CardDescription>
            Realtime API events from the <code>oai-events</code> data channel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="h-72 overflow-y-auto rounded-md bg-zinc-950 p-3 font-mono text-xs text-zinc-300"
            data-testid="event-log"
          >
            {log.length === 0 && (
              <span className="text-zinc-600">No events yet — start a call.</span>
            )}
            {log.map((entry, i) => (
              <div key={i} className="whitespace-pre-wrap">
                <span className="text-zinc-600">{entry.ts} </span>
                <span
                  className={
                    entry.kind === "error"
                      ? "text-red-400"
                      : entry.kind === "event"
                        ? "text-sky-400"
                        : "text-zinc-300"
                  }
                >
                  {entry.text}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </CardContent>
      </Card>

      <OutboundCallCard />

      {/* Remote (assistant) audio */}
      <audio ref={audioRef} autoPlay />
    </main>
  );
}

function OutboundCallCard() {
  const [to, setTo] = useState("+972");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const placeCall = async () => {
    setBusy(true);
    setStatus("Placing call…");
    try {
      const resp = await fetch("/api/calls/outbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail ?? `HTTP ${resp.status}`);
      setStatus(`Calling ${data.to} — Twilio ${data.status} (${data.call_sid})`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Outbound phone call</CardTitle>
        <CardDescription>
          Twilio dials the number and bridges it to the same realtime
          assistant via OpenAI&apos;s SIP connector
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex gap-3">
          <input
            type="tel"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="+972501234567"
            className="w-56 rounded-md border bg-transparent px-3 py-1.5 text-sm"
            data-testid="outbound-to"
          />
          <Button onClick={placeCall} disabled={busy} data-testid="outbound-call">
            {busy ? "Calling…" : "Call this number"}
          </Button>
        </div>
        {status && (
          <p className="text-sm text-muted-foreground" data-testid="outbound-status">
            {status}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
