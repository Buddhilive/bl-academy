import React, { useEffect, useState } from 'react';
import { listLocalProgress, type LessonProgress } from '../../lib/storage';
import { CURRICULUM_COURSES, getCourseByTrack } from '../../lib/curriculum';

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
    <header className="w-full bg-neutral-900 border-b border-neutral-800 transition-colors">
      {/* Top 9-Course Sequential Path Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Sequential Track Links */}
        <div className="flex items-center gap-3 min-w-0 flex-1 overflow-x-auto py-1 scrollbar-none">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-white text-base tracking-tight shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] rounded"
          >
            <span className="w-6 h-6 rounded bg-[#A7452A] flex items-center justify-center text-xs text-white font-extrabold">
              BL
            </span>
            <span className="hidden sm:inline">BuddhiLive</span>
          </a>

          <div className="h-4 w-px bg-neutral-800 shrink-0" />

          <nav aria-label="9-Course AI Engineering Path" className="flex items-center gap-1 shrink-0">
            {CURRICULUM_COURSES.map((course) => {
              const isCurrent = course.track === currentTrack;
              const trackHref = trackUrls?.[course.track] ?? `/learn/${course.track}`;
              return (
                <a
                  key={course.track}
                  href={trackHref}
                  title={`Course ${course.stepCode}: ${course.title}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] ${
                    isCurrent
                      ? 'bg-[#A7452A] text-white shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {course.shortLabel}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Pathfinder / My Learning Progress Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          {totalLessons > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-300 hidden md:inline-block font-mono">
                {activeCourse?.shortLabel ?? currentTrack}: {completedCount}/{totalLessons} ({percentage}%)
              </span>
              <div
                className="w-20 sm:w-24 h-2 bg-neutral-800 rounded-full overflow-hidden relative"
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-300 font-mono text-xs font-semibold"
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
