import googleapiclient.discovery
import google_auth_oauthlib.flow
import google.auth.transport.requests
import os
import pickle
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# YouTube Data API'yi başlatın
api_service_name = "youtube"
api_version = "v3"

# OAuth 2.0 kimlik doğrulama bilgileri
client_secrets_file = "client_secret.json"
token_file = "token.pkl"
# OAuth 2.0 kimlik doğrulama
def get_authenticated_service():
    credentials = None
    if os.path.exists(token_file):
        with open(token_file, 'rb') as token:
            credentials = pickle.load(token)

    if not credentials or not credentials.valid:
        flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
            client_secrets_file, scopes=["https://www.googleapis.com/auth/youtube.force-ssl"]
        )
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(google.auth.transport.requests.Request())
        else:
            credentials = flow.run_local_server(port=0)

        with open(token_file, 'wb') as token:
            pickle.dump(credentials, token)

    return googleapiclient.discovery.build(api_service_name, api_version, credentials=credentials)

# Son Türkçe videoları aramak için fonksiyon
def search_recent_turkish_videos(youtube, max_results=5, published_before=None):
    search_response = youtube.search().list(
        q='Türkçe',  
        type='video',
        part='id,snippet',
        maxResults=max_results,
        publishedBefore=published_before,
        order='date'
    ).execute()

    videos = []
    for item in search_response.get('items', []):
        video_id = item['id']['videoId']
        video_title = item['snippet']['title']
        videos.append((video_id, video_title))

    return videos

# Videoya yorum eklemek için fonksiyon
def comment_on_video(youtube, video_id, comment_text):
    try:
        youtube.commentThreads().insert(
            part='snippet',
            body={
                'snippet': {
                    'videoId': video_id,
                    'topLevelComment': {
                        'snippet': {
                            'textOriginal': comment_text
                        }
                    }
                }
            }
        ).execute()
        return True
    except Exception as e:
        print(f"Yorum eklenirken hata oluştu: {e}")
        return False

# Web uygulaması için ana sayfa
@app.route('/')
def home():
    return render_template('index.html')

# Yapay zeka fonksiyonu
@app.route('/comment', methods=['POST'])
def comment_on_video_route():
    video_count = int(request.json.get('video_count', 0))
    comment_text = request.json.get('comment_text', '')

    youtube = get_authenticated_service()
    current_date = datetime.utcnow()
    commented_videos = []

    for _ in range(video_count):
        published_before = current_date.isoformat("T") + "Z"
        videos = search_recent_turkish_videos(youtube, max_results=1, published_before=published_before)

        if videos:
            video_id, video_title = videos[0]
            if comment_on_video(youtube, video_id, comment_text):
                commented_videos.append({"video_id": video_id, "video_title": video_title})
            current_date -= timedelta(days=1)

    return jsonify(commented_videos)

if __name__ == "__main__":
    app.run(debug=True)
