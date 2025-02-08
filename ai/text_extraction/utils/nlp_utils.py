from typing import List, Dict, Optional
import spacy
from constants.colors import colors
from constants.brands import brands
from constants.categories import categories
from constants.locations import locations
from constants.materials import materials
from constants.weather import weather

nlp = spacy.load("en_core_web_sm")

def find_in_list(text: str, items: List[str]) -> List[str]:
    return [item for item in items if item.lower() in text]

def extract_features(text: str) -> Dict[str, Optional[str] | List[str]]:
    clean_text = text.lower()
    return {
        "colors": find_in_list(clean_text, colors),
        "brand": find_in_list(clean_text, brands)[0] if find_in_list(clean_text, brands) else None,
        "category": find_in_list(clean_text, categories)[0] if find_in_list(clean_text, categories) else None,
        "location": find_in_list(clean_text, locations)[0] if find_in_list(clean_text, locations) else None,
        "material": find_in_list(clean_text, materials)[0] if find_in_list(clean_text, materials) else None,
        "weather": find_in_list(clean_text, weather)[0] if find_in_list(clean_text, weather) else None,
    }