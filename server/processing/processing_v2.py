def process_video(video_path):
    import cv2
    import numpy as np
    from ultralytics import YOLO
    import time

    # Load the YOLOv8 segmentation model for rink and player detection
    rink_model = YOLO("models/updatedRink_model.pt")  # Rink segmentation model
    player_model = YOLO("models/player_model.pt")  # Player detection model

    # Load video file or webcam (use 0 for webcam)
    cap = cv2.VideoCapture(video_path)

    # Calculate video duration
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    video_duration = total_frames / fps if fps > 0 else 0

    # Initialize zone time counters
    zone_time = {"left": 0, "middle": 0, "right": 0}
    last_update_time = time.time()

    # Initialize variables for average players calculation
    player_counts = []
    frame_count = 0
    average_players_per_interval = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Run YOLOv8 segmentation inference for rink
        rink_results = rink_model(frame)
        player_results = player_model(frame.copy())  # Use a copy of the unmodified frame

        # Get rink masks
        if rink_results[0].masks is not None:
            rink_masks = rink_results[0].masks.data.cpu().numpy()  # (N, H, W)

            for rink_mask in rink_masks:
                # Resize the rink mask to match the frame dimensions
                resized_rink_mask = cv2.resize(rink_mask, (frame.shape[1], frame.shape[0]))

                # Split the rink mask into three vertical zones
                height, width = resized_rink_mask.shape
                zone_width = width // 3

                # Create a single-color mask for each zone
                colored_mask = np.zeros_like(frame, dtype=np.uint8)

                # Left zone (red)
                colored_mask[:, :zone_width][resized_rink_mask[:, :zone_width] > 0] = (255, 0, 0)
                # Middle zone (green)
                colored_mask[:, zone_width:2 * zone_width][resized_rink_mask[:, zone_width:2 * zone_width] > 0] = (0, 255, 0)
                # Right zone (blue)
                colored_mask[:, 2 * zone_width:][resized_rink_mask[:, 2 * zone_width:] > 0] = (0, 0, 255)

                # Blend mask with the original frame
                frame = cv2.addWeighted(frame, 1.0, colored_mask, 0.5, 0)

        # Detect players in the original frame
        if player_results[0].boxes is not None:
            player_boxes = player_results[0].boxes.xyxy.cpu().numpy()  # (N, 4)

            # Count players in each zone
            zone_counts = {"left": 0, "middle": 0, "right": 0}
            player_count = 0  # Total players in the frame

            for box in player_boxes:
                x1, y1, x2, y2 = map(int, box)  # Player bounding box coordinates

                # Determine which zone the player is in
                player_center_x = (x1 + x2) // 2
                if player_center_x < zone_width:
                    zone_counts["left"] += 1
                    color = (255, 0, 0)  # Red for left zone
                elif player_center_x < 2 * zone_width:
                    zone_counts["middle"] += 1
                    color = (0, 255, 0)  # Green for middle zone
                else:
                    zone_counts["right"] += 1
                    color = (0, 0, 255)  # Blue for right zone

                player_count += 1  # Increment total player count

                # Draw the player bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, "Player", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            # Add the player count to the list
            player_counts.append(player_count)
            frame_count += 1

            # Check if 50 frames have passed
            if frame_count >= 50:
                # Calculate the average players for the interval
                average_players = sum(player_counts) / len(player_counts) if player_counts else 0
                average_players_per_interval.append(average_players)

                # Reset for the next interval
                player_counts = []
                frame_count = 0

            # Update zone time based on the zone with the most players
            current_time = time.time()
            elapsed_time = current_time - last_update_time
            max_zone = max(zone_counts, key=zone_counts.get)
            zone_time[max_zone] += elapsed_time
            last_update_time = current_time

            # Display zone time on the frame
            cv2.putText(frame, f"Left Zone Time: {zone_time['left']:.2f}s", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
            cv2.putText(frame, f"Middle Zone Time: {zone_time['middle']:.2f}s", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            cv2.putText(frame, f"Right Zone Time: {zone_time['right']:.2f}s", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        # Display the frame
        cv2.imshow("Ice Surface and Player Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    # Print average players per interval for debugging
    print(f"Average players per 50 frames: {average_players_per_interval}")

    # Return the zone times and average players per interval
    return zone_time, average_players_per_interval

if __name__ == "__main__":
    video_path = "test3.mp4"  # Hardcoded video file path for testing
    zone_time, average_players_per_interval = process_video(video_path)
    print("Zone Times:")
    print(f"Left Zone Time: {zone_time['left']:.2f}s")
    print(f"Middle Zone Time: {zone_time['middle']:.2f}s")
    print(f"Right Zone Time: {zone_time['right']:.2f}s")
    print("Average Players Per 50 Frames:", average_players_per_interval)
