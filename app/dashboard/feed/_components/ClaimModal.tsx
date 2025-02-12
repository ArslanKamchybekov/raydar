"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { User, Item } from "@/types/types"
import { Loader2, Upload, X } from "lucide-react"
import { createClaim } from "@/app/actions/claims"
import { ClaimStatus } from "@/types/types"
import { useUser } from "@/utils/hook/useUser"

interface ClaimModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

const ClaimModal = ({ isOpen, onOpenChange, item }: ClaimModalProps) => {
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [claimReason, setClaimReason] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const { user } = useUser(item?.user_id || "")

  useEffect(() => {
    setIsLoading(true)
    if (user) {
      setUserData(user)
      setIsLoading(false)
    }
  }, [user])
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreviewUrl(null)
  }

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await createClaim(
      item?.id || "",
      claimReason,
      image,
      ClaimStatus.PENDING
    )

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
                  src={userData.image || "/logo.png"}
                  alt="User Avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">
                    {userData.full_name}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Evidence (Optional)
              </label>
              <div className="space-y-2">
                {imagePreviewUrl && (
                  <div className="relative">
                    <Image
                      src={imagePreviewUrl}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-gray-500 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
                {!image && (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-500">Upload an evidence image</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                      <Input
                        type="file"
                        className="hidden"
                        accept="image/*"
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
