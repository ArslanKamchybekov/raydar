"use client"
import type React from "react"
import { useState } from "react"
import { DragDropUpload } from "./_components/DragDropUpload"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Locations, Categories, Brands, Colors, Size, Materials, Weather } from "@/types/enums"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadFoundItem } from "../../actions/foundItems"
import PageWrapper from "@/components/wrapper/page-wrapper"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { keywords_list } from "@/constants/keywords"
import KeywordSearch from "./_components/KeywordSearch"

const LostItemUploadPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [locationName, setLocationName] = useState<Locations | "">("")
  const [category, setCategory] = useState<Categories | "">("")
  const [brand, setBrand] = useState<Brands | "">("")
  const [colors, setColors] = useState<Colors[]>([])
  const [size, setSize] = useState<Size | "">("")
  const [material, setMaterial] = useState<Materials | "">("")
  const [weatherFound, setWeatherFound] = useState<Weather | "">("")
  const [description, setDescription] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useUser()

  if (!user) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center w-full max-w-lg p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report a Found Item</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">You must be signed in to report a found item.</p>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    )
  }

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(uploadedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !locationName || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await uploadFoundItem(
        user.user?.id || "",
        file,
        locationName as Locations,
        category as Categories,
        brand || null,
        colors,
        size || null,
        material || null,
        weatherFound || null,
        description || null,
        keywords,
      )

      toast({
        title: "Success",
        description: "Your found item report has been submitted.",
      })

      // Reset form
      setFile(null)
      setPreview(null)
      setLocationName("")
      setCategory("")
      setBrand("")
      setColors([])
      setSize("")
      setMaterial("")
      setWeatherFound("")
      setDescription("")
      setKeywords([])
    } catch (error) {
      console.error("Error submitting found item report:", error)
      toast({
        title: "Error",
        description: "Failed to submit found item report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // center the form
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg p-6 space-y-6 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Report a Found Item</CardTitle>
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
                    <strong>Name:</strong> {file.name.toLowerCase()}
                  </p>
                  <p>
                    <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p>
                    <strong>Type:</strong> {file.type.toLowerCase()}
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="locationName">Location</Label>
                <Select
                  value={locationName}
                  onValueChange={(value) => setLocationName(value.toLowerCase() as Locations)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(Locations).map(([key, value]) => (
                      <SelectItem key={key} value={key.toLowerCase()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value.toLowerCase() as Categories)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(Categories).map(([key, value]) => (
                      <SelectItem key={key} value={key.toLowerCase()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select value={brand} onValueChange={(value) => setBrand(value.toLowerCase() as Brands)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(Brands).map(([key, value]) => (
                      <SelectItem key={key} value={key.toLowerCase()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="colors">Colors</Label>
                <Select
                  value={colors.join(", ")}
                  onValueChange={(value) => setColors(value.split(", ").map((color) => color.toLowerCase() as Colors))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select colors" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(Colors).map(([key, value]) => (
                      <SelectItem key={key} value={key.toLowerCase()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">Size</Label>
                <Select value={size} onValueChange={(value) => setSize(value.toLowerCase() as Size)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(Size).map(([key, value]) => (
                      <SelectItem key={key} value={key.toLowerCase()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="material">Material</Label>
                <Select value={material} onValueChange={(value) => setMaterial(value.toLowerCase() as Materials)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(Materials).map(([key, value]) => (
                      <SelectItem key={key} value={key.toLowerCase()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weatherFound">Weather Found</Label>
                <Select value={weatherFound} onValueChange={(value) => setWeatherFound(value.toLowerCase() as Weather)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(Weather).map(([key, value]) => (
                      <SelectItem key={key} value={key.toLowerCase()}>
                        {value}
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
                  onChange={(e) => setDescription(e.target.value.toLowerCase())}
                  placeholder="Provide any additional details about the item..."
                />
              </div>
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <KeywordSearch
                  selectedKeywords={keywords}
                  setSelectedKeywords={setKeywords}
                  availableKeywords={keywords_list}
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
  )
}

export default LostItemUploadPage