'use server'

import { supabase } from "@/lib/supabase";
import { Locations, Categories, Brands, Colors, Size, Materials, Weather } from "@/types/enums";
import { v4 as uuidv4 } from 'uuid'

export async function getFoundItems() {
  const { data, error } = await supabase
    .from("found_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
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
    const imageId = uuidv4()
    const fileExt = file.name.split('.').pop()
    const fileName = `${imageId}.${fileExt}`

    // Upload image to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('found_images')
      .upload(fileName, file)

    if (storageError) throw storageError

    // Create database record
    const { data: insertData, error: insertError } = await supabase
      .from('found_items')
      .insert([
        {
          image_id: imageId,
          location_name: location_name.toLowerCase(),
          category: category.toLowerCase(),
          brand: brand?.toLowerCase() || null,
          colors: colors.map(c => c.toLowerCase()),
          size: size?.toLowerCase() || null,
          material: material?.toLowerCase() || null,
          weather_found: weather_found?.toLowerCase() || null,
          description: description?.toLowerCase() || null,
          keywords: keywords.map(k => k.toLowerCase()),
        },
      ])
      .select()

    if (insertError) {
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage
        .from('found_images')
        .remove([fileName])
      throw insertError
    }

    return insertData[0]
  } catch (error) {
    console.error('Error uploading found item:', error)
    throw error
  }
}


export async function deleteFoundItem(id: number) {
  const { error } = await supabase.from("found_items").delete().eq("id", id);

  if (error) {
    throw error;
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

  return data;
}
