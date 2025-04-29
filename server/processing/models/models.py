import os
from ultralytics import YOLO

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_rink_model():
    return YOLO(os.path.join(BASE_DIR, "rink_model.pt"))

def load_player_model():
    return YOLO(os.path.join(BASE_DIR, "player_model.pt"))