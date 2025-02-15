"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, X, MessageCircle, Send } from "lucide-react"
import { createClaim } from "@/app/actions/claims"
import { ClaimStatus, Item } from "@/types/types"
import { useUserData  } from "@/utils/hook/useUserData"
import { useUser } from "@clerk/nextjs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
}

interface ClaimModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

const ClaimModal = ({ isOpen, onOpenChange, item }: ClaimModalProps) => {
  const [claimReason, setClaimReason] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const currentUser = useUser()
  const { user, isLoading } = useUserData(item?.user_id || "")
  
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

    toast({ title: "Success",
      description: "Claim request submitted successfully"
     })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: currentUser.user?.id || "",
      timestamp: new Date()
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  if (!item) return null

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
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Image
                  src={user.image || "/logo.png"}
                  alt="User Avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">
                    {user.full_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.emailAddress}</p>
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

          <Button
            onClick={() => setIsChatOpen(!isChatOpen)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Send a Message
          </Button>

          {isChatOpen && (
            <div className="border rounded-lg p-4 space-y-4">
              <ScrollArea className="h-[200px] w-full pr-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === "currentUser" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          msg.senderId === "currentUser"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ClaimModal