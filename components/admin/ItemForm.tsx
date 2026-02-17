"use client";

import { useState, useEffect } from "react";

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle array inputs (like technologies, description points)
  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
    // Split by new line to create an array
    const array = e.target.value.split("\n");
    setFormData({ ...formData, [field]: array });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // RENDER HELPERS
  const renderInput = (label: string, name: string, type: string = "text", placeholder: string = "") => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none"
        required={type !== "url"} // URLs usually optional
      />
    </div>
  );

  const renderTextArea = (label: string, name: string, rows: number = 3) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{label}</label>
      <textarea
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        rows={rows}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none"
      />
    </div>
  );

  const renderArrayInput = (label: string, name: string, placeholder: string) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
        {label} <span className="text-xs text-gray-400 font-normal">(One item per line)</span>
      </label>
      <textarea
        name={name}
        // Join array back to string for display
        value={Array.isArray(formData[name]) ? formData[name].join("\n") : formData[name] || ""}
        onChange={(e) => handleArrayChange(e, name)}
        rows={4}
        placeholder={placeholder}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none font-mono text-sm"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-xl mb-6 border-b pb-2">
        {initialData ? "Edit" : "Add"} {collection}
      </h3>

      {/* DYNAMIC FIELDS BASED ON COLLECTION */}
      
      {/* --- PROJECT FIELDS --- */}
      {collection === "project" && (
        <>
          {renderInput("Title", "title")}
          {renderTextArea("Description", "description")}
          {renderArrayInput("Tech Stack", "techStack", "Next.js\nMongoDB\nTailwind")}
          <div className="grid grid-cols-2 gap-4">
            {renderInput("Live Link", "link", "url")}
            {renderInput("GitHub Repo", "repo", "url")}
          </div>
        </>
      )}

      {/* --- EXPERIENCE FIELDS --- */}
      {collection === "experience" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {renderInput("Role", "role")}
            {renderInput("Company", "company")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderInput("Start Date", "startDate", "text", "Jan 2024")}
            {renderInput("End Date", "endDate", "text", "Present")}
          </div>
          {renderInput("Location", "location")}
          {renderArrayInput("Description Points", "description", "- Built a feature...\n- Optimized API...")}
          {renderArrayInput("Technologies Used", "technologies", "React\nNode.js")}
        </>
      )}

      {/* --- SKILL FIELDS --- */}
      {collection === "skill" && (
        <>
          {renderInput("Category", "category", "text", "Frontend, Backend, etc.")}
          {renderArrayInput("Skill Items", "items", "React\nTypeScript\nCSS")}
        </>
      )}

      {/* --- ACHIEVEMENT FIELDS --- */}
      {collection === "achievement" && (
        <>
          {renderInput("Title", "title")}
          {renderInput("Organization", "organization")}
          {renderInput("Date", "date")}
          {renderTextArea("Description", "description")}
          {renderInput("Certificate Link", "link", "url")}
        </>
      )}

      {/* --- EDUCATION FIELDS --- */}
      {collection === "education" && (
        <>
          {renderInput("Institution", "institution")}
          {renderInput("Degree", "degree")}
          <div className="grid grid-cols-2 gap-4">
            {renderInput("Start Date", "startDate")}
            {renderInput("End Date", "endDate")}
          </div>
          {renderInput("Grade/CGPA", "grade")}
        </>
      )}
      
       {/* --- CP PROFILE FIELDS --- */}
       {collection === "cpprofile" && (
        <>
          {renderInput("Platform", "platform", "text", "LeetCode")}
          {renderInput("Current Rating", "rating")}
          {renderInput("Max Rating", "maxRating")}
          {renderInput("Rank/Title", "rank")}
          {renderInput("Profile Link", "link", "url")}
        </>
      )}

      <div className="flex gap-3 mt-8">
        <button 
          type="submit" 
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Save Details
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}