"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import FileUpload from "./FileUpload";
import { AlertCircle, Image as ImageIcon, Save, Trash2, X } from "lucide-react";

export type ItemFormSubmitResult = {
  success: boolean;
  errorType?: "auth" | "validation" | "server";
  message?: string;
  fieldErrors?: Record<string, string>;
};

interface ItemFormProps {
  initialData?: Record<string, unknown>;
  collection: string;
  onSubmit: (data: Record<string, unknown>) => Promise<ItemFormSubmitResult>;
  onCancel: () => void;
}

const REQUIRED_FIELDS: Record<string, string[]> = {
  project: ["title"],
  experience: ["role", "company"],
  education: ["institution", "degree"],
  skill: ["category"],
  achievement: ["title"],
  cpprofile: ["platform"],
};

const URL_FIELDS = new Set(["link", "repo"]);

function getStringValue(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function getStringArrayValue(value: unknown) {
  if (!Array.isArray(value)) {
    return typeof value === "string" ? value : "";
  }

  return value.filter((item): item is string => typeof item === "string");
}

export default function ItemForm({ initialData, collection, onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData || {});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ItemFormSubmitResult["errorType"]>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredFields = useMemo(() => REQUIRED_FIELDS[collection] ?? [], [collection]);

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
    const currentImages = Array.isArray(formData[field]) ? formData[field] : [];
    updateField(field, [...currentImages, url]);
  };

  const handleRemoveImage = (index: number, field: string) => {
    const currentImages = Array.isArray(formData[field]) ? formData[field] : [];
    updateField(
      field,
      currentImages.filter((_: unknown, imageIndex: number) => imageIndex !== index)
    );
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    for (const field of requiredFields) {
      const value = formData[field];
      const isMissing = Array.isArray(value) ? value.length === 0 : !String(value || "").trim();

      if (isMissing) {
        nextErrors[field] = "This field is required.";
      }
    }

    for (const [field, value] of Object.entries(formData)) {
      if (!URL_FIELDS.has(field) || !value || typeof value !== "string") {
        continue;
      }

      try {
        new URL(value);
      } catch {
        nextErrors[field] = "Enter a valid URL, including http:// or https://.";
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorType("validation");
      setFormError("Please correct the highlighted fields before saving.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setErrorType(undefined);

    const result = await onSubmit(formData);

    if (!result.success) {
      setFieldErrors(result.fieldErrors || {});
      setErrorType(result.errorType);
      setFormError(
        result.message ||
          (result.errorType === "auth"
            ? "Your admin session has expired. Please sign in again."
            : result.errorType === "validation"
              ? "Please correct the highlighted fields before trying again."
              : "We could not save this item. Please try again.")
      );
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl border shadow-sm animate-fade-up">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h3 className="font-bold text-2xl text-foreground">
          {initialData ? "Edit" : "Add New"} <span className="text-primary capitalize">{collection}</span>
        </h3>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground transition p-2">
          <X className="w-5 h-5" />
        </button>
      </div>

      {formError && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Live Link" name="link" type="url" value={getStringValue(formData.link)} onChange={handleChange} error={fieldErrors.link} />
              <InputGroup label="GitHub Repo" name="repo" type="url" value={getStringValue(formData.repo)} onChange={handleChange} error={fieldErrors.repo} />
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
              <label className="block text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Project Images (Gallery)
              </label>

              {Array.isArray(formData.images) && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((url: string, index: number) => (
                    <div key={`${url}-${index}`} className="relative group aspect-video overflow-hidden rounded-md">
                      <Image src={url} alt={`Project ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="w-full h-full object-cover rounded-md border bg-muted" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index, "images")}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:scale-105"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <FileUpload label="Add Image" onUpload={(url) => handleMultipleImageUpload(url, "images")} />
            </div>
          </>
        )}

        {collection === "experience" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Role / Title" name="role" value={getStringValue(formData.role)} onChange={handleChange} required error={fieldErrors.role} />
              <InputGroup label="Company Name" name="company" value={getStringValue(formData.company)} onChange={handleChange} required error={fieldErrors.company} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
              <label className="block text-sm font-medium text-foreground mb-4">Company Logo</label>
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
              error={fieldErrors.items}
            />
          </>
        )}

        {collection === "achievement" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Award Title" name="title" value={getStringValue(formData.title)} onChange={handleChange} required error={fieldErrors.title} />
              <InputGroup label="Organization" name="organization" value={getStringValue(formData.organization)} onChange={handleChange} error={fieldErrors.organization} />
            </div>
            <InputGroup label="Date Received" name="date" value={getStringValue(formData.date)} onChange={handleChange} error={fieldErrors.date} />
            <TextAreaGroup label="Description" name="description" value={formData.description} onChange={handleChange} error={fieldErrors.description} />
            <InputGroup label="Certificate Link" name="link" type="url" value={getStringValue(formData.link)} onChange={handleChange} error={fieldErrors.link} />

            <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
              <label className="block text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Certificates / Images
              </label>

              {Array.isArray(formData.images) && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((url: string, index: number) => (
                    <div key={`${url}-${index}`} className="relative group aspect-video overflow-hidden rounded-md">
                      <Image src={url} alt={`Achievement ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="w-full h-full object-cover rounded-md border bg-muted" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index, "images")}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:scale-105"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <FileUpload label="Add Image" onUpload={(url) => handleMultipleImageUpload(url, "images")} />
            </div>
          </>
        )}

        {collection === "education" && (
          <>
            <InputGroup label="Institution" name="institution" value={getStringValue(formData.institution)} onChange={handleChange} required error={fieldErrors.institution} />
            <InputGroup label="Degree / Certification" name="degree" value={getStringValue(formData.degree)} onChange={handleChange} required error={fieldErrors.degree} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Start Date" name="startDate" value={getStringValue(formData.startDate)} onChange={handleChange} error={fieldErrors.startDate} />
              <InputGroup label="End Date" name="endDate" value={getStringValue(formData.endDate)} onChange={handleChange} error={fieldErrors.endDate} />
            </div>
            <InputGroup label="Grade / CGPA" name="grade" value={getStringValue(formData.grade)} onChange={handleChange} error={fieldErrors.grade} />
          </>
        )}

        {collection === "cpprofile" && (
          <>
            <InputGroup label="Platform" name="platform" value={getStringValue(formData.platform)} onChange={handleChange} placeholder="LeetCode" required error={fieldErrors.platform} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Current Rating" name="rating" value={getStringValue(formData.rating)} onChange={handleChange} error={fieldErrors.rating} />
              <InputGroup label="Max Rating" name="maxRating" value={getStringValue(formData.maxRating)} onChange={handleChange} error={fieldErrors.maxRating} />
            </div>
            <InputGroup label="Rank / Title" name="rank" value={getStringValue(formData.rank)} onChange={handleChange} error={fieldErrors.rank} />
            <InputGroup label="Profile Link" name="link" type="url" value={getStringValue(formData.link)} onChange={handleChange} error={fieldErrors.link} />
          </>
        )}
      </div>

      <div className="flex gap-4 mt-10 pt-6 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save className={`w-4 h-4 ${isSubmitting ? "animate-pulse" : ""}`} />
          {isSubmitting ? "Saving..." : "Save Details"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
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
    <div className="w-full group">
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1 transition-colors group-focus-within:text-primary">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={getStringValue(value)}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full p-3.5 bg-background border rounded-xl focus:ring-2 outline-none transition-all shadow-sm text-sm placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-destructive/20" : "border-input focus:ring-primary/20 focus:border-primary"
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
  error?: string;
}

function TextAreaGroup({ label, name, value, onChange, rows = 4, placeholder, error }: TextAreaGroupProps) {
  return (
    <div className="w-full group">
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1 transition-colors group-focus-within:text-primary">
        {label}
      </label>
      <textarea
        name={name}
        value={getStringValue(value)}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full p-3.5 bg-background border rounded-xl focus:ring-2 outline-none transition-all shadow-sm text-sm resize-y placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-destructive/20" : "border-input focus:ring-primary/20 focus:border-primary"
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
  error?: string;
}

function ArrayInputGroup({ label, name, value, onChange, placeholder, error }: ArrayInputGroupProps) {
  return (
    <div className="w-full group">
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex justify-between items-center transition-colors group-focus-within:text-primary">
        {label}
        <span className="text-[10px] text-muted-foreground/70 font-medium px-2 py-0.5 bg-muted rounded-full">One item per line</span>
      </label>
      <textarea
        name={name}
        value={Array.isArray(value) ? value.join("\n") : getStringValue(value)}
        onChange={onChange}
        rows={5}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full p-3.5 bg-background border rounded-xl focus:ring-2 outline-none transition-all shadow-sm text-sm font-mono leading-relaxed placeholder:text-muted-foreground/50 hover:border-primary/50 ${
          error ? "border-destructive focus:ring-destructive/20" : "border-input focus:ring-primary/20 focus:border-primary"
        }`}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
