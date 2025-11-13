"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  initialImage?: string
}

export default function ImageUpload({ onImageUploaded, initialImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [error, setError] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo debe ser menor a 5MB")
      return
    }

    setError("")
    setUploading(true)

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al subir la imagen")
        setPreview(null)
        return
      }

      onImageUploaded(data.url)
    } catch (err) {
      setError("Error al subir la imagen")
      setPreview(null)
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {preview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-600 bg-slate-700">
          <Image
            src={preview || "/placeholder.svg"}
            alt="Preview"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <label htmlFor="image-input" className="flex-1">
          <div className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-600 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors bg-slate-700/50">
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                <span className="text-sm text-slate-400">Subiendo...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-400">Selecciona una imagen</span>
              </>
            )}
          </div>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
