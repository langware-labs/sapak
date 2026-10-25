// icons.jsx — clean line icons + Sapak brand mark
const Ic = ({ d, size = 20, sw = 1.6, fill = "none", ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...p}>
    {Array.isArray(d) ? d.map((dd, i) => <path key={i} d={dd} />) : <path d={d} />}
  </svg>
);

const Icons = {
  suppliers: (p) => <Ic d={["M3 7l9-4 9 4-9 4-9-4z", "M3 7v6l9 4 9-4V7", "M12 11v10"]} {...p} />,
  deals: (p) => <Ic d={["M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0l-7.2-7.2A2 2 0 012.8 12V5a2 2 0 012-2h7a2 2 0 011.4.6l7.2 7.2a2 2 0 010 2.6z", "M7.5 7.5h.01"]} {...p} />,
  grid: (p) => <Ic d={["M4 4h7v7H4z", "M13 4h7v7h-7z", "M13 13h7v7h-7z", "M4 13h7v7H4z"]} {...p} />,
  search: (p) => <Ic d={["M11 19a8 8 0 100-16 8 8 0 000 16z", "M21 21l-4.3-4.3"]} {...p} />,
  bell: (p) => <Ic d={["M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 01-3.4 0"]} {...p} />,
  settings: (p) => <Ic d={["M12 15a3 3 0 100-6 3 3 0 000 6z", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"]} {...p} />,
  help: (p) => <Ic d={["M12 22a10 10 0 100-20 10 10 0 000 20z", "M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3", "M12 17h.01"]} {...p} />,
  plus: (p) => <Ic d={["M12 5v14", "M5 12h14"]} {...p} />,
  arrowL: (p) => <Ic d={["M19 12H5", "M12 19l-7-7 7-7"]} {...p} />,
  arrowR: (p) => <Ic d={["M5 12h14", "M12 5l7 7-7 7"]} {...p} />,
  chevR: (p) => <Ic d="M9 18l6-6-6-6" {...p} />,
  chevD: (p) => <Ic d="M6 9l6 6 6-6" {...p} />,
  check: (p) => <Ic d="M20 6L9 17l-5-5" {...p} />,
  star: (p) => <Ic d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 18.6 5.7 21.4 7 14.6l-5-4.7 6.8-.8L12 2z" fill="currentColor" sw={0} {...p} />,
  clock: (p) => <Ic d={["M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 6v6l4 2"]} {...p} />,
  mail: (p) => <Ic d={["M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z", "M22 7l-10 6L2 7"]} {...p} />,
  send: (p) => <Ic d={["M22 2L11 13", "M22 2l-7 20-4-9-9-4 20-7z"]} {...p} />,
  whatsapp: (p) => <Ic d={["M21 11.5a8.5 8.5 0 01-12.6 7.4L3 21l2.2-5.3A8.5 8.5 0 1121 11.5z", "M8.5 9c.3 3 2.5 5.2 5.5 5.5"]} {...p} />,
  sparkle: (p) => <Ic d={["M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4L12 3z", "M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"]} fill="none" {...p} />,
  trend: (p) => <Ic d={["M3 17l6-6 4 4 7-7", "M17 8h4v4"]} {...p} />,
  users: (p) => <Ic d={["M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2", "M9 11a4 4 0 100-8 4 4 0 000 8", "M22 21v-2a4 4 0 00-3-3.9", "M16 3.1a4 4 0 010 7.8"]} {...p} />,
  shield: (p) => <Ic d={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M9 12l2 2 4-4"]} {...p} />,
  doc: (p) => <Ic d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M8 13h8", "M8 17h6"]} {...p} />,
  tag: (p) => <Ic d={["M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0l-7.2-7.2A2 2 0 012.8 12V5a2 2 0 012-2h7a2 2 0 011.4.6l7.2 7.2a2 2 0 010 2.6z", "M7.5 7.5h.01"]} {...p} />,
  google: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.06H2.18a11 11 0 000 9.88l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  ),
};

// Sapak brand mark — a flowing wave inside a soft tile (the tide that brings offers)
const Brand = ({ size = 32, color = "var(--accent)", mono = false }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="38" height="38" rx="11"
          fill={mono ? "currentColor" : color} opacity={mono ? 1 : 0.12} />
    <path d="M7 24c3.2 0 3.2-4 6.4-4s3.2 4 6.4 4 3.2-4 6.4-4 3.2 4 6.4 4"
          stroke={mono ? "currentColor" : color} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M9 16.5c2.6 0 2.6-3 5.2-3s2.6 3 5.2 3 2.6-3 5.2-3 2.6 3 5.2 3"
          stroke={mono ? "currentColor" : color} strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
  </svg>
);

window.Icons = Icons;
window.Brand = Brand;
