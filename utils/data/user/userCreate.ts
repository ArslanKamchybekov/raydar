"use server"

import { prisma } from "@/lib/prisma"

interface UserCreateProps {
  full_name?: string
  username?: string
  emailAddress: string
  image: string
  subscription?: string
  user_id: string
  role?: string
}

export async function userCreate({
  full_name,
  username,
  emailAddress,
  image,
  subscription,
  user_id,
  role = "user",
}: UserCreateProps) {
  // check if email has @uic.edu
  // if (!emailAddress.includes("@uic.edu")) {
  //   throw new Error("Email must be a UIC email")
  // }

  try {
    const user = await prisma.user.create({
      data: {
        emailAddress,
        full_name: full_name ?? null,
        username: username ?? null,
        image,
        subscription: subscription ?? null,
        user_id,
        role,
      },
    })

    console.log("User created:", user)
    return { data: user }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating user:", error)
      return { error: error.message }
    }
    return { error: "An unknown error occurred" }
  }
}
