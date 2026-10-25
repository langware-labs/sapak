---
id: ee4f02c3-46fa-47d7-87eb-c7a17fa6b692
name: deep-research
description: Deep procurement research for an agreed buying brief — searches widely,
  verifies prices and vendors from fetched pages, and writes one polished, self-contained
  HTML report. Use after the person has confirmed the brief.
---

# deep-research — procurement report

Input: the agreed brief (item, specs, quantity, delivery location/address, budget, deadline,
extras). Do it all yourself — no Agent tool, no subagents.
Output: one HTML file (never Markdown) at `reports/<yyyy-mm-dd>-<item-slug>-<hhmm>.html` in this project
(create `reports/` if needed), written in the language the person writes in (English chat → English report) — for Hebrew use
`<html lang="he" dir="rtl">`. Takes a few minutes; do not cut corners.

## 0. Blocked shops (this machine has a US IP)

Several Israeli shops refuse it with 403 (ksp, payngo, cwc, …); bug.co.il and ivory.co.il
answer. When WebFetch on a page fails or comes back without price/image, fetch it once with
Bash instead and read the facts out of the HTML:
`curl -sL -m 20 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130" <url> | grep -oE '(og:image|og:title|product:price:amount|"price"|tel:|wa\.me/|mailto:)[^>]{0,200}' | head -40`
Still 403 → drop that shop and take the same model from a shop that answers, the
manufacturer's Israeli site, or zap.co.il (its product page lists shops, prices and an image).
Never leave an option without an image and contact because one shop blocked you.

Printed or custom goods (branded shirts, mugs, signs, print runs) have no shop product page,
so the recipe is different — and you still deliver the full report:
- An option = a print house that serves the delivery city (search "הדפסה על חולצות <city>",
  "custom t-shirt printing <city>", b144.co.il, zap.co.il). Take 4 that publish a phone or WhatsApp.
- Its price = the per-unit or bulk price its site states for the quantity; if it states none,
  its quote form/phone is the order path and the price column says "quote: <its starting
  price or the market range from your searches>, ask for <qty> units" — a stated range, never
  an empty cell.
- Its image = the blank item it prints on: the supplier's own product photo when it has one,
  otherwise the photo of that blank model (e.g. Gildan/B&C/Fruit of the Loom 100% cotton tee)
  from the manufacturer or a shop page — curl-checked like any image.
- Its order box = phone/WhatsApp, the quote page URL, and what to send them (logo file,
  colour, size split, quantity, deadline).

## 1. Research (breadth, then depth)

1. Plan 6–10 searches from different angles: the exact item + specs, "best <item> <year>"
   reviews, vendors that deliver to the delivery country, bulk/business pricing for the
   quantity, local retailers near the delivery city, and shipping/lead times.
2. Run them with WebSearch. Pick the 8–15 most useful pages and WebFetch each one. Prefer
   vendor product pages (price, stock, dimensions, shipping) and independent reviews.
3. Build a shortlist of **4–5 different products** (different models, not one model at
   several shops) that meet the must-haves. To end with 4, fetch 7–8 candidate product
   pages in parallel batches. WebFetch each product page with a prompt that asks
   for: exact product name, SKU/model number, price, stock, shipping cost and time, the
   `og:image` URL (or main product photo `src`, absolute), and the store's phone, email or
   WhatsApp. If the page has no contact, WebFetch the store's contact page once.
   Record per option: name, vendor, SKU, image URL, unit price, total for the quantity,
   shipping and delivery estimate, key specs, warranty, pros, cons, source URL(s).
   Check every image URL in one Bash call: `curl -sIL -A Mozilla/5.0 -o /dev/null -w '%{content_type} %{url_effective}\n' <url> ...`;
   keep only ones that return `image/*`. Drop a candidate that has no price and use the next one. If
   only its image fails, take the same model's photo from another page you fetched
   (manufacturer or another shop) and check that one. Never write "not stated" in an order box.
   **Gate: do not start writing until your list has 4 rows** — 4 different models, each with
   price, product-page URL, contact and an image that passed curl. Count them. At 3 or fewer,
   search another shop or brand (one shop rarely has 4 fitting models) and fetch more.
   If fewer than 4 meet every must-have, fill up with the nearest ones (slightly over budget,
   later delivery, or an online shop that ships to the country) and mark each one's gap
   in its card. Always finish and send the report; never stop to ask.
4. Check every option against the budget and deadline. Compute totals yourself (unit ×
   quantity + shipping); show the arithmetic in the table.
5. Choose: **Best overall**, **Best value**, and **Premium** (or **Fastest delivery** when the
   deadline is tight). Explain each pick in 2–3 sentences tied to the brief.

## 2. Write the report

One `.html` file: inline `<style>`, no external scripts or fonts. Product images are the one
external resource: `<img>` with the image URL taken from the fetched product page (its
`og:image` or main product photo), `loading="lazy"`, a fixed aspect box and meaningful `alt`
text so the layout holds when offline. System font stack. Must look
designed, not like a default page.

Structure, in order:

1. **Header** — title "Procurement report: <item>", date, and a one-line brief summary.
2. **Recommendation card** — the Best overall pick: name, vendor, total price (big), delivery
   estimate, a "Why" line and a "View offer" link.
3. **Brief** — a compact definition list of everything agreed (item, specs, quantity,
   delivery address, budget, deadline, extras).
4. **Comparison table** — all shortlisted options: vendor, unit price, total (qty), shipping,
   delivery estimate, rating, link. Highlight the three picks with small badges. On narrow
   screens the table scrolls horizontally inside its own container.
5. **Option cards** — one per option: product image, key specs, pros (✓) and cons (✗),
   warranty/returns, and an **Order box**: supplier name, SKU/model number, unit price,
   quantity, total, the product page URL ("Order here" — the product itself, never a category
   or search page), and the supplier's phone (`tel:+972…`), email (`mailto:`) or WhatsApp
   (`https://wa.me/972…`, country code without the leading 0) — everything needed to order.
6. **Budget & timeline** — total vs budget (a simple CSS bar), and whether each pick meets
   the deadline.
7. **Risks & next steps** — what to verify before buying (stock, bulk discount, import
   duties/VAT, assembly), and the exact steps for the person to place the order themselves.
8. **Sources** — numbered list of every URL used, with the page title. Cite them in the
   text as [1], [2].
9. **Footer** — "Prices checked on <date>; they can change. This report recommends; it did
   not place any order."

Design: max-width ~880px centred, generous spacing, a single accent colour, rounded cards with
subtle borders/shadows, tabular numbers for prices, readable at 375px wide, and a
`prefers-color-scheme: dark` variant. Currency formatted with its symbol.

## 3. Check before sending

- Write the file in ONE Write call (at most one Edit afterwards), then check it with one Bash `grep -c` for `<img`,
  `href="https`, and placeholder words (TODO, lorem, not stated); fix only what fails.
- Every price has a source, totals add up, links are full `https://` URLs.
- File size under 1 MB.
- Run `python3 tools/check_report.py <report.html>` and fix until it prints PASS (the agent
  flow says how many tries). Then return to the agent flow to send it.
