import Image from "next/image";
import { formatDistance } from "date-fns";
import { MapPin, Cloud, Tag, User, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/app/schemas/itemSchema";

import { sampleItems } from "@/app/feed/sampleData";

export function LostItemCard({ item }: { item: Item }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{item.name}</CardTitle>
        <div className="flex justify-between items-center">
          <Badge variant={item.is_available ? "default" : "secondary"}>
            {item.is_available ? "Available" : "Unavailable"}
          </Badge>
          <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.image_url && (
          <div className="relative w-full h-64">
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
        <p className="text-muted-foreground">{item.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Cloud className="w-4 h-4" />
            <span>{item.weather}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4" />
            <span>{item.category}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{item.user_id}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>
            Created{" "}
            {formatDistance(item.created_at, new Date(), { addSuffix: true })}
          </span>
        </div>
        <div>
          Updated{" "}
          {formatDistance(item.updated_at, new Date(), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
}

export default async function ListItemPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const item = sampleItems.find((item) => item.id === id);
  if (!item) {
    return <div>Item not found</div>;
  }
  return (
    <div className="pt-32">
      <LostItemCard item={item} />
    </div>
  );
}
