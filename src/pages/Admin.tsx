import { useState, useEffect } from "react";

import "./Admin.css";

const ROLES = ["frontend", "backend", "fullstack", "devops", "aiml"];

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [availableResumes, setAvailableResumes] = useState<string[]>([]);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflowY = "auto";

    const token = localStorage.getItem("admin_token");
    if (token) {
      fetch("/api/auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setSession({ user: data.user });
            fetchFiles();
          } else {
            localStorage.removeItem("admin_token");
          }
        })
        .catch(() => {
          localStorage.removeItem("admin_token");
        });
    }
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/resumes");
      const data = await res.json();
      if (data.availableRoles) {
        setAvailableResumes(data.availableRoles);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
      } else {
        localStorage.setItem("admin_token", data.token);
        setSession({ user: data.user });
        fetchFiles();
      }
    } catch (err: any) {
      setMessage(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("admin_token");
    setSession(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage("");

    const token = localStorage.getItem("admin_token");
    if (!token) {
      setMessage("You must be logged in to upload.");
      setUploading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(",")[1];
          const fileName = `${selectedRole}-resume.pdf`;

          const res = await fetch("/api/resumes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              role: selectedRole,
              filename: fileName,
              mime_type: file.type || "application/pdf",
              data_base64: base64Data,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            setMessage(`Error uploading: ${data.error || "Failed"}`);
          } else {
            setMessage(`Successfully uploaded ${fileName}`);
            setFile(null);
            fetchFiles(); // Refresh the list
          }
        } catch (uploadErr: any) {
          setMessage(`Error uploading: ${uploadErr.message}`);
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setMessage("Error reading file.");
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
      setUploading(false);
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
        <a href="/" className="back-link">← Back Home</a>
        <form onSubmit={handleLogin} className="admin-form">
          <h2>Admin Login</h2>
          {message && <p className="error">{message}</p>}
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
        <a href="/" className="back-link">← Back Home</a>
        <div className="user-info">
          <span>{session.user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="admin-dashboard">
        <div className="dashboard-section upload-section">
          <h3>Upload Resume</h3>
          {message && <p className="status-message">{message}</p>}
          
          <form onSubmit={handleUpload} className="admin-form full-width">
            <div className="input-group">
              <label>Select Role:</label>
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>{role.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>PDF File:</label>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required 
              />
            </div>

            <button type="submit" disabled={uploading || !file}>
              {uploading ? "Uploading..." : "Upload / Replace"}
            </button>
          </form>
        </div>

        <div className="dashboard-section links-section">
          <h3>Manage Links</h3>
          <div className="links-grid">
            {ROLES.map(role => {
              const isAvailable = availableResumes.includes(role);
              const link = `${window.location.origin}/resume/${role}`;
              
              return (
                <div key={role} className={`link-card ${isAvailable ? 'available' : 'missing'}`}>
                  <div className="link-card-header">
                    <h4>{role.toUpperCase()}</h4>
                    <span className={`status-badge ${isAvailable ? 'success' : 'error'}`}>
                      {isAvailable ? 'Available' : 'Missing'}
                    </span>
                  </div>
                  <p className="link-url">{link}</p>
                  
                  <div className="link-actions">
                    <button 
                      onClick={() => handleCopy(role)} 
                      className="action-btn copy-btn"
                    >
                      {copiedRole === role ? 'Copied!' : 'Copy Link'}
                    </button>
                    <a 
                      href={`/resume/${role}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className={`action-btn preview-btn ${!isAvailable ? 'disabled' : ''}`}
                    >
                      Preview
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
