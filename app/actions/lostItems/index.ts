"use server"

import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from 'uuid'

export async function uploadLostItemSketch(file: File, imageName: string) {
  try {
    const imageId = uuidv4()
    const fileExt = file.name.split('.').pop()
    const fileName = `${imageId}.${fileExt}`
    const { data, error } = await supabase.storage
      .from('lost_images')
      .upload(fileName, file)

    if (error) throw error

    // Now insert the record into the database
    const { data: insertData, error: insertError } = await supabase
      .from('lost_items')
      .insert([
        {
          image_id: imageId,
          image_name: imageName,
        },
      ])
      .select()

    if (insertError) throw insertError

    return insertData[0]
  } catch (error) {
    console.error('Error uploading sketch:', error)
    throw error
  }
}

export async function getLostItems() {
  const { data, error } = await supabase
    .from('lost_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}
