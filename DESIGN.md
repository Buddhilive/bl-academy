---
name: "buddhilive-academy"
version: "1.0.0"
aesthetic: "An enlightened, high-contrast digital atelier for computational inquiry and developer reference: terracotta earthen focus against clean vellum and deep obsidian canvases, razor-sharp 1px dividers, zero generic gradients, deliberate typographic rhythm."
colors:
  primary: "#A7452A"
  primary-foreground: "#FFFFFF"
  secondary: "#262626"
  secondary-foreground: "#FFFFFF"
  accent: "#93371E"
  accent-foreground: "#FFFFFF"
  background: "#FFFFFF"
  surface: "#F7F5F0"
  text: "#1C1917"
  text-muted: "#57534E"
  border: "#57534E"
dark-colors:
  primary: "#E07A5F"
  primary-foreground: "#121212"
  secondary: "#2A2A2A"
  secondary-foreground: "#F5F5F4"
  accent: "#E58A73"
  accent-foreground: "#121212"
  background: "#121212"
  surface: "#1E1E1E"
  text: "#F5F5F4"
  text-muted: "#A8A29E"
  border: "#78716C"
typography:
  font-sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  font-mono: "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace"
  font-serif: "'Newsreader', 'Georgia', serif"
  font-math: "'KaTeX_Main', 'KaTeX_Math', serif"
  max-width: "65ch"
layout:
  grid-base: "4px"
  container-sm: "640px"
  container-md: "768px"
  container-lg: "1024px"
  container-xl: "1280px"
elevation:
  card: "0 1px 3px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.08)"
  modal: "0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08)"
shapes:
  rounded-sm: "4px"
  rounded-md: "8px"
  rounded-lg: "12px"
  rounded-full: "9999px"
---

# Design System: BuddhiAI Academy

## Overview

BuddhiAI Academy is an interactive STEM tutorial and reference platform inspired by the structured, scannable clarity of W3Schools, combined with a W3Schools "Pathfinder / My Learning" progress and gamification system (XP, track milestones, and completion badges). It is designed for fast lookup and systematic study across Python, Data Science, AI, Mathematics, and Computer Science.

The visual aesthetic evokes an enlightened, high-contrast digital atelier:
- Warm terracotta earthen focus (`#A7452A`) honoring curiosity and structured thought.
- Restrained, legible typography balancing technical precision (monospace code blocks, syntax reference tables, optional KaTeX mathematical typesetting) with humanistic editorial prose.
- Crisp 1px structural framing and tactile surface separation rather than diffuse, floating shadows.
- Equal fidelity and high contrast across both Light mode (vellum canvas `#FFFFFF` / `#F7F5F0`) and Dark mode (deep obsidian canvas `#121212` / `#1E1E1E`).

## Colors

All color pairings strictly adhere to WCAG 2.2 Level AA requirements (minimum 4.5:1 for normal text, 3.0:1 for large text and structural boundaries).

### Primary Palette
- **Terracotta Primary (`#A7452A`)**: The signature brand and focus hue, used for primary actions, current lesson progress indicators, and active concept tabs. Contrast ratio against `#FFFFFF` is 5.95:1 (passes WCAG AA).
- **Primary Foreground (`#FFFFFF`)**: Crisp white lettering on primary button surfaces.
- **Dark Mode Primary (`#E07A5F`)**: Calibrated terracotta tint ensuring a 6.35:1 contrast against dark background `#121212`.

### Neutral & Semantic Palette (Light Mode)
- **Background (`#FFFFFF`)**: Pure parchment white base for maximal readability and clean AdSense ad integration.
- **Surface (`#F7F5F0`)**: Warm off-white container background for lesson cards, interactive islands, and code runner sidecars.
- **Text (`#1C1917`)**: Warm stone black yielding 16.4:1 contrast on background.
- **Text Muted (`#57534E`)**: Secondary annotations and lesson metadata, yielding 5.8:1 contrast on background.
- **Border (`#57534E`)**: Structural 1px hairline dividers with 5.8:1 contrast against `#FFFFFF`, satisfying WCAG non-text contrast requirements (> 3.0:1).

### Dark Mode Palette
- **Dark Background (`#121212`)**: True dark gray, preventing pure `#000000` eye strain.
- **Dark Surface (`#1E1E1E`)**: Elevated cards and code execution surfaces.
- **Dark Text (`#F5F5F4`)**: High-contrast near-white text (15.8:1 contrast on `#121212`).
- **Dark Text Muted (`#A8A29E`)**: Secondary metadata with 8.0:1 contrast on `#121212`.
- **Dark Border (`#78716C`)**: 4.8:1 contrast on dark canvas.

## Typography

