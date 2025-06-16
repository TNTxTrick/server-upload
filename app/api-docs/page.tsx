"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Code, FileText, ArrowLeft } from "lucide-react"

export default function ApiDocs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (text: string, codeType: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(codeType)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const javascriptExample = `// JavaScript/Node.js Example - Media Upload
async function uploadMedia(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://your-app.vercel.app/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Upload successful!');
      console.log('File URL:', result.url);
      console.log('File type:', result.fileType);
      console.log('File size:', result.size);
      return result.url;
    } else {
      console.error('Upload failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage with file input (all device files)
document.getElementById('fileInput').addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    // Check if file is supported
    const supportedTypes = [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      // Videos  
      'video/mp4', 'video/mpeg', 'video/quicktime',
      // Audio
      'audio/mp3', 'audio/mpeg', 'audio/wav'
    ];
    
    if (supportedTypes.includes(file.type)) {
      uploadMedia(file);
    }
  });
});

// Batch upload with progress tracking
async function uploadMultipleFiles(files) {
  const results = [];
  
  // Upload all files concurrently for maximum speed
  const uploadPromises = files.map(async (file, index) => {
    console.log(\`Uploading \${file.name}...\`);
    const url = await uploadMedia(file);
    return { file: file.name, url, index };
  });
  
  const uploadResults = await Promise.all(uploadPromises);
  console.log(\`Uploaded \${uploadResults.length} files successfully!\`);
  
  return uploadResults;
}`

  const pythonExample = `# Python Example - High-Speed Media Upload
import requests
import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

def upload_media_file(file_path):
    """
    Upload a media file (image, video, audio) to the server
    
    Args:
        file_path (str): Path to the media file
        
    Returns:
        dict: Server response with file URL and metadata
    """
    url = "https://your-app.vercel.app/api/upload"
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            response = requests.post(url, files=files)
            
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Upload successful: {result['filename']}")
            print(f"🔗 URL: {result['url']}")
            print(f"📁 Type: {result['fileType']}")
            print(f"📊 Size: {result['size']} bytes")
            return result
        else:
            error = response.json()
            print(f"❌ Upload failed: {error.get('error', 'Unknown error')}")
            return None
            
    except Exception as e:
        print(f"Error uploading {file_path}: {e}")
        return None

def upload_media_folder(folder_path, max_workers=5):
    """
    Upload all supported media files from a folder using concurrent uploads
    
    Args:
        folder_path (str): Path to folder containing media files
        max_workers (int): Number of concurrent uploads
    """
    folder = Path(folder_path)
    
    # Supported file extensions
    supported_extensions = {
        # Images
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff',
        # Videos
        '.mp4', '.mpeg', '.mov', '.avi',
        # Audio
        '.mp3', '.wav', '.ogg'
    }
    
    # Find all supported files
    media_files = []
    for file_path in folder.rglob('*'):
        if file_path.suffix.lower() in supported_extensions:
            media_files.append(str(file_path))
    
    print(f"Found {len(media_files)} media files to upload")
    
    # Upload files concurrently for maximum speed
    uploaded_files = []
    failed_files = []
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all upload tasks
        future_to_file = {
            executor.submit(upload_media_file, file_path): file_path 
            for file_path in media_files
        }
        
        # Process completed uploads
        for future in as_completed(future_to_file):
            file_path = future_to_file[future]
            try:
                result = future.result()
                if result:
                    uploaded_files.append(result)
                else:
                    failed_files.append(file_path)
            except Exception as e:
                print(f"Exception for {file_path}: {e}")
                failed_files.append(file_path)
    
    print(f"\\n📊 Upload Summary:")
    print(f"✅ Successful: {len(uploaded_files)}")
    print(f"❌ Failed: {len(failed_files)}")
    
    return uploaded_files, failed_files

# Usage examples
if __name__ == "__main__":
    # Upload single media file
    media_url = upload_media_file("path/to/your/video.mp4")
    
    # Upload entire media folder with high-speed concurrent uploads
    uploaded, failed = upload_media_folder("path/to/media/folder", max_workers=10)
    
    # Save all uploaded URLs to a file
    if uploaded:
        with open("uploaded_urls.txt", "w") as f:
            for file_data in uploaded:
                f.write(f"{file_data['filename']}: {file_data['url']}\\n")`

  const curlExample = `# cURL Examples for Media Upload

# Upload an image
curl -X POST https://your-app.vercel.app/api/upload \\
  -F "file=@/path/to/image.jpg" \\
  -H "Content-Type: multipart/form-data"

# Upload a video (MP4)
curl -X POST https://your-app.vercel.app/api/upload \\
  -F "file=@/path/to/video.mp4" \\
  -H "Content-Type: multipart/form-data"

# Upload an audio file (MP3)
curl -X POST https://your-app.vercel.app/api/upload \\
  -F "file=@/path/to/audio.mp3" \\
  -H "Content-Type: multipart/form-data"

# Response example for video upload:
{
  "success": true,
  "filename": "video.mp4",
  "url": "https://your-app.vercel.app/uploads/1703123456789_abc123.mp4",
  "size": 15728640,
  "contentType": "video/mp4",
  "fileType": "video",
  "uploadedAt": "2023-12-21T10:30:56.789Z",
  "message": "File uploaded successfully to server"
}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            onClick={() => window.history.back()}
            className="absolute left-4 top-8 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            MEDIA UPLOAD API
          </h1>
          <p className="text-xl text-cyan-300/80 font-light tracking-wide">
            High-speed upload for images, videos, and audio files
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* API Overview */}
        <Card className="max-w-4xl mx-auto mb-8 bg-black/40 backdrop-blur-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3" />
              API Overview
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Endpoint</h3>
                  <code className="bg-black/50 text-cyan-300 px-3 py-2 rounded block">
                    POST https://your-app.vercel.app/api/upload
                  </code>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Content Type</h3>
                  <code className="bg-black/50 text-cyan-300 px-3 py-2 rounded block">multipart/form-data</code>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Upload Speed</h3>
                  <code className="bg-black/50 text-green-300 px-3 py-2 rounded block">High-Speed Mode</code>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Supported Formats</h3>
                  <div className="bg-black/50 text-cyan-300 px-3 py-2 rounded">
                    <div className="space-y-2 text-sm">
                      <div>
                        📸 <strong>Images:</strong> JPG, PNG, GIF, WebP, SVG, BMP, TIFF
                      </div>
                      <div>
                        🎥 <strong>Videos:</strong> MP4, MPEG, MOV, AVI
                      </div>
                      <div>
                        🎵 <strong>Audio:</strong> MP3, WAV, OGG
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">File Size Limits</h3>
                  <div className="bg-black/50 text-cyan-300 px-3 py-2 rounded text-sm">
                    <div>Images/Audio: 10MB</div>
                    <div>Videos: 50MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* JavaScript Example */}
        <Card className="max-w-4xl mx-auto mb-8 bg-black/40 backdrop-blur-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-300 flex items-center">
                <Code className="w-6 h-6 mr-3" />
                JavaScript Integration
              </h2>
              <Button
                onClick={() => copyToClipboard(javascriptExample, "javascript")}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white border-0"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copiedCode === "javascript" ? "Copied!" : "Copy Code"}
              </Button>
            </div>

            <div className="bg-black/60 rounded-lg p-4 overflow-x-auto">
              <pre className="text-cyan-300 text-sm">
                <code>{javascriptExample}</code>
              </pre>
            </div>
          </div>
        </Card>

        {/* Python Example */}
        <Card className="max-w-4xl mx-auto mb-8 bg-black/40 backdrop-blur-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-300 flex items-center">
                <Code className="w-6 h-6 mr-3" />
                Python Integration
              </h2>
              <Button
                onClick={() => copyToClipboard(pythonExample, "python")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copiedCode === "python" ? "Copied!" : "Copy Code"}
              </Button>
            </div>

            <div className="bg-black/60 rounded-lg p-4 overflow-x-auto">
              <pre className="text-cyan-300 text-sm">
                <code>{pythonExample}</code>
              </pre>
            </div>

            <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <p className="text-blue-300 text-sm">
                <strong>📦 Required Python packages:</strong>{" "}
                <code className="bg-black/50 px-2 py-1 rounded">pip install requests</code>
              </p>
            </div>
          </div>
        </Card>

        {/* cURL Example */}
        <Card className="max-w-4xl mx-auto mb-8 bg-black/40 backdrop-blur-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-300 flex items-center">
                <Code className="w-6 h-6 mr-3" />
                cURL Examples
              </h2>
              <Button
                onClick={() => copyToClipboard(curlExample, "curl")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copiedCode === "curl" ? "Copied!" : "Copy Code"}
              </Button>
            </div>

            <div className="bg-black/60 rounded-lg p-4 overflow-x-auto">
              <pre className="text-cyan-300 text-sm">
                <code>{curlExample}</code>
              </pre>
            </div>
          </div>
        </Card>

        {/* Response Format */}
        <Card className="max-w-4xl mx-auto bg-black/40 backdrop-blur-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">Response Format</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Success Response</h3>
                <div className="bg-black/60 rounded-lg p-4">
                  <pre className="text-green-300 text-sm">
                    <code>{`{
  "success": true,
  "filename": "video.mp4",
  "url": "https://your-app.vercel.app/uploads/...",
  "size": 15728640,
  "contentType": "video/mp4",
  "fileType": "video",
  "uploadedAt": "2023-12-21T10:30:56.789Z",
  "message": "File uploaded successfully"
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-3">❌ Error Response</h3>
                <div className="bg-black/60 rounded-lg p-4">
                  <pre className="text-red-300 text-sm">
                    <code>{`{
  "error": "Unsupported file type",
  "supportedTypes": [
    "image/jpeg", "video/mp4", "audio/mp3"
  ]
}

// Common error codes:
// 400 - Bad Request (invalid file)
// 413 - File too large
// 500 - Server error`}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-lg border border-cyan-500/30">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">🚀 High-Speed Upload Tips</h3>
              <ul className="text-cyan-400 space-y-2 text-sm">
                <li>• Use concurrent uploads for multiple files to maximize speed</li>
                <li>• Validate file types and sizes on client side before uploading</li>
                <li>• Videos up to 50MB, images/audio up to 10MB supported</li>
                <li>• Access all device files, not just photo gallery</li>
                <li>• Implement retry logic for failed uploads</li>
                <li>• Store returned URLs for permanent file access</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
