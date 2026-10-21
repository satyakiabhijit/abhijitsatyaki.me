"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formCoverImageUrl, setFormCoverImageUrl] = useState("");
  const [formDownloadUrl, setFormDownloadUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(0);
  const [savingItem, setSavingItem] = useState(false);

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
    setFormTitle("");
    setFormAuthor("");
    setFormCoverImageUrl("");
    setFormDownloadUrl("");
    setFormDescription("");
    setFormDisplayOrder(0);
  };

  const handleEditBeyondDevItem = (item: BeyondDevItem) => {
    setEditingId(item.id);
    if (PRESET_SECTIONS.includes(item.section)) {
      setFormSection(item.section);
      setCustomSection("");
    } else {
      setFormSection("__custom__");
      setCustomSection(item.section);
    }
    setFormTitle(item.title);
    setFormAuthor(item.author || "");
    setFormCoverImageUrl(item.cover_image_url || "");
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

    try {
      const payload = {
        section: finalSection,
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
      <div className="admin-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Admin Login</h2>
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
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
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
                  {/* Section Selector */}
                  <div className="input-group">
                    <label htmlFor="section-select">Section / Category:</label>
                    <select
                      id="section-select"
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value)}
                    >
                      {PRESET_SECTIONS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                      <option value="__custom__">+ Create Custom Section...</option>
                    </select>
                  </div>

                  {/* Custom section input if selected */}
                  {formSection === "__custom__" && (
                    <div className="input-group">
                      <label htmlFor="custom-sec-name">Custom Section Name:</label>
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

                  {/* Photo Preview Link */}
                  <div className="input-group">
                    <label htmlFor="item-cover">Photo Preview / Cover URL:</label>
                    <input
                      id="item-cover"
                      type="url"
                      placeholder="https://... image link or book cover"
                      value={formCoverImageUrl}
                      onChange={(e) => setFormCoverImageUrl(e.target.value)}
                    />
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
