import React, { useState, useEffect, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { keymap, EditorView } from '@codemirror/view';
import { usePyodide } from '../../hooks/usePyodide';
import { triggerCompletionConfetti } from '../../lib/confetti';
import type { PythonRunnerProps } from '../../types/islands';

export const PythonRunner: React.FC<PythonRunnerProps> = ({
  initialCode = '# Write your Python code below\nprint("Hello, Buddhilive Academy!")',
  expectedOutput,
  packages,
  title = 'Interactive Python Environment',
  minLines = 6,
  className = '',
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'pass' | 'fail'>('idle');
  const [executionOutput, setExecutionOutput] = useState<string>('');
  const [executionError, setExecutionError] = useState<string | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const runButtonRef = useRef<HTMLButtonElement>(null);

  const { runCode, isRunning, isReady } = usePyodide();

  // Avoid SSR hydration issues by deferring rich editor mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRun = useCallback(async () => {
    if (isRunning) return;

    setExecutionError(null);
    setTestStatus('idle');

    try {
      const response = await runCode(code, packages);

      if (response.success) {
        const stdout = response.output ?? '';
        setExecutionOutput(stdout);
        setExecutionError(null);

        if (expectedOutput !== undefined) {
          const isMatch = stdout.trim() === expectedOutput.trim();
          if (isMatch) {
            setTestStatus('pass');
            triggerCompletionConfetti();
          } else {
            setTestStatus('fail');
          }
        }
      } else {
        setExecutionOutput(response.output ?? '');
        setExecutionError(response.error ?? 'Execution failed');
        if (expectedOutput !== undefined) {
          setTestStatus('fail');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setExecutionError(`Runtime error: ${msg}`);
      if (expectedOutput !== undefined) {
        setTestStatus('fail');
      }
    }
  }, [code, packages, isRunning, runCode, expectedOutput]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
    setExecutionOutput('');
    setExecutionError(null);
    setTestStatus('idle');
  }, [initialCode]);

  // CodeMirror keyboard escape keymap to prevent tab trapping
  const editorExtensions = React.useMemo(() => {
    const escapeExtension = keymap.of([
      {
        key: 'Escape',
        run: (view: EditorView) => {
          view.contentDOM.blur();
          runButtonRef.current?.focus();
          return true;
        },
      },
      {
        key: 'Mod-Enter',
        run: () => {
          handleRun();
          return true;
        },
      },
    ]);

    return [python(), escapeExtension];
  }, [handleRun]);

  return (
    <div
      className={`rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-neutral-900 shadow-sm overflow-hidden text-stone-900 dark:text-stone-100 ${className}`}
      data-testid="python-runner"
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-neutral-900/90">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#A7452A] dark:bg-[#E07A5F]"
            aria-hidden="true"
          />
          <h3 className="font-semibold text-sm tracking-wide text-stone-900 dark:text-stone-100">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isRunning}
            className="px-2.5 py-1.5 text-xs font-medium rounded text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] transition-colors disabled:opacity-50"
            title="Reset code to initial template"
          >
            Reset
          </button>

          <button
            ref={runButtonRef}
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            aria-busy={isRunning}
            aria-label={isRunning ? 'Executing Python code' : 'Run code (Ctrl+Enter)'}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[44px] min-w-[100px] justify-center text-xs sm:text-sm font-semibold rounded bg-[#A7452A] hover:bg-[#93371E] dark:bg-[#E07A5F] dark:hover:bg-[#E58A73] text-white dark:text-neutral-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] focus-visible:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Running...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Run Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Container */}
      <div
        ref={editorContainerRef}
        className="relative font-mono text-sm border-b border-stone-200 dark:border-stone-800"
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleRun();
          }
          if (e.key === 'Escape') {
            runButtonRef.current?.focus();
          }
        }}
      >
        {isMounted ? (
          <CodeMirror
            value={code}
            minHeight={`${minLines * 1.5}rem`}
            extensions={editorExtensions}
            onChange={(val) => setCode(val)}
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              history: true,
              foldGutter: false,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: false,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: false,
              crosshairCursor: false,
              highlightActiveLine: true,
              highlightSelectionMatches: false,
              closeBracketsKeymap: true,
              defaultKeymap: true,
              searchKeymap: true,
              historyKeymap: true,
              foldKeymap: false,
              completionKeymap: true,
              lintKeymap: false,
            }}
            aria-label="Python code editor. Press Escape then Tab to leave editor."
          />
        ) : (
          <textarea
            value={code}
            readOnly
            rows={minLines}
            className="w-full p-4 font-mono text-sm bg-neutral-900 text-neutral-100 resize-none focus:outline-none"
            aria-label="Python code editor placeholder (loading)"
          />
        )}
      </div>

      {/* Keyboard Hint */}
      <div className="px-4 py-1.5 bg-stone-100/50 dark:bg-neutral-900/50 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center text-[11px] text-stone-500 dark:text-stone-400">
        <span>Press <kbd className="px-1 py-0.5 rounded bg-stone-200 dark:bg-neutral-800 font-mono text-[10px]">Ctrl+Enter</kbd> to run</span>
        <span><kbd className="px-1 py-0.5 rounded bg-stone-200 dark:bg-neutral-800 font-mono text-[10px]">Esc</kbd> releases focus</span>
      </div>

      {/* Validation Banner (if expectedOutput is configured) */}
      {expectedOutput !== undefined && testStatus !== 'idle' && (
        <div
          role="status"
          aria-live="polite"
          className={`px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-medium border-b ${
            testStatus === 'pass'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {testStatus === 'pass' ? (
              <>
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Pass!</strong> Output matches expected result.</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span><strong>Try Again.</strong> Output did not match expected solution.</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Output / Console Display */}
      <div
        role="region"
        aria-label="Code execution output"
        aria-live="polite"
        className="p-4 bg-stone-900 text-stone-100 font-mono text-xs sm:text-sm max-h-60 overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-[11px] text-stone-400 tracking-wider uppercase font-sans">
          <span>Output Console</span>
          <span>{isReady ? 'Pyodide Worker Ready' : 'Initializing Sandbox...'}</span>
        </div>

        {executionError ? (
          <div className="text-red-400 whitespace-pre-wrap font-mono">
            {executionError}
          </div>
        ) : executionOutput ? (
          <pre className="whitespace-pre-wrap font-mono text-stone-200">
            {executionOutput}
          </pre>
        ) : (
          <p className="text-stone-500 italic">
            Run the code above to see stdout here...
          </p>
        )}
      </div>
    </div>
  );
};

export default PythonRunner;
