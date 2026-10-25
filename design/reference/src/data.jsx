// data.jsx — mock data for Sapak app (bilingual fields where shown to users)
// pick(field, lang) helper lives in main; here fields are {he, en} or plain.

const SUPPLIERS = [
  { id: "s1", name: { he: "אופיס‑פלוס בע״מ", en: "Office-Plus Ltd." }, cat: { he: "ריהוט משרדי", en: "Office furniture" }, rating: 4.8, deals: 23, loc: { he: "תל אביב", en: "Tel Aviv" }, init: "אפ", color: "#0E7C86" },
  { id: "s2", name: { he: "ארגונומיקה", en: "Ergonomica" }, cat: { he: "ריהוט ארגונומי", en: "Ergonomic furniture" }, rating: 4.6, deals: 17, loc: { he: "חיפה", en: "Haifa" }, init: "אר", color: "#2563EB" },
  { id: "s3", name: { he: "טק‑סנטר", en: "Tech-Center" }, cat: { he: "ציוד מחשוב", en: "IT hardware" }, rating: 4.9, deals: 41, loc: { he: "הרצליה", en: "Herzliya" }, init: "טק", color: "#7C3AED" },
  { id: "s4", name: { he: "גרין‑קלין", en: "Green-Clean" }, cat: { he: "ניקיון ואחזקה", en: "Cleaning & facility" }, rating: 4.4, deals: 12, loc: { he: "ראשון לציון", en: "Rishon LeZion" }, init: "גק", color: "#1E9E6A" },
  { id: "s5", name: { he: "פרינט‑אקספרס", en: "Print-Express" }, cat: { he: "דפוס ומיתוג", en: "Print & branding" }, rating: 4.5, deals: 28, loc: { he: "ירושלים", en: "Jerusalem" }, init: "פא", color: "#D97706" },
  { id: "s6", name: { he: "סייפ‑גארד", en: "Safe-Guard" }, cat: { he: "ציוד בטיחות", en: "Safety equipment" }, rating: 4.7, deals: 9, loc: { he: "באר שבע", en: "Beer Sheva" }, init: "סג", color: "#DC2626" },
];

const supById = Object.fromEntries(SUPPLIERS.map(s => [s.id, s]));

// Email thread builder per offer (from supplier, audit-ready)
function thread(sup, msgs) {
  return msgs.map((m, i) => ({ id: sup.id + "-m" + i, ...m }));
}

