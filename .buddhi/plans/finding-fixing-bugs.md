# Implementation Plan: Finding and Fixing Code Bugs (Chapter 6)

**Document Path**: `.buddhi/plans/finding-fixing-bugs.md`  
**Target Lesson**: `src/content/lessons/python-zero-to-hero/06-finding-and-fixing-code-bugs.mdx`  
**Track / Category**: `python` / `Python Tutorial` (Order: 6, XP: 60)  
**Parent Curriculum**: Python Zero-to-Hero (Chapter 6 / Debugging & Errors)  
**Prerequisites**: `["python-zero-to-hero/05-functions-and-loops"]`  
**Antislop Mode**: `during` (session override)

---

## 1. Overview & Pedagogical Objectives

Deliver an interactive, comprehensive, and accessible lesson on identifying and debugging Python software bugs under `src/content/lessons/python-zero-to-hero/06-finding-and-fixing-code-bugs.mdx`.

The lesson adheres strictly to the Buddhilive Academy engineering principles and content contract:
1. **Curriculum Grounding**: Strictly adheres to the Chapter 6 syllabus:
   - Three classifications of software errors: syntax errors, run-time errors (tracebacks), and logic errors (bugs).
   - The IDLE Debug Control Window (`[DEBUG ON]`), its core panels (**Stack** and **Locals**), and execution control buttons (**Step**, **Go**, **Over**, **Out**, **Quit**).
   - Setting **Breakpoints** to pause execution at targeted lines.
   - The structured **4-Step Debugging Process** (Guess $\to$ Breakpoint/Inspect $\to$ Identify/Fix $\to$ Repeat/Verify).
   - Practical case study: Debugging the `add_underscores(word)` logic error (`"o_"` vs `"_h_e_l_l_o_"`).
   - Alternative debugging via temporary `print()` statements (pros and cons).
   - Pythonic refactoring: iterating directly over characters (`for char in word:`) vs index-based iteration (`range(0, len(word))`), plus algorithmic complexity of string concatenation ($\mathcal{O}(n^2)$ vs $\mathcal{O}(n)$).
2. **W3Schools Architecture**: Scannable sections, visual panels/button reference tables, step-by-step state tracking tables, copyable code blocks, conceptual quiz, and interactive client-side execution sandboxes.
3. **SEO & AdSense Compliance**: In-depth explanatory prose exceeding 600 words with KaTeX mathematical formulas ($\sum_{i=1}^n i = \mathcal{O}(n^2)$) and callouts (`> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`).
4. **Zero-Backend Client-Side Sandbox**: Interactive code execution runs purely in-browser via Pyodide in a dedicated Web Worker (`/src/workers/pyodide.worker.ts`) guarded by a 5-second execution timeout.
5. **Theme & A11y Standards**: WCAG 2.2 AA contrast compliance across light and dark modes (`#A7452A` / `#E07A5F`), zero Cumulative Layout Shift (CLS), and keyboard-navigable interactive islands.

---

## 2. Frontmatter & Schema Specification

The frontmatter validates strictly against `src/content.config.ts`:

```yaml
---
title: "Finding and Fixing Code Bugs in Python"
track: "python"
category: "Python Tutorial"
order: 6
difficulty: "beginner"
xp: 60
description: "Master Python debugging: learn the difference between syntax, runtime, and logic errors, inspect program state using IDLE's Debugger, set breakpoints, and apply the 4-step debugging cycle."
topic: "Debugging & Errors"
prerequisites: ["python-zero-to-hero/05-functions-and-loops"]
---
```

---

## 3. Lesson Content Architecture (Detailed Outline)

### 6.1 Understanding Software Errors: Syntax, Runtime, and Logic Errors
- **The Error Hierarchy**:
  - **Syntax Errors**: Detected by the interpreter during compilation/parsing before execution begins (e.g. missing colon, unbalanced parenthesis).
  - **Runtime Errors (Exceptions)**: Occur while the program is actively executing, causing Python to halt and print a **traceback** (e.g. `ZeroDivisionError`, `TypeError`, `IndexError`).
  - **Logic Errors (Bugs)**: The program executes cleanly without crashing, but the computed output deviates from specification.
  - Formal definition:
    $$\text{Program}(x) \downarrow \land \; \text{Output}(x) \neq \text{Expected}(x)$$
  - Why logic errors are the most insidious: interpreters cannot automatically flag or identify them.

### 6.2 The IDLE Debug Control Window & Inspection Architecture
- **Activating Debug Mode**:
  - Access via IDLE Shell: `Debug -> Debugger`.
  - The shell prompt transitions to `[DEBUG ON]`.
