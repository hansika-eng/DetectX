from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import random
import instaloader
import os
from datetime import datetime

# ====================================================
# 🔥 Load ML model + features
# ====================================================
model = joblib.load("detectx_model.pkl")
features = joblib.load("detectx_features.pkl")

app = Flask(__name__)
CORS(app)

dashboard_state = {
    "total_scans": 24831,
    "fake_detected": 3492,
    "active_alerts": 47,
    "accuracy": 97.3,
    "detection_trend_real": [2400, 2200, 2600, 2800, 2500, 2900, 3100],
    "detection_trend_fake": [500, 580, 690, 540, 820, 760, 910],
    "weekly_engagement": [420, 380, 450, 520, 390, 260, 310],
    "weekly_suspicious": [38, 41, 36, 45, 48, 51, 47],
    "analytics_detected": [410, 560, 390, 640, 360, 720, 580, 470, 790, 740, 530, 660],
    "analytics_growth": [490, 430, 360, 440, 460, 570, 490, 560, 540, 780, 760, 520],
    "risk_distribution": {"low": 45, "medium": 30, "high": 25},
    "fraud_categories": {
        "Bots": 340,
        "Clones": 220,
        "Spam": 180,
        "Fake Influencer": 150,
        "Scam": 120,
    },
}

reports_store = [
    {
        "title": "MUST: Daily Fraud Risk Snapshot",
        "meta": "Required summary · Auto generated",
        "status": "Ready",
    },
    {
        "title": "Monthly Fraud Summary - Jan 2026",
        "meta": "Jan 31, 2026 · 1,240 accounts",
        "status": "Ready",
    },
    {
        "title": "Bot Network Analysis Report",
        "meta": "Feb 10, 2026 · 347 accounts",
        "status": "Ready",
    },
    {
        "title": "High-Risk Account Audit",
        "meta": "Feb 18, 2026 · 89 accounts",
        "status": "Processing",
    },
    {
        "title": "Q4 2025 Fraud Trends",
        "meta": "Dec 31, 2025 · 5,420 accounts",
        "status": "Ready",
    },
]


def _bounded(value, minimum, maximum):
    return max(minimum, min(maximum, value))


def _shift_with_noise(series, minimum, maximum, noise=90):
    next_value = _bounded(series[-1] + random.randint(-noise, noise), minimum, maximum)
    return series[1:] + [next_value]


def _generate_network_points():
    points = []
    for _ in range(24):
        points.append({
            "x": random.randint(6, 95),
            "y": random.randint(12, 84),
            "size": random.randint(3, 7),
            "type": "genuine",
        })

    for _ in range(8):
        points.append({
            "x": random.randint(15, 88),
            "y": random.randint(18, 80),
            "size": random.randint(4, 8),
            "type": "suspicious",
        })

    return points


def update_dashboard_state():
    dashboard_state["total_scans"] += random.randint(3, 15)
    dashboard_state["fake_detected"] += random.randint(0, 4)
    dashboard_state["active_alerts"] = _bounded(
        dashboard_state["active_alerts"] + random.randint(-2, 2), 30, 80
    )
    dashboard_state["accuracy"] = round(
        _bounded(dashboard_state["accuracy"] + random.uniform(-0.08, 0.08), 95.5, 99.4),
        2,
    )

    dashboard_state["detection_trend_real"] = _shift_with_noise(
        dashboard_state["detection_trend_real"], 1900, 3400, noise=120
    )
    dashboard_state["detection_trend_fake"] = _shift_with_noise(
        dashboard_state["detection_trend_fake"], 350, 1050, noise=90
    )

    dashboard_state["weekly_engagement"] = [
        _bounded(v + random.randint(-20, 20), 240, 620)
        for v in dashboard_state["weekly_engagement"]
    ]
    dashboard_state["weekly_suspicious"] = [
        _bounded(v + random.randint(-3, 4), 18, 74)
        for v in dashboard_state["weekly_suspicious"]
    ]

    dashboard_state["analytics_detected"] = _shift_with_noise(
        dashboard_state["analytics_detected"], 320, 840, noise=85
    )
    dashboard_state["analytics_growth"] = _shift_with_noise(
        dashboard_state["analytics_growth"], 340, 820, noise=85
    )

    low = _bounded(dashboard_state["risk_distribution"]["low"] + random.randint(-2, 2), 35, 55)
    medium = _bounded(dashboard_state["risk_distribution"]["medium"] + random.randint(-2, 2), 20, 40)
    high = _bounded(100 - low - medium, 15, 35)
    medium = 100 - low - high
    dashboard_state["risk_distribution"] = {"low": low, "medium": medium, "high": high}

    for key in dashboard_state["fraud_categories"]:
        dashboard_state["fraud_categories"][key] = _bounded(
            dashboard_state["fraud_categories"][key] + random.randint(-6, 7), 90, 390
        )


