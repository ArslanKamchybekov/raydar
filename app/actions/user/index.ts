"use server"

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getUserData(user_id: string) {
    const user = await currentUser();
    if (!user) throw new Error("User not found");
    const userData = await prisma.user.findUnique({
        where: { user_id: user_id },
        select: {
            id: true,
            user_id: true,
            full_name: true,
            emailAddress: true,
            image: true,
            role: true,
        },
    });
    return userData;
}

export async function getCurrentUserData() {
    const user = await currentUser();
    if (!user) throw new Error("User not found");
    const userData = await prisma.user.findUnique({
        where: { user_id: user.id },
        select: {
            id: true,
            user_id: true,
            full_name: true,
            emailAddress: true,
            image: true,
            role: true,
        },
    });
    return userData;
}