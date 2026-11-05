# Design System & Brand Style Guide

This document defines the unified visual design language, color palette, typography scale, spatial rules, and UI component standards across **abhijitsatyaki.me** and all ecosystem applications. Whenever creating a new application, web tool, or dashboard, adhere to the tokens and patterns described here to ensure consistent craft and brand recognition.

---

## 1. Brand Identity & Aesthetic Philosophy

- **Vibe**: Modernist editorial minimalism meets Linear/Reflect craft. Clean, tactile, highly engineered, and restrained.
- **Canvas Aesthetic**: Off-white/warm neutral background (`#F7F7F8`) accented by high-contrast dark elements (`#3C3C3F`), refined hairline borders (`#D6DADE`), and a signature deep violet/indigo accent (`#6C47FF` / `indigo-600`).
- **Tactile Detail**: Specular highlights on buttons (subtle dual-gradient sheen), beveled inset wells for icons, and 45-degree hatched structural grid rails.
- **Atmospheric Lighting**: Soft, centered vertical purple glow (`#6C47FF` at 6% opacity with `blur-3xl`) radiating down the main viewport axis.

---

## 2. Color Palette & Design Tokens

### 2.1 Core Palette

| Role | Token Name | HEX Value | Tailwind Utility / CSS Var | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `bg-primary` | `#F7F7F8` | `bg-bg-primary` / `bg-[#F7F7F8]` | Default app background |
| **Surface (Card / Sheet)** | `surface-white` | `#FFFFFF` | `bg-white` | Elevated cards, hover states, code boxes |
| **Well / Inset Surface** | `surface-inset` | `#EDEEF0` | `bg-[#EDEEF0]` | Recessed icon wells, tool icons, tabs |
| **Dark Contrast Surface** | `dark-primary` | `#3C3C3F` | `bg-dark-primary` | Social pills, dark secondary buttons, badges |
| **Dark Modal / Terminal** | `dark-card` | `#18181B` | `bg-zinc-900` | Deep contrast cards, contact forms, preview consoles |
| **Text Primary** | `text-primary` | `#0F172A` | `text-text-primary` (Slate 900) | Primary headlines, titles, strong body |
| **Text Secondary** | `text-secondary` | `#5E5F6E` | `text-text-secondary` | Paragraphs, descriptions, secondary metadata |
| **Text Tertiary / Muted** | `text-tertiary` | `#A5AEB8` | `text-text-tertiary` | Captions, timestamps, disabled labels |
| **Primary Accent** | `purple-primary` | `#6C47FF` | `text-purple-primary` / `bg-[#6C47FF]` | Signature brand color, glows, active links |
| **Secondary Accent** | `indigo-primary` | `#4F46E5` | `bg-indigo-600` / `text-indigo-600` | Primary action buttons, interactive hovers |
| **Accent Tint / Glow** | `purple-secondary` | `#E6E2F9` | `bg-purple-secondary` / `bg-indigo-50` | Badge backgrounds, accent active states |
| **Border Primary** | `border-primary` | `#D6DADE` | `border-border-primary` | Cards, buttons, separators, Bento containers |
| **Hairline Border** | `border-subtle` | `rgba(214, 218, 222, 0.5)` | `border-border-primary/50` | Grid wrapper lines, navbar divider |
| **Text Selection** | `selection-bg` | `#47A3F3` | `::selection` | Text selection background (`#fefefe` text) |

### 2.2 Semantic Status Colors

| State | Background | Text / Icon | Border |
| :--- | :--- | :--- | :--- |
| **Success / Verified** | `bg-emerald-500/10` | `text-emerald-500` / `text-emerald-400` | `border-emerald-500/30` |
| **Warning / Notice** | `bg-amber-500/10` | `text-amber-500` / `text-amber-400` | `border-amber-500/30` |
| **Error / Critical** | `bg-rose-500/10` | `text-rose-500` / `text-rose-400` | `border-rose-500/30` |
| **Informational** | `bg-indigo-500/10` | `text-indigo-600` / `text-indigo-400` | `border-indigo-500/30` |

---

## 3. Typography & Hierarchy

