"use server"

import { clerkClient } from "@/lib/clerk"

interface SerializableUserData {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddress: string | null
}

export async function getUserData(id: string): Promise<SerializableUserData | null> {
  try {
    const user = await clerkClient.users.getUser(id)
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddresses[0]?.emailAddress || null,
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

