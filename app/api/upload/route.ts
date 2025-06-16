import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (max 10MB for demo)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Convert file to base64 for preview
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 500))

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
    message: "Image Upload API (Preview Mode)",
    endpoint: "/api/upload",
    method: "POST",
    contentType: "multipart/form-data",
    supportedFormats: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",
    ],
    maxFileSize: "10MB",
    note: "This is a preview version. In production, files would be stored using Vercel Blob.",
    usage: {
      description: "Upload image files using FormData",
      example:
        'const formData = new FormData(); formData.append("file", imageFile); fetch("/api/upload", { method: "POST", body: formData })',
    },
  })
}
