import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  listProgress,
  exportProgressJson,
  importProgressJson,
  subscribeProgressUpdates,
  type LessonProgress,
} from '../../lib/storage';
import { getCourseByTrack } from '../../lib/curriculum';
import CoursesDropdown from './CoursesDropdown';

interface LessonSummary {
  id: string;
  order: number;
  xp: number;
}

interface Props {
  currentTrack?: string;
  currentSlug?: string;
  trackLessons: LessonSummary[];
  trackUrls?: Record<string, string>;
}

export default function LessonProgressPanel({
  currentTrack = 'python',
  trackLessons,
  trackUrls,
}: Props) {
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [backupOpen, setBackupOpen] = useState<boolean>(false);
  const [backupStatus, setBackupStatus] = useState<string>('');
  const [backupError, setBackupError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupMenuRef = useRef<HTMLDivElement>(null);

  const totalLessons = trackLessons.length;
  const activeCourse = getCourseByTrack(currentTrack);

  const refreshProgress = useCallback(async () => {
    try {
      const records = await listProgress();
      const recordMap = new Map<string, LessonProgress>();
      for (const rec of records) {
        recordMap.set(rec.lesson_slug, rec);
      }

      let completed = 0;
      let xpSum = 0;

      for (const lesson of trackLessons) {
        const item = recordMap.get(lesson.id);
        if (item?.completed) {
          completed++;
        }
      }

      for (const rec of records) {
        if (rec.completed) {
          xpSum += rec.xp_earned;
        }
      }

      setCompletedCount(completed);
      setTotalXp(xpSum);

      const badges = document.querySelectorAll<HTMLElement>('[data-sidebar-lesson-slug]');
      badges.forEach((linkEl) => {
        const slug = linkEl.getAttribute('data-sidebar-lesson-slug');
        if (slug) {
          const isDone = recordMap.get(slug)?.completed;
          const badge = linkEl.querySelector('.sidebar-check-badge');
          if (badge) {
            if (isDone) {
              badge.classList.remove('hidden');
            } else {
              badge.classList.add('hidden');
            }
          }
        }
      });
    } catch (e) {
      console.warn('[LessonProgressPanel] Unable to read IndexedDB progress:', e);
    }
  }, [trackLessons]);

  useEffect(() => {
    refreshProgress();
    return subscribeProgressUpdates(() => {
      refreshProgress();
    });
  }, [refreshProgress]);

  useEffect(() => {
    if (!backupOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (backupMenuRef.current && !backupMenuRef.current.contains(e.target as Node)) {
        setBackupOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBackupOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [backupOpen]);

  const handleExport = async () => {
    setBackupError('');
    setBackupStatus('');
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
      setBackupStatus('Progress exported.');
    } catch (err) {
      setBackupError(err instanceof Error ? err.message : 'Export failed.');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackupError('');
    setBackupStatus('');

    try {
      const text = await file.text();
      const result = await importProgressJson(text, 'merge');
      setBackupStatus(
        `Imported ${result.imported} lesson${result.imported === 1 ? '' : 's'}` +
          (result.skipped > 0 ? ` (${result.skipped} skipped)` : '.')
      );
      await refreshProgress();
    } catch (err) {
      setBackupError(err instanceof Error ? err.message : 'Import failed.');
    } finally {
      e.target.value = '';
    }
  };

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="w-full bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30 transition-colors">
      {/* Top 9-Course Dropdown & Pathfinder Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Courses Dropdown */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <a
            href="/"
            aria-label="BuddhiAI Academy"
            className="flex items-center gap-2 font-bold text-white text-base tracking-tight shrink-0 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] rounded"
          >
            <img
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="w-7 h-7 rounded object-contain shrink-0"
            />
            <span className="hidden sm:inline">BuddhiAI</span>
          </a>

          <div className="h-5 w-px bg-neutral-800 shrink-0" aria-hidden="true" />

          <CoursesDropdown currentTrack={currentTrack} trackUrls={trackUrls} />
        </div>

        {/* Pathfinder / My Learning Progress Indicator & Local Backup */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {totalLessons > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-300 hidden md:inline-block font-mono">
                {activeCourse?.shortLabel ?? currentTrack}: {completedCount}/{totalLessons} ({percentage}%)
              </span>
              <div
                className="hidden xs:block w-16 sm:w-24 h-2 bg-neutral-800 rounded-full overflow-hidden relative"
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${activeCourse?.title ?? currentTrack} progress`}
              >
                <div
                  className="h-full bg-[#E07A5F] transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Pathfinder XP Pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-300 font-mono text-xs font-semibold whitespace-nowrap"
            title="Pathfinder XP Earned"
          >
            <span className="text-amber-400" aria-hidden="true">★</span>
            <span>{totalXp} XP</span>
          </div>

          {/* Local IndexedDB Backup Menu */}
          <div className="relative" ref={backupMenuRef}>
            <button
              type="button"
              onClick={() => setBackupOpen((prev) => !prev)}
              aria-expanded={backupOpen}
              aria-controls="progress-backup-menu"
              aria-label="Backup or restore local progress"
              className="inline-flex items-center gap-1.5 px-2.5 min-h-[44px] rounded-lg border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-[#E07A5F]"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
              </svg>
              <span className="hidden sm:inline">Backup</span>
            </button>

            {backupOpen && (
              <div
                id="progress-backup-menu"
                role="region"
                aria-label="Local progress backup and restore"
                className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl p-3 space-y-2.5 z-50"
              >
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Progress is saved locally in your browser&apos;s IndexedDB. Export a JSON backup or import one to restore.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleExport}
                    className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#A7452A] hover:bg-[#93371E] dark:bg-[#E07A5F] dark:hover:bg-[#E58A73] text-white dark:text-neutral-950 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] cursor-pointer transition-colors"
                  >
                    Export Progress (.json)
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] cursor-pointer transition-colors"
                  >
                    Import &amp; Merge (.json)
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFile}
                    className="sr-only"
                    aria-label="Choose progress backup JSON file"
                  />
                </div>
                {backupStatus && (
                  <p role="status" className="text-xs text-emerald-400 font-medium">
                    {backupStatus}
                  </p>
                )}
                {backupError && (
                  <p role="alert" className="text-xs text-red-400 font-medium">
                    {backupError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
