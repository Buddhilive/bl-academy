import React, { useEffect, useId, useRef, useState } from 'react';
import { CURRICULUM_COURSES, getCourseByTrack } from '../../lib/curriculum';

interface Props {
  currentTrack?: string;
  trackUrls?: Record<string, string>;
  buttonLabel?: string;
  align?: 'left' | 'right';
}

export default function CoursesDropdown({
  currentTrack,
  trackUrls,
  buttonLabel,
  align = 'left',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const activeCourse = currentTrack ? getCourseByTrack(currentTrack) : undefined;
  const triggerText = buttonLabel ?? (activeCourse ? activeCourse.shortLabel : 'Courses');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-md border text-xs sm:text-sm font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] ${
          isOpen || activeCourse
            ? 'border-[#A7452A]/60 bg-[#A7452A]/15 text-white hover:bg-[#A7452A]/25'
            : 'border-neutral-700 bg-neutral-800/80 text-neutral-200 hover:bg-neutral-800 hover:text-white'
        }`}
      >
        <span className="truncate max-w-[140px] sm:max-w-none">{triggerText}</span>
        <svg
          className={`w-4 h-4 text-[#E07A5F] shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id={menuId}
          className={`fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:top-full sm:mt-2 sm:w-80 md:w-96 max-h-[75vh] overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl z-50 p-2 ${
            align === 'right' ? 'sm:right-0' : 'sm:left-0'
          }`}
        >
          <div className="px-3 py-2 border-b border-neutral-800 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#E07A5F]">
              9-Course Learning Path
            </span>
            <span className="text-[11px] font-mono text-neutral-400">00 → 08</span>
          </div>

          <nav aria-label="9-Course AI Engineering Path">
            <ul className="space-y-1">
              {CURRICULUM_COURSES.map((course) => {
                const isCurrent = course.track === currentTrack;
                const trackHref = trackUrls?.[course.track] ?? `/learn/${course.track}`;

                return (
                  <li key={course.track}>
                    <a
                      href={trackHref}
                      aria-current={isCurrent ? 'page' : undefined}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 min-h-[44px] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] ${
                        isCurrent
                          ? 'bg-[#A7452A]/20 border border-[#A7452A]/60 text-white'
                          : 'text-neutral-200 hover:bg-neutral-800 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-[#E07A5F] shrink-0">
                            {course.stepCode}
                          </span>
                          <span className="text-sm font-semibold truncate">{course.title}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                        {course.difficulty}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-2 pt-2 border-t border-neutral-800">
            <a
              href="/#learning-path"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-lg text-xs font-mono font-semibold text-[#E07A5F] hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]"
            >
              <span>Browse Full Curriculum Overview</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
