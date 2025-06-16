import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type - support images, videos, and audio
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

    if (!supportedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Unsupported file type",
          supportedTypes: supportedTypes,
        },
        { status: 400 },
      )
    }

    // Validate file size (max 50MB for videos, 10MB for others)
    const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith("video/") ? "50MB" : "10MB"
      return NextResponse.json(
        {
          error: `File size must be less than ${maxSizeMB}`,
        },
        { status: 400 },
      )
    }

    // Convert file to base64 for preview (only for small files)
    let dataUrl = null
    if (file.size < 5 * 1024 * 1024) {
      // Only preview files under 5MB
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")
      dataUrl = `data:${file.type};base64,${base64}`
    }

    // Fast upload simulation (removed delay)
    // In production, this would upload to Vercel Blob immediately

    // Generate realistic server URL
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop()
    const serverFileName = `${timestamp}_${randomId}.${fileExtension}`

    // Mock server URL (in production, this would be real Vercel Blob URL)
    const serverUrl = `https://your-app.vercel.app/uploads/${serverFileName}`

    const mockResponse = {
      success: true,
      filename: file.name,
      serverFilename: serverFileName,
      url: serverUrl,
      previewUrl: dataUrl, // For immediate preview
      pathname: `/uploads/${serverFileName}`,
      size: file.size,
      contentType: file.type,
      uploadedAt: new Date().toISOString(),
      message: "File uploaded successfully to server",
      fileType: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "audio",
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Media Upload API (Preview Mode)",
    endpoint: "/api/upload",
    method: "POST",
    contentType: "multipart/form-data",
    supportedFormats: {
      images: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/bmp", "image/tiff"],
      videos: ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"],
      audio: ["audio/mp3", "audio/mpeg", "audio/wav", "audio/ogg"],
    },
    maxFileSize: {
      images: "10MB",
      videos: "50MB",
      audio: "10MB",
    },
    note: "This is a preview version. In production, files would be stored using Vercel Blob.",
    usage: {
      description: "Upload media files using FormData",
      example:
        'const formData = new FormData(); formData.append("file", mediaFile); fetch("/api/upload", { method: "POST", body: formData })',
    },
  })
}
