export default async function handler(req, res) {
  try {
    const auth = Buffer.from(
      process.env.REDDIT_CLIENT_ID + ":" + process.env.REDDIT_CLIENT_SECRET
    ).toString("base64");

    // 取得 access token
    const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 用 Reddit API 抓 hot 帖文
    const redditRes = await fetch(
      "https://oauth.reddit.com/r/wallstreetbets/hot?limit=100",
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "User-Agent": "MemeRadarBot/1.0 by yourname",
        },
      }
    );

    const data = await redditRes.json();
    res.status(200).json(data);

  } catch (err) {
    console.error("Reddit proxy error:", err);
    res.status(500).json({ error: "Proxy internal error" });
  }
}
