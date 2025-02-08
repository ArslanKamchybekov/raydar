from flask import Flask, request, jsonify, abort
from flask_cors import CORS

from config import supabase
from dotenv import load_dotenv
from io import BytesIO
from storage3.exceptions import StorageApiError # type: ignore

import torch
import torchvision.models as models
import torch.nn as nn
from torchvision import transforms
from PIL import Image

from text_extraction.main import predict_the_description_main

load_dotenv()
storage = supabase.storage
bucket_name = "lost_images"

# MODEL INIT
# FIXME: This is giving warnings. Fix it before submission.
#########################
class_labels_path = 'classes.txt'  
with open(class_labels_path, 'r') as file:
    class_labels = [line.strip() for line in file.readlines()]
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet18(pretrained=False)  # Don't load the pre-trained weights
model.fc = nn.Linear(model.fc.in_features, 250)  # Set to 250 classes (based on trained model)
model.load_state_dict(torch.load('resnet18_trained_model.pth'))
model = model.to(device)  # Move to GPU if available
model.eval()  # Set to evaluation mode (important!)
transform = transforms.Compose([
    transforms.Resize((150, 150)),  # Resize to 150x150
    transforms.ToTensor(),  # Convert the image to a tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize
])



app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def predict_the_image(image_data):
    image = Image.open(BytesIO(image_data))
    image = transform(image).unsqueeze(0)
    image = image.to(device)

    with torch.no_grad():  # No need to calculate gradients during inference
        outputs = model(image)  # Get raw outputs (logits)
        # Get the predicted class (the one with the highest score)
        _, predicted_class = torch.max(outputs, 1)

    return class_labels[predicted_class.item()]


def predict_the_description(input_description, threshold=0.45):
    description_analysis_rows = predict_the_description_main(input_description, threshold)
    return description_analysis_rows

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"message": "Server is up and running!"}), 200

@app.route('/get_images', methods=["POST"])
def get_images():
    # Get all images that match description and image
    # Input -> { image_id: string, description: string }
    # Output -> { images: rows[] }

    data = request.get_json()
    image_id = data["image_id"]
    description = data["description"]
    threshold = data["threshold"]
    extensions = [".JPG", ".jpg", ".png"]

    for ext in extensions:
        image_path = f"{image_id}{ext}"
        
        try:
            # Try to get the image from storage
            image_data = storage.from_(bucket_name).download(image_path)
            
            # If image is found, break the loop
            break
        except StorageApiError as e:
            if e.code == "not_found":
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

    label = predict_the_image(image_data)
    print(f"Predicted keyword: {label}")


    # This is Josh's section to analyze the description. He will return an array of rows.

    description_analysis_rows = predict_the_description(description, threshold)
    
    #-----------------------------------------------------------------------------------

    # Once Josh is done with analysis, he will return rows. Merge with your rows. And return all rows.

    return jsonify({"rows": "label"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500, debug=False)
    
    