- **The Core Inspection Panels**:
  - **Stack Panel**: Displays the call stack frames and the active line Python is poised to evaluate (e.g., `'__main__'.<module>()` or nested function frames).
  - **Locals Panel**: Real-time snapshot of the current namespace mapping identifiers to their bound values.
- **Debugger Control Operations (Reference Table)**:
  | Button | Action | Best Used When |
  | :--- | :--- | :--- |
  | **Step** | Executes the current statement and pauses immediately at the next statement. | Line-by-line inspection to observe variable mutation in the **Locals** panel. |
  | **Go** | Resumes execution at normal speed until hitting a breakpoint or reaching script termination. | Skipping past boilerplate initialization code to arrive at targeted sections. |
  | **Over** | Executes a subroutine (function or loop) at full speed without stepping through internal lines. | When calling a known-working helper or built-in function that does not contain bugs. |
  | **Out** | Runs the remainder of the current function body and pauses immediately upon returning to caller. | Escaping a deeply nested function or loop once its internal state has been verified. |
  | **Quit** | Terminates the active debugging session immediately. | Exiting debug mode. *(Warning: Always exit via Go or Quit to prevent IDLE session lockups)*. |
- **Breakpoints**:
  - Visual indicator: Yellow highlighting in IDLE script editor.
  - Strategic role: Eliminating manual stepping through uninteresting setup lines.

### 6.3 The 4-Step Debugging Workflow
A systematic protocol for isolating and eliminating logic errors:
1. **Step 1: Make a Hypothesis (Guess the Bug Location)**:
   - Deconstruct program architecture into caller blocks and subroutines.
   - Eliminate stable inputs to isolate questionable logic blocks.
2. **Step 2: Set a Breakpoint & Inspect Program State**:
   - Pause execution right before entering the suspected block.
   - Cross-examine the **Locals** panel against theoretical expectations.
3. **Step 3: Identify the Discrepancy & Apply the Fix**:
   - Detect where variable state diverges from the mental model.
   - Adjust statements (e.g. accumulation vs overwrite).
4. **Step 4: Verify Resolution Across Test Cases**:
   - Re-run with breakpoints or edge-case arguments to prove stability.

### 6.4 Practical Case Study: Debugging `add_underscores()`
- **The Buggy Implementation**:
  ```python
  def add_underscores(word):
      new_word = "_"
      for i in range(0, len(word)):
          new_word = word[i] + "_"
      return new_word

  phrase = "hello"
  print(add_underscores(phrase))  # Unexpected output: 'o_'
  ```
- **Step-by-Step State Matrix (Bug Analysis)**:
  | Loop Iteration ($i$) | Character `word[i]` | Computed `word[i] + "_"` | Variable `new_word` in Locals | Expected Value |
  | :--- | :--- | :--- | :--- | :--- |
  | Initial (pre-loop) | — | — | `"_"` | `"_"` |
  | $i = 0$ | `'h'` | `'h_'` | `'h_'` (Overwritten!) | `'_h_'` |
  | $i = 1$ | `'e'` | `'e_'` | `'e_'` (Overwritten!) | `'_h_e_'` |
  | $i = 2$ | `'l'` | `'l_'` | `'l_'` (Overwritten!) | `'_h_e_l_'` |
  | $i = 3$ | `'l'` | `'l_'` | `'l_'` (Overwritten!) | `'_h_e_l_l_'` |
  | $i = 4$ | `'o'` | `'o_'` | `'o_'` (Final return value) | `'_h_e_l_l_o_'` |
- **Root Cause & Correction**:
  - Reassignment `new_word = ...` discarded the prefix accumulator.
  - Corrected expression: `new_word = new_word + word[i] + "_"`.
- **Post-Fix State Matrix**:
  - Verification that the accumulator monotonically grows with each iteration step until `"_h_e_l_l_o_"` is produced.

### 6.5 Alternative Techniques & Pythonic Refactoring
- **Print Statement Debugging**:
  - Inserting temporary inspection statements: `print(f"i = {i}; new_word = {new_word}")`.
  - Trade-offs: Low cognitive overhead for quick scripts vs terminal output clutter and risk of forgetting to clean up debug artifacts before shipping.
- **Pythonic Refactoring (Direct Character Iteration)**:
  - Eliminating unnecessary indexing: `for char in word:` replaces `for i in range(0, len(word)):`.
