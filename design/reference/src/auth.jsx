// auth.jsx — Sapak login
const { Brand: ABrand, Icons: AI } = window;

function Login({ t, go }) {
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  return (
    <main className="auth">
      <div className="auth-art">
        <div className="auth-art-glow" />
        <button className="auth-brand" onClick={() => go("home")}>
          <ABrand size={40} mono /><span>{t.brand}</span>
        </button>
        <div className="auth-art-body">
          <h2>{t.lang === "he" ? "הרכש שלכם, בשליטה מלאה." : "Your procurement, fully in control."}</h2>
          <p>{t.footer.tagline}</p>
          <div className="auth-mini">
            <div className="amini"><i>{AI.whatsapp({ size: 18 })}</i><span>{t.channels.items[0].t}</span></div>
            <div className="amini"><i>{AI.mail({ size: 18 })}</i><span>{t.channels.items[1].t}</span></div>
            <div className="amini"><i>{AI.shield({ size: 18 })}</i><span>{t.audience.items[2].t}</span></div>
          </div>
        </div>
        <svg className="auth-waves" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60 C 120 110 240 10 360 50 C 480 90 540 30 600 60 L600 120 L0 120 Z" fill="rgba(255,255,255,.10)" />
          <path d="M0 85 C 120 45 240 110 360 80 C 480 55 540 100 600 78 L600 120 L0 120 Z" fill="rgba(255,255,255,.08)" />
        </svg>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">
          <h1>{t.login.title}</h1>
          <p className="auth-sub">{t.login.sub}</p>

          <button className="btn btn-oauth" onClick={() => go("app")}>
            <AI.google size={18} />{t.login.google}
          </button>
          <button className="btn btn-oauth btn-wa" onClick={() => go("app")}>
            <i className="wa-ic">{AI.whatsapp({ size: 18 })}</i>{t.login.whatsapp}
          </button>

          <div className="auth-or"><span>{t.login.or}</span></div>

          <form onSubmit={(e) => { e.preventDefault(); go("app"); }}>
            <label className="fld">
              <span>{t.login.email}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </label>
            <label className="fld">
              <span>{t.login.password}</span>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
            </label>
            <div className="fld-row">
              <label className="chk"><input type="checkbox" defaultChecked /><span>{t.login.remember}</span></label>
              <button type="button" className="link">{t.login.forgot}</button>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block">{t.login.submit}</button>
          </form>

          <button className="btn btn-demo btn-block" onClick={() => go("app")}>
            <i className="sparkle-i">{AI.sparkle({ size: 16 })}</i>{t.login.demo}
          </button>

          <p className="auth-foot">{t.login.noAccount} <button className="link" onClick={() => go("app")}>{t.login.signup}</button></p>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { Login });
