# Implementation Plan: Client-side Pyodide Web Worker Engine

**Branch**: `002-client-side-pyodide` | **Date**: 2026-11-01 | **Spec**: [spec.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/002-client-side-pyodide/spec.md)

**Input**: Feature specification from `/.buddhi/specs/002-client-side-pyodide/spec.md`

---

## Summary

Implement a zero-backend, browser-based Python execution engine powered by WebAssembly using Pyodide v0.26.4. The engine executes inside a dedicated Web Worker (`src/workers/pyodide.worker.ts`) to keep the browser main thread completely responsive. A React custom hook (`src/hooks/usePyodide.ts`) manages worker instantiation, provides declarative execution state (`{ runCode, output, isRunning, isReady, error }`), and enforces a strict 5-second termination watchdog that halts runaway scripts (e.g. `while True:`) and automatically provisions a fresh replacement worker. An accessible, interactive verification page (`src/pages/test-pyodide.astro` + `src/components/islands/PyodideTester.tsx`) provides manual verification for off-main-thread execution and watchdog recovery, styled with `DESIGN.md` terracotta and obsidian tokens and meeting WCAG 2.2 AA contrast standards.

---

## Technical Context

**Language/Version**: TypeScript 5.9+, React 19.3+, Astro 7.4+  
**Primary Dependencies**:
- WASM Runtime: Pyodide v0.26.4 (loaded dynamically via CDN `https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs`)
- UI Framework: React 19 (`react`, `react-dom`)
- Styling: Tailwind CSS 3.4+ with `@tailwindcss/typography`
- Static Site Generator: Astro 7.4  
**Storage**: N/A (Client-side ephemeral Web Worker memory)  
**Testing**: Static type checking (`pnpm astro check`), production build verification (`pnpm build`), manual verification via `/test-pyodide`  
**Target Platform**: Modern web browsers supporting WebAssembly and Module Web Workers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Client-side WASM Web Worker & React Hook  
**Performance Goals**:
- Main thread 0ms Long Tasks during Python code execution
- Standard Python script execution (`print("Hello from WASM Python")`) produces formatted output in < 1.5s post-runtime initialization
- Watchdog termination exactly within 5,000ms ± 250ms  
**Constraints**:
- Strict zero-backend Python execution (must run 100% in browser Web Worker)
- Hard 5-second termination watchdog to prevent UI freezes
- SSR-safe (Worker instantiation only on client side: `typeof window !== 'undefined'`)
- WCAG 2.2 AA accessibility standards for interactive runner UI  
**Scale/Scope**: Reusable execution engine foundation for all interactive curriculum lessons across the academy.

---

## AGENTS.md & Rules Compliance Check

*GATE: Verified against repository rules before implementation.*

- [x] **Zero-Backend Code Execution**: Conforms to `AGENTS.md` & `.agents/rules/buddhilive-academy.md` Principle 3. Python runs client-side via Pyodide v0.26+ in `/src/workers/pyodide.worker.ts` with a hard 5-second timeout. No Node or server execution introduced.
- [x] **Project Build & Dev Commands**: Conforms to `AGENTS.md` (`pnpm dev` / `astro dev --background`, `pnpm build`, `pnpm astro check`).
- [x] **Theme & Contrast Integrity**: Conforms to `DESIGN.md` tokens (terracotta `#A7452A` in light mode: 5.95:1 PASS; `#E07A5F` in dark mode: 6.35:1 PASS; text `#F5F5F4` on `#1E1E1E`: 15.28:1 PASS).
- [x] **Accessibility Protocol**: Conforms to `.agents/rules/a11y.md` (WCAG 2.2 AA standard profile, `aria-live="polite"` terminal output, visible focus states).

---

## Architectural Lenses Evaluation

### 1. Fewest-Slices Lens (Minimal Viable Path)
- **Slice 1 (P1 - Execution Engine Worker)**:
  - Create `src/workers/pyodide.worker.ts`.
  - Dynamically import Pyodide v0.26.4 from jsDelivr CDN (`https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs`).
  - Cache the initialized Pyodide instance.
  - Implement message handler for `{ id, code, packages }`.
  - On-demand package loading via `pyodide.loadPackage(packages)`.
  - Standard output and error capture (`pyodide.setStdout`, `pyodide.setStderr`) into a buffer.
  - Post back `{ id, success: true, output }` or `{ id, success: false, error }`.
- **Slice 2 (P2 - React Hook & 5s Watchdog)**:
  - Create `src/hooks/usePyodide.ts`.
  - Manage worker lifecycle lazily via `new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), { type: 'module' })`.
  - Guard against SSR evaluation (`typeof window !== 'undefined'`).
  - Implement hard 5-second `setTimeout`: on timeout, invoke `worker.terminate()`, instantiate a fresh worker instance, and reject with timeout error.
  - Expose `{ runCode, output, isRunning, isReady, error }`.
