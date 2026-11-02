import React, { useState, useCallback, useId } from 'react';
import type { QuizCardProps } from '../../types/islands';

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer,
  className = '',
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const questionId = useId();

  const handleSelect = useCallback(
    (index: number) => {
      if (hasAnswered) return;

      setSelectedOption(index);
      setHasAnswered(true);

      const isCorrect = index === correctAnswer;
      if (onAnswer) {
        onAnswer(isCorrect);
      }
    },
    [hasAnswered, correctAnswer, onAnswer]
  );

  const handleReset = useCallback(() => {
    setSelectedOption(null);
    setHasAnswered(false);
  }, []);

  const isCorrect = selectedOption === correctAnswer;

  return (
    <div
      role="region"
      aria-label="Concept Quiz Card"
      className={`rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-neutral-900 shadow-sm p-5 text-stone-900 dark:text-stone-100 ${className}`}
      data-testid="quiz-card"
    >
      {/* Quiz Header & Question */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="inline-block px-2 py-0.5 mb-2 text-[11px] font-semibold tracking-wider uppercase rounded bg-stone-200 dark:bg-neutral-800 text-stone-700 dark:text-stone-300">
            Check Your Understanding
          </span>
          <h4
            id={questionId}
            className="text-base sm:text-lg font-medium leading-relaxed text-stone-900 dark:text-stone-100"
          >
            {question}
          </h4>
        </div>

        {hasAnswered && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium px-2 py-1 rounded text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] transition-colors"
          >
            Retry
          </button>
        )}
      </div>

      {/* Options Radio Group */}
      <div
        role="radiogroup"
        aria-labelledby={questionId}
        className="space-y-2.5"
      >
        {options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isOptionCorrect = idx === correctAnswer;

          let optionStyle =
            'border-stone-300 dark:border-stone-700 bg-white dark:bg-neutral-950/60 hover:border-[#A7452A] dark:hover:border-[#E07A5F] text-stone-800 dark:text-stone-200';

          if (hasAnswered) {
            if (isSelected) {
              if (isCorrect) {
                optionStyle =
                  'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-medium ring-1 ring-emerald-600 dark:ring-emerald-500';
              } else {
                optionStyle =
                  'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-200 font-medium ring-1 ring-red-600 dark:ring-red-500';
              }
            } else if (isOptionCorrect) {
              // Highlight the correct answer if the user got it wrong
              optionStyle =
                'border-emerald-500/80 dark:border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/20 text-stone-900 dark:text-stone-100';
            } else {
              optionStyle =
                'opacity-60 border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-neutral-900/30 text-stone-500 dark:text-stone-400';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={hasAnswered}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left flex items-center justify-between p-3.5 rounded-lg border min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] focus-visible:ring-offset-2 transition-all cursor-pointer disabled:cursor-default ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold shrink-0 border ${
                    isSelected
                      ? isCorrect
                        ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-neutral-950'
                        : 'border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500 dark:text-neutral-950'
                      : hasAnswered && isOptionCorrect
                        ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300'
                        : 'border-stone-400 dark:border-stone-600 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm leading-snug">{option}</span>
              </div>

              {/* Status indicator icon */}
              {hasAnswered && (
                <div className="shrink-0 ml-2">
                  {isSelected && isCorrect && (
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isSelected && !isCorrect && (
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.707-10.707a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {!isSelected && isOptionCorrect && (
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Correct
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Conceptual Explanation Panel */}
      {hasAnswered && explanation && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-neutral-800/80 border border-stone-200 dark:border-stone-700/80 text-xs sm:text-sm leading-relaxed"
        >
          <div className="flex items-center gap-2 mb-1 font-semibold text-stone-900 dark:text-stone-100">
            {isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400">Correct Explanation:</span>
            ) : (
              <span className="text-stone-700 dark:text-stone-300">Explanation:</span>
            )}
          </div>
          <p className="text-stone-700 dark:text-stone-300">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizCard;

