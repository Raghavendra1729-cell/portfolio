"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  initialUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function FileUpload({ initialUrl, onUpload, label = "Upload Image" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreviewUrl(initialUrl || null);
  }, [initialUrl]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const setLocalPreview = (selectedFile: File) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    objectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
  };

  const uploadFile = async (selectedFile: File) => {
    setLocalPreview(selectedFile);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (res.ok && data?.url) {
        onUpload(data.url);
        toast.success("Image uploaded", {
          description: "The file is ready to be used in this record.",
        });
        return;
      }

      setPreviewUrl(initialUrl || null);
      toast.error("Upload failed", {
        description: data?.error || "The server could not process that file.",
      });
    } catch {
      setPreviewUrl(initialUrl || null);
      toast.error("Upload failed", {
        description: "A network error prevented the upload from completing.",
      });
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  const handleFileSelection = async (selectedFile?: File) => {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Unsupported file", {
        description: "Please choose an image file for this field.",
      });
      return;
    }

    await uploadFile(selectedFile);
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileSelection(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setPreviewUrl(null);
    onUpload("");
    toast.info("Image removed", {
      description: "The preview was cleared from this form field.",
    });
  };

  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium capitalize text-foreground">{label}</label>

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed transition",
          isDragging
            ? "border-primary bg-primary/8 shadow-[0_0_0_1px_rgba(125,145,224,0.18)]"
            : "border-border bg-muted/25 hover:border-primary/40 hover:bg-muted/35"
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
            return;
          }
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFileSelection(event.dataTransfer.files?.[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="sr-only"
          disabled={isUploading}
        />

        {!previewUrl ? (
          <button
            type="button"
            className="flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop image to upload" : "Drag & drop or click to upload"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, GIF, WEBP • instant preview enabled</p>
            </div>
          </button>
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-muted/30">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className={cn("object-cover transition", isUploading ? "opacity-50" : "opacity-100")}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 md:w-44">
              <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground shadow-sm">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  Preview ready
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Replace it anytime by dropping a new image into the zone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/40"
              >
                Replace image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
