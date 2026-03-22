"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AdminLogin from "@/components/admin/AdminLogin";
import ItemForm, { ItemFormSubmitResult } from "@/components/admin/ItemForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Award,
  Briefcase,
  Edit3,
  FolderGit2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Trash2,
  User,
  Code,
} from "lucide-react";

const COLLECTIONS = [
  { id: "project", label: "Projects", icon: FolderGit2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skill", label: "Skills", icon: Code },
  { id: "achievement", label: "Achievements", icon: Award },
  { id: "cpprofile", label: "CP Profiles", icon: User },
];

type AdminItem = {
  _id: string;
  title?: string;
  role?: string;
  institution?: string;
  category?: string;
  platform?: string;
  company?: string;
  degree?: string;
  organization?: string;
  username?: string;
  featured?: boolean;
};

type AdminApiError = {
  success?: false;
  errorType?: "auth" | "validation" | "server";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("project");

  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<AdminItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemPendingDelete, setItemPendingDelete] = useState<AdminItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const verifySession = useCallback(async () => {
    setIsCheckingAuth(true);

    try {
      const res = await fetch("/api/admin");
      const payload = (await res.json().catch(() => null)) as { authenticated?: boolean; message?: string } | null;

      if (res.ok && payload?.authenticated) {
        setIsAuthenticated(true);
        setAuthMessage(null);
      } else {
        setIsAuthenticated(false);
        setAuthMessage(payload?.message || "Please sign in to continue.");
      }
    } catch {
      setIsAuthenticated(false);
      setAuthMessage("Unable to verify the admin session right now. Please try again.");
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    void verifySession();
  }, [verifySession]);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    setAuthMessage(null);
    toast.success("Signed in", {
      description: "Your admin session is active.",
    });
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/admin?logout=true");
    } finally {
      setIsAuthenticated(false);
      setAuthMessage("You have been signed out.");
      setItems([]);
      setIsEditing(null);
      setIsCreating(false);
      setItemPendingDelete(null);
      toast.info("Signed out", {
        description: "The admin session has been cleared.",
      });
    }
  }, []);

  const handleAuthFailure = useCallback((message?: string) => {
    const nextMessage = message || "Your admin session has expired. Please sign in again.";
    setIsAuthenticated(false);
    setAuthMessage(nextMessage);
    setItems([]);
    setIsEditing(null);
    setIsCreating(false);
    setItemPendingDelete(null);
    toast.error("Authentication required", {
      description: nextMessage,
    });
  }, []);

  const fetchItems = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/data?collection=${activeTab}`);
      const json = (await res.json().catch(() => null)) as { success?: boolean; data?: AdminItem[]; message?: string } | null;

      if (json?.success && Array.isArray(json.data)) {
        setItems(json.data);
      } else {
        setItems([]);
        toast.error("Unable to load items", {
          description: json?.message || `Unable to load ${activeTab} items.`,
        });
      }
    } catch {
      setItems([]);
      toast.error("Unable to load items", {
        description: `Unable to load ${activeTab} items right now.`,
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchItems();
      setIsEditing(null);
      setIsCreating(false);
      setSearchTerm("");
      setItemPendingDelete(null);
    }
  }, [activeTab, isAuthenticated, fetchItems]);

  const handleSave = async (data: Record<string, unknown>): Promise<ItemFormSubmitResult> => {
    const isUpdate = Boolean(isEditing);

    try {
      const res = await fetch("/api/admin", {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: activeTab,
          id: isUpdate && isEditing ? isEditing._id : undefined,
          data,
        }),
      });

      const json = (await res.json().catch(() => null)) as (AdminApiError & { success?: boolean }) | null;

      if (res.ok && json?.success) {
        setIsEditing(null);
        setIsCreating(false);
        await fetchItems();
        return { success: true };
      }

      if (res.status === 401) {
        handleAuthFailure(json?.message);
      }

      return {
        success: false,
        errorType: json?.errorType || (res.status === 401 ? "auth" : res.status < 500 ? "validation" : "server"),
        message: json?.message || "Unable to save this item.",
        fieldErrors: json?.fieldErrors,
      };
    } catch {
      return {
        success: false,
        errorType: "server",
        message: "A network error prevented the item from being saved.",
      };
    }
  };

  const confirmDelete = async () => {
    if (!itemPendingDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin?collection=${activeTab}&id=${itemPendingDelete._id}`, {
        method: "DELETE",
      });
      const json = (await res.json().catch(() => null)) as AdminApiError | null;

      if (res.ok) {
        toast.success("Item deleted", {
          description: "The selected entry was removed from the CMS.",
        });
        setItemPendingDelete(null);
        await fetchItems();
        return;
      }

      if (res.status === 401) {
        handleAuthFailure(json?.message);
        return;
      }

      toast.error("Delete failed", {
        description: json?.message || "Delete failed. Please try again.",
      });
    } catch {
      toast.error("Delete failed", {
        description: "Delete failed because the request could not reach the server.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const term = searchTerm.toLowerCase();
        const title = item.title || item.role || item.institution || item.category || item.platform || "";
        const subtitle = item.company || item.degree || item.organization || item.username || "";
        return title.toLowerCase().includes(term) || subtitle.toLowerCase().includes(term);
      }),
    [items, searchTerm]
  );

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <AdminItemsSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} statusMessage={authMessage} />;
  }

  const ActiveIcon = COLLECTIONS.find((collection) => collection.id === activeTab)?.icon || LayoutDashboard;

  return (
    <>
      <div className="min-h-screen bg-muted/20 font-sans md:flex">
        <aside className="sticky top-0 z-20 flex h-auto w-full flex-col border-r bg-card md:fixed md:h-screen md:w-72">
          <div className="flex items-center gap-3 border-b p-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-foreground">Admin Pro</h1>
              <p className="text-xs text-muted-foreground">Portfolio CMS</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content Modules</p>
            {COLLECTIONS.map((col) => {
              const Icon = col.icon;
              const isActive = activeTab === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setActiveTab(col.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
                    isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {col.label}
                </button>
              );
            })}
          </nav>

          <div className="bg-muted/10 p-4 border-t">
            <button
              onClick={() => void handleLogout()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <main className="min-h-screen flex-1 overflow-y-auto p-4 md:ml-72 md:p-8">
          <div className="mx-auto max-w-5xl space-y-8 animate-fade-up">
            {!isCreating && !isEditing && (
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground">
                    <ActiveIcon className="h-8 w-8 text-primary/80" />
                    <span className="capitalize">{activeTab}</span>
                  </h2>
                  <p className="mt-1 text-muted-foreground">Manage your {activeTab} entries.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border bg-card py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/20 md:w-64"
                    />
                  </div>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" /> Add New
                  </button>
                </div>
              </div>
            )}

            {(isCreating || isEditing) && (
              <div className="animate-fade-up">
                <ItemForm
                  collection={activeTab}
                  key={`${activeTab}-${isEditing?._id ?? "new"}`}
                  initialData={isEditing || undefined}
                  onSubmit={handleSave}
                  onCancel={() => {
                    setIsEditing(null);
                    setIsCreating(false);
                  }}
                />
              </div>
            )}

            {!isCreating && !isEditing && (
              <div className="grid grid-cols-1 gap-4">
                {loading ? (
                  <AdminItemsSkeleton />
                ) : items.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-card py-20 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <ActiveIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No {activeTab} items yet</h3>
                    <p className="mb-6 mt-1 text-sm text-muted-foreground">Create your first entry to get started.</p>
                    <button onClick={() => setIsCreating(true)} className="font-medium text-primary hover:underline">
                      + Create New Entry
                    </button>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">No items match your search.</div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="group flex flex-col justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md md:flex-row md:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                          {(item.title?.[0] || item.role?.[0] || item.company?.[0] || "?").toUpperCase()}
                        </div>

                        <div>
                          <h4 className="text-lg font-bold leading-tight text-foreground">
                            {item.title || item.role || item.institution || item.category || item.platform}
                          </h4>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {(item.company || item.degree || item.organization || item.username) && (
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                {item.company || item.degree || item.organization || item.username}
                              </span>
                            )}
                            {item.featured && (
                              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">Featured</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <button
                          onClick={() => setIsEditing(item)}
                          className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/80"
                        >
                          <Edit3 className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => setItemPendingDelete(item)}
                          className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
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

      <Dialog open={Boolean(itemPendingDelete)} onOpenChange={(open) => !open && !isDeleting && setItemPendingDelete(null)}>
        <DialogContent className="max-w-md" hideCloseButton={isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>
              This action permanently removes <strong>{itemPendingDelete?.title || itemPendingDelete?.role || itemPendingDelete?.platform || "this entry"}</strong> from the CMS.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setItemPendingDelete(null)}
              disabled={isDeleting}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void confirmDelete()}
              disabled={isDeleting}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AdminItemsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
              <div className="space-y-3">
                <div className="h-5 w-48 rounded-full bg-muted animate-pulse" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-4 w-28 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-20 rounded-full bg-muted animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 rounded-lg bg-muted animate-pulse" />
              <div className="h-10 w-28 rounded-lg bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
