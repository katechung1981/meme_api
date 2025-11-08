// /api/wsb.js
export default async function handler(req, res) {
  try {
    const url = "https://www.reddit.com/r/wallstreetbets/hot.json?limit=100";

    const redditRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json",
      },
    });

    if (!redditRes.ok) {
      return res.status(redditRes.status).json({ error: "Reddit fetch failed" });
    }

    const data = await redditRes.json();
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate");
    res.status(200).json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy internal error" });
  }
}
