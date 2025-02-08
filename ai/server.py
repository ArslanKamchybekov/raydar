from flask import Flask, request, jsonify, abort
from flask_cors import CORS

from config import supabase
from dotenv import load_dotenv
import os
from io import BytesIO

import torch
import torchvision.models as models
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import matplotlib.pyplot as plt

load_dotenv()

# SUPABASE INIT
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = supabase.create_client(supabase_url=supabase_url, supabase_key=supabase_key)
storage = supabase.storage
bucket_name = "lost_images"

# MODEL INIT
# FIXME: This is giving warnings. Fix it before submission.
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



@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"message": "Server is up and running!"}), 200

@app.route('/get_keywords', methods=["POST"])
def get_image():
    # Get only keywords from image
    # Input -> { image_id: string, description: string }
    # Go to lost_items bucket and get ${image_id}.jpg
    # Output -> { keyword: string }
    data = request.get_json()
    image_id = data["image_id"]
    image_path = image_id + ".jpg"
    image_data = storage.from_(bucket_name).download(image_path)

    if not image_data:
        abort(400, "Bad Request: Missing or invalid parameter")

    


    return jsonify({"keywords": ["Hello", "world"]})
     

    pass


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500, debug=False)
    
    
