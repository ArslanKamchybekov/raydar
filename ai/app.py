from flask import Flask, request, jsonify, abort
from flask_cors import CORS

from config import supabase
from dotenv import load_dotenv
from io import BytesIO
from storage3.exceptions import StorageApiError # type: ignore

from text_extraction.main import predict_the_description_main
from sketch_classifier.sketch_classifier import SketchClassifier
from ai.processors.similarity_processor import SimilarityProcessor
from ai.types.types import ProcessorConfig

load_dotenv()
storage = supabase.storage
bucket_name = "lost_images"

# Initialize processors
similarity_config: ProcessorConfig = {
    "similarity_threshold": 0.45,
    "max_similar_items": 10
}
text_processor = SimilarityProcessor(similarity_config)

app = Flask(__name__)
CORS(app)

def predict_the_description(input_description, threshold=0.45):
    description_analysis_rows = predict_the_description_main(input_description, threshold)
    return description_analysis_rows

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"message": "Server is up and running!"}), 200

@app.route('/get_images', methods=["POST"])
def get_images():
    try:
        data = request.get_json()
        image_id = data["image_id"]
        description = data["description"]
        threshold = data.get("threshold", 0.45)

        # Get image classification
        image_label = None
        for ext in [".JPG", ".jpg", ".png"]:
            try:
                image_data = storage.from_(bucket_name).download(f"{image_id}{ext}")
                sketch_model = SketchClassifier()
                image_label = sketch_model.predict(image_data)
                print(f"Image predicted as: {image_label}")
                break
            except Exception as e:
                print(f"Error with image: {str(e)}")
                continue

        # Get text matches
        text_matches = predict_the_description(description, threshold)
        
        # Find overlapping results
        combined_matches = []
        if image_label and text_matches:
            for match in text_matches:
                # Assuming match has an 'image_label' field from its own classification
                if match.get('image_label') == image_label:
                    match['match_type'] = 'both'  # Matches both image and text
                    combined_matches.append(match)
                else:
                    match['match_type'] = 'text_only'
                    combined_matches.append(match)

        return jsonify({
            "matches": combined_matches,
            "image_label": image_label,
            "total_matches": len(combined_matches),
            "matches_both": len([m for m in combined_matches if m['match_type'] == 'both'])
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500, debug=False)