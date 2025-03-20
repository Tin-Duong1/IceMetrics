import cv2
import numpy as np

def read_video(filestream: str):
    vid_cap = cv2.VideoCapture(filestream)
    
    if not vid_cap.isOpened():
        raise Exception("Error opening video stream or file")
    
    return vid_cap

