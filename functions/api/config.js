import { sanitizeConfig, ValidationError } from "../../lib/schema.js";
import { isAdmin, json } from "../../lib/auth.js";

const KEY = "config";
const MAX_BYTES = 200_000;

// GET /api/config — ข้อมูลร้านล่าสุด (ถ้ายังไม่เคยบันทึก ใช้ /config.json ตั้งต้น)
export async function onRequestGet({ env, request }) {
  const saved = env.LINKS_KV ? await env.LINKS_KV.get(KEY) : null;
  if (saved) {
    return new Response(saved, {
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  }
  return env.ASSETS.fetch(new URL("/config.json", request.url));
}

// PUT /api/config — บันทึกจากหลังบ้าน (ต้องมีรหัสผ่าน)
export async function onRequestPut({ env, request }) {
  if (!env.ADMIN_PASSWORD) return json({ error: "ยังไม่ได้ตั้งค่า ADMIN_PASSWORD ใน Cloudflare" }, 500);
  if (!(await isAdmin(request, env))) return json({ error: "รหัสผ่านไม่ถูกต้อง" }, 401);
  if (!env.LINKS_KV) return json({ error: "ยังไม่ได้ผูก KV ชื่อ LINKS_KV ใน Cloudflare" }, 500);

  const text = await request.text();
  if (text.length > MAX_BYTES) return json({ error: "ข้อมูลใหญ่เกินไป" }, 413);
  let clean;
  try {
    clean = sanitizeConfig(JSON.parse(text));
  } catch (err) {
    const msg = err instanceof ValidationError ? err.message : "อ่านข้อมูลไม่ได้ (JSON ผิดรูปแบบ)";
    return json({ error: msg }, 400);
  }
  await env.LINKS_KV.put(KEY, JSON.stringify(clean));
  return json({ ok: true, config: clean });
}
