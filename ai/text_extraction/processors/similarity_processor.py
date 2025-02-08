from supabase import create_client
from sklearn.metrics.pairwise import cosine_similarity
from utils.vectorizer import TextVectorizer
from Levenshtein import ratio
from typing import List, Dict
import os
from utils.nlp_utils import extract_features

class SimilarityProcessor:
    def __init__(self, config: Dict):
        self.vectorizer = TextVectorizer()
        self.config = config
        self.supabase = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_KEY")
        )

    def calculate_similarity(self, text1: str, text2: str, metadata1: dict, metadata2: dict) -> float:
        # Calculate TF-IDF cosine similarity
        documents = [text1, text2]
        self.vectorizer.fit(documents)
        vector1 = self.vectorizer.transform(text1)
        vector2 = self.vectorizer.transform(text2)
        cosine_sim = self.calculate_cosine_similarity(vector1, vector2)

        # Calculate Levenshtein ratio for whole texts
        lev_ratio = ratio(text1.lower(), text2.lower())

        # Calculate word-by-word Levenshtein similarity
        words1 = text1.lower().split()
        words2 = text2.lower().split()
        word_similarities = []

        for w1 in words1:
            for w2 in words2:
                if w1 != w2 and len(w1) > 3 and len(w2) > 3:  # Only compare different words longer than 3 chars
                    word_ratio = ratio(w1, w2)
                    if word_ratio > 0.8:  # If words are very similar
                        word_similarities.append(word_ratio)

        word_sim_score = max(word_similarities) if word_similarities else 0

        # Calculate metadata similarity
        metadata_sim = self.calculate_metadata_similarity(metadata1, metadata2)

        # Weighted combination of all similarities
        final_similarity = (
            cosine_sim * 0.3 +  # Cosine similarity weight
            lev_ratio * 0.3 +   # Overall text similarity weight
            word_sim_score * 0.2 + # Individual word similarity weight
            metadata_sim * 0.2    # Metadata similarity weight
        )

        return final_similarity

    def calculate_cosine_similarity(self, vec1, vec2):
        return cosine_similarity([vec1], [vec2])[0][0]

    def calculate_metadata_similarity(self, metadata1: dict, metadata2: dict) -> float:
        similarity_scores = []

        for key in set(metadata1.keys()) & set(metadata2.keys()):
            if key == 'description':
                continue

            val1 = metadata1.get(key)
            val2 = metadata2.get(key)

            if val1 and val2:
                if isinstance(val1, list) and isinstance(val2, list):
                    common = set(val1) & set(val2)
                    total = set(val1) | set(val2)
                    if total:
                        similarity_scores.append(len(common) / len(total))
                else:
                    similarity_scores.append(ratio(str(val1).lower(), str(val2).lower()))

        return sum(similarity_scores) / len(similarity_scores) if similarity_scores else 0.0

    def find_similar_items_in_db(self, description: str, threshold: float = 0.5) -> List[Dict]:
        """
        Fetch all rows from Supabase and compare them against the input description.
        Return rows that meet or exceed the similarity threshold.
        """
        # Fetch all rows from the Supabase table
        response = self.supabase.table("found_items").select("*").execute()
        if not response.data:
            return []

        rows = response.data

        # Extract features from the input description
        input_features = extract_features(description)

        # Compare each row against the input description
        similar_items = []
        for row in rows:
            row_description = row.get("description", "")
            if row_description is None:
                continue
            row_features = extract_features(row_description)

            # Calculate similarity
            similarity_score = self.calculate_similarity(
                description, row_description, input_features, row_features
            )

            # Add to results if similarity meets the threshold
            if similarity_score >= threshold:
                similar_items.append({
                    **row,
                    "similarity_score": similarity_score
                })

        # Sort by similarity score (descending)
        similar_items.sort(key=lambda x: x["similarity_score"], reverse=True)

        return similar_items