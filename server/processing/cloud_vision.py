import os
import logging
import datetime
from google.cloud import storage
from google.cloud import videointelligence_v1 as videointelligence
from google.api_core.client_options import ClientOptions
from openai import OpenAI
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

client = None

def initialize_openai_client():
    """Initialize the OpenAI client with API key from environment"""
    global client
    
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        client = OpenAI(api_key=api_key)
        logger.info("OpenAI client initialized from env var")
        return True
    
    logger.warning("OpenAI API key not found in env var")
    return False

initialize_openai_client()

def upload_to_gcs(file_path, bucket_name, destination_blob_name=None):
    try:
        storage_client = storage.Client()
        
        bucket = storage_client.bucket(bucket_name)
        
        if not destination_blob_name:
            destination_blob_name = os.path.basename(file_path)
        
        blob = bucket.blob(destination_blob_name)
        
        logger.info(f"Uploading {file_path} to {bucket_name}/{destination_blob_name}")
        
        blob.upload_from_filename(file_path)
        
        public_url = f"https://storage.googleapis.com/{bucket_name}/{destination_blob_name}"
        
        logger.info(f"File {file_path} uploaded to {bucket_name}/{destination_blob_name}")
        return public_url, blob
    
    except Exception as e:
        logger.error(f"Error uploading file to GCS: {e}")
        raise

def delete_from_gcs(blob):
    try:
        logger.info(f"Deleting {blob.name} from {blob.bucket.name}")
        blob.delete()
        logger.info(f"Successfully deleted {blob.name}")
        return True
    except Exception as e:
        logger.error(f"Error deleting file from GCS: {e}")
        raise

def process_video_with_video_intelligence(gcs_uri):
    """
    Process a video using Google Video Intelligence API
    
    Args:
        gcs_uri: The Google Cloud Storage URI for the video
        
    Returns:
        List of detected labels with confidence scores
    """
    try:
        project_id = os.getenv("GCP_PROJECT_ID")
        
        if not project_id:
            raise ValueError("GCP_PROJECT_ID not set in environment variables")
        
        client_options = ClientOptions(quota_project_id=project_id)
        
        video_client = videointelligence.VideoIntelligenceServiceClient(client_options=client_options)
        
        logger.info(f"Sending video to Google Video Intelligence API: {gcs_uri}")
        
        features = [
            videointelligence.Feature.LABEL_DETECTION,
            videointelligence.Feature.OBJECT_TRACKING
        ]
        
        operation = video_client.annotate_video(
            request={
                "features": features,
                "input_uri": gcs_uri,
                "video_context": videointelligence.VideoContext(
                    label_detection_config=videointelligence.LabelDetectionConfig(
                        label_detection_mode=videointelligence.LabelDetectionMode.SHOT_AND_FRAME_MODE,
                        stationary_camera=False,
                        model="builtin/latest"
                    )
                )
            }
        )
        
        logger.info("Video Intelligence processing started. Waiting for results...")
        
        result = operation.result() 
        
        labels = []
        
        for i, segment_label in enumerate(result.annotation_results[0].segment_label_annotations):
            for category_entity in segment_label.category_entities:
                category = category_entity.description
            
            for segment in segment_label.segments:
                confidence = segment.confidence
                start_time = segment.segment.start_time_offset.total_seconds()
                end_time = segment.segment.end_time_offset.total_seconds()
                
                labels.append({
                    "description": segment_label.entity.description,
                    "category": category if 'category' in locals() else None,
                    "score": confidence,
                    "start_time": start_time,
                    "end_time": end_time
                })
        
        for i, shot_label in enumerate(result.annotation_results[0].shot_label_annotations):
            for segment in shot_label.segments:
                confidence = segment.confidence
                start_time = segment.segment.start_time_offset.total_seconds()
                end_time = segment.segment.end_time_offset.total_seconds()
                
                labels.append({
                    "description": shot_label.entity.description,
                    "category": "Shot",
                    "score": confidence,
                    "start_time": start_time,
                    "end_time": end_time
                })
        
        for i, object_annotation in enumerate(result.annotation_results[0].object_annotations):
            confidence = object_annotation.confidence
            
            labels.append({
                "description": f"Object: {object_annotation.entity.description}",
                "category": "Object",
                "score": confidence,
                "track_id": object_annotation.track_id
            })
        
        logger.info(f"Successfully processed video with Video Intelligence API, found {len(labels)} labels and objects")
        return labels
    
    except Exception as e:
        logger.error(f"Error processing video with Video Intelligence API: {e}")
        raise

