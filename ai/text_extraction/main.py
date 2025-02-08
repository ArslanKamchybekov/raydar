from dotenv import load_dotenv
from processors.item_processor import ItemProcessor
from processors.similarity_processor import SimilarityProcessor
from custom_types import ProcessorConfig

def main():
    load_dotenv()

    config: ProcessorConfig = {
        "similarity_threshold": 0.3,
        "max_similar_items": 5
    }
    
    processor = ItemProcessor()
    similarity_processor = SimilarityProcessor(config)
    
    test_cases = [
        # Original test cases
        (
            "Lost a black Dell laptop with scratches on the cover in the library",
            "Found black Dell laptop, has some scratches, at the library"
        ),
        (
            "Lost my Nike backpack (red color) at the student center",
            "Found a blue Nike backpack in the student center"
        ),
        (
            "Lost a white Samsung phone in the lecture center building a",
            "Found an iPhone (white) at lecture center building a"
        ),
        (
            "Lost my blak leather wallet near libary entrance",
            "Found leather wallet (black) at library front"
        ),
        (
            "Lost airpods in black case at the library during rainy weather",
            "Found black umbrella at the library, was raining"
        ),
        (
            "Lost black Dell laptop at the library",
            "Found black Dell laptop at lecture center building a"
        ),
        (
            "Lost my MacBook Pro laptop with stickers on the cover",
            "Found an Apple laptop covered in stickers"
        ),
        (
            "Lost ray-ban sunglasses in black case at gym",
            "Found blue water bottle at the recreation center"
        ),
        (
            "Lost my black Nike duffel bag with red zipper and broken strap in the gym",
            "Found Nike gym bag, black with red zippers, strap is damaged"
        ),
        (
            "Lost black leather wallet with brown stitching",
            "Found black leather backpack with brown trim"
        ),
        
        # Additional cases with common misspellings
        (
            "Losd my damsung fone with blak case in liberry",
            "Found samsung phone with black case at library"
        ),
        (
            "Droped my dells laptap at lecutre center",
            "Found Dell laptop at lecture center"
        ),
        (
            "Misplased blu nkie bakcpack in acadmic complex",
            "Found blue Nike backpack at academic complex"
        ),
        (
            "Lost hedphones and bottel in labratory",
            "Found headphones and bottle in laboratory"
        ),
        (
            "Fond lether walet (braun) from gess near libary",
            "Found leather wallet (brown) from guess at library"
        ),
        
        # Edge cases with multiple typos
        (
            "Losd blak lenovo laptap wit brocken chargor in lecutre hall",
            "Found black Lenovo laptop with broken charger in lecture hall"
        ),
        (
            "Fond my iphone and walet near liberry enterance",
            "Found iPhone and wallet near library entrance"
        ),
        (
            "Left my blak addidas bag made of synth materil",
            "Found black Adidas bag made of synthetic material"
        ),
        (
            "Droped blu umbrlla with riped fabrik at liberary",
            "Found blue umbrella with ripped fabric at library"
        ),
        (
            "Lost my microsft surfase at the liberry during cloudey wether",
            "Found Microsoft Surface at the library during cloudy weather"
        )
    ]
    
    for i, (desc1, desc2) in enumerate(test_cases, 1):
        print(f"\n=== Test Case {i} ===")
        print(f"Description 1: {desc1}")
        print(f"Description 2: {desc2}")
        
        # Get metadata
        metadata1 = processor.process_item(desc1)
        metadata2 = processor.process_item(desc2)
        
        # Calculate similarity
        similarity_score = similarity_processor.calculate_similarity(
            desc1, desc2, metadata1, metadata2
        )
        
        print(f"\nCorrected Description 1: {metadata1['description']}")
        print(f"Corrected Description 2: {metadata2['description']}")
        print(f"Similarity Score: {similarity_score}")
        print(f"Above Threshold: {similarity_score > config['similarity_threshold']}")
        
        print("\nMetadata 1:", {k:v for k,v in metadata1.items() if k != 'description'})
        print("Metadata 2:", {k:v for k,v in metadata2.items() if k != 'description'})
        
        print("\nMatching features:")
        for key in metadata1.keys():
            if key in metadata2 and metadata1[key] == metadata2[key] and key != 'description':
                print(f"{key}: {metadata1[key]}")
        print("=" * 80)

if __name__ == "__main__":
    main()