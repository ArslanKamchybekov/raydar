import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Item } from "@/types/types"
import type React from "react"

interface ItemGridProps {
  items: Item[]
  isLoading: boolean
  error: string | null
  onItemClick: (item: Item) => void
  onClaimClick: (item: Item) => void
}

const ItemGrid: React.FC<ItemGridProps> = ({ items, isLoading, error, onItemClick, onClaimClick }) => {
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
    )
  }

  if (error || items.length === 0) {
    return <div className="text-center text-muted-foreground mt-8">No items found. Try adjusting your search.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {items.map((item: Item) => (
        <Card key={item.id} className={`hover:shadow-lg transition-shadow ${item.claimed ? "opacity-50" : ""}`}>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {item.category[0].toUpperCase() + item.category.slice(1)}
            </CardTitle>
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
              <p className="text-sm text-muted-foreground">Location: {item.location}</p>
              {item.description && <p className="text-sm line-clamp-2">{item.description}</p>}
              {item.colors && item.colors.length > 0 && <p className="text-sm">Colors: {item.colors.join(", ")}</p>}
              {item.brand && <p className="text-sm">Brand: {item.brand}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => onItemClick(item)} className="w-full sm:flex-1">
              View
            </Button>
            <Button onClick={() => onClaimClick(item)} className="w-full sm:flex-1" variant="outline">
              Claim
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default ItemGrid

