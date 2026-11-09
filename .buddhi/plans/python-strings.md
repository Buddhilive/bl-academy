# Implementation Plan: Python Strings & Text Manipulation Lesson

**Document Path**: `.buddhi/plans/python-strings.md`  
**Target Lesson**: `src/content/lessons/python-zero-to-hero/03-strings-and-text-manipulation.mdx`  
**Track / Category**: `python` / `Python Tutorial` (Order: 3, XP: 50)  
**Parent Curriculum**: Python Zero-to-Hero (Chapter 3 / Real Python Sections 4.1–4.9)  

---

## 1. Overview & Objectives

Deliver a comprehensive, interactive lesson on text manipulation in Python under `src/content/lessons/python-zero-to-hero/03-strings-and-text-manipulation.mdx`. The lesson adheres to the W3Schools-style scannable structure, Pathfinder gamification schema, Zero-Backend Pyodide execution constraints, WCAG 2.2 AA accessibility, and AdSense word-count/depth requirements (>= 350 words, with extensive mathematical derivations and practical code examples).

---

## 2. Frontmatter & Schema Specification

The frontmatter validates against `src/content.config.ts`:

```yaml
---
title: "Strings and Text Manipulation in Python"
track: "python"
category: "Python Tutorial"
order: 3
difficulty: "beginner"
xp: 50
description: "Master Python strings: string literals, indexing, slicing, immutability, built-in methods, user input, type conversions, f-strings, and substring search."
topic: "Strings & Text Manipulation"
prerequisites: ["python-zero-to-hero/02-writing-and-running-python"]
---
```

---

## 3. Lesson Content Architecture

