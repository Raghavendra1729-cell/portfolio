"use client";

import { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import ItemForm from "@/components/admin/ItemForm";
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  User, 
  FolderGit2, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Trash2,
  LayoutDashboard,
  Loader2
} from "lucide-react";

/**
 * CONFIGURATION
 */
const COLLECTIONS = [
  { id: "project", label: "Projects", icon: FolderGit2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skill", label: "Skills", icon: Code },
  { id: "achievement", label: "Achievements", icon: Award },
  { id: "cpprofile", label: "CP Profiles", icon: User },
];

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("project");
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Check Auth on Load
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
      setSearchTerm("");
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
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
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

  // Filter items
  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    const title = item.title || item.role || item.institution || item.category || item.platform || "";
    const subtitle = item.company || item.degree || item.organization || item.username || "";
    return title.toLowerCase().includes(term) || subtitle.toLowerCase().includes(term);
  });

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return <AdminLogin onLogin={handleLogin} />;

  const ActiveIcon = COLLECTIONS.find(c => c.id === activeTab)?.icon || LayoutDashboard;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-card border-r flex flex-col h-auto md:h-screen sticky top-0 md:fixed z-20">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-foreground">Admin Pro</h1>
            <p className="text-xs text-muted-foreground">Portfolio CMS</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Content Modules</p>
          {COLLECTIONS.map((col) => {
            const Icon = col.icon;
            const isActive = activeTab === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {col.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t bg-muted/10">
          <button 
            onClick={handleLogout} 
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition flex items-center gap-3"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
          
          {/* HEADER SECTION */}
          {!isCreating && !isEditing && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <ActiveIcon className="w-8 h-8 text-primary/80" />
                  <span className="capitalize">{activeTab}</span>
                </h2>
                <p className="text-muted-foreground mt-1">Manage your {activeTab} entries.</p>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search items..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2.5 bg-card border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none shadow-sm w-full md:w-64"
                    />
                 </div>
                 <button 
                  onClick={() => setIsCreating(true)}
                  className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20 flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
            </div>
          )}

          {/* FORM VIEW */}
          {(isCreating || isEditing) && (
            <div className="animate-fade-up">
              <ItemForm 
                collection={activeTab}
                initialData={isEditing}
                onSubmit={handleSave}
                onCancel={() => { setIsEditing(null); setIsCreating(false); }}
              />
            </div>
          )}

          {/* GRID VIEW */}
          {!isCreating && !isEditing && (
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p>Loading {activeTab} data...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <ActiveIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">No {activeTab} items yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">Create your first entry to get started.</p>
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="text-primary font-medium hover:underline"
                  >
                    + Create New Entry
                  </button>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No items match your search.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="bg-card p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar/Icon Placeholder */}
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-bold text-xl">
                        {(item.title?.[0] || item.role?.[0] || item.company?.[0] || "?").toUpperCase()}
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-lg text-foreground leading-tight">
                          {item.title || item.role || item.institution || item.category || item.platform}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(item.company || item.degree || item.organization || item.username) && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              {item.company || item.degree || item.organization || item.username}
                            </span>
                          )}
                          {/* Optional Badges */}
                          {item.featured && (
                            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setIsEditing(item)}
                        className="px-4 py-2 text-sm bg-muted text-foreground hover:bg-muted/80 rounded-lg font-medium flex items-center gap-2 transition"
                      >
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="px-4 py-2 text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg font-medium flex items-center gap-2 transition"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
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