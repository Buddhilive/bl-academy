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

const AVAILABLE_TRACKS = [
  { id: 'python', label: 'Python', href: '/learn/python/01-hello-python' },
  { id: 'numpy', label: 'NumPy', href: '#' },
  { id: 'pandas', label: 'Pandas', href: '#' },
  { id: 'dsa', label: 'DSA', href: '#' },
  { id: 'sql', label: 'SQL', href: '#' },
  { id: 'ai', label: 'AI & ML', href: '#' },
];

export default function LessonProgressPanel({ trackLessons }: Props) {
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [totalXp, setTotalXp] = useState<number>(0);

  const totalLessons = trackLessons.length;
  const firstPythonLessonSlug = trackLessons.length > 0 ? trackLessons[0].id : '01-hello-python';

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
    <header className="w-full bg-neutral-900 border-b border-neutral-800 transition-colors">
      {/* Top Track & Subject Bar (W3Schools Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Track Links */}
        <div className="flex items-center gap-4 overflow-x-auto py-1 scrollbar-none">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-white text-base tracking-tight shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] rounded"
          >
            <span className="w-6 h-6 rounded bg-[#A7452A] flex items-center justify-center text-xs text-white font-extrabold">
              BL
            </span>
            <span>BuddhiLive</span>
          </a>

          <div className="h-4 w-px bg-neutral-800 shrink-0" />

          {/* Horizontal Track Selector */}
          <nav aria-label="Tutorial subjects" className="flex items-center gap-1 shrink-0">
            {AVAILABLE_TRACKS.map((t) => {
              const isCurrent = t.id === 'python';
              const trackHref = t.id === 'python' ? `/learn/python/${firstPythonLessonSlug}` : t.href;
              return (
                <a
                  key={t.id}
                  href={trackHref}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E07A5F] ${
                    isCurrent
                      ? 'bg-[#A7452A] text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {t.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Pathfinder / My Learning Progress Indicator */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-neutral-400 hidden sm:inline-block">
              Python: {completedCount}/{totalLessons} ({percentage}%)
            </span>
            <div
              className="w-20 sm:w-28 h-2 bg-neutral-800 rounded-full overflow-hidden relative"
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Track progress"
            >
              <div
                className="h-full bg-gradient-to-r from-[#A7452A] to-[#E07A5F] transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

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
