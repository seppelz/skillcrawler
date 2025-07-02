import os
import requests
from typing import Optional

def get_youtube_api_key():
    return os.getenv('YOUTUBE_API_KEY', '')

YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos'

def fetch_video_metadata(youtube_id: str) -> Optional[dict]:
    api_key = get_youtube_api_key()
    params = {
        'id': youtube_id,
        'part': 'snippet,contentDetails',
        'key': api_key
    }
    resp = requests.get(YOUTUBE_API_URL, params=params)
    if resp.status_code != 200:
        return None
    items = resp.json().get('items', [])
    if not items:
        return None
    item = items[0]
    snippet = item['snippet']
    content_details = item['contentDetails']
    return {
        'youtube_id': youtube_id,
        'title': snippet.get('title'),
        'description': snippet.get('description'),
        'published_at': snippet.get('publishedAt'),
        'duration': content_details.get('duration'),
        'thumbnails': snippet.get('thumbnails'),
        'channel_title': snippet.get('channelTitle'),
    } 