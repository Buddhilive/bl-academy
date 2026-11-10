import confetti from 'canvas-confetti';

export interface ConfettiOptions extends confetti.Options {
  /**
   * If true, force execution even if prefers-reduced-motion is enabled.
   * Defaults to false to adhere to WCAG 2.2 AA accessibility guidelines.
   */
  forceMotion?: boolean;
}

/**
 * Triggers celebratory confetti if user does not prefer reduced motion.
 */
export function triggerCompletionConfetti(options?: ConfettiOptions): Promise<undefined> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion && !options?.forceMotion) {
    // Gracefully respect user motion preferences
    return null;
  }

  return confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    ...options,
  });
}

export default triggerCompletionConfetti;

