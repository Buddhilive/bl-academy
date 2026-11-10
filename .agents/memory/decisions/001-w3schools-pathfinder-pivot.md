---
title: "Pivot to W3Schools Architectural Model with Pathfinder Gamification"
date: "2026-11-03"
status: "accepted"
tags:
  - architecture
  - layout
  - gamification
  - w3schools
---

# Decision: Pivot from Brilliant-Style Track to W3Schools Model with Pathfinder Gamification

## Context
Initially, the site was conceived as a Brilliant-style interactive course with dense mathematical derivations and an interactive side-by-side split. The user requested pivoting the site architecture to mirror W3Schools (scannable tutorial/reference hierarchy, category-grouped sidebars, top track switching, quick copyable code examples with 'Try it Yourself' executions), while keeping gamification features (XP, progress completion, and streak tracking) analogous to W3Schools Pathfinder / My Learning.

## Decision
1. **Layout & Information Architecture**:
   - Adopt a 3-tier navigation structure:
     - Top horizontal track selector (Python, NumPy, SQL, DSA, etc.) + Pathfinder summary pill.
     - Sticky left categorized sidebar (grouping lessons by Category/Section like `Python Tutorial`, `Python Methods`, `Python References`).
     - Main content column featuring top & bottom `❮ Previous` / `Next ❯` navigation, concise conceptual overview, copyable syntax examples, and "Try it Yourself" Pyodide runner.
     - Right rail reserving space for AdSense (preventing CLS) and Table of Contents.
2. **Gamification (Pathfinder / My Learning)**:
   - Retain local-first XP and lesson completion tracking (`storage.ts`).
   - XP is integrated as an accomplishment milestone rather than a strict gate, allowing users to browse freely for quick reference or track structured progress.
3. **Content Standards**:
   - Keep the 350+ word SEO/AdSense requirement, but shift the editorial style from academic math papers to scannable developer guides: Syntax Block -> Example -> Try it Yourself -> Parameter Table -> Quick Self-Test. KaTeX is preserved for mathematically rigorous subjects (ML, DSA, Math).

