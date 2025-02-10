"use client";
import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserProfile } from "@/components/user-profile";
import config from "@/config";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Bell,
  HomeIcon,
  Map,
  Paintbrush,
  Settings,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardTopNav({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[55px] items-center gap-4 border-b px-4">
        {/* Hamburger Menu for Mobile */}
        <Dialog>
          <SheetTrigger className="lg:hidden p-2 transition">
            <HamburgerMenuIcon className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4">
            <SheetHeader>
              <div className="flex items-center gap-2">
                <Image
                  src="/sparkhacks-logo.png"
                  width={40}
                  height={40}
                  alt="App Logo"
                />
                <SheetTitle className="text-lg font-bold">Raydar</SheetTitle>
              </div>
            </SheetHeader>
            <DialogContent>
              <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
              <div className="mt-4 space-y-4">
                {/* Navigation Sections */}
                {[
                  { href: "/dashboard/feed", label: "Feed", icon: HomeIcon },
                  { href: "/dashboard/map", label: "Map View", icon: Map },
                  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
                  {
                    href: "/dashboard/upload-lost",
                    label: "Upload Item",
                    icon: UploadCloud,
                  },
                  {
                    href: "/dashboard/upload-sketch",
                    label: "Upload Sketch",
                    icon: Paintbrush,
                  },
                  {
                    href: "/dashboard/settings",
                    label: "Settings",
                    icon: Settings,
                  },
                ].map(({ href, label, icon: Icon }) => (
                  <DialogClose asChild key={href}>
                    <Link href={href}>
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Button>
                    </Link>
                  </DialogClose>
                ))}
              </div>
            </DialogContent>
          </SheetContent>
        </Dialog>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/sparkhacks-logo.png"
            width={40}
            height={40}
            alt="App Logo"
          />
          <span className="text-xl font-bold hidden lg:block">Raydar</span>
        </Link>

        {/* Right-side Utilities */}
        <div className="flex items-center gap-3 ml-auto">
          {config?.auth?.enabled && <UserProfile />}
          <ModeToggle />
        </div>
      </header>
      {/* Children */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
