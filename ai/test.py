import torch
import torchvision.models as models
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import matplotlib.pyplot as plt

class_labels_path = 'sketch_classifier/classes.txt'  # Replace with the actual path to your class labels file

with open(class_labels_path, 'r') as file:
    class_labels = [line.strip() for line in file.readlines()]  # Read each line and strip any extra whitespace/newlines

# Check the first few labels to make sure it's working
print(class_labels[:10])  # Display the first 10 class labels

# Load the pre-trained model architecture
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("using device", device)
model = models.resnet18(pretrained=False)  # Don't load the pre-trained weights
model.fc = nn.Linear(model.fc.in_features, 250)  # Set to 250 classes (based on trained model)

# Load the trained weights
model.load_state_dict(torch.load('sketch_classifier/resnet18_trained_modelv3.pth'))
model = model.to(device)  # Move to GPU if available
model.eval()  # Set to evaluation mode (important!)


transform = transforms.Compose([
    transforms.Resize((150, 150)),  # Resize to 150x150
    transforms.ToTensor(),  # Convert the image to a tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize
])


image_path = 'image.png'  # Specify the path to the JPG image
image = Image.open(image_path).convert('RGB')  # Open and ensure it's RGB


image = transform(image).unsqueeze(0)  # Add batch dimension (model expects batch input)
image = image.to(device)  # Move image to the selected device (GPU/CPU)

with torch.no_grad():  # No need to calculate gradients during inference
    outputs = model(image)  # Get raw outputs (logits)

    # Get the predicted class (the one with the highest score)
    _, predicted_class = torch.max(outputs, 1)

predicted_label = class_labels[predicted_class.item()]
print(f'Predicted Label: {predicted_label}')