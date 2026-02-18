"use client";

import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import { Plus, Trash2, Save, X, Image as ImageIcon } from "lucide-react";

interface ItemFormProps {
  initialData?: any;
  collection: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ItemForm({ initialData, collection, onSubmit, onCancel }: ItemFormProps) {
  // We initialize state with initialData or an empty object
  const [formData, setFormData] = useState<any>(initialData || {});

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle array inputs (like technologies, description points)
  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
    // Split by new line to create an array
    const array = e.target.value.split("\n");
    setFormData((prev: any) => ({ ...prev, [field]: array }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Handle single image upload (for logo, profile pic, etc.)
  const handleImageUpload = (url: string, field: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: url }));
  };

  // Handle multiple image uploads (for galleries)
  const handleMultipleImageUpload = (url: string, field: string) => {
    const currentImages = formData[field] || [];
    setFormData((prev: any) => ({ ...prev, [field]: [...currentImages, url] }));
  };

  // Remove image from array
  const handleRemoveImage = (index: number, field: string) => {
    const currentImages = formData[field] || [];
    const updatedImages = currentImages.filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({ ...prev, [field]: updatedImages }));
  };

  // Render Components - Defined Inline to avoid re-creation on render
  // Ideally these could be separate components, but standard HTML elements are fine here.
  
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
        {/* DYNAMIC FIELDS BASED ON COLLECTION */}
        
        {/* --- PROJECT FIELDS --- */}
        {collection === "project" && (
          <>
            <div className="grid grid-cols-1 gap-6">
              <InputGroup label="Project Title" name="title" value={formData.title} onChange={handleChange} required />
              <TextAreaGroup label="Description" name="description" value={formData.description} onChange={handleChange} />
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

            {/* Image Gallery Upload */}
            <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
              <label className="block text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Project Images (Gallery)
              </label>
              
              {/* Display existing images */}
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((url: string, index: number) => (
                    <div key={index} className="relative group aspect-video">
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
              
              <FileUpload 
                label="Add Image"
                onUpload={(url) => handleMultipleImageUpload(url, "images")}
              />
            </div>
          </>
        )}

        {/* --- EXPERIENCE FIELDS --- */}
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
            
            {/* Company Logo Upload */}
            <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
              <label className="block text-sm font-medium text-foreground mb-4">Company Logo</label>
              <FileUpload 
                label="Upload Logo"
                initialUrl={formData.logo}
                onUpload={(url) => handleImageUpload(url, "logo")}
              />
            </div>
          </>
        )}

        {/* --- SKILL FIELDS --- */}
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

        {/* --- ACHIEVEMENT FIELDS --- */}
        {collection === "achievement" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputGroup label="Award Title" name="title" value={formData.title} onChange={handleChange} required />
               <InputGroup label="Organization" name="organization" value={formData.organization} onChange={handleChange} />
            </div>
            <InputGroup label="Date Received" name="date" value={formData.date} onChange={handleChange} />
            <TextAreaGroup label="Description" name="description" value={formData.description} onChange={handleChange} />
            <InputGroup label="Certificate Link" name="link" type="url" value={formData.link} onChange={handleChange} />
            
            {/* Achievement Images Upload */}
            <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border">
              <label className="block text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Certificates / Images
              </label>
              
              {/* Display existing images */}
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((url: string, index: number) => (
                    <div key={index} className="relative group aspect-video">
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
              
              <FileUpload 
                label="Add Image"
                onUpload={(url) => handleMultipleImageUpload(url, "images")}
              />
            </div>
          </>
        )}

        {/* --- EDUCATION FIELDS --- */}
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
        
         {/* --- CP PROFILE FIELDS --- */}
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

// ----------------------------------------------------------------------
// HELPER COMPONENTS (Extracted to prevent re-render focus loss)
// ----------------------------------------------------------------------

interface InputGroupProps {
  label: string;
  name: string;
  value: string | number;
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
        value={value || ""}
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
  value: string;
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
        value={value || ""}
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
  value: string[] | string;
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
        // Join array back to string for display if it's an array
        value={Array.isArray(value) ? value.join("\n") : value || ""}
        onChange={onChange}
        rows={5}
        placeholder={placeholder}
        className="w-full p-3.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm text-sm font-mono leading-relaxed placeholder:text-muted-foreground/50 hover:border-primary/50"
      />
    </div>
  );
}