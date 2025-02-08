from supabase import create_client
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

# Create Supabase client
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Mock descriptions and additional data
mock_data = [
    {
        "description": "Found a black Dell laptop with scratches on the cover in the library",
        "location_name": "library",
        "category": "electronics",
        "brand": "Dell",
        "colors": ["black"],
        "size": "medium",
        "material": "plastic",
        "weather_found": "cloudy"
    },
    {
        "description": "Found black Dell laptop, has some scratches, at the library",
        "location_name": "library",
        "category": "electronics",
        "brand": "Dell",
        "colors": ["black"],
        "size": "medium",
        "material": "plastic",
        "weather_found": "cloudy"
    },
    {
        "description": "Found a Nike backpack (red color) at the student center",
        "location_name": "student center",
        "category": "clothing",
        "brand": "Nike",
        "colors": ["red"],
        "size": "large",
        "material": "fabric",
        "weather_found": "sunny"
    },
    {
        "description": "Found a blue Nike backpack in the student center",
        "location_name": "student center",
        "category": "clothing",
        "brand": "Nike",
        "colors": ["blue"],
        "size": "large",
        "material": "fabric",
        "weather_found": "sunny"
    },
    {
        "description": "Found a white Samsung phone in the lecture center building a",
        "location_name": "lecture center building a",
        "category": "electronics",
        "brand": "Samsung",
        "colors": ["white"],
        "size": "small",
        "material": "plastic",
        "weather_found": "rainy"
    },
    {
        "description": "Found an iPhone (white) at lecture center building a",
        "location_name": "lecture center building a",
        "category": "electronics",
        "brand": "Apple",
        "colors": ["white"],
        "size": "small",
        "material": "plastic",
        "weather_found": "rainy"
    },
    {
        "description": "Found a black leather wallet near library entrance",
        "location_name": "library entrance",
        "category": "personal",
        "brand": "unknown",
        "colors": ["black"],
        "size": "small",
        "material": "leather",
        "weather_found": "cloudy"
    },
    {
        "description": "Found leather wallet (black) at library front",
        "location_name": "library front",
        "category": "personal",
        "brand": "unknown",
        "colors": ["black"],
        "size": "small",
        "material": "leather",
        "weather_found": "cloudy"
    },
    {
        "description": "Found airpods in black case at the library during rainy weather",
        "location_name": "library",
        "category": "electronics",
        "brand": "Apple",
        "colors": ["black"],
        "size": "small",
        "material": "plastic",
        "weather_found": "rainy"
    },
    {
        "description": "Found black umbrella at the library, was raining",
        "location_name": "library",
        "category": "personal",
        "brand": "unknown",
        "colors": ["black"],
        "size": "large",
        "material": "fabric",
        "weather_found": "rainy"
    },
    {
        "description": "Found a black Nike duffel bag with red zipper and broken strap in the gym",
        "location_name": "gym",
        "category": "duffel bag",
        "brand": "Nike",
        "colors": ["red", "black"],
        "size": "large",
        "material": "fabric",
        "weather_found": "sunny"
    },
    {
        "description": "Found Nike gym bag, black with red zippers, strap is damaged",
        "location_name": "gym",
        "category": "gym bag",
        "brand": "Nike",
        "colors": ["red", "black"],
        "size": "large",
        "material": "fabric",
        "weather_found": "sunny"
    },
    {
        "description": "Found black leather wallet with brown stitching",
        "location_name": "library",
        "category": "wallet",
        "brand": "unknown",
        "colors": ["black", "brown"],
        "size": "small",
        "material": "leather",
        "weather_found": "cloudy"
    },
    {
        "description": "Found black leather backpack with brown trim",
        "location_name": "library",
        "category": "backpack",
        "brand": "unknown",
        "colors": ["black", "brown"],
        "size": "large",
        "material": "leather",
        "weather_found": "cloudy"
    },
    {
        "description": "Found a black Adidas bag made of synthetic material",
        "location_name": "gym",
        "category": "bag",
        "brand": "adidas",
        "colors": ["black"],
        "size": "large",
        "material": "synthetic",
        "weather_found": "sunny"
    },
    {
        "description": "Found black Adidas bag made of synthetic material",
        "location_name": "gym",
        "category": "bag",
        "brand": "adidas",
        "colors": ["black"],
        "size": "large",
        "material": "synthetic",
        "weather_found": "sunny"
    },
    # Additional edge cases and interesting descriptions
    {
        "description": "Found a silver metal frame glasses in lecture center building d",
        "location_name": "lecture center building d",
        "category": "clothing",
        "brand": "unknown",
        "colors": ["silver"],
        "size": "small",
        "material": "metal",
        "weather_found": "sunny"
    },
    {
        "description": "Found blue earbuds in academic and residential complex",
        "location_name": "academic and residential complex",
        "category": "electronics",
        "brand": "unknown",
        "colors": ["blue"],
        "size": "small",
        "material": "plastic",
        "weather_found": "cloudy"
    },
    {
        "description": "Found brown winter jacket in grant hall",
        "location_name": "grant hall",
        "category": "clothing",
        "brand": "unknown",
        "colors": ["brown"],
        "size": "large",
        "material": "synthetic",
        "weather_found": "foggy"
    },
    {
        "description": "Found blue iPad in douglass hall",
        "location_name": "douglass hall",
        "category": "electronics",
        "brand": "Apple",
        "colors": ["blue", "black"],
        "size": "medium",
        "material": "plastic",
        "weather_found": "sunny"
    },
    {
        "description": "Found black iPhone with clear case in lincoln hall",
        "location_name": "lincoln hall",
        "category": "personal",
        "brand": "Apple",
        "colors": ["black"],
        "size": "small",
        "material": "plastic",
        "weather_found": "windy"
    },
    {
        "description": "Found blue keyboard in windy weather in henry hall",
        "location_name": "henry hall",
        "category": "electronics",
        "brand": "Microsoft",
        "colors": ["blue", "orange"],
        "size": "medium",
        "material": "metal",
        "weather_found": "windy"
    },
    {
        "description": "Found black metal watch in stevenson hall",
        "location_name": "stevenson hall",
        "category": "electronics",
        "brand": "unknown",
        "colors": ["black"],
        "size": "small",
        "material": "metal",
        "weather_found": "sunny"
    }
]

def create_mock_data():
    for item in mock_data:
        data = {
            "created_at": datetime.utcnow().isoformat(),
            "image_id": str(uuid.uuid4()),
            "location_name": item["location_name"],
            "category": item["category"],
            "brand": item["brand"],
            "colors": item["colors"],
            "size": item["size"],
            "material": item["material"],
            "weather_found": item["weather_found"],
            "description": item["description"],
            "keywords": item["description"].split()  # Simple keyword extraction
        }
        response = supabase.table("found_items").insert(data).execute()
        if not response.data:
            print(f"Failed to insert data: {response}")
        else:
            print(f"Inserted data: {data}")

if __name__ == "__main__":
    create_mock_data()