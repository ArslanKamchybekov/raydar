import torch
import torchvision.models as models
import torch.nn as nn
from torchvision import transforms
from PIL import Image
from io import BytesIO
import os

# MODEL INIT
class SketchClassifier:
    def __init__(self, model_path='resnet18_trained_model.pth', class_labels_path='classes.txt'):
        """Initialize the image classifier."""
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.class_labels = self._load_class_labels(class_labels_path)
        self.model = self._load_model(model_path)
        self.transform = self._get_transform()
    
    def _load_class_labels(self, class_labels_path):
        """Load class labels from a file."""
        if not os.path.exists(class_labels_path):
            raise FileNotFoundError(f"Class labels file '{class_labels_path}' not found.")
        with open(class_labels_path, 'r') as file:
            return [line.strip() for line in file.readlines()]
    
    def _load_model(self, model_path):
        """Load the trained model."""
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file '{model_path}' not found.")
        model = models.resnet18(weights=None)  # Avoid warnings, no pre-trained weights
        model.fc = nn.Linear(model.fc.in_features, len(self.class_labels))  # Adjust for classes
        model.load_state_dict(torch.load(model_path, map_location=self.device))
        model = model.to(self.device)
        model.eval()  # Set to evaluation mode
        return model
    
    def _get_transform(self):
        """Define the image preprocessing pipeline."""
        return transforms.Compose([
            transforms.Resize((150, 150)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def predict(self, image_data):
        """Predict the class of an input image."""
        image = Image.open(BytesIO(image_data))
        image = self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(image)
            _, predicted_class = torch.max(outputs, 1)
        
        return self.class_labels[predicted_class.item()]