### 3.1 Font Families

- **Primary Sans**: `Geist Sans` (`var(--font-geist-sans), system-ui, -apple-system, sans-serif`)
- **Monospace**: `Geist Mono` (`var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace`)

### 3.2 Typographic Hierarchy

| Level | Size / Line Height | Weight & Tracking | Classes | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 48px – 64px (`3rem`–`4rem`) / `1.1` | `font-medium tracking-tighter` | `text-4xl md:text-6xl md:leading-[64px] font-medium tracking-tighter text-balance text-text-primary` | Top-of-page hero headlines |
| **Page Title** | 32px – 40px (`2rem`–`2.5rem`) / `1.2` | `font-medium tracking-tight` | `text-3xl md:text-4xl font-medium tracking-tight text-text-primary` | Major page / feature sections |
| **Section Header (H2)** | 24px – 30px (`1.5rem`–`1.875rem`) | `font-medium tracking-tight` | `text-2xl md:text-3xl font-medium tracking-tight text-text-primary` | Subsection headings |
| **Card Header (H3)** | 18px – 20px (`1.125rem`–`1.25rem`) | `font-semibold tracking-tight` | `text-lg font-semibold tracking-tight text-text-primary` | Bento & list card titles |
| **Body (Default)** | 16px (`1rem`) / `1.75`–`2` | `font-normal` | `text-base leading-8 text-text-secondary` | Primary readable prose & descriptions |
| **Body (Compact)** | 14px (`0.875rem`) / `1.5` | `font-normal` | `text-sm leading-6 text-text-secondary` | Sidebar, cards, form inputs, tooltips |
| **Section Pill / Eyebrow** | 12px (`0.75rem`) | `font-semibold uppercase tracking-wider` | `text-xs font-semibold uppercase tracking-wider text-indigo-600` | Section taglines & category pills |
| **Code / Micro-label** | 11px – 13px | `font-mono font-medium` | `font-mono text-xs text-text-secondary` | File names, metadata, tags |

> **Typography Rules**:
> - Always apply `text-balance` to headings for polished line wrapping without orphan words.
> - Headings use `font-medium` (500) rather than heavy bold weights for a sophisticated editorial feel.
> - Pair headings with tight letter tracking (`tracking-tighter` or `tracking-tight`).

---

## 4. Layout Architecture & Structural Patterns

### 4.1 Global Viewport Frame

Every application sits inside a centered, bounded container with signature hatched structural borders.

```tsx
<div className="flex min-h-screen flex-col font-sans md:max-w-7xl lg:mx-auto">
  <main className="relative flex flex-1 flex-col overflow-x-hidden border-x border-border-primary/50">
    <Navbar />
    
    {/* 3-Column Grid with Structural Rails */}
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-[32px_1fr_32px]">
      {/* Left Hatched Rail */}
      <div className="hidden w-full border-r border-border-primary opacity-75 [background-image:linear-gradient(45deg,theme(colors.border-primary)_12.50%,transparent_12.50%,transparent_50%,theme(colors.border-primary)_50%,theme(colors.border-primary)_62.50%,transparent_62.50%,transparent_100%)] [background-size:5px_5px] lg:block" />

      {/* Main Content Area */}
      <div className="relative col-span-1 px-3 lg:px-0">
        <BgGradient />
        {children}
      </div>

      {/* Right Hatched Rail */}
      <div className="hidden w-full border-l border-border-primary opacity-75 [background-image:linear-gradient(45deg,theme(colors.border-primary)_12.50%,transparent_12.50%,transparent_50%,theme(colors.border-primary)_50%,theme(colors.border-primary)_62.50%,transparent_62.50%,transparent_100%)] [background-size:5px_5px] lg:block" />
    </div>

    <Footer />
  </main>
</div>
```

### 4.2 Signature Background Atmosphere (`BgGradient`)

Place this background glow at the top level of pages:

```tsx
export function BgGradient() {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #6C47FF00 0%, #6C47FF 50%, #6C47FF00 100%)",
        opacity: "6%",
      }}
      className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-[840px] -translate-x-1/2 overflow-visible blur-3xl"
    />
  );
}
```

