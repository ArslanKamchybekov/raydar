"use server";

import { supabase } from "@/lib/supabase";
import {
  Locations,
  Categories,
  Brands,
  Colors,
  Size,
  Materials,
  Weather,
} from "@/types/enums";
import { randomUUID } from "crypto";
import { checkItemMatchesAndNotify } from "../notifications";

export async function getFoundItems() {
  const { data, error } = await supabase
    .from("found_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  // Get signed URLs for all images
  const itemsWithImages = await Promise.all(
    data.map(async (item) => {
      const { data: imageUrl } = await supabase.storage
        .from("found_images")
        .getPublicUrl("/" + item.image_id + "." + "jpg");

      return {
        ...item,
        image_url: imageUrl.publicUrl,
      };
    })
  );

  return itemsWithImages;
}

export async function uploadFoundItem(
  file: File,
  location_name: Locations,
  category: Categories,
  brand: Brands | null,
  colors: Colors[],
  size: Size | null,
  material: Materials | null,
  weather_found: Weather | null,
  description: string | null,
  keywords: string[]
) {
  try {
    const imageId = randomUUID();
    const fileExt = file.name.split(".").pop();
    const fileName = `${imageId}.${fileExt}`;

    // Upload image to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("found_images")
      .upload(fileName, file);

    if (storageError) throw storageError;

    // Get the public URL for the uploaded image
    const { data: urlData } = await supabase.storage
      .from("found_images")
      .getPublicUrl(fileName);

    // Create database record
    const { data: insertData, error: insertError } = await supabase
      .from("found_items")
      .insert([
        {
          image_id: imageId,
          location_name: location_name.toLowerCase(),
          category: category.toLowerCase(),
          brand: brand?.toLowerCase() || null,
          colors: colors.map((c) => c.toLowerCase()),
          size: size?.toLowerCase() || null,
          material: material?.toLowerCase() || null,
          weather_found: weather_found?.toLowerCase() || null,
          description: description?.toLowerCase() || null,
          keywords: keywords.map((k) => k.toLowerCase()),
        },
      ])
      .select();

    if (insertError) {
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage.from("found_images").remove([fileName]);
      throw insertError;
    }

    // Notify users of any matching alerts
    await checkItemMatchesAndNotify(insertData[0]);

    return {
      ...insertData[0],
      image_url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Error uploading found item:", error);
    throw error;
  }
}

export async function deleteFoundItem(id: number) {
  // First get the item to know the image ID
  const { data: item, error: fetchError } = await supabase
    .from("found_items")
    .select("image_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // Delete the image from storage
  const fileName = `${item.image_id}.${item.image_id.split(".").pop()}`;
  const { error: storageError } = await supabase.storage
    .from("found_images")
    .remove([fileName]);

  if (storageError) {
    throw storageError;
  }

  // Delete the database record
  const { error: deleteError } = await supabase
    .from("found_items")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw deleteError;
  }
}

export async function getFoundItem(id: number) {
  const { data, error } = await supabase
    .from("found_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  // Get the image URL
  const { data: imageUrl } = await supabase.storage
    .from("found_images")
    .getPublicUrl(`${data.image_id}.${data.image_id.split(".").pop()}`);

  return {
    ...data,
    image_url: imageUrl.publicUrl,
  };
}
