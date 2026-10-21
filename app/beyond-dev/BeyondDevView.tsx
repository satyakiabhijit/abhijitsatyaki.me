"use client";

import { useState, useMemo } from "react";
import type { BeyondDevItem } from "@/app/lib/db/admin";

interface Props {
  items: BeyondDevItem[];
}

function renderFormattedDescription(text: string) {
  if (!text) return null;

  // Split into paragraphs by double newlines
  const paragraphs = text.split(/\n\s*\n/);

  return (
    <div className="space-y-2 text-sm leading-relaxed text-text-secondary">
      {paragraphs.map((p, idx) => {
        // Simple inline markdown parsing for **bold**, *italic*, `code`, and [links](url)
        const parts = p.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\)|<.*?>)/g);

        return (
          <p key={idx} className="break-words">
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-semibold text-text-primary">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("*") && part.endsWith("*")) {
                return (
                  <em key={pIdx} className="italic text-text-primary">
                    {part.slice(1, -1)}
                  </em>
                );
              }
              if (part.startsWith("`") && part.endsWith("`")) {
                return (
                  <code
                    key={pIdx}
                    className="rounded bg-indigo-500/10 px-1 py-0.5 font-mono text-xs text-indigo-300"
                  >
                    {part.slice(1, -1)}
                  </code>
                );
              }
              const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
              if (linkMatch) {
                return (
                  <a
                    key={pIdx}
                    href={linkMatch[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 underline decoration-indigo-400/50 underline-offset-2 hover:text-indigo-300 hover:decoration-indigo-300"
                  >
                    {linkMatch[1]}
                  </a>
                );
              }

              // Direct HTML tag pass-through or plain text
              if (part.startsWith("<") && part.endsWith(">")) {
                return <span key={pIdx} dangerouslySetInnerHTML={{ __html: part }} />;
              }

              return <span key={pIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export function BeyondDevView({ items }: Props) {
  const [selectedSection, setSelectedSection] = useState<string>("All");

  // Collect unique sections in order of appearance
  const sections = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.section && item.section.trim()) {
        set.add(item.section.trim());
      }
    });
    return ["All", ...Array.from(set)];
  }, [items]);

  // Filter items based on active tab
  const filteredItems = useMemo(() => {
    if (selectedSection === "All") return items;
    return items.filter((item) => item.section === selectedSection);
  }, [items, selectedSection]);

  // Group items section-wise if "All" is selected
  const groupedSections = useMemo(() => {
    if (selectedSection !== "All") {
      return [{ name: selectedSection, items: filteredItems }];
    }
    const map = new Map<string, BeyondDevItem[]>();
    items.forEach((item) => {
      const sec = item.section || "General";
      if (!map.has(sec)) map.set(sec, []);
      map.get(sec)!.push(item);
    });
    return Array.from(map.entries()).map(([name, secItems]) => ({
      name,
      items: secItems,
    }));
  }, [items, selectedSection, filteredItems]);

  return (
    <div className="space-y-12">
      {/* Section Filter Tabs */}
      {sections.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {sections.map((section) => {
            const isActive = selectedSection === section;
            return (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "border border-border-primary/60 bg-bg-secondary/40 text-text-secondary hover:border-indigo-400 hover:text-text-primary"
                }`}
              >
                {section}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border-primary/60 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text-primary">
            Curating reading list &amp; resources
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            Favorite books, reading notes, and research materials are currently
            being compiled. Check back soon!
          </p>
        </div>
      )}

      {/* Section-wise Grid Display */}
      {groupedSections.map((group) => {
        if (group.items.length === 0) return null;

        return (
          <div key={group.name} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border-primary/50 pb-3">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
              <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                {group.name}
              </h2>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                {group.items.length} {group.items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-primary/60 bg-gradient-to-b from-bg-secondary/40 to-bg-primary p-5 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
                  >
                    <div>
                      {/* Photo / Cover Preview */}
                      {item.cover_image_url ? (
                        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border-primary/50 bg-black/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.cover_image_url}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="relative mb-4 flex aspect-[4/3] w-full flex-col items-center justify-center rounded-xl border border-dashed border-indigo-500/20 bg-indigo-950/20 p-4 text-center">
                          <svg
                            className="h-10 w-10 text-indigo-400/60 transition-transform duration-300 group-hover:scale-110"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                            />
                          </svg>
                          <span className="mt-2 text-xs font-medium text-indigo-300/80">
                            {item.section}
                          </span>
                        </div>
                      )}

                      {/* Header details */}
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-400">
                          {item.section}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-text-primary group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h3>

                      {item.author && (
                        <p className="mt-0.5 text-xs font-medium text-text-secondary">
                          by {item.author}
                        </p>
                      )}

                      {/* Description with HTML/Markdown formatting */}
                      {item.description && (
                        <div className="mt-3.5 border-t border-border-primary/40 pt-3">
                          {renderFormattedDescription(item.description)}
                        </div>
                      )}
                    </div>

                    {/* Download / Drive Link */}
                    {item.download_url && (
                      <div className="mt-5 border-t border-border-primary/40 pt-4">
                        <a
                          href={item.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600/90 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98]"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                          <span>Download / View PDF (Drive)</span>
                          <svg
                            className="h-3 w-3 opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
