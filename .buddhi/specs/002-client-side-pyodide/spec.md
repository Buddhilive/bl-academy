# Feature Specification: Client-side Pyodide Web Worker Engine

**Feature Branch**: `002-client-side-pyodide`  
**Created**: 2026-11-01  
**Status**: Ready for Planning  
**Input**: User description: "Client-side Pyodide Web Worker Engine: 1. Create src/workers/pyodide.worker.ts (dynamically load Pyodide v0.26+ from CDN, handle {id, code, packages}, loadPackage, capture stdout, return success/error). 2. Create React hook src/hooks/usePyodide.ts (manage worker lifecycle, 5s termination timer, expose {runCode, output, isRunning, error}). 3. Standalone test page to verify off-main-thread execution."

---

## User Scenarios & Testing

### User Story 1 - Dedicated Pyodide Worker Engine (Priority: P1)

Learners and interactive lesson islands need Python code to execute entirely in a background Web Worker via WebAssembly (Pyodide v0.26+) so that heavy computation or runtime errors never freeze or crash the browser UI.

- **Why this priority**: Core execution backbone for the entire academy curriculum. Without this sandboxed worker, no interactive lesson or coding exercise can run.
- **Independent Test**: Directly instantiate the worker, send an execution message `{ id: "test-1", code: "print('Hello from WASM Python')" }`, and receive `{ id: "test-1", success: true, output: "Hello from WASM Python\n" }` without main thread blocking.

**Acceptance Scenarios**:
1. **Given** a Web Worker running `src/workers/pyodide.worker.ts`, **When** initialized, **Then** Pyodide v0.26.4 is loaded dynamically from CDN (`https://cdn.jsdelivr.net/pyodide/v0.26.4/full/`) and signals readiness.
2. **Given** an execution request with custom Python packages (e.g., `packages: ["numpy"]`), **When** received by the worker, **Then** the worker dynamically resolves and loads packages via `pyodide.loadPackage()` prior to code evaluation.
3. **Given** Python code generating standard output via `print(...)`, **When** executed, **Then** output is captured through `pyodide.setStdout` and returned in `{ id, success: true, output }`.
4. **Given** Python code that raises an unhandled exception or syntax error, **When** executed, **Then** the worker captures the error traceback and returns `{ id, success: false, error }` without crashing the worker process.

---

### User Story 2 - React Hook with 5-Second Watchdog & Lifecycle Management (Priority: P2)

Frontend lesson developers need a reusable React hook (`usePyodide`) that handles worker lifecycle instantiation, state dispatching, and a hard 5-second termination timer to guard against infinite loops (e.g. `while True:`).

- **Why this priority**: Translates raw worker messaging into declarative React state for interactive islands while guaranteeing safety against runaway user scripts.
- **Independent Test**: Invoke `runCode("while True: pass")`; verify that the execution terminates automatically after 5 seconds, reports a timeout error, tears down the blocked worker, and spawns a clean replacement worker ready for subsequent runs.

**Acceptance Scenarios**:
1. **Given** a component mounting `usePyodide()`, **When** the hook initializes, **Then** worker initialization occurs cleanly on the client-side without SSR hydration errors.
2. **Given** `runCode(code)` is called, **When** execution is running, **Then** `isRunning` becomes `true`, clearing previous errors.
3. **Given** code executing longer than 5,000ms, **When** the 5-second watchdog timer expires, **Then** the worker is forcibly terminated (`worker.terminate()`), a replacement worker is instantiated, `isRunning` becomes `false`, and `error` is populated with a timeout explanation.
4. **Given** an unmounting component with an active or idle worker, **When** unmounted, **Then** the worker is terminated to prevent memory leaks.

---

### User Story 3 - Standalone Verification Test Page (Priority: P3)

Developers and automated tests need an accessible, interactive verification page (`src/pages/test-pyodide.astro` / island) to validate end-to-end Python execution, output rendering, and timeout recovery.

- **Why this priority**: Provides visible proof of functionality, manual testing surface, and regression verification for the execution engine.
- **Independent Test**: Navigate to `/test-pyodide`, click "Run Code" with default `print("Hello from WASM Python")` to verify success, and click "Test Infinite Loop" to verify the 5s termination watchdog in action.

