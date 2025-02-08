from sklearn.metrics.pairwise import cosine_similarity
from utils.vectorizer import TextVectorizer
from Levenshtein import ratio
from custom_types import ProcessorConfig

class SimilarityProcessor:
    def __init__(self, config: ProcessorConfig):
        self.vectorizer = TextVectorizer()
        self.config = config
        
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
                if len(w1) > 3 and len(w2) > 3:  # Only compare words longer than 3 chars
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
                
            val1 = metadata1[key]
            val2 = metadata2[key]
            
            if val1 and val2:
                if isinstance(val1, list):
                    common = set(val1) & set(val2)
                    total = set(val1) | set(val2)
                    if total:
                        similarity_scores.append(len(common) / len(total))
                else:
                    similarity_scores.append(ratio(str(val1).lower(), str(val2).lower()))
        
        return sum(similarity_scores) / len(similarity_scores) if similarity_scores else 0.0