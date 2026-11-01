/// <reference lib="webworker" />
import type { PyodideMessageRequest, PyodideMessageResponse } from '../types/pyodide';

interface PyodideInterface {
  loadPackage: (packages: string | string[]) => Promise<void>;
  setStdout: (options: { batched: (msg: string) => void } | ((msg: string) => void)) => void;
  setStderr: (options: { batched: (msg: string) => void } | ((msg: string) => void)) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
}

let pyodideInstance: PyodideInterface | null = null;
let pyodideInitPromise: Promise<PyodideInterface> | null = null;
let currentOutput = '';

async function initPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }
  if (pyodideInitPromise) {
    return pyodideInitPromise;
  }

  pyodideInitPromise = (async () => {
    // Dynamically import Pyodide v0.26.4 from official CDN
    const cdnUrl = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs';
    const pyodideModule = await import(/* @vite-ignore */ cdnUrl);
    const loadPyodide = pyodideModule.loadPyodide;
    const pyodide = (await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    })) as PyodideInterface;

    const captureStdout = (msg: string) => {
      currentOutput += (currentOutput.length > 0 && !currentOutput.endsWith('\n') ? '\n' : '') + msg;
    };

    try {
      pyodide.setStdout({ batched: captureStdout });
    } catch {
      pyodide.setStdout(captureStdout);
    }

    try {
      pyodide.setStderr({ batched: captureStdout });
    } catch {
      pyodide.setStderr(captureStdout);
    }

    pyodideInstance = pyodide;
    return pyodide;
  })();

  return pyodideInitPromise;
}

self.addEventListener('message', async (event: MessageEvent<PyodideMessageRequest>) => {
  const { id, code, packages } = event.data;

  try {
    currentOutput = '';
    const pyodide = await initPyodide();

    if (packages && packages.length > 0) {
      await pyodide.loadPackage(packages);
    }

    await pyodide.runPythonAsync(code);

    const response: PyodideMessageResponse = {
      id,
      success: true,
      output: currentOutput,
    };
    self.postMessage(response);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const response: PyodideMessageResponse = {
      id,
      success: false,
      output: currentOutput,
      error: errorMessage,
    };
    self.postMessage(response);
  }
});

export {};
