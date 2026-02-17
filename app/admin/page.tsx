"use client";

import { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import ItemForm from "@/components/admin/ItemForm";

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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New loading state
  const [activeTab, setActiveTab] = useState("project");
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // 1. Check Auth on Load (Verify with Server)
  useEffect(() => {
    const verifyStoredSecret = async () => {
      const savedSecret = localStorage.getItem("adminSecret");
      if (savedSecret) {
        try {
          const res = await fetch("/api/admin", {
            headers: { "x-admin-secret": savedSecret }
          });
          if (res.ok) {
            setSecret(savedSecret);
            setIsAuthenticated(true);
          } else {
             // If invalid, clear it
             localStorage.removeItem("adminSecret");
          }
        } catch (err) {
          console.error("Auth check failed", err);
        }
      }
      setIsCheckingAuth(false);
    };

    verifyStoredSecret();
  }, []);

  const handleLogin = (key: string) => {
    localStorage.setItem("adminSecret", key);
    setSecret(key);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSecret");
    setIsAuthenticated(false);
    setSecret("");
  };

  const fetchItems = async () => {
    // Only fetch if we are actually authenticated
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/data?collection=${activeTab}`);
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
      setIsEditing(null);
      setIsCreating(false);
    }
  }, [activeTab, isAuthenticated]);

  // Handlers
  const handleSave = async (data: any) => {
    const isUpdate = !!isEditing;
    const endpoint = "/api/admin";
    const method = isUpdate ? "PUT" : "POST";
    const payload = {
      collection: activeTab,
      id: isUpdate ? isEditing._id : undefined,
      data: data
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      
      if (json.success) {
        alert("Saved successfully!");
        setIsEditing(null);
        setIsCreating(false);
        fetchItems();
      } else {
        alert("Error: " + (json.error || json.message));
      }
    } catch (err) {
      alert("Network Error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    try {
      const res = await fetch(`/api/admin?collection=${activeTab}&id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      if (res.ok) fetchItems();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Render Loading state while checking LocalStorage
  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not authenticated, show Login
  if (!isAuthenticated) return <AdminLogin onLogin={handleLogin} />;

  // Main Dashboard UI
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-white border-r flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Manage Content</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {COLLECTIONS.map((col) => (
            <button
              key={col}
              onClick={() => setActiveTab(col)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === col 
                  ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {col.charAt(0).toUpperCase() + col.slice(1)}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="text-red-600 text-sm font-medium hover:underline">
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold capitalize">{activeTab} Manager</h2>
            {!isEditing && !isCreating && (
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
              >
                + Add New
              </button>
            )}
          </div>

          {(isCreating || isEditing) && (
            <ItemForm 
              collection={activeTab}
              initialData={isEditing}
              onSubmit={handleSave}
              onCancel={() => { setIsEditing(null); setIsCreating(false); }}
            />
          )}

          {!isCreating && !isEditing && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading data...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed">
                  <p className="text-gray-500">No items found in {activeTab}.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition flex justify-between items-start group">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {item.title || item.role || item.institution || item.category || item.platform}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.company || item.degree || item.organization || item.username}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => setIsEditing(item)}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}