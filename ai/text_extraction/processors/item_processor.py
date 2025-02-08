from text_extraction.utils.text_corrector import TextCorrector
from text_extraction.utils.nlp_utils import extract_features

class ItemProcessor:
    def __init__(self):
        self.text_corrector = TextCorrector()
        
    def process_item(self, description: str) -> dict:
        # First correct any typos
        corrected_description = self.text_corrector.correct_text(description)
        
        # Extract features from corrected description
        features = extract_features(corrected_description)
        
        # Create payload
        payload = {"description": corrected_description}
        
        # Only add non-null features to the payload
        if features["colors"]:
            payload["colors"] = features["colors"]
        if features["brand"]:
            payload["brand"] = features["brand"]
        if features["category"]:
            payload["category"] = features["category"]
        if features["location"]:
            payload["location_name"] = features["location"]
        if features["material"]:
            payload["material"] = features["material"]
        if features["weather"]:
            payload["weather_found"] = features["weather"]
            
        return payload

# Test example
if __name__ == "__main__":
    processor = ItemProcessor()
    
    # Test with a rich description
    test_description = "Found a red and white Nike sports bag made of synthetic material at the Academic and Residential Complex during partly cloudy weather."
    
    result = processor.process_item(test_description)
    print("API Payload:")
    print(result)