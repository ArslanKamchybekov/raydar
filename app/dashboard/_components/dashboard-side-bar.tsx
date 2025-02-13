"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Bell,
  HomeIcon,
  Map,
  Paintbrush,
  Settings,
  UploadCloud,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUserData } from "@/utils/hook/useUserData";

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
  adminOnly?: boolean;
};

const navigationLinks: NavLink[] = [
  { href: "/dashboard/feed", label: "Feed", icon: HomeIcon, group: "main" },
  { href: "/dashboard/map", label: "Map", icon: Map, group: "main" },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell, group: "main" },
  { href: "/dashboard/claims", label: "Claims", icon: Award, group: "main", adminOnly: true },
  { href: "/dashboard/upload-lost", label: "Upload", icon: UploadCloud, group: "upload" },
  { href: "/dashboard/upload-sketch", label: "Sketch", icon: Paintbrush, group: "upload" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, group: "settings" },
];

export default function DashboardSideBar() {
  const pathname = usePathname();
  const { user } = useUserData();
  const isAdmin = user?.role === 'admin';

  const NavLink = ({ href, label, icon: Icon, adminOnly }: NavLink) => {
    // Hide admin-only links for non-admin users
    if (adminOnly && !isAdmin) return null;
    
    const isActive = pathname === href;
    
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:bg-gray-800",
          isActive && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
        )}
      >
        <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-200 p-1 bg-white">
          <Icon className="h-4 w-4" />
        </div>
        {label}
      </Link>
    );
  };

  const MobileNavLink = ({ href, label, icon: Icon, adminOnly }: NavLink) => {
    // Hide admin-only links for non-admin users
    if (adminOnly && !isAdmin) return null;
    
    const isActive = pathname === href;
    
    return (
      <Link
        href={href}
        className={cn(
          "flex flex-col items-center gap-1 min-w-[4rem] text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 active:scale-95",
          isActive && "text-gray-900 dark:text-gray-50"
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="text-xs truncate">{label}</span>
      </Link>
    );
  };

  // Group navigation links and filter out admin-only links for non-admin users
  const groupedLinks = navigationLinks
    .filter(link => !link.adminOnly || isAdmin)
    .reduce((acc, link) => {
      const group = link.group || 'other';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(link);
      return acc;
    }, {} as Record<string, NavLink[]>);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="lg:block hidden border-r h-full">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[61px] items-center border-b px-3 w-full">
            <Link
              className="flex items-center gap-2 font-semibold ml-1"
              href="/"
              aria-label="Home"
            >
              <Image
                src="/logo.png"
                width={50}
                height={50}
                alt="App Logo"
                className="rounded-lg"
                priority
              />
              <span className="font-bold text-lg">Raydar</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {/* Main Navigation */}
              {groupedLinks.main?.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
              
              {/* Upload Section */}
              {groupedLinks.upload && (
                <>
                  <Separator className="my-4" />
                  {groupedLinks.upload.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                </>
              )}
              
              {/* Settings Section */}
              {groupedLinks.settings && (
                <>
                  <Separator className="my-4" />
                  {groupedLinks.settings.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                </>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-black/95 border-t shadow-lg backdrop-blur-sm z-[9999]">
        <nav className="flex justify-around items-center py-3 px-2 text-sm font-medium safe-area-inset-bottom">
          {navigationLinks
            .filter(link => !link.adminOnly || isAdmin)
            .map((link) => (
              <MobileNavLink key={link.href} {...link} />
          ))}
        </nav>
      </div>
    </>
  );
}