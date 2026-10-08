/* =========================================================
   ✎ แก้ข้อมูลของคุณตรงนี้ที่เดียวพอ
   treat ที่ใช้ได้: cupcake, toast, melonpan, bun, daifuku,
                   shortcake, croissant, pudding
   ========================================================= */
const CONFIG = {
  name: "SWEET LINKS",
  handle: "@yourname · ร้านขนมลิงก์ในฝัน",
  bio: "อบความฝันใหม่ทุกเช้า ☁ จิ้มขนมในตู้เพื่อไปหากันนะ",
  avatar: "", // ใส่ URL รูปโปรไฟล์ได้ ถ้าเว้นว่างจะเป็นน้องหมีขนมปัง
  links: [
    { title: "Instagram", note: "รูปน่ารักอยู่นี่!", price: "฿0 · ฟอลเลย", url: "https://instagram.com/", treat: "cupcake" },
    { title: "TikTok", note: "คลิปฮาๆ ทุกวัน", price: "฿0 · กดดู", url: "https://tiktok.com/", treat: "toast" },
    { title: "YouTube", note: "วิดีโอยาวๆ อุ่นๆ", price: "฿0 · ซับเลย", url: "https://youtube.com/", treat: "melonpan" },
    { title: "X / Twitter", note: "บ่นเรื่อยเปื่อย", price: "฿0 · ทักได้", url: "https://x.com/", treat: "bun" },
    { title: "LINE", note: "แชทกันมั้ย?", price: "฿0 · แอดเลย", url: "https://line.me/", treat: "daifuku" },
    { title: "ร้านของฉัน", note: "ของน่ารักขายอยู่", price: "฿ · ช้อปเลย", url: "https://shopee.co.th/", treat: "shortcake" },
    { title: "Facebook", note: "เพจหลักจ้า", price: "฿0 · ไลก์ที", url: "https://facebook.com/", treat: "croissant" },
    { title: "อีเมลหาฉัน", note: "ส่งจดหมายมา~", price: "฿0 · เขียนเลย", url: "mailto:hello@example.com", treat: "pudding" },
  ],
  fortunes: [
    "วันนี้จะมีเรื่องดีๆ ฟูขึ้นมาเหมือนแป้งขนมปัง",
    "คนที่คิดถึงเธอ กำลังคิดถึงเธออยู่เหมือนกันนะ",
    "พักก่อนก็ได้ ขนมยังต้องรอให้ขึ้นฟูเลย",
    "เธอหวานกว่าครีมในตู้ทุกชิ้นเลย",
    "ความพยายามของเธอกำลังอบอยู่ อีกนิดเดียวสุกแล้ว",
    "วันนี้เหมาะกับการกินของอร่อยแบบไม่ต้องรู้สึกผิด",
    "จะมีข่าวดีส่งมาแบบเซอร์ไพรส์ภายในสัปดาห์นี้",
    "ยิ้มหน่อย น้องขนมในตู้ยิ้มให้อยู่นะ",
  ],
};

/* ---------- ตัวช่วยวาดขนม (SVG เส้นดินสอ) ---------- */
const INK = "#7b5a48";
const S = `stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;

const face = (cx, cy, s = 1) => `
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
};
const TREAT_KEYS = Object.keys(TREATS);

function treatSvg(type) {
  const draw = TREATS[type] || TREATS.cupcake;
  const inner = draw();
  // วาดสองรอบ: รอบหลักกับ "เส้นร่าง" จางๆ เยื้องนิดหน่อย ให้ดูเหมือนดินสอ
  return `<svg class="treat-art" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <ellipse cx="60" cy="110" rx="38" ry="4" fill="#7b5a48" opacity=".12"/>
    <g class="body" filter="url(#pencil)">${inner}</g>
    <g class="ghost" filter="url(#pencil-ghost)" transform="translate(1.3 -0.9)">${inner}</g>
  </svg>`;
}

const SPARKLE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z"/></svg>`;

/* ---------- ประกอบหน้า ---------- */
const $ = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderProfile() {
  $("sign").textContent = CONFIG.name;
  $("handle").textContent = CONFIG.handle;
  $("bio").textContent = CONFIG.bio;
  $("avatar").innerHTML = CONFIG.avatar
    ? `<img src="${esc(CONFIG.avatar)}" alt="รูปโปรไฟล์">`
    : treatSvg("bun");
}

