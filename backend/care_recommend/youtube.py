from flask import Flask, jsonify
from flask_cors import CORS
from googleapiclient.discovery import build
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# app = Flask(__name__)
# CORS(app)

API_KEY = os.getenv("YOUTUBE_API_KEY")   # ✅ Read key from .env
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"


def search_youtube(query, max_results=5):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=API_KEY)

    request = youtube.search().list(
        q=query,
        part="snippet",
        type="video",
        maxResults=max_results
    )
    response = request.execute()

    videos = []
    for item in response.get("items", []):
        video_id = item["id"]["videoId"]
        title = item["snippet"]["title"]
        url = f"https://www.youtube.com/watch?v={video_id}"
        videos.append({"title": title, "url": url})

    return videos


def youtube_recommend(heart_risk, diabetes_risk):
    if heart_risk > 0.6 and diabetes_risk > 0.5:
        query = "heart disease and diabetes lifestyle tips"
    elif heart_risk > 0.6:
        query = "heart health care tips exercise diet"
    elif diabetes_risk > 0.5:
        query = "diabetes management diet exercise"
    else:
        query = "general healthy lifestyle tips"

    return search_youtube(query)


# If you want to expose it as API:
# @app.route("/youtube", methods=["GET"])
# def youtube_route():
#     return jsonify({"videos": youtube_recommend(0.7, 0.8)})

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)
