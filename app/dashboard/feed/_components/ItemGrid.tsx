import Image from "next/image";
import { Flag } from "lucide-react"; // Add this import
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Item } from "@/types/types";
import type React from "react";

interface ItemGridProps {
  items: Item[];
  isLoading: boolean;
  error: Error | null;
  onItemClick: (item: Item) => void;
  onClaimClick: (item: Item) => void;
  onReportClick: (item: Item) => void;
}

const ItemGrid = ({
  items,
  isLoading,
  error,
  onItemClick,
  onClaimClick,
  onReportClick,
}: ItemGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <CardTitle className="text-xl">
                <div className="h-4 bg-gray-400 rounded"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-48 bg-gray-700 rounded-md mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-400 rounded"></div>
                <div className="h-4 bg-gray-400 rounded"></div>
                <div className="h-4 bg-gray-400 rounded"></div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled></Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error.message}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {items.map((item: Item) => (
        <Card
          key={item.id}
          className={`hover:shadow-lg transition-shadow ${
            item.claimed ? "opacity-50" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg md:text-xl">
              {item.category}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onReportClick(item);
              }}
            >
              <Flag className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-48">
              <Image
                src={item.image || "/logo.png"}
                alt={item.description || "Found item"}
                fill
                className="object-cover rounded-md"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.png";
                }}
              />
            </div>
            <div className="space-y-2 mt-4">
              <p className="text-sm text-muted-foreground">
                Location: {item.location}
              </p>
              {item.description && (
                <p className="text-sm line-clamp-2">{item.description}</p>
              )}
              {item.colors?.length > 0 && (
                <p className="text-sm">Colors: {item.colors.join(", ")}</p>
              )}
              {item.brand && <p className="text-sm">Brand: {item.brand}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => onItemClick(item)}
              className="w-full sm:flex-1"
            >
              View
            </Button>
            <Button
              onClick={() => onClaimClick(item)}
              className="w-full sm:flex-1"
              variant="outline"
            >
              Claim
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ItemGrid;