### 4.3 Hairline Section Separators (`GridWrapper`)

Sections are framed by horizontal rules that bleed across standard padding:

```tsx
export function GridWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        className,
        "relative w-full",
        "before:absolute before:top-0 before:h-px before:bg-border-primary/50",
        "before:-left-4 before:right-[-1rem] md:before:-left-8 md:before:right-[-2rem] lg:before:inset-x-0",
        "after:-left-4 after:right-[-1rem] md:after:-left-8 md:after:right-[-2rem] lg:after:inset-x-0",
        "after:absolute after:bottom-0 after:h-px after:bg-border-primary/50",
      )}
    >
      {children}
    </div>
  );
}
```

---

## 5. Component Patterns & UI Tokens

### 5.1 Buttons

Buttons feature pill geometry (`rounded-full`) and subtle dual-gradient specular lighting.

```tsx
// 1. Primary Button (Brand Indigo)
<button className="group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-indigo-600 shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.gray.900/0.2)] transition-all duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] hover:bg-indigo-500 hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:opacity-50 before:transition-opacity hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-full after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay">
  Get Started
</button>

// 2. Secondary Button (Dark Contrast Pill)
<button className="group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-dark-primary px-5 py-2.5 text-sm font-medium text-white ring-1 ring-dark-primary shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.gray.900/0.2)] transition-all duration-300 hover:bg-[#4E4E52] hover:-translate-y-0.5 active:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:opacity-50 hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-full after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay">
  View Documentation
</button>

// 3. Outline Button
<button className="inline-flex items-center justify-center rounded-full border border-transparent bg-transparent px-5 py-2.5 text-sm font-medium text-gray-950 ring-1 ring-black/10 transition-colors hover:bg-gray-100/60 active:bg-gray-100">
  Learn More
</button>
```

### 5.2 Bento & Content Cards

- **Base Container**: `rounded-2xl` or `rounded-3xl`, `border border-border-primary`, `bg-bg-primary`, `hover:bg-white`, `transition-all duration-300`.
- **Hover Lift**: `hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5`.
- **Corner Action Icon**: A circular badge in the corner (`h-9 w-9 rounded-full bg-indigo-200`) rotating and appearing on card hover (`opacity-0 group-hover:opacity-100 group-hover:rotate-0`).
- **Ambient Internal Hover Glow**:
  ```tsx
  <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-tl from-indigo-400/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
  ```

### 5.3 Icon Wells & Recessed Boxes (`ShadowBox`)

For software icons, hardware devices, or status indicators, use the tactile recessed container:

```tsx
<div className="h-20 w-20 rounded-[18px] border border-border-primary bg-bg-primary p-1.5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400">
  <div
    className="grid h-full w-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0] p-1.5"
    style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}
  >
    {/* Icon or Graphic */}
  </div>
</div>
```

### 5.4 Section Divider Pill (`SectionTitlePill`)

```tsx
<div className="relative flex items-center justify-center my-10">
  <span className="absolute left-1/2 h-px w-full -translate-x-1/2 transform bg-border-primary/50" />
  <div className="z-10 grid place-items-center rounded-[200px] border border-border-primary bg-[#F7F7F8] px-5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
    <span>Featured Work</span>
  </div>
</div>
```

### 5.5 Tags & Category Badges

```tsx
// Active Category / Primary Tag
<span className="rounded-full border border-border-primary/50 bg-bg-primary/95 px-3 py-1 text-[11px] font-semibold text-indigo-600 shadow-sm backdrop-blur-md">
  AI & Full Stack
</span>

// Micro Tech Tag
<span className="rounded-md border border-border-primary/50 bg-white/60 px-2 py-0.5 text-[10px] font-medium text-text-secondary">
  Next.js 14
</span>
```

### 5.6 Form Controls & Inputs

```tsx
// Text Input
<input
  type="text"
  placeholder="Enter value..."
  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-zinc-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
/>

// Dark Mode / Terminal Input
<input
  type="text"
  placeholder="Enter query..."
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
/>
```