**Acceptance Scenarios**:
1. **Given** `/test-pyodide`, **When** loaded in browser, **Then** page renders an interactive terminal/runner interface adhering to `DESIGN.md` terracotta `#A7452A` styling and WCAG 2.2 AA contrast.
2. **Given** the default code snippet, **When** user triggers "Run Code", **Then** the output displays `Hello from WASM Python` with status `Completed`.
3. **Given** the "Test Infinite Loop" trigger, **When** clicked, **Then** the UI remains responsive, interactive controls remain clickable, and after 5 seconds the output updates to display the timeout termination error.
4. **Given** dark mode toggled on the page, **When** viewed, **Then** the runner interface seamlessly switches to obsidian `#121212` / `#1E1E1E` surface colors with `#E07A5F` accents.

---

## Edge Cases

- **Offline or CDN Unreachable**: If the user has no internet access or CDN is blocked, `loadPyodide` fails. The worker must capture this failure and return a descriptive network error.
- **Rapid Concurrent Invocations**: If `runCode` is called while a script is already executing, the hook should reject or guard against concurrent collisions while `isRunning` is `true`.
- **Worker Crashes / Out of Memory**: If the WASM runtime runs out of memory or crashes abruptly, the hook's `onerror` handler must detect termination, report the failure, and re-instantiate the worker.
- **Client-Side Hydration Guard**: Workers cannot be instantiated in Astro SSR. The hook and worker reference must explicitly guard against execution in Node/SSR environments (`typeof window !== 'undefined'`).
- **Standard Error (stderr)**: Both `stdout` and `stderr` must be captured so warnings or partial prints before an error are preserved.

---

## Requirements

### Functional Requirements

- **FR-001**: `src/workers/pyodide.worker.ts` MUST dynamically load Pyodide v0.26.4 from `https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js`.
- **FR-002**: Web worker MUST handle message events adhering to `{ id: string, code: string, packages?: string[] }`.
- **FR-003**: Web worker MUST dynamically load packages using `pyodide.loadPackage()` when `packages` array is supplied.
- **FR-004**: Web worker MUST capture standard output and standard error via `pyodide.setStdout` and `pyodide.setStderr`.
- **FR-005**: Web worker MUST post response messages with payload `{ id: string, success: boolean, output?: string, error?: string }`.
- **FR-006**: React hook `src/hooks/usePyodide.ts` MUST expose `{ runCode, output, isRunning, error, isReady }`.
- **FR-007**: React hook MUST enforce a hard 5-second termination timer: when elapsed, the worker MUST be terminated immediately and replaced with a fresh instance.
- **FR-008**: React hook MUST clean up worker instances on component unmount.
- **FR-009**: Standalone test page `src/pages/test-pyodide.astro` MUST provide an off-main-thread verification UI with standard print execution and infinite loop timeout test cases.
- **FR-010**: All UI components in the test page MUST satisfy WCAG 2.2 AA contrast ratios and keyboard navigation standards per `DESIGN.md`.

### Key Entities

- **PyodideExecutionRequest**: `{ id: string, code: string, packages?: string[] }`
- **PyodideExecutionResponse**: `{ id: string, success: boolean, output?: string, error?: string }`
- **UsePyodideReturn**: `{ runCode: (code: string, packages?: string[]) => Promise<PyodideExecutionResponse>, output: string, isRunning: boolean, isReady: boolean, error: string | null }`

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Zero Main Thread Blocking — Main thread remains 100% interactive (0ms Long Tasks attributable to Python execution) during heavy code runs.
- **SC-002**: Execution Performance — Basic scripts (e.g. arithmetic, string operations) return formatted output within < 1.5 seconds after initial Pyodide runtime initialization.
- **SC-003**: Reliable Watchdog Recovery — Any infinite loop (`while True: pass`) terminates within 5,000ms ± 250ms, resetting worker state and allowing immediate subsequent code execution without page reload.
- **SC-004**: Zero Type & Build Errors — Strict type checking (`pnpm astro check`) and production build (`pnpm build`) pass cleanly.

---

## Assumptions

- Pyodide v0.26.4 is loaded over CDN via jsDelivr as specified; local bundling of Pyodide WASM binaries is not required for this phase.
- Code execution is strictly client-side with zero server execution backend, adhering to `AGENTS.md` and `.agents/rules/buddhilive-academy.md`.
- Modern browsers with Web Worker and WebAssembly support are targeted.
