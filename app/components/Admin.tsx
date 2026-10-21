"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const ROLES = ["frontend", "backend", "fullstack", "software-dev"];

export default function Admin() {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">(
    "info",
  );
  const [availableResumes, setAvailableResumes] = useState<string[]>([]);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const [defaultRole, setDefaultRole] = useState<string | null>(null);

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
        const def = data.resumes.find(
          (r: { is_default: boolean }) => r.is_default,
        );
        setDefaultRole(def ? def.role : null);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
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
        } else {
          localStorage.removeItem("admin_token");
        }
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
      });
  }, [fetchFiles]);

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

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setSession(null);
    setAvailableResumes([]);
    setDefaultRole(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.type !== "application/pdf") {
      notify("Only PDF files are allowed", "error");
      return;
    }

    setUploading(true);
    setMessage("");

    const token = localStorage.getItem("admin_token");
    if (!token) {
      notify("You must be logged in to upload", "error");
      setUploading(false);
      return;
    }

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/admin/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: selectedRole,
          filename: `${selectedRole}-resume.pdf`,
          mime_type: file.type || "application/pdf",
          data_base64: base64Data,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        notify(`Error uploading: ${data.error || "Failed"}`, "error");
      } else {
        notify(
          `Uploaded ${selectedRole.toUpperCase()} resume — any previous one for that role was replaced`,
          "success",
        );
        setFile(null);
        fetchFiles();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      notify(`Error uploading: ${message}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = async (role: string) => {
    if (!role) return;
    try {
      const res = await fetch("/api/admin/resumes/default", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) {
        notify(`Error: ${data.error || "Failed"}`, "error");
        return;
      }
      setDefaultRole(role);
      notify(`${role.toUpperCase()} is now the default resume`, "success");
      fetchFiles();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      notify(`Error setting default: ${message}`, "error");
    }
  };

  const handleDelete = async (role: string) => {
    if (!confirm(`Delete the ${role.toUpperCase()} resume?`)) return;

    try {
      const res = await fetch("/api/admin/resumes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        notify(`Error deleting: ${data.error || "Failed"}`, "error");
        return;
      }
      if (defaultRole === role) setDefaultRole(null);
      notify(`${role.toUpperCase()} resume deleted`, "success");
      fetchFiles();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      notify(`Error: ${message}`, "error");
    }
  };

  const handleCopy = (role: string) => {
    const url = `${window.location.origin}/resume/${role}`;
    navigator.clipboard.writeText(url);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  if (!session) {
    return (
      <div className="admin-container">
        <Link href="/" className="back-link">
          ← Back Home
        </Link>
        <form onSubmit={handleLogin} className="admin-form">
          <h2>Admin Login</h2>
          {message && (
            <p className={messageType === "error" ? "error" : "status-message"}>
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

      <div className="admin-dashboard">
        <div className="dashboard-section upload-section">
          <h3>Upload Resume</h3>
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
      </div>
    </div>
  );
}