- **String Concatenation Complexity**:
  - In Python, strings are immutable. Each `new_word + char + "_"` creates an entirely new string in memory.
  - Sum of copied characters for string of length $n$:
    $$T(n) = \sum_{k=1}^n k = \frac{n(n + 1)}{2} = \mathcal{O}(n^2)$$
  - Advanced alternative: using list accumulation and `str.join()` for linear $\mathcal{O}(n)$ time complexity.

---

## 4. Interactive Components Specification

### 4.1 Concept Quiz: `<QuizCard client:visible />`
- **Location**: Placed immediately following Section 6.2 (The IDLE Debugger & Error Types) before entering the hands-on code section.
- **Question**: "You are debugging a Python script using IDLE's Debug Control Window. You have paused execution at a breakpoint right before a loop that calculates a running total. You want to execute the loop line-by-line to watch how the 'total' variable updates in the Locals panel after each iteration. Which debugger button should you click?"
- **Options**:
  1. "Click **Go** to immediately advance to the end of the script."
  2. "Click **Step** repeatedly to execute one statement at a time and inspect the updated variable in the Locals panel."
  3. "Click **Over** to skip the loop and terminate the program."
  4. "Click **Quit** to reset the variable to zero."
- **Correct Answer**: Index `1` (second option).
- **Explanation**: "The **Step** button advances code execution by exactly one statement, immediately pausing before the next line. This allows you to monitor how variables evolve inside the **Locals** panel after each step. In contrast, **Go** runs continuously until a breakpoint, **Over** executes subroutines/loops without stepping through their internal lines, and **Quit** exits the debugging session."

### 4.2 Interactive Code Islands: `<PythonRunner client:visible />`

#### Island 1: Interactive Debugging Sandbox (`add_underscores`)
- **Title**: "Try It Yourself: Diagnosing and Fixing the Logic Bug"
- **Task**: The starter code contains the buggy `add_underscores` function that outputs `'o_'`. The user modifies line 5 to accumulate onto `new_word` and runs the code to verify against `_h_e_l_l_o_`.
- **Props**:
  - `title="Fixing Logic Bug: add_underscores()"`
  - `expectedOutput="_h_e_l_l_o_"`
  - `initialCode`:
    ```python
    def add_underscores(word):
        new_word = "_"
        for i in range(0, len(word)):
            # BUG: This overwrites new_word on each iteration!
            # Fix this line so that it concatenates onto existing new_word:
            new_word = word[i] + "_"
        return new_word

    phrase = "hello"
    print(add_underscores(phrase))
    ```

#### Island 2: Print Debugging & Pythonic Refactoring Sandbox
- **Title**: "Try It Yourself: Print Debugging and Pythonic Iteration"
- **Task**: Inspect the character-by-character accumulator using formatted print statements, then refactor into idiomatic Python.
- **Props**:
  - `title="Refactoring: Direct Character Iteration"`
  - `expectedOutput="_P_y_t_h_o_n_"`
  - `initialCode`:
    ```python
    def add_underscores_pythonic(word):
        """Surround every character with underscores using direct iteration."""
        new_word = "_"
        for char in word:
            new_word = new_word + char + "_"
        return new_word

    sample = "Python"
    result = add_underscores_pythonic(sample)
    print(result)
    ```

---

## 5. Files to Create / Modify

| File | Operation | Description |
| :--- | :--- | :--- |
| `src/content/lessons/python-zero-to-hero/06-finding-and-fixing-code-bugs.mdx` | **Create** | The complete interactive lesson containing >600 words of prose, syntax definitions, debugger UI breakdown, 4-step workflow, quiz card, and two Python runners. |

---

## 6. Verification & Quality Gates

1. **Astro Schema & Types Check**:
   - Run `pnpm astro check` to verify MDX frontmatter parsing against `src/content.config.ts` (ensuring `title`, `track`, `category`, `order: 6`, `difficulty`, `xp`, `description` min 30 chars, and `prerequisites` are valid).
2. **Pyodide Island Execution**:
   - Test in Pyodide test runner or verify that initial Python code in both `<PythonRunner />` islands parses and runs without syntax errors.
3. **Word Count & SEO Gate**:
   - Verify file content exceeds 350+ words of explanatory prose (target: ~700 words) with structured KaTeX math notation.
4. **Accessibility (WCAG 2.2 AA) & Anti-Slop**:
   - Semantic heading hierarchy (`## 6.1`, `###`, etc.).
   - Accessible table headers (`th`, `td`).
   - High contrast code snippets and alert blocks (`> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`).
   - Zero generic slop or repetitive filler text.
