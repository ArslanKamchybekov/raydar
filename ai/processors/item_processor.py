import os
from dotenv import load_dotenv
from supabase import create_client
from utils.nlp_utils import extract_features
from processors.similarity_processor import SimilarityProcessor
from custom_types import ProcessedItem, ProcessorConfig

class ItemProcessor:
    def __init__(self):
        load_dotenv()
        
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_PASSWORD")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase credentials")
        
        self.config: ProcessorConfig = {
            "similarity_threshold": 0.3,
            "max_similar_items": 5
        }
        
        self.supabase = create_client(supabase_url, supabase_key)
        self.similarity_processor = SimilarityProcessor(self.config)

    def process_item(self, description: str) -> ProcessedItem:
        # Extract features
        features = extract_features(description)

        # Prepare data for Supabase insert
        insert_data = {
            "description": description,
            "colors": features["colors"],
            "brand": features["brand"],
            "category": features["category"],
            "location_name": features["location"],
            "material": features["material"],
            "weather_found": features["weather"],
            "size": None,  # Added size field
            "keywords": None,  # Added keywords field
            "image_id": None  # Added image_id field
        }

        # Save to Supabase
        response = self.supabase.table("found_items").insert(insert_data).execute()

        item_id = response.data[0]["id"]

        # Find similar items
        similar_items = self.similarity_processor.find_similar_items(item_id)

        # Return processed item with all fields
        return {
            "id": item_id,
            "description": description,
            "colors": features["colors"],
            "brand": features["brand"],
            "category": features["category"],
            "location_name": features["location"],
            "material": features["material"],
            "weather_found": features["weather"],
            "size": None,
            "keywords": None,
            "image_id": None,
            "similar_items": similar_items
        }