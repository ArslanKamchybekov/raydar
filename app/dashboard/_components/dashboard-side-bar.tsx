"use client";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import {
  Bell,
  HomeIcon,
  Map,
  Paintbrush,
  Settings,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function DashboardSideBar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/feed", label: "Feed", icon: HomeIcon },
    { href: "/dashboard/map", label: "Map", icon: Map },
    { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
    { href: "/dashboard/upload-lost", label: "Upload", icon: UploadCloud },
    { href: "/dashboard/upload-sketch", label: "Sketch", icon: Paintbrush },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="lg:block hidden border-r h-full">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[55px] items-center justify-between border-b px-3 w-full">
            <Link
              className="flex items-center gap-2 font-semibold ml-1"
              href="/"
            >
              <Image
                src="/sparkhacks-logo.png"
                width={50}
                height={50}
                alt="App Logo"
                className="rounded-lg"
              />
              <span className="font-medium">Raydar</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:bg-gray-800",
                    {
                      "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50":
                        pathname === link.href,
                    }
                  )}
                >
                  <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-200 p-1 bg-white">
                    <link.icon className="h-4 w-4" />
                  </div>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-black/95 border-t shadow-lg backdrop-blur-sm z-[9999]">
        <nav className="flex justify-around items-center py-3 px-2 text-sm font-medium safe-area-inset-bottom">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex flex-col items-center gap-1 min-w-[4rem] text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 active:scale-95",
                {
                  "text-gray-900 dark:text-gray-50": pathname === link.href,
                }
              )}
            >
              <link.icon className="h-5 w-5" />
              <span className="text-xs truncate">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
