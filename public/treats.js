/* ขนมทุกชิ้นวาดเป็น SVG เส้นดินสอ — ใช้ร่วมกันทั้งหน้าร้านและหลังบ้าน */
const INK = "#6b4a3a";
const S = `stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;

let PLAIN = false;
const face = (cx, cy, s = 1) => PLAIN ? "" : `
  <g class="face">
    <ellipse cx="${cx - 14 * s}" cy="${cy + 5 * s}" rx="${4.6 * s}" ry="${2.6 * s}" fill="#f7a3a8" opacity=".7"/>
    <ellipse cx="${cx + 14 * s}" cy="${cy + 5 * s}" rx="${4.6 * s}" ry="${2.6 * s}" fill="#f7a3a8" opacity=".7"/>
    <g class="eyes">
      <circle cx="${cx - 8 * s}" cy="${cy}" r="${2.4 * s}" fill="${INK}"/>
      <circle cx="${cx + 8 * s}" cy="${cy}" r="${2.4 * s}" fill="${INK}"/>
      <circle cx="${cx - 7.2 * s}" cy="${cy - 0.9 * s}" r="${0.8 * s}" fill="#fff"/>
      <circle cx="${cx + 8.8 * s}" cy="${cy - 0.9 * s}" r="${0.8 * s}" fill="#fff"/>
    </g>
    <g class="happy" fill="none" ${S} stroke-width="2">
      <path d="M${cx - 11 * s} ${cy + 1 * s} q${3 * s} ${-4 * s} ${6 * s} 0"/>
      <path d="M${cx + 5 * s} ${cy + 1 * s} q${3 * s} ${-4 * s} ${6 * s} 0"/>
    </g>
    <path d="M${cx - 4 * s} ${cy + 3.6 * s} q${2 * s} ${2.6 * s} ${4 * s} 0 q${2 * s} ${2.6 * s} ${4 * s} 0" fill="none" ${S} stroke-width="1.8"/>
  </g>`;

const shine = (cx, cy, rx, ry) =>
  `<ellipse class="shine" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".55"/>`;

const strawberry = (x, y, s = 1, r = 0) => `
  <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <path d="M0 10 C-9 4 -8 -6 0 -5 C8 -6 9 4 0 10 Z" fill="#f26d72" ${S}/>
    <path d="M-5 -5 L-2 -9 L0 -6 L2 -9 L5 -5" fill="#8cc68a" ${S} stroke-width="1.8"/>
    <circle cx="-3" cy="0" r=".8" fill="#ffe7a8"/><circle cx="3" cy="1" r=".8" fill="#ffe7a8"/><circle cx="0" cy="4" r=".8" fill="#ffe7a8"/>
  </g>`;

const cream = (x, y, s = 1) => `
  <path transform="translate(${x} ${y}) scale(${s})" d="M-13 4 Q-15 -4 -7 -5 Q-5 -12 1 -9 Q9 -12 10 -4 Q16 -1 13 5 Q0 8 -13 4 Z" fill="#fffaf2" ${S}/>`;

const TREATS = {
  cupcake: () => `
    <path d="M24 72 L33 106 Q60 111 87 106 L96 72 Z" fill="#f6d39c" ${S}/>
    <g fill="none" stroke="${INK}" stroke-width="1.5" opacity=".5" stroke-linecap="round">
      <path d="M38 77 L43 104"/><path d="M49 77 L52 106"/><path d="M60 77 L60 107"/><path d="M71 77 L68 106"/><path d="M82 77 L77 104"/>
    </g>
    <path d="M22 74 Q20 48 34 40 L31 20 Q41 24 47 33 Q60 29 73 33 Q79 24 89 20 L86 40 Q100 48 98 74 Q60 82 22 74 Z" fill="#f1bf86" ${S}/>
    <path d="M35 36 L33.5 26 Q39 29 42 33" fill="#f7a8a8"/><path d="M85 36 L86.5 26 Q81 29 78 33" fill="#f7a8a8"/>
    <ellipse cx="60" cy="64" rx="17" ry="11" fill="#fff4e6"/>
    ${shine(42, 48, 7, 3.5)}
    ${face(60, 57)}
    ${cream(60, 33, 0.8)}
    ${strawberry(60, 22, 0.9)}`,

  toast: () => `
    <path d="M24 106 L24 54 Q14 30 40 27 Q60 22 80 27 Q106 30 96 54 L96 106 Q60 110 24 106 Z" fill="#fff6e6" ${S}/>
    <path d="M30 102 L30 55 Q22 36 41 33 Q60 29 79 33 Q98 36 90 55 L90 102" fill="none" stroke="#f0cd96" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="29" cy="48" rx="8" ry="17" transform="rotate(22 29 48)" fill="#ebc48f" ${S}/>
    <ellipse cx="91" cy="48" rx="8" ry="17" transform="rotate(-22 91 48)" fill="#ebc48f" ${S}/>
    ${shine(46, 38, 8, 3)}
    ${face(60, 52)}
    <path d="M44 80 Q42 70 54 71 Q62 64 70 72 Q80 72 77 82 Q80 92 68 92 Q60 98 52 92 Q40 92 44 80 Z" fill="#fffdf8" ${S}/>
    <circle cx="60" cy="81" r="7.5" fill="#ffc94a" ${S}/>
    <circle cx="57.5" cy="78.5" r="2" fill="#fff" opacity=".8"/>`,

  melonpan: () => `
    <path d="M28 70 L29 42 L52 57 Z" fill="#f9dc88" ${S}/>
    <path d="M92 70 L91 42 L68 57 Z" fill="#f9dc88" ${S}/>
    <ellipse cx="60" cy="80" rx="42" ry="28" fill="#fbe190" ${S}/>
    <g fill="none" stroke="#e2b350" stroke-width="1.6" stroke-linecap="round">
      <path d="M30 64 Q50 82 64 106"/><path d="M45 56 Q66 74 84 101"/><path d="M66 53 Q84 66 98 86"/>
      <path d="M90 64 Q70 82 56 106"/><path d="M75 56 Q54 74 36 101"/><path d="M54 53 Q36 66 22 86"/>
    </g>
    ${shine(40, 66, 10, 4.5)}
    ${face(60, 82)}`,

  bun: () => `
    <circle cx="36" cy="54" r="11" fill="#e3a45f" ${S}/><circle cx="36" cy="54" r="5" fill="#f4cb9c"/>
    <circle cx="84" cy="54" r="11" fill="#e3a45f" ${S}/><circle cx="84" cy="54" r="5" fill="#f4cb9c"/>
    <path d="M22 96 Q18 54 60 52 Q102 54 98 96 Q96 108 60 108 Q24 108 22 96 Z" fill="#e7a862" ${S}/>
    <path d="M36 66 Q60 56 84 66" fill="none" stroke="#f7d4a4" stroke-width="5" stroke-linecap="round" opacity=".75"/>
    <ellipse cx="53" cy="61" rx="2.2" ry="1.2" fill="#fff6e1" transform="rotate(-20 53 61)"/>
    <ellipse cx="66" cy="60" rx="2.2" ry="1.2" fill="#fff6e1" transform="rotate(25 66 60)"/>
    <ellipse cx="60" cy="65" rx="2.2" ry="1.2" fill="#fff6e1"/>
    <ellipse cx="60" cy="90" rx="15" ry="9" fill="#f8dcb6"/>
    ${face(60, 83)}`,

  daifuku: () => `
    <path d="M44 64 Q32 32 41 21 Q53 22 53 62 Z" fill="#fff4f4" ${S}/>
    <path d="M46 56 Q40 36 43 28 Q48 32 49 56" fill="#f8bcc4"/>
    <path d="M67 62 Q67 22 79 21 Q88 32 76 64 Z" fill="#fff4f4" ${S}/>
    <path d="M71 56 Q72 32 77 28 Q80 36 74 56" fill="#f8bcc4"/>
    <path d="M18 96 Q16 62 60 60 Q104 62 102 96 Q100 108 60 108 Q20 108 18 96 Z" fill="#fff1f1" ${S}/>
    <g fill="#fff" opacity=".9"><circle cx="34" cy="76" r="1.2"/><circle cx="86" cy="80" r="1.2"/><circle cx="46" cy="70" r="1"/><circle cx="78" cy="70" r="1"/></g>
    ${shine(38, 72, 9, 4)}
    ${face(60, 84)}
    ${strawberry(92, 66, 0.75, 25)}`,

  shortcake: () => `
    <path d="M20 58 L56 42 L102 52 L98 60 Z" fill="#fffaf1" ${S}/>
    <path d="M20 58 L98 60 L98 104 Q60 108 20 104 Z" fill="#fde3a6" ${S}/>
    <path d="M21 73 L97 75" stroke="#fffaf1" stroke-width="6" stroke-linecap="round"/>
    <path d="M21 92 L97 93" stroke="#fffaf1" stroke-width="6" stroke-linecap="round"/>
    <g fill="#f37b7b"><circle cx="31" cy="73" r="3.4"/><circle cx="88" cy="75" r="3.4"/><circle cx="34" cy="92" r="3.4"/><circle cx="86" cy="93" r="3.4"/></g>
    ${face(60, 81)}
    ${cream(62, 47, 0.9)}
    ${strawberry(62, 37, 0.95)}`,

  croissant: () => `
    <path d="M10 92 Q12 74 28 68 Q42 54 60 54 Q78 54 92 68 Q108 74 110 92 Q100 100 90 92 Q84 98 76 92 L44 92 Q36 98 30 92 Q20 100 10 92 Z" fill="#e9a352" ${S}/>
    <g fill="none" stroke="#b97536" stroke-width="1.8" stroke-linecap="round">
      <path d="M28 68 Q35 80 30 92"/><path d="M43 58 Q48 76 44 92"/><path d="M77 58 Q72 76 76 92"/><path d="M92 68 Q85 80 90 92"/>
    </g>
    <ellipse cx="47" cy="60" rx="5" ry="9" transform="rotate(40 47 60)" fill="#d98d3f" ${S}/>
    <ellipse cx="73" cy="60" rx="5" ry="9" transform="rotate(-40 73 60)" fill="#d98d3f" ${S}/>
    ${shine(56, 62, 8, 2.5)}
    ${face(60, 75, 0.9)}`,

  pudding: () => `
    <ellipse cx="60" cy="105" rx="42" ry="7" fill="#fdfbff" ${S}/>
    <path d="M30 103 L38 58 Q60 50 82 58 L90 103 Q60 109 30 103 Z" fill="#fde29a" ${S}/>
    <path d="M38 58 Q60 50 82 58 L84 68 Q80 74 76 68 Q70 76 64 70 Q58 78 52 70 Q46 76 42 68 Q38 72 36 68 Z" fill="#c97a3c" ${S}/>
    ${shine(44, 80, 3, 8)}
    ${face(60, 86)}
    ${cream(60, 50, 0.85)}
    <path d="M63 36 Q66 26 75 23" fill="none" ${S} stroke-width="2"/>
    <circle cx="62" cy="40" r="6" fill="#e8505b" ${S}/>
    <circle cx="60" cy="38" r="1.6" fill="#fff" opacity=".8"/>`,
  rollcake: () => `
    <ellipse cx="60" cy="78" rx="38" ry="30" fill="#f3b866" ${S}/>
    <ellipse cx="60" cy="78" rx="32" ry="25" fill="#fde9bd"/>
    <path d="M60 78 Q66 72 70 80 Q72 92 58 92 Q42 90 44 74 Q48 58 66 60 Q84 64 84 80" fill="none" stroke="#fffaf2" stroke-width="6" stroke-linecap="round"/>
    <path d="M60 78 Q66 72 70 80 Q72 92 58 92 Q42 90 44 74 Q48 58 66 60 Q84 64 84 80" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".35"/>
    <path d="M30 56 L26 40 L42 50 Z" fill="#f3b866" ${S}/>
    <path d="M90 56 L94 40 L78 50 Z" fill="#f3b866" ${S}/>
    ${shine(40, 58, 8, 3)}
    ${face(60, 80, 0.85)}`,

  creampuff: () => `
    <path d="M18 84 Q16 66 34 64 L86 64 Q104 66 102 84 Q100 104 60 106 Q20 104 18 84 Z" fill="#eab36b" ${S}/>
    <path d="M18 72 Q30 80 40 72 Q50 82 60 72 Q70 82 80 72 Q90 80 102 72 L100 66 L20 66 Z" fill="#fffaf2" ${S}/>
    <path d="M22 66 Q16 44 38 40 Q46 26 62 32 Q78 26 86 40 Q106 44 98 66 Q60 72 22 66 Z" fill="#f1c27e" ${S}/>
    <g fill="#fff" opacity=".9"><circle cx="44" cy="44" r="1.6"/><circle cx="58" cy="38" r="1.4"/><circle cx="74" cy="44" r="1.6"/><circle cx="66" cy="50" r="1.2"/><circle cx="50" cy="52" r="1.2"/></g>
    ${face(60, 88, 0.9)}`,

  choco: () => `
    <path d="M22 62 L60 50 L100 60 L62 74 Z" fill="#8a5a3c" ${S}/>
    <path d="M22 62 L62 74 L62 106 L22 96 Z" fill="#7a4a30" ${S}/>
    <path d="M62 74 L100 60 L100 92 L62 106 Z" fill="#6a3e28" ${S}/>
    <path d="M23 78 L61 89" stroke="#f3dcc0" stroke-width="3" stroke-linecap="round"/>
    <path d="M63 89 L99 77" stroke="#e8cdb0" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 52 L58 30 L70 50 Z" fill="#5a3320" ${S}/>
    <ellipse cx="60" cy="54" rx="10" ry="5" fill="#9b6a48" ${S}/>
    <g transform="translate(-18 6)">${face(60, 80, 0.75)}</g>`,
};
const TREAT_KEYS = Object.keys(TREATS);

function treatSvg(type, opts = {}) {
  const draw = TREATS[type] || TREATS.cupcake;
  PLAIN = !!opts.plain;
  const inner = draw();
  PLAIN = false;
  // วาดสองรอบ: รอบหลักกับ "เส้นร่าง" จางๆ เยื้องนิดหน่อย ให้ดูเหมือนดินสอ
  return `<svg class="treat-art" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <ellipse cx="60" cy="110" rx="38" ry="4" fill="#7b5a48" opacity=".12"/>
    <g class="body" filter="url(#pencil)">${inner}</g>
    <g class="ghost" filter="url(#pencil-ghost)" transform="translate(1.3 -0.9)">${inner}</g>
  </svg>`;
}


const TREAT_NAMES = {
  cupcake: "คัพเค้กชิบะ", toast: "ขนมปังหมาไข่ดาว", melonpan: "เมล่อนปังแมว", bun: "ซาลาเปาหมี",
  daifuku: "ไดฟุกุกระต่าย", shortcake: "ช็อตเค้ก", croissant: "ครัวซองต์", pudding: "พุดดิ้ง",
  rollcake: "โรลเค้กแมว", creampuff: "ชูครีม", choco: "เค้กช็อกโกแลต",
};
