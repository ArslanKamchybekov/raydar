from config import supabase
from dotenv import load_dotenv
import os
from PIL import Image
from io import BytesIO
from storage3.exceptions import StorageApiError  # Import the StorageApiError

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

bucket_name = "lost_images"
image_id = "b4323c78-fec2-47e2-b215-07b5916e6d3f"

# Access storage
storage = supabase.storage

# Try both extensions
image_data = None
extensions = [".JPG", ".jpg"]

for ext in extensions:
    image_path = f"{image_id}{ext}"
    
    try:
        # Try to get the image from storage
        image_data = storage.from_(bucket_name).download(image_path)
        
        # If image is found, break the loop
        break
    except StorageApiError as e:
        if e.error == "not_found":
            # If file not found, try the next extension
            print(f"Image with extension {ext} not found, trying next extension.")
        else:
            # For other errors, stop the loop
            print(f"Error fetching image with extension {ext}: {e.message}")
            break
    except Exception as e:
        # Handle any other exceptions
        print(f"Unexpected error: {str(e)}")
        break

# After attempting both extensions, check if image_data was found
if image_data:
    try:
        # Load the image from the response data into a BytesIO stream
        image = Image.open(BytesIO(image_data))
        
        # Show the image using PIL
        image.show()
    except Exception as e:
        print(f"Error displaying the image: {e}")
else:
    print("Error: Failed to retrieve the image with both extensions.")
