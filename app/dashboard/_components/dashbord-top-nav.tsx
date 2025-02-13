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
  LucideIcon,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useUserData } from "@/utils/hook/useUserData";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
  adminOnly?: boolean;
}

const navigationLinks: NavItem[] = [
  { href: "/dashboard/feed", label: "Feed", icon: HomeIcon, group: "main" },
  { href: "/dashboard/map", label: "Map", icon: Map, group: "main" },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell, group: "main" },
  { href: "/dashboard/claims", label: "Claims", icon: Award, group: "main", adminOnly: true },
  { href: "/dashboard/upload-lost", label: "Upload", icon: UploadCloud, group: "actions" },
  { href: "/dashboard/upload-sketch", label: "Sketch", icon: Paintbrush, group: "actions" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, group: "system" },
];

interface DashboardTopNavProps {
  children: ReactNode;
}

export default function DashboardTopNav({ children }: DashboardTopNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserData();
  const isAdmin = user?.role === 'admin';

  const renderNavigationLinks = () => {
    let currentGroup = "";
    
    return navigationLinks
      .filter((item) => !item.adminOnly || isAdmin)
      .map((item, index) => {
        const { href, label, icon: Icon, group = "" } = item;
        const showSeparator = group !== currentGroup && index !== 0;
        currentGroup = group;
  
        return (
          <div key={href}>
            {showSeparator && <Separator className="my-2" />}
            <Link href={href} onClick={() => setIsOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 h-10"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Button>
            </Link>
          </div>
        );
      });
  };  

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 lg:h-[60px] items-center gap-4 px-4">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                  <Link 
                    href="/" 
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image
                      src="/logo.png"
                      width={40}
                      height={40}
                      alt="App Logo"
                      className="rounded-lg"
                      priority
                    />
                    <span className="font-bold text-lg">Raydar</span>
                  </Link>
                </div>
                <nav className="flex-1 overflow-auto py-4">
                  <div className="space-y-1 px-2">
                    {renderNavigationLinks()}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

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