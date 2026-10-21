"use client";

import { useState, useMemo, useEffect } from "react";
import type { BeyondDevItem } from "@/app/lib/db/admin";

interface Props {
  items: BeyondDevItem[];
}

export function renderFormattedDescription(text: string) {
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

interface SubsectionGroup {
  name: string;
  items: BeyondDevItem[];
}

interface SectionGroup {
  name: string;
  totalCount: number;
  subsections: SubsectionGroup[];
}

export function BeyondDevView({ items }: Props) {
  const [selectedSection, setSelectedSection] = useState<string>("All");
  const [activeModalItem, setActiveModalItem] = useState<BeyondDevItem | null>(null);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalItem(null);
      }
    };

    if (activeModalItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalItem]);

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

  // Group items hierarchically: Section -> Subsections -> Cards
  const groupedSections: SectionGroup[] = useMemo(() => {
    const targetItems =
      selectedSection === "All"
        ? items
        : items.filter((item) => item.section === selectedSection);

    const sectionMap = new Map<string, BeyondDevItem[]>();
    targetItems.forEach((item) => {
      const sec = item.section || "General";
      if (!sectionMap.has(sec)) sectionMap.set(sec, []);
      sectionMap.get(sec)!.push(item);
    });

    return Array.from(sectionMap.entries()).map(([sectionName, secItems]) => {
      const subMap = new Map<string, BeyondDevItem[]>();
      secItems.forEach((item) => {
        const sub = item.subsection?.trim() || "";
        if (!subMap.has(sub)) subMap.set(sub, []);
        subMap.get(sub)!.push(item);
      });

      // Sort: named subsections first, general/empty at the end
      const subsections: SubsectionGroup[] = Array.from(subMap.entries())
        .map(([name, subItems]) => ({ name, items: subItems }))
        .sort((a, b) => {
          if (!a.name) return 1;
          if (!b.name) return -1;
          return a.name.localeCompare(b.name);
        });

      return {
        name: sectionName,
        totalCount: secItems.length,
        subsections,
      };
    });
  }, [items, selectedSection]);

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

      {/* Section-wise and Subsection-wise Grid Display */}
      {groupedSections.map((group) => {
        if (group.totalCount === 0) return null;

        const hasSubsections = group.subsections.some((s) => s.name.length > 0);

        return (
          <div key={group.name} className="space-y-8">
            {/* Main Section Header */}
            <div className="flex items-center gap-3 border-b border-border-primary/50 pb-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></span>
              <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                {group.name}
              </h2>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                {group.totalCount} {group.totalCount === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Sub-sections Container */}
            <div className="space-y-8">
              {group.subsections.map((subGroup) => {
                if (subGroup.items.length === 0) return null;

                return (
                  <div
                    key={subGroup.name || "__default__"}
                    className="space-y-4"
                  >
                    {/* Render sub-section header if this section has named sub-sections */}
                    {hasSubsections && (
                      <div className="flex items-center gap-2.5 pt-1">
                        <div className="flex items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                          <span className="text-indigo-400">📂</span>
                          <span>{subGroup.name || "General"}</span>
                        </div>
                        <span className="text-xs text-text-secondary/70">
                          ({subGroup.items.length}{" "}
                          {subGroup.items.length === 1 ? "resource" : "resources"})
                        </span>
                        <div className="h-px flex-1 bg-border-primary/30"></div>
                      </div>
                    )}

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {subGroup.items.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-primary/60 bg-gradient-to-b from-bg-secondary/40 to-bg-primary p-5 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
                          >
                            <div>
                              {/* Photo / Cover Preview */}
                              {item.cover_image_url ? (
                                <div
                                  onClick={() => setActiveModalItem(item)}
                                  className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border-primary/50 bg-black/30 cursor-pointer"
                                  title="Click to read more & details"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.cover_image_url}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                <div
                                  onClick={() => setActiveModalItem(item)}
                                  className="relative mb-4 flex aspect-[4/3] w-full flex-col items-center justify-center rounded-xl border border-dashed border-indigo-500/20 bg-indigo-950/20 p-4 text-center cursor-pointer"
                                  title="Click to read more & details"
                                >
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
                                    {item.subsection
                                      ? `${item.section} › ${item.subsection}`
                                      : item.section}
                                  </span>
                                </div>
                              )}

                              {/* Header badges */}
                              <div className="mb-2 flex items-center gap-1.5 flex-wrap">
                                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-400">
                                  {item.section}
                                </span>
                                {item.subsection && (
                                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                                    {item.subsection}
                                  </span>
                                )}
                              </div>

                              <h3
                                onClick={() => setActiveModalItem(item)}
                                className="text-lg font-semibold tracking-tight text-text-primary group-hover:text-indigo-300 transition-colors cursor-pointer"
                              >
                                {item.title}
                              </h3>

                              {item.author && (
                                <p className="mt-0.5 text-xs font-medium text-text-secondary">
                                  by {item.author}
                                </p>
                              )}

                              {/* Description with truncated preview and Read More */}
                              {item.description && (
                                <div className="mt-3.5 border-t border-border-primary/40 pt-3">
                                  <p className="line-clamp-2 text-xs leading-relaxed text-text-secondary">
                                    {item.description
                                      .replace(/<[^>]*>/g, "")
                                      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
                                      .replace(/[*_`#]/g, "")}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setActiveModalItem(item)}
                                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                  >
                                    <span>Read more</span>
                                    <span aria-hidden="true">→</span>
                                  </button>
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
          </div>
        );
      })}

      {/* Detail / Read More Modal */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveModalItem(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border-primary/80 bg-bg-primary shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border-primary/40 px-6 py-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400">
                  {activeModalItem.section}
                </span>
                {activeModalItem.subsection && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                    {activeModalItem.subsection}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-primary/50 text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="overflow-y-auto px-6 py-5 space-y-6">
              {/* Cover image & Title info */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {activeModalItem.cover_image_url ? (
                  <div className="h-44 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-border-primary/60 bg-black/20 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeModalItem.cover_image_url}
                      alt={activeModalItem.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-44 w-32 flex-shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-indigo-500/30 bg-indigo-950/20 text-center">
                    <span className="text-3xl">📖</span>
                  </div>
                )}

                <div className="flex-1 space-y-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                    {activeModalItem.title}
                  </h2>
                  {activeModalItem.author && (
                    <p className="text-sm font-medium text-text-secondary">
                      by <span className="text-text-primary font-semibold">{activeModalItem.author}</span>
                    </p>
                  )}

                  {/* Download button */}
                  {activeModalItem.download_url && (
                    <div className="pt-2">
                      <a
                        href={activeModalItem.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-[0.98]"
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
              </div>

              {/* Full Description / Takeaways */}
              {activeModalItem.description && (
                <div className="space-y-3 border-t border-border-primary/40 pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Notes &amp; Takeaways
                  </h4>
                  <div className="rounded-xl border border-border-primary/40 bg-bg-secondary/30 p-4">
                    {renderFormattedDescription(activeModalItem.description)}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-border-primary/40 bg-bg-secondary/20 px-6 py-3.5">
              <span className="text-xs text-text-secondary">
                Press <kbd className="rounded border border-border-primary/60 bg-bg-primary px-1.5 py-0.5 text-[10px] font-mono">ESC</kbd> to close
              </span>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="rounded-xl border border-border-primary/60 bg-bg-primary px-4 py-1.5 text-xs font-semibold text-text-primary hover:bg-bg-secondary transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
