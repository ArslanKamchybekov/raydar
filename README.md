# Raydar - Find What You've Lost on Campus

Raydar is the smart lost and found platform designed specifically for UIC students. With Raydar, you can upload images of lost belongings, get matches, and recover your items faster.

## Features

- **2 ML Models**  
  Utilize the power of machine learning to match lost items with found items. Raydar uses two ML models to ensure the highest accuracy.
  
- **Search and Analyze**  
  Search for your belongings and analyze hotspots for lost items. Raydar uses a heat map to show where items are most likely to be found on campus.
  
- **Get Alerts**  
  Receive notifications when a match is found. Raydar will notify you when your lost item has been found.

- **HeatMaps**
  Visualize high-loss areas on campus, helping users check the most probable locations for their lost belongings.

## Tech Stack

Raydar is built with a variety of cutting-edge technologies to ensure a seamless experience:

- **Next.js 15**: A framework for React that enables server-side rendering and effortless deployment.  
  [Learn More](https://nextjs.org/)
  
- **TypeScript**: A typed superset of JavaScript that enhances code maintainability and scalability.  
  [Learn More](https://www.typescriptlang.org/)
  
- **Tailwind CSS**: A utility-first CSS framework for building custom designs with ease.  
  [Learn More](https://tailwindui.com/)
  
- **Shadcn UI**: Beautifully designed components by Shadcn for a visually appealing user interface.  
  [Learn More](https://ui.shadcn.com)
  
- **Clerk Authentication**: A secure and seamless authentication service for web applications.  
  [Learn More](https://clerk.com/)
  
- **Supabase (PostgreSQL)**: PostgreSQL-based open-source database for building scalable applications.  
  [Learn More](https://supabase.com/)
  
- **Prisma ORM**: A modern database toolkit for TypeScript and Node.js that simplifies database interactions.  
  [Learn More](https://prisma.io/)
  
- **PyTorch**: An open-source machine learning library for accelerating research prototyping to production deployment.  
  [Learn More](https://pytorch.org/)

- **Levenshtein**: A string metric for measuring the difference between two sequences, used for accurate matching of lost and found items.  
  [Learn More](https://github.com/ztanml/Levenshtein)

- **Fuzzy**: A library for fuzzy string matching, helping to find approximate matches between strings, ideal for item name matching in the system.  
  [Learn More](https://github.com/seatgeek/fuzzy)

- **SpaCy**: A fast and efficient NLP library for advanced text processing, used in analyzing item descriptions and identifying key features.  
  [Learn More](https://spacy.io/)

- **Scikit-learn**: A machine learning library for Python that provides simple tools for data analysis and building predictive models, including clustering lost item data.  
  [Learn More](https://scikit-learn.org/)

## Environment Variables

To run the application locally, you need to set up the environment variables.

## Installation

To set up Raydar locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/ArslanKamchybekov/raydar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and set your environment variables as described above.

4. Run the application:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to view the app in action.

## License

Unauthorized copying, modification, distribution, or use of this software, in whole or in part, is strictly prohibited.