@app.route("/realtime_dashboard", methods=["GET"])
def realtime_dashboard():
    update_dashboard_state()

    distribution = {
        "genuine": _bounded(100 - (dashboard_state["active_alerts"] // 2), 72, 84),
        "suspicious": _bounded((dashboard_state["active_alerts"] // 4), 8, 18),
    }
    distribution["fake"] = 100 - distribution["genuine"] - distribution["suspicious"]

    payload = {
        "timestamp": datetime.utcnow().isoformat(),
        "overview": {
            "total_scans": dashboard_state["total_scans"],
            "fake_detected": dashboard_state["fake_detected"],
            "active_alerts": dashboard_state["active_alerts"],
            "accuracy": dashboard_state["accuracy"],
            "distribution": distribution,
            "recent_alerts": [
                {"user": "@ghost_net_42", "type": "Bot Network", "risk": random.randint(90, 98)},
                {"user": "@fake_influencer", "type": "Fake Engagement", "risk": random.randint(82, 92)},
                {"user": "@spam_cluster_7", "type": "Coordinated Spam", "risk": random.randint(85, 95)},
                {"user": "@clone_account_x", "type": "Clone Account", "risk": random.randint(72, 86)},
            ],
        },
        "detection_trend": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            "real": dashboard_state["detection_trend_real"],
            "fake": dashboard_state["detection_trend_fake"],
        },
        "behavioral": {
            "activity_24h": [
                _bounded(base + random.randint(-8, 8), 12, 138)
                for base in [45, 52, 120, 128, 98, 82, 26, 18, 54, 69, 20, 41, 17, 20, 22, 74, 19, 62, 14, 28, 16, 43, 12]
            ],
            "weekly_engagement": dashboard_state["weekly_engagement"],
            "weekly_suspicious": dashboard_state["weekly_suspicious"],
            "signals": [
                {"label": "Posting during non-human hours", "score": random.randint(88, 96), "level": "critical"},
                {"label": "Identical message patterns", "score": random.randint(80, 93), "level": "critical"},
                {"label": "Abnormal follower growth spike", "score": random.randint(65, 80), "level": "medium"},
                {"label": "Low engagement despite high activity", "score": random.randint(60, 75), "level": "medium"},
                {"label": "Repetitive link sharing", "score": random.randint(35, 58), "level": "low"},
            ],
        },
        "network": {
            "nodes": _generate_network_points(),
            "clusters": [
                {"title": "Bot Network Alpha", "meta": "47 nodes · Bot Farm", "risk": random.randint(90, 96)},
                {"title": "Fake Influencer Ring", "meta": "23 nodes · Coordinated", "risk": random.randint(82, 90)},
                {"title": "Spam Cluster C", "meta": "156 nodes · Spam Network", "risk": random.randint(85, 95)},
                {"title": "Clone Group X", "meta": "12 nodes · Clone Accounts", "risk": random.randint(65, 79)},
            ],
            "connections": [
                {"from": "user_a1", "to": "user_b3", "strength": random.randint(84, 96)},
                {"from": "user_b3", "to": "user_c7", "strength": random.randint(80, 90)},
                {"from": "user_c7", "to": "user_a1", "strength": random.randint(86, 97)},
                {"from": "user_d2", "to": "user_e5", "strength": random.randint(62, 78)},
                {"from": "user_e5", "to": "user_f8", "strength": random.randint(55, 72)},
            ],
        },
        "analytics": {
            "total_analyzed": dashboard_state["total_scans"] * 5 + random.randint(0, 200),
            "detection_rate": dashboard_state["accuracy"],
            "regions": 47,
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "detected": dashboard_state["analytics_detected"],
            "growth": dashboard_state["analytics_growth"],
            "risk_distribution": dashboard_state["risk_distribution"],
            "fraud_categories": dashboard_state["fraud_categories"],
        },
    }

    return jsonify(payload)


@app.route("/reports", methods=["GET"])
def get_reports():
    return jsonify({"reports": reports_store})


@app.route("/reports/new", methods=["POST"])
def create_report():
    payload = request.json or {}
    report_title = payload.get("title") or f"Fraud Summary {datetime.utcnow().strftime('%b %d, %Y %H:%M')}"
    report = {
        "title": report_title,
        "meta": f"{datetime.utcnow().strftime('%b %d, %Y')} · Auto generated",
        "status": "Processing",
    }
    reports_store.insert(0, report)
    return jsonify({"ok": True, "report": report})


@app.route("/user_profile", methods=["GET"])
def user_profile():
    return jsonify({
        "name": "Ananya Rao",
        "role": "Fraud Analyst",
        "email": "ananya.rao@detectx.ai",
        "last_login": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
    })

# ====================================================
# 🔥 Instagram session (IMPORTANT – prevents blocking)
# ====================================================
INSTA_USERNAME = "your_instagram_username"
INSTA_PASSWORD = "your_instagram_password"

loader = instaloader.Instaloader()


def instagram_login():
    """
    Login once and reuse session
    """
    try:
        session_file = f"{INSTA_USERNAME}.session"

        # Load saved session
        if os.path.exists(session_file):
            loader.load_session_from_file(INSTA_USERNAME)
            print("✅ Instagram session loaded")

        else:
            loader.login(INSTA_USERNAME, INSTA_PASSWORD)
            loader.save_session_to_file()
            print("✅ Instagram login successful")

    except Exception as e:
        print("⚠️ Instagram login error:", e)


# Login when backend starts
instagram_login()


@app.route("/")
def home():
    return "DetectX API Running 🚀"


# ====================================================
# 🔥 COMMON ML PREDICTION
# ====================================================
def run_prediction(feature_dict):
    df = pd.DataFrame([feature_dict])
    df = df.reindex(columns=features, fill_value=0)

    prediction = model.predict(df)[0]
    probability = float(model.predict_proba(df)[0][1])

    # Risk levels
    if probability > 0.8:
        risk = "High Risk 🚨"
    elif probability > 0.5:
        risk = "Medium Risk ⚠️"
    else:
        risk = "Low Risk ✅"

    result = "Fake Account 🚨" if prediction == 1 else "Real Account ✅"

    # Explainable AI
    importances = model.feature_importances_

    top_features = dict(
        sorted(zip(features, importances), key=lambda x: x[1], reverse=True)[:5]
    )

    top_features = {k: float(v) for k, v in top_features.items()}

    return prediction, probability, risk, result, top_features


# ====================================================
# 🔥 MANUAL FEATURE DETECTION
# ====================================================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        prediction, probability, risk, result, top_features = run_prediction(data)

        return jsonify({
            "prediction": int(prediction),
            "probability_fake": round(probability, 3),
            "risk_level": risk,
            "result": result,
            "top_features": top_features
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# ====================================================
# 🔥 USERNAME BASED (Twitter-style simulation)
# ====================================================
@app.route("/predict_username", methods=["POST"])
def predict_username():
    try:
        data = request.json
        username = data.get("username")

        extracted_features = {
            "statuses_count": random.randint(0, 5000),
            "followers_count": random.randint(0, 1000),
            "friends_count": random.randint(0, 5000),
            "favourites_count": random.randint(0, 2000),
            "listed_count": random.randint(0, 50),
            "default_profile": random.randint(0, 1)
        }

        prediction, probability, risk, result, top_features = run_prediction(extracted_features)

        return jsonify({
            "username": username,
            "prediction": int(prediction),
            "probability_fake": round(probability, 3),
            "risk_level": risk,
            "result": result,
            "top_features": top_features,
            "extracted_features": extracted_features
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# ====================================================
# 🔥 REAL INSTAGRAM BOT DETECTION
# ====================================================
@app.route("/instagram_detect", methods=["POST"])
def instagram_detect():
    try:
        data = request.json
        username = data.get("username")

        if not username:
            return jsonify({"error": "Username required"})

        print(f"🔍 Checking Instagram user: {username}")

        # Get profile
        profile = instaloader.Profile.from_username(loader.context, username)

        # Extract real features
        insta_features = {
            "followers": profile.followers,
            "following": profile.followees,
            "posts": profile.mediacount,
            "bio_length": len(profile.biography),
            "has_profile_pic": 1 if profile.profile_pic_url else 0,
            "is_private": 1 if profile.is_private else 0
        }

        # Bot scoring
        score = 0
        if insta_features["followers"] < 50:
            score += 1
        if insta_features["posts"] < 5:
            score += 1
        if insta_features["bio_length"] < 10:
            score += 1
        if insta_features["has_profile_pic"] == 0:
            score += 1

        bot_probability = round(score / 4, 3)

        result = "Bot Account 🤖" if bot_probability > 0.5 else "Real User ✅"

        return jsonify({
            "username": username,
            "features": insta_features,
            "bot_probability": bot_probability,
            "result": result
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# ====================================================
# 🔥 RUN SERVER
# ====================================================
if __name__ == "__main__":
    app.run(debug=True)