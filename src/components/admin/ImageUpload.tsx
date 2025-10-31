"use client"

import { useState, useRef, DragEvent } from "react"
import toast from "react-hot-toast"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  label?: string
}

export default function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  label = "Product Images",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    )

    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files))
    }
  }

  const uploadFiles = async (files: File[]) => {
    if (value.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`)
      return
    }

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          {
            method: "POST",
            body: formData,
          }
        )

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      onChange([...value, ...uploadedUrls])
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload images")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...value]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-900">{label}</label>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-black bg-gray-50"
            : "border-gray-300 hover:border-gray-400"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || value.length >= maxFiles}
        />

        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || value.length >= maxFiles}
              className="text-sm font-medium text-black hover:underline disabled:opacity-50"
            >
              Click to upload
            </button>
            <span className="text-sm text-gray-600"> or drag and drop</span>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB (max {maxFiles} images)
          </p>
          {uploading && (
            <p className="text-xs text-gray-600 font-medium">Uploading...</p>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square border border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Badge for primary image */}
              {index === 0 && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-black text-white">
                    Primary
                  </span>
                </div>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center space-x-2">
                {/* Move left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg shadow-lg hover:scale-110 transition-all"
                  >
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg shadow-lg hover:scale-110 transition-all"
                >
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                {/* Move right */}
                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg shadow-lg hover:scale-110 transition-all"
                  >
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
