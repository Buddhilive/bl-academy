import { useState, useRef, useEffect, useCallback } from 'react';
import type {
  PyodideMessageRequest,
  PyodideMessageResponse,
  UsePyodideReturn,
} from '../types/pyodide';

const TIMEOUT_MS = 5000;

export function usePyodide(): UsePyodideReturn {
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingResolveRef = useRef<((value: PyodideMessageResponse) => void) | null>(null);

  // Initialize or re-create worker
  const initWorker = useCallback((): Worker | null => {
    if (typeof window === 'undefined') return null;

    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    try {
      const worker = new Worker(
        new URL('../workers/pyodide.worker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (event: MessageEvent<PyodideMessageResponse>) => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }

        const data = event.data;
        setIsRunning(false);

        if (data.success) {
          setOutput(data.output || '');
          setError(null);
        } else {
          setOutput(data.output || '');
          setError(data.error || 'Execution failed');
        }

        if (pendingResolveRef.current) {
          pendingResolveRef.current(data);
          pendingResolveRef.current = null;
        }
      };

      worker.onerror = (err) => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setIsRunning(false);
        const errMessage = err.message || 'Worker runtime error';
        setError(errMessage);

        if (pendingResolveRef.current) {
          pendingResolveRef.current({
            id: 'error',
            success: false,
            error: errMessage,
          });
          pendingResolveRef.current = null;
        }
      };

      workerRef.current = worker;
      setIsReady(true);
      return worker;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Failed to initialize Pyodide worker: ${msg}`);
      setIsReady(false);
      return null;
    }
  }, []);

  // Ensure worker is created when mounted in client
  useEffect(() => {
    initWorker();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [initWorker]);

  const runCode = useCallback(
    async (code: string, packages?: string[]): Promise<PyodideMessageResponse> => {
      if (typeof window === 'undefined') {
        throw new Error('Pyodide execution is only supported in client environments.');
      }

      if (isRunning) {
        throw new Error('Code is already running. Please wait for the current execution to finish.');
      }

      let worker = workerRef.current;
      if (!worker) {
        worker = initWorker();
        if (!worker) {
          throw new Error('Failed to start Pyodide Web Worker.');
        }
      }

      setIsRunning(true);
      setError(null);

      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      return new Promise<PyodideMessageResponse>((resolve) => {
        pendingResolveRef.current = resolve;

        // Arm 5-second watchdog timer
        timerRef.current = setTimeout(() => {
          if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
          }

          const timeoutError = 'Execution timed out (5s limit)';
          setIsRunning(false);
          setError(timeoutError);

          // Re-instantiate replacement worker immediately so subsequent executions work
          initWorker();

          const timeoutResponse: PyodideMessageResponse = {
            id,
            success: false,
            error: timeoutError,
          };

          if (pendingResolveRef.current) {
            pendingResolveRef.current(timeoutResponse);
            pendingResolveRef.current = null;
          }
        }, TIMEOUT_MS);

        const request: PyodideMessageRequest = {
          id,
          code,
          packages,
        };

        worker.postMessage(request);
      });
    },
    [isRunning, initWorker]
  );

  return {
    runCode,
    output,
    isRunning,
    isReady,
    error,
  };
}

