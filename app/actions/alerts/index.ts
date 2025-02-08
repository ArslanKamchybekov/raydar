'use server'

import { supabase } from "@/lib/supabase";
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
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }
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
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }
  const { error } = await supabase
    .from("alerts")
    .delete()
    .eq("userId", user.id)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getAlerts() {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("userId", user.id);

  if (error) {
    throw error;
  }

  return data;
}

export async function toggleAlert(id: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }
  const { data, error } = await supabase
    .from("alerts")
    .update({ enabled: true })
    .eq("userId", user.id)
    .eq("id", id);

  if (error) {
    throw error;
  }

  return data;
}

