import React, { useEffect, useState } from 'react';
import { listLocalProgress, type LessonProgress } from '../../lib/storage';

interface LessonSummary {
  id: string;
  order: number;
  xp: number;
}

interface Props {
  currentSlug?: string;
  trackLessons: LessonSummary[];
}

export default function LessonProgressPanel({ trackLessons }: Props) {
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [totalXp, setTotalXp] = useState<number>(0);

  const totalLessons = trackLessons.length;

  const refreshProgress = () => {
    try {
      const records = listLocalProgress();
      const recordMap = new Map<string, LessonProgress>();
      for (const rec of records) {
        recordMap.set(rec.lesson_slug, rec);
      }

      let completed = 0;
      let xpSum = 0;

      // 1. Calculate stats for this track
      for (const lesson of trackLessons) {
        const item = recordMap.get(lesson.id);
        if (item?.completed) {
          completed++;
        }
      }

      // 2. Calculate overall total XP across all completed lessons in storage
      for (const rec of records) {
        if (rec.completed) {
          xpSum += rec.xp_earned;
        }
      }

      setCompletedCount(completed);
      setTotalXp(xpSum);

      // 3. Update sidebar checkmarks dynamically in the DOM
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
      console.warn('[LessonProgressPanel] Unable to read local storage progress:', e);
    }
  };

  useEffect(() => {
    refreshProgress();

    // Listen for storage events (multi-tab sync or code completion updates)
    const handleStorageChange = () => {
      refreshProgress();
    };

    window.addEventListener('storage', handleStorageChange);
    // Support custom bl:progress-updated event dispatched by completion triggers
    window.addEventListener('bl:progress-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bl:progress-updated', handleStorageChange);
    };
  }, [trackLessons]);

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="w-full bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        {/* Track Title & Breadcrumb */}
        <div className="flex items-center gap-2 text-neutral-300 w-full sm:w-auto">
          <a
            href="/"
            className="text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E07A5F] rounded px-1"
          >
            Academy
          </a>
          <span className="text-neutral-600">/</span>
          <span className="font-semibold text-white truncate">Python Zero to Hero</span>
        </div>

        {/* Progress Bar & XP Tracker */}
        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          {/* Progress Bar Container */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 whitespace-nowrap">
              {completedCount} / {totalLessons} completed ({percentage}%)
            </span>
            <div
              className="w-28 sm:w-36 h-2 bg-neutral-800 rounded-full overflow-hidden relative"
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Course completion progress"
            >
              <div
                className="h-full bg-gradient-to-r from-[#A7452A] to-[#E07A5F] transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* XP Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-300 font-mono text-xs font-semibold shrink-0"
            title="Total XP Earned"
          >
            <span className="text-amber-400" aria-hidden="true">★</span>
            <span>{totalXp} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
}
