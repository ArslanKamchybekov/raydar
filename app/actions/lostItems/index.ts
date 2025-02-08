import { supabase } from "@/lib/supabase";

export async function getLostItems() {
  const { data, error } = await supabase
    .from("lost_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function createLostItem(image_name: string) {
  const { data, error } = await supabase
    .from("lost_items")
    .insert([
      {
        image_name,
      },
    ]);

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteLostItem(id: number) {
  const { error } = await supabase.from("lost_items").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getLostItem(id: number) {
  const { data, error } = await supabase
    .from("lost_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}