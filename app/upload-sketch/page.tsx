"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { uploadLostItemSketch } from "../actions/lostItems"
import PageWrapper from "@/components/wrapper/page-wrapper"

export default function UploadSketchPage() {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file || !description) {
      toast({
        title: "Error",
        description: "Please select a file and enter a description.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Upload file to database
      const image = await uploadLostItemSketch(file, description)

      // Send POST request to server with description and imageId
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get_keywords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_id: image.image_id,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send data to the server")
      }

      const data = await response.json()
      console.log(data)

      toast({
        title: "Success",
        description: "Your sketch has been uploaded successfully.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to upload sketch. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <PageWrapper>   
        <div className="w-full max-w-md p-4">
        <Card>
            <CardHeader>
            <CardTitle>Upload Lost Item Sketch</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <Label htmlFor="file">Sketch Image</Label>
                <Input id="file" type="file" onChange={handleFileChange} accept="image/*" required />
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
                <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Sketch"}
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    </PageWrapper>
  )
}
