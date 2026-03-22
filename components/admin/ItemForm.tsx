"use client";

import Image from "next/image";
import { useState } from "react";
import { AlertCircle, GripVertical, Image as ImageIcon, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import FileUpload from "./FileUpload";
import {
  type AdminCollectionId,
  validateContentData,
} from "@/lib/content-schema";
import { cn } from "@/lib/utils";

export type ItemFormSubmitResult = {
  success: boolean;
  errorType?: "auth" | "validation" | "server";
  message?: string;
  fieldErrors?: Record<string, string>;
};

interface ItemFormProps {
  initialData?: Record<string, unknown>;
  collection: AdminCollectionId;
  onSubmit: (data: Record<string, unknown>) => Promise<ItemFormSubmitResult>;
  onCancel: () => void;
}

const URL_FIELDS = new Set(["link", "repo", "profileUrl"]);

function getStringValue(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function getStringArrayValue(value: unknown) {
  if (!Array.isArray(value)) {
    return typeof value === "string" ? value : "";
  }

  return value.filter((item): item is string => typeof item === "string");
}

function reorderItems<T>(items: T[], startIndex: number, endIndex: number) {
  const nextItems = [...items];
  const [moved] = nextItems.splice(startIndex, 1);
  nextItems.splice(endIndex, 0, moved);
  return nextItems;
}

function normalizeInitialData(collection: string, data?: Record<string, unknown>) {
  if (!data) {
    return {};
  }

  if (collection === "achievement") {
    const links = Array.isArray(data.links)
      ? (data.links as Array<{ url?: string }>).filter(Boolean)
      : [];
    return {
      ...data,
      link: links[0]?.url || "",
    };
  }

  return data;
}

function normalizeSubmissionData(collection: string, data: Record<string, unknown>) {
  if (collection === "achievement") {
    const link = getStringValue(data.link).trim();
    return {
      ...data,
      links: link ? [{ name: "Reference", url: link }] : [],
    };
  }

  return data;
}

export default function ItemForm({ initialData, collection, onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(normalizeInitialData(collection, initialData));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ItemFormSubmitResult["errorType"]>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  const updateField = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
    setFormError(null);
    setErrorType(undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateField(e.target.name, e.target.value);
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
    const array = e.target.value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    updateField(field, array);
  };

  const handleImageUpload = (url: string, field: string) => {
    updateField(field, url);
  };

  const handleMultipleImageUpload = (url: string, field: string) => {
    const currentImages = Array.isArray(formData[field]) ? (formData[field] as string[]) : [];

    if (!url) {
      return;
    }

    updateField(field, [...currentImages, url]);
  };

  const handleRemoveImage = (index: number, field: string) => {
    const currentImages = Array.isArray(formData[field]) ? (formData[field] as string[]) : [];
    updateField(
      field,
      currentImages.filter((_: string, imageIndex: number) => imageIndex !== index)
    );
    toast.info("Gallery image removed", {
      description: "The image was removed from the current record.",
    });
  };

  const handleReorderImage = (fromIndex: number, toIndex: number, field: string) => {
    const currentImages = Array.isArray(formData[field]) ? (formData[field] as string[]) : [];
    updateField(field, reorderItems(currentImages, fromIndex, toIndex));
  };

  const validateForm = () => {
    const normalizedData = normalizeSubmissionData(collection, formData);

    for (const [field, value] of Object.entries(normalizedData)) {
      if (!URL_FIELDS.has(field) || !value || typeof value !== "string") {
        continue;
      }

      try {
        new URL(value);
      } catch {
        setFieldErrors({ [field]: "Enter a valid URL, including http:// or https://." });
        return null;
      }
    }

    const validation = validateContentData(collection, normalizedData);
    setFieldErrors(validation.fieldErrors);
    return validation.success ? validation.data : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedData = validateForm();

    if (!validatedData) {
      setErrorType("validation");
      setFormError("Please correct the highlighted fields before saving.");
      toast.error("Validation failed", {
        description: "Please correct the highlighted fields before saving.",
      });
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setErrorType(undefined);

    const result = await onSubmit(validatedData);

    if (!result.success) {
      setFieldErrors(result.fieldErrors || {});
      setErrorType(result.errorType);
      const nextMessage =
        result.message ||
        (result.errorType === "auth"
          ? "Your admin session has expired. Please sign in again."
          : result.errorType === "validation"
            ? "Please correct the highlighted fields before trying again."
            : "We could not save this item. Please try again.");
      setFormError(nextMessage);
      toast.error("Save failed", {
        description: nextMessage,
      });
      setIsSubmitting(false);
      return;
    }

    toast.success(initialData ? "Entry updated" : "Entry created", {
      description: `Your ${collection} record was saved successfully.`,
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-up rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between border-b pb-4">
        <h3 className="text-2xl font-bold text-foreground">
          {initialData ? "Edit" : "Add New"} <span className="capitalize text-primary">{collection}</span>
        </h3>
        <button type="button" onClick={onCancel} className="p-2 text-muted-foreground hover:text-foreground transition">
          <X className="h-5 w-5" />
        </button>
      </div>

      {formError && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium capitalize">{errorType || "Submission"} issue</p>
            <p>{formError}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {collection === "project" && (
          <>
            <div className="grid grid-cols-1 gap-6">
              <InputGroup label="Project Title" name="title" value={getStringValue(formData.title)} onChange={handleChange} required error={fieldErrors.title} />
              <TextAreaGroup label="Description" name="description" value={getStringValue(formData.description)} onChange={handleChange} error={fieldErrors.description} />
              <ArrayInputGroup
                label="Tech Stack"
                name="techStack"
                value={getStringArrayValue(formData.techStack)}
                onChange={(e) => handleArrayChange(e, "techStack")}
                placeholder="Next.js&#10;MongoDB&#10;Tailwind"
                error={fieldErrors.techStack}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputGroup label="Live Link" name="link" type="url" value={getStringValue(formData.link)} onChange={handleChange} error={fieldErrors.link} />
              <InputGroup label="GitHub Repo" name="repo" type="url" value={getStringValue(formData.repo)} onChange={handleChange} error={fieldErrors.repo} />
            </div>

            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
              <label className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                <ImageIcon className="h-4 w-4" /> Project Images (Gallery)
              </label>

              <SortableGallery
                field="images"
                items={Array.isArray(formData.images) ? (formData.images as string[]) : []}
                draggedIndex={draggedImageIndex}
                onDragStart={setDraggedImageIndex}
                onDrop={(fromIndex, toIndex) => {
                  handleReorderImage(fromIndex, toIndex, "images");
                  setDraggedImageIndex(null);
                  toast.success("Gallery reordered", {
                    description: "The image order has been updated.",
                  });
                }}
                onDragEnd={() => setDraggedImageIndex(null)}
                onRemove={(index) => handleRemoveImage(index, "images")}
                itemLabel="Project"
              />

              <FileUpload label="Add Image" onUpload={(url) => handleMultipleImageUpload(url, "images")} />
            </div>
          </>
        )}

        {collection === "experience" && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputGroup label="Role / Title" name="role" value={getStringValue(formData.role)} onChange={handleChange} required error={fieldErrors.role} />
              <InputGroup label="Company Name" name="company" value={getStringValue(formData.company)} onChange={handleChange} required error={fieldErrors.company} />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputGroup label="Start Date" name="startDate" value={getStringValue(formData.startDate)} onChange={handleChange} placeholder="Jan 2024" error={fieldErrors.startDate} />
              <InputGroup label="End Date" name="endDate" value={getStringValue(formData.endDate)} onChange={handleChange} placeholder="Present" error={fieldErrors.endDate} />
            </div>
            <InputGroup label="Location" name="location" value={getStringValue(formData.location)} onChange={handleChange} error={fieldErrors.location} />

            <ArrayInputGroup
              label="Key Responsibilities"
              name="description"
              value={getStringArrayValue(formData.description)}
              onChange={(e) => handleArrayChange(e, "description")}
              placeholder="- Built new feature...&#10;- Optimized database..."
              error={fieldErrors.description}
            />
            <ArrayInputGroup
              label="Technologies Used"
              name="technologies"
              value={getStringArrayValue(formData.technologies)}
              onChange={(e) => handleArrayChange(e, "technologies")}
              placeholder="React&#10;Node.js"
              error={fieldErrors.technologies}
            />

            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
              <label className="mb-4 block text-sm font-medium text-foreground">Company Logo</label>
              <FileUpload label="Upload Logo" initialUrl={typeof formData.logo === "string" ? formData.logo : undefined} onUpload={(url) => handleImageUpload(url, "logo")} />
            </div>
          </>
        )}

        {collection === "skill" && (
          <>
              <InputGroup
                label="Category Name"
                name="category"
              value={getStringValue(formData.category)}
              onChange={handleChange}
              placeholder="Frontend, Backend, etc."
              required
              error={fieldErrors.category}
            />
            <ArrayInputGroup
                label="Skill Items"
                name="items"
                value={getStringArrayValue(formData.items)}
                onChange={(e) => handleArrayChange(e, "items")}
                placeholder="React&#10;TypeScript&#10;CSS"
                required
                error={fieldErrors.items}
              />
          </>
        )}

        {collection === "achievement" && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputGroup label="Award Title" name="title" value={getStringValue(formData.title)} onChange={handleChange} required error={fieldErrors.title} />
              <InputGroup label="Organization" name="organization" value={getStringValue(formData.organization)} onChange={handleChange} error={fieldErrors.organization} />
            </div>
            <InputGroup label="Date Received" name="date" value={getStringValue(formData.date)} onChange={handleChange} error={fieldErrors.date} />
            <TextAreaGroup label="Description" name="description" value={formData.description} onChange={handleChange} required error={fieldErrors.description} />
            <InputGroup label="Certificate Link" name="link" type="url" value={getStringValue(formData.link)} onChange={handleChange} error={fieldErrors.link} />

            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
              <label className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                <ImageIcon className="h-4 w-4" /> Certificates / Images
              </label>

              <SortableGallery
                field="images"
                items={Array.isArray(formData.images) ? (formData.images as string[]) : []}
                draggedIndex={draggedImageIndex}
                onDragStart={setDraggedImageIndex}
                onDrop={(fromIndex, toIndex) => {
                  handleReorderImage(fromIndex, toIndex, "images");
                  setDraggedImageIndex(null);
                  toast.success("Gallery reordered", {
                    description: "The image order has been updated.",
                  });
                }}
                onDragEnd={() => setDraggedImageIndex(null)}
                onRemove={(index) => handleRemoveImage(index, "images")}
                itemLabel="Achievement"
              />

              <FileUpload label="Add Image" onUpload={(url) => handleMultipleImageUpload(url, "images")} />
            </div>
          </>
        )}

        {collection === "education" && (
          <>
            <InputGroup label="Institution" name="institution" value={getStringValue(formData.institution)} onChange={handleChange} required error={fieldErrors.institution} />
            <InputGroup label="Degree / Certification" name="degree" value={getStringValue(formData.degree)} onChange={handleChange} required error={fieldErrors.degree} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputGroup label="Start Date" name="startDate" value={getStringValue(formData.startDate)} onChange={handleChange} error={fieldErrors.startDate} />
              <InputGroup label="End Date" name="endDate" value={getStringValue(formData.endDate)} onChange={handleChange} error={fieldErrors.endDate} />
            </div>
            <InputGroup label="Grade / CGPA" name="grade" value={getStringValue(formData.grade)} onChange={handleChange} error={fieldErrors.grade} />
          </>
        )}

      </div>

      <div className="mt-10 flex gap-4 border-t pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`} />
          {isSubmitting ? "Saving..." : "Save Details"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg bg-secondary px-6 py-3 font-medium text-secondary-foreground transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function SortableGallery({
  field,
  items,
  draggedIndex,
  onDragStart,
  onDrop,
  onDragEnd,
  onRemove,
  itemLabel,
}: {
  field: string;
  items: string[];
  draggedIndex: number | null;
  onDragStart: (index: number) => void;
  onDrop: (fromIndex: number, toIndex: number) => void;
  onDragEnd: () => void;
  onRemove: (index: number) => void;
  itemLabel: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((url, index) => (
        <div
          key={`${field}-${url}-${index}`}
          draggable
          onDragStart={() => onDragStart(index)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (draggedIndex === null || draggedIndex === index) {
              return;
            }
            onDrop(draggedIndex, index);
          }}
          onDragEnd={onDragEnd}
          className={cn(
            "group relative aspect-video overflow-hidden rounded-md border bg-muted",
            draggedIndex === index && "opacity-60 ring-2 ring-primary/40"
          )}
        >
          <Image
            src={url}
            alt={`${itemLabel} ${index + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="rounded-md object-cover"
          />
          <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/70 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white">
            <GripVertical className="h-3 w-3" /> Drag
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute right-1 top-1 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-0 shadow-sm transition group-hover:opacity-100 hover:scale-105"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

interface InputGroupProps {
  label: string;
  name: string;
  value: unknown;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

function InputGroup({ label, name, value, onChange, type = "text", placeholder, required, error }: InputGroupProps) {
  return (
    <div className="group w-full">
      <label className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-focus-within:text-primary">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={getStringValue(value)}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-background p-3.5 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
        required={required}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface TextAreaGroupProps {
  label: string;
  name: string;
  value: unknown;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

function TextAreaGroup({ label, name, value, onChange, rows = 4, placeholder, required, error }: TextAreaGroupProps) {
  return (
    <div className="group w-full">
      <label className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-focus-within:text-primary">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <textarea
        name={name}
        value={getStringValue(value)}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full resize-y rounded-xl border bg-background p-3.5 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface ArrayInputGroupProps {
  label: string;
  name: string;
  value: string[] | string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

function ArrayInputGroup({ label, name, value, onChange, placeholder, required, error }: ArrayInputGroupProps) {
  return (
    <div className="group w-full">
      <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-focus-within:text-primary">
        <span>
          {label} {required && <span className="text-destructive">*</span>}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70">One item per line</span>
      </label>
      <textarea
        name={name}
        value={Array.isArray(value) ? value.join("\n") : getStringValue(value)}
        onChange={onChange}
        rows={5}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-background p-3.5 font-mono text-sm leading-relaxed shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
