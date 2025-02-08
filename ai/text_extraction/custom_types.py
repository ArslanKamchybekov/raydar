from typing import List, Optional, TypedDict

class FoundItemFeatures(TypedDict):
    """Features extracted from found item description"""
    colors: List[str]
    brand: Optional[str]
    category: Optional[str]
    location_name: Optional[str]
    material: Optional[str]
    weather_found: Optional[str]
    size: Optional[str]
    keywords: Optional[str]
    image_id: Optional[str]

class SimilarItem(TypedDict):
    """Information about a similar item"""
    id: str
    score: float
    description: str

class FeatureVector(TypedDict):
    """Vector representation of an item"""
    item_id: str
    vector: List[float]
    description: str

class ProcessorConfig(TypedDict):
    """Configuration for similarity processing"""
    similarity_threshold: float
    max_similar_items: int

class ProcessedItem(TypedDict, total=False):
    """Complete processed item with all extracted information"""
    id: str
    description: str
    colors: List[str]
    brand: Optional[str]
    category: Optional[str]
    location_name: Optional[str]
    material: Optional[str]
    weather_found: Optional[str]
    size: Optional[str]
    keywords: Optional[str]
    image_id: Optional[str]
    similar_items: List[SimilarItem]