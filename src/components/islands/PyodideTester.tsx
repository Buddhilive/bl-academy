import React, { useState } from 'react';
import { usePyodide } from '../../hooks/usePyodide';

export function PyodideTester() {
  const [code, setCode] = useState<string>('print("Hello from WASM Python")');
  const [uiCounter, setUiCounter] = useState<number>(0);
  const { runCode, output, isRunning, isReady, error } = usePyodide();

  const handleRun = async () => {
    try {
      await runCode(code);
    } catch {
      // Error is captured in hook state
    }
  };

  const handleInfiniteLoopTest = async () => {
    const loopCode = 'import time\nprint("Starting infinite loop test...")\nwhile True:\n    pass';
    setCode(loopCode);
    try {
      await runCode(loopCode);
    } catch {
      // Caught in hook state
    }
  };

  const handleMathDemo = async () => {
    const mathCode = 'total = sum(x**2 for x in range(100000))\nprint(f"Sum of squares up to 100,000: {total}")';
    setCode(mathCode);
    try {
      await runCode(mathCode);
    } catch {
      // Caught in hook state
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-md border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-stone-200 dark:border-stone-800 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Pyodide WASM Engine Tester
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            Zero-backend client-side Python execution inside a dedicated Web Worker.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isRunning
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                : isReady
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border border-stone-500/30'
            }`}
            role="status"
            aria-live="polite"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isRunning
                  ? 'bg-amber-500'
                  : isReady
                  ? 'bg-emerald-500'
                  : 'bg-stone-400'
              }`}
            />
            {isRunning ? 'Executing...' : isReady ? 'Engine Ready' : 'Initializing...'}
          </span>
        </div>
      </div>

      {/* Main thread responsiveness test badge */}
      <div className="mt-4 p-3 bg-stone-50 dark:bg-[#121212] rounded-lg border border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="text-xs text-stone-600 dark:text-stone-400">
          <span className="font-semibold text-stone-900 dark:text-stone-200">Main Thread Test:</span> Click to prove the UI thread remains completely responsive during heavy or looping Python scripts.
        </div>
        <button
          type="button"
          onClick={() => setUiCounter((c) => c + 1)}
          className="px-3 py-1 text-xs font-medium rounded-md bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] transition-colors"
          aria-label="Increment UI test counter"
        >
          UI Clicks: {uiCounter}
        </button>
      </div>

      {/* Code Editor Area */}
      <div className="mt-5">
        <label
          htmlFor="python-code-editor"
          className="block text-sm font-semibold mb-2 text-stone-800 dark:text-stone-200"
        >
          Python Code:
        </label>
        <textarea
          id="python-code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={5}
          disabled={isRunning}
          aria-label="Python code input editor"
          className="w-full font-mono text-sm p-3.5 bg-stone-50 dark:bg-[#121212] text-stone-900 dark:text-stone-100 rounded-lg border border-stone-300 dark:border-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] resize-y transition-colors disabled:opacity-60"
          spellCheck={false}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#A7452A] dark:bg-[#E07A5F] dark:text-[#121212] hover:bg-[#93371E] dark:hover:bg-[#E58A73] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] transition-all shadow-sm"
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>

        <button
          type="button"
          onClick={handleInfiniteLoopTest}
          disabled={isRunning}
          className="px-4 py-2 rounded-lg text-sm font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors"
        >
          Test 5s Watchdog (Infinite Loop)
        </button>

        <button
          type="button"
          onClick={handleMathDemo}
          disabled={isRunning}
          className="px-4 py-2 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] transition-colors"
        >
          Load Math Demo
        </button>

        <button
          type="button"
          onClick={() => setCode('print("Hello from WASM Python")')}
          disabled={isRunning}
          className="px-3 py-2 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 focus-visible:outline-none focus-visible:underline"
        >
          Reset Code
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="mt-5 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 text-rose-800 dark:text-rose-200 text-sm"
        >
          <div className="font-semibold flex items-center gap-2">
            <span>Execution Alert:</span>
          </div>
          <pre className="mt-1 font-mono text-xs whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {/* Terminal Output */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            Console Output:
          </label>
          <span className="text-xs text-stone-500 dark:text-stone-400">Captured stdout & stderr</span>
        </div>
        <div
          role="region"
          aria-label="Python Output Console"
          aria-live="polite"
          aria-atomic="true"
          className="w-full min-h-[140px] max-h-[300px] overflow-y-auto p-4 rounded-lg bg-[#F7F5F0] dark:bg-[#121212] border border-stone-300 dark:border-stone-800 font-mono text-sm text-[#1C1917] dark:text-[#F5F5F4] whitespace-pre-wrap select-text"
        >
          {output ? output : <span className="text-stone-400 dark:text-stone-600 italic">No output yet. Click 'Run Code' to execute.</span>}
        </div>
      </div>
    </div>
  );
}

