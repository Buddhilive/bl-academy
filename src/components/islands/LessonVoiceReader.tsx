import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  extractLessonSegments,
  filterEnglishVoices,
  type MinimalElement,
} from '../../lib/lessonNarration';
import type {
  LessonVoiceReaderProps,
  NarrationSegment,
  PlaybackStatus,
  ReaderPreferences,
} from '../../types/islands';

const PREFS_STORAGE_KEY = 'bl_voice_reader_prefs_v1';
const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2] as const;

function loadPreferences(): ReaderPreferences {
  if (typeof window === 'undefined') {
    return { rate: 1, voiceURI: null };
  }
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return { rate: 1, voiceURI: null };
    const parsed = JSON.parse(raw) as Partial<ReaderPreferences>;
    const rate =
      typeof parsed.rate === 'number' && SPEED_OPTIONS.includes(parsed.rate as (typeof SPEED_OPTIONS)[number])
        ? parsed.rate
        : 1;
    const voiceURI = typeof parsed.voiceURI === 'string' ? parsed.voiceURI : null;
    return { rate, voiceURI };
  } catch {
    return { rate: 1, voiceURI: null };
  }
}

function savePreferences(prefs: ReaderPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota or private browsing errors.
  }
}

function pickDefaultVoice(englishVoices: SpeechSynthesisVoice[], preferredURI: string | null): string {
  if (preferredURI && englishVoices.some((v) => v.voiceURI === preferredURI)) {
    return preferredURI;
  }
  const preferred = englishVoices.find((v) => v.default) ?? englishVoices[0];
  return preferred?.voiceURI ?? '';
}

