"use server"

import { clerkClient } from "@/lib/clerk"
import { ClerkUser } from "@/types/types"

export async function getUserData(id: string): Promise<ClerkUser> {
  try {
    const user = await clerkClient.users.getUser(id)
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddresses[0]?.emailAddress,
      profileImageUrl: user.imageUrl,
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    throw new Error("Failed to fetch user data")
  }
}

