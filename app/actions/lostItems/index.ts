"use server";

import { supabase } from "@/lib/supabase"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export async function uploadLostItemSketch(file: File, description: string) {
  try {
    const image = randomUUID()
    const fileExt = file.name.split('.').pop()
    const fileName = `${image}.${fileExt}`
    
    // Upload file to Supabase storage
    const { error } = await supabase.storage
      .from("lost_images")
      .upload(fileName, file);

    if (error) throw error;

    const newLostItem = await prisma.lostItem.create({
      data: {
        image: image,
        description: description,
      },
    })

    return newLostItem
  } catch (error) {
    console.error("Error uploading sketch:", error);
    throw error;
  }
}

export async function getLostItems() {
  const lostItems = await prisma.lostItem.findMany({
    orderBy: {
      created_at: 'desc',
    },
  })

  return lostItems
}
