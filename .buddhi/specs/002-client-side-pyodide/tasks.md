# Tasks: Client-side Pyodide Web Worker Engine

**Input**: Design documents from `/.buddhi/specs/002-client-side-pyodide/`  
**Prerequisites**: [plan.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/002-client-side-pyodide/plan.md), [spec.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/002-client-side-pyodide/spec.md)  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Concrete file paths included for all tasks

---

## Phase 1: Setup & Shared Types

**Purpose**: Establish directory structures and shared TypeScript interfaces for worker messaging.

- [x] T001 Create directory structure for worker and hook modules (`src/workers/`, `src/hooks/`, `src/components/islands/`)
- [x] T002 [P] Create shared TypeScript definitions in `src/types/pyodide.ts` (`PyodideMessageRequest`, `PyodideMessageResponse`, `UsePyodideReturn`)

**Checkpoint**: Core directories and message contracts ready.

---

## Phase 2: User Story 1 - Dedicated Pyodide Worker Engine (Priority: P1) 🎯 MVP

**Goal**: Implement zero-backend WebAssembly Python execution off the main thread in a dedicated Web Worker.

**Independent Test**: Send `{ id: "1", code: "print('Hello from WASM Python')" }` to the worker and receive `{ id: "1", success: true, output: "Hello from WASM Python\n" }`.

### Implementation for User Story 1

- [x] T003 [US1] Create `src/workers/pyodide.worker.ts` with dynamic CDN ES module loading of Pyodide v0.26.4 (`https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs`)
- [x] T004 [US1] Implement message listener in `src/workers/pyodide.worker.ts` handling `{ id, code, packages }` with on-demand package loading via `pyodide.loadPackage(packages)`
- [x] T005 [US1] Implement stdout and stderr stream redirection (`pyodide.setStdout`, `pyodide.setStderr`) and structured result dispatch (`{ id, success: true, output }` or `{ id, success: false, error }`)
- [x] T006 [US1] Verify worker TypeScript types and compilation via `pnpm astro check`

**Checkpoint**: User Story 1 functional - Web Worker independently executes Python code and captures output in WASM.

---

## Phase 3: User Story 2 - React Hook with 5-Second Watchdog & Lifecycle Management (Priority: P2)

**Goal**: Manage worker lifecycle and declarative state in React with a hard 5-second termination timer guarding against infinite loops.

**Independent Test**: Call `runCode("while True: pass")`; verify worker is terminated at 5,000ms, error is reported, and worker is automatically recreated for subsequent calls.

### Implementation for User Story 2

- [x] T007 [US2] Create `src/hooks/usePyodide.ts` with lazy Worker instantiation using Vite module worker syntax (`new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), { type: 'module' })`) and SSR check (`typeof window !== 'undefined'`)
- [x] T008 [US2] Implement async execution dispatcher and declarative React state (`{ runCode, output, isRunning, isReady, error }`) in `src/hooks/usePyodide.ts`
- [x] T009 [US2] Implement hard 5-second timeout watchdog in `src/hooks/usePyodide.ts`: call `worker.terminate()`, instantiate a fresh replacement worker, reset pending state, and emit timeout error
- [x] T010 [US2] Implement unmount lifecycle cleanup in `src/hooks/usePyodide.ts` terminating active worker instances
- [x] T011 [US2] Verify hook TypeScript definitions and build cleanliness via `pnpm astro check`

**Checkpoint**: User Story 2 functional - React hook provides safe execution, automatic worker lifecycle management, and runaway script protection.

---

## Phase 4: User Story 3 - Standalone Verification Test Page (Priority: P3)

**Goal**: Deliver an accessible, interactive verification harness validating off-main-thread execution, output display, and watchdog recovery.

**Independent Test**: Visit `/test-pyodide`, click "Run Code" to observe `Hello from WASM Python`, and click "Test Infinite Loop" to observe non-blocking UI and 5s watchdog termination.

### Implementation for User Story 3

- [x] T012 [US3] Create `src/components/islands/PyodideTester.tsx` React component consuming `usePyodide()` with code editor, run buttons, status indicator, and live output terminal
- [x] T013 [US3] Style `src/components/islands/PyodideTester.tsx` adhering to `DESIGN.md` terracotta (`#A7452A`), dark accent (`#E07A5F`), and dark surface (`#1E1E1E`), including `aria-live="polite"` output terminal and visible focus rings
- [x] T014 [US3] Create standalone test page `src/pages/test-pyodide.astro` embedding `PyodideTester` island with `client:only="react"`
- [x] T015 [US3] Verify off-main-thread execution and 5-second watchdog recovery in browser on `/test-pyodide`

**Checkpoint**: User Story 3 functional - complete interactive test harness operational and visually verified.

---

## Phase 5: Polish & Verification Gate

**Purpose**: Validate end-to-end type cleanliness, production bundle integrity, and accessibility compliance.

- [x] T016 Run static type and schema check via `pnpm astro check`
- [x] T017 Run full production build via `pnpm build` verifying zero worker bundling or SSR errors
- [x] T018 Verify accessibility contrast and keyboard navigation across light and dark modes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Shared Types (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Phase 1 - delivers core execution engine (MVP)
- **User Story 2 (Phase 3)**: Depends on Phase 2 (worker engine) - provides React hook and watchdog
- **User Story 3 (Phase 4)**: Depends on Phase 3 (hook) - provides interactive test page
- **Polish & Verification Gate (Phase 5)**: Depends on all user stories being implemented

### User Story Dependencies

- **User Story 1 (P1)**: Self-contained Web Worker script
- **User Story 2 (P2)**: Consumes worker script via Vite URL resolution
- **User Story 3 (P3)**: Consumes `usePyodide` hook in React component island

### Parallel Opportunities

- T002 (`src/types/pyodide.ts`) can run in parallel with directory setup
- User story tasks are sequenced logically: worker engine (P1) -> hook (P2) -> verification page (P3)

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup & Shared Types
2. Complete Phase 2: User Story 1 (Pyodide Worker)
3. Validate worker executes Python code in isolation

### Incremental Delivery
1. Foundation: Worker engine (US1) -> Tested independently (MVP)
2. Add Hook: `usePyodide` + 5s watchdog (US2) -> Tested with infinite loop script
3. Add Verification Page: `PyodideTester` island & `/test-pyodide` page (US3) -> Tested end-to-end
4. Polish: Typecheck, production build, accessibility checks

