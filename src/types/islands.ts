/**
 * Island component props and state contracts for Buddhilive Academy interactive components.
 */

export interface PythonRunnerProps {
  /**
   * Initial Python code preloaded into the editor.
   */
  initialCode?: string;

  /**
   * Optional expected stdout string.
   * If provided, trimmed stdout will be compared against trimmed expectedOutput,
   * triggering a Pass/Try Again state and celebratory confetti on success.
   */
  expectedOutput?: string;

  /**
   * Optional list of Pyodide/micropip packages to preload (e.g. ['numpy', 'sympy']).
   */
  packages?: string[];

  /**
   * Optional visual label or exercise title (e.g. "Exercise: Fibonacci").
   */
  title?: string;

  /**
   * Minimum editor height in lines or min-height. Defaults to 6.
   */
  minLines?: number;

  /**
   * Additional container CSS classes.
   */
  className?: string;
}

export interface QuizCardProps {
  /**
   * The question prompt text (can include inline mathematical notation).
   */
  question: string;

  /**
   * 2 to 6 multiple choice options.
   */
  options: string[];

  /**
   * 0-indexed position of the correct answer.
   */
  correctAnswer: number;

  /**
   * Conceptual explanation revealed once an answer is chosen.
   */
  explanation?: string;

  /**
   * Event callback emitted when an answer is selected.
   */
  onAnswer?: (correct: boolean) => void;

  /**
   * Additional container CSS classes.
   */
  className?: string;
}

export interface LessonFooterProps {
  /**
   * Experience points reward for completing this lesson (default: 10).
   */
  xp?: number;

  /**
   * Relative or absolute URL to the next lesson in the curriculum.
   */
  nextLessonUrl?: string;

  /**
   * Display title of the next lesson (e.g. "Next: Control Flow & Loops").
   */
  nextLessonTitle?: string;

  /**
   * Optional callback fired when the completion button is clicked.
   */
  onComplete?: () => void;

  /**
   * Whether the current lesson has already been marked completed.
   */
  isCompleted?: boolean;

  /**
   * Whether the footer should stick to the bottom of the viewport. Defaults to true.
   */
  sticky?: boolean;

  /**
   * Additional container CSS classes.
   */
  className?: string;
}

