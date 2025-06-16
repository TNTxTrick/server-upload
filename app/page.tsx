"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, ImageIcon, Palette, Check, X, FileText, Video, Music, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const backgroundColors = [
  { name: "Neon Blue", value: "from-blue-900 via-black to-cyan-900" },
  { name: "Neon Purple", value: "from-purple-900 via-black to-pink-900" },
  { name: "Neon Green", value: "from-green-900 via-black to-emerald-900" },
  { name: "Neon Red", value: "from-red-900 via-black to-orange-900" },
  { name: "Neon Yellow", value: "from-yellow-900 via-black to-amber-900" },
  { name: "Dark Matrix", value: "from-gray-900 via-black to-slate-900" },
]

export default function NeonMediaUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<any[]>([])
  const [backgroundGradient, setBackgroundGradient] = useState(backgroundColors[0].value)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Accept all supported media files
    const supportedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",
      // Videos
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      // Audio
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
    ]

    const mediaFiles = files.filter((file) => supportedTypes.includes(file.type))
    setSelectedFiles((prev) => [...prev, ...mediaFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    const results = []

    // Upload files concurrently for maximum speed
    const uploadPromises = selectedFiles.map(async (file, index) => {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()
        return {
          file: file.name,
          success: response.ok,
          data: result,
          index: index,
        }
      } catch (error) {
        return {
          file: file.name,
          success: false,
          error: error.message,
          index: index,
        }
      }
    })

    const uploadResults = await Promise.all(uploadPromises)

    // Sort results by original index to maintain order
    uploadResults.sort((a, b) => a.index - b.index)

    setUploadResults(uploadResults)
    setUploading(false)
    setSelectedFiles([])
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-cyan-400" />
    if (file.type.startsWith("video/")) return <Video className="w-5 h-5 text-purple-400" />
    if (file.type.startsWith("audio/")) return <Music className="w-5 h-5 text-green-400" />
    return <File className="w-5 h-5 text-gray-400" />
  }

  const getFileTypeColor = (fileType: string) => {
    if (fileType === "image") return "text-cyan-400 bg-cyan-400/10"
    if (fileType === "video") return "text-purple-400 bg-purple-400/10"
    if (fileType === "audio") return "text-green-400 bg-green-400/10"
    return "text-gray-400 bg-gray-400/10"
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-ping"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse">
            NEON UPLOAD
          </h1>
          <p className="text-xl text-cyan-300/80 font-light tracking-wide">Upload your media files with style</p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Preview Mode Notice */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 backdrop-blur-lg border border-yellow-500/30 rounded-lg p-4 text-center">
            <p className="text-yellow-300 font-medium">🚀 High-Speed Upload Mode</p>
            <p className="text-yellow-400/80 text-sm mt-1">
              Optimized for fast uploads. Supports images, videos (MP4), and audio (MP3) files.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40"
          >
            <Palette className="w-4 h-4 mr-2" />
            Change Theme
          </Button>

          <Button
            onClick={() => window.open("/api-docs", "_blank")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40"
          >
            <FileText className="w-4 h-4 mr-2" />
            API Documentation
          </Button>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <Card className="max-w-md mx-auto mb-8 bg-black/40 backdrop-blur-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-cyan-300 mb-4">Choose Background Theme</h3>
              <div className="grid grid-cols-2 gap-3">
                {backgroundColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setBackgroundGradient(color.value)
                      setShowColorPicker(false)
                    }}
                    className={`p-3 rounded-lg bg-gradient-to-r ${color.value} border-2 transition-all duration-300 hover:scale-105 ${
                      backgroundGradient === color.value
                        ? "border-cyan-400 shadow-lg shadow-cyan-400/30"
                        : "border-transparent hover:border-cyan-500/50"
                    }`}
                  >
                    <span className="text-white text-sm font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Upload Area */}
        <Card className="max-w-2xl mx-auto mb-8 bg-black/40 backdrop-blur-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="p-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-500/50 rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/5 group"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                  <Upload className="w-12 h-12 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">Drop your media files here</h3>
                  <p className="text-cyan-400/70">or click to browse all device files</p>
                  <div className="text-sm text-cyan-500/60 mt-3 space-y-1">
                    <p>📸 Images: JPG, PNG, GIF, WebP, SVG, BMP, TIFF</p>
                    <p>🎥 Videos: MP4, MPEG, MOV, AVI (up to 50MB)</p>
                    <p>🎵 Audio: MP3, WAV, OGG (up to 10MB)</p>
                  </div>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.mp4,.mp3,.gif"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </Card>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <Card className="max-w-2xl mx-auto mb-8 bg-black/40 backdrop-blur-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
                <File className="w-5 h-5 mr-2" />
                Selected Files ({selectedFiles.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-cyan-500/20"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <p className="text-cyan-300 font-medium truncate">{file.name}</p>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-cyan-400/60">{formatFileSize(file.size)}</span>
                          <span className="text-cyan-500/60">•</span>
                          <span className="text-cyan-400/60">{file.type}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeFile(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading at high speed...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <Card className="max-w-4xl mx-auto bg-black/40 backdrop-blur-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-cyan-300 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-400" />
                  Upload Results ({uploadResults.length} files)
                </h3>
                <div className="text-sm text-cyan-400">
                  Success: {uploadResults.filter((r) => r.success).length} | Failed:{" "}
                  {uploadResults.filter((r) => !r.success).length}
                </div>
              </div>

              <div className="space-y-4">
                {uploadResults.map((result, index) => (
                  <div key={index} className="p-4 bg-black/30 rounded-lg border border-cyan-500/20">
                    <div className="flex items-start space-x-4">
                      {/* Status Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {result.success ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-cyan-300 font-medium truncate">{result.file}</p>
                          {result.success && result.data && (
                            <span className={`text-xs px-2 py-1 rounded ${getFileTypeColor(result.data.fileType)}`}>
                              {result.data.fileType?.toUpperCase() || "FILE"}
                            </span>
                          )}
                        </div>

                        {result.success && result.data ? (
                          <div className="space-y-3">
                            {/* Media Preview */}
                            <div className="flex items-center space-x-4">
                              {result.data.fileType === "image" && result.data.previewUrl ? (
                                <img
                                  src={result.data.previewUrl || "/placeholder.svg"}
                                  alt={result.file}
                                  className="w-16 h-16 object-cover rounded border border-cyan-500/30 shadow-lg"
                                />
                              ) : result.data.fileType === "video" ? (
                                <div className="w-16 h-16 bg-purple-500/20 rounded border border-purple-500/30 flex items-center justify-center">
                                  <Video className="w-8 h-8 text-purple-400" />
                                </div>
                              ) : result.data.fileType === "audio" ? (
                                <div className="w-16 h-16 bg-green-500/20 rounded border border-green-500/30 flex items-center justify-center">
                                  <Music className="w-8 h-8 text-green-400" />
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gray-500/20 rounded border border-gray-500/30 flex items-center justify-center">
                                  <File className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-green-400 text-sm mb-1">{result.data.message}</p>
                                <p className="text-cyan-400/60 text-xs">
                                  Size: {formatFileSize(result.data.size)} | Type: {result.data.contentType} | Uploaded:{" "}
                                  {new Date(result.data.uploadedAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>

                            {/* Server Link */}
                            <div className="bg-black/40 rounded-lg p-3">
                              <p className="text-cyan-300 text-sm font-medium mb-2">🔗 Server Link:</p>
                              <div className="flex items-center justify-between p-2 bg-black/30 rounded border border-cyan-500/20">
                                <div className="flex-1 min-w-0">
                                  <p className="text-cyan-300 text-sm font-mono truncate">{result.data.url}</p>
                                </div>
                                <div className="flex space-x-2 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(result.data.url)}
                                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-2"
                                  >
                                    Copy
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => window.open(result.data.url, "_blank")}
                                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-2"
                                  >
                                    Open
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-red-400 text-sm">
                            <p>❌ Upload failed: {result.error || "Unknown error"}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6 pt-4 border-t border-cyan-500/20">
                <Button
                  onClick={() => {
                    const allLinks = uploadResults
                      .filter((r) => r.success && r.data?.url)
                      .map((r) => r.data.url)
                      .join("\n")
                    copyToClipboard(allLinks)
                  }}
                  variant="ghost"
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                >
                  Copy All Links
                </Button>
                <Button
                  onClick={() => setUploadResults([])}
                  variant="ghost"
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                >
                  Clear Results
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
