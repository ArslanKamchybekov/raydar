"use client";
import type React from "react";
import { useState } from "react";
import { DragDropUpload } from "./_components/DragDropUpload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast, useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Locations,
  Categories,
  Brands,
  Colors,
  Materials,
  Weather,
  Keywords,
} from "@/utils/constants";
import { Size } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadFoundItem } from "../../actions/foundItems";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import KeywordSearch from "./_components/KeywordSearch";

const LostItemUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);
  const [size, setSize] = useState<string>("");
  const [material, setMaterial] = useState<string>("");
  const [weather, setWeather] = useState<string>("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUser();

  const { toast } = useToast();

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !location || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await uploadFoundItem(
        user.user?.id || "",
        file,
        location,
        category,
        brand,
        colors,
        size,
        material,
        weather,
        description,
        keywords
      );

      toast({
        title: "Success",
        description: "Your found item report has been submitted.",
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setLocation("");
      setCategory("");
      setBrand("");
      setColors([]);
      setSize("");
      setMaterial("");
      setWeather("");
      setDescription("");
      setKeywords([]);
    } catch (error) {
      console.error("Error submitting found item report:", error);
      toast({
        title: "Error",
        description: "Failed to submit found item report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Report Found Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <DragDropUpload onFileUpload={handleFileUpload} />
              </div>
              {preview && (
                <div>
                  <Label>Preview</Label>
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="mt-2 max-w-full h-auto rounded-lg"
                    width={400}
                    height={400}
                  />
                </div>
              )}
              {file && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">File Details</h3>
                  <p>
                    <strong>Name:</strong> {file.name}
                  </p>
                  <p>
                    <strong>Size:</strong>{" "}
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p>
                    <strong>Type:</strong> {file.type}
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={location}
                  onValueChange={(value) => setLocation(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {Locations.map((location) => (
                      <SelectItem key={location.name} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select
                  value={brand}
                  onValueChange={(value) => setBrand(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {Brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="colors">Colors</Label>
                <Select
                  value={colors.join(", ")}
                  onValueChange={(value) => setColors(value.split(", "))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select colors" />
                  </SelectTrigger>
                  <SelectContent>
                    {Colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">Size</Label>
                <Select value={size} onValueChange={(value) => setSize(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Size).map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="material">Material</Label>
                <Select
                  value={material}
                  onValueChange={(value) => setMaterial(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {Materials.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weather">Weather Found</Label>
                <Select
                  value={weather}
                  onValueChange={(value) => setWeather(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    {Weather.map((weather) => (
                      <SelectItem key={weather} value={weather}>
                        {weather}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any additional details about the item..."
                />
              </div>
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <KeywordSearch
                  selectedKeywords={keywords}
                  setSelectedKeywords={setKeywords}
                  availableKeywords={Keywords}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LostItemUploadPage;