### 3.1 What is a String? (The `str` Data Type & Delimiters)
- **Mathematical Definition**: Formalize a string $s$ as a finite ordered sequence of characters $s = (c_0, c_1, \dots, c_{n-1})$ over an alphabet $\Sigma$, with cardinality (length) $|s| = n$.
- **Python `str` Type**: Inspecting data types via `type("Hello, world")` returning `<class 'str'>`.
- **String Literals & Delimiters**: Single quotes (`'`) vs double quotes (`"`). Nesting mismatched quotes to avoid `SyntaxError`. PEP 8 project consistency rule.
- **String Length**: Using `len(s)` to count code points (including whitespace and symbols).
- **Multiline Strings**:
  - Line continuation with backslash (`\`) to comply with PEP 8 79-character limits.
  - Triple-quoted strings (`"""` or `'''`) preserving literal newlines and indentation.
  - Docstring conventions for functions and modules.

### 3.2 Concatenation, Indexing, Slicing, and Immutability
- **String Concatenation**: Joining strings with the `+` operator.
- **Zero-Based Indexing**: Elements mapped to indices $i \in [0, n-1]$. Explain the classic off-by-one trap and `IndexError`.
- **Negative Indexing**: Backward indexing mapped via modular equivalence $-k \equiv n - k$ where $n = |s|$, yielding $s[-1]$ as the final element.
- **String Slicing**:
  - The slice syntax $s[start:end]$ extracting the half-open interval $[start, end)$ of length $\max(0, end - start)$.
  - Omitted bounds: $s[:k]$ (prefix from $0$) and $s[k:]$ (suffix to end $n$).
  - Graceful out-of-bounds behavior (no `IndexError` during slicing).
- **Immutability Contract**:
  - Strings are immutable in memory; item assignment (`word[0] = "f"`) triggers `TypeError: 'str' object does not support item assignment`.
  - Creating modified strings via slicing and concatenation ($s' = c + s[1:]$).

### 3.3 Built-in String Methods
- **Dot Notation Syntax**: `s.method()`.
- **Case Transformations**: `.lower()`, `.upper()`.
- **Whitespace Hygiene**: `.lstrip()`, `.rstrip()`, `.strip()` (and clarifying that inner whitespace is unaffected).
- **Predicate Methods**: `.startswith(prefix)` and `.endswith(suffix)` returning boolean predicates.
- Re-emphasizing that string methods return new strings and do not alter the caller in-place.

### 3.4 Interacting with User Input
- **The `input()` Function**: Prompt mechanics, terminal blocking, and standard stream behavior.
- **String Invariant**: `input()` strictly returns a `str` regardless of whether the user typed numbers.
- **Section 4.5 Challenge Pattern**: `first_letter.py` password character extraction and uppercase normalization.
- **Client-Side Worker Note**: Address how Pyodide runs in a Web Worker without synchronous terminal input, explaining why variables simulate user input in browser runners.

### 3.5 Working with Strings and Numbers
- **Type Mismatches & String Arithmetic**:
  - String concatenation (`"2" + "2" == "22"`) vs arithmetic addition ($2 + 2 = 4$).
  - String repetition (`"12" * 3 == "121212"`).
  - Invalid operations raising `TypeError` (`"3" + 3`, `"12" * "3"`).
- **Explicit Type Conversions**:
  - `int()` and `float()` parsing rules.
  - The float-to-int string conversion trap: `int("12.0")` raising `ValueError`.
  - Converting numbers back to strings via `str()` for legacy concatenation.

### 3.6 Streamlining Output with f-Strings
- **String Interpolation History**: Legacy `%` formatting and `.format()` vs PEP 498 Formatted String Literals (f-strings).
- **f-String Syntax**: Prefixing `f"..."` with inline `{expression}` evaluation.
- Expressions inside curly braces (arithmetic, method calls, variable names) evaluated at runtime.

### 3.7 Finding and Replacing Substrings
- **Substring Search**: `.find(sub)` returning the 0-based start index of first occurrence, or $-1$ on failure. Case sensitivity.
- **Substring Substitution**: `.replace(old, new)` replacing all occurrences.
- **Method Chaining**: Sequentially applying `.replace()` calls.
- **Section 4.9 Challenge Pattern**: `translate.py` (L33t H4x0r) character substitution script ($a \to 4, b \to 8, e \to 3, l \to 1, o \to 0, s \to 5, t \to 7$).

---

## 4. Interactive Components & Exercises

### 4.1 Interactive Island 1: Indexing, Slicing, and Immutability
- **Component**: `<PythonRunner client:visible title="Example 1: String Indexing, Slicing, and Immutability" />`
- **Starter Code**:
  - Inspecting positive and negative indices on `"apple pie"`.
  - Extracting substrings with half-open slices (`[0:5]`, `[6:]`, `[:]`).
  - Demonstrating string immutability and constructing a modified word (`"foal"` from `"goal"`).

### 4.2 Interactive Island 2: Methods, f-Strings, and Leetspeak Translation
- **Component**: `<PythonRunner client:visible title="Example 2: String Methods, f-Strings, and Leetspeak Translator" />`
- **Starter Code**:
  - Cleaning raw text with `.strip()`, `.lower()`, and checking `.startswith()`.
  - Modern output generation using f-strings with embedded math expressions.
  - Running the chained `.replace()` leetspeak translator on sample input `"I like to eat eggs and spam."`.

### 4.3 Reference Table
A full Markdown reference table summarizing syntax, operations, parameter types, return values, and concrete examples.

### 4.4 Conceptual Self-Check Quiz
- **Component**: `<QuizCard client:visible />`
- **Question**: Tests understanding of Python string slicing half-open intervals and negative indexing (e.g., evaluating `flavor = "apple pie"` slice `flavor[-3:]` or `flavor[0:5]`).
- **Options**: 4 plausible options, with 1 correct answer and detailed explanation of index evaluation.

---

## 5. Verification & Testing Plan

1. **Frontmatter & TypeScript Validation**:
   - Run `pnpm astro check` to verify MDX parsing, Astro component props, and Zod collection schema.
2. **Production SSG Build**:
   - Run `pnpm build` to ensure static page generation succeeds without routing or MDX syntax errors.
3. **SEO & Content Quality Checks**:
   - Word count verification: Ensure body text exceeds 350 words (target: 1,500+ words).
   - Description length: Ensure frontmatter `description` >= 30 characters.
   - LaTeX Math: Check that KaTeX formulas use standard `$math$` notation without unescaped literal dollar signs in surrounding prose.
4. **Code Execution Sandbox Safety**:
   - Confirm starter scripts in `<PythonRunner />` execute cleanly in Pyodide without unhandled `input()` or syntax errors.
