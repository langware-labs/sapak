// app-shell.jsx — authenticated app: icon rail, topbar, Suppliers, Deals list
const { Icons: XI, Brand: XBrand } = window;
const pick = (f, lang) => (f && typeof f === "object" && !React.isValidElement(f)) ? (f[lang] ?? f.he) : f;

const STATUS_TONE = {
  open: "tone-blue", sourcing: "tone-amber", review: "tone-teal",
  awarded: "tone-green", closed: "tone-gray", draft: "tone-gray",
};
const OFFER_TONE = {
  winner: "tone-green", received: "tone-teal", pending: "tone-amber",
  declined: "tone-gray", negotiating: "tone-blue",
};

function StatusChip({ status, t }) {
  return <span className={"chip " + (STATUS_TONE[status] || "tone-gray")}>{t.statusLabels[status]}</span>;
}

function Rail({ t, route, setRoute, onToggleLang, lang }) {
  const item = (key, ic, label) => (
    <button className={"rail-btn" + (route.startsWith(key) ? " rail-on" : "")}
      onClick={() => setRoute(key)} data-label={label}>
      <i>{ic({ size: 22 })}</i>
      <span className="rail-tip">{label}</span>
    </button>
  );
  return (
    <aside className="rail">
      <button className="rail-brand" onClick={() => setRoute("deals")}><XBrand size={34} /></button>
      <nav className="rail-nav">
        {item("suppliers", XI.suppliers, t.app.nav.suppliers)}
        {item("deals", XI.deals, t.app.nav.deals)}
      </nav>
      <div className="rail-foot">
        <button className="rail-btn" onClick={onToggleLang} data-label="HE / EN">
          <i className="rail-lang">{lang === "he" ? "EN" : "עב"}</i>
          <span className="rail-tip">{lang === "he" ? "English" : "עברית"}</span>
        </button>
        <button className="rail-btn" data-label={t.app.nav.settings}>
          <i>{XI.settings({ size: 21 })}</i><span className="rail-tip">{t.app.nav.settings}</span>
        </button>
        <button className="rail-avatar">מל</button>
      </div>
    </aside>
  );
}

function Topbar({ t, title, sub, onNew }) {
  return (
    <div className="topbar">
      <div className="topbar-titles">
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      <div className="topbar-tools">
        <div className="search">
          <i>{XI.search({ size: 17 })}</i>
          <input placeholder={t.app.search} />
        </div>
        <button className="icon-btn"><i className="dot" />{XI.bell({ size: 19 })}</button>
        {onNew && <button className="btn btn-primary" onClick={onNew}><i>{XI.plus({ size: 17 })}</i>{t.app.newDeal}</button>}
      </div>
    </div>
  );
}

function Suppliers({ t, lang }) {
  const { SUPPLIERS } = window.SAPAK_DATA;
  return (
    <div className="content">
      <div className="grid-suppliers">
        {SUPPLIERS.map((s) => (
          <div className="sup-card" key={s.id}>
            <div className="sup-top">
              <div className="sup-av" style={{ background: s.color + "1a", color: s.color }}>{s.init}</div>
              <div className="sup-rate"><i>{XI.star({ size: 14 })}</i>{s.rating}</div>
            </div>
            <h3 className="sup-name">{pick(s.name, lang)}</h3>
            <span className="sup-cat">{pick(s.cat, lang)}</span>
            <div className="sup-meta">
              <span>{pick(s.loc, lang)}</span>
              <span className="sup-deals">{s.deals} {t.app.nav.deals}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealsList({ t, lang, onOpen, onNew }) {
  const { DEALS, supById } = window.SAPAK_DATA;
  const fmt = (n, cur) => n == null ? "—" : cur + n.toLocaleString("en-US");
  return (
    <div className="content">
      <div className="deals-list">
        {DEALS.map((d) => {
          const winner = d.offers.find((o) => o.status === "winner");
          const savings = d.lowest != null ? Math.max(0, d.target - d.lowest) : 0;
          const pct = d.lowest != null ? Math.round((savings / d.target) * 100) : 0;
          return (
            <button className="deal-row" key={d.id} onClick={() => onOpen(d.id)}>
              <div className="dr-main">
                <div className="dr-head">
                  <span className="dr-ref">{d.ref}</span>
                  <StatusChip status={d.status} t={t} />
                </div>
                <h3 className="dr-title">{pick(d.title, lang)}</h3>
                <div className="dr-sub">
                  <span className="dr-cat">{pick(d.cat, lang)}</span>
                  <span className="dr-dot">·</span>
                  <span>{pick(d.requester, lang)}</span>
                </div>
              </div>
              <div className="dr-stats">
                <div className="dr-stat"><b>{d.contacted}</b><span>{t.app.stats.contacted}</span></div>
                <div className="dr-stat"><b>{d.offersCount}</b><span>{t.app.stats.offers}</span></div>
                <div className="dr-stat"><b>{fmt(d.lowest, d.currency)}</b><span>{t.app.stats.lowest}</span></div>
                <div className="dr-stat dr-stat-save">
                  <b className={pct > 0 ? "save-pos" : ""}>{pct > 0 ? "−" + pct + "%" : "—"}</b>
                  <span>{t.app.stats.savings}</span>
                </div>
              </div>
              <div className="dr-go">
                <div className="dr-days"><i>{XI.clock({ size: 14 })}</i>{d.daysOpen} {t.lang === "he" ? "ימים" : "d"}</div>
                <i className="dr-chev">{(lang === "he" ? XI.chevR : XI.chevR)({ size: 20 })}</i>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { Rail, Topbar, Suppliers, DealsList, StatusChip, pick, STATUS_TONE, OFFER_TONE });
