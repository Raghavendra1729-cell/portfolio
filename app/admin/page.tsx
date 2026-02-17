"use client";

import { useState, useEffect } from "react";

const COLLECTIONS = [
  "project",
  "experience",
  "education",
  "skill",
  "achievement",
  "cpprofile",
];

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("project");

  useEffect(() => {
    const savedSecret = localStorage.getItem("adminSecret");
    if (savedSecret) {
      setSecret(savedSecret);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret) {
      localStorage.setItem("adminSecret", secret);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSecret");
    setIsAuthenticated(false);
    setSecret("");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <input
            type="password"
            placeholder="Enter Admin Secret"
            className="w-full p-3 border rounded mb-4"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Portfolio Admin</h1>
        <button onClick={handleLogout} className="text-red-600 text-sm hover:underline">
          Logout
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-6 hidden md:block">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Collections</h2>
          <nav className="space-y-2">
            {COLLECTIONS.map((col) => (
              <button
                key={col}
                onClick={() => setActiveTab(col)}
                className={`w-full text-left px-4 py-2 rounded transition ${
                  activeTab === col ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab} Manager</h2>
          <DataManager collection={activeTab} secret={secret} />
        </main>
      </div>
    </div>
  );
}

function DataManager({ collection, secret }: { collection: string; secret: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/data?collection=${collection}`);
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (err) {
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    setFormData("");
    setIsEditing(null);
  }, [collection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = JSON.parse(formData);
      
      const res = await fetch("/api/admin", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({
          collection,
          id: isEditing,
          data: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert(isEditing ? "Updated successfully!" : "Created successfully!");
        setFormData("");
        setIsEditing(null);
        fetchItems();
      } else {
        alert("Error: " + (json.error || json.message));
      }
    } catch (err) {
      alert("Invalid JSON data or Network Error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    const res = await fetch(`/api/admin?collection=${collection}&id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });

    const json = await res.json();
    if (json.success) {
      fetchItems();
    } else {
      alert("Delete failed");
    }
  };

  const handleEdit = (item: any) => {
    const { _id, createdAt, updatedAt, __v, ...editableData } = item;
    setFormData(JSON.stringify(editableData, null, 2));
    setIsEditing(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Editor Form */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-10">
        <h3 className="font-bold mb-4">{isEditing ? `Edit ${collection}` : `Add New ${collection}`}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">
              Data (JSON Format)
              <span className="ml-2 text-xs text-gray-400">
                - Enter the fields exactly as defined in your Schema
              </span>
            </label>
            <textarea
              className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData}
              onChange={(e) => setFormData(e.target.value)}
              placeholder={`{\n  "title": "Example Title",\n  "description": "..."\n}`}
              required
            />
          </div>
          <div className="flex gap-3">
            <button 
              type="submit" 
              className={`px-6 py-2 rounded text-white font-medium ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isEditing ? "Update Item" : "Create Item"}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { setIsEditing(null); setFormData(""); }}
                className="px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Data List */}
      <h3 className="font-bold mb-4">Existing Items ({items.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded border flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg">
                  {item.title || item.role || item.degree || item.category || item.platform || "Untitled"}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.company || item.institution || item.organization || item.username}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-mono">ID: {item._id}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 italic">No items found.</p>}
        </div>
      )}
    </div>
  );
}