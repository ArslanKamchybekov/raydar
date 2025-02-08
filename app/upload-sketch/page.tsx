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
  const [imageName, setImageName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file || !imageName) {
      toast({
        title: "Error",
        description: "Please select a file and enter an image name.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      await uploadLostItemSketch(file, imageName)
      toast({
        title: "Success",
        description: "Your sketch has been uploaded successfully.",
      })
      router.push("/") // Redirect to home page or a confirmation page
    } catch (error) {
      console.error("Error uploading sketch:", error)
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
        <div className="container mx-auto py-8">
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
                <Label htmlFor="imageName">Image Name</Label>
                <Input
                    id="imageName"
                    type="text"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
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