const DEALS = [
  {
    id: "d1",
    ref: "PR‑2026‑048",
    title: { he: "200 כיסאות משרדיים ארגונומיים", en: "200 ergonomic office chairs" },
    cat: { he: "ריהוט משרדי", en: "Office furniture" },
    status: "review",
    contacted: 6, offersCount: 4,
    target: 90000, lowest: 78400, currency: "₪",
    daysOpen: 4, deadline: { he: "12 ביוני", en: "Jun 12" },
    quantity: { he: "200 יח׳", en: "200 units" },
    requester: { he: "מאיה לוי · רכש", en: "Maya Levi · Procurement" },
    spec: {
      he: ["משענת רשת ארגונומית", "תמיכת גב מתכווננת", "אחריות 5 שנים", "אספקה לחיפה תוך 3 שבועות"],
      en: ["Ergonomic mesh back", "Adjustable lumbar support", "5-year warranty", "Delivery to Haifa within 3 weeks"],
    },
    offers: [
      { sid: "s2", price: 78400, delivery: { he: "12 יום", en: "12 days" }, status: "winner", note: { he: "כולל הרכבה והובלה", en: "Incl. assembly & freight" } },
      { sid: "s1", price: 82900, delivery: { he: "18 יום", en: "18 days" }, status: "received", note: { he: "אחריות 5 שנים", en: "5-year warranty" } },
      { sid: "s5", price: 88200, delivery: { he: "10 יום", en: "10 days" }, status: "negotiating", note: { he: "ממתין להבהרת כמות", en: "Awaiting quantity clarification" } },
      { sid: "s6", price: 91500, delivery: { he: "21 יום", en: "21 days" }, status: "received", note: { he: "מעל התקציב", en: "Above budget" } },
    ],
    threads: {
      s2: thread(supById.s2, [
        { who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" }, time: { he: "28 מאי, 09:14", en: "May 28, 09:14" }, subject: { he: "בקשת הצעת מחיר — 200 כיסאות ארגונומיים", en: "RFQ — 200 ergonomic chairs" }, body: { he: "שלום ארגונומיקה,\nלקוח שלנו מעוניין ב‑200 כיסאות משרדיים ארגונומיים עם משענת רשת, תמיכת גב מתכווננת ואחריות ל‑5 שנים. אספקה לחיפה תוך 3 שבועות, תקציב עד 90,000 ₪.\nנשמח להצעת מחיר מלאה הכוללת הובלה והרכבה.", en: "Hello Ergonomica,\nOur client needs 200 ergonomic office chairs with a mesh back, adjustable lumbar support and a 5-year warranty. Delivery to Haifa within 3 weeks, budget up to ₪90,000.\nWe'd appreciate a full quote including freight and assembly." } },
        { who: "supplier", from: { he: "ארגונומיקה", en: "Ergonomica" }, time: { he: "28 מאי, 16:42", en: "May 28, 16:42" }, subject: { he: "Re: בקשת הצעת מחיר", en: "Re: RFQ" }, body: { he: "שלום,\nתודה על הפנייה. נוכל לספק את דגם ERGO‑PRO M5 בכמות המבוקשת.\nמחיר ליחידה: 392 ₪ + מע״מ. סה״כ 78,400 ₪ כולל הובלה והרכבה לחיפה.\nאספקה: עד 12 ימי עסקים. אחריות מלאה ל‑5 שנים.", en: "Hello,\nThanks for reaching out. We can supply our ERGO-PRO M5 model in the requested quantity.\nUnit price: ₪392 + VAT. Total ₪78,400 incl. freight and assembly to Haifa.\nDelivery: up to 12 business days. Full 5-year warranty." } },
        { who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" }, time: { he: "29 מאי, 08:05", en: "May 29, 08:05" }, subject: { he: "Re: בקשת הצעת מחיר — אישור פרטים", en: "Re: RFQ — confirming details" }, body: { he: "תודה. האם המחיר כולל אריזה והרכבה במשרדי הלקוח? והאם ניתן לעמוד באספקה גם אם הכמות תעלה ל‑220?", en: "Thank you. Does the price include packaging and on-site assembly? And can you still meet delivery if quantity rises to 220?" } },
        { who: "supplier", from: { he: "ארגונומיקה", en: "Ergonomica" }, time: { he: "29 מאי, 11:20", en: "May 29, 11:20" }, subject: { he: "Re: אישור פרטים", en: "Re: confirming details" }, body: { he: "כן, המחיר כולל הרכבה במקום. עד 220 יח׳ — אותו מחיר ליחידה ואספקה תוך 14 יום.", en: "Yes, price includes on-site assembly. Up to 220 units — same unit price, delivery within 14 days." } },
      ]),
      s1: thread(supById.s1, [
        { who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" }, time: { he: "28 מאי, 09:14", en: "May 28, 09:14" }, subject: { he: "בקשת הצעת מחיר — 200 כיסאות ארגונומיים", en: "RFQ — 200 ergonomic chairs" }, body: { he: "שלום אופיס‑פלוס, מצורפת בקשה ל‑200 כיסאות ארגונומיים. נשמח להצעה מלאה.", en: "Hello Office-Plus, attached is a request for 200 ergonomic chairs. A full quote would be appreciated." } },
        { who: "supplier", from: { he: "אופיס‑פלוס בע״מ", en: "Office-Plus Ltd." }, time: { he: "29 מאי, 10:31", en: "May 29, 10:31" }, subject: { he: "Re: הצעת מחיר", en: "Re: Quote" }, body: { he: "שלום, מצורפת הצעה: 82,900 ₪ כולל הובלה. אספקה 18 יום, אחריות 5 שנים. נשמח להמשך.", en: "Hello, here is our quote: ₪82,900 incl. freight. Delivery 18 days, 5-year warranty. Happy to proceed." } },
      ]),
      s5: thread(supById.s5, [
        { who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" }, time: { he: "28 מאי, 09:15", en: "May 28, 09:15" }, subject: { he: "בקשת הצעת מחיר — כיסאות ארגונומיים", en: "RFQ — ergonomic chairs" }, body: { he: "שלום פרינט‑אקספרס, האם תוכלו לספק כיסאות ארגונומיים בכמות 200?", en: "Hello Print-Express, can you supply ergonomic chairs in a quantity of 200?" } },
        { who: "supplier", from: { he: "פרינט‑אקספרס", en: "Print-Express" }, time: { he: "29 מאי, 14:02", en: "May 29, 14:02" }, subject: { he: "Re: הצעת מחיר", en: "Re: Quote" }, body: { he: "שלום, מחיר ראשוני 88,200 ₪. נדרשת הבהרה לגבי הכמות המדויקת לפני סגירה.", en: "Hello, initial price ₪88,200. We need clarification on the exact quantity before finalizing." } },
      ]),
      s6: thread(supById.s6, [
        { who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" }, time: { he: "28 מאי, 09:15", en: "May 28, 09:15" }, subject: { he: "בקשת הצעת מחיר — כיסאות ארגונומיים", en: "RFQ — ergonomic chairs" }, body: { he: "שלום סייפ‑גארד, מצורפת בקשה ל‑200 כיסאות ארגונומיים.", en: "Hello Safe-Guard, attached is a request for 200 ergonomic chairs." } },
        { who: "supplier", from: { he: "סייפ‑גארד", en: "Safe-Guard" }, time: { he: "30 מאי, 09:48", en: "May 30, 09:48" }, subject: { he: "Re: הצעת מחיר", en: "Re: Quote" }, body: { he: "שלום, הצעתנו 91,500 ₪, אספקה 21 יום. מעל לתקציב שצוין אך זמין למו״מ.", en: "Hello, our offer is ₪91,500, delivery 21 days. Above the stated budget but open to negotiation." } },
      ]),
    },
  },
  {
    id: "d2", ref: "PR‑2026‑051",
    title: { he: "45 עמדות מחשב + מסכים", en: "45 workstations + monitors" },
    cat: { he: "ציוד מחשוב", en: "IT hardware" },
    status: "sourcing", contacted: 5, offersCount: 2,
    target: 220000, lowest: 198500, currency: "₪",
    daysOpen: 2, deadline: { he: "20 ביוני", en: "Jun 20" }, quantity: { he: "45 יח׳", en: "45 units" },
    requester: { he: "דניאל כהן · IT", en: "Daniel Cohen · IT" },
    spec: { he: ["מעבד i7 דור 14", "32GB זיכרון", "מסך 27 אינץ׳", "אחריות 3 שנים"], en: ["i7 14th gen", "32GB RAM", "27-inch monitor", "3-year warranty"] },
    offers: [
      { sid: "s3", price: 198500, delivery: { he: "9 יום", en: "9 days" }, status: "received", note: { he: "כולל התקנה", en: "Incl. setup" } },
      { sid: "s1", price: 211000, delivery: { he: "15 יום", en: "15 days" }, status: "received", note: { he: "—", en: "—" } },
    ],
    threads: {
      s3: thread(supById.s3, [
        { who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" }, time: { he: "30 מאי, 10:00", en: "May 30, 10:00" }, subject: { he: "בקשת הצעת מחיר — 45 עמדות מחשב", en: "RFQ — 45 workstations" }, body: { he: "שלום טק‑סנטר, נשמח להצעה ל‑45 עמדות i7/32GB עם מסכי 27 אינץ׳.", en: "Hello Tech-Center, we'd like a quote for 45 i7/32GB workstations with 27-inch monitors." } },
        { who: "supplier", from: { he: "טק‑סנטר", en: "Tech-Center" }, time: { he: "31 מאי, 09:12", en: "May 31, 09:12" }, subject: { he: "Re: הצעת מחיר", en: "Re: Quote" }, body: { he: "שלום, 198,500 ₪ כולל התקנה והגדרה. אספקה 9 ימים, אחריות 3 שנים.", en: "Hello, ₪198,500 incl. setup and configuration. Delivery 9 days, 3-year warranty." } },
      ]),
      s1: thread(supById.s1, [
        { who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" }, time: { he: "30 מאי, 10:00", en: "May 30, 10:00" }, subject: { he: "בקשת הצעת מחיר — עמדות מחשב", en: "RFQ — workstations" }, body: { he: "שלום אופיס‑פלוס, מצורפת בקשה ל‑45 עמדות מחשב.", en: "Hello Office-Plus, attached is a request for 45 workstations." } },
        { who: "supplier", from: { he: "אופיס‑פלוס בע״מ", en: "Office-Plus Ltd." }, time: { he: "31 מאי, 13:40", en: "May 31, 13:40" }, subject: { he: "Re: הצעת מחיר", en: "Re: Quote" }, body: { he: "שלום, ההצעה שלנו 211,000 ₪, אספקה 15 יום.", en: "Hello, our offer is ₪211,000, delivery 15 days." } },
      ]),
    },
  },
  {
    id: "d3", ref: "PR‑2026‑039",
    title: { he: "שירותי ניקיון — חוזה שנתי", en: "Cleaning services — annual contract" },
    cat: { he: "ניקיון ואחזקה", en: "Cleaning & facility" },
    status: "awarded", contacted: 4, offersCount: 4,
    target: 144000, lowest: 132000, currency: "₪",
    daysOpen: 11, deadline: { he: "הושלם", en: "Completed" }, quantity: { he: "12 חודשים", en: "12 months" },
    requester: { he: "רונית אבני · תפעול", en: "Ronit Avni · Operations" },
    spec: { he: ["3 מבנים", "ניקיון יומי", "חומרים אקולוגיים"], en: ["3 sites", "Daily cleaning", "Eco materials"] },
    offers: [
      { sid: "s4", price: 132000, delivery: { he: "מיידי", en: "Immediate" }, status: "winner", note: { he: "חוזה נחתם", en: "Contract signed" } },
    ],
    threads: {
      s4: thread(supById.s4, [
        { who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" }, time: { he: "18 מאי, 11:00", en: "May 18, 11:00" }, subject: { he: "בקשת הצעת מחיר — ניקיון שנתי", en: "RFQ — annual cleaning" }, body: { he: "שלום גרין‑קלין, נשמח להצעה לחוזה ניקיון שנתי ל‑3 מבנים.", en: "Hello Green-Clean, we'd like a quote for an annual cleaning contract for 3 sites." } },
        { who: "supplier", from: { he: "גרין‑קלין", en: "Green-Clean" }, time: { he: "19 מאי, 10:15", en: "May 19, 10:15" }, subject: { he: "Re: הצעת מחיר", en: "Re: Quote" }, body: { he: "שלום, 11,000 ₪ לחודש, סה״כ 132,000 ₪ לשנה. חומרים אקולוגיים בלבד.", en: "Hello, ₪11,000/month, total ₪132,000/year. Eco materials only." } },
      ]),
    },
  },
  {
    id: "d4", ref: "PR‑2026‑052",
    title: { he: "מיתוג ושילוט למשרד חדש", en: "Branding & signage for new office" },
    cat: { he: "דפוס ומיתוג", en: "Print & branding" },
    status: "open", contacted: 0, offersCount: 0,
    target: 38000, lowest: null, currency: "₪",
    daysOpen: 1, deadline: { he: "28 ביוני", en: "Jun 28" }, quantity: { he: "פרויקט", en: "Project" },
    requester: { he: "יעל שרון · שיווק", en: "Yael Sharon · Marketing" },
    spec: { he: ["שילוט חוץ ופנים", "מדבקות זכוכית", "התקנה כלולה"], en: ["Exterior & interior signage", "Glass decals", "Installation included"] },
    offers: [], threads: {},
  },
  {
    id: "d5", ref: "PR‑2026‑044",
    title: { he: "ציוד בטיחות למחסן", en: "Safety equipment for warehouse" },
    cat: { he: "ציוד בטיחות", en: "Safety equipment" },
    status: "sourcing", contacted: 3, offersCount: 1,
    target: 26000, lowest: 24300, currency: "₪",
    daysOpen: 3, deadline: { he: "16 ביוני", en: "Jun 16" }, quantity: { he: "סט מלא", en: "Full set" },
    requester: { he: "אבי מזרחי · בטיחות", en: "Avi Mizrahi · Safety" },
    spec: { he: ["גילוי אש", "ערכות עזרה ראשונה", "שילוט חירום"], en: ["Fire detection", "First-aid kits", "Emergency signage"] },
    offers: [
      { sid: "s6", price: 24300, delivery: { he: "7 יום", en: "7 days" }, status: "received", note: { he: "כולל התקנה", en: "Incl. install" } },
    ],
    threads: {
      s6: thread(supById.s6, [
        { who: "sapak", from: { he: "ספק (סוכן רכש)", en: "Sapak (agent)" }, time: { he: "29 מאי, 09:30", en: "May 29, 09:30" }, subject: { he: "בקשת הצעת מחיר — ציוד בטיחות", en: "RFQ — safety equipment" }, body: { he: "שלום סייפ‑גארד, נשמח להצעה לסט ציוד בטיחות מלא למחסן.", en: "Hello Safe-Guard, we'd like a quote for a full warehouse safety set." } },
        { who: "supplier", from: { he: "סייפ‑גארד", en: "Safe-Guard" }, time: { he: "30 מאי, 12:10", en: "May 30, 12:10" }, subject: { he: "Re: הצעת מחיר", en: "Re: Quote" }, body: { he: "שלום, הצעתנו 24,300 ₪ כולל התקנה. אספקה 7 ימים.", en: "Hello, our offer is ₪24,300 incl. installation. Delivery 7 days." } },
      ]),
    },
  },
];

window.SAPAK_DATA = { SUPPLIERS, DEALS, supById };
