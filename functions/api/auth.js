import { isAdmin, json } from "../../lib/auth.js";

// POST /api/auth — เช็กรหัสผ่านหลังบ้าน
export async function onRequestPost({ env, request }) {
  if (!env.ADMIN_PASSWORD) return json({ ok: false, error: "ยังไม่ได้ตั้งค่า ADMIN_PASSWORD ใน Cloudflare" }, 500);
  if (!(await isAdmin(request, env))) {
    await new Promise((r) => setTimeout(r, 600)); // ชะลอการเดารหัสนิดหน่อย
    return json({ ok: false, error: "รหัสผ่านไม่ถูกต้อง" }, 401);
  }
  return json({ ok: true, kv: !!env.LINKS_KV });
}
