from typing import List
from sklearn.metrics.pairwise import cosine_similarity
from utils.vectorizer import TextVectorizer
from custom_types import SimilarItem, FeatureVector, ProcessorConfig

class SimilarityProcessor:
    def __init__(self, config: ProcessorConfig):
        self.vectorizer = TextVectorizer()
        self.item_vectors: List[FeatureVector] = []
        self.config = config

    def calculate_cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        return cosine_similarity([vec1], [vec2])[0][0]

    def find_similar_items(self, item_id: str) -> List[SimilarItem]:
        target_vector = next((item["vector"] for item in self.item_vectors if item["item_id"] == item_id), None)
        if not target_vector:
            return []

        similarities: List[SimilarItem] = []
        for item in self.item_vectors:
            if item["item_id"] == item_id:
                continue
                
            score = self.calculate_cosine_similarity(target_vector, item["vector"])
            if score > self.config["similarity_threshold"]:
                similarities.append({
                    "id": item["item_id"],
                    "score": score,
                    "description": ""
                })

        similarities.sort(key=lambda x: x["score"], reverse=True)
        return similarities[:self.config["max_similar_items"]]