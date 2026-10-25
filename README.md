# Sapak — AI procurement agent on WhatsApp

[![Deploy to Flow Cloud](https://img.shields.io/badge/Deploy%20to-Flow%20Cloud-2563eb)](https://app.flowpad.ai/launch?repo=https://github.com/langware-labs/sapak)

Someone writes "I need 5 chairs" on WhatsApp. Sapak turns it into an approved spec, searches real
suppliers, and sends back one HTML report with verified prices, product images and everything
needed to order.

## The recipe

1. **Crisp the request** — a few quick searches, then a draft spec with sensible defaults and at
   most 3 questions that matter (under a minute).
2. **Approved spec** — the final spec as a short list; the person replies *yes*.
3. **Suppliers and report** — a progress note, then one HTML report (≥4 products, images that load,
   an order box per option with SKU, total, product link and supplier contact), checked by
   `tools/check_report.py`, then a short WhatsApp summary.

It never buys or pays, never asks for payment details, and never invents a product or price.
English and Hebrew (right-to-left reports) are supported.

## What is in this project

| Path | What it is |
|---|---|
| `agentic-assets/agent/procurement/` | The agent: `agent.json` (Claude, model `sm`) and `system_prompt.md` |
| `.claude/skills/deep-research/SKILL.md` | The supplier research and report recipe |
| `tools/send_report.py` | Sends a progress note or the report file into the WhatsApp chat |
| `tools/check_report.py` | Quality gate the report must pass before it is sent |
| `flow.json` | Depends on [waha-service](https://github.com/langware-labs/waha-service) (the WhatsApp channel) |
| `caller-demo/` | Voice-calls demo app (see `SAPAK-DEMO-SPEC.md`) |
| `design/`, `docs/`, `crm.html` | Product UI references |

## Deploy

1. Click **Deploy to Flow Cloud** above. A sandbox starts and clones this project and waha-service.
2. Approve the WAHA service setup when asked (it installs the WhatsApp container).
3. In the WAHA admin, add a device and scan its QR code with the WhatsApp number the agent will use.
4. Onboarding connects the **Procurement agent** to that number. Send it a buying request.

The agent's model calls are funded by the sandbox's LLM source (a Claude login or a hub endpoint).
