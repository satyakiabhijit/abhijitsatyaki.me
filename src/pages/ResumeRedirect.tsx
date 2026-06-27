import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabase";

const ROLES = ["frontend", "backend", "fullstack", "devops", "aiml"];

const ResumeRedirect = () => {
  const { role } = useParams<{ role: string }>();
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Make sure body doesn't overflow since iframe takes 100% height
    document.body.style.overflow = "hidden";

    if (!role || !ROLES.includes(role)) {
      setError("Invalid resume role.");
      return;
    }

    const fileName = `${role}-resume.pdf`;
    
    // Get the public URL for the file
    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    if (data && data.publicUrl) {
      // Append a timestamp to bypass browser caching of the redirect
      setPdfUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
    } else {
      setError("Resume not found.");
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [role]);

  if (error) {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        color: "white", 
        backgroundColor: "#0b080c",
        fontFamily: "sans-serif"
      }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (pdfUrl) {
    return (
      <div style={{ width: "100vw", height: "100vh", backgroundColor: "#333" }}>
        <iframe 
          src={pdfUrl} 
          style={{ width: "100%", height: "100%", border: "none" }}
          title={`${role} Resume`}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      color: "white", 
      backgroundColor: "#0b080c",
      fontFamily: "sans-serif"
    }}>
      <h2>Loading resume...</h2>
    </div>
  );
};

export default ResumeRedirect;
