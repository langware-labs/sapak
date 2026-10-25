// chrome.jsx — marketing Nav + Footer
const { Brand: BrandMark } = window;

function Nav({ t, lang, view, go, onToggleLang }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", on); on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  const link = (key, target) => (
    <button className="nav-link" onClick={() => go(target)}
      style={{ color: view === target ? "var(--accent)" : "var(--ink-2)" }}>
      {key}
    </button>
  );
  return (
    <header className={"nav" + (scrolled ? " nav-scrolled" : "")}>
      <div className="nav-inner">
        <button className="nav-brand" onClick={() => go("home")}>
          <BrandMark size={34} />
          <span className="nav-word">{t.brand}</span>
        </button>
        <nav className="nav-links">
          {link(t.nav.how, "how")}
          {link(t.nav.pricing, "pricing")}
          {link(t.nav.customers, "home")}
        </nav>
        <div className="nav-actions">
          <button className="lang-btn" onClick={onToggleLang} title="HE / EN">
            {lang === "he" ? "EN" : "עב"}
          </button>
          <button className="btn btn-ghost" onClick={() => go("login")}>{t.nav.login}</button>
          <button className="btn btn-primary" onClick={() => go("login")}>{t.nav.cta}</button>
        </div>
      </div>
    </header>
  );
}

function Footer({ t, go }) {
  const L = t.footer.links;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="nav-brand" style={{ cursor: "default" }}>
            <BrandMark size={34} />
            <span className="nav-word">{t.brand}</span>
          </div>
          <p className="footer-tag">{t.footer.tagline}</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>{t.footer.product}</h4>
            <button onClick={() => go("how")}>{L.how}</button>
            <button onClick={() => go("pricing")}>{L.pricing}</button>
            <button onClick={() => go("login")}>{L.security}</button>
          </div>
          <div className="footer-col">
            <h4>{t.footer.company}</h4>
            <button onClick={() => go("home")}>{L.about}</button>
            <button onClick={() => go("home")}>{L.careers}</button>
            <button onClick={() => go("home")}>{L.contact}</button>
          </div>
          <div className="footer-col">
            <h4>{t.footer.legal}</h4>
            <button onClick={() => go("home")}>{L.privacy}</button>
            <button onClick={() => go("home")}>{L.terms}</button>
          </div>
        </div>
      </div>
      <div className="footer-base">{t.footer.rights}</div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer });
