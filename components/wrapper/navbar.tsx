"use client"

import Link from "next/link"
import * as React from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import Image from "next/image"
import { Button } from "../ui/button"
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { UserProfile } from "../user-profile"
import ModeToggle from "../mode-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import config from "@/config"
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"
import { Dialog, DialogClose } from "@radix-ui/react-dialog"

export default function NavBar() {
  const { isSignedIn, userId } = useAuth()

  const authEnabled = config?.auth?.enabled

  const renderAuthItems = () => {
    if (!authEnabled) return null

    if (isSignedIn) {
      return (
        <>
          <NavigationMenuItem className="max-[825px]:hidden ml-5">
            <NavigationMenuTrigger className="dark:bg-black dark:bg-opacity-50">Feed</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex flex-col w-[400px] gap-3 p-4 lg:w-[500px]">
                <ListItem title="Feed" href="/dashboard/feed">
                  View all lost items found on campus.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem className="max-[825px]:hidden ml-5">
            <NavigationMenuTrigger className="dark:bg-black dark:bg-opacity-50">Sketch</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex flex-col w-[400px] gap-3 p-4 lg:w-[500px]">
                <ListItem title="Sketch" href="/dashboard/upload-sketch">
                  Draw a sketch of the item you lost.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem className="max-[825px]:hidden ml-5">
            <NavigationMenuTrigger className="dark:bg-black dark:bg-opacity-50">Upload</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex flex-col w-[400px] gap-3 p-4 lg:w-[500px]">
                <ListItem title="Upload" href="/dashboard/upload-lost">
                  Upload a lost item to the database.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </>
      )
    } 
  }

  const renderMobileMenu = () => {
    if (!authEnabled) return null

    if (isSignedIn) {
      return (
        <>
          <DialogClose asChild>
            <Link href="/dashboard/feed">
              <Button variant="outline" className="w-full">
                Feed
              </Button>
            </Link>
          </DialogClose>
          <DialogClose asChild>
            <Link href="/dashboard/upload-sketch">
              <Button variant="outline" className="w-full">
                Sketch
              </Button>
            </Link>
          </DialogClose>
          <DialogClose asChild>
            <Link href="/dashboard/upload-lost">
              <Button variant="outline" className="w-full">
                Upload
              </Button>
            </Link>
          </DialogClose>
        </>
      )
    }
  }

  return (
    <div className="flex min-w-full fixed justify-between p-2 border-b z-10 dark:bg-black dark:bg-opacity-50 bg-white">
      <div className="flex justify-between w-full min-[825px]:hidden">
        <Dialog>
          <SheetTrigger className="p-2 transition">
            <Button size="icon" variant="ghost" className="w-4 h-4" aria-label="Open menu" asChild>
              <GiHamburgerMenu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col space-y-3 mt-[1rem]">
              <DialogClose asChild>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Home
                  </Button>
                </Link>
              </DialogClose>
              {renderMobileMenu()}
            </div>
          </SheetContent>
        </Dialog>
        <ModeToggle />
      </div>
      <NavigationMenu>
        <NavigationMenuList className="max-[825px]:hidden flex gap-3 w-[100%] justify-between">
          <Link href="/" className="pl-2 flex items-center" aria-label="Home">
            <Image src="/sparkhacks-logo.png" width={50} height={50} alt="App Logo" />
            <span className="text-xl font-bold">Raydar</span>
          </Link>
        </NavigationMenuList>
        <NavigationMenuList>{renderAuthItems()}</NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2 max-[825px]:hidden">
        {isSignedIn && <UserProfile />}
        <ModeToggle />
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