- **Slice 3 (P3 - Verification Test Page & Island)**:
  - Create `src/components/islands/PyodideTester.tsx` React component with code editor, run buttons, status indicator, and live output terminal.
  - Create `src/pages/test-pyodide.astro` mounting the island with `client:only="react"`.
  - Include verification triggers: `print("Hello from WASM Python")` and `while True: pass` (timeout stress-test).

### 2. Risk-First Lens (De-risking Hotspots)
- **Vite Module Worker & CDN Loading**:
  - *Risk*: Traditional `importScripts()` is not supported in ES module workers (`{ type: 'module' }`) in standard browser implementations.
  - *Mitigation*: Pyodide v0.26.4 provides official ES module distribution (`pyodide.mjs`). By using dynamic `import("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs")` inside the worker, the worker loads cleanly across all modern browsers without `importScripts` incompatibilities.
- **Infinite Loop Worker Termination & Seamless Recovery**:
  - *Risk*: Terminating a worker leaves the hook without an active runner, which could break subsequent runs if not cleanly recovered.
  - *Mitigation*: The hook's timeout handler immediately terminates the hung worker, resets pending request tracking, instantiates a clean replacement worker, and restores `isReady` state so the user can immediately re-run without reloading the page.
- **Concurrent Invocations Collision**:
  - *Risk*: Calling `runCode` while a script is actively running could corrupt output buffers or mismatch message IDs.
  - *Mitigation*: Guard `runCode`: if `isRunning` is `true`, immediately reject or ignore subsequent execution requests until the active execution or timeout finishes.

### 3. Seam-Quality Lens (Boundary Decoupling)
- **Typed Message Protocol**:
  - Define explicit request/response schemas in a shared interface:
    ```typescript
    export interface PyodideRequest {
      id: string;
      code: string;
      packages?: string[];
    }
    export interface PyodideResponse {
      id: string;
      success: boolean;
      output?: string;
      error?: string;
    }
    ```
- **Clean Hook Boundary**:
  - The UI layer interacts exclusively with `usePyodide()`. Zero worker events, postMessage payloads, or WASM internals leak into component code.
- **Client Island Isolation**:
  - The test page isolates hydrated React components via Astro islands (`client:only="react"` or `client:visible`), ensuring zero hydration mismatches.

---

## Accessibility (A11Y) Strategy

- **Compliance Profile**: Standard (WCAG 2.2 AA / EN 301 549).
- **Live Output Announcer**: Terminal output container includes `aria-live="polite"` and `role="region"` with `aria-label="Execution Output"` so screen readers announce test results upon completion.
- **Keyboard Navigation**:
  - All interactive elements (code input, "Run Code", "Test Infinite Loop") are reachable via standard Tab order.
  - Visible focus indicators (`focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F]`).
- **Contrast Ratios (Verified via Buddhi contrast MCP)**:
  - Light mode primary button (`#A7452A` on `#FFFFFF`): **5.95:1** (PASS >= 4.5:1).
  - Dark mode primary accent (`#E07A5F` on `#121212`): **6.35:1** (PASS >= 4.5:1).
  - Output terminal surface (`#F5F5F4` text on `#1E1E1E` surface): **15.28:1** (PASS >= 4.5:1).
- **Reduced Motion**: Loading spinner / progress indicators respect `prefers-reduced-motion: reduce`.

---

## Security Boundaries

- **Zero Server-Side Execution**: All code runs strictly in the client's browser inside a Web Worker. No user code is transmitted to any server or execution API.
- **Worker Isolation**: The execution worker runs in a separate thread without access to the DOM, `localStorage`, `sessionStorage`, or cookies.
- **Watchdog Boundary**: The 5-second hard timeout terminates runaway execution threads, mitigating denial-of-service / CPU starvation attacks on the client device.
- **CDN Version Pinning**: Pyodide asset URLs are pinned to explicit version `v0.26.4`.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/002-client-side-pyodide/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
└── tasks.md             # Task breakdown (created by /spec-tasks)
```

### Source Code Changes

```text
src/
├── workers/
│   └── pyodide.worker.ts           # Web Worker loading Pyodide v0.26.4 and executing Python code
├── hooks/
│   └── usePyodide.ts               # React hook with lifecycle management & 5s watchdog
├── components/
│   └── islands/
│       └── PyodideTester.tsx       # Interactive React test island
└── pages/
    └── test-pyodide.astro          # Standalone verification test page
```

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None* | Architecture strictly follows existing guidelines and introduces no unneeded abstractions or extra services. | Direct main-thread execution rejected because it blocks the UI during script execution and cannot be terminated if an infinite loop occurs. |
