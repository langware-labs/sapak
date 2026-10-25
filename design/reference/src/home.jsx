// home.jsx — Sapak marketing homepage
const { Brand: HBrand, Icons: HI } = window;

function PhoneChat({ t }) {
  const c = t.chat;
  return (
    <div className="phone">
      <div className="phone-notch" />
      <div className="wa-head">
        <div className="wa-avatar"><HBrand size={26} mono /></div>
        <div className="wa-meta">
          <b>{t.brand}</b>
          <span>{c.title}</span>
        </div>
        <div className="wa-dots"><span /><span /><span /></div>
      </div>
      <div className="wa-body">
        <div className="wa-day">היום · Today</div>
        <div className="bub bub-out">{c.u1}<i className="tick">✓✓</i></div>
        <div className="bub bub-in">{c.a1}</div>
        <div className="bub bub-out">{c.u2}<i className="tick">✓✓</i></div>
        <div className="bub bub-in">{c.a2}</div>
        <div className="bub bub-in bub-card">
          <div className="offer-flash">
            <span className="of-dot" />{c.a3}
          </div>
        </div>
      </div>
      <div className="wa-input"><span>הקלידו הודעה…</span><i className="wa-send">{HI.send({ size: 16 })}</i></div>
    </div>
  );
}

function Home({ t, go, heroTitle, heroSub }) {
  const title = (heroTitle || t.hero.title);
  const sub = (heroSub || t.hero.sub);
  return (
    <main className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><i className="eyebrow-spark">{HI.sparkle({ size: 15 })}</i>{t.hero.eyebrow}</span>
            <h1 className="hero-title">
              {title.split("\n").map((l, i) => <span key={i} className="hero-line">{l}</span>)}
            </h1>
            <p className="hero-sub">{sub}</p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={() => go("login")}>{t.hero.ctaPrimary}</button>
              <button className="btn btn-soft btn-lg" onClick={() => go("how")}>
                <i className="play">▶</i>{t.hero.ctaSecondary}
              </button>
            </div>
            <p className="hero-note">{t.hero.note}</p>
          </div>
          <div className="hero-visual">
            <PhoneChat t={t} />
            <div className="float-card fc-1">
              <i className="fc-ic" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>{HI.mail({ size: 18 })}</i>
              <div><b>6</b><span>{t.app.stats.contacted}</span></div>
            </div>
            <div className="float-card fc-2">
              <i className="fc-ic" style={{ background: "rgba(30,158,106,.14)", color: "var(--good)" }}>{HI.trend({ size: 18 })}</i>
              <div><b>₪78,400</b><span>{t.app.stats.lowest}</span></div>
            </div>
          </div>
        </div>
        <Waves />
      </section>

      {/* STEPS */}
      <section className="band band-tint">
        <div className="band-inner">
          <header className="sec-head">
            <h2>{t.steps.title}</h2>
            <p>{t.steps.sub}</p>
          </header>
          <div className="steps">
            {t.steps.list.map((s, i) => (
              <div className="step" key={i}>
                <div className="step-k">{s.k}</div>
                <div className="step-line" hidden={i === t.steps.list.length - 1} />
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="band">
        <div className="band-inner">
          <header className="sec-head">
            <h2>{t.channels.title}</h2>
            <p>{t.channels.sub}</p>
          </header>
          <div className="cards-3">
            {[HI.whatsapp, HI.mail, HI.grid].map((Ico, i) => (
              <div className="feat-card" key={i}>
                <i className="feat-ic">{Ico({ size: 22 })}</i>
                <h3>{t.channels.items[i].t}</h3>
                <p>{t.channels.items[i].d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="band band-tint">
        <div className="band-inner">
          <header className="sec-head">
            <h2>{t.audience.title}</h2>
            <p>{t.audience.sub}</p>
          </header>
          <div className="cards-3">
            {[HI.tag, HI.users, HI.shield].map((Ico, i) => (
              <div className="aud-card" key={i}>
                <i className="aud-ic">{Ico({ size: 24 })}</i>
                <div>
                  <h3>{t.audience.items[i].t}</h3>
                  <p>{t.audience.items[i].d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="band">
        <div className="band-inner">
          <div className="metrics">
            {t.metrics.items.map((m, i) => (
              <div className="metric" key={i}>
                <b>{m.n}</b><span>{m.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="band">
        <div className="band-inner">
          <div className="final-cta">
            <div className="fc-glow" />
            <h2>{t.finalCta.title}</h2>
            <p>{t.finalCta.sub}</p>
            <div className="hero-cta hero-cta-center">
              <button className="btn btn-light btn-lg" onClick={() => go("login")}>{t.finalCta.cta}</button>
              <button className="btn btn-outline-light btn-lg" onClick={() => go("pricing")}>{t.finalCta.secondary}</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Waves() {
  return (
    <svg className="hero-waves" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 60 C 240 110 480 10 720 50 C 960 90 1200 30 1440 60 L1440 120 L0 120 Z" fill="var(--wave-1)" />
      <path d="M0 80 C 240 40 480 110 720 80 C 960 50 1200 100 1440 75 L1440 120 L0 120 Z" fill="var(--wave-2)" />
    </svg>
  );
}

Object.assign(window, { Home });
