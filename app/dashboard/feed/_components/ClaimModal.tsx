"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getUserData } from "@/app/actions/user"
import type { ClerkUser, Item } from "@/types/types"
import { Loader2, Upload, X } from "lucide-react"

interface ClaimModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

const ClaimModal: React.FC<ClaimModalProps> = ({ isOpen, onOpenChange, item }) => {
  const [userData, setUserData] = useState<ClerkUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [claimReason, setClaimReason] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  useEffect(() => {
    if (item?.user_id) {
      const fetchUserData = async () => {
        try {
          setIsLoading(true)
          const data = await getUserData(item.user_id)
          setUserData(data)
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchUserData()
    }
  }, [item])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = [...images, ...files].slice(0, 5) // Limit to 5 images
    setImages(newImages)

    // Create preview URLs for the images
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls].slice(0, 5))
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviewUrls(newPreviewUrls)
  }

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement claim submission logic with images
    console.log("Claim submitted:", { 
      itemId: item?.id, 
      claimReason, 
      contactInfo,
      images 
    })
    onOpenChange(false)
  }

  if (!item) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claim Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Posted by</h3>
            {isLoading ? (
              <p>Fetching user data...</p>
            ) : userData ? (
              <div className="flex items-center space-x-4">
                <Image
                  src={userData.profileImageUrl || "/logo.png"}
                  alt="User Avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">
                    {userData.firstName} {userData.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{userData.emailAddress}</p>
                </div>
              </div>
            ) : (
              <p>No user data available</p>
            )}
          </div>
          <form onSubmit={handleSubmitClaim} className="space-y-4">
            <div>
              <label htmlFor="claimReason" className="block text-sm font-medium text-gray-700">
                Reason for Claim
              </label>
              <Textarea
                id="claimReason"
                value={claimReason}
                onChange={(e) => setClaimReason(e.target.value)}
                placeholder="Explain why you believe this item belongs to you"
                required
              />
            </div>
            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
                Contact Information
              </label>
              <Input
                id="contactInfo"
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Phone number or email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Evidence (Optional)
              </label>
              <div className="space-y-2">
                {imagePreviewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length < 5 && (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-500">Upload evidence images</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB (max 5 images)</p>
                      </div>
                      <Input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Submit Claim
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ClaimModal