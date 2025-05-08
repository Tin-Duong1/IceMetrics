import pytest
from fastapi.testclient import TestClient
from server import app
import os

client = TestClient(app)

@pytest.fixture(scope="module")
def auth_headers(test_user):
    return {"Authorization": f"Bearer {test_user['access_token']}"}

@pytest.fixture(scope="module")
def test_video(auth_headers):
    test_file_path = os.path.join(os.path.dirname(__file__), "test.mp4")
    with open(test_file_path, "rb") as file:
        response = client.post(
            "/analyze_video",
            headers=auth_headers,
            files={"video": ("test_video.mp4", file, "video/mp4")},
            data={"name": "Test Video"}
        )

    assert response.status_code == 200, f"Failed to upload: {response.text}"
    video_data = response.json()
    return video_data["video_id"]

def test_get_user_videos(auth_headers, test_video):
    response = client.get("/videos", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_video_analysis(auth_headers, test_video):
    video_id = 1  # Replace with a valid video ID for testing
    response = client.get(f"/video/{video_id}/analysis", headers=auth_headers)
    if response.status_code == 404:
        assert response.json()["detail"] in ["User not found", "Video not found"]
    else:
        assert response.status_code == 200
        assert "video_id" in response.json()
        assert "stats" in response.json()

def test_delete_video(auth_headers, test_video):
    video_id = 1  # Replace with a valid video ID for testing
    response = client.delete(f"/me/delete_video/{video_id}", headers=auth_headers)
    if response.status_code == 404:
        assert response.json()["detail"] in ["User not found", "Video not found"]
    else:
        assert response.status_code == 200
        assert response.json()["detail"] == "Video deleted successfully"
