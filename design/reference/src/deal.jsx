// deal.jsx — Deal detail: header stats, Overview, Transactions (offers), Communication (email inbox)
const { Icons: DI } = window;
const dpick = window.pick;

function Stat({ label, value, tone, sub }) {
  return (
    <div className="hstat">
      <span className="hstat-l">{label}</span>
      <b className={"hstat-v" + (tone ? " " + tone : "")}>{value}</b>
      {sub && <span className="hstat-sub">{sub}</span>}
    </div>
  );
}

function OfferRow({ o, deal, lang, t, isWinner, onPick }) {
  const sup = window.SAPAK_DATA.supById[o.sid];
  const fmt = (n) => deal.currency + n.toLocaleString("en-US");
  const tone = window.OFFER_TONE[o.status] || "tone-gray";
  return (
    <div className={"offer-row" + (isWinner ? " offer-win" : "")}>
      <div className="of-sup">
        <div className="of-av" style={{ background: sup.color + "1a", color: sup.color }}>{sup.init}</div>
        <div>
          <b>{dpick(sup.name, lang)}</b>
          <span className="of-note">{dpick(o.note, lang)}</span>
        </div>
      </div>
      <div className="of-price"><b>{fmt(o.price)}</b>
        {o.price <= deal.target
          ? <span className="of-delta good">{"−" + Math.round((1 - o.price / deal.target) * 100) + "%"}</span>
          : <span className="of-delta bad">{"+" + Math.round((o.price / deal.target - 1) * 100) + "%"}</span>}
      </div>
      <div className="of-del"><i>{DI.clock({ size: 14 })}</i>{dpick(o.delivery, lang)}</div>
      <span className={"chip " + tone}>{t.offerStatus[o.status]}</span>
      <div className="of-act">
        {isWinner
          ? <span className="win-tag"><i>{DI.check({ size: 14 })}</i>{t.app.winner}</span>
          : <button className="btn btn-pick" onClick={() => onPick(o.sid)}>{t.app.pick}</button>}
      </div>
    </div>
  );
}

function Inbox({ deal, lang, t }) {
  const sids = Object.keys(deal.threads);
  const [sel, setSel] = React.useState(sids[0]);
  const [draft, setDraft] = React.useState("");
  const [extra, setExtra] = React.useState({});
  if (sids.length === 0) return <div className="empty">{lang === "he" ? "טרם נשלחו פניות לספקים." : "No supplier outreach yet."}</div>;
  const sup = window.SAPAK_DATA.supById[sel];
  const msgs = (deal.threads[sel] || []).concat(extra[sel] || []);
  const send = () => {
    if (!draft.trim()) return;
    const m = { id: sel + "-x" + Date.now(), who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" },
      time: { he: "עכשיו", en: "now" }, subject: { he: "Re: התכתבות", en: "Re: thread" }, body: { he: draft, en: draft } };
    setExtra((e) => ({ ...e, [sel]: (e[sel] || []).concat(m) }));
    setDraft("");
  };
  return (
    <div className="inbox">
      <div className="inbox-list">
        {sids.map((sid) => {
          const s = window.SAPAK_DATA.supById[sid];
          const thread = deal.threads[sid];
          const last = thread[thread.length - 1];
          const off = deal.offers.find((o) => o.sid === sid);
          return (
            <button key={sid} className={"ibx-item" + (sel === sid ? " ibx-on" : "")} onClick={() => setSel(sid)}>
              <div className="ibx-av" style={{ background: s.color + "1a", color: s.color }}>{s.init}</div>
              <div className="ibx-meta">
                <div className="ibx-row1"><b>{dpick(s.name, lang)}</b><span>{dpick(last.time, lang)}</span></div>
                <div className="ibx-row2">{dpick(last.subject, lang)}</div>
                <div className="ibx-row3">{dpick(last.body, lang).split("\n")[0]}</div>
              </div>
              {off && <span className={"ibx-tag chip " + (window.OFFER_TONE[off.status] || "tone-gray")}>{t.offerStatus[off.status]}</span>}
            </button>
          );
        })}
      </div>
      <div className="inbox-thread">
        <div className="thr-head">
          <div className="ibx-av lg" style={{ background: sup.color + "1a", color: sup.color }}>{sup.init}</div>
          <div>
            <b>{dpick(sup.name, lang)}</b>
            <span>{dpick(sup.cat, lang)} · {dpick(sup.loc, lang)}</span>
          </div>
        </div>
        <div className="thr-body">
          {msgs.map((m) => (
            <div key={m.id} className={"email " + (m.who === "sapak" ? "email-out" : "email-in")}>
              <div className="email-head">
                <div className={"email-av " + (m.who === "sapak" ? "av-sapak" : "av-sup")}>
                  {m.who === "sapak" ? DI.sparkle({ size: 15 }) : sup.init}
                </div>
                <div className="email-from">
                  <b>{dpick(m.from, lang)}</b>
                  <span className="email-subj">{dpick(m.subject, lang)}</span>
                </div>
                <span className="email-time">{dpick(m.time, lang)}</span>
              </div>
              <div className="email-body">{dpick(m.body, lang).split("\n").map((l, i) => <p key={i}>{l}</p>)}</div>
            </div>
          ))}
        </div>
        <div className="composer">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t.app.compose} rows={2} />
          <button className="btn btn-primary composer-send" onClick={send}><i>{DI.send({ size: 16 })}</i>{t.app.send}</button>
        </div>
      </div>
    </div>
  );
}

