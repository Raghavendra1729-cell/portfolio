"use client";

import { useState } from "react";
import { Save, Trash2, X, Image as ImageIcon } from "lucide-react";
import FileUpload from "./FileUpload";

interface ItemFormProps {
  initialData?: FormState;
  collection: string;
  onSubmit: (data: FormState) => void;
  onCancel: () => void;
}

const PROJECT_JSON_FIELDS = [
  "links",
  "techStackBreakdown",
  "architectureDiagrams",
  "keyChallenges",
  "technicalSections",
] as const;

type ProjectJsonField = (typeof PROJECT_JSON_FIELDS)[number];
type FormState = Record<string, unknown>;

const EMPTY_PROJECT_JSON_VALUES: Record<ProjectJsonField, string> = {
  links: "[]",
  techStackBreakdown: "[]",
  architectureDiagrams: "[]",
  keyChallenges: "[]",
  technicalSections: "[]",
};

export default function ItemForm({ initialData, collection, onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState<FormState>(initialData || {});
  const [projectJsonValues, setProjectJsonValues] = useState<Record<ProjectJsonField, string>>(
    () =>
      collection === "project"
        ? {
            links: stringifyJsonField(initialData?.links),
            techStackBreakdown: stringifyJsonField(initialData?.techStackBreakdown),
            architectureDiagrams: stringifyJsonField(initialData?.architectureDiagrams),
            keyChallenges: stringifyJsonField(initialData?.keyChallenges),
            technicalSections: stringifyJsonField(initialData?.technicalSections),
          }
        : EMPTY_PROJECT_JSON_VALUES
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
    const array = e.target.value.split("\n");
    setFormData((prev) => ({ ...prev, [field]: array }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (collection === "project") {
      const parsedProjectFields = parseProjectJsonFields(projectJsonValues);
      if (!parsedProjectFields.success) {
        alert(parsedProjectFields.message);
        return;
      }

      onSubmit({
        ...formData,
        ...parsedProjectFields.data,
      });
      return;
    }

    onSubmit(formData);
  };

  const handleImageUpload = (url: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const handleMultipleImageUpload = (url: string, field: string) => {
    const currentImages = readStringArray(formData[field]);
    setFormData((prev) => ({ ...prev, [field]: [...currentImages, url] }));
  };

  const handleRemoveImage = (index: number, field: string) => {
    const currentImages = readStringArray(formData[field]);
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updatedImages }));
  };

  const handleProjectJsonChange = (field: ProjectJsonField, value: string) => {
    setProjectJsonValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl border shadow-sm animate-fade-up">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h3 className="font-bold text-2xl text-foreground">
          {initialData ? "Edit" : "Add New"} <span className="text-primary capitalize">{collection}</span>
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {collection === "project" && (
          <>
            <div className="grid grid-cols-1 gap-6">
              <InputGroup label="Project Title" name="title" value={formData.title} onChange={handleChange} required />
              <TextAreaGroup label="Description" name="description" value={formData.description} onChange={handleChange} />
              <TextAreaGroup
                label="System Design Overview"
                name="systemDesign"
                value={formData.systemDesign}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the architecture, data flow, scaling considerations, and technical tradeoffs."
              />
              <ArrayInputGroup
                label="Tech Stack"
                name="techStack"
                value={formData.techStack}
                onChange={(e) => handleArrayChange(e, "techStack")}
                placeholder="Next.js&#10;MongoDB&#10;Tailwind"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Live Link" name="link" type="url" value={formData.link} onChange={handleChange} />
              <InputGroup label="GitHub Repo" name="repo" type="url" value={formData.repo} onChange={handleChange} />
            </div>
            <JsonTextAreaGroup
              label="Additional Links"
              value={projectJsonValues.links}
              onChange={(value) => handleProjectJsonChange("links", value)}
              rows={5}
              helperText='JSON array of link objects, e.g. [{"name":"Docs","url":"https://example.com"}]'
            />
            <JsonTextAreaGroup
              label="Tech Stack Breakdown"
              value={projectJsonValues.techStackBreakdown}
              onChange={(value) => handleProjectJsonChange("techStackBreakdown", value)}
              rows={8}
              helperText='JSON array of groups, e.g. [{"category":"Frontend","summary":"UI stack","items":["Next.js","Tailwind CSS"]}]'
            />
            <JsonTextAreaGroup
              label="Architecture Diagrams"
              value={projectJsonValues.architectureDiagrams}
              onChange={(value) => handleProjectJsonChange("architectureDiagrams", value)}
              rows={8}
              helperText='JSON array of diagrams, e.g. [{"title":"Request flow","description":"API path","imageUrl":"https://...","caption":"v1"}]'
            />
            <JsonTextAreaGroup
              label="Key Challenges"
              value={projectJsonValues.keyChallenges}
              onChange={(value) => handleProjectJsonChange("keyChallenges", value)}
              rows={10}
              helperText='JSON array of challenges, e.g. [{"title":"Caching","problem":"Cold starts","solution":"Warm cache","outcome":"Faster responses","bullets":["Added Redis"]}]'
            />
            <JsonTextAreaGroup
              label="Technical Sections"
              value={projectJsonValues.technicalSections}
              onChange={(value) => handleProjectJsonChange("technicalSections", value)}
              rows={10}
              helperText='JSON array of sections, e.g. [{"title":"Implementation","type":"implementation","content":"How it works","bullets":["Step 1"],"code":"const app = 1;","language":"ts"}]'
            />

            <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
              <label className="block text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Project Images (Gallery)
              </label>

              {readStringArray(formData.images).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {readStringArray(formData.images).map((url, index) => (
                    <div key={`${url}-${index}`} className="relative group aspect-video">
                      <img
                        src={url}
                        alt={`Project ${index + 1}`}
                        className="w-full h-full object-cover rounded-md border bg-muted"
                      />
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
              <InputGroup label="Role / Title" name="role" value={formData.role} onChange={handleChange} required />
              <InputGroup label="Company Name" name="company" value={formData.company} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Start Date" name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Jan 2024" />
              <InputGroup label="End Date" name="endDate" value={formData.endDate} onChange={handleChange} placeholder="Present" />
            </div>
            <InputGroup label="Location" name="location" value={formData.location} onChange={handleChange} />

            <ArrayInputGroup
              label="Key Responsibilities"
              name="description"
              value={formData.description}
              onChange={(e) => handleArrayChange(e, "description")}
              placeholder="- Built new feature...&#10;- Optimized database..."
            />
            <ArrayInputGroup
              label="Technologies Used"
              name="technologies"
              value={formData.technologies}
              onChange={(e) => handleArrayChange(e, "technologies")}
              placeholder="React&#10;Node.js"
            />

            <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
              <label className="block text-sm font-medium text-foreground mb-4">Company Logo</label>
              <FileUpload
                label="Upload Logo"
                initialUrl={readString(formData.logo)}
                onUpload={(url) => handleImageUpload(url, "logo")}
              />
            </div>
          </>
        )}

        {collection === "skill" && (
          <>
            <InputGroup label="Category Name" name="category" value={formData.category} onChange={handleChange} placeholder="Frontend, Backend, etc." required />
            <ArrayInputGroup
              label="Skill Items"
              name="items"
              value={formData.items}
              onChange={(e) => handleArrayChange(e, "items")}
              placeholder="React&#10;TypeScript&#10;CSS"
            />
          </>
        )}

        {collection === "achievement" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Award Title" name="title" value={formData.title} onChange={handleChange} required />
              <InputGroup label="Organization" name="organization" value={formData.organization} onChange={handleChange} />
            </div>
            <InputGroup label="Date Received" name="date" value={formData.date} onChange={handleChange} />
            <TextAreaGroup label="Description" name="description" value={formData.description} onChange={handleChange} />
            <InputGroup label="Certificate Link" name="link" type="url" value={formData.link} onChange={handleChange} />

            <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
              <label className="block text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Certificates / Images
              </label>

              {readStringArray(formData.images).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {readStringArray(formData.images).map((url, index) => (
                    <div key={`${url}-${index}`} className="relative group aspect-video">
                      <img
                        src={url}
                        alt={`Achievement ${index + 1}`}
                        className="w-full h-full object-cover rounded-md border bg-muted"
                      />
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
            <InputGroup label="Institution" name="institution" value={formData.institution} onChange={handleChange} required />
            <InputGroup label="Degree / Certification" name="degree" value={formData.degree} onChange={handleChange} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Start Date" name="startDate" value={formData.startDate} onChange={handleChange} />
              <InputGroup label="End Date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </div>
            <InputGroup label="Grade / CGPA" name="grade" value={formData.grade} onChange={handleChange} />
          </>
        )}

        {collection === "cpprofile" && (
          <>
            <InputGroup label="Platform" name="platform" value={formData.platform} onChange={handleChange} placeholder="LeetCode" required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Current Rating" name="rating" value={formData.rating} onChange={handleChange} />
              <InputGroup label="Max Rating" name="maxRating" value={formData.maxRating} onChange={handleChange} />
            </div>
            <InputGroup label="Rank / Title" name="rank" value={formData.rank} onChange={handleChange} />
            <InputGroup label="Profile Link" name="link" type="url" value={formData.link} onChange={handleChange} />
          </>
        )}
      </div>

      <div className="flex gap-4 mt-10 pt-6 border-t">
        <button
          type="submit"
          className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Details
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition font-medium"
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
}

function InputGroup({ label, name, value, onChange, type = "text", placeholder, required }: InputGroupProps) {
  return (
    <div className="w-full group">
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1 transition-colors group-focus-within:text-primary">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm text-sm placeholder:text-muted-foreground/50 hover:border-primary/50"
        required={required}
      />
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
}

function TextAreaGroup({ label, name, value, onChange, rows = 4, placeholder }: TextAreaGroupProps) {
  return (
    <div className="w-full group">
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1 transition-colors group-focus-within:text-primary">
        {label}
      </label>
      <textarea
        name={name}
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full p-3.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm text-sm resize-y placeholder:text-muted-foreground/50 hover:border-primary/50"
      />
    </div>
  );
}

interface ArrayInputGroupProps {
  label: string;
  name: string;
  value: unknown;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

function ArrayInputGroup({ label, name, value, onChange, placeholder }: ArrayInputGroupProps) {
  return (
    <div className="w-full group">
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex justify-between items-center transition-colors group-focus-within:text-primary">
        {label}
        <span className="text-[10px] text-muted-foreground/70 font-medium px-2 py-0.5 bg-muted rounded-full">One item per line</span>
      </label>
      <textarea
        name={name}
        value={Array.isArray(value) ? value.join("\n") : typeof value === "string" ? value : ""}
        onChange={onChange}
        rows={5}
        placeholder={placeholder}
        className="w-full p-3.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm text-sm font-mono leading-relaxed placeholder:text-muted-foreground/50 hover:border-primary/50"
      />
    </div>
  );
}

interface JsonTextAreaGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText: string;
  rows?: number;
}

function JsonTextAreaGroup({ label, value, onChange, helperText, rows = 6 }: JsonTextAreaGroupProps) {
  return (
    <div className="w-full group">
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider transition-colors group-focus-within:text-primary">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder="[]"
        className="w-full rounded-xl border border-input bg-background p-3.5 font-mono text-sm leading-relaxed shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{helperText}</p>
    </div>
  );
}

function stringifyJsonField(value: unknown) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return "[]";
  }

  return JSON.stringify(value, null, 2);
}

function parseProjectJsonFields(values: Record<ProjectJsonField, string>) {
  try {
    const data = PROJECT_JSON_FIELDS.reduce((acc, field) => {
      const rawValue = values[field].trim();
      const parsed = rawValue ? JSON.parse(rawValue) : [];
      acc[field] = Array.isArray(parsed) ? parsed : [];
      return acc;
    }, {} as Record<ProjectJsonField, unknown[]>);

    return { success: true as const, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return {
      success: false as const,
      message: `Please fix the JSON project fields before saving. ${message}`,
    };
  }
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function readString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}
