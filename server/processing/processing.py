import os
from processing.vision import HockeyAnalytics
from processing.summary import summarize_stats
from fastapi import UploadFile

hockey_analytics = HockeyAnalytics()

def process_and_summarize_video(video: UploadFile, name: str, temp_dir: str):
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = hockey_analytics.save_uploaded_video(video, temp_dir)

    try:
        zone_time, average_players_per_interval = hockey_analytics.process_video(temp_path)
        stats = hockey_analytics.prepare_video_stats(zone_time, average_players_per_interval)
        summary = summarize_stats(stats)

        return {
            "stats": stats,
            "summary": summary,
            "duration": int(sum(zone_time.values()))
        }, temp_path
    except Exception as e:
        raise RuntimeError(f"Error processing video: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
