 // server.js
import express from "express";
const app = express();
app.use(express.json());

const PORT =3000 
const UNIVERSE_ID =86002468762279 // e.g. "123456789"
const ROBLOX_API_KEY =NQe3+pS//0uRTcaJ8Rn66zaNOQLTav/hX8TyXpRfalzUuXYeZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SWs1UlpUTXJjRk12THpCMVVsUmpZVW80VW00Mk5ucGhUazlSVEZSaGRpOW9XRGhVZVZod1VtWmhiSHBWZFZoWlpTSXNJbTkzYm1WeVNXUWlPaUl4TWpBNU1qYzROemszSWl3aVpYaHdJam94TnpVNU5ETXlOalk1TENKcFlYUWlPakUzTlRrME1qa3dOamtzSW01aVppSTZNVGMxT1RReU9UQTJPWDAubGZydzZjaFl2elIxOHlOOWpSNXRkV19HY082OS1oWjllcHdqZDEwSDVvVmplM2JqVm5wZk5TamtLXzdCTGJ6SjRZZi1SNkxwZ25qczFibEVZRXVqcDRsMGY1a3cyNHhuOXE0eGpBdHpEcUZqUC15ZmFVdzNCNGdPNDVqMkwybkhDLWkyMlc4Vmk0dUtVcWNsRjNDZW5PeVhyaWRtb2ptWHNBTzhtVFVwM1NIaDROaE5VN2lwZklBZUJIdFloY1lxa0hzb3VOWXl6QkJEZUxXZTl3b3g0OWh3R19BVkl4a0dVZlZqOE1UeVlYNVgyUGZxZFZEem50VFVEV0xGOXhHWXdURnRwakJuVXZtR3JLRnRLdDRYQm5nTXdRUGlSUVp2OW1iS3djTXhJTDk1NW5ueXI1di1IYXZHNTQ3ZkJvMEtGMGpiWFlLV2g4TmJ3QzgzODhSaUt3   // from create.roblox.com/credentials
const WEBSITE_SECRET =secrethere;   // secret for your site -> backend auth
const TOPIC =events 

if (!UNIVERSE_ID || !ROBLOX_API_KEY || !WEBSITE_SECRET) {
  console.error("Missing required env vars. See README or .env.example");
  process.exit(1);
}

// simple protected endpoint
app.post("/api/publish", async (req, res) => {
  try {
    // Basic protection: header x-site-secret must match backend secret
    const siteSecret = req.get("x-site-secret") || "";
    if (siteSecret !== WEBSITE_SECRET) return res.status(403).json({ error: "forbidden" });

    const payload = req.body;
    if (!payload || typeof payload !== "object") return res.status(400).json({ error: "bad payload" });

    // Compose Roblox Open Cloud URL
    const robloxUrl = `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/${encodeURIComponent(TOPIC)}`;

    // Roblox expects a JSON body with a top-level "message" field.
    const body = JSON.stringify({ message: payload });

    // Node 18+ fetch is global. If using older Node, use node-fetch.
    const r = await fetch(robloxUrl, {
      method: "POST",
      headers: {
        "x-api-key": ROBLOX_API_KEY,
        "Content-Type": "application/json"
      },
      body
    });

    const txt = await r.text();
    if (!r.ok) {
      console.error("Roblox publish failed", r.status, txt);
      return res.status(500).json({ ok: false, status: r.status, body: txt });
    }

    return res.json({ ok: true, robloxResponse: txt });
  } catch (err) {
    console.error("publish error", err);
    return res.status(500).json({ ok: false, error: "internal" });
  }
});

app.listen(PORT, () => console.log(`listening ${PORT}`));

