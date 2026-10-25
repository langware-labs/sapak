"""Gate a procurement report before it is sent.

    python3 tools/check_report.py <report.html>

Prints PASS, or every problem to fix; exits 1 on problems. Send only after PASS.
"""
import re
import subprocess
import sys

MIN_OPTIONS = 4
PLACEHOLDERS = re.compile(r"(?i)not stated|lorem|todo|tbd|לא צוין|לא ידוע")


def image_loads(url: str) -> bool:
    out = subprocess.run(
        ["curl", "-sIL", "-m", "15", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130",
         "-o", "/dev/null", "-w", "%{content_type}", url],
        capture_output=True, text=True,
    ).stdout
    return out.startswith("image/")


def problems(html: str) -> list[str]:
    found = []
    images = re.findall(r'<img[^>]+src="([^"]+)"', html)
    if len(images) < MIN_OPTIONS:
        found.append(f"only {len(images)} product images; need one per option, at least {MIN_OPTIONS}")
    for url in images:
        if not url.startswith("https://"):
            found.append(f"image is not an absolute https URL: {url[:100]}")
        elif not image_loads(url):
            found.append(f"image does not load (replace it with the same model's photo from another page): {url[:100]}")
    contacts = len(re.findall(r'href="(tel:|mailto:|https://wa\.me/)', html))
    if contacts < MIN_OPTIONS:
        found.append(f"only {contacts} supplier contact links (tel:/mailto:/wa.me); need one per option")
    if re.search(r"wa\.me/9720", html):
        found.append("malformed WhatsApp link wa.me/9720…: drop the leading 0 after 972")
    for word in sorted(set(m.group(0) for m in PLACEHOLDERS.finditer(html))):
        found.append(f"placeholder text '{word}': find the fact on the product or shop page, or replace the option")
    return found


def main() -> None:
    html = open(sys.argv[1], encoding="utf-8").read()
    found = problems(html)
    if found:
        print("FAIL")
        print("\n".join(f"- {p}" for p in found))
        sys.exit(1)
    print("PASS")


if __name__ == "__main__":
    main()
