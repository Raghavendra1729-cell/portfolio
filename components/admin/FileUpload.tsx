"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  initialUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function FileUpload({ initialUrl, onUpload, label = "Upload Image" }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Create local preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Upload immediately
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok && data.url) {
        onUpload(data.url);
      } else {
        console.error("Upload failed:", data.error);
        alert("Upload failed: " + (data.error || "Unknown error"));
        setPreviewUrl(initialUrl || null); // Revert on failure
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Error uploading file");
      setPreviewUrl(initialUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    setFile(null);
    setPreviewUrl(null);
    onUpload("");
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{label}</label>
      
      {!previewUrl ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition flex flex-col items-center justify-center text-center cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="bg-blue-50 p-3 rounded-full mb-3">
             {isUploading ? <Loader2 className="w-6 h-6 text-blue-500 animate-spin" /> : <Upload className="w-6 h-6 text-blue-500" />}
          </div>
          <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
          <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 w-full h-48 group">
          <Image 
            src={previewUrl} 
            alt="Preview" 
            fill 
            className={`object-cover transition ${isUploading ? 'opacity-50' : 'opacity-100'}`}
          />
          
          {isUploading && (
             <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
             </div>
          )}

          {!isUploading && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
