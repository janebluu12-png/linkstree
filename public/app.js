/* =========================================================
   ร้านขนมลิงก์ในฝัน — ข้อมูลทั้งหมดแก้ได้ที่หน้า /admin
   (ถ้ายังไม่ได้ deploy บน Cloudflare จะอ่านจาก config.json)
   ========================================================= */
const $ = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SPARKLE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z"/></svg>`;

let CONFIG = null;

// อนุญาตเฉพาะ http(s), mailto, tel
function safeUrl(v) {
  const s = String(v || "").trim();
  if (/^mailto:\S+$/i.test(s) || /^tel:[+\d][\d\s()-]*$/i.test(s)) return s;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : "#";
  } catch { return "#"; }
}
const linkAttrs = (url) => {
  const u = safeUrl(url);
  return `href="${esc(u)}"${/^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : ""}`;
};

async function loadConfig() {
  for (const src of ["/api/config", "config.json"]) {
    try {
      const res = await fetch(src, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      if (data && Array.isArray(data.links)) return data;
    } catch (_) { /* ลองแหล่งถัดไป */ }
  }
  return null;
}

/* ---------- หมวดหมู่ ---------- */
function groups() {
  const cats = (CONFIG.categories || []).map((c) => ({ ...c, links: CONFIG.links.filter((l) => l.category === c.id) }));
  const loose = CONFIG.links.filter((l) => !cats.some((c) => c.id === l.category));
  if (loose.length) cats.push({ id: "other", name: "อื่นๆ", note: "ของจุกจิกน่ารัก", treat: "bun", links: loose });
  return cats.filter((c) => c.links.length);
}
const isCategoryMode = () => CONFIG.mode !== "simple";

/* ---------- โปรไฟล์ ---------- */
function renderProfile() {
  const p = CONFIG.profile || {};
  $("sign").textContent = p.name || "SWEET LINKS";
  $("handle").textContent = p.handle || "";
  $("handle").hidden = !p.handle;
  $("bio").textContent = p.bio || "";
  $("bio").hidden = !p.bio;
  const avatar = p.avatar && safeUrl(p.avatar) !== "#" ? safeUrl(p.avatar) : "";
  $("avatar").innerHTML = avatar ? `<img src="${esc(avatar)}" alt="รูปโปรไฟล์">` : treatSvg("bun");
  document.title = `${p.name || "SWEET LINKS"} · ร้านขนมลิงก์ในฝัน`;
  $("hintText").textContent = isCategoryMode()
    ? "จิ้มกลุ่มขนม เพื่อซูมเข้าไปดูในหมวดนั้น"
    : "จิ้มขนมที่ชอบได้เลย เดี๋ยวพาไปหาเอง";
}

/* ---------- ตู้ขนม (มุมเฉียงแบบตู้หน้าร้าน) ---------- */
let lastLayout = "";
function renderCase() {
  const inner = $("case").clientWidth - 70;
  const cat = isCategoryMode();
  const perShelf = cat ? (inner >= 270 ? 2 : 1) : (inner >= 620 ? 5 : inner >= 440 ? 4 : 3);
  const key = `${cat}-${perShelf}`;
  if (key === lastLayout) return fitCase();
  lastLayout = key;

  const items = cat ? groups() : CONFIG.links;
  const wrap = $("shelves");
  $("case").setAttribute("aria-label", cat ? "ตู้ขนม — แต่ละกลุ่มคือหนึ่งหมวด" : "ตู้ขนม — แต่ละชิ้นคือลิงก์");
  if (!items.length) {
    wrap.innerHTML = `<p class="empty">ตู้ยังว่างอยู่เลย ไปเติมขนมที่หน้าหลังบ้านได้นะ</p>`;
    return fitCase();
  }
  let html = "";
  items.forEach((item, i) => {
    if (i % perShelf === 0) html += `${i ? "</div><div class=\"plank\"></div></div>" : ""}<div class="shelf"><div class="row${cat ? " group-row" : ""}" style="--n:${perShelf}">`;
    html += cat ? groupHtml(item, i) : treatLinkHtml(item, i);
  });
  html += `</div><div class="plank"></div></div>`;
  wrap.innerHTML = html;
  fitCase();
}

function treatLinkHtml(link, i) {
  return `<a class="treat" ${linkAttrs(link.url)} aria-label="${esc(link.title)}${link.note ? " — " + esc(link.note) : ""}"
      style="--d:${(-i * 0.73).toFixed(2)}s;--r:${rand(-4, 4).toFixed(1)}deg">
    <span class="bubble">${esc(link.note || "ไปกันเลย!")}</span>
    ${treatSvg(link.treat)}
    <span class="tag"><b>${esc(link.title)}</b><small>${esc(link.price || "฿0")}</small></span>
  </a>`;
}

function groupHtml(g, i) {
  // ขนมหน้าตาเหมือนกันวางเรียงเป็นกลุ่ม แบบตู้ในร้านจริง
  const n = Math.min(3, Math.max(2, g.links.length));
  const arts = Array.from({ length: n }, (_, k) => treatSvg(g.treat || g.links[0].treat)).join("");
  return `<button type="button" class="group" data-cat="${esc(g.id)}" style="--d:${(-i * 0.9).toFixed(2)}s;--r:${rand(-3, 3).toFixed(1)}deg;--k:${n}"
      aria-label="เปิดหมวด ${esc(g.name)} (${g.links.length} ลิงก์)">
    <span class="bubble">${esc(g.note || "ดูทั้งหมด")} 🔍</span>
    <span class="group-art">${arts}</span>
    <span class="tag"><b>${esc(g.name)}</b><small>${g.links.length} ชิ้น · จิ้มเพื่อซูม</small></span>
  </button>`;
}

// วาดกรอบตู้ (เสาเอียง + กระจกโค้ง) ให้พอดีกับขนาดตู้ และยืดชั้นไปชนเสา
function fitCase() {
  const box = $("case");
  const w = box.clientWidth, h = box.clientHeight;
  if (!w || !h) return;
  const lt = 34, top = 10;
  const leftX = (y) => 6 + (lt - 6) * Math.max(0, (h - y) / (h - 60));
  const rightX = (y) => (y < 110 ? w - 30 : w - 30 + 22 * ((y - 110) / (h - 110)));
  const outer = `M6 ${h} L${lt} 60 Q${lt + 2} ${top} ${lt + 46} ${top} L${w - 130} ${top} C${w - 60} ${top} ${w - 34} ${top + 30} ${w - 30} 110 L${w - 8} ${h}`;
  $("caseBack").setAttribute("viewBox", `0 0 ${w} ${h}`);
  $("caseBack").innerHTML = `<path class="glass-fill" d="${outer} Z"/>
    <path class="streak" d="M${w * 0.62} ${top + 14} L${w * 0.66} ${top + 14} L${w * 0.44} ${h} L${w * 0.4} ${h} Z"/>
    <path class="streak thin" d="M${w * 0.69} ${top + 14} L${w * 0.7} ${top + 14} L${w * 0.49} ${h} L${w * 0.48} ${h} Z"/>
    <path class="glass-edge" fill="none" d="M${lt + 64} ${top + 14} L${w - 136} ${top + 14} M${lt + 64} ${top + 14} L${lt + 50} ${h}"/>`;
  $("caseFront").setAttribute("viewBox", `0 0 ${w} ${h}`);
  $("caseFront").innerHTML = `
    <g filter="url(#wobble)" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path class="frame" d="${outer}"/>
    </g>`;
  const boxTop = box.getBoundingClientRect().top;
  box.querySelectorAll(".plank").forEach((pl) => {
    const r = pl.getBoundingClientRect();
    const y = r.top - boxTop;
    const parent = pl.parentElement.getBoundingClientRect();
    pl.style.marginLeft = `${leftX(y) - (parent.left - box.getBoundingClientRect().left)}px`;
    pl.style.marginRight = `${(parent.right - box.getBoundingClientRect().left) - rightX(y)}px`;
  });
}

/* ---------- เมนูบนโต๊ะ (รายชื่อแบบตัวหนังสือ) ---------- */
function renderMenu() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let n = 0;
  const li = (l) => `<li><a ${linkAttrs(l.url)}><span class="letter">${letters[n++] || "•"}.</span><span class="m-title">${esc(l.title)}</span></a></li>`;
  const el = $("menuList");
  if (isCategoryMode()) {
    el.classList.add("by-cat");
    el.innerHTML = groups().map((g) => `<div class="menu-group"><h3>${esc(g.name)}</h3><ol class="menu-list">${g.links.map(li).join("")}</ol></div>`).join("");
  } else {
    el.classList.remove("by-cat");
    el.innerHTML = `<ol class="menu-list">${CONFIG.links.map(li).join("")}</ol>`;
  }
}

