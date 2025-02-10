"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import config from "@/config";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const router = useRouter();
  const { user } = useUser();

  if (!config?.auth?.enabled) {
    router.back();
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-700 transition hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.fullName || "User Profile"}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-medium">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 sm:w-56 lg:w-56"
          align="end"
          sideOffset={4}
        >
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.fullName || "User Profile"}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-medium">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/dashboard/settings">
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <SignOutButton>
            <DropdownMenuItem className="gap-2 text-red-600">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
