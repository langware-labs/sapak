"""Send a finished HTML report to the WhatsApp person this agent is talking to.

    python3 tools/send_report.py <report.html> "<short caption>"
    python3 tools/send_report.py --say "<text>"     # a message now, mid-task

Finds the WhatsApp conversation whose latest message is newest (the one the
person just wrote in) and sends the file there with `flow conversation reply`.
"""
import json
import os
import re
import subprocess
import sys


def run(*args: str) -> str:
    return subprocess.run(["flow", *args], capture_output=True, text=True, check=True,
                          env={**os.environ, "COLUMNS": "400"}).stdout


def whatsapp_conversation() -> str:
    listed = json.loads(run("conversation", "list"))
    best, best_at = "", ""
    for conv in listed.get("conversations") or listed.get("data") or []:
        if conv.get("members"):  # channel chats have no Flowpad members
            continue
        shown = run("conversation", "show", conv["id"])
        if "· whatsapp ·" not in shown:
            continue
        stamps = re.findall(r"^── (\S+) ·", shown, flags=re.M)
        if stamps and stamps[-1] > best_at:
            best, best_at = conv["id"], stamps[-1]
    if not best:
        sys.exit("no WhatsApp conversation found")
    return best


def main() -> None:
    conv = whatsapp_conversation()
    if sys.argv[1] == "--say":
        print(run("conversation", "reply", conv, sys.argv[2]))
        return
    path, caption = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "Your procurement report"
    print(run("conversation", "reply", conv, caption, "--file", path))


if __name__ == "__main__":
    main()
