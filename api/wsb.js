// /api/wsb.js
export default async function handler(req, res) {
  try {
    const url = "https://www.reddit.com/r/wallstreetbets/hot.json?limit=100";

    const redditRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.70 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.reddit.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
      next: { revalidate: 600 }, // Vercel 快取 10 分鐘
    });

    // 若 Reddit 回傳非 JSON（例如 HTML），會出錯
    const text = await redditRes.text();
    if (!redditRes.ok || text.startsWith("<")) {
      console.error("❌ Reddit blocked request:", redditRes.status);
      return res.status(500).json({ error: "Reddit blocked request" });
    }

    const data = JSON.parse(text);

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate");
    res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy internal error" });
  }
}
