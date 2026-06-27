import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchFiles();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchFiles();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from("resumes").list();
    if (error) {
      console.error("Error fetching files:", error);
      return;
    }
    const uploadedRoles = data
      .map((f) => f.name)
      .filter((name) => name.endsWith("-resume.pdf"))
      .map((name) => name.replace("-resume.pdf", ""));
    setAvailableResumes(uploadedRoles);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage("");

    const fileName = `${selectedRole}-resume.pdf`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      setMessage(`Error uploading: ${error.message}`);
    } else {
      setMessage(`Successfully uploaded ${fileName}`);
      setFile(null);
      fetchFiles(); // Refresh the list
    }
    setUploading(false);
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
        <Link to="/" className="back-link">← Back Home</Link>
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
        <Link to="/" className="back-link">← Back Home</Link>
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
