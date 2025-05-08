import pytest
from fastapi.testclient import TestClient

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from server import app

client = TestClient(app)

# Test user information
user_info = {
    "name": "Pytest",
    "email": "py@test.com",
    "password": "password123"
}

@pytest.fixture(scope="session")
def test_user():
    # Ensure the user is created and signed in before tests
    signup()
    access_token = signin()

    yield {
        "access_token": access_token,
        "email": user_info["email"],
        "password": user_info["password"]
    }

    # Clean up by deleting the user
    delete_user(access_token)

# Sign up function to create a test user
def signup():
    response = client.post("/signup", json=user_info)
    if response.status_code != 200:
        print("Signup failed:", response.json())
    assert response.status_code == 200, f"Signup failed: {response.json()}"
    return response.json()

# Sign in function to get access token
def signin():
    response = client.post(
        "/signin",
        json={
            "email": user_info["email"],
            "password": user_info["password"]
        }
    )
    if response.status_code != 200:
        print("Signin failed:", response.json())
    assert response.status_code == 200, f"Signin failed: {response.json()}"
    return response.json()["access_token"]

# Delete user function to clean up after tests
def delete_user(token):
    response = client.delete(
        "/me/delete_account",
        headers={"Authorization": f"Bearer {token}"}
    )
    if response.status_code != 200:
        print("Delete user failed:", response.json())
    assert response.status_code == 200, f"Delete user failed: {response.json()}"