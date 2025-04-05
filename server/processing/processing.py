import cv2
import numpy as np
import os
import time
from ultralytics import YOLO

class HockeyAnalytics:
    def __init__(self):
        self.stats = {
            'left_side': {
                'time': 0,
                'count': 0
            },
            'right_side': {
                'time': 0,
                'count': 0
            }
        }
        
        self.current_side_with_more = 'neutral' 
        
        self.center_x = None
        
        self.last_frame_time = None
        
        try:
            self.yolo_model = YOLO("yolov8n.pt")
            self.using_yolo = True
            print("YOLO model loaded successfully")
        except Exception as e:
            print(f"Error loading YOLO model: {e}")
            print("Falling back to contour-based detection")
            self.using_yolo = False

    def define_zones(self, frame_shape):
        """Define center line for player position assessment"""
        height, width = frame_shape[:2]
        self.center_x = width // 2

    def detect_players(self, frame):
        """Detect players using YOLO or contour detection as fallback"""
        if self.using_yolo:
            return self.detect_players_yolo(frame)
        else:
            return self.detect_players_contour(frame)
    
    def detect_players_yolo(self, frame):
        """Detect players using YOLO model"""
        results = self.yolo_model(frame, classes=[0]) 
        
        player_boxes = []
        if results:
            boxes = results[0].boxes
            
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                
                confidence = box.conf[0].item() if hasattr(box, 'conf') else 0.0
                
                center_x = (x1 + x2) // 2
                center_y = (y1 + y2) // 2
                
                area = (x2 - x1) * (y2 - y1)
                
                player_boxes.append({
                    'box': (x1, y1, x2, y2),
                    'center': (center_x, center_y),
                    'area': area,
                    'confidence': confidence
                })
        
        return player_boxes
    
    def detect_players_contour(self, frame):
        """Detect players using contour detection (fallback method)"""
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blur_frame = cv2.GaussianBlur(gray_frame, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(blur_frame, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                      cv2.THRESH_BINARY_INV, 11, 2)
        
        kernel = np.ones((3, 3), np.uint8)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        min_contour_area = 200
        max_contour_area = 15000
        
        player_boxes = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if min_contour_area < area < max_contour_area:
                x, y, w, h = cv2.boundingRect(contour)
                
                aspect_ratio = float(h) / w
                if 1.2 < aspect_ratio < 4.0:
                    padding_x = int(w * 0.15)
                    padding_y = int(h * 0.15)
                    x = max(0, x - padding_x)
                    y = max(0, y - padding_y)
                    w = min(frame.shape[1] - x, w + 2 * padding_x)
                    h = min(frame.shape[0] - y, h + 2 * padding_y)
                    
                    center_x = x + w // 2
                    center_y = y + h // 2
                    
                    player_boxes.append({
                        'box': (x, y, x + w, y + h),
                        'center': (center_x, center_y),
                        'area': area
                    })
        
        return player_boxes
    
    def count_players_by_side(self, player_boxes):
        """Count players on each side of the center line"""
        left_count = 0
        right_count = 0
        
        left_side_players = []
        right_side_players = []
        
        for player in player_boxes:
            center_x = player['center'][0]
            
            if center_x < self.center_x:
                # Left side
                left_count += 1
                left_side_players.append(player)
            else:
                # Right side
                right_count += 1
                right_side_players.append(player)
        
        # Update counts in stats
        self.stats['left_side']['count'] = left_count
        self.stats['right_side']['count'] = right_count
        
        # Determine which side has more players
        if left_count > right_count:
            self.current_side_with_more = 'left'
        elif right_count > left_count:
            self.current_side_with_more = 'right'
        else:
            self.current_side_with_more = 'neutral'
        
        return {
            'left': left_side_players,
            'right': right_side_players
        }
    
    def update_statistics(self, time_delta):
        """Update time statistics for the side with more players"""
        if self.current_side_with_more == 'left':
            self.stats['left_side']['time'] += time_delta
        elif self.current_side_with_more == 'right':
            self.stats['right_side']['time'] += time_delta
    
    def draw_visualization(self, frame, players_by_side):
        """Draw visualization elements on frame"""
        result = frame.copy()
        
        cv2.line(result, (self.center_x, 0), (self.center_x, frame.shape[0]), 
                (255, 255, 255), 2)
        
        for player in players_by_side['left']:
            x1, y1, x2, y2 = player['box']
            cv2.rectangle(result, (x1, y1), (x2, y2), (255, 0, 0), 2) 
            
            if self.using_yolo and 'confidence' in player:
                conf_text = f"{player['confidence']:.2f}"
                cv2.putText(result, conf_text, (x1, y1 - 5),
                          cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)
        
        for player in players_by_side['right']:
            x1, y1, x2, y2 = player['box']
            cv2.rectangle(result, (x1, y1), (x2, y2), (0, 0, 255), 2)  
            
            if self.using_yolo and 'confidence' in player:
                conf_text = f"{player['confidence']:.2f}"
                cv2.putText(result, conf_text, (x1, y1 - 5),
                          cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        
        cv2.putText(result, "Left Side", (10, frame.shape[0] - 10), 
                  cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
        cv2.putText(result, "Right Side", (frame.shape[1] - 120, frame.shape[0] - 10), 
                  cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        
        left_count = self.stats['left_side']['count']
        right_count = self.stats['right_side']['count']
        
        left_color = (255, 255, 255) 
        right_color = (255, 255, 255)  
        
        if self.current_side_with_more == 'left':
            left_color = (255, 255, 0)  
        elif self.current_side_with_more == 'right':
            right_color = (255, 255, 0)  
        
        cv2.putText(result, f"Left count: {left_count}", 
                   (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, left_color, 2)
        cv2.putText(result, f"Right count: {right_count}", 
                   (frame.shape[1] - 180, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, right_color, 2)
        
        left_time = self.stats['left_side']['time']
        right_time = self.stats['right_side']['time']
        total_time = left_time + right_time
        
        left_time_str = f"{int(left_time/60):02d}:{int(left_time%60):02d}"
        right_time_str = f"{int(right_time/60):02d}:{int(right_time%60):02d}"
        
        if total_time > 0:
            left_pct = (left_time / total_time) * 100
            right_pct = (right_time / total_time) * 100
        else:
            left_pct = right_pct = 0
        
        cv2.putText(result, f"Left time: {left_time_str} ({left_pct:.1f}%)", 
                   (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
        cv2.putText(result, f"Right time: {right_time_str} ({right_pct:.1f}%)", 
                   (frame.shape[1] - 280, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        
        method_text = "YOLO Detection" if self.using_yolo else "Contour Detection"
        cv2.putText(result, method_text, (frame.shape[1] // 2 - 80, 30),
                  cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        return result
    
    def process_frame(self, frame):
        """Process a single frame and update all analytics"""
        current_time = time.time()
        if self.last_frame_time is None:
            time_delta = 0
        else:
            time_delta = current_time - self.last_frame_time
        self.last_frame_time = current_time
        
        player_boxes = self.detect_players(frame)
        
        players_by_side = self.count_players_by_side(player_boxes)
        
        self.update_statistics(time_delta)
        
        result_frame = self.draw_visualization(frame, players_by_side)
        
        return result_frame

def main():
    """Main function to run hockey analytics automatically"""
    import os
    
    video_path = './trimmed_clip.mp4'  
    
    print(f"Attempting to open video from: {video_path}")
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Could not open video file: {video_path}")
        print("Checking if webcam is available...")
        cap = cv2.VideoCapture(0)  # Try webcam as fallback
        if not cap.isOpened():
            print("Could not access webcam either. Exiting.")
            return
        print("Using webcam instead")
    else:
        print(f"Successfully opened video: {video_path}")
    
    ret, first_frame = cap.read()
    if not ret:
        print("Failed to read first frame")
        return
    
    analytics = HockeyAnalytics()
    analytics.define_zones(first_frame.shape)
    
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    
    cv2.namedWindow("Player Position Analytics", cv2.WINDOW_NORMAL)
    
    print("\n===== PLAYER POSITION ANALYTICS =====")
    print("Press 'q' to quit")
    print("===================================\n")
    
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        result_frame = analytics.process_frame(frame)
        
        cv2.imshow("Player Position Analytics", result_frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        
        frame_count += 1
        if frame_count % 100 == 0:
            print(f"Processed {frame_count} frames")
    
    print("\n===== FINAL PLAYER POSITION STATISTICS =====")
    left_time = analytics.stats['left_side']['time']
    right_time = analytics.stats['right_side']['time']
    total_time = left_time + right_time
    
    if total_time > 0:
        print(f"Left Side Time: {int(left_time)}s ({left_time/total_time*100:.1f}%)")
        print(f"Right Side Time: {int(right_time)}s ({right_time/total_time*100:.1f}%)")
        print(f"Side with more time: {'Left' if left_time > right_time else 'Right'}")
    else:
        print("No data collected")
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()