import type { NarrationSegment, NarrationSegmentKind } from '../types/islands';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const MAX_CHUNK_CHARS = 220;

export interface MinimalNode {
  nodeType: number;
  textContent: string | null;
  childNodes: ArrayLike<MinimalNode>;
}

export interface MinimalElement extends MinimalNode {
  tagName: string;
  getAttribute(name: string): string | null;
  matches?(selector: string): boolean;
  querySelector?(selector: string): MinimalElement | null;
  classList?: { contains(token: string): boolean };
}

function isElement(node: MinimalNode): node is MinimalElement {
  return node.nodeType === ELEMENT_NODE;
}

function hasClass(el: MinimalElement, className: string): boolean {
  if (el.classList) return el.classList.contains(className);
  const cls = el.getAttribute('class') ?? '';
  return cls.split(/\s+/).includes(className);
}

function matchesSelector(el: MinimalElement, selector: string): boolean {
  if (typeof el.matches === 'function') {
    return el.matches(selector);
  }
  return false;
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function shouldSkipSubtree(el: MinimalElement): boolean {
  const tag = el.tagName.toLowerCase();
  if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'svg') {
    return true;
  }
  if (el.getAttribute('aria-hidden') === 'true') {
    return true;
  }
  if (el.getAttribute('data-voice-reader-ignore') !== null) {
    return true;
  }
  if (hasClass(el, 'sr-only') || hasClass(el, 'katex-mathml')) {
    return true;
  }
  return false;
}

/**
 * Extracts readable inline text from a node, skipping hidden KaTeX MathML,
 * sr-only spans, and aria-hidden decorative elements.
 */
export function extractCleanInlineText(node: MinimalNode): string {
  if (node.nodeType === TEXT_NODE) {
    return node.textContent ?? '';
  }
  if (!isElement(node) || shouldSkipSubtree(node)) {
    return '';
  }

  let out = '';
  for (let i = 0; i < node.childNodes.length; i++) {
    out += extractCleanInlineText(node.childNodes[i]);
  }
  return out;
}

/**
 * Splits a block of prose into bounded chunks (<= maxChars) at sentence
 * boundaries to prevent Chromium's ~15s SpeechSynthesisUtterance stall.
 */
export function chunkNarrationText(text: string, maxChars = MAX_CHUNK_CHARS): string[] {
  const cleaned = normalizeWhitespace(text);
  if (!cleaned) return [];
  if (cleaned.length <= maxChars) return [cleaned];

  const sentences = cleaned.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [cleaned];
  const chunks: string[] = [];
  let current = '';

  for (const rawSentence of sentences) {
    const sentence = normalizeWhitespace(rawSentence);
    if (!sentence) continue;

    if (current && current.length + 1 + sentence.length <= maxChars) {
      current = `${current} ${sentence}`;
      continue;
    }

    if (current) {
      chunks.push(current);
      current = '';
    }

    if (sentence.length <= maxChars) {
      current = sentence;
    } else {
      // Fallback word split for very long sentences without punctuation.
      const words = sentence.split(' ');
      for (const word of words) {
        if (!current) {
          current = word;
        } else if (current.length + 1 + word.length <= maxChars) {
          current = `${current} ${word}`;
        } else {
          chunks.push(current);
          current = word;
        }
      }
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function detectNonProseCue(el: MinimalElement): string | null {
  const tag = el.tagName.toLowerCase();
  const testId = el.getAttribute('data-testid');

  if (testId === 'quiz-card' || el.getAttribute('aria-label') === 'Concept Quiz Card') {
    return 'Answer the quiz.';
  }

  if (
    tag === 'pre' ||
    testId === 'python-runner' ||
    hasClass(el, 'cm-editor') ||
    matchesSelector(el, '[data-testid="python-runner"]')
  ) {
    return 'A code block.';
  }

  if (
    (tag === 'a' && (el.getAttribute('href') ?? '').includes('colab.research.google.com')) ||
    (typeof el.querySelector === 'function' &&
      hasClass(el, 'not-prose') &&
      el.querySelector('a[href*="colab.research.google.com"]') !== null)
  ) {
    return 'Google Colab Notebook.';
  }

  const ariaLabel = el.getAttribute('aria-label') ?? '';
  if (tag === 'figure' && ariaLabel.startsWith('Explainer video:')) {
    return `${ariaLabel.replace(/\.$/, '')}.`;
  }

  if (tag === 'table') {
    return 'A reference table.';
  }

  if (hasClass(el, 'katex-display')) {
    return 'Mathematical formula.';
  }

  return null;
}

/**
 * Filters SpeechSynthesis voices to English locales only.
 */
export function filterEnglishVoices<T extends { lang: string }>(voices: readonly T[]): T[] {
  return voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
}

/**
 * Walks a lesson <article> element and produces an ordered list of speakable
 * NarrationSegments, omitting raw code, quizzes, tables, and chrome.
 */
export function extractLessonSegments(article: MinimalElement): NarrationSegment[] {
  const segments: NarrationSegment[] = [];
  let currentSection: string | undefined;
  let counter = 0;

  const pushSegments = (
    text: string,
    kind: NarrationSegmentKind,
    sectionTitle?: string,
    element?: MinimalElement
  ) => {
    const chunks = kind === 'prose' ? chunkNarrationText(text) : [normalizeWhitespace(text)];
    for (const chunk of chunks) {
      if (!chunk) continue;
      counter += 1;
      segments.push({
        id: `seg-${counter}`,
        text: chunk,
        kind,
        sectionTitle,
        element,
      });
    }
  };

  const walkHeader = (header: MinimalElement) => {
    for (let i = 0; i < header.childNodes.length; i++) {
      const child = header.childNodes[i];
      if (!isElement(child) || shouldSkipSubtree(child)) continue;
      const tag = child.tagName.toLowerCase();
      if (tag === 'h1') {
        const text = normalizeWhitespace(extractCleanInlineText(child));
        if (text) {
          currentSection = text;
          pushSegments(text, 'heading', currentSection, child);
        }
      } else if (tag === 'p') {
        const text = normalizeWhitespace(extractCleanInlineText(child));
        if (text) {
          pushSegments(text, 'prose', currentSection, child);
        }
      }
      // Skip metadata pills and top Prev/Next navigation divs inside <header>.
    }
  };

  const walkBodyElement = (el: MinimalElement) => {
    if (shouldSkipSubtree(el)) return;

    const tag = el.tagName.toLowerCase();
    if (tag === 'header') {
      walkHeader(el);
      return;
    }

    const cue = detectNonProseCue(el);
    if (cue) {
      pushSegments(cue, 'cue', currentSection, el);
      return;
    }

    if (/^h[1-6]$/.test(tag)) {
      const text = normalizeWhitespace(extractCleanInlineText(el));
      if (text) {
        currentSection = text;
        pushSegments(text, 'heading', currentSection, el);
      }
      return;
    }

    if (tag === 'p' || tag === 'li' || tag === 'blockquote') {
      const text = normalizeWhitespace(extractCleanInlineText(el));
      if (text) {
        pushSegments(text, 'prose', currentSection, el);
      }
      return;
    }

    for (let i = 0; i < el.childNodes.length; i++) {
      const child = el.childNodes[i];
      if (isElement(child)) {
        walkBodyElement(child);
      }
    }
  };

  for (let i = 0; i < article.childNodes.length; i++) {
    const child = article.childNodes[i];
    if (isElement(child)) {
      walkBodyElement(child);
    }
  }

  return segments;
}
