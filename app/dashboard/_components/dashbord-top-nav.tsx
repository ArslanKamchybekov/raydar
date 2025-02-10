"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import ModeToggle from "@/components/mode-toggle";
import { UserProfile } from "@/components/user-profile";
import config from "@/config";
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

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const navigationLinks = [
  { href: "/dashboard/feed", label: "Feed", icon: HomeIcon },
  { href: "/dashboard/map", label: "Map View", icon: Map },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/upload-lost", label: "Upload Item", icon: UploadCloud },
  {
    href: "/dashboard/upload-sketch",
    label: "Upload Sketch",
    icon: Paintbrush,
  },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardTopNav({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 lg:h-[60px] items-center px-4 gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 lg:hidden"
                aria-label="Toggle navigation"
              >
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex h-14 items-center border-b px-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      width={40}
                      height={40}
                      alt="App Logo"
                      className="rounded-lg"
                    />
                    <span className="font-semibold text-lg">Raydar</span>
                  </div>
                </div>
                <nav className="flex-1 overflow-auto py-4">
                  <div className="space-y-1 px-2">
                    {navigationLinks.map(({ href, label, icon: Icon }) => (
                      <Link key={href} href={href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 px-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo - Show on all screens */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={32}
              height={32}
              alt="App Logo"
              className="rounded-lg"
            />
            <span className="font-semibold hidden sm:inline-block">Raydar</span>
          </div>

          {/* Right-side utilities */}
          <div className="flex items-center gap-3 ml-auto">
            {config?.auth?.enabled && <UserProfile />}
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