/* ---------- มุมซูม (ชั้นขนมระยะใกล้) ---------- */
const closeup = $("closeup");
let pushedHash = false;
let lastOrigin = null;

function openCategory(id, originEl, fromHistory = false) {
  const g = groups().find((x) => x.id === id);
  if (!g) return;
  const r = originEl ? originEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const ox = r.left + r.width / 2, oy = r.top + r.height / 2;
  lastOrigin = originEl;

  $("cuTitle").textContent = g.name;
  $("cuNote").textContent = g.note || "";
  const per = innerWidth >= 720 ? 3 : 2;
  let html = "";
  g.links.forEach((l, i) => {
    if (i % per === 0) html += `${i ? "</div><div class=\"cu-plank\"></div></div>" : ""}<div class="cu-shelf"><div class="cu-row" style="--n:${per}">`;
    html += `<a class="cu-item" ${linkAttrs(l.url)} style="--d:${(-i * 0.6).toFixed(2)}s;--r:${rand(-3, 3).toFixed(1)}deg"
        aria-label="${esc(l.title)}${l.note ? " — " + esc(l.note) : ""}">
      <span class="bubble">${esc(l.note || "ไปกันเลย!")}</span>
      <span class="cu-art">
        <span class="side">${treatSvg(l.treat, { plain: true })}</span>
        <span class="hero">${treatSvg(l.treat)}</span>
        <span class="side">${treatSvg(l.treat, { plain: true })}</span>
      </span>
      <span class="tray" aria-hidden="true"></span>
      <span class="tag"><b>${esc(l.title)}</b><small>${esc(l.price || "฿0")}</small></span>
    </a>`;
  });
  html += `</div><div class="cu-plank"></div></div>`;
  $("cuShelves").innerHTML = html;

  closeup.style.setProperty("--ox", `${ox}px`);
  closeup.style.setProperty("--oy", `${oy}px`);
  const disp = $("display").getBoundingClientRect();
  $("display").style.transformOrigin = `${ox - disp.left}px ${oy - disp.top}px`;
  closeup.hidden = false;
  closeup.scrollTop = 0;
  document.body.classList.add("zoomed");
  closeup.classList.remove("closing");
  void closeup.offsetWidth;
  closeup.classList.add("opening");
  $("cuBack").focus({ preventScroll: true });

  if (!fromHistory && location.hash !== `#/${id}`) {
    history.pushState({ cat: id }, "", `#/${id}`);
    pushedHash = true;
  }
}

