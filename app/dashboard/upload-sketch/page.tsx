"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { uploadLostItemSketch } from "../../actions/lostItems";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import RelevantItems from "./_components/RelevantItems";
import { RelevantItem, Threshold } from "@/types/types";

export default function UploadSketchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [threshold, setThreshold] = useState(Threshold.LOW);
  const [isUploading, setIsUploading] = useState(false);
  const [relevantItems, setRelevantItems] = useState<RelevantItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleThresholdChange = (value: Threshold) => {
    setThreshold(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !description) {
      toast({
        title: "Error",
        description: "Please select a file and enter a description.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const item = await uploadLostItemSketch(file, description);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get_images`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_id: item.image,
            description,
            threshold,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send data to the server");
      }

      const data = await response.json();
      console.log(data);
      console.log(data.images);
      setRelevantItems(data.matches || []);

      toast({
        title: "Success",
        description: "Your sketch has been uploaded successfully.",
        duration: 2000, // 2 seconds
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to upload sketch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-6xl mx-auto gap-4">
      <div className="sm:w-1/3 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Upload Lost Item Sketch</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="file">Sketch Image</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="threshold">Threshold</Label>
                <Select
                  value={threshold.toString()}
                  onValueChange={(value) =>
                    handleThresholdChange(value as unknown as Threshold)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Threshold.LOW.toString()}>
                      Low
                    </SelectItem>
                    <SelectItem value={Threshold.MEDIUM.toString()}>
                      Medium
                    </SelectItem>
                    <SelectItem value={Threshold.HIGH.toString()}>
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="sm:w-2/3 w-full">
        <RelevantItems items={relevantItems} />
      </div>
    </div>
  );
}
