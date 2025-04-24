"use server";

import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { checkMatch } from "../notifications";
import { randomUUID } from "crypto";
import { Item } from "@/types/types";

export async function getFoundItems() {
  try {
    const items = await prisma.foundItem.findMany({
      where: {
        AND: [
          {
            claimed: false,
          },
          {
            reports: {
              none: {
                status: "resolved", 
              },
            },
          },
        ],
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            full_name: true,
            emailAddress: true,
            image: true,
          },
        },
        reports: true,
        claims: true,
      },
    });

    const itemsWithImages = await Promise.all(
      items.map(async (item: Item) => {
        if (!item.image) return { ...item, image: null };

        const { data: imageUrl } = await supabase.storage
          .from("found_images")
          .getPublicUrl(item.image);

        return { ...item, image: imageUrl.publicUrl };
      })
    );

    return itemsWithImages;
  } catch (error) {
    console.error("Error fetching found items:", error);
    throw error;
  }
}

export async function uploadFoundItem(
  user_id: string,
  file: File,
  location: string,
  category: string,
  brand: string,
  colors: string[],
  size: string,
  material: string,
  weather: string,
  description: string,
  keywords: string[]
) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${randomUUID()}.${fileExt}`;

  try {
    // Upload image to Supabase storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("found_images")
      .upload(fileName, file);

    if (storageError) throw storageError;

    const { data: urlData } = await supabase.storage
      .from("found_images")
      .getPublicUrl(fileName);

    const item = await prisma.foundItem.create({
      data: {
        user_id,
        image: fileName,
        title: file.name,
        location,
        category,
        brand,
        colors,
        size,
        material,
        weather,
        description,
        keywords,
      },
    });

    console.log("Item created:", item);

    await checkMatch(item);

    return { ...item, image: urlData.publicUrl };
  } catch (error) {
    console.error("Error uploading found item:", error);
    await supabase.storage.from("found_images").remove([fileName]);
    throw error;
  }
}

export async function deleteFoundItem(id: string) {
  try {
    const item = await prisma.foundItem.findUnique({
      where: { id },
      select: { image: true },
    });

    if (!item || !item.image) throw new Error("Item or image not found");

    const { error: storageError } = await supabase.storage
      .from("found_images")
      .remove([item.image]);

    if (storageError) throw storageError;

    await prisma.foundItem.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting found item:", error);
    throw error;
  }
}

export async function getFoundItem(id: string) {
  try {
    const item = await prisma.foundItem.findUnique({ where: { id } });

    if (!item || !item.image) throw new Error("Item not found");

    const { data: imageUrl } = await supabase.storage
      .from("found_images")
      .getPublicUrl(item.image);

    return { ...item, image: imageUrl.publicUrl };
  } catch (error) {
    console.error("Error fetching found item:", error);
    throw error;
  }
}
