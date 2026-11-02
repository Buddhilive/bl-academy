import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  redirectTo,
}) => {
  const [email, setEmail] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingMagicLink, setLoadingMagicLink] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Compute final redirect URL for OAuth and Magic Link callbacks
  const getRedirectUrl = useCallback(() => {
    if (redirectTo) return redirectTo;
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'http://localhost:4321';
  }, [redirectTo]);

  // Focus trap and accessibility management
  useEffect(() => {
    if (!open) {
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
      return;
    }

    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Prevent body scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the first interactive element inside the modal
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          focusables[0].focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured) {
      setErrorMessage('Authentication service is not configured. Missing environment variables.');
      return;
    }

    try {
      setLoadingGoogle(true);
      setErrorMessage(null);
      setStatusMessage('Redirecting to Google...');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getRedirectUrl(),
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to initialize Google Sign-In.');
        setStatusMessage(null);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred during Google Sign-In.');
      setStatusMessage(null);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isSupabaseConfigured) {
      setErrorMessage('Authentication service is not configured. Missing environment variables.');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setLoadingMagicLink(true);
      setErrorMessage(null);
      setStatusMessage('Sending Magic Link to your inbox...');

      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          emailRedirectTo: getRedirectUrl(),
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to send Magic Link.');
        setStatusMessage(null);
      } else {
        setStatusMessage('Magic link sent! Check your email inbox to complete sign-in.');
        setEmail('');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred while sending Magic Link.');
      setStatusMessage(null);
    } finally {
      setLoadingMagicLink(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-desc"
        className="w-full max-w-md rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-neutral-900 shadow-2xl p-6 sm:p-7 text-stone-900 dark:text-stone-100 transition-all focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2
              id="auth-modal-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50"
            >
              Sign In to Academy
            </h2>
            <p
              id="auth-modal-desc"
              className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-400"
            >
              Sync your learning progress, completed exercises, and XP across all your devices.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign-in modal"
            className="p-2 -mr-2 -mt-2 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Missing configuration notice if Supabase is unconfigured */}
        {!isSupabaseConfigured && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm"
          >
            <strong>Note:</strong> Supabase cloud authentication is currently unconfigured. Your progress will continue to be safely preserved in local browser storage.
          </div>
        )}

        {/* Live Feedback Messages */}
        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-4 p-3 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 text-xs sm:text-sm font-medium"
          >
            {errorMessage}
          </div>
        )}

        {statusMessage && (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 p-3 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-medium"
          >
            {statusMessage}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loadingGoogle || loadingMagicLink || !isSupabaseConfigured}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-neutral-800 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-neutral-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] focus-visible:ring-offset-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingGoogle ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connecting to Google...
            </span>
          ) : (
            <>
              {/* Google G Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-stone-200 dark:border-stone-800" />
          <span className="absolute bg-white dark:bg-neutral-900 px-3 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
            or via email
          </span>
        </div>

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="auth-email-input"
              className="block text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 mb-1.5"
            >
              Email address
            </label>
            <input
              id="auth-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              autoComplete="email"
              disabled={loadingMagicLink || loadingGoogle || !isSupabaseConfigured}
              className="w-full px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-neutral-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] focus-visible:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loadingMagicLink || loadingGoogle || !isSupabaseConfigured}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg bg-[#A7452A] hover:bg-[#93371E] dark:bg-[#E07A5F] dark:hover:bg-[#E58A73] text-white dark:text-neutral-950 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] focus-visible:ring-offset-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMagicLink ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending Magic Link...
              </span>
            ) : (
              <span>Send Magic Link</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