let lastPerRow = 0;
function renderShelves() {
  const perRow = innerWidth < 360 ? 2 : 3;
  if (perRow === lastPerRow) return;
  lastPerRow = perRow;
  const wrap = $("shelves");
  wrap.innerHTML = "";
  CONFIG.links.forEach((link, i) => {
    if (i % perRow === 0) {
      const shelf = document.createElement("div");
      shelf.className = "shelf";
      shelf.innerHTML = `<div class="row" style="--n:${perRow}"></div><div class="plank"></div>`;
      wrap.appendChild(shelf);
    }
    const row = wrap.lastElementChild.querySelector(".row");
    const a = document.createElement("a");
    const isWeb = /^https?:/i.test(link.url);
    a.className = "treat";
    a.href = link.url;
    if (isWeb) { a.target = "_blank"; a.rel = "noopener"; }
    a.setAttribute("aria-label", `${link.title} — ${link.note || ""}`);
    a.style.setProperty("--d", `${(-i * 0.73).toFixed(2)}s`);
    a.style.setProperty("--r", `${rand(-4, 4).toFixed(1)}deg`);
    a.innerHTML = `
      <span class="bubble">${esc(link.note || "ไปกันเลย!")}</span>
      ${treatSvg(link.treat || TREAT_KEYS[i % TREAT_KEYS.length])}
      <span class="tag"><b>${esc(link.title)}</b><small>${esc(link.price || "฿0")}</small></span>`;
    row.appendChild(a);
  });
}

function renderMenu() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  $("menuList").innerHTML = CONFIG.links.map((l, i) => {
    const isWeb = /^https?:/i.test(l.url);
    return `<li><a href="${esc(l.url)}"${isWeb ? ' target="_blank" rel="noopener"' : ""}>
      <span class="letter">${letters[i] || "•"}.</span><span class="m-title">${esc(l.title)}</span></a></li>`;
  }).join("");
}

function renderSky() {
  const sky = $("sky");
  const n = innerWidth < 600 ? 14 : 24;
  let html = "";
  for (let i = 0; i < n; i++) {
    html += `<span class="twinkle" style="left:${rand(2, 96)}%;top:${rand(2, 96)}%;--s:${rand(8, 20).toFixed(0)}px;--t:${rand(2.4, 5).toFixed(1)}s;--d:${(-rand(0, 5)).toFixed(1)}s">${SPARKLE}</span>`;
  }
  sky.innerHTML = html;
}

/* ---------- ลูกเล่น ---------- */
function burst(x, y, count = 12) {
  if (reduceMotion) return;
  const colors = ["#f7c76b", "#f4a7b4", "#c9d7ee", "#fff", "#e7a862"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const isStar = i % 3 !== 0;
    p.className = isStar ? "particle star" : "particle crumb";
    if (isStar) p.innerHTML = SPARKLE;
    const ang = rand(0, Math.PI * 2), dist = rand(30, 80);
    p.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist - 20}px;--c:${colors[i % colors.length]};--sz:${rand(8, 16)}px`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

$("shelves").addEventListener("click", (e) => {
  const t = e.target.closest(".treat");
  if (!t) return;
  burst(e.clientX || t.getBoundingClientRect().left + 40, e.clientY || t.getBoundingClientRect().top + 40);
  t.classList.remove("squish");
  void t.offsetWidth;
  t.classList.add("squish");
});

// ประกายดาวตามเมาส์ (เฉพาะคอม)
if (matchMedia("(pointer: fine)").matches && !reduceMotion) {
  let last = 0;
  addEventListener("pointermove", (e) => {
    const now = performance.now();
    if (now - last < 70) return;
    last = now;
    const s = document.createElement("span");
    s.className = "trail";
    s.innerHTML = SPARKLE;
    s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--sz:${rand(6, 12)}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  });
}

// กริ่ง → ขนมเสี่ยงทาย
const fortune = $("fortune");
$("bell").addEventListener("click", (e) => {
  const bell = e.currentTarget;
  bell.classList.remove("ring");
  void bell.offsetWidth;
  bell.classList.add("ring");
  const type = TREAT_KEYS[Math.floor(Math.random() * TREAT_KEYS.length)];
  $("fortuneArt").innerHTML = treatSvg(type);
  $("fortuneText").textContent = CONFIG.fortunes[Math.floor(Math.random() * CONFIG.fortunes.length)];
  setTimeout(() => {
    fortune.hidden = false;
    $("fortuneClose").focus();
  }, reduceMotion ? 0 : 420);
});
const closeFortune = () => { fortune.hidden = true; $("bell").focus(); };
$("fortuneClose").addEventListener("click", closeFortune);
fortune.addEventListener("click", (e) => { if (e.target === fortune) closeFortune(); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !fortune.hidden) closeFortune(); });

// โคมไฟ → โหมดกลางคืนฟุ้งๆ
const root = document.documentElement;
try {
  const saved = localStorage.getItem("sweet-theme");
  if (saved) root.dataset.theme = saved;
} catch (_) {}
$("lamp").addEventListener("click", (e) => {
  const isDark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = isDark ? "light" : "dark";
  try { localStorage.setItem("sweet-theme", root.dataset.theme); } catch (_) {}
  const lamp = e.currentTarget;
  lamp.classList.remove("pulled");
  void lamp.offsetWidth;
  lamp.classList.add("pulled");
});

renderProfile();
renderShelves();
renderMenu();
renderSky();
addEventListener("resize", renderShelves);
