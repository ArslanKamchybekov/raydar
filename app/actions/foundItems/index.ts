"use server";

import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { checkMatch } from "../notifications";
import { randomUUID } from "crypto";
import { Item } from "@/types/types";

export async function getFoundItems() {
  try {
    const items = await prisma.foundItem.findMany({
      orderBy: { created_at: "desc" },
      where: { claimed: false },
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
  const fileExt = file.name.split(".").pop(); // Get actual file extension
  const fileName = `${randomUUID()}.${fileExt}`; // Keep full filename

  try {
    // Upload image to Supabase storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("found_images")
      .upload(fileName, file);

    if (storageError) throw storageError;

    // Get the public URL for the uploaded image
    const { data: urlData } = await supabase.storage
      .from("found_images")
      .getPublicUrl(fileName);

    // Create database record using Prisma
    const item = await prisma.foundItem.create({
      data: {
        user_id,
        image: fileName, // Store full filename instead of just UUID
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

    await checkMatch(item);

    return { ...item, image: urlData.publicUrl };
  } catch (error) {
    console.error("Error uploading found item:", error);
    // If there was an error, try to clean up the uploaded file
    await supabase.storage.from("found_images").remove([fileName]);
    throw error;
  }
}

export async function deleteFoundItem(id: string) {
  try {
    // Retrieve the item's image filename
    const item = await prisma.foundItem.findUnique({
      where: { id },
      select: { image: true },
    });

    if (!item || !item.image) throw new Error("Item or image not found");

    // Delete the image from Supabase storage
    const { error: storageError } = await supabase.storage
      .from("found_images")
      .remove([item.image]); // Use full filename

    if (storageError) throw storageError;

    // Delete the database record
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

    // Retrieve image URL using full stored filename
    const { data: imageUrl } = await supabase.storage
      .from("found_images")
      .getPublicUrl(item.image);

    return { ...item, image: imageUrl.publicUrl };
  } catch (error) {
    console.error("Error fetching found item:", error);
    throw error;
  }
}
