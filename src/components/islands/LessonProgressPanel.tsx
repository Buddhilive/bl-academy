import React, { useEffect, useState } from 'react';
import { listLocalProgress, type LessonProgress } from '../../lib/storage';
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

  const totalLessons = trackLessons.length;
  const activeCourse = getCourseByTrack(currentTrack);

  const refreshProgress = () => {
    try {
      const records = listLocalProgress();
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
      console.warn('[LessonProgressPanel] Unable to read local storage progress:', e);
    }
  };

  useEffect(() => {
    refreshProgress();

    const handleStorageChange = () => {
      refreshProgress();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bl:progress-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bl:progress-updated', handleStorageChange);
    };
  }, [trackLessons]);

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="w-full bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30 transition-colors">
      {/* Top 9-Course Dropdown & Pathfinder Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Courses Dropdown */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-white text-base tracking-tight shrink-0 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] rounded"
          >
            <span className="w-7 h-7 rounded bg-[#A7452A] flex items-center justify-center text-xs text-white font-extrabold">
              BL
            </span>
            <span className="hidden sm:inline">BuddhiLive</span>
          </a>

          <div className="h-5 w-px bg-neutral-800 shrink-0" aria-hidden="true" />

          <CoursesDropdown currentTrack={currentTrack} trackUrls={trackUrls} />
        </div>

        {/* Pathfinder / My Learning Progress Indicator */}
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
        </div>
      </div>
    </header>
  );
}
