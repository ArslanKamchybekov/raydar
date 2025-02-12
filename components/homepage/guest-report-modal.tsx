"use client"

import { useState } from "react"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { uploadFoundItem } from "@/app/actions/foundItems"


export default function GuestReportModal() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // user_id: string,
  // file: File,
  // location: string,
  // category: string,
  // brand: string,
  // colors: string[],
  // size: string,
  // material: string,
  // weather: string,
  // description: string,
  // keywords: string[],

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      location: { value: string };
      item: { value: string };
    };
    // await uploadFoundItem(
    //   "guest",
    //   null,
    //   target.location.value,
    //   "Misc",
    //   "N/A",
    //   [],
    //   "N/A",
    //   "N/A",
    //   "N/A",
    //   target.item.value,
    //   [],
    // )
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="flex items-center gap-2">
          <UploadCloud size={20} />
          Upload Lost Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Lost Item as Guest</DialogTitle>
          <DialogDescription>Quickly report your lost item. Sign up later to manage your reports.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item" className="text-right">
                Item
              </Label>
              <Input id="item" className="col-span-3" placeholder="e.g. Blue Backpack" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Last Seen
              </Label>
              <Input id="location" className="col-span-3" placeholder="e.g. Library, 2nd floor" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" className="col-span-3" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
            <Button variant="outline" onClick={() => router.push("/sign-in")}>
              Login 
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