function closeCategory(fromHistory = false) {
  if (closeup.hidden) return;
  if (!fromHistory && pushedHash) { history.back(); return; } // popstate จะเรียกกลับมาที่นี่
  if (!fromHistory && location.hash) history.replaceState(null, "", location.pathname + location.search);
  pushedHash = false;
  document.body.classList.remove("zoomed");
  closeup.classList.remove("opening");
  closeup.classList.add("closing");
  setTimeout(() => {
    closeup.hidden = true;
    closeup.classList.remove("closing");
  }, reduceMotion ? 0 : 380);
  if (lastOrigin && document.body.contains(lastOrigin)) lastOrigin.focus({ preventScroll: true });
}

function syncFromHash() {
  const m = location.hash.match(/^#\/([\w-]+)$/);
  if (m && isCategoryMode()) {
    const el = document.querySelector(`.group[data-cat="${CSS.escape(m[1])}"]`);
    openCategory(m[1], el, true);
  } else {
    closeCategory(true);
  }
}

/* ---------- ฉากคาเฟ่ ---------- */
function renderBunting() {
  const W = innerWidth, sag = 34, n = Math.max(6, Math.round(W / 46));
  const colors = ["#f6c2c8", "#fde29a", "#c9d7ee", "#fffaf2"];
  const y = (t) => 6 + 4 * sag * t * (1 - t);
  let flags = "";
  for (let i = 0; i < n; i++) {
    const t0 = (i + 0.15) / n, t1 = (i + 0.85) / n, tm = (t0 + t1) / 2;
    flags += `<path d="M${(t0 * W).toFixed(1)} ${y(t0).toFixed(1)} L${(tm * W).toFixed(1)} ${(y(tm) + 26).toFixed(1)} L${(t1 * W).toFixed(1)} ${y(t1).toFixed(1)} Z" fill="${colors[i % colors.length]}"/>`;
  }
  $("bunting").innerHTML = `<svg class="cafe-art" viewBox="0 0 ${W} 80" width="${W}" height="80">
    <g filter="url(#pencil)" stroke="#7b5a48" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M0 6 Q${W / 2} ${6 + sag * 2} ${W} 6" fill="none" stroke-width="1.8"/>${flags}
    </g></svg>`;
}

function renderSky() {
  const n = innerWidth < 600 ? 14 : 24;
  let html = "";
  for (let i = 0; i < n; i++) {
    html += `<span class="twinkle" style="left:${rand(2, 96)}%;top:${rand(2, 96)}%;--s:${rand(8, 20).toFixed(0)}px;--t:${rand(2.4, 5).toFixed(1)}s;--d:${(-rand(0, 5)).toFixed(1)}s">${SPARKLE}</span>`;
  }
  $("sky").innerHTML = html;
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
function pointOf(e, el) {
  if (e.clientX || e.clientY) return [e.clientX, e.clientY];
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}
function squish(el) {
  el.classList.remove("squish");
  void el.offsetWidth;
  el.classList.add("squish");
}

$("shelves").addEventListener("click", (e) => {
  const t = e.target.closest(".treat, .group");
  if (!t) return;
  burst(...pointOf(e, t));
  squish(t);
  if (t.classList.contains("group")) {
    setTimeout(() => openCategory(t.dataset.cat, t), reduceMotion ? 0 : 220);
  }
});
$("cuShelves").addEventListener("click", (e) => {
  const t = e.target.closest(".cu-item");
  if (!t) return;
  burst(...pointOf(e, t));
  squish(t);
});
$("cuBack").addEventListener("click", () => closeCategory());
addEventListener("popstate", syncFromHash);

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
  const list = CONFIG?.fortunes?.length ? CONFIG.fortunes : ["วันนี้จะเป็นวันที่หวานมากๆ"];
  $("fortuneArt").innerHTML = treatSvg(TREAT_KEYS[Math.floor(Math.random() * TREAT_KEYS.length)]);
  $("fortuneText").textContent = list[Math.floor(Math.random() * list.length)];
  setTimeout(() => {
    fortune.hidden = false;
    $("fortuneClose").focus();
  }, reduceMotion ? 0 : 420);
});
const closeFortune = () => { fortune.hidden = true; $("bell").focus(); };
$("fortuneClose").addEventListener("click", closeFortune);
fortune.addEventListener("click", (e) => { if (e.target === fortune) closeFortune(); });
addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!fortune.hidden) closeFortune();
  else if (!closeup.hidden) closeCategory();
});

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

/* ---------- เริ่ม ---------- */
renderSky();
renderBunting();
addEventListener("resize", renderBunting);

loadConfig().then((cfg) => {
  if (!cfg) {
    $("shelves").innerHTML = `<p class="empty">โหลดข้อมูลร้านไม่ได้ ลองรีเฟรชอีกทีนะ</p>`;
    return;
  }
  CONFIG = cfg;
  renderProfile();
  renderMenu();
  renderCase();
  new ResizeObserver(() => renderCase()).observe($("case"));
  document.fonts?.ready.then(fitCase);
  syncFromHash();
});
