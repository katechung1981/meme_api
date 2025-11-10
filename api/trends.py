# api/trends.py
from flask import Flask, request, jsonify
from pytrends.request import TrendReq
import random, time, traceback

app = Flask(__name__)

@app.route("/api/trends", methods=["GET"])
def get_trends():
    keyword = request.args.get("keyword", "")
    if not keyword:
        return jsonify({"error": "Missing keyword"}), 400

    try:
        print(f"🔍 Fetching Google Trends for: {keyword}")

        # 初始化 pytrends（hl=語言, tz=時區）
        pytrends = TrendReq(hl="en-US", tz=360)

        # 隨機延遲，避免 Google 429
        delay = random.uniform(1.2, 2.8)
        time.sleep(delay)
        print(f"⏳ Delay {delay:.2f}s before request")

        # 建立查詢 payload
        pytrends.build_payload([keyword], cat=0, timeframe="now 7-d", geo="", gprop="")

        # 抓取資料
        data = pytrends.interest_over_time()

        if data.empty:
            print(f"⚠️ No data found for {keyword}")
            return jsonify({"keyword": keyword, "score": 0})

        # 取最新的數值
        score = int(data[keyword].iloc[-1])
        print(f"✅ Got score {score} for {keyword}")
        return jsonify({"keyword": keyword, "score": score})

    except Exception as e:
        err_text = traceback.format_exc()
        print("❌ Exception occurred:\n", err_text)
        return jsonify({"error": str(e)}), 500


# Vercel 會自動執行 app 實例
if __name__ == "__main__":
    app.run(debug=True)
