// pricing.jsx — Pricing page + How-it-works page
const { Icons: PI } = window;

function Pricing({ t, go }) {
  const [yearly, setYearly] = React.useState(false);
  const [open, setOpen] = React.useState(0);
  const p = t.pricing;
  return (
    <main className="page">
      <section className="band band-top">
        <div className="band-inner">
          <header className="sec-head">
            <span className="eyebrow eyebrow-center">{p.eyebrow}</span>
            <h2 className="big">{p.title}</h2>
            <p>{p.sub}</p>
            <div className="bill-toggle">
              <button className={!yearly ? "on" : ""} onClick={() => setYearly(false)}>{p.monthly}</button>
              <button className={yearly ? "on" : ""} onClick={() => setYearly(true)}>{p.yearly}<span className="save-pill">{p.save}</span></button>
            </div>
          </header>
          <div className="plans">
            {p.plans.map((pl, i) => (
              <div className={"plan" + (pl.featured ? " plan-feat" : "")} key={i}>
                {pl.featured && <div className="plan-badge">{t.lang === "he" ? "הכי פופולרי" : "Most popular"}</div>}
                <h3 className="plan-name">{pl.name}</h3>
                <p className="plan-desc">{pl.desc}</p>
                <div className="plan-price">
                  <b>{pl.price !== "₪0" && pl.price !== "Custom" && pl.price !== "בהתאמה" && yearly
                    ? "₪" + Math.round(parseInt(pl.price.replace(/\D/g, "")) * 0.8) : pl.price}</b>
                  {pl.price.startsWith("₪") && pl.price !== "₪0" && <span>{p.perMonth}</span>}
                </div>
                <button className={"btn btn-lg plan-cta " + (pl.featured ? "btn-primary" : "btn-soft")} onClick={() => go("login")}>{pl.cta}</button>
                <ul className="plan-feats">
                  {pl.features.map((f, j) => (
                    <li key={j}><i>{PI.check({ size: 16 })}</i>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-tint">
        <div className="band-inner band-narrow">
          <header className="sec-head"><h2>{p.faqTitle}</h2></header>
          <div className="faq">
            {p.faq.map((f, i) => (
              <div className={"faq-item" + (open === i ? " faq-open" : "")} key={i}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <i className="faq-chev">{PI.chevD({ size: 18 })}</i>
                </button>
                <div className="faq-a"><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function How({ t, go }) {
  const s = t.steps;
  return (
    <main className="page">
      <section className="band band-top">
        <div className="band-inner">
          <header className="sec-head">
            <span className="eyebrow eyebrow-center">{t.nav.how}</span>
            <h2 className="big">{s.title}</h2>
            <p>{s.sub}</p>
          </header>
          <div className="how-steps">
            {s.list.map((st, i) => (
              <div className="how-row" key={i}>
                <div className="how-k"><span>{st.k}</span></div>
                <div className="how-body">
                  <h3>{st.t}</h3>
                  <p>{st.d}</p>
                </div>
                <div className="how-art">
                  <i className="how-art-ic">{[PI.whatsapp, PI.sparkle, PI.mail, PI.trend][i]({ size: 26 })}</i>
                </div>
              </div>
            ))}
          </div>
          <div className="how-cta">
            <button className="btn btn-primary btn-lg" onClick={() => go("login")}>{t.hero.ctaPrimary}</button>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { Pricing, How });
