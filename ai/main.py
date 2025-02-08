from dotenv import load_dotenv
from processors.item_processor import ItemProcessor

def main():
    load_dotenv()
    processor = ItemProcessor()
    description = "I found a navy blue and silver Dell laptop with a black leather case near the Richard J Daley library during a rainy day. The laptop is medium-sized and appears to be a business model suitable for office work."
    result = processor.process_item(description)
    print(result)

if __name__ == "__main__":
    main()