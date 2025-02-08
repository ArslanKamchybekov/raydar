"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import Image from "next/image";
import RelevantItems from "./_components/RelevantItems";

enum Strictness {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

type SketchRelevantItem = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
};

export default function UploadSketchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [strictness, setStrictness] = useState<Strictness>(Strictness.LOW);
  const [isUploading, setIsUploading] = useState(false);
  const [relevantItems, setRelevantItems] = useState<SketchRelevantItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStrictnessChange = (value: Strictness) => {
    setStrictness(value);
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
      // Upload file to database
      const image = await uploadLostItemSketch(file, description);
  
      // Send POST request to server
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get_images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_id: image.image_id,
          description,
          threshold: strictness === Strictness.LOW ? 0.3 : strictness === Strictness.MEDIUM ? 0.5 : 0.7,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send data to the server");
      }
  
      const data = await response.json();
      setRelevantItems(data.images || []); // Update to use 'images' from the response
  
      toast({
        title: "Success",
        description: "Your sketch has been uploaded successfully.",
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
    <div className="flex w-full max-w-6xl mx-auto p-4 gap-8">
      <div className="w-1/3">
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
                <Label htmlFor="strictness">Threshold</Label>
                <Select
                  value={strictness}
                  onValueChange={handleStrictnessChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Strictness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Strictness.LOW}>Low</SelectItem>
                    <SelectItem value={Strictness.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={Strictness.HIGH}>High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Sketch"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="w-2/3">
        <RelevantItems items={relevantItems as any} />
      </div>
    </div>
  );
}
