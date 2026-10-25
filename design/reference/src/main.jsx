// main.jsx — App root: routing, language, tweaks
const { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakToggle, TweakRadio, TweakSelect, TweakText } = window;

const ACCENTS = ["#0E7C86", "#2563EB", "#4F46E5", "#0EA5A4", "#0F766E"];
const FONT_PAIRS = {
  "Heebo · Assistant": { head: "Heebo", body: "Assistant" },
  "Rubik": { head: "Rubik", body: "Rubik" },
  "Frank Ruhl · Assistant": { head: "'Frank Ruhl Libre'", body: "Assistant" },
  "Noto Sans Hebrew": { head: "'Noto Sans Hebrew'", body: "'Noto Sans Hebrew'" },
};
const RADII = { חד: 6, רך: 14, עגול: 22, Sharp: 6, Soft: 14, Round: 22 };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#0E7C86",
  "fontPair": "Heebo · Assistant",
  "radius": "רך",
  "dark": false,
  "lang": "he",
  "heroTitle": "",
  "heroSub": ""
}/*EDITMODE-END*/;

function persist(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function recall(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const lang = tw.lang || "he";
  const t = window.STRINGS[lang];
  const [view, setView] = React.useState(() => recall("sapak.view", "home"));
  const [route, setRoute] = React.useState(() => recall("sapak.route", "deals"));

  React.useEffect(() => persist("sapak.view", view), [view]);
  React.useEffect(() => persist("sapak.route", route), [route]);

  // apply theme tokens
  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent", tw.accent || "#0E7C86");
    const fp = FONT_PAIRS[tw.fontPair] || FONT_PAIRS["Heebo · Assistant"];
    r.style.setProperty("--font-head", fp.head + ", system-ui, sans-serif");
    r.style.setProperty("--font-body", fp.body + ", system-ui, sans-serif");
    r.style.setProperty("--radius", (RADII[tw.radius] ?? 14) + "px");
    r.setAttribute("dir", t.dir);
    r.setAttribute("lang", lang);
    r.classList.toggle("dark", !!tw.dark);
  }, [tw.accent, tw.fontPair, tw.radius, tw.dark, lang, t.dir]);

  const go = (v) => { window.scrollTo({ top: 0 }); setView(v); };
  const toggleLang = () => setTweak("lang", lang === "he" ? "en" : "he");

  const inApp = view === "app";

  return (
    <div className="root">
      {!inApp && view !== "login" && <window.Nav t={t} lang={lang} view={view} go={go} onToggleLang={toggleLang} />}

      {view === "home" && <window.Home t={t} go={go} heroTitle={tw.heroTitle} heroSub={tw.heroSub} />}
      {view === "how" && <window.How t={t} go={go} />}
      {view === "pricing" && <window.Pricing t={t} go={go} />}
      {view === "login" && <window.Login t={t} go={go} />}
      {inApp && <AppView t={t} lang={lang} route={route} setRoute={setRoute} onToggleLang={toggleLang} onExit={() => go("home")} />}

      {!inApp && view !== "login" && <window.Footer t={t} go={go} />}

      <TweaksPanel>
        <TweakSection label={lang === "he" ? "מותג" : "Brand"} />
        <TweakColor label={lang === "he" ? "צבע מותג" : "Accent"} value={tw.accent} options={ACCENTS} onChange={(v) => setTweak("accent", v)} />
        <TweakSelect label={lang === "he" ? "גופנים" : "Fonts"} value={tw.fontPair} options={Object.keys(FONT_PAIRS)} onChange={(v) => setTweak("fontPair", v)} />
        <TweakSection label={lang === "he" ? "תצוגה" : "Display"} />
        <TweakRadio label={lang === "he" ? "פינות" : "Corners"} value={tw.radius}
          options={lang === "he" ? ["חד", "רך", "עגול"] : Object.keys(RADII).slice(3)}
          onChange={(v) => setTweak("radius", v)} />
        <TweakToggle label={lang === "he" ? "מצב כהה" : "Dark mode"} value={tw.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakRadio label={lang === "he" ? "שפה" : "Language"} value={lang} options={["he", "en"]} onChange={(v) => setTweak("lang", v)} />
        <TweakSection label={lang === "he" ? "כותרת ראשית" : "Hero copy"} />
        <TweakText label={lang === "he" ? "כותרת" : "Headline"} value={tw.heroTitle} placeholder={t.hero.title.replace("\n", " ")} onChange={(v) => setTweak("heroTitle", v)} />
        <TweakText label={lang === "he" ? "תיאור" : "Subhead"} value={tw.heroSub} placeholder={t.hero.sub.slice(0, 40) + "…"} onChange={(v) => setTweak("heroSub", v)} />
      </TweaksPanel>
    </div>
  );
}

function AppView({ t, lang, route, setRoute, onToggleLang, onExit }) {
  const openDeal = (id) => setRoute("deal:" + id);
  const isDeal = route.startsWith("deal:");
  const section = isDeal ? "deals" : route;
  return (
    <div className="app">
      <window.Rail t={t} route={section} setRoute={setRoute} onToggleLang={onToggleLang} lang={lang} />
      <div className="app-main">
        {route === "suppliers" && (<>
          <window.Topbar t={t} title={t.app.suppliersTitle} sub={t.app.suppliersSub} />
          <window.Suppliers t={t} lang={lang} />
        </>)}
        {route === "deals" && (<>
          <window.Topbar t={t} title={t.app.dealsTitle} sub={t.app.dealsSub} onNew={() => {}} />
          <window.DealsList t={t} lang={lang} onOpen={openDeal} />
        </>)}
        {isDeal && <window.DealDetail dealId={route.slice(5)} t={t} lang={lang} onBack={() => setRoute("deals")} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
