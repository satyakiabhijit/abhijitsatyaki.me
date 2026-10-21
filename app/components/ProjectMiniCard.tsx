import React from "react";
import clsx from "clsx";

export interface ProjectMiniCardProps {
  title: string;
  category: string;
  summary: string;
  image: string;
  link: string;
  github?: string;
  technologies: string[];
  className?: string;
}

export function ProjectMiniCard({
  title,
  category,
  summary,
  image,
  link,
  technologies,
  className,
}: ProjectMiniCardProps) {
  return (
    <div
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-primary bg-bg-primary p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-full border border-border-primary/50 bg-bg-primary/95 px-3 py-1 text-[11px] font-semibold text-indigo-600 shadow-sm backdrop-blur-md">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold tracking-tight text-text-primary transition-colors group-hover:text-indigo-600">
              {title}
            </h3>
            <svg
              className="h-4 w-4 text-text-secondary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </div>
          <p className="line-clamp-2 text-xs leading-5 text-text-secondary">
            {summary}
          </p>
        </div>

        {/* Tech tags */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border-primary/40 pt-2.5">
          {technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border-primary/50 bg-bg-secondary/30 px-2 py-0.5 text-[10px] text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Clickable Overlay Link */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">View {title}</span>
      </a>
    </div>
  );
}