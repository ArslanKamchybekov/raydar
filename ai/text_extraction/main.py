from text_extraction.processors.similarity_processor import SimilarityProcessor
from dotenv import load_dotenv

def predict_the_description_main(input_description, threshold=0.45):
    load_dotenv()
    # Initialize the processor
    config = {
        "similarity_threshold": threshold,  # Adjust as needed
        "max_similar_items": 10       # Adjust as needed
    }
    processor = SimilarityProcessor(config)

    # Find similar items in the database
    similar_items = processor.find_similar_items_in_db(input_description, threshold=config["similarity_threshold"])

    # Sort similar items by similarity score (descending)
    similar_items.sort(key=lambda x: x["similarity_score"], reverse=True)

    # Print results
    print("Similar Items:")
    for item in similar_items:
        print(item)
    
    return similar_items

if __name__ == "__main__":
    similar_items = main()