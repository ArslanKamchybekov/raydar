from flask import Flask, request, jsonify, abort
from flask_cors import CORS

from config import supabase
from dotenv import load_dotenv
from io import BytesIO
from storage3.exceptions import StorageApiError # type: ignore

from text_extraction.main import predict_the_description_main
from sketch_classifier.sketch_classifier import SketchClassifier

load_dotenv()
storage = supabase.storage
bucket_name = "lost_images"





app = Flask(__name__)
CORS(app)  # Enable CORS for all routes



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

    
    sketch_model = SketchClassifier()
    label = sketch_model.predict(image_data)
    print(f"Predicted keyword: {label}")


    # This is Josh's section to analyze the description. He will return an array of rows.

    description_analysis_rows = predict_the_description(description, threshold)
    
    #-----------------------------------------------------------------------------------

    # Once Josh is done with analysis, he will return rows. Merge with your rows. And return all rows.

    return jsonify({"rows": "label"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500, debug=False)
    
    
