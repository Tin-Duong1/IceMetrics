import os
import logging
from google.cloud import storage
from google.cloud import vision
import openai
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize environment variables
load_dotenv()

def upload_to_gcs(file_path, bucket_name, destination_blob_name=None):
    try:
        storage_client = storage.Client()
        
        bucket = storage_client.bucket(bucket_name)
        
        if not destination_blob_name:
            destination_blob_name = os.path.basename(file_path)
        
        blob = bucket.blob(destination_blob_name)
        
        logger.info(f"Uploading {file_path} to {bucket_name}/{destination_blob_name}")
        blob.upload_from_filename(file_path)
        
        blob.make_public()
        
        logger.info(f"File {file_path} uploaded to {bucket_name}/{destination_blob_name}")
        return blob.public_url, blob
    
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

def process_video_with_vision(gcs_uri):
    try:
        client = vision.ImageAnnotatorClient()
        
        features = [
            vision.Feature(type=vision.Feature.Type.LABEL_DETECTION),
            vision.Feature(type=vision.Feature.Type.OBJECT_LOCALIZATION)
        ]
        
        request = vision.AnnotateImageRequest(
            image=vision.Image(source=vision.ImageSource(gcs_uri=gcs_uri)),
            features=features
        )
        
        logger.info(f"Sending video to Google Vision API: {gcs_uri}")
        
        response = client.annotate_image(request)
        
        labels = []
        if response.label_annotations:
            for label in response.label_annotations:
                labels.append({
                    "description": label.description,
                    "score": label.score,
                    "topicality": label.topicality
                })
        
        if response.localized_object_annotations:
            for object_annotation in response.localized_object_annotations:
                labels.append({
                    "description": f"Object: {object_annotation.name}",
                    "score": object_annotation.score,
                    "topicality": 1.0 
                })
        
        logger.info(f"Successfully processed video with Vision API, found {len(labels)} labels and objects")
        return labels
    
    except Exception as e:
        logger.error(f"Error processing video with Vision API: {e}")
        raise

def analyze_with_openai(labels, prompt_template=None):
    try:
        labels_text = "\n".join([f"- {label['description']} (confidence: {label['score']:.2f})" for label in labels])
        
        if prompt_template:
            prompt = prompt_template.format(labels=labels_text)
        else:
            prompt = f"Analyze these labels from a sports video:\n{labels_text}\n\nPlease provide insights about the game shown."
        
        logger.info("Sending labels to OpenAI for analysis")
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a sports analysis assistant specialized in interpreting video content."},
                {"role": "user", "content": prompt}
            ]
        )
        
        analysis = response.choices[0].message.content
        logger.info("Received analysis from OpenAI")
        
        return analysis
    
    except Exception as e:
        logger.error(f"Error analyzing with OpenAI: {e}")
        raise

def initialize_openai_api():
    if openai.api_key:
        return True
    
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        openai.api_key = api_key
        logger.info("OpenAI API key initialized from environment variables")
        return True
    
    logger.warning("OpenAI API key not found in environment variables")
    return False

def process_video(video_path, bucket_name, openai_api_key=None, custom_prompt=None, cleanup=True):
    
    blob = None
    try:
        if openai_api_key:
            openai.api_key = openai_api_key
        elif not initialize_openai_api():
            raise ValueError("OpenAI API key is required but not provided also not found in env var")
        
        blob_name = f"videos/sports/{os.path.basename(video_path)}"
        
        gcs_url, blob = upload_to_gcs(video_path, bucket_name, blob_name)
        
        gcs_uri = f"gs://{bucket_name}/{blob_name}"
        
        labels = process_video_with_vision(gcs_uri)
        
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