import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  getProgress,
  saveProgress,
  clearProgress,
  clearAllProgress,
  listProgress,
  migrateFromLocalStorage,
  resetMigrationFlag,
  exportProgressJson,
  importProgressJson,
  subscribeProgressUpdates,
  getSafeLocalStorage,
  STORAGE_PREFIX,
  type LessonProgress,
} from '../../lib/storage';

export const StorageTester: React.FC = () => {
  const [slug, setSlug] = useState('variables-and-types');
  const [code, setCode] = useState('x = 42\nprint(x)');
  const [xp, setXp] = useState(25);
  const [completed, setCompleted] = useState(true);
  const [currentProgress, setCurrentProgress] = useState<LessonProgress | null>(null);
  const [allRecords, setAllRecords] = useState<LessonProgress[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastSyncEvent, setLastSyncEvent] = useState<string>('None yet');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshState = useCallback(async () => {
    const [prog, list] = await Promise.all([getProgress(slug), listProgress()]);
    setCurrentProgress(prog);
    setAllRecords(list);
  }, [slug]);

  useEffect(() => {
    refreshState();
    return subscribeProgressUpdates(() => {
      setLastSyncEvent(new Date().toLocaleTimeString());
      refreshState();
    });
  }, [refreshState]);

  const handleSave = async () => {
    setErrorMessage('');
    await saveProgress(slug, {
      saved_code: code,
      completed,
      xp_earned: xp,
    });
    setStatusMessage(`Saved progress for "${slug}" to IndexedDB.`);
    await refreshState();
  };

  const handleClear = async () => {
    setErrorMessage('');
    await clearProgress(slug);
    setStatusMessage(`Cleared progress for "${slug}".`);
    await refreshState();
  };

  const handleClearAll = async () => {
    setErrorMessage('');
    await clearAllProgress();
    setStatusMessage('Cleared all IndexedDB progress records.');
    await refreshState();
  };

  const handleSeedAndMigrate = async () => {
    setErrorMessage('');
    const ls = getSafeLocalStorage();
    if (!ls) {
      setErrorMessage('localStorage is unavailable in this browser.');
      return;
    }

    ls.setItem(
      STORAGE_PREFIX + 'legacy-demo-lesson',
      JSON.stringify({
        lesson_slug: 'legacy-demo-lesson',
        completed: true,
        saved_code: 'print("Migrated from localStorage!")',
        xp_earned: 15,
        updated_at: new Date().toISOString(),
      })
    );

    await resetMigrationFlag();
    const migrated = await migrateFromLocalStorage(true);
    setStatusMessage(`Migrated ${migrated} record(s) from localStorage to IndexedDB.`);
    await refreshState();
  };

  const handleExport = async () => {
    setErrorMessage('');
    try {
      const json = await exportProgressJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bl-academy-progress-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatusMessage('Exported IndexedDB progress as JSON.');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Export failed.');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage('');
    setStatusMessage('');

    try {
      const raw = await file.text();
      const res = await importProgressJson(raw, importMode);
      setStatusMessage(
        `Imported ${res.imported} record(s) in "${importMode}" mode (${res.skipped} skipped).`
      );
      await refreshState();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Import failed.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-neutral-900 shadow-md p-6 space-y-6 text-stone-900 dark:text-stone-100">
      {/* Storage Engine Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-stone-100 dark:bg-neutral-800/80 border border-stone-200 dark:border-stone-700">
        <div>
          <div className="text-xs uppercase font-semibold tracking-wider text-stone-500 dark:text-stone-400">
            Storage Engine
          </div>
          <div className="text-sm font-semibold mt-0.5 text-emerald-700 dark:text-emerald-400">
            Local IndexedDB (bl_academy_db) + BroadcastChannel
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Last sync event: {lastSyncEvent}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg bg-[#A7452A] hover:bg-[#93371E] dark:bg-[#E07A5F] dark:hover:bg-[#E58A73] text-white dark:text-neutral-950 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] cursor-pointer transition-colors"
          >
            Export JSON
          </button>

          <select
            value={importMode}
            onChange={(e) => setImportMode(e.target.value as 'merge' | 'replace')}
            aria-label="JSON import mode"
            className="px-3 py-2 min-h-[44px] text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-neutral-950 text-stone-900 dark:text-stone-100"
          >
            <option value="merge">Merge</option>
            <option value="replace">Replace</option>
          </select>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] cursor-pointer transition-colors"
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="sr-only"
          />
        </div>
      </div>

      {/* CRUD Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tester-slug" className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
            Lesson Slug
          </label>
          <input
            id="tester-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 min-h-[44px] text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
          />
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="tester-xp" className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              XP Earned
            </label>
            <input
              id="tester-xp"
              type="number"
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              className="w-full px-3 py-2 min-h-[44px] text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
            />
          </div>

          <label className="flex items-center gap-2 min-h-[44px] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-4 h-4 accent-[#A7452A] dark:accent-[#E07A5F]"
            />
            <span className="text-sm font-medium">Completed</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="tester-code" className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
          Saved Python Code
        </label>
        <textarea
          id="tester-code"
          rows={3}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 font-mono text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
        />
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg bg-[#A7452A] hover:bg-[#93371E] dark:bg-[#E07A5F] dark:hover:bg-[#E58A73] text-white dark:text-neutral-950 cursor-pointer transition-colors"
        >
          saveProgress()
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
        >
          clearProgress()
        </button>
        <button
          type="button"
          onClick={handleSeedAndMigrate}
          className="px-4 py-2 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
        >
          Seed &amp; Migrate localStorage
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="px-4 py-2 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
        >
          clearAllProgress()
        </button>
      </div>

      {statusMessage && (
        <p role="status" className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          {statusMessage}
        </p>
      )}
      {errorMessage && (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {/* Inspection Readout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-stone-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Current Lesson ({slug})
          </h3>
          <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap text-stone-800 dark:text-stone-300">
            {currentProgress ? JSON.stringify(currentProgress, null, 2) : '(No record)'}
          </pre>
        </div>

        <div className="p-4 rounded-lg bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-stone-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            All IndexedDB Records ({allRecords.length})
          </h3>
          <pre className="text-xs font-mono overflow-x-auto max-h-60 whitespace-pre-wrap text-stone-800 dark:text-stone-300">
            {allRecords.length > 0 ? JSON.stringify(allRecords, null, 2) : '(Empty IndexedDB)'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StorageTester;
