# Architectural Choices: Client-side Pyodide Web Worker Engine

| ID | Category | Status | Decision & Rationale |
|---|---|---|---|
| C001 | Engine / Worker | `sound` | Used ES module CDN distribution (`pyodide.mjs`) loaded via dynamic `import(/* @vite-ignore */ cdnUrl)` rather than legacy `importScripts()`, ensuring full compatibility with Vite ES module Web Workers (`type: "module"`). |
| C002 | Hook / Concurrency | `sound` | Guarded `runCode` in `usePyodide` against concurrent invocations while `isRunning === true` to avoid race conditions or mismatched message callbacks. |
| C003 | Tester / UX | `sound` | Added a live main-thread click counter in `PyodideTester.tsx` to provide instant visual verification that the UI thread does not freeze even when Python scripts run or time out. |

