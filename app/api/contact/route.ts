import { EMAIL } from "@/content/site";

// Project briefs from the contact form. Sends through Resend's REST API when RESEND_API_KEY and
// CONTACT_FROM are set (CONTACT_TO = inbox, CONTACT_FROM = verified sender). Without them it answers
// 503 and the form falls back to opening the visitor's mail app, so no brief is ever lost.

const LIMITS: Record<string, number> = {
  name: 120,
  company: 160,
  email: 200,
  building: 200,
  types: 400,
  budget: 60,
  launch: 40,
  description: 5000,
};

// ponytail: per-instance memory, so the cap is per warm function; move to a KV/Upstash limiter if abuse appears.
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000;
const MAX = 5;
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX;
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return Response.json({ error: "forbidden" }, { status: 403 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return Response.json({ error: "rate-limited" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }
  if (body.website) return Response.json({ ok: true }); // honeypot: bots fill the hidden field

  const f: Record<string, string> = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const v = body[key];
    const s = Array.isArray(v) ? v.map(String).join(", ") : typeof v === "string" ? v : "";
    f[key] = s.trim().slice(0, max);
  }
  const errors: Record<string, string> = {};
  if (!f.name) errors.name = "Tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = "Enter an e-mail address we can reply to.";
  if (f.description.length < 20) errors.description = "A sentence or two about the project, at least 20 characters.";
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM; // must be a sender on a domain verified in Resend
  if (!key || !from) return Response.json({ error: "not-configured" }, { status: 503 });

  const text = [
    `Name: ${f.name}`,
    `Company: ${f.company || "-"}`,
    `E-mail: ${f.email}`,
    `Building: ${f.building || "-"}`,
    `Project type: ${f.types || "-"}`,
    `Budget: ${f.budget || "-"}`,
    `Desired launch: ${f.launch || "-"}`,
    "",
    f.description,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [process.env.CONTACT_TO ?? EMAIL],
      reply_to: f.email,
      subject: `New brief: ${f.building || f.company || f.name}`,
      text,
    }),
  });
  if (!res.ok) return Response.json({ error: "send-failed" }, { status: 502 });
  return Response.json({ ok: true });
}
