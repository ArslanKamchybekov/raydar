from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List

class TextVectorizer:
    def __init__(self):
        # Initialize with standard English stop words and basic preprocessing
        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            lowercase=True,
            strip_accents='unicode',
            max_features=5000
        )
        self.is_fitted = False

    def fit(self, documents: List[str]) -> None:
        """
        Fit the vectorizer on a list of documents.
        """
        if not documents:
            raise ValueError("Cannot fit vectorizer on empty document list")
        
        self.vectorizer.fit(documents)
        self.is_fitted = True

    def transform(self, text: str) -> List[float]:
        """
        Transform a single text into a TF-IDF vector.
        """
        if not self.is_fitted:
            raise ValueError("Vectorizer must be fitted before transform")
            
        try:
            # Convert text to vector and flatten
            vector = self.vectorizer.transform([text]).toarray()[0]
            return vector.tolist()
        except Exception as e:
            raise ValueError(f"Error transforming text: {str(e)}")