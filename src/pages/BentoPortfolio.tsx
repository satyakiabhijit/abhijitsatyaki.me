import "./BentoPortfolio.css";
import { config } from "../config";

// ── SVG Icons ──
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 7.75A3 3 0 017.75 4.75h8.5a3 3 0 013 3v8.5a3 3 0 01-3 3h-8.5a3 3 0 01-3-3v-8.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.75 16.25v-2.25A2.25 2.25 0 0113 11.75a2.25 2.25 0 012.25 2.25v2.25M10.75 11.75v4.5M7.75 11.75v4.5M7.75 8.75v.5" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 15.25V6.75H8.75M17 7L6.75 17.25" />
  </svg>
);




const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const projectEmojis: Record<string, string> = {
  "Browser Extension": "🧩",
  "AI / Full Stack": "🤖",
  "Full Stack": "⚡",
  "Web App": "🌐",
  "AI / ML": "🔬",
  Education: "🎓",
};

function getVenueClass(venue: string): string {
  if (venue.toLowerCase().includes("ieee")) return "ieee";
  if (venue.toLowerCase().includes("crc") || venue.toLowerCase().includes("taylor")) return "crc";
  return "submitted";
}

const BentoPortfolio = () => {
  const { about, experiences, education, publications, projects, contact, skills } = config;

  return (
    <div className="bento-root">
      {/* ── Navigation ── */}
      <nav className="bento-nav">
        <a href="/" className="bento-nav-logo">
          <span className="bento-nav-logo-dot" />
          Abhijit Satyaki
        </a>

        <ul className="bento-nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#research">Research</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="bento-nav-socials">
          <a href={contact.github} target="_blank" rel="noreferrer" className="nav-social-btn" aria-label="GitHub">
            <GithubIcon />
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="nav-social-btn" aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <a href={`mailto:${contact.email}`} className="nav-social-btn" aria-label="Email">
            <EmailIcon />
          </a>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="bento-main">

        {/* ═══ ROW 1: Hero + Status ═══ */}
        <div className="bento-grid" id="about">

          {/* Hero Card */}
          <div className="bento-card card-hero">
            <div className="hero-top">
              <div className="hero-avatar">AS</div>
              <div className="hero-badge">
                <div className="hero-name">{developer.fullName}</div>
                <div className="hero-title">{developer.title} · Jalpaiguri, India 🇮🇳</div>
              </div>
            </div>

            <h1 className="hero-headline">
              Building things for the{" "}
              <span className="highlight">web & beyond</span>
            </h1>

            <p className="hero-desc">
              {about.description}
            </p>

            <div className="hero-ctas">
              <a href="#contact" className="btn-primary">
                <EmailIcon /> Get in touch
              </a>
              <a href="/resume/fullstack" target="_blank" rel="noreferrer" className="btn-secondary">
                ↗ View Resume
              </a>
              <a href="#projects" className="btn-secondary">
                <CodeIcon /> View Projects
              </a>
            </div>
          </div>

          {/* Status Card */}
          <div className="bento-card card-status">
            <div>
              <div className="status-indicator">
                <span className="status-dot" />
                <span className="status-text">Available for opportunities</span>
              </div>

              <p className="status-quote">
                Turning ideas into<br />elegant code.
              </p>

              <p className="status-sub">
                Full-stack developer with a passion for clean architecture, research-grade projects, and shipping products that matter.
              </p>
            </div>

            <div className="status-stats">
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5</div>
                <div className="stat-label">Internships</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3+</div>
                <div className="stat-label">Publications</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ ROW 2: Tech Stack ═══ */}
        <div className="bento-grid">
          <div className="bento-card card-stack">
            <div className="section-label">Stack</div>
            <p className="stack-title">{skills.develop.title}</p>
            <p className="stack-sub">{skills.develop.description}</p>
            <div className="tags-wrap">
              {skills.develop.tools.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="bento-card card-stack-full">
            <div className="section-label">Tools & Design</div>
            <p className="stack-title">{skills.design.title}</p>
            <p className="stack-sub">{skills.design.description}</p>
            <div className="tags-wrap">
              {skills.design.tools.map((t) => (
                <span key={t} className="tag accent">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ ROW 3: Projects ═══ */}
        <div className="section-break" id="projects">
          <div className="section-break-line" />
          <span className="section-break-label">Projects</span>
          <div className="section-break-line" />
        </div>

        <div className="bento-grid">
          <div className="bento-card card-projects">
            <div className="section-label">Work</div>
            <p className="card-h2">Featured Projects</p>
            <p className="card-sub">A selection of things I've built. More on{" "}
              <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>GitHub</a>.
            </p>

            <div className="projects-grid">
              {projects.slice(0, 4).map((proj) => (
                <a
                  key={proj.id}
                  href={proj.demo || proj.github}
                  target="_blank"
                  rel="noreferrer"
                  className="project-item"
                >
                  <div className="project-item-header">
                    <div>
                      <div className="project-cat">{proj.category}</div>
                      <div className="project-title">{proj.title}</div>
                    </div>
                    <div className="project-icon">
                      {projectEmojis[proj.category] || "🚀"}
                    </div>
                  </div>
                  <p className="project-desc">{proj.description}</p>
                  <div className="project-tech">
                    {proj.technologies.split(", ").slice(0, 3).map((t) => (
                      <span key={t} className="project-tech-tag">{t}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={proj.github} target="_blank" rel="noreferrer" className="project-link" onClick={e => e.stopPropagation()}>
                      <GithubIcon /> GitHub
                    </a>
                    {proj.demo && (
                      <a href={proj.demo} target="_blank" rel="noreferrer" className="project-link" onClick={e => e.stopPropagation()}>
                        <ExternalLinkIcon /> Demo
                      </a>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Side Projects */}
          <div className="bento-card" style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="section-label">More</div>
            <p className="card-h">Other Projects</p>
            {projects.slice(4).map((proj) => (
              <a
                key={proj.id}
                href={proj.demo || proj.github}
                target="_blank"
                rel="noreferrer"
                className="project-item"
                style={{ flex: "0 0 auto" }}
              >
                <div className="project-item-header">
                  <div>
                    <div className="project-cat">{proj.category}</div>
                    <div className="project-title">{proj.title}</div>
                  </div>
                  <span style={{ fontSize: "18px" }}>{projectEmojis[proj.category] || "🚀"}</span>
                </div>
                <p className="project-desc" style={{ fontSize: "11.5px" }}>{proj.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* ═══ ROW 4: Experience + Education ═══ */}
        <div className="section-break" id="experience">
          <div className="section-break-line" />
          <span className="section-break-label">Experience & Education</span>
          <div className="section-break-line" />
        </div>

        <div className="bento-grid">
          <div className="bento-card card-exp">
            <div className="section-label">Career</div>
            <p className="card-h2">Work Experience</p>
            <div className="exp-list">
              {experiences.map((exp, i) => (
                <div key={i} className="exp-item">
                  <div className="exp-timeline">
                    <div className="exp-dot" />
                    <div className="exp-line" />
                  </div>
                  <div className="exp-content">
                    <div className="exp-header">
                      <div className="exp-position">{exp.position}</div>
                      <div className="exp-period">{exp.period}</div>
                    </div>
                    <div className="exp-company">{exp.company} · {exp.location}</div>
                    <p className="exp-desc">{exp.description}</p>
                    <div className="tags-wrap" style={{ marginTop: "8px" }}>
                      {exp.technologies.slice(0, 4).map((t) => (
                        <span key={t} className="tag" style={{ fontSize: "10px", padding: "2px 7px" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card card-edu">
            <div className="section-label">Education</div>
            <p className="card-h2">Academic</p>
            <div style={{ marginTop: "16px" }}>
              {education.map((edu, i) => (
                <div key={i} className="edu-item">
                  <div className="edu-degree">{edu.title}</div>
                  <div className="edu-inst">{edu.institution}</div>
                  <div className="edu-meta">{edu.period} · {edu.location}</div>
                  <p className="exp-desc" style={{ marginTop: "6px" }}>{edu.description}</p>
                </div>
              ))}
            </div>

            {/* Location blob */}
            <div style={{ marginTop: "auto", paddingTop: "20px" }}>
              <div className="location-icon">📍</div>
              <div className="location-city">Jalpaiguri</div>
              <div className="location-country">West Bengal, India</div>
            </div>
          </div>
        </div>

        {/* ═══ ROW 5: Publications ═══ */}
        <div className="section-break" id="research">
          <div className="section-break-line" />
          <span className="section-break-label">Research & Publications</span>
          <div className="section-break-line" />
        </div>

        <div className="bento-grid">
          <div className="bento-card card-pubs">
            <div className="section-label">Research</div>
            <p className="card-h2" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <BookIcon /> Publications
            </p>
            <p className="card-sub">Peer-reviewed research in IoMT, antenna design, and AI/ML. IEEE + SCOPUS indexed.</p>
            <div className="pub-list">
              {publications.map((pub) => {
                const venueClass = getVenueClass(pub.venue);
                return (
                  <a
                    key={pub.id}
                    href={pub.link || "#"}
                    target={pub.link ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="pub-item"
                    style={!pub.link ? { cursor: "default" } : {}}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <span className={`pub-venue ${venueClass}`}>{pub.venue}</span>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: "4px",
                        background: pub.status === "Published" ? "rgba(34,197,94,0.12)" : "rgba(251,191,36,0.1)",
                        color: pub.status === "Published" ? "#4ade80" : "#fbbf24",
                        border: `1px solid ${pub.status === "Published" ? "rgba(34,197,94,0.2)" : "rgba(251,191,36,0.2)"}`,
                      }}>
                        {pub.status}
                      </span>
                    </div>
                    <div className="pub-title">{pub.title}</div>
                    <p className="pub-desc">{pub.description}</p>
                    <div className="pub-tags">
                      {pub.tags?.slice(0, 4).map((t) => (
                        <span key={t} className="pub-tag">{t}</span>
                      ))}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ ROW 6: Contact + Socials + Location ═══ */}
        <div className="section-break" id="contact">
          <div className="section-break-line" />
          <span className="section-break-label">Contact</span>
          <div className="section-break-line" />
        </div>

        <div className="bento-grid">
          <div className="bento-card card-contact">
            <div>
              <div className="section-label">Let's Talk</div>
              <h2 className="contact-heading">
                Want to build<br />something together?
              </h2>
              <p className="contact-sub">
                I'm always open to discussing new projects, creative ideas, or opportunities to collaborate. Don't hesitate to reach out!
              </p>
            </div>
            <a href={`mailto:${contact.email}`} className="contact-email-btn">
              <EmailIcon /> {contact.email}
            </a>
          </div>

          <div className="bento-card card-socials">
            <div className="section-label">Social</div>
            <p className="card-h" style={{ marginBottom: "14px" }}>Find me online</p>
            <div className="social-grid">
              <a href={contact.github} target="_blank" rel="noreferrer" className="social-item">
                <div className="social-icon" style={{ color: "#e2e8f0" }}>
                  <GithubIcon />
                </div>
                <div>
                  <div className="social-label">GitHub</div>
                  <div className="social-handle">@satyakiabhijit</div>
                </div>
              </a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="social-item">
                <div className="social-icon" style={{ color: "#60a5fa" }}>
                  <LinkedinIcon />
                </div>
                <div>
                  <div className="social-label">LinkedIn</div>
                  <div className="social-handle">abhijitsatyaki</div>
                </div>
              </a>
              <a href={contact.instagram} target="_blank" rel="noreferrer" className="social-item">
                <div className="social-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 16, height: 16, color: "#f472b6" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </div>
                <div>
                  <div className="social-label">Instagram</div>
                  <div className="social-handle">@satyaki_abhijit</div>
                </div>
              </a>
              <a href={contact.facebook} target="_blank" rel="noreferrer" className="social-item">
                <div className="social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, color: "#60a5fa" }}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <div className="social-label">Facebook</div>
                  <div className="social-handle">satyakiabhijit.29</div>
                </div>
              </a>
            </div>
          </div>

          <div className="bento-card card-location" style={{ gridColumn: "span 3" }}>
            <div>
              <div className="section-label">Location</div>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🇮🇳</div>
              <div className="location-city">Jalpaiguri</div>
              <div className="location-country">West Bengal, India</div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Currently studying at</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                Jalpaiguri Govt. Engineering College
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>B.Tech IT · 2023–2026</div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bento-footer">
        <p>
          Designed & built by{" "}
          <a href={contact.github} target="_blank" rel="noreferrer">
            Abhijit Satyaki
          </a>{" "}
          · Inspired by{" "}
          <a href="https://braydoncoyer.dev" target="_blank" rel="noreferrer">
            Braydon Coyer
          </a>
        </p>
      </footer>
    </div>
  );
};

export default BentoPortfolio;
