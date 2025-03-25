from google.cloud import storage
from google.auth import exceptions
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get environment variables
bucket_name = os.getenv("BUCKET_NAME") # Add this to .env file
project_id = os.getenv("GCP_PROJECT_ID")  # Add this to your .env file

if not bucket_name:
    raise ValueError("BUCKET_NAME environment variable is not set")

try:
    client = storage.Client(project=project_id) if project_id else storage.Client()
    bucket = client.get_bucket(bucket_name)
    
    print(f"Connected to bucket: {bucket_name}")
    print("Files in bucket:")
    
    blobs = list(bucket.list_blobs())
    if blobs:
        for blob in blobs:
            print(f" - {blob.name}")
    else:
        print("No files found in the bucket.")
        
except exceptions.DefaultCredentialsError:
    print("Error: Google Cloud credentials not found. Please set up credentials:")
    print("1. Run 'gcloud auth application-default login'")
    print("2. Or set GOOGLE_APPLICATION_CREDENTIALS environment variable")
    exit(1)
except Exception as e:
    print(f"Error accessing bucket: {e}")
    exit(1)

def upload_file_to_bucket(source_file_path, destination_blob_name=None, content_type=None):
    if not os.path.exists(source_file_path):
        raise FileNotFoundError(f"File not found: {source_file_path}")
    
    if destination_blob_name is None:
        destination_blob_name = os.path.basename(source_file_path)
    
    blob = bucket.blob(destination_blob_name)
    
    if content_type:
        blob.content_type = content_type
    
    blob.upload_from_filename(source_file_path)
    
    print(f"File {source_file_path} uploaded to {destination_blob_name} in bucket {bucket_name}")
    
    blob.make_public()
    
    return blob.public_url

def download_file_from_bucket(blob_name, destination_file_path):
    blob = bucket.blob(blob_name)
    
    os.makedirs(os.path.dirname(os.path.abspath(destination_file_path)), exist_ok=True)
    
    blob.download_to_filename(destination_file_path)
    
    print(f"File {blob_name} downloaded to {destination_file_path}")
    
    return destination_file_path

def delete_file_from_bucket(blob_name):
    blob = bucket.blob(blob_name)
    
    if not blob.exists():
        print(f"Warning: File {blob_name} does not exist in bucket")
        return False
        
    blob.delete()
    print(f"File {blob_name} deleted from bucket {bucket_name}")
    return True

def list_files_in_bucket(prefix=None):
    blobs = bucket.list_blobs(prefix=prefix)
    return [blob.name for blob in blobs]

def get_signed_url(blob_name, expiration=3600):
    blob = bucket.blob(blob_name)
    
    if not blob.exists():
        raise FileNotFoundError(f"File {blob_name} not found in bucket")
    
    url = blob.generate_signed_url(
        version="v4",
        expiration=expiration,
        method="GET"
    )
    
    return url

# Example usage
if __name__ == "__main__":
    # List all files in the bucket
    all_files = list_files_in_bucket()
    print(f"Found {len(all_files)} files in bucket {bucket_name}")
    
    # Example: Upload a video file
    # video_path = "/path/to/hockey_game.mp4"
    # if os.path.exists(video_path):
    #     url = upload_file_to_bucket(video_path, "videos/hockey_game.mp4", content_type="video/mp4")
    #     print(f"Video available at: {url}")
    
    # Example: Generate a signed URL for private content
    # if all_files:
    #     first_file = all_files[0]
    #     signed_url = get_signed_url(first_file, expiration=7200)  # 2 hours
    #     print(f"Signed URL for {first_file}: {signed_url}")