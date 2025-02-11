"use client";

import Link from "next/link";
import * as React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { UserProfile } from "../user-profile";
import ModeToggle from "../mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import config from "@/config";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

interface NavItem {
  title: string;
  href: string;
  description: string;
}

const navigationItems: NavItem[] = [
  {
    title: "Feed",
    href: "/dashboard/feed",
    description: "View all lost items found on campus.",
  },
  {
    title: "Sketch",
    href: "/dashboard/upload-sketch",
    description: "Draw a sketch of the item you lost.",
  },
  {
    title: "Upload",
    href: "/dashboard/upload-lost",
    description: "Upload a lost item to the database.",
  },
];

export default function NavBar() {
  const { isSignedIn } = useAuth();
  const authEnabled = config?.auth?.enabled;

  const renderAuthItems = () => {
    if (!authEnabled || !isSignedIn) return null;

    return navigationItems.map((item) => (
      <NavigationMenuItem key={item.href} className="ml-5">
        <NavigationMenuTrigger className="dark:bg-black dark:bg-opacity-50">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="flex flex-col w-[400px] gap-3 p-4 lg:w-[500px]">
            <ListItem title={item.title} href={item.href}>
              {item.description}
            </ListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    ));
  };

  const renderMobileMenu = () => {
    if (!authEnabled || !isSignedIn) return (
      <Link href="/sign-in">
        <Button variant="outline" className="w-full">
          Login
        </Button>
      </Link>
    );

    return navigationItems.map((item) => (
      <Link key={item.href} href={item.href}>
        <Button variant="outline" className="w-full">
          {item.title}
        </Button>
      </Link>
    ));
  };

  return (
    <nav className="flex min-w-full fixed top-0 left-0 right-0 z-50 justify-between p-2 border-b dark:bg-black bg-white shadow-md">
      {/* Mobile Menu */}
      <div className="flex justify-between w-full md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9"
              aria-label="Open menu"
            >
              <GiHamburgerMenu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="max-w-[75%]">
            <SheetHeader>
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  width={50}
                  height={50}
                  alt="App Logo"
                  priority
                />
                <SheetTitle>Raydar</SheetTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Navigate through the app&apos;s sections.
              </p>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-4">
              {renderMobileMenu()}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex justify-between items-center gap-2">
          {isSignedIn && <UserProfile />}
          <ModeToggle />
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex w-full items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="pl-2 flex items-center gap-2" aria-label="Home">
            <Image 
              src="/logo.png" 
              width={50} 
              height={50} 
              alt="App Logo" 
              priority
            />
            <span className="text-xl font-bold">Raydar</span>
          </Link>
          <NavigationMenu className="ml-4">
            <NavigationMenuList>
              {renderAuthItems()}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          {!isSignedIn && authEnabled && (
            <Link href="/sign-in">
              <Button variant="outline">Login</Button>
            </Link>
          )}
          {isSignedIn && <UserProfile />}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";