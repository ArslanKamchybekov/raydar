"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function createAlert(
  category: string,
  location: string,
  brand: string,
  color: string,
  size: string,
  material: string,
  weather: string
) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  try {
    const alert = await prisma.alert.create({
      data: {
        user_id: user.id,
        category,
        location,
        brand: brand,
        colors: color ? color.split(",") : [],
        size: size,
        material: material,
        weather: weather,
      },
    });

    return alert;
  } catch (error) {
    throw new Error("Failed to create alert: " + error);
  }
}

export async function deleteAlert(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  try {
    await prisma.alert.deleteMany({
      where: {
        id,
        user_id: user.id,
      },
    });
  } catch (error) {
    throw new Error("Failed to delete alert: " + error);
  }
}

export async function getAlerts() {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  try {
    return await prisma.alert.findMany({
      where: { user_id: user.id },
    });
  } catch (error) {
    throw new Error("Failed to fetch alerts: " + error);
  }
}

export async function toggleAlert(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  try {
    const alert = await prisma.alert.findUnique({
      where: { id },
      select: { enabled: true },
    });

    if (!alert) {
      throw new Error("Alert not found");
    }

    return await prisma.alert.update({
      where: { id },
      data: { enabled: !alert.enabled },
    });
  } catch (error) {
    throw new Error("Failed to toggle alert: " + error);
  }
}
