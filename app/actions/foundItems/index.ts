'use server'

import { supabase } from "@/lib/supabase";
import { Locations, Categories, Brands, Colors, Size, Materials, Weather } from "@/types/enums";

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

export async function createFoundItem(
  image_id: string,
  image_name: string,
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
  const { data, error } = await supabase
    .from("found_items")
    .insert([
      {
        image_id,
        image_name,
        location_name,
        category,
        brand,
        colors,
        size,
        material,
        weather_found,
        description,
        keywords,
      },
    ]);

  if (error) {
    throw error;
  }
  return data;
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
