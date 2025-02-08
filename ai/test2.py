import requests

url = "http://localhost:5500/get_images"
data = {
    "image_id": "123456",
    "description": "Lost black backpack in library",
    "threshold": 0.45
}

response = requests.post(url, json=data)
print(response.json())