### 5.7 Code Frames & Blocks

- Top title bar (`bg-white border-b border-[#E2E3E5] px-4 h-9`) with three macOS window dots (`h-2.5 w-2.5 rounded-full bg-[#E2E3E5]`).
- Filename centered or left-aligned in `font-mono text-xs text-slate-400`.
- Outer wrapper has `rounded-xl` with `shadow-md ring-1 ring-indigo-500/15`.

---

## 6. Elevation, Borders & Radii Tokens

### 6.1 Border Radii Hierarchy

| Size Class | Pixel Equivalent | Typical Component |
| :--- | :--- | :--- |
| `rounded-full` | `9999px` | Buttons, navigation pills, social pills, status badges |
| `rounded-3xl` | `24px` | Featured project cards, large showcase tiles |
| `rounded-[20px]` / `rounded-2xl` | `16px – 20px` | Bento cards, modal dialogs, icon outer frames |
| `rounded-xl` | `12px` | Inputs, dropdown menus, recessed icon wells, code blocks |
| `rounded-lg` / `rounded-md` | `6px – 8px` | Micro tech badges, small avatars, table chips |

### 6.2 Shadows & Specular Effects

- **Code & Card Drama Shadow**:
  `box-shadow: 0 0 0 1px rgba(14, 22, 34, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)`
- **Button Inset Specular Sheen**:
  `shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.gray.900/0.2)]`
- **Well Inset Shadow**:
  `box-shadow: 0px 2px 1.5px 0px #A5AEB852 inset`
- **Glow Pulse (Active indicators)**:
  `box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.15), 0 0 12px rgba(108, 71, 255, 0.15)`

---

## 7. Animation & Interaction Standards

1. **Easing Function**:
   Always prefer `cubic-bezier(0.4, 0.36, 0, 1)` or `cubic-bezier(0.16, 1, 0.3, 1)` (apple/spring-like ease out) for interactive transitions.
2. **Durations**:
   - Micro-interactions (hover, color change): `150ms – 200ms`
   - Card transforms & lift: `300ms`
   - Modals & dialog panels: `350ms`
3. **Reduced Motion**:
   Always wrap animated transitions in `@media (prefers-reduced-motion: reduce)` to disable non-essential translations and pulses.

---

## 8. Ready-to-Copy Configuration Templates

### 8.1 `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      boxShadow: {
        "code-shadow":
          "0 0 0 1px rgba(14, 22, 34, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        sans: "var(--font-geist-sans), system-ui, sans-serif",
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        "bg-primary": "#F7F7F8",
        "border-primary": "#D6DADE",
        "dark-primary": "#3C3C3F",
        "purple-primary": "#6C47FF",
        "purple-secondary": "#E6E2F9",
        "text-primary": colors.slate[900],
        "text-secondary": "#5E5F6E",
        "text-tertiary": "#A5AEB8",
      },
      animation: {
        "spin-slow": "spin 14s linear infinite",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;
```

### 8.2 Base CSS Rules (`globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

::selection {
  background-color: #47a3f3;
  color: #fefefe;
}

body {
  background-color: #f7f7f8;
  color: #0f172a;
}

/* Remove Safari / iOS input default styling */
input[type="text"],
input[type="email"],
input[type="number"],
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
```

---

## 9. New Project Checklist

When starting a new app or microservice that belongs to this ecosystem:

1. [ ] Install fonts `geist/font/sans` and `geist/font/mono` and assign CSS variables `--font-geist-sans` and `--font-geist-mono`.
2. [ ] Copy the `tailwind.config.ts` colors and font configurations.
3. [ ] Set the root `<html>` / `<body>` background to `#F7F7F8` (`bg-bg-primary`).
4. [ ] Include `BgGradient` on primary views for signature purple ambient lighting.
5. [ ] Wrap section layouts with `GridWrapper` using the hairline border separators.
6. [ ] Build buttons with `rounded-full` and dual-gradient specular lighting.
7. [ ] Use `font-medium tracking-tight` for titles with `text-balance`.
8. [ ] Use `#D6DADE` (`border-border-primary`) for card and container outlines.