function Overview({ deal, lang, t }) {
  const sup = deal.offers[0] ? window.SAPAK_DATA.supById[deal.offers[0].sid] : null;
  const sorted = [...deal.offers].sort((a, b) => a.price - b.price);
  const max = Math.max(deal.target, ...deal.offers.map((o) => o.price), 1);
  return (
    <div className="overview">
      <div className="ov-main">
        <div className="ov-card">
          <h3 className="ov-h">{lang === "he" ? "מפרט הרכש" : "Procurement spec"}</h3>
          <ul className="spec-list">
            {dpick(deal.spec, lang).map((s, i) => <li key={i}><i>{DI.check({ size: 15 })}</i>{s}</li>)}
          </ul>
          <div className="spec-meta">
            <div><span>{t.app.quantity}</span><b>{dpick(deal.quantity, lang)}</b></div>
            <div><span>{t.app.target}</span><b>{deal.currency}{deal.target.toLocaleString("en-US")}</b></div>
            <div><span>{t.app.deadline}</span><b>{dpick(deal.deadline, lang)}</b></div>
          </div>
        </div>
        {deal.offers.length > 0 && (
          <div className="ov-card">
            <h3 className="ov-h">{lang === "he" ? "השוואת הצעות" : "Offer comparison"}</h3>
            <div className="bars">
              <div className="bar-target" style={{ insetInlineStart: (deal.target / max * 100) + "%" }}>
                <span>{t.app.target}</span>
              </div>
              {sorted.map((o) => {
                const s = window.SAPAK_DATA.supById[o.sid];
                return (
                  <div className="bar-row" key={o.sid}>
                    <span className="bar-name">{dpick(s.name, lang)}</span>
                    <div className="bar-track">
                      <div className={"bar-fill" + (o.status === "winner" ? " bar-win" : "")}
                        style={{ width: (o.price / max * 100) + "%", background: o.status === "winner" ? "var(--good)" : s.color }} />
                    </div>
                    <span className="bar-val">{deal.currency}{o.price.toLocaleString("en-US")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="ov-side">
        <div className="ov-card ov-time">
          <h3 className="ov-h">{lang === "he" ? "ציר זמן" : "Activity"}</h3>
          <div className="timeline">
            {[
              { ic: DI.sparkle, txt: lang === "he" ? "ספק ניסח מפרט רכש" : "Sapak drafted the spec", time: deal.daysOpen + (lang === "he" ? " ימים" : "d") },
              { ic: DI.mail, txt: (lang === "he" ? "נשלחו פניות ל‑" : "RFQs sent to ") + deal.contacted + (lang === "he" ? " ספקים" : " suppliers"), time: "" },
              { ic: DI.deals, txt: deal.offersCount + (lang === "he" ? " הצעות התקבלו" : " offers received"), time: "" },
              ...(deal.status === "awarded" ? [{ ic: DI.check, txt: lang === "he" ? "ההצעה הזוכה אושרה" : "Winner awarded", time: "" }] : []),
            ].map((e, i) => (
              <div className="tl-item" key={i}>
                <i className="tl-ic">{e.ic({ size: 15 })}</i>
                <div className="tl-txt">{e.txt}{e.time && <span className="tl-time">{e.time}</span>}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DealDetail({ dealId, t, lang, onBack }) {
  const deal = window.SAPAK_DATA.DEALS.find((d) => d.id === dealId);
  const [tab, setTab] = React.useState("overview");
  const [winnerId, setWinnerId] = React.useState((deal.offers.find((o) => o.status === "winner") || {}).sid);
  const offers = deal.offers.map((o) => ({ ...o, status: o.sid === winnerId ? "winner" : (o.status === "winner" ? "received" : o.status) }));
  const savings = deal.lowest != null ? Math.max(0, deal.target - deal.lowest) : 0;
  const pct = deal.lowest != null ? Math.round((savings / deal.target) * 100) : 0;
  const fmt = (n) => n == null ? "—" : deal.currency + n.toLocaleString("en-US");
  const tabs = [["overview", t.app.tabs.overview], ["transactions", t.app.tabs.transactions], ["comms", t.app.tabs.comms]];

  return (
    <div className="content deal-detail">
      <button className="back-btn" onClick={onBack}>
        <i>{(lang === "he" ? DI.arrowR : DI.arrowL)({ size: 18 })}</i>{t.app.backToDeals}
      </button>

      <div className="deal-head">
        <div className="dh-top">
          <div>
            <div className="dh-ref">{deal.ref} · {dpick(deal.cat, lang)}</div>
            <h1 className="dh-title">{dpick(deal.title, lang)}</h1>
            <div className="dh-req">{dpick(deal.requester, lang)}</div>
          </div>
          <window.StatusChip status={deal.status} t={t} />
        </div>
        <div className="hstats">
          <Stat label={t.app.stats.contacted} value={deal.contacted} />
          <Stat label={t.app.stats.offers} value={deal.offersCount} />
          <Stat label={t.app.stats.lowest} value={fmt(deal.lowest)} tone="v-teal" />
          <Stat label={t.app.stats.savings} value={pct > 0 ? "−" + pct + "%" : "—"} tone={pct > 0 ? "v-good" : ""} sub={pct > 0 ? fmt(savings) : ""} />
          <Stat label={t.app.stats.days} value={deal.daysOpen} sub={dpick(deal.deadline, lang)} />
        </div>
      </div>

      <div className="tabs">
        {tabs.map(([k, label]) => (
          <button key={k} className={"tab" + (tab === k ? " tab-on" : "")} onClick={() => setTab(k)}>{label}
            {k === "comms" && Object.keys(deal.threads).length > 0 && <span className="tab-count">{Object.keys(deal.threads).length}</span>}
            {k === "transactions" && <span className="tab-count">{deal.offersCount}</span>}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview deal={deal} lang={lang} t={t} />}
      {tab === "transactions" && (
        <div className="offers">
          {offers.length === 0
            ? <div className="empty">{lang === "he" ? "טרם התקבלו הצעות. ספק עדיין פונה לספקים." : "No offers yet. Sapak is still reaching out."}</div>
            : (<>
              <div className="offers-head">
                <span>{t.app.cols.supplier}</span><span>{t.app.cols.offer}</span>
                <span>{t.app.cols.delivery}</span><span>{t.app.cols.status}</span><span />
              </div>
              {offers.sort((a, b) => a.price - b.price).map((o) => (
                <OfferRow key={o.sid} o={o} deal={deal} lang={lang} t={t} isWinner={o.sid === winnerId} onPick={setWinnerId} />
              ))}
            </>)}
        </div>
      )}
      {tab === "comms" && <Inbox deal={deal} lang={lang} t={t} />}
    </div>
  );
}

Object.assign(window, { DealDetail });
