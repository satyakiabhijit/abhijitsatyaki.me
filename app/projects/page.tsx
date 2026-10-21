import { GridWrapper } from "@/app/components/GridWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Abhijit Satyaki",
  description: "A collection of my favorite works - from browser extensions and ATS analyzers to full-stack platforms and IoMT systems.",
};

interface FeaturedProject {
  title: string;
  tagline: string;
  description: string;
  image: string;
  url: string;
  github?: string;
  technologies: string[];
}

const featuredProjects: FeaturedProject[] = [
  {
    title: "Resumelyze",
    tagline: "Serverless ATS Resume Analyzer & Optimization Platform",
    description:
      "A serverless ATS resume analyzer featuring TF-IDF keyword extraction, Google Gemini AI deep parsing, and hybrid scoring modes for PDF, DOCX, and TXT resumes. Optimized serverless architecture to reduce cold start latency from 5s down to sub-1s.",
    image: "/projects/resumelyze.png",
    url: "https://resumelyze-eta.vercel.app/",
    github: "https://github.com/satyakiabhijit/resumelyze",
    technologies: ["Next.js 14", "TypeScript", "Gemini AI", "Supabase", "TF-IDF"],
  },
  {
    title: "Kairo",
    tagline: "Cross-Browser AI Chat Memory & Capsule Manager",
    description:
      "A cross-browser extension built on Manifest V3 that captures AI conversational context and saves key insights as reusable 'Capsules' across multiple LLM interfaces using content scripts, service workers, and structured chrome.storage.",
    image: "/projects/kairo.png",
    url: "https://github.com/satyakiabhijit/Kairo",
    github: "https://github.com/satyakiabhijit/Kairo",
    technologies: ["JavaScript", "Chrome Extensions (MV3)", "Service Workers", "LLM Context"],
  },
  {
    title: "BookOnGo",
    tagline: "Full-Stack Booking & Reservation Platform",
    description:
      "An end-to-end booking platform built with the MERN stack featuring secure JWT authentication, Stripe payment processing, real-time availability scheduling, and an interactive administrative analytics dashboard.",
    image: "/projects/bookongo.png",
    url: "https://bookongo.dev",
    github: "https://github.com/satyakiabhijit/bookongo",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "Stripe", "JWT"],
  },
  {
    title: "GameKroy",
    tagline: "Modern Online Gaming Marketplace & Community",
    description:
      "A high-performance gaming marketplace application featuring rich catalog exploration, user reviews, instant digital deliveries, and a responsive glassmorphic user interface.",
    image: "/projects/gamekroy.png",
    url: "https://github.com/satyakiabhijit/gamekroy",
    github: "https://github.com/satyakiabhijit/gamekroy",
    technologies: ["React", "Tailwind CSS", "Node.js", "Express", "REST API"],
  },
  {
    title: "RedX Chess",
    tagline: "Interactive Web Chess with Real-Time Validation",
    description:
      "A browser-based chess game featuring complete move validation, board state history, move timers, and AI opponent heuristics built for fluid desktop and mobile play.",
    image: "/projects/redxchess.png",
    url: "https://github.com/satyakiabhijit/redxchess",
    github: "https://github.com/satyakiabhijit/redxchess",
    technologies: ["React", "TypeScript", "Chess.js", "Framer Motion"],
  },
];

interface OtherProject {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  github: string;
  demo?: string;
}

const otherProjects: OtherProject[] = [
  {
    title: "HekTools",
    description: "All-in-one developer utility toolbox containing cryptographic helpers, encoding/decoding converters, formatters, and network debuggers.",
    category: "Developer Tools",
    technologies: ["TypeScript", "Next.js", "Crypto-JS"],
    github: "https://github.com/satyakiabhijit/hektools",
  },
  {
    title: "Sound Wave",
    description: "Music streaming web application featuring dynamic Web Audio API visualizations, custom playlists, and background playback.",
    category: "Web Audio",
    technologies: ["JavaScript", "Web Audio API", "HTML5 Canvas"],
    github: "https://github.com/satyakiabhijit/Sound_Wave",
    demo: "https://sound-wave-iota.vercel.app",
  },
  {
    title: "Phishing Detection",
    description: "Machine learning solution for detecting malicious phishing websites with 97%+ classification accuracy using Scikit-Learn and Flask.",
    category: "AI / Cybersecurity",
    technologies: ["Python", "TensorFlow", "Scikit-learn", "Flask"],
    github: "https://github.com/satyakiabhijit/Phishing-Website-Detection",
  },
  {
    title: "HyperMathix",
    description: "Gamified educational math learning portal with interactive exercises and real-time score tracking for young students.",
    category: "Education",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    github: "https://github.com/satyakiabhijit/HyperMathix",
    demo: "https://satyakiabhijit.github.io/HyperMathix/",
  },
];

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-primary/40 bg-neutral-900/5 shadow-2xl transition hover:shadow-indigo-500/10">
      <img
        src={src}
        alt={alt}
        className="w-full object-cover transition duration-500 hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
  );
}

export default function ProjectPage() {
  return (
    <div className="relative space-y-20 pb-20">
      <GridWrapper>
        <h1 className="mx-auto mt-16 max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
          A collection of my favorite works.
        </h1>
      </GridWrapper>

      <GridWrapper>
        <p className="mx-auto max-w-xl text-center leading-8 text-text-secondary">
          From browser extensions and AI analyzers to full-stack platforms and research prototypes. All engineered with care.
        </p>
      </GridWrapper>

      {/* Featured Projects with Screenshots */}
      <GridWrapper className="space-y-16">
        {featuredProjects.map((project) => (
          <div key={project.title} className="space-y-6">
            <GridWrapper className="px-4 md:px-10">
              <ProjectImage src={project.image} alt={project.title} />
            </GridWrapper>
            <GridWrapper className="px-4 md:px-10">
              <div className="max-w-2xl text-balance">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  {project.tagline}
                </span>
                <h2 className="mb-2 mt-1 text-2xl font-medium leading-tight tracking-tight text-text-primary md:text-3xl">
                  {project.title}
                </h2>
                <p className="mb-4 text-base leading-7 text-text-secondary">
                  {project.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-border-primary bg-bg-secondary/40 px-2.5 py-0.5 text-xs text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <a
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:underline"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit {project.title}
                    <svg
                      className="relative ml-2.5 mt-px overflow-visible"
                      width="3"
                      height="6"
                      viewBox="0 0 3 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M0 0L3 3L0 6"></path>
                    </svg>
                  </a>
                  {project.github && (
                    <a
                      className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary hover:underline"
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source Code ↗
                    </a>
                  )}
                </div>
              </div>
            </GridWrapper>
          </div>
        ))}
      </GridWrapper>

      {/* More Projects Section */}
      <GridWrapper className="pt-10">
        <h2 className="mb-4 text-center text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
          More Projects & Experiments
        </h2>
        <p className="mb-10 text-center text-sm text-text-secondary">
          Additional utilities, games, and machine learning prototypes.
        </p>

        <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:px-10">
          {otherProjects.map((project) => (
            <div
              key={project.title}
              className="rounded-2xl border border-border-primary/50 bg-bg-primary p-6 transition hover:border-border-primary"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {project.category}
                </span>
                <div className="flex gap-3">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-text-secondary hover:text-text-primary"
                    >
                      Demo ↗
                    </a>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-secondary hover:text-text-primary"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold tracking-tight text-text-primary">
                {project.title}
              </h3>
              <p className="mb-4 text-sm leading-6 text-text-secondary">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border-primary px-2 py-0.5 text-xs text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GridWrapper>
    </div>
  );
}