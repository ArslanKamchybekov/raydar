import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Item } from "@/app/schemas/itemSchema";

export function ItemCard({ item }: { item: Item }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
        <div className="flex justify-between items-center mt-4">
          <Badge variant="secondary">{item.category}</Badge>
          <span className="text-sm text-muted-foreground">
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "No date available"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-sm">
          <span className="font-semibold">Location:</span> {item.location}
        </p>
      </CardFooter>
    </Card>
  );
}
