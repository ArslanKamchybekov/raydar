import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClerkClient } from "@clerk/nextjs/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
