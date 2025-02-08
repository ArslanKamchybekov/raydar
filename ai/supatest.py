from config import supabase
from dotenv import load_dotenv
import os
from PIL import Image
from io import BytesIO

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

bucket_name = "lost_images"
image_path = "da19200b-102d-4447-8329-991fe753fd1d.png"

# Access storage
storage = supabase.storage

# Get the image from the storage
image_data = storage.from_(bucket_name).download(image_path)

# Check if the image data is valid (non-empty)
if image_data:
    # Load the image from the response data into a BytesIO stream
    image = Image.open(BytesIO(image_data))
    
    # Show the image using PIL
    image.show()
else:
    print("Error: Failed to retrieve the image.")
