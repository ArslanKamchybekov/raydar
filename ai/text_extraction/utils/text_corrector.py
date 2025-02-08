from rapidfuzz import fuzz, process

class TextCorrector:
    def __init__(self):
        # Load all our known words from the constants
        from constants.brands import brands
        from constants.locations import locations
        from constants.colors import colors
        from constants.materials import materials
        from constants.weather import weather
        
        # Common misspellings dictionary
        self.common_misspellings = {
            # Location misspellings
            "libary": "library",
            "liberry": "library",
            "liberary": "library",
            "labrary": "laboratory",
            "librar": "library",
            "lab": "laboratory",
            "lecutre": "lecture",
            "lectur": "lecture",
            "ceter": "center",
            "centr": "center",
            "buildig": "building",
            "buiding": "building",
            "bulding": "building",
            "acadmic": "academic",
            "academik": "academic",
            "residental": "residential",
            "residencial": "residential",
            
            # Color misspellings
            "blak": "black",
            "wite": "white",
            "whit": "white",
            "blu": "blue",
            "bluu": "blue",
            "grey": "gray",
            "gren": "green",
            "grn": "green",
            "purpl": "purple",
            "purpel": "purple",
            "yelow": "yellow",
            "yello": "yellow",
            "orang": "orange",
            "ornge": "orange",
            "braun": "brown",
            "brun": "brown",
            
            # Common item misspellings
            "fone": "phone",
            "phne": "phone",
            "iphone": "iPhone",
            "laptap": "laptop",
            "labtop": "laptop",
            "laptp": "laptop",
            "bottel": "bottle",
            "bottl": "bottle",
            "notbook": "notebook",
            "headfone": "headphone",
            "headfones": "headphones",
            "earbud": "earbuds",
            "walet": "wallet",
            "wallat": "wallet",
            "bakcpack": "backpack",
            "backpak": "backpack",
            "bakpack": "backpack",
            "umbrlla": "umbrella",
            "umbela": "umbrella",
            "chargor": "charger",
            "chargr": "charger",
            "calculater": "calculator",
            "calc": "calculator",
            "camra": "camera",
            "camera": "camera",
            
            # Brand misspellings
            "damsung": "samsung",
            "samsng": "samsung",
            "dells": "dell",
            "lnovo": "lenovo",
            "levono": "lenovo",
            "microsft": "microsoft",
            "appl": "apple",
            "nkie": "nike",
            "addidas": "adidas",
            "sony": "sony",
            "asuss": "asus",
            
            # Material misspellings
            "lether": "leather",
            "lethr": "leather",
            "plastik": "plastic",
            "plstc": "plastic",
            "fabrik": "fabric",
            "metl": "metal",
            "metalic": "metallic",
            "ruber": "rubber",
            "rubbr": "rubber",
            
            # Common action words
            "droped": "dropped",
            "dropd": "dropped",
            "fond": "found",
            "fnod": "found",
            "loosed": "lost",
            "losd": "lost",
            "misplased": "misplaced",
            "misplacd": "misplaced",
            "forgoten": "forgotten",
            "forgt": "forgot",
            "lft": "left",
            
            # Common descriptive words
            "smol": "small",
            "smal": "small",
            "lrg": "large",
            "larg": "large",
            "brken": "broken",
            "damagd": "damaged",
            "demaged": "damaged",
            "riped": "ripped",
            "teared": "torn",
            "scrached": "scratched",
            "scratchd": "scratched",
            
            # Weather misspellings
            "rayn": "rainy",
            "rany": "rainy",
            "cloudy": "cloudy",
            "cloudey": "cloudy",
            "sunnay": "sunny",
            "suny": "sunny",
            "snowey": "snowy",
            "snowy": "snowy",
            "foggy": "foggy",
            "fogie": "foggy",
            "windy": "windy",
            "windey": "windy"
        }
        
        # Build vocabulary from our constants
        self.known_words = set()
        self.known_words.update(brands)
        self.known_words.update(locations)
        self.known_words.update(colors)
        self.known_words.update(materials)
        self.known_words.update(weather)
        self.known_words.update(self.common_misspellings.values())
        
        # Add common words
        self.known_words.update([
            "found", "lost", "left", "missing", "dropped",
            "at", "in", "near", "by", "the", "and", "with",
            "laptop", "phone", "bottle", "bag", "backpack",
            "wallet", "keys", "headphones", "charger",
            "morning", "afternoon", "evening", "night",
            "yesterday", "today", "tomorrow", "inside",
            "outside", "between", "behind", "front",
            "new", "old", "clean", "dirty", "expensive",
            "cheap", "heavy", "light", "big", "small"
        ])

    def correct_word(self, word: str) -> str:
        # First check common misspellings
        if word.lower() in self.common_misspellings:
            return self.common_misspellings[word.lower()]
            
        # If it's in known words, return as is
        if word.lower() in self.known_words:
            return word
            
        # Use fuzzy matching to find closest known word
        match = process.extractOne(
            word,
            self.known_words,
            scorer=fuzz.ratio,
            score_cutoff=85
        )
        
        return match[0] if match else word

    def correct_text(self, text: str) -> str:
        words = text.split()
        corrected_words = [self.correct_word(word) for word in words]
        return ' '.join(corrected_words)