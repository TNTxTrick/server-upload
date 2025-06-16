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

  const javascriptExample = `// JavaScript/Node.js Example
async function uploadImage(file) {
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
      console.log('File size:', result.size);
      return result.url;
    } else {
      console.error('Upload failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage with file input
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadImage(file);
  }
});

// Usage with drag & drop
function handleDrop(e) {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      uploadImage(file);
    }
  });
}`

  const pythonExample = `# Python Example using requests
import requests
import json

def upload_image(file_path):
    """
    Upload an image file to the server
    
    Args:
        file_path (str): Path to the image file
        
    Returns:
        dict: Server response with file URL
    """
    url = "https://your-app.vercel.app/api/upload"
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            response = requests.post(url, files=files)
            
        if response.status_code == 200:
            result = response.json()
            print(f"Upload successful!")
            print(f"File URL: {result['url']}")
            print(f"File size: {result['size']} bytes")
            return result['url']
        else:
            error = response.json()
            print(f"Upload failed: {error.get('error', 'Unknown error')}")
            return None
            
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

# Usage examples
if __name__ == "__main__":
    # Upload single image
    image_url = upload_image("path/to/your/image.jpg")
    
    # Upload multiple images
    image_files = ["image1.jpg", "image2.png", "image3.gif"]
    uploaded_urls = []
    
    for image_file in image_files:
        url = upload_image(image_file)
        if url:
            uploaded_urls.append(url)
    
    print(f"Successfully uploaded {len(uploaded_urls)} images")

# Advanced example with error handling and progress
import os
from pathlib import Path

def upload_images_from_folder(folder_path):
    """Upload all images from a folder"""
    folder = Path(folder_path)
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'}
    
    uploaded_files = []
    failed_files = []
    
    for file_path in folder.iterdir():
        if file_path.suffix.lower() in image_extensions:
            print(f"Uploading {file_path.name}...")
            url = upload_image(str(file_path))
            
            if url:
                uploaded_files.append({
                    'filename': file_path.name,
                    'url': url
                })
            else:
                failed_files.append(file_path.name)
    
    print(f"\\nUpload Summary:")
    print(f"✅ Successful: {len(uploaded_files)}")
    print(f"❌ Failed: {len(failed_files)}")
    
    return uploaded_files, failed_files`

  const curlExample = `# cURL Example
curl -X POST https://your-app.vercel.app/api/upload \\
  -F "file=@/path/to/your/image.jpg" \\
  -H "Content-Type: multipart/form-data"

# Response example:
{
  "success": true,
  "filename": "image.jpg",
  "url": "https://your-app.vercel.app/uploads/1703123456789_abc123.jpg",
  "size": 245760,
  "contentType": "image/jpeg",
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
            API DOCUMENTATION
          </h1>
          <p className="text-xl text-cyan-300/80 font-light tracking-wide">
            Integrate image upload into your applications
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
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Max File Size</h3>
                  <code className="bg-black/50 text-cyan-300 px-3 py-2 rounded block">10MB</code>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Supported Formats</h3>
                  <div className="bg-black/50 text-cyan-300 px-3 py-2 rounded">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span>• JPG/JPEG</span>
                      <span>• PNG</span>
                      <span>• GIF</span>
                      <span>• WebP</span>
                      <span>• SVG</span>
                      <span>• BMP</span>
                      <span>• TIFF</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Response Format</h3>
                  <code className="bg-black/50 text-cyan-300 px-3 py-2 rounded block">JSON</code>
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
                <strong>📦 Required Python package:</strong>{" "}
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
                cURL Example
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
  "filename": "image.jpg",
  "url": "https://your-app.vercel.app/uploads/...",
  "size": 245760,
  "contentType": "image/jpeg",
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
  "error": "Only image files are allowed",
  "details": "File type not supported"
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
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">💡 Integration Tips</h3>
              <ul className="text-cyan-400 space-y-2 text-sm">
                <li>• Always validate file types on the client side before uploading</li>
                <li>• Implement progress indicators for better user experience</li>
                <li>• Handle errors gracefully and provide user feedback</li>
                <li>• Consider implementing retry logic for failed uploads</li>
                <li>• Store returned URLs in your database for future reference</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
