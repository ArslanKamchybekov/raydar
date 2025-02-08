"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface DragDropUploadProps {
  onFileUpload: (file: File) => void
}

export function DragDropUpload({ onFileUpload }: DragDropUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0])
      }
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600">Drag and drop your image here, or click to select a file</p>
      <p className="mt-1 text-xs text-gray-500">(Only *.jpeg, *.jpg, *.png, and *.gif images will be accepted)</p>
    </div>
  )
}

