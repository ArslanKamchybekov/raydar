'use server'

import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto"
import { currentUser } from "@clerk/nextjs/server";


export async function createAlert(
  category: string,
  location: string,
  brand: string | null,
  color: string | null,
  size: string | null,
  material: string | null,
  weather: string | null,
) {
  const { user } = await currentUser();
  const { data, error } = await supabase
    .from("alerts")
    .insert([
      {
        userId: user.id,
        category,
        location,
        brand,
        color,
        size,
        material,
        weather,
      },
    ]);

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteAlert(id: string) {
  const { data, error } = await supabase
    .from("alerts")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return data;
}

