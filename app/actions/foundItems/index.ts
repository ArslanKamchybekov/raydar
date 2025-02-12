"use server";

import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { checkMatch } from "../notifications";
import { randomUUID } from "crypto";

export async function getFoundItems() {
  try {
    const items = await prisma.foundItem.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const { data: imageUrl } = await supabase.storage
          .from("found_images")
          .getPublicUrl("/" + item.image + "." + "jpg");
    
        const isValidUrl = await checkImageUrl(imageUrl.publicUrl);
    
        return {
          ...item,
          image: isValidUrl ? imageUrl.publicUrl : null
        };
      })
    );

    return itemsWithImages;
  } catch (error) {
    console.error("Error fetching found items:", error);
    throw error;
  }
}

async function checkImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error("Error checking URL:", error);
    return false;
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
  keywords: string[],
) {
  const image = randomUUID();
  const fileExt = file.name.split(".").pop();
  const fileName = `${image}.${fileExt}`;
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
        image,
        title: file.name,
        location: location,
        category: category,
        brand: brand,
        colors: colors,
        size: size,
        material: material,
        weather: weather,
        description: description,
        keywords: keywords,
      },
    });

    await checkMatch(item);

    return {
      ...item,
      image: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Error uploading found item:", error);
    // If there was an error, try to clean up the uploaded file
    if (image) {
      await supabase.storage.from("found_images").remove([fileName]);
    }
    throw error;
  }
}

export async function deleteFoundItem(id: string) {
  try {
    // First get the item to know the image ID
    const item = await prisma.foundItem.findUnique({
      where: { id },
      select: { image: true }
    });

    if (!item) {
      throw new Error("Item not found");
    }

    // Delete the image from Supabase storage
    const fileName = `${item.image}.jpg`;
    const { error: storageError } = await supabase.storage
      .from("found_images")
      .remove([fileName]);

    if (storageError) {
      throw storageError;
    }

    // Delete the database record using Prisma
    await prisma.foundItem.delete({
      where: { id }
    });
  } catch (error) {
    console.error("Error deleting found item:", error);
    throw error;
  }
}

export async function getFoundItem(id: string) {
  try {
    const item = await prisma.foundItem.findUnique({
      where: { id }
    });

    if (!item) {
      throw new Error("Item not found");
    }

    // Get the image URL from Supabase storage
    const { data: imageUrl } = await supabase.storage
      .from("found_images")
      .getPublicUrl(`${item.image}.jpg`);

    const isValidUrl = await checkImageUrl(imageUrl.publicUrl);

    return {
      ...item,
      image: isValidUrl ? imageUrl.publicUrl : null,
    };
  } catch (error) {
    console.error("Error fetching found item:", error);
    throw error;
  }
}