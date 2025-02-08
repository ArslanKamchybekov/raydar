from typing import List, Dict, Optional
import spacy
from text_extraction.constants.colors import colors
from text_extraction.constants.brands import brands
from text_extraction.constants.categories import categories
from text_extraction.constants.locations import locations
from text_extraction.constants.materials import materials
from text_extraction.constants.weather import weather

nlp = spacy.load("en_core_web_sm")

def find_in_list(text: str, items: List[str]) -> List[str]:
    return [item for item in items if item.lower() in text]

def extract_features(text: str):
    clean_text = text.lower()
    return {
        "colors": find_in_list(clean_text, colors),
        "brand": find_in_list(clean_text, brands)[0] if find_in_list(clean_text, brands) else None,
        "category": find_in_list(clean_text, categories)[0] if find_in_list(clean_text, categories) else None,
        "location": find_in_list(clean_text, locations)[0] if find_in_list(clean_text, locations) else None,
        "material": find_in_list(clean_text, materials)[0] if find_in_list(clean_text, materials) else None,
        "weather": find_in_list(clean_text, weather)[0] if find_in_list(clean_text, weather) else None,
    }