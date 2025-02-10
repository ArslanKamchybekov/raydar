"use client"

import ModeToggle from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { UserProfile } from '@/components/user-profile'
import config from '@/config'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Bell, HomeIcon, Map, Paintbrush, Settings, SheetIcon, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function DashboardTopNav({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[55px] items-center gap-4 border-b px-3">
        <Dialog>
          <SheetTrigger className="min-[1024px]:hidden p-2 transition">
            <HamburgerMenuIcon />
            <Link href="/">
              <span className="sr-only">Home</span>
            </Link>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <div className="flex items-center gap-2">
                <Image src="/sparkhacks-logo.png" width={50} height={50} alt="App Logo" />
                <SheetTitle>Raydar</SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex flex-col space-y-4 mt-6">
              {/* Home Section */}
              <div className="space-y-3">
                <SheetTitle>Home</SheetTitle>
                <Separator />
                <DialogClose asChild>
                  <Link href="/dashboard/feed">
                    <Button variant="outline" className="w-full">
                      <HomeIcon className="mr-2 h-4 w-4" /> Feed
                    </Button>
                  </Link>
                </DialogClose>
              </div>

              {/* Upload Section */}
              <div className="space-y-3">
                <SheetTitle>Upload</SheetTitle>
                <Separator />
                <div className="space-y-2">
                  <DialogClose asChild>
                    <Link href="/dashboard/upload-lost">
                      <Button variant="outline" className="w-full">
                        <UploadCloud className="mr-2 h-4 w-4" /> Upload Item
                      </Button>
                    </Link>
                  </DialogClose>
                  <DialogClose asChild>
                    <Link href="/dashboard/upload-sketch">
                      <Button variant="outline" className="w-full">
                        <Paintbrush className="mr-2 h-4 w-4" /> Upload Sketch
                      </Button>
                    </Link>
                  </DialogClose>
                </div>
              </div>

              {/* Explore Section */}
              <div className="space-y-3">
                <SheetTitle>Explore</SheetTitle>
                <Separator />
                <div className="space-y-2">
                  <DialogClose asChild>
                    <Link href="/dashboard/map">
                      <Button variant="outline" className="w-full">
                        <Map className="mr-2 h-4 w-4" /> Map View
                      </Button>
                    </Link>
                  </DialogClose>
                  <DialogClose asChild>
                    <Link href="/dashboard/alerts">
                      <Button variant="outline" className="w-full">
                        <Bell className="mr-2 h-4 w-4" /> Alerts
                      </Button>
                    </Link>
                  </DialogClose>
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-3">
                <SheetTitle>Settings</SheetTitle>
                <Separator />
                <DialogClose asChild>
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="w-full">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Button>
                  </Link>
                </DialogClose>
              </div>
            </div>
          </SheetContent>
        </Dialog>

        <div className="flex justify-center items-center gap-2 ml-auto">
          {config?.auth?.enabled && <UserProfile />}
          <ModeToggle />
        </div>
      </header>
      {children}
    </div>
  )
}