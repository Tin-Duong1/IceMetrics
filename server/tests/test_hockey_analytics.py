import sys
import os
import pytest

# Add the server directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

from processing.vision import HockeyAnalytics  # Updated import after fixing path

@pytest.fixture
def hockey_analytics():
    return HockeyAnalytics()

def test_process_video_with_display(hockey_analytics):
    # Use a relative path to the video file in the same directory
    video_path = os.path.join(os.path.dirname(__file__), "test.mp4")

    zone_time, average_players_per_interval = hockey_analytics.process_video(video_path, show_frames=True)
    
    # Assertions
    assert isinstance(zone_time, dict)
    assert "left" in zone_time and "middle" in zone_time and "right" in zone_time
    assert isinstance(average_players_per_interval, list)

def test_process_video_with_invalid_file(hockey_analytics):
    invalid_video_path = "error.mp4"

    with pytest.raises(FileNotFoundError, match=f"Unable to open video file: {invalid_video_path}"):
        hockey_analytics.process_video(invalid_video_path, show_frames=False)