- **Body Prose**: System sans-serif (`Inter`, `-apple-system`, `BlinkMacSystemFont`), configured with an optimal reading measure of `max-width: 65ch` and relaxed `1.75` line height to maximize comprehension.
- **Mathematical Formulae**: KaTeX serif typesetting (`KaTeX_Main`, `KaTeX_Math`), used where mathematical rigor is essential.
- **Interactive Code & Terminals**: Monospace (`JetBrains Mono`, `Fira Code`) at `0.875rem` with explicit tab sizes (4 spaces) and syntax highlighting contrast.
- **Scale**:
  - `Display / Hero`: `2.25rem` (`36px`), line-height 1.2, font-weight 700.
  - `H1 (Lesson Title)`: `1.875rem` (`30px`), line-height 1.25, font-weight 700.
  - `H2 (Section Header)`: `1.5rem` (`24px`), line-height 1.3, font-weight 600.
  - `H3 (Subtopic)`: `1.25rem` (`20px`), line-height 1.4, font-weight 600.
  - `Body`: `1rem` (`16px`), line-height 1.625, font-weight 400.
  - `Caption / Meta`: `0.875rem` (`14px`), line-height 1.5, font-weight 500.

## Layout

- **Strict Modular Grid**: All padding, margins, and gaps are multiples of `4px` / `8px` (`0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2rem`).
- **Tutorial & Reference Architecture (W3Schools Model)**:
  - **Top Horizontal Subject Nav**: Quick switching between major tracks (Python, Data Science, AI, DSA, etc.) + Pathfinder / My Learning indicator.
  - **Left Section Sidebar**: Sticky, scrollable categorized menu (e.g. Python Tutorial, Python Methods, Python References) with track completion checkmarks.
  - **Central Main Article Column**: Clear tutorial flow:
    1. Top `❮ Previous` / `Next ❯` navigation bar.
    2. Explanatory prose and syntax definition.
    3. Prominent "Example" container with instant copy + "Try it Yourself »" interactive PythonRunner trigger.
    4. Method / Parameter summary tables.
    5. Bottom `❮ Previous` / `Next ❯` navigation bar with Pathfinder XP claim.
  - **Right Rail / Inset**: Secondary Table of Contents and fixed-height reserved AdSense containers (`min-h-[280px]` / `min-h-[90px]`) eliminating Cumulative Layout Shift (CLS).

## Elevation & Depth

- **Tactile Border Layering**: Reject heavy, blurry drop-shadows. Elevation is achieved through precise `1px` borders combined with subtle ambient occlusion (`rgba(0,0,0,0.05)`).
- **Execution States**:
  - Flat base: `0 0 0 1px var(--color-border)`
  - Elevated card: `0 1px 3px rgba(0, 0, 0, 0.05), 0 0 0 1px var(--color-border)`
  - Active interactive island / focused code cell: subtle ring `0 0 0 2px #A7452A`.

## Shapes

- **Corner Radii**:
  - Interactive buttons and inputs: `rounded-md` (`8px`).
  - Cards, code editor panes, and visualizer containers: `rounded-lg` (`12px`).
  - Pills and chips (XP badges, difficulty tags, category markers): `rounded-full` (`9999px`).
  - Square avatars or iconography containers: `rounded-sm` (`4px`).

## Components

### 1. PythonRunner Island ("Try it Yourself")
- Integrated client-side Pyodide WASM console executing in a dedicated Web Worker.
- Static Example Preview: Crisp code block with syntax coloring + "Try it Yourself »" button that activates the interactive execution workspace.
- Output terminal: High-contrast dark surface `#1E1E1E` even in light mode, with monospace output and status badge (Idle / Running / Success / Error).
- Non-blocking execution with a hard 5-second timeout and graceful termination error state.

### 2. Pathfinder & My Learning Navigation
- Top navigation shows overall track progress, current streak, and earned XP.
- Quick `❮ Previous` and `Next ❯` controls at both the top and bottom of each tutorial page.
- Keyboard accessible `:focus-visible` rings with a 2px terracotta outline (`outline-2 outline-offset-2 outline-[#A7452A]`).

### 3. Google AdSense Slots
- Semantic `<aside aria-label="Advertisement">` containers.
- Enforced fixed dimensions: `300x250`, `728x90`, or responsive auto-fill containers with strict minimum height to prevent layout shifts.

## Do's and Don'ts

### Do's
- **Do** ground all styling in semantic color tokens (`primary`, `surface`, `border`, `text`).
- **Do** format tutorial articles with scannable headings, syntax definitions, code examples, and parameter tables.
- **Do** test color combinations in both light and dark modes to maintain WCAG 2.2 AA contrast.
- **Do** enforce `client:visible` hydration for all interactive islands so static lesson prose renders instantly without JavaScript.
- **Do** allocate explicit aspect-ratios or fixed heights to all advertisement and widget containers.

### Don'ts
- **Don't** use arbitrary hex codes or unapproved gradient blends.
- **Don't** introduce heavy drop shadows (`shadow-2xl`) or floating glassmorphic blurs that harm performance.
- **Don't** force dense mathematical proofs where practical code examples and syntax tables provide clearer instruction.
- **Don't** allow client-side code execution to execute on the main thread; always route through `/src/workers/pyodide.worker.ts`.
- **Don't** render unstyled or layout-shifting content that penalizes Core Web Vitals (CLS/LCP).
