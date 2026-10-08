/* หลังร้าน: แก้ข้อมูลตู้ขนม แล้วบันทึกลง Cloudflare KV ผ่าน /api/config */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 7)}`;
const TOKEN_KEY = "sweet-admin";

let token = "";
let state = null;
let dirty = false;

/* ---------- เข้าสู่ระบบ ---------- */
$("loginArt").innerHTML = treatSvg("bun");
try { token = sessionStorage.getItem(TOKEN_KEY) || ""; } catch (_) {}

async function api(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { "content-type": "application/json", authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  });
  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) {
    const fallback = res.status === 404 || res.status === 405
      ? "ยังไม่พบระบบหลังบ้าน — ต้อง deploy บน Cloudflare Pages ก่อนนะ"
      : `เกิดข้อผิดพลาด (${res.status})`;
    throw new Error(data?.error || fallback);
  }
  return data;
}

async function login(pass) {
  token = pass;
  await api("/api/auth", { method: "POST" });
  try { sessionStorage.setItem(TOKEN_KEY, pass); } catch (_) {}
  const res = await fetch("/api/config", { cache: "no-store" });
  state = normalize(await res.json());
  $("login").hidden = true;
  $("editor").hidden = false;
  renderAll();
}

$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("loginError").textContent = "";
  const btn = e.submitter;
  btn.disabled = true;
  try {
    await login($("password").value);
  } catch (err) {
    $("loginError").textContent = err.message;
  } finally {
    btn.disabled = false;
  }
});
if (token) login(token).catch(() => { token = ""; try { sessionStorage.removeItem(TOKEN_KEY); } catch (_) {} });

$("logoutBtn").addEventListener("click", () => {
  if (dirty && !confirm("ยังไม่ได้บันทึก ออกเลยไหม?")) return;
  try { sessionStorage.removeItem(TOKEN_KEY); } catch (_) {}
  location.reload();
});

/* ---------- ข้อมูล ---------- */
function normalize(c) {
  return {
    mode: c?.mode === "simple" ? "simple" : "category",
    profile: { name: "", handle: "", bio: "", avatar: "", ...(c?.profile || {}) },
    categories: (c?.categories || []).map((x) => ({ id: x.id || uid("cat"), name: x.name || "", note: x.note || "", treat: x.treat || "cupcake" })),
    links: (c?.links || []).map((x) => ({ id: x.id || uid("link"), title: x.title || "", note: x.note || "", price: x.price || "", url: x.url || "", treat: x.treat || "cupcake", category: x.category || "" })),
    fortunes: c?.fortunes || [],
  };
}
function markDirty() {
  dirty = true;
  setStatus("มีการแก้ไขที่ยังไม่บันทึก");
}
addEventListener("beforeunload", (e) => { if (dirty) e.preventDefault(); });

/* ---------- แสดงผล ---------- */
const treatOptions = (sel) => TREAT_KEYS.map((k) => `<option value="${k}"${k === sel ? " selected" : ""}>${esc(TREAT_NAMES[k] || k)}</option>`).join("");

function renderAll() {
  document.querySelectorAll('input[name="mode"]').forEach((r) => { r.checked = r.value === state.mode; });
  document.querySelector('[data-mode-art="category"]').innerHTML = treatSvg("cupcake") + treatSvg("cupcake") + treatSvg("toast");
  document.querySelector('[data-mode-art="simple"]').innerHTML = treatSvg("melonpan") + treatSvg("daifuku") + treatSvg("pudding");
  document.querySelectorAll("[data-profile]").forEach((el) => { el.value = state.profile[el.dataset.profile] || ""; });
  $("fortunes").value = state.fortunes.join("\n");
  renderCats();
  renderLinks();
}

function renderCats() {
  $("catCard").classList.toggle("dim", state.mode === "simple");
  $("catHint").textContent = state.mode === "simple"
    ? "ตอนนี้เลือกแบบไม่มีหมวดหมู่ หมวดจะยังเก็บไว้ แต่ไม่แสดงหน้าร้าน"
    : "แต่ละหมวดคือขนมหนึ่งกลุ่มบนชั้น ลิงก์ที่ไม่ได้เลือกหมวดจะไปอยู่กลุ่ม \"อื่นๆ\"";
  $("catList").innerHTML = state.categories.map((c, i) => `
    <div class="item" data-list="categories" data-i="${i}">
      <span class="preview">${treatSvg(c.treat)}</span>
      <div class="fields">
        <div class="grid2">
          <label class="field"><span>ชื่อหมวด</span><input data-field="name" value="${esc(c.name)}" maxlength="40" required></label>
          <label class="field"><span>ขนมประจำหมวด</span><select data-field="treat">${treatOptions(c.treat)}</select></label>
        </div>
        <label class="field"><span>คำในฟองคำพูด</span><input data-field="note" value="${esc(c.note)}" maxlength="60"></label>
      </div>
      <div class="tools">
        <button type="button" class="icon" data-act="up" aria-label="เลื่อนขึ้น" ${i === 0 ? "disabled" : ""}>↑</button>
        <button type="button" class="icon" data-act="down" aria-label="เลื่อนลง" ${i === state.categories.length - 1 ? "disabled" : ""}>↓</button>
        <button type="button" class="icon danger" data-act="del" aria-label="ลบหมวด ${esc(c.name)}">✕</button>
      </div>
    </div>`).join("") || `<p class="muted small">ยังไม่มีหมวด</p>`;
}

function renderLinks() {
  const catOpts = (sel) => `<option value="">— ไม่มีหมวด —</option>` +
    state.categories.map((c) => `<option value="${esc(c.id)}"${c.id === sel ? " selected" : ""}>${esc(c.name || "(ไม่มีชื่อ)")}</option>`).join("");
  $("linkList").innerHTML = state.links.map((l, i) => `
    <div class="item" data-list="links" data-i="${i}">
      <span class="preview">${treatSvg(l.treat)}</span>
      <div class="fields">
        <div class="grid2">
          <label class="field"><span>ชื่อลิงก์ (บนป้าย)</span><input data-field="title" value="${esc(l.title)}" maxlength="40" required></label>
          <label class="field"><span>ลิงก์</span><input data-field="url" value="${esc(l.url)}" placeholder="https://… หรือ mailto:…" required></label>
        </div>
        <div class="grid3">
          <label class="field"><span>คำในฟองคำพูด</span><input data-field="note" value="${esc(l.note)}" maxlength="40"></label>
          <label class="field"><span>ป้ายราคา</span><input data-field="price" value="${esc(l.price)}" maxlength="24" placeholder="฿0 · ฟอลเลย"></label>
          <label class="field"><span>ขนม</span><select data-field="treat">${treatOptions(l.treat)}</select></label>
        </div>
        <label class="field cat-field"><span>หมวด</span><select data-field="category">${catOpts(l.category)}</select></label>
      </div>
      <div class="tools">
        <button type="button" class="icon" data-act="up" aria-label="เลื่อนขึ้น" ${i === 0 ? "disabled" : ""}>↑</button>
        <button type="button" class="icon" data-act="down" aria-label="เลื่อนลง" ${i === state.links.length - 1 ? "disabled" : ""}>↓</button>
        <button type="button" class="icon danger" data-act="del" aria-label="ลบลิงก์ ${esc(l.title)}">✕</button>
      </div>
    </div>`).join("") || `<p class="muted small">ยังไม่มีลิงก์ กด "+ เพิ่มลิงก์" ได้เลย</p>`;
  $("linkList").classList.toggle("no-cat", state.mode === "simple");
}

/* ---------- แก้ไข ---------- */
document.querySelectorAll('input[name="mode"]').forEach((r) => r.addEventListener("change", () => {
  state.mode = r.value;
  markDirty();
  renderCats();
  renderLinks();
}));
document.querySelectorAll("[data-profile]").forEach((el) => el.addEventListener("input", () => {
  state.profile[el.dataset.profile] = el.value;
  markDirty();
}));
$("fortunes").addEventListener("input", (e) => {
  state.fortunes = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
  markDirty();
});

for (const listEl of [$("catList"), $("linkList")]) {
  listEl.addEventListener("input", onFieldChange);
  listEl.addEventListener("change", onFieldChange);
  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const item = btn.closest(".item");
    const list = state[item.dataset.list];
    const i = +item.dataset.i;
    if (btn.dataset.act === "del") {
      const name = list[i].name || list[i].title || "รายการนี้";
      if (!confirm(`ลบ "${name}" ใช่ไหม?`)) return;
      list.splice(i, 1);
    } else {
      const j = btn.dataset.act === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= list.length) return;
      [list[i], list[j]] = [list[j], list[i]];
    }
    markDirty();
    item.dataset.list === "categories" ? (renderCats(), renderLinks()) : renderLinks();
  });
}

function onFieldChange(e) {
  const el = e.target.closest("[data-field]");
  if (!el) return;
  const item = el.closest(".item");
  const obj = state[item.dataset.list][+item.dataset.i];
  obj[el.dataset.field] = el.value;
  markDirty();
  if (el.dataset.field === "treat") item.querySelector(".preview").innerHTML = treatSvg(el.value);
  if (item.dataset.list === "categories" && el.dataset.field === "name" && e.type === "change") renderLinks();
}

$("addCat").addEventListener("click", () => {
  state.categories.push({ id: uid("cat"), name: "หมวดใหม่", note: "", treat: TREAT_KEYS[state.categories.length % TREAT_KEYS.length] });
  markDirty();
  renderCats();
  renderLinks();
  $("catList").lastElementChild.querySelector("input").select();
});
$("addLink").addEventListener("click", () => {
  state.links.push({ id: uid("link"), title: "", note: "", price: "฿0", url: "https://", treat: TREAT_KEYS[state.links.length % TREAT_KEYS.length], category: state.categories[0]?.id || "" });
  markDirty();
  renderLinks();
  const last = $("linkList").lastElementChild;
  last.scrollIntoView({ behavior: "smooth", block: "center" });
  last.querySelector("input").focus({ preventScroll: true });
});

/* ---------- บันทึก ---------- */
function setStatus(msg, kind = "") {
  const s = $("status");
  s.textContent = msg;
  s.dataset.kind = kind;
}
function validate() {
  for (const [i, l] of state.links.entries()) {
    if (!l.title.trim()) return `ลิงก์ลำดับที่ ${i + 1} ยังไม่มีชื่อ`;
    if (!/^(https?:\/\/\S+\.\S+|mailto:\S+|tel:[+\d][\d\s()-]*)$/i.test(l.url.trim())) return `ลิงก์ "${l.title}" ต้องขึ้นต้นด้วย https://, mailto: หรือ tel:`;
  }
  return "";
}
$("saveBtn").addEventListener("click", async () => {
  const problem = validate();
  if (problem) return setStatus(problem, "error");
  const btn = $("saveBtn");
  btn.disabled = true;
  setStatus("กำลังบันทึก…");
  try {
    const res = await api("/api/config", { method: "PUT", body: JSON.stringify(state) });
    state = normalize(res.config);
    dirty = false;
    renderAll();
    setStatus("บันทึกแล้ว! หน้าร้านอัปเดตเรียบร้อย ♡", "ok");
  } catch (err) {
    setStatus(err.message, "error");
  } finally {
    btn.disabled = false;
  }
});

/* ---------- สำรอง / นำเข้า ---------- */
$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "config.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});
$("importFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  try {
    state = normalize(JSON.parse(await file.text()));
    markDirty();
    renderAll();
    setStatus("นำเข้าแล้ว — กดบันทึกเพื่อใช้จริง", "ok");
  } catch (_) {
    setStatus("ไฟล์นี้อ่านไม่ได้ (ต้องเป็น JSON)", "error");
  }
});
