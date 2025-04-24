import cv2
import numpy as np
import os
import time
from ultralytics import YOLO

class HockeyAnalyticsV2:
    def __init__(self):
        """Initialize analytics with three zones (left, middle, right)"""
        self.stats = {
            'left_side': {
                'time': 0,
                'count': 0
            },
            'middle_zone': {
                'time': 0,
                'count': 0
            },
            'right_side': {
                'time': 0,
                'count': 0
            }
        }
        
        self.current_side_with_more = 'neutral'
        self.zone_width = None
        self.last_frame_time = None
        
        self.total_player_count = 0
        self.frame_count_in_second = 0
        self.average_players_per_second = []
        
        # Load YOLO models
        try:
            # Try to load rink model first
            self.rink_model = YOLO("models/updatedRink_model.pt")
            self.player_model = YOLO("models/player_model.pt")
            self.using_advanced_models = True
            print("Advanced YOLO models loaded successfully")
        except Exception as e:
            print(f"Error loading advanced YOLO models: {e}")
            print("Falling back to basic person detection")
            try:
                self.yolo_model = YOLO("yolov8n.pt")
                self.using_yolo = True
                self.using_advanced_models = False
                print("Basic YOLO model loaded successfully")
            except Exception as e2:
                print(f"Error loading basic YOLO model: {e2}")
                print("Falling back to contour-based detection")
                self.using_yolo = False
                self.using_advanced_models = False

    def define_zones(self, frame_shape):
        """Define three zones for player position assessment"""
        height, width = frame_shape[:2]
        self.zone_width = width // 3
        
        # Zone boundaries
        self.zone_boundaries = {
            'left': (0, self.zone_width),
            'middle': (self.zone_width, 2 * self.zone_width),
            'right': (2 * self.zone_width, width)
        }

    def detect_players_advanced(self, frame):
        """Detect players using the specialized hockey player model"""
        player_boxes = []
        
        results = self.player_model(frame)
        
        if results[0].boxes is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy()
            
            for box in boxes:
                x1, y1, x2, y2 = map(int, box)
                
                center_x = (x1 + x2) // 2
                center_y = (y1 + y2) // 2
                
                area = (x2 - x1) * (y2 - y1)
                
                player_boxes.append({
                    'box': (x1, y1, x2, y2),
                    'center': (center_x, center_y),
                    'area': area
                })
                
        return player_boxes

    def detect_players(self, frame):
        """Detect players using the appropriate method based on available models"""
        if self.using_advanced_models:
            return self.detect_players_advanced(frame)
        elif self.using_yolo:
            return self.detect_players_yolo(frame)
        else:
            return self.detect_players_contour(frame)
    
    def detect_players_yolo(self, frame):
        """Detect players using basic YOLO model (person class)"""
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
    
    def count_players_by_zone(self, player_boxes):
        """Count players in each of the three zones"""
        zone_counts = {'left_side': 0, 'middle_zone': 0, 'right_side': 0}
        zone_players = {'left_side': [], 'middle_zone': [], 'right_side': []}
        
        for player in player_boxes:
            center_x = player['center'][0]
            
            if center_x < self.zone_boundaries['left'][1]:
                # Left zone
                zone_counts['left_side'] += 1
                zone_players['left_side'].append(player)
            elif center_x < self.zone_boundaries['middle'][1]:
                # Middle zone
                zone_counts['middle_zone'] += 1
                zone_players['middle_zone'].append(player)
            else:
                # Right zone
                zone_counts['right_side'] += 1
                zone_players['right_side'].append(player)
        
        # Update counts in stats
        for zone in zone_counts:
            self.stats[zone]['count'] = zone_counts[zone]
        
        # Determine which zone has more players
        max_zone = max(zone_counts, key=zone_counts.get)
        max_count = zone_counts[max_zone]
        
        # Check if there's a tie
        if list(zone_counts.values()).count(max_count) > 1:
            self.current_side_with_more = 'neutral'
        else:
            self.current_side_with_more = max_zone
        
        return zone_players
    
    def update_statistics(self, time_delta):
        """Update time statistics for the zone with more players"""
        if self.current_side_with_more != 'neutral':
            self.stats[self.current_side_with_more]['time'] += time_delta
    
    def draw_visualization(self, frame, players_by_zone):
        """Draw visualization elements on frame"""
        result = frame.copy()
        
        # Draw zone dividers
        cv2.line(result, (self.zone_boundaries['left'][1], 0), 
                (self.zone_boundaries['left'][1], frame.shape[0]), 
                (255, 255, 255), 2)
        
        cv2.line(result, (self.zone_boundaries['middle'][1], 0), 
                (self.zone_boundaries['middle'][1], frame.shape[0]), 
                (255, 255, 255), 2)
        
        # Draw player boxes with zone-specific colors
        zone_colors = {
            'left_side': (255, 0, 0),  # Red
            'middle_zone': (0, 255, 0),  # Green
            'right_side': (0, 0, 255)   # Blue
        }
        
        for zone, players in players_by_zone.items():
            color = zone_colors[zone]
            for player in players:
                x1, y1, x2, y2 = player['box']
                cv2.rectangle(result, (x1, y1), (x2, y2), color, 2)
                
                if 'confidence' in player:
                    conf_text = f"{player['confidence']:.2f}"
                    cv2.putText(result, conf_text, (x1, y1 - 5),
                              cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
        
        # Display zone labels and statistics
        zone_labels = {
            'left_side': "Left Zone",
            'middle_zone': "Middle Zone",
            'right_side': "Right Zone"
        }
        
        y_pos = 30
        for zone, label in zone_labels.items():
            color = zone_colors[zone]
            highlight = (255, 255, 0) if self.current_side_with_more == zone else (255, 255, 255)
            
            count = self.stats[zone]['count']
            time_value = self.stats[zone]['time']
            time_str = f"{int(time_value/60):02d}:{int(time_value%60):02d}"
            
            # Calculate total time
            total_time = sum(self.stats[z]['time'] for z in self.stats)
            pct = (time_value / total_time * 100) if total_time > 0 else 0
            
            cv2.putText(result, f"{label}: {count} players", 
                      (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.6, highlight, 2)
            cv2.putText(result, f"Time: {time_str} ({pct:.1f}%)", 
                      (10, y_pos + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            
            y_pos += 60
        
        method_text = "Advanced Hockey Analytics" if self.using_advanced_models else "Basic Player Detection"
        cv2.putText(result, method_text, (frame.shape[1] // 2 - 100, frame.shape[0] - 20),
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
        
        # Detect players
        player_boxes = self.detect_players(frame)
        
        # Count players and update statistics
        players_by_zone = self.count_players_by_zone(player_boxes)
        self.update_statistics(time_delta)
        
        # Update player count tracking
        self.total_player_count += len(player_boxes)
        self.frame_count_in_second += 1
        
        # Calculate average players every 50 frames
        if self.frame_count_in_second == 50:
            average = self.total_player_count / 50
            self.average_players_per_second.append(average)
            self.total_player_count = 0
            self.frame_count_in_second = 0
        
        # Draw visualization
        result_frame = self.draw_visualization(frame, players_by_zone)
        
        return result_frame

    def get_average_players_per_second(self):
        """Return the list of average players per second for database storage"""
        return self.average_players_per_second

    def get_stats(self):
        """Get formatted statistics for external use"""
        total_time = sum(self.stats[zone]['time'] for zone in self.stats)
        
        formatted_stats = {}
        for zone, data in self.stats.items():
            formatted_stats[zone] = {
                'time': data['time'],
                'percentage': (data['time'] / total_time * 100) if total_time > 0 else 0
            }
            
        return formatted_stats
