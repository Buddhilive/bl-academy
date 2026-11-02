import React, { useState, useEffect } from 'react';
import {
  getProgress,
  saveProgress,
  clearProgress,
  listLocalProgress,
  syncLocalToSupabase,
  getSafeStorage,
  MIGRATION_PREFIX,
  type LessonProgress,
} from '../../lib/storage';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { AuthModal } from './AuthModal';

export const StorageAuthTester: React.FC = () => {
  const [slug, setSlug] = useState('variables-and-types');
  const [code, setCode] = useState('x = 42\nprint(x)');
  const [xp, setXp] = useState(25);
  const [completed, setCompleted] = useState(true);
  const [currentProgress, setCurrentProgress] = useState<LessonProgress | null>(null);
  const [allLocal, setAllLocal] = useState<LessonProgress[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const refreshState = async () => {
    const prog = await getProgress(slug);
    setCurrentProgress(prog);
    setAllLocal(listLocalProgress());
  };

  useEffect(() => {
    refreshState();

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUserEmail(session?.user?.email ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserEmail(session?.user?.email ?? null);
        refreshState();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [slug]);

  const handleSave = async () => {
    await saveProgress(slug, {
      saved_code: code,
      completed,
      xp_earned: xp,
    });
    setSyncStatus(`Saved progress for "${slug}" locally (and queued for cloud sync).`);
    await refreshState();
  };

  const handleClear = async () => {
    await clearProgress(slug);
    setSyncStatus(`Cleared progress for "${slug}".`);
    await refreshState();
  };

  const handleManualSync = async () => {
    setSyncStatus('Running syncLocalToSupabase()...');
    const result = await syncLocalToSupabase();
    setSyncStatus(`Sync finished: ${result.migratedCount} lessons migrated, ${result.errors} errors.`);
    await refreshState();
  };

  const handleResetMigrationFlag = () => {
    const storage = getSafeStorage();
    if (userEmail) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          storage.removeItem(MIGRATION_PREFIX + session.user.id);
          setSyncStatus(`Reset migration flag for user ${session.user.id}.`);
        }
      });
    } else {
      setSyncStatus('No authenticated user session found to reset flag.');
    }
  };

  return (
    <div className="rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-neutral-900 shadow-md p-6 space-y-6 text-stone-900 dark:text-stone-100">
      {/* Auth Status & Modal Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-stone-100 dark:bg-neutral-800/80 border border-stone-200 dark:border-stone-700">
        <div>
          <div className="text-xs uppercase font-semibold tracking-wider text-stone-500 dark:text-stone-400">
            Auth Status
          </div>
          <div className="text-sm font-medium mt-0.5">
            {userEmail ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Signed in as: {userEmail}
              </span>
            ) : (
              <span className="text-stone-600 dark:text-stone-300">
                Anonymous (Local Storage Only)
              </span>
            )}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Supabase Configured: {isSupabaseConfigured ? 'Yes (Connected)' : 'No (Local-Only Mode)'}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#A7452A] hover:bg-[#93371E] dark:bg-[#E07A5F] dark:hover:bg-[#E58A73] text-white dark:text-neutral-950 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] transition-all cursor-pointer"
          >
            Open Sign-In Modal
          </button>

          {userEmail && (
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-neutral-800 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-neutral-700 shadow-sm transition-all cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Test Progress Writer
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
              Lesson Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
              Code Content (Simulated user code)
            </label>
            <textarea
              rows={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full font-mono text-xs px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                XP Earned
              </label>
              <input
                type="number"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
                className="w-24 px-3 py-1.5 text-xs sm:text-sm rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                id="completed-checkbox"
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 text-[#A7452A] rounded border-stone-300 focus:ring-[#A7452A]"
              />
              <label htmlFor="completed-checkbox" className="text-xs font-medium">
                Completed
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded bg-[#A7452A] text-white hover:bg-[#93371E] dark:bg-[#E07A5F] dark:text-neutral-950 transition-colors"
            >
              Save Progress
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-xs font-semibold rounded border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Clear Lesson
            </button>
            <button
              type="button"
              onClick={handleManualSync}
              className="px-4 py-2 text-xs font-semibold rounded border border-amber-500 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
            >
              Trigger syncLocalToSupabase()
            </button>
            <button
              type="button"
              onClick={handleResetMigrationFlag}
              className="px-3 py-1.5 text-[11px] rounded border border-stone-300 dark:border-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
            >
              Reset Migration Flag
            </button>
          </div>

          {syncStatus && (
            <div
              role="status"
              className="p-2.5 rounded text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
            >
              {syncStatus}
            </div>
          )}
        </div>

        {/* State Inspector */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Current State Inspector
          </h3>

          <div>
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
              Active Slug: <code>{slug}</code>
            </div>
            <pre className="p-3 rounded bg-stone-100 dark:bg-neutral-950 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-auto max-h-40">
              {currentProgress ? JSON.stringify(currentProgress, null, 2) : '(No stored progress)'}
            </pre>
          </div>

          <div>
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
              All Local Records ({allLocal.length})
            </div>
            <pre className="p-3 rounded bg-stone-100 dark:bg-neutral-950 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-auto max-h-48">
              {allLocal.length > 0 ? JSON.stringify(allLocal, null, 2) : '(Empty localStorage)'}
            </pre>
          </div>
        </div>
      </div>

      {/* Interactive Auth Modal Island */}
      <AuthModal open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default StorageAuthTester;

