import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

@pytest.fixture(scope="module")
def auth_headers(test_user):
    return {"Authorization": f"Bearer {test_user['access_token']}"}

def test_read_user_data(auth_headers):
    response = client.get("/me/settings", headers=auth_headers)
    assert response.status_code == 200
    assert "email" in response.json()

def test_read_user_stats(auth_headers):
    response = client.get("/me/stats", headers=auth_headers)
    assert response.status_code == 200
    assert "number_of_videos" in response.json()
    assert "total_duration" in response.json()

def test_change_password(auth_headers):
    new_password_data = {
        "currentPassword": "password123",
        "newPassword": "newpassword123",
        "confirmNewPassword": "newpassword123",
    }
    response = client.post("/me/change_password", json=new_password_data, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["detail"] == "Password updated successfully"
