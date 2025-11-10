from pytrends.request import TrendReq
import random, time

def handler(request):
    from flask import jsonify, request as req
    keyword = req.args.get("keyword", "")
    if not keyword:
        return jsonify({"error": "Missing keyword"}), 400

    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        time.sleep(random.uniform(1, 3))  # 隨機等待防止 429
        pytrends.build_payload([keyword], cat=0, timeframe="now 7-d", geo="", gprop="")
        data = pytrends.interest_over_time()
        if data.empty:
            return jsonify({"score": 0})
        score = int(data[keyword].iloc[-1])
        return jsonify({"score": score})
    except Exception as e:
        print("❌ Error fetching trends:", str(e))
        return jsonify({"error": str(e)}), 500
