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
        userid: user.id,
        category: category.toLowerCase(),
        location: location.toLowerCase(),
        brand: brand?.toLowerCase() || null,
        color: color?.toLowerCase() || null,
        size: size?.toLowerCase() || null,
        material: material?.toLowerCase() || null,
        weather: weather?.toLowerCase() || null,
        enabled: true,
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
    .eq("userid", user.id)
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
    .eq("userid", user.id);

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
    .eq("userid", user.id)
    .eq("id", id);

  if (error) {
    throw error;
  }

  return data;
}

