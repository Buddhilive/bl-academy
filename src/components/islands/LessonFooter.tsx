import React, { useState, useCallback, useEffect } from 'react';
import type { LessonFooterProps } from '../../types/islands';
import {
  getProgress,
  saveProgress,
  subscribeProgressUpdates,
} from '../../lib/storage';

export const LessonFooter: React.FC<LessonFooterProps> = ({
  lessonSlug,
  xp = 10,
  nextLessonUrl,
  nextLessonTitle,
  nextActionLabel,
  onComplete,
  isCompleted = false,
  sticky = true,
  className = '',
}) => {
  const [completedState, setCompletedState] = useState<boolean>(isCompleted);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  useEffect(() => {
    setCompletedState(isCompleted);
  }, [isCompleted]);

  useEffect(() => {
    if (!lessonSlug) return;
    let active = true;

    const loadStatus = async () => {
      const progress = await getProgress(lessonSlug);
      if (active && progress?.completed) {
        setCompletedState(true);
      }
    };

    loadStatus();
    const unsubscribe = subscribeProgressUpdates(() => {
      loadStatus();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [lessonSlug]);

  const handleAction = useCallback(async () => {
    setCompletedState(true);

    if (lessonSlug) {
      await saveProgress(lessonSlug, {
        completed: true,
        xp_earned: xp,
      });
    }

    if (onComplete) {
      onComplete();
    }

    if (nextLessonUrl) {
      setIsNavigating(true);
      if (typeof window !== 'undefined') {
        window.location.href = nextLessonUrl;
      }
    }
  }, [lessonSlug, xp, nextLessonUrl, onComplete]);

  return (
    <footer
      role="contentinfo"
      aria-label="Lesson completion and navigation"
      className={`${
        sticky ? 'sticky bottom-0 z-20' : 'relative'
      } border-t border-stone-300 dark:border-stone-800 bg-stone-50/95 dark:bg-neutral-900/95 backdrop-blur-sm shadow-md py-4 px-4 sm:px-6 transition-all ${className}`}
      data-testid="lesson-footer"
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* XP Reward Badge */}
        <div className="flex items-center gap-2.5">
          <div
            role="status"
            aria-label={`${xp} experience points reward`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold tracking-wide shadow-sm"
          >
            {/* Sparkle Icon */}
            <svg
              className="w-4 h-4 text-amber-500 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>+{xp} XP</span>
          </div>

          {nextLessonTitle && (
            <span className="hidden sm:inline-block text-xs text-stone-500 dark:text-stone-400 font-medium truncate max-w-xs">
              {nextLessonTitle}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={handleAction}
            disabled={isNavigating}
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg bg-[#A7452A] hover:bg-[#93371E] dark:bg-[#E07A5F] dark:hover:bg-[#E58A73] text-white dark:text-neutral-950 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] focus-visible:ring-offset-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNavigating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1 h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading...</span>
              </>
            ) : completedState ? (
              <>
                <span>Next Lesson</span>
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>{nextActionLabel || 'Complete & Next Lesson'}</span>
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default LessonFooter;
