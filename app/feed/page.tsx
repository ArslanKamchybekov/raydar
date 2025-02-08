"use client";

import { useEffect, useState } from "react";
import { Item } from "@/app/schemas/itemSchema";
import NavBar from "@/components/wrapper/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleItems } from "@/app/feed/sampleData";
import { useRouter } from "next/navigation";
import { getLostItems } from "../actions/lostItems";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Item[]>();
  const router = useRouter();

  //   useEffect(() => {
  //     const fetchItems = async () => {
  //       try {
  //         const fetchedItems = await getLostItems();
  //         setItems(fetchedItems);
  //       } catch (error) {
  //         console.error("Error fetching items:", error);
  //       }
  //     };

  //     fetchItems();
  //   });

  const filteredItems = items?.filter(
    (item: Item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClick = (itemId: string) => {
    try {
      router.push(`/feed/${itemId}`);
    } catch (e) {
      console.log("Error");
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-4">
        <Input
          type="search"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm mx-auto"
        />
      </div>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Lost & Found Items</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-muted-foreground">{item.description}</p>
              <p className="mt-2">Location: {item.location}</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => handleClick(item.id)}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
        {sampleItems.length === 0 && (
          <p className="text-center text-muted-foreground">
            No items found. Try adjusting your search.
          </p>
        )}
      </main>
    </div>
  );
}