export const LessonVoiceReader: React.FC<LessonVoiceReaderProps> = ({
  articleSelector = 'main article',
  variant = 'header',
  className = '',
}) => {
  const speedSelectId = useId();
  const voiceSelectId = useId();
  const dialogId = useId();
  const dialogTitleId = useId();

  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState<number>(1);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [segments, setSegments] = useState<NarrationSegment[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  const sessionRef = useRef<number>(0);
  const currentIndexRef = useRef<number>(0);
  const rateRef = useRef<number>(1);
  const voiceURIRef = useRef<string>('');
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const segmentsRef = useRef<NarrationSegment[]>([]);
  const highlightedElRef = useRef<HTMLElement | null>(null);
  const settingsBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    voiceURIRef.current = selectedVoiceURI;
  }, [selectedVoiceURI]);

  useEffect(() => {
    voicesRef.current = voices;
  }, [voices]);

  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  const clearHighlight = useCallback(() => {
    if (highlightedElRef.current) {
      highlightedElRef.current.removeAttribute('data-voice-reading');
      highlightedElRef.current = null;
    }
  }, []);

  const applyHighlight = useCallback(
    (segment: NarrationSegment) => {
      const target =
        typeof HTMLElement !== 'undefined' && segment.element instanceof HTMLElement
          ? segment.element
          : null;
      if (!target) {
        clearHighlight();
        return;
      }
      if (target === highlightedElRef.current) return;

      clearHighlight();
      target.setAttribute('data-voice-reading', 'true');
      highlightedElRef.current = target;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    },
    [clearHighlight]
  );

  const cancelSpeech = useCallback(() => {
    sessionRef.current += 1;
    clearHighlight();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [clearHighlight]);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof window.SpeechSynthesisUtterance === 'undefined'
    ) {
      setIsSupported(false);
      setStatus('unsupported');
      return;
    }

    const prefs = loadPreferences();
    setRate(prefs.rate);
    rateRef.current = prefs.rate;

    const synth = window.speechSynthesis;
    const syncVoices = () => {
      const englishVoices = filterEnglishVoices(synth.getVoices());
      setVoices(englishVoices);
      voicesRef.current = englishVoices;
      if (englishVoices.length > 0) {
        const chosen = pickDefaultVoice(englishVoices, voiceURIRef.current || prefs.voiceURI);
        setSelectedVoiceURI(chosen);
        voiceURIRef.current = chosen;
      } else {
        setSelectedVoiceURI('');
        voiceURIRef.current = '';
      }
    };

    syncVoices();
    synth.addEventListener?.('voiceschanged', syncVoices);

    const handlePageHide = () => {
      cancelSpeech();
    };
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);

    return () => {
      synth.removeEventListener?.('voiceschanged', syncVoices);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
      cancelSpeech();
    };
  }, [cancelSpeech]);

  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
    requestAnimationFrame(() => {
      settingsBtnRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSettings();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [settingsOpen, closeSettings]);

  const speakSegmentAt = useCallback(
    (index: number, list: NarrationSegment[], activeSession: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (activeSession !== sessionRef.current) return;

      if (index >= list.length) {
        clearHighlight();
        currentIndexRef.current = 0;
        setCurrentIndex(0);
        setStatus('idle');
        setLiveAnnouncement('Finished reading lesson.');
        return;
      }

      const segment = list[index];
      currentIndexRef.current = index;
      setCurrentIndex(index);
      applyHighlight(segment);

      const utterance = new window.SpeechSynthesisUtterance(segment.text);
      utterance.rate = rateRef.current;

      const matchedVoice = voicesRef.current.find((v) => v.voiceURI === voiceURIRef.current);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }

      utterance.onend = () => {
        if (activeSession !== sessionRef.current) return;
        speakSegmentAt(index + 1, list, activeSession);
      };

      utterance.onerror = (event) => {
        if (activeSession !== sessionRef.current) return;
        if (event.error === 'interrupted' || event.error === 'canceled') return;
        clearHighlight();
        currentIndexRef.current = 0;
        setCurrentIndex(0);
        setStatus('idle');
        setLiveAnnouncement('Voice playback stopped due to a speech synthesis error.');
      };

      window.speechSynthesis.speak(utterance);
    },
    [applyHighlight, clearHighlight]
  );

  const ensureSegments = useCallback((): NarrationSegment[] => {
    if (typeof document === 'undefined') return [];
    const article = document.querySelector(articleSelector);
    if (!article) return [];
    const extracted = extractLessonSegments(article as unknown as MinimalElement);
    setSegments(extracted);
    segmentsRef.current = extracted;
    return extracted;
  }, [articleSelector]);

  const handlePlayPause = useCallback(() => {
    if (!isSupported || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;

    if (status === 'playing') {
      synth.pause();
      setStatus('paused');
      setLiveAnnouncement('Lesson narration paused.');
      return;
    }

    if (status === 'paused') {
      synth.resume();
      setStatus('playing');
      setLiveAnnouncement('Lesson narration resumed.');
      return;
    }

    const list = ensureSegments();
    if (list.length === 0) {
      setLiveAnnouncement('No readable lesson content found.');
      return;
    }

    cancelSpeech();
    const activeSession = sessionRef.current;
    setStatus('playing');
    setLiveAnnouncement('Started reading lesson.');
    speakSegmentAt(0, list, activeSession);
  }, [cancelSpeech, ensureSegments, isSupported, speakSegmentAt, status]);

  const handleStop = useCallback(() => {
    cancelSpeech();
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    setStatus('idle');
    setLiveAnnouncement('Lesson narration stopped.');
  }, [cancelSpeech]);

  const restartIfPlaying = useCallback(() => {
    if (status !== 'playing') return;
    const list = segmentsRef.current;
    if (list.length === 0) return;
    const resumeIndex = currentIndexRef.current;
    cancelSpeech();
    const activeSession = sessionRef.current;
    speakSegmentAt(resumeIndex, list, activeSession);
  }, [cancelSpeech, speakSegmentAt, status]);

  const handleRateChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const nextRate = Number(e.target.value);
      setRate(nextRate);
      rateRef.current = nextRate;
      savePreferences({ rate: nextRate, voiceURI: voiceURIRef.current || null });
      restartIfPlaying();
    },
    [restartIfPlaying]
  );

  const handleVoiceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const nextURI = e.target.value;
      setSelectedVoiceURI(nextURI);
      voiceURIRef.current = nextURI;
      savePreferences({ rate: rateRef.current, voiceURI: nextURI || null });
      restartIfPlaying();
    },
    [restartIfPlaying]
  );

  const activeSegment = segments[currentIndex];
  const playLabel =
    status === 'playing' ? 'Pause' : status === 'paused' ? 'Resume' : 'Listen';
  const playAriaLabel =
    status === 'playing'
      ? 'Pause lesson narration'
      : status === 'paused'
        ? 'Resume lesson narration'
        : 'Listen to lesson';

  if (!isSupported) {
    return (
      <div
        role="region"
        aria-label="Lesson voice reader"
        data-voice-reader-ignore="true"
        className={`inline-flex items-center ${className}`}
      >
        <button
          type="button"
          disabled
          aria-label="Voice reader is not supported in this browser"
          title="Voice reader is not supported in this browser"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 text-neutral-500 cursor-not-allowed"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Lesson voice reader"
      data-voice-reader-ignore="true"
      className={`inline-flex items-center gap-1 ${variant === 'inline' ? 'rounded-lg border border-stone-300 bg-[#F7F5F0] p-1.5 dark:border-stone-700 dark:bg-[#1E1E1E]' : ''} ${className}`}
    >
      <button
        type="button"
        onClick={handlePlayPause}
        aria-pressed={status === 'playing'}
        aria-label={playAriaLabel}
        title={playLabel}
        className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] ${
          status === 'playing'
            ? 'border-[#A7452A] bg-[#A7452A] text-white hover:bg-[#93371E] dark:border-[#E07A5F] dark:bg-[#E07A5F] dark:text-[#121212] dark:hover:bg-[#E58A73]'
            : 'border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200'
        }`}
      >
        {status === 'playing' ? (
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={handleStop}
        disabled={status === 'idle'}
        aria-label="Stop lesson narration"
        title="Stop"
        className={`${status === 'idle' ? 'hidden sm:inline-flex' : 'inline-flex'} min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]`}
      >
        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="1" />
        </svg>
      </button>

      <button
        ref={settingsBtnRef}
        type="button"
        onClick={() => setSettingsOpen(true)}
        aria-label="Voice reader settings"
        title="Voice reader settings"
        aria-haspopup="dialog"
        aria-expanded={settingsOpen}
        aria-controls={dialogId}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]"
      >
        <svg
          className="h-4 w-4 text-[#E07A5F] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      </button>

      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeSettings();
            }
          }}
        >
          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="w-full max-w-sm rounded-xl border border-stone-300 bg-[#F7F5F0] p-5 text-[#1C1917] shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-[#F5F5F4]"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 id={dialogTitleId} className="text-base font-semibold">
                Voice Reader Settings
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeSettings}
                aria-label="Close voice reader settings"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-stone-300 bg-white text-[#1C1917] hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:border-neutral-700 dark:bg-neutral-800 dark:text-[#F5F5F4] dark:hover:bg-neutral-700 dark:focus-visible:ring-[#E07A5F] cursor-pointer"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  &times;
                </span>
              </button>
            </div>

            <div className="mb-4 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-xs dark:border-neutral-800 dark:bg-neutral-950">
              <div className="font-medium text-[#1C1917] dark:text-[#F5F5F4]">
                {status === 'idle'
                  ? 'Ready to read lesson'
                  : `Segment ${currentIndex + 1} of ${segments.length}${activeSegment?.sectionTitle ? ` • ${activeSegment.sectionTitle}` : ''}`}
              </div>
              <div className="mt-0.5 text-[#57534E] dark:text-[#A8A29E]">
                {status === 'idle'
                  ? 'Narrates lesson prose and cues; skips raw code & quizzes.'
                  : status === 'paused'
                    ? 'Playback paused'
                    : 'Currently narrating'}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor={voiceSelectId}
                  className="mb-1.5 block text-xs font-medium text-[#57534E] dark:text-[#A8A29E]"
                >
                  English Voice
                </label>
                {voices.length > 0 ? (
                  <select
                    id={voiceSelectId}
                    value={selectedVoiceURI}
                    onChange={handleVoiceChange}
                    aria-label="English narration voice"
                    className="min-h-[44px] w-full rounded-lg border border-stone-400 bg-white px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:border-neutral-700 dark:bg-neutral-950 dark:text-[#F5F5F4] dark:focus-visible:ring-[#E07A5F]"
                  >
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                    No English system voices detected; using browser default.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={speedSelectId}
                  className="mb-1.5 block text-xs font-medium text-[#57534E] dark:text-[#A8A29E]"
                >
                  Playback Speed
                </label>
                <select
                  id={speedSelectId}
                  value={rate}
                  onChange={handleRateChange}
                  aria-label="Playback speed"
                  className="min-h-[44px] w-full rounded-lg border border-stone-400 bg-white px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:border-neutral-700 dark:bg-neutral-950 dark:text-[#F5F5F4] dark:focus-visible:ring-[#E07A5F]"
                >
                  {SPEED_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}x
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={closeSettings}
                className="min-h-[44px] rounded-lg bg-[#A7452A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#93371E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:bg-[#E07A5F] dark:text-[#121212] dark:hover:bg-[#E58A73] dark:focus-visible:ring-[#E07A5F] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {liveAnnouncement}
      </div>
    </div>
  );
};

export default LessonVoiceReader;
