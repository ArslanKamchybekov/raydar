import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type RelevantItem = {
  id: string;
  image_id: string;
  brand: string;
  category: string;
  colors: string[];
  created_at: string;
  description: string;
  keywords: string[];
  location_name: string;
  material: string;
  similarity_score: number;
  size: string;
  user_id: string;
  weather_found: string;
};

const RelevantItems = ({ items }: { items: RelevantItem[] }) => {
  const [validImages, setValidImages] = useState<{ [key: string]: boolean }>({});

  // Test if image exists by making a request
  const testImage = async (image_id: string) => {
    try {
      const response = await fetch(`https://ykyccstnnkxdmwembakk.supabase.co/storage/v1/object/public/found_images/${image_id}.jpg`);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Check images once items are available
    const checkImages = async () => {
      const imageStatus: { [key: string]: boolean } = {};
      for (const item of items) {
        const isValid = await testImage(item.image_id);
        imageStatus[item.image_id] = isValid;
      }
      setValidImages(imageStatus);
    };

    checkImages();
  }, [items]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relevant Items</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-gray-500">No relevant items found yet.</p>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border p-4 rounded-lg">
                <div className="w-32 h-32 relative flex-shrink-0">
                  <Image
                    src={
                      validImages[item.image_id]
                        ? `https://ykyccstnnkxdmwembakk.supabase.co/storage/v1/object/public/found_images/${item.image_id}.jpg`
                        : "/sparkhacks-logo.png"
                    }
                    alt={item.description}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                      {item.brand[0].toUpperCase() + item.brand.slice(1)}{" "}
                      {item.category[0].toUpperCase() + item.category.slice(1)}
                    </h3>
                    <Badge variant="secondary">
                      {(item.similarity_score * 100).toFixed(1)}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.colors.map((color) => (
                      <Badge key={color} variant="outline">
                        {color}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                    <div>Location: {item.location_name}</div>
                    <div>Size: {item.size}</div>
                    <div>Material: {item.material}</div>
                    <div>Weather: {item.weather_found}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelevantItems;
