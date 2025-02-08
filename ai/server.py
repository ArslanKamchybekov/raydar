from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"message": "Server is up and running!"}), 200

@app.route('/get_keywords', methods=["POST"])
def get_image():
    # Get only keywords from image
    # Input -> { image_id: string, description_text: string }
    # Go to lost_items bucket and get ${image_id}.jpg
    # Output -> { keyword: string }
    pass


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500, debug=False)
    
    
