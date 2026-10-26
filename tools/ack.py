"""The agent's ack: put an emoji on the person's latest WhatsApp message the moment the agent takes it.

    python3 tools/ack.py <emoji>

The channel already reacted from rules when the message arrived; this replaces it with the agent's own
choice (WhatsApp keeps one reaction of ours per message). Best effort: it never fails the turn.
"""
import json
import subprocess
import sys


def flow(*args: str) -> str:
    return subprocess.run(["flow", *args], capture_output=True, text=True, timeout=30).stdout


def latest_person_message() -> str:
    best_id, best_at = "", ""
    for conv in json.loads(flow("conversation", "list") or "{}").get("conversations") or []:
        if conv.get("members"):  # channel chats have no Flowpad members
            continue
        shown = json.loads(flow("conversation", "show", conv["id"], "--json", "--last", "6") or "{}")
        if not any(t.get("channel") == "whatsapp" for t in shown.get("threads") or []):
            continue
        for message in reversed(shown.get("messages") or []):
            if str(message.get("sender") or "").startswith("agent:"):
                continue
            if str(message.get("ts") or "") > best_at:
                best_id, best_at = message["id"], str(message["ts"])
            break
    return best_id


def main() -> None:
    emoji = sys.argv[1] if len(sys.argv) > 1 else "👀"
    try:
        message = latest_person_message()
        if message:
            print(flow("conversation", "react", message, emoji).strip() or f"reacted {emoji}")
    except Exception as exc:  # noqa: BLE001 -- an ack that did not land must not stop the work
        print(f"ack not sent: {type(exc).__name__}")


if __name__ == "__main__":
    main()
