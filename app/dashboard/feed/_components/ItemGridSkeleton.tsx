import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React from "react";

export default function ItemGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent>
            <div className="w-full h-48 bg-gray-700 rounded-md my-4"></div>
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