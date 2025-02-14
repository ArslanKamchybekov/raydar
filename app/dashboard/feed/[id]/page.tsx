"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFoundItem } from "@/app/actions/foundItems"; // assuming this is the server action to get the specific item
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/spinner";

const ItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Prevent running until the id is available

    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const data = await getFoundItem(Array.isArray(id) ? id[0] : id); // Ensure id is a string
        setItem(data);
      } catch (err: any) {
        setError("Error fetching item");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4">
        {item ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{item.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={item.image || "/logo.png"}
                alt={item.description || "Found item"}
                width={500}
                height={500}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Location: {item.location_name}
                </p>
                {item.description && (
                  <p className="text-sm">{item.description}</p>
                )}
                {item.brand && <p className="text-sm">Brand: {item.brand}</p>}
                {item.colors && item.colors.length > 0 && (
                  <p className="text-sm">Colors: {item.colors.join(", ")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>No item found</div>
        )}
      </div>
    </div>
  );
};

export default ItemPage;
