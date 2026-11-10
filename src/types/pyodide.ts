/**
 * Pyodide Web Worker communication schemas and hook return types.
 */

export interface PyodideMessageRequest {
  id: string;
  code: string;
  packages?: string[];
}

export interface PyodideMessageResponse {
  id: string;
  success: boolean;
  output?: string;
  error?: string;
}

export interface UsePyodideReturn {
  runCode: (code: string, packages?: string[]) => Promise<PyodideMessageResponse>;
  output: string;
  isRunning: boolean;
  isReady: boolean;
  error: string | null;
}


