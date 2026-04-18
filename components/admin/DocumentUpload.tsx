"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadProps {
  initialUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
  accept?: string;
}

function getFileName(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const lastSegment = pathname.split("/").pop();
    return lastSegment || "Uploaded file";
  } catch {
    return url.split("/").pop() || "Uploaded file";
  }
}

export default function DocumentUpload({
  initialUrl,
  onUpload,
  label = "Upload File",
  accept = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (selectedFile: File) => {
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
        toast.success("File uploaded", {
          description: "The uploaded file is ready to use.",
        });
        return;
      }

      toast.error("Upload failed", {
        description: data?.error || "The server could not process that file.",
      });
    } catch {
      toast.error("Upload failed", {
        description: "A network error prevented the upload from completing.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      await uploadFile(selectedFile);
    }

    event.target.value = "";
  };

  const handleRemove = () => {
    onUpload("");
    toast.info("File removed", {
      description: "The file link was cleared from this field.",
    });
  };

  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
      <label className="mb-4 block text-sm font-medium text-foreground">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="sr-only"
        disabled={isUploading}
      />

      {initialUrl ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-3 text-sm shadow-sm">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Resume linked
            </div>
            <p className="mt-2 break-all text-xs leading-5 text-muted-foreground">
              {getFileName(initialUrl)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/40"
            >
              {isUploading ? "Uploading..." : "Replace file"}
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
      ) : (
        <button
          type="button"
          className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-8 text-center hover:bg-muted/40"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isUploading ? "Uploading file..." : "Click to upload a resume file"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, DOC, or DOCX. The uploaded URL can be changed anytime from admin.
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
