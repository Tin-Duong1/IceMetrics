import cv2
import numpy as np
import time
import os
import uuid

from .models.models import load_rink_model, load_player_model  # Corrected import path

class HockeyAnalytics:

    # Load the rink and player detection models
    def __init__(self):
        self.rink_model = load_rink_model()
        self.player_model = load_player_model()

    # Save the uploaded video to a temporary directory
    def save_uploaded_video(self, video, temp_dir: str) -> str:
        unique_filename = f"{uuid.uuid4()}_{video.filename}"
        temp_path = os.path.join(temp_dir, unique_filename)
        with open(temp_path, "wb") as temp_file:
            content = video.file.read()
            temp_file.write(content)
        return temp_path

    # Calculate the percentage of time spent in each zone
    def calculate_zone_percentages(self, zone_time: dict) -> dict:
        total_time = sum(zone_time.values())
        return {
            "left_side_percentage": round((zone_time["left"] / total_time) * 100, 1) if total_time > 0 else 0,
            "middle_zone_percentage": round((zone_time["middle"] / total_time) * 100, 1) if total_time > 0 else 0,
            "right_side_percentage": round((zone_time["right"] / total_time) * 100, 1) if total_time > 0 else 0,
        }

    # Prepare the video statistics for output
    def prepare_video_stats(self, zone_time: dict, average_players: float) -> dict:
        percentages = self.calculate_zone_percentages(zone_time)
        return {
            "left_side_time": zone_time["left"],
            "middle_zone_time": zone_time["middle"],
            "right_side_time": zone_time["right"],
            **percentages,
            "average_players_per_second": average_players,
        }

    # Process the rink and player detection results
    def _process_rink(self, frame, rink_results):
        if rink_results[0].masks is None:
            return frame

        rink_masks = rink_results[0].masks.data.cpu().numpy()
        for rink_mask in rink_masks:
            resized_rink_mask = cv2.resize(rink_mask, (frame.shape[1], frame.shape[0]))
            height, width = resized_rink_mask.shape
            zone_width = width // 3

            colored_mask = np.zeros_like(frame, dtype=np.uint8)
            colored_mask[:, :zone_width][resized_rink_mask[:, :zone_width] > 0] = (255, 0, 0)
            colored_mask[:, zone_width:2 * zone_width][resized_rink_mask[:, zone_width:2 * zone_width] > 0] = (0, 255, 0)
            colored_mask[:, 2 * zone_width:][resized_rink_mask[:, 2 * zone_width:] > 0] = (0, 0, 255)

            frame = cv2.addWeighted(frame, 1.0, colored_mask, 0.5, 0)
        return frame

    # Process player detection results and count players in each zone
    def _process_players(self, frame, player_results, zone_width):
        if player_results[0].boxes is None:
            return 0, {"left": 0, "middle": 0, "right": 0}

        player_boxes = player_results[0].boxes.xyxy.cpu().numpy()
        zone_counts = {"left": 0, "middle": 0, "right": 0}
        player_count = 0

        for box in player_boxes:
            x1, y1, x2, y2 = map(int, box)
            player_center_x = (x1 + x2) // 2
            if player_center_x < zone_width:
                zone_counts["left"] += 1
                color = (255, 0, 0)
            elif player_center_x < 2 * zone_width:
                zone_counts["middle"] += 1
                color = (0, 255, 0)
            else:
                zone_counts["right"] += 1
                color = (0, 0, 255)

            player_count += 1
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, "Player", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        return player_count, zone_counts

    # Update the zone time based on the elapsed time and player counts
    def _update_zone_time(self, zone_time, zone_counts, last_update_time):
        current_time = time.time()
        elapsed_time = current_time - last_update_time
        max_zone = max(zone_counts, key=zone_counts.get)
        zone_time[max_zone] += elapsed_time
        return current_time

    # Main function to process the video and analyze player zones
    def process_video(self, video_path, show_frames: bool = False):  # Default is False
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():  # Check if the video file was successfully opened
            raise FileNotFoundError(f"Unable to open video file: {video_path}")

        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        video_duration = total_frames / fps if fps > 0 else 0

        zone_time = {"left": 0, "middle": 0, "right": 0}
        last_update_time = time.time()

        player_counts = []
        frame_count = 0
        average_players_per_interval = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            rink_results = self.rink_model(frame)
            player_results = self.player_model(frame.copy())

            frame = self._process_rink(frame, rink_results)
            player_count, zone_counts = self._process_players(frame, player_results, frame.shape[1] // 3)

            player_counts.append(player_count)
            frame_count += 1

            if frame_count >= 50:
                average_players = sum(player_counts) / len(player_counts) if player_counts else 0
                average_players_per_interval.append(average_players)
                player_counts = []
                frame_count = 0

            last_update_time = self._update_zone_time(zone_time, zone_counts, last_update_time)

            cv2.putText(frame, f"Left Zone Time: {zone_time['left']:.2f}s", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
            cv2.putText(frame, f"Middle Zone Time: {zone_time['middle']:.2f}s", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            cv2.putText(frame, f"Right Zone Time: {zone_time['right']:.2f}s", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

            if show_frames:
                cv2.imshow("Ice Surface and Player Detection", frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        cap.release()
        if show_frames:
            cv2.destroyAllWindows()

        return zone_time, average_players_per_interval