def analyze_with_openai(labels, prompt_template=None):
    try:
        global client
        
        if client is None:
            if not initialize_openai_client():
                raise ValueError("OpenAI client not initialized")
        
        labels_by_time = {}
        objects_by_track = {}
        
        for label in labels:
            if "start_time" in label and "end_time" in label:

                start = label["start_time"]
                end = label["end_time"]
                time_key = f"{start:.1f}-{end:.1f}s"
                
                if time_key not in labels_by_time:
                    labels_by_time[time_key] = []
                
                labels_by_time[time_key].append({
                    "description": label["description"],
                    "confidence": label["score"]
                })
            elif "track_id" in label:
                # For object tracks
                track_id = label["track_id"]
                if track_id not in objects_by_track:
                    objects_by_track[track_id] = label
        
        time_segments = []
        for time_key, items in labels_by_time.items():
            items_text = ", ".join([f"{item['description']} ({item['confidence']:.2f})" for item in items])
            time_segments.append(f"Time {time_key}: {items_text}")
        
        objects_text = []
        for track_id, obj in objects_by_track.items():
            objects_text.append(f"- {obj['description']} (confidence: {obj['score']:.2f})")
        
        # Create the final input for OpenAI
        labels_text = "TIME SEGMENTS:\n" + "\n".join(time_segments) + "\n\nDETECTED OBJECTS:\n" + "\n".join(objects_text)
        
        if prompt_template:
            prompt = prompt_template.format(labels=labels_text)
        else:
            prompt = f"""Analyze these labels from a hockey video:
            
{labels_text}

Please provide detailed insights about the hockey game shown, including:
1. Key players and their actions
2. Game style and techniques observed
3. Any notable plays or moments
4. Areas for potential improvement

Focus on hockey-specific analysis."""
        
        logger.info("Sending labels to OpenAI for analysis")
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a sports analysis assistant specialized in interpreting hockey gameplay with the current labels passed in analyze statistics and analyze what can be approved upon hide the underlying labels and do not mention what is passed in."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=120,
            temperature=0.7
        )
        
        analysis = response.choices[0].message.content
        logger.info("Received analysis from OpenAI")
        
        print(analysis)
        return analysis
    
    except Exception as e:
        logger.error(f"Error analyzing with OpenAI: {e}")
        raise

def process_video(video_path, bucket_name, openai_api_key=None, custom_prompt=None, cleanup=True):
    global client
    blob = None
    
    try:
        if openai_api_key:
            client = OpenAI(api_key=openai_api_key)
        elif client is None:
            if not initialize_openai_client():
                raise ValueError("OpenAI API key is needed but is not provided or missing in env var")
        
        blob_name = f"videos/sports/{os.path.basename(video_path)}"
        
        gcs_url, blob = upload_to_gcs(video_path, bucket_name, blob_name)
        
        gcs_uri = f"gs://{bucket_name}/{blob_name}"
        
        labels = process_video_with_video_intelligence(gcs_uri)
        
        if not labels:
            logger.warning("No labels detected in the video.")
        
        openai_analysis = analyze_with_openai(labels, custom_prompt)
        
        results = {
            "gcs_uri": gcs_uri,
            "public_url": gcs_url,
            "labels": labels,
            "analysis": openai_analysis
        }
        
        if cleanup and blob:
            delete_success = delete_from_gcs(blob)
            results["cleanup_success"] = delete_success
        
        return results
        
    except Exception as e:
        if cleanup and blob:
            try:
                delete_from_gcs(blob)
                logger.info("Cleaned up blob after error")
            except Exception as cleanup_error:
                logger.error(f"Failed to delete blob after error: {cleanup_error}")
        
        logger.error(f"Error in video processing pipeline printing error: {e}")
        raise
