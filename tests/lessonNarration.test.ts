import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  chunkNarrationText,
  extractLessonSegments,
  filterEnglishVoices,
  type MinimalElement,
  type MinimalNode,
} from '../src/lib/lessonNarration.ts';

function text(value: string): MinimalNode {
  return { nodeType: 3, textContent: value, childNodes: [] };
}

function el(
  tagName: string,
  attrs: Record<string, string> = {},
  children: MinimalNode[] = []
): MinimalElement {
  const classes = (attrs.class ?? '').split(/\s+/).filter(Boolean);
  return {
    nodeType: 1,
    tagName: tagName.toUpperCase(),
    textContent: null,
    childNodes: children,
    getAttribute(name: string) {
      return name in attrs ? attrs[name] : null;
    },
    classList: {
      contains(token: string) {
        return classes.includes(token);
      },
    },
    querySelector(selector: string) {
      if (selector === 'a[href*="colab.research.google.com"]') {
        for (const child of children) {
          if (child.nodeType === 1) {
            const c = child as MinimalElement;
            if (
              c.tagName === 'A' &&
              (c.getAttribute('href') ?? '').includes('colab.research.google.com')
            ) {
              return c;
            }
            const nested = c.querySelector?.(selector);
            if (nested) return nested;
          }
        }
      }
      return null;
    },
  };
}

describe('chunkNarrationText', () => {
  it('returns short text as a single chunk', () => {
    assert.deepEqual(chunkNarrationText('Hello   world.'), ['Hello world.']);
  });

  it('splits long paragraphs into bounded chunks <= 220 chars', () => {
    const longText =
      'First sentence explains variables in Python cleanly. ' +
      'Second sentence explains how memory references work in practice. ' +
      'Third sentence covers dynamic typing without any boilerplate. ' +
      'Fourth sentence introduces functions and return values for beginners. ' +
      'Fifth sentence wraps up the section with a clear takeaway.';
    const chunks = chunkNarrationText(longText, 120);
    assert.ok(chunks.length >= 3);
    for (const c of chunks) {
      assert.ok(c.length <= 120, `Chunk too long: ${c.length}`);
    }
  });
});

describe('extractLessonSegments', () => {
  it('extracts header title/description, prose, and replaces non-prose blocks with cues', () => {
    const article = el('article', {}, [
      el('header', {}, [
        el('div', {}, [text('Course 00 • +20 XP')]),
        el('h1', {}, [text('Python Variables')]),
        el('p', {}, [text('Learn how variables store values.')]),
        el('div', { class: 'not-prose' }, [text('Previous Next')]),
      ]),
      el('div', { 'data-voice-reader-ignore': 'true' }, [
        el('p', {}, [text('Play Pause Stop')]),
      ]),
      el('h2', {}, [text('Using print')]),
      el('p', {}, [
        text('Call '),
        el('code', {}, [text('print()')]),
        text(' to display '),
        el('span', { class: 'katex' }, [
          el('span', { class: 'katex-mathml' }, [text('x squared')]),
          el('span', { class: 'katex-html' }, [text('x^2')]),
        ]),
        text('.'),
      ]),
      el('pre', {}, [el('code', {}, [text('x = 42\nprint(x)')])]),
      el('div', { class: 'not-prose' }, [
        el('a', { href: 'https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/python/vars.ipynb' }, [
          text('Open with Google Colab'),
          el('span', { class: 'sr-only' }, [text(' (opens in a new tab)')]),
        ]),
      ]),
      el('figure', { 'aria-label': 'Explainer video: Variables Intro' }, [
        el('figcaption', {}, [text('Transcript text that should be skipped')]),
      ]),
      el('table', {}, [el('tr', {}, [el('td', {}, [text('Cell')])])]),
      el('div', { class: 'katex-display' }, [text('E = mc^2')]),
      el('div', { 'data-testid': 'quiz-card', 'aria-label': 'Concept Quiz Card' }, [
        el('p', {}, [text('Quiz question text')]),
      ]),
    ]);

    const segments = extractLessonSegments(article);
    assert.deepEqual(
      segments.map((s) => ({ kind: s.kind, text: s.text })),
      [
        { kind: 'heading', text: 'Python Variables' },
        { kind: 'prose', text: 'Learn how variables store values.' },
        { kind: 'heading', text: 'Using print' },
        { kind: 'prose', text: 'Call print() to display x^2.' },
        { kind: 'cue', text: 'A code block.' },
        { kind: 'cue', text: 'Google Colab Notebook.' },
        { kind: 'cue', text: 'Explainer video: Variables Intro.' },
        { kind: 'cue', text: 'A reference table.' },
        { kind: 'cue', text: 'Mathematical formula.' },
        { kind: 'cue', text: 'Answer the quiz.' },
      ]
    );
    for (const seg of segments) {
      assert.ok(seg.element, `Expected source element on segment ${seg.id}`);
    }
  });
});

describe('filterEnglishVoices', () => {
  it('keeps only English voices regardless of locale casing', () => {
    const voices = [
      { name: 'Samantha', lang: 'en-US' },
      { name: 'Daniel', lang: 'en-GB' },
      { name: 'Karen', lang: 'EN-AU' },
      { name: 'Thomas', lang: 'fr-FR' },
      { name: 'Kyoko', lang: 'ja-JP' },
      { name: 'Monica', lang: 'es-ES' },
    ];
    assert.deepEqual(
      filterEnglishVoices(voices).map((v) => v.name),
      ['Samantha', 'Daniel', 'Karen']
    );
  });
});
