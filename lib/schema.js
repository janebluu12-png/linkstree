// ตรวจและทำความสะอาดข้อมูลร้านก่อนบันทึก — ทุกอย่างที่มาจากหลังบ้านต้องผ่านตรงนี้
export const TREATS = ["cupcake", "toast", "melonpan", "bun", "daifuku", "shortcake", "croissant", "pudding", "rollcake", "creampuff", "choco"];
export const LIMITS = { categories: 12, links: 80, fortunes: 40 };

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const id = (v, fallback) => {
  const s = str(v, 40).toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return s || fallback;
};
const treat = (v) => (TREATS.includes(v) ? v : "cupcake");

// อนุญาตเฉพาะลิงก์ที่ปลอดภัย (กัน javascript: และอื่นๆ)
export function safeUrl(v) {
  const s = str(v, 2000);
  if (/^mailto:[^\s]+$/i.test(s) || /^tel:[+\d][\d\s()-]*$/i.test(s)) return s;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
  } catch {
    return "";
  }
}

export class ValidationError extends Error {}

export function sanitizeConfig(input) {
  if (!input || typeof input !== "object") throw new ValidationError("ข้อมูลไม่ถูกต้อง");
  const p = input.profile || {};
  const categories = (Array.isArray(input.categories) ? input.categories : [])
    .slice(0, LIMITS.categories)
    .map((c, i) => ({ id: id(c?.id, `cat-${i + 1}`), name: str(c?.name, 40) || `หมวด ${i + 1}`, note: str(c?.note, 60), treat: treat(c?.treat) }));
  dedupeIds(categories);
  const catIds = new Set(categories.map((c) => c.id));

  const links = [];
  const rawLinks = Array.isArray(input.links) ? input.links : [];
  if (rawLinks.length > LIMITS.links) throw new ValidationError(`ใส่ลิงก์ได้ไม่เกิน ${LIMITS.links} อัน`);
  rawLinks.forEach((l, i) => {
    const url = safeUrl(l?.url);
    const title = str(l?.title, 40);
    if (!title) throw new ValidationError(`ลิงก์ลำดับที่ ${i + 1} ยังไม่มีชื่อ`);
    if (!url) throw new ValidationError(`ลิงก์ "${title}" ต้องขึ้นต้นด้วย https://, mailto: หรือ tel:`);
    links.push({
      id: id(l?.id, `link-${i + 1}`),
      title,
      note: str(l?.note, 40),
      price: str(l?.price, 24),
      url,
      treat: treat(l?.treat),
      category: catIds.has(l?.category) ? l.category : "",
    });
  });
  dedupeIds(links);

  return {
    mode: input.mode === "simple" ? "simple" : "category",
    profile: {
      name: str(p.name, 40) || "SWEET LINKS",
      handle: str(p.handle, 60),
      bio: str(p.bio, 200),
      avatar: p.avatar ? safeUrl(p.avatar) : "",
    },
    categories,
    links,
    fortunes: (Array.isArray(input.fortunes) ? input.fortunes : []).map((f) => str(f, 120)).filter(Boolean).slice(0, LIMITS.fortunes),
  };
}

function dedupeIds(list) {
  const seen = new Set();
  for (const item of list) {
    let base = item.id, n = 2;
    while (seen.has(item.id)) item.id = `${base}-${n++}`;
    seen.add(item.id);
  }
}
