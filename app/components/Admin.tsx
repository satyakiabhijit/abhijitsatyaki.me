"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import type { BeyondDevItem } from "@/app/lib/db/admin";

const ROLES = ["frontend", "backend", "fullstack", "software-dev"];
const PRESET_SECTIONS = [
  "Books",
  "Philosophy",
  "Psychology",
  "Life & Mindset",
  "Research Papers",
  "Productivity",
];

export default function Admin() {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<"resumes" | "beyond-dev">("resumes");

  // Resume states
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">("info");
  const [availableResumes, setAvailableResumes] = useState<string[]>([]);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const [defaultRole, setDefaultRole] = useState<string | null>(null);

  // Beyond Dev states
  const [beyondItems, setBeyondItems] = useState<BeyondDevItem[]>([]);
  const [beyondLoading, setBeyondLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formSection, setFormSection] = useState("Books");
  const [customSection, setCustomSection] = useState("");
  const [formSubsection, setFormSubsection] = useState("");
  const [customSubsection, setCustomSubsection] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formCoverImageUrl, setFormCoverImageUrl] = useState("");
  const [coverImgError, setCoverImgError] = useState(false);
  const [formDownloadUrl, setFormDownloadUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(0);
  const [savingItem, setSavingItem] = useState(false);

  // Dynamically populate available sections from presets + any custom ones created
  const availableSections = useMemo(() => {
    const set = new Set<string>(PRESET_SECTIONS);
    beyondItems.forEach((item) => {
      if (item.section && item.section.trim()) {
        set.add(item.section.trim());
      }
    });
    return Array.from(set);
  }, [beyondItems]);

  const activeSection =
    formSection === "__custom__" ? customSection.trim() : formSection.trim();

  // Dynamically populate available subsections under the currently selected section
  const availableSubsections = useMemo(() => {
    if (!activeSection) return [];
    const set = new Set<string>();
    beyondItems.forEach((item) => {
      if (
        item.section?.toLowerCase() === activeSection.toLowerCase() &&
        item.subsection &&
        item.subsection.trim()
      ) {
        set.add(item.subsection.trim());
      }
    });
    return Array.from(set);
  }, [beyondItems, activeSection]);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const notify = (text: string, type: "info" | "error" | "success" = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/resumes", { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      if (data.resumes) {
        setAvailableResumes(data.resumes.map((r: { role: string }) => r.role));
        const def = data.resumes.find((r: { is_default: boolean }) => r.is_default);
        setDefaultRole(def ? def.role : null);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  }, []);

  const fetchBeyondDevItems = useCallback(async () => {
    setBeyondLoading(true);
    try {
      const res = await fetch("/api/admin/beyond-dev", { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      if (data.items) {
        setBeyondItems(data.items);
      }
    } catch (err) {
      console.error("Error fetching beyond dev items:", err);
    } finally {
      setBeyondLoading(false);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflowY = "auto";

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    fetch("/api/admin/auth", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setSession(data.user);
          fetchFiles();
          fetchBeyondDevItems();
        } else {
          localStorage.removeItem("admin_token");
        }
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
      });
  }, [fetchFiles, fetchBeyondDevItems]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.error || "Login failed");
        setMessageType("error");
      } else {
        localStorage.setItem("admin_token", data.token);
        setSession(data.user);
        fetchFiles();
        fetchBeyondDevItems();
        setMessage("Signed in successfully");
        setMessageType("success");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      setMessage(message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      try {
        await fetch("/api/admin/auth", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Continue clearing local state regardless
      }
    }
    localStorage.removeItem("admin_token");
    setSession(null);
    setAvailableResumes([]);
    setDefaultRole(null);
    setBeyondItems([]);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(",")[1];
          const res = await fetch("/api/admin/resumes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders(),
            },
            body: JSON.stringify({
              role: selectedRole,
              filename: file.name,
              mime_type: file.type || "application/pdf",
              data_base64: base64Data,
              is_default: availableResumes.length === 0,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            notify(data.error || "Upload failed", "error");
          } else {
            notify(
              `Uploaded resume for ${selectedRole.toUpperCase()}${data.resume?.is_default ? " (marked as default)" : ""}`,
              "success",
            );
            setFile(null);
            const input = document.getElementById("pdf-file") as HTMLInputElement;
            if (input) input.value = "";
            fetchFiles();
          }
        } catch (err) {
          notify(err instanceof Error ? err.message : "Upload error", "error");
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      notify(err instanceof Error ? err.message : "File read error", "error");
      setUploading(false);
    }
  };

  const handleSetDefault = async (role: string) => {
    try {
      const res = await fetch("/api/admin/resumes/default", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        notify(data.error || "Failed to set default", "error");
      } else {
        notify(`Default resume is now ${role.toUpperCase()}`, "success");
        setDefaultRole(role);
        fetchFiles();
      }
    } catch {
      notify("Failed to set default", "error");
    }
  };

  const handleDelete = async (role: string) => {
    if (
      !window.confirm(
        `Delete ${role.toUpperCase()} resume? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/admin/resumes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        notify(data.error || "Delete failed", "error");
      } else {
        notify(`Deleted ${role.toUpperCase()} resume`, "success");
        fetchFiles();
      }
    } catch {
      notify("Delete failed", "error");
    }
  };

  const handleCopy = (role: string) => {
    const url = `${window.location.origin}/resume/${role}`;
    navigator.clipboard.writeText(url);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  // Beyond Dev item form handlers
  const handleResetForm = () => {
    setEditingId(null);
    setFormSection("Books");
    setCustomSection("");
    setFormSubsection("");
    setCustomSubsection("");
    setFormTitle("");
    setFormAuthor("");
    setFormCoverImageUrl("");
    setCoverImgError(false);
    setFormDownloadUrl("");
    setFormDescription("");
    setFormDisplayOrder(0);
  };

  const handleEditBeyondDevItem = (item: BeyondDevItem) => {
    setEditingId(item.id);
    if (availableSections.includes(item.section)) {
      setFormSection(item.section);
      setCustomSection("");
    } else {
      setFormSection("__custom__");
      setCustomSection(item.section);
    }

    if (!item.subsection) {
      setFormSubsection("");
      setCustomSubsection("");
    } else {
      setFormSubsection(item.subsection);
      setCustomSubsection("");
    }

    setFormTitle(item.title);
    setFormAuthor(item.author || "");
    setFormCoverImageUrl(item.cover_image_url || "");
    setCoverImgError(false);
    setFormDownloadUrl(item.download_url || "");
    setFormDescription(item.description || "");
    setFormDisplayOrder(item.display_order ?? 0);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handleSaveBeyondDevItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      notify("Please provide a title", "error");
      return;
    }

    setSavingItem(true);
    const finalSection =
      formSection === "__custom__"
        ? customSection.trim() || "Books"
        : formSection.trim();

    const finalSubsection =
      formSubsection === "__custom__"
        ? customSubsection.trim() || null
        : formSubsection.trim() || null;

    try {
      const payload = {
        section: finalSection,
        subsection: finalSubsection,
        title: formTitle.trim(),
        author: formAuthor.trim() || null,
        cover_image_url: formCoverImageUrl.trim() || null,
        download_url: formDownloadUrl.trim() || null,
        description: formDescription.trim() || null,
        display_order: Number(formDisplayOrder) || 0,
      };

      const res = await fetch("/api/admin/beyond-dev", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        notify(data.error || "Failed to save item", "error");
      } else {
        notify(
          editingId
            ? "Updated resource in Beyond Dev!"
            : "Added new resource to Beyond Dev!",
          "success",
        );
        handleResetForm();
        fetchBeyondDevItems();
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : "Error saving item", "error");
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteBeyondDevItem = async (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch("/api/admin/beyond-dev", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        notify(data.error || "Failed to delete item", "error");
      } else {
        notify("Resource deleted", "success");
        if (editingId === id) handleResetForm();
        fetchBeyondDevItems();
      }
    } catch {
      notify("Error deleting item", "error");
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-[75vh] w-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-primary/80 bg-bg-secondary/40 p-8 shadow-2xl backdrop-blur-xl transition-all">
          {/* Header & Icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-inner">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Admin Portal
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Enter your credentials to manage resumes &amp; Beyond Dev
            </p>
          </div>

          {/* Feedback message */}
          {message && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-xl p-3.5 text-sm ${
                messageType === "error"
                  ? "border border-rose-500/20 bg-rose-500/10 text-rose-300"
                  : messageType === "success"
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
              }`}
            >
              <span className="mt-0.5">
                {messageType === "error" ? "⚠️" : messageType === "success" ? "✓" : "ℹ"}
              </span>
              <p className="flex-1">{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-medium text-text-secondary"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@abhijitsatyaki.me"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border-primary/80 bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-medium text-text-secondary"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border-primary/80 bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Sign In to Admin Portal →</span>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-text-secondary transition hover:text-text-primary"
            >
              ← Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <Link href="/" className="back-link">
          ← Back Home
        </Link>
        <div className="user-info">
          <span>{session.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "resumes" ? "active" : ""}`}
          onClick={() => setActiveTab("resumes")}
        >
          📄 Resumes
        </button>
        <button
          className={`tab-btn ${activeTab === "beyond-dev" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("beyond-dev");
            fetchBeyondDevItems();
          }}
        >
          📚 Beyond Dev ({beyondItems.length})
        </button>
      </div>

      <div className="admin-dashboard">
        {/* Global Alert Message */}
        {message && (
          <p
            className={
              messageType === "error"
                ? "error"
                : messageType === "success"
                  ? "status-message success"
                  : "status-message"
            }
          >
            {message}
          </p>
        )}

        {/* TAB 1: RESUMES */}
        {activeTab === "resumes" && (
          <>
            <div className="dashboard-section upload-section">
              <h3>Upload Resume</h3>

              <form onSubmit={handleUpload} className="admin-form full-width">
                <div className="input-group">
                  <label htmlFor="role-select">Select Role:</label>
                  <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="pdf-file">PDF File:</label>
                  <input
                    id="pdf-file"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                  {file && (
                    <span className="file-hint">
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </span>
                  )}
                </div>

                <button type="submit" disabled={uploading || !file}>
                  {uploading ? "Uploading..." : "Upload / Replace"}
                </button>
              </form>

              {availableResumes.length > 0 && (
                <div className="default-section">
                  <h4>Set Default Resume</h4>
                  <p>
                    The default resume is what <code>/resume</code> serves. Every
                    other role keeps its own file.
                  </p>
                  <div className="default-controls">
                    <select
                      value={defaultRole || ""}
                      onChange={(e) => setDefaultRole(e.target.value || null)}
                      disabled={uploading}
                      aria-label="Default resume role"
                    >
                      <option value="">-- Select a role --</option>
                      {availableResumes.map((role) => (
                        <option key={role} value={role}>
                          {role.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => defaultRole && handleSetDefault(defaultRole)}
                      disabled={uploading || !defaultRole}
                      className="btn-primary"
                    >
                      Set as Default
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="dashboard-section links-section">
              <h3>Manage Resumes</h3>
              <div className="links-grid">
                {ROLES.map((role) => {
                  const isAvailable = availableResumes.includes(role);
                  const isDefault = defaultRole === role;
                  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/resume/${role}`;

                  return (
                    <div
                      key={role}
                      className={`link-card ${isAvailable ? "available" : "missing"} ${isDefault ? "is-default" : ""}`}
                    >
                      <div className="link-card-header">
                        <h4>{role.toUpperCase()}</h4>
                        <span
                          className={`status-badge ${isAvailable ? "success" : "error"} ${isDefault ? "default-badge" : ""}`}
                        >
                          {isAvailable
                            ? isDefault
                              ? "Default"
                              : "Available"
                            : "Missing"}
                        </span>
                      </div>
                      <p className="link-url">{link}</p>

                      <div className="link-actions">
                        <button
                          onClick={() => handleCopy(role)}
                          className="action-btn copy-btn"
                        >
                          {copiedRole === role ? "Copied!" : "Copy Link"}
                        </button>
                        {isAvailable ? (
                          <a
                            href={`/resume/${role}`}
                            target="_blank"
                            rel="noreferrer"
                            className="action-btn preview-btn"
                          >
                            Preview
                          </a>
                        ) : (
                          <span className="action-btn disabled-preview">—</span>
                        )}
                        {isAvailable && !isDefault && (
                          <button
                            onClick={() => handleSetDefault(role)}
                            className="action-btn default-btn"
                          >
                            Set Default
                          </button>
                        )}
                        {isAvailable && (
                          <button
                            onClick={() => handleDelete(role)}
                            className="action-btn delete-btn"
                            title={`Delete ${role} resume`}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: BEYOND DEV */}
        {activeTab === "beyond-dev" && (
          <>
            <div className="dashboard-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, border: "none", padding: 0 }}>
                  {editingId ? "Edit Resource" : "Add Resource to Beyond Dev"}
                </h3>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="action-btn"
                    style={{ fontSize: "0.85rem", padding: "6px 14px" }}
                  >
                    ✕ Cancel Edit
                  </button>
                )}
              </div>
              <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: 0, marginBottom: "20px" }}>
                Add books, essays, PDF download / Google Drive links, cover photo previews, and notes formatted in markdown or HTML.
              </p>

              <form onSubmit={handleSaveBeyondDevItem} className="admin-form full-width">
                <div className="beyond-form-grid">
                  {/* Main Section Selector */}
                  <div className="input-group">
                    <label htmlFor="section-select">Main Section:</label>
                    <select
                      id="section-select"
                      value={formSection}
                      onChange={(e) => {
                        setFormSection(e.target.value);
                        setFormSubsection("");
                        setCustomSubsection("");
                      }}
                    >
                      {availableSections.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                      <option value="__custom__">+ Create Custom Main Section...</option>
                    </select>
                  </div>

                  {/* Custom main section input if selected */}
                  {formSection === "__custom__" && (
                    <div className="input-group">
                      <label htmlFor="custom-sec-name">Custom Main Section Name *:</label>
                      <input
                        id="custom-sec-name"
                        type="text"
                        placeholder="e.g. Science, Biography, Fiction"
                        value={customSection}
                        onChange={(e) => setCustomSection(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Sub-section Selector */}
                  <div className="input-group">
                    <label htmlFor="subsection-select">
                      Sub-section (under {activeSection || "Section"}):
                    </label>
                    <select
                      id="subsection-select"
                      value={formSubsection}
                      onChange={(e) => setFormSubsection(e.target.value)}
                    >
                      <option value="">(None / General)</option>
                      {availableSubsections.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                      <option value="__custom__">+ Create Custom Sub-section...</option>
                    </select>
                  </div>

                  {/* Custom subsection input if selected */}
                  {formSubsection === "__custom__" && (
                    <div className="input-group">
                      <label htmlFor="custom-subsec-name">Custom Sub-section Name *:</label>
                      <input
                        id="custom-subsec-name"
                        type="text"
                        placeholder="e.g. Detective, Sci-Fi, Biography, Mystery"
                        value={customSubsection}
                        onChange={(e) => setCustomSubsection(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Title */}
                  <div className="input-group">
                    <label htmlFor="item-title">Title *:</label>
                    <input
                      id="item-title"
                      type="text"
                      placeholder="e.g. Atomic Habits, Meditations"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Author */}
                  <div className="input-group">
                    <label htmlFor="item-author">Author / Creator:</label>
                    <input
                      id="item-author"
                      type="text"
                      placeholder="e.g. James Clear, Marcus Aurelius"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                    />
                  </div>

                  {/* Photo Preview Link with Live Preview */}
                  <div className="input-group beyond-form-full">
                    <label htmlFor="item-cover">Photo Preview / Cover URL:</label>
                    <input
                      id="item-cover"
                      type="url"
                      placeholder="https://... image link or book cover"
                      value={formCoverImageUrl}
                      onChange={(e) => {
                        setFormCoverImageUrl(e.target.value);
                        setCoverImgError(false);
                      }}
                    />

                    {/* Live Preview Card */}
                    {formCoverImageUrl.trim() && (
                      <div className="cover-preview-card">
                        <div className="cover-preview-thumb-wrap">
                          {!coverImgError ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={formCoverImageUrl.trim()}
                              alt="Cover live preview"
                              className="cover-preview-img"
                              onError={() => setCoverImgError(true)}
                            />
                          ) : (
                            <div className="cover-preview-error">
                              <span style={{ fontSize: "0.85rem" }}>⚠️</span>
                              <span>Failed to load</span>
                            </div>
                          )}
                        </div>

                        <div className="cover-preview-details">
                          <div className={`cover-preview-badge ${coverImgError ? "error" : ""}`}>
                            <span className="cover-preview-badge-dot"></span>
                            <span>{coverImgError ? "Preview Failed" : "Live Preview"}</span>
                          </div>

                          <span className="cover-preview-url-text" title={formCoverImageUrl.trim()}>
                            {formCoverImageUrl.trim()}
                          </span>

                          {coverImgError ? (
                            <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>
                              Check URL — ensure it links directly to an image (.jpg, .png, etc.)
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="cover-preview-action-btn"
                              onClick={() => {
                                setFormCoverImageUrl("");
                                setCoverImgError(false);
                              }}
                            >
                              ✕ Clear preview
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PDF / Drive Link */}
                  <div className="input-group beyond-form-full">
                    <label htmlFor="item-drive">Book PDF / Google Drive Download Link:</label>
                    <input
                      id="item-drive"
                      type="url"
                      placeholder="https://drive.google.com/... or direct PDF download link"
                      value={formDownloadUrl}
                      onChange={(e) => setFormDownloadUrl(e.target.value)}
                    />
                  </div>

                  {/* Text Description with HTML / Markdown Support */}
                  <div className="input-group beyond-form-full">
                    <label htmlFor="item-desc">
                      Text Description / Notes (supports Markdown &amp; HTML):
                    </label>
                    <textarea
                      id="item-desc"
                      rows={4}
                      placeholder="Add key takeaways, quotes, or thoughts. Supports **bold**, *italic*, `code`, [links](url), and HTML tags."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid rgba(0,0,0,0.15)",
                        fontFamily: "inherit",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>

                  {/* Display Order */}
                  <div className="input-group">
                    <label htmlFor="item-order">Display Order (0 = first):</label>
                    <input
                      id="item-order"
                      type="number"
                      value={formDisplayOrder}
                      onChange={(e) => setFormDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                  <button type="submit" disabled={savingItem}>
                    {savingItem
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Add to Beyond Dev"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="action-btn"
                      style={{ padding: "10px 18px" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List existing Beyond Dev items */}
            <div className="dashboard-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, border: "none", padding: 0 }}>
                  Curated Resources ({beyondItems.length})
                </h3>
                <a
                  href="/beyond-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn preview-btn"
                  style={{ textDecoration: "none", fontSize: "0.85rem" }}
                >
                  View Public Page ↗
                </a>
              </div>

              {beyondLoading ? (
                <p style={{ color: "#64748b", margin: "20px 0" }}>Loading resources...</p>
              ) : beyondItems.length === 0 ? (
                <p style={{ color: "#64748b", margin: "20px 0" }}>
                  No resources added yet. Fill out the form above to add your first book or PDF!
                </p>
              ) : (
                <div className="beyond-items-list">
                  {beyondItems.map((item) => (
                    <div key={item.id} className="beyond-admin-card">
                      {item.cover_image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="beyond-card-thumb"
                        />
                      ) : (
                        <div className="beyond-card-placeholder">📖</div>
                      )}

                      <div className="beyond-card-info">
                        <div className="beyond-card-header">
                          <span className="beyond-badge">{item.section}</span>
                          {item.subsection && (
                            <span
                              className="beyond-badge"
                              style={{
                                background: "rgba(16, 185, 129, 0.12)",
                                color: "#10b981",
                                border: "1px solid rgba(16, 185, 129, 0.25)",
                              }}
                            >
                              ↳ {item.subsection}
                            </span>
                          )}
                          {item.display_order > 0 && (
                            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                              Order: {item.display_order}
                            </span>
                          )}
                        </div>
                        <h4 className="beyond-card-title">{item.title}</h4>
                        {item.author && <p className="beyond-card-author">by {item.author}</p>}
                        {item.description && (
                          <p className="beyond-card-desc">{item.description}</p>
                        )}
                        {item.download_url && (
                          <div style={{ marginTop: "6px" }}>
                            <a
                              href={item.download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: "0.78rem",
                                color: "#6366f1",
                                textDecoration: "underline",
                              }}
                            >
                              Drive / PDF Link ↗
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="beyond-card-actions">
                        <button
                          type="button"
                          onClick={() => handleEditBeyondDevItem(item)}
                          className="action-btn copy-btn"
                          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBeyondDevItem(item.id, item.title)}
                          className="action-btn delete-btn"
                          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
