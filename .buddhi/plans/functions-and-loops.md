# Implementation Plan: Python Functions and Loops Lesson

**Document Path**: `.buddhi/plans/functions-and-loops.md`  
**Target Lesson**: `src/content/lessons/python-zero-to-hero/05-functions-and-loops.mdx`  
**Track / Category**: `python` / `Python Tutorial` (Order: 5, XP: 60)  
**Parent Curriculum**: Python Zero-to-Hero (Chapter 5 / Functions & Loops)  
**Prerequisites**: `["python-zero-to-hero/04-numbers-and-math"]`  
**Antislop Mode**: `during` (session override)

---

## 1. Overview & Pedagogical Objectives

Deliver an interactive, in-depth lesson on functions, loops, and variable scope in Python under `src/content/lessons/python-zero-to-hero/05-functions-and-loops.mdx`.

The lesson adheres strictly to the Buddhilive Academy engineering principles:
1. **Curriculum Grounding**: Faithfully mirrors Chapter 5 of *Python Zero to Hero* (Functions as values, execution lifecycle, side effects vs returns, custom functions, docstrings, Celsius/Fahrenheit conversion, while loops, infinite loop safety, for loops, `range()`, nested iteration, compound investment tracker, variable scope, LEGB rule, `UnboundLocalError`, and the `global` anti-pattern).
2. **W3Schools Architecture**: Clear conceptual overviews, syntax declarations, copyable code blocks, parameter/reference tables, self-check quiz, and "Try it Yourself" interactive execution sandboxes.
3. **SEO & AdSense Compliance**: High-value technical prose exceeding 400 words, structured with KaTeX mathematical formulas ($...$) for algebraic and algorithmic formulations.
4. **Client-Side Sandbox (Pyodide)**: Interactive execution runs purely client-side via Pyodide in a Web Worker (`/src/workers/pyodide.worker.ts`) guarded by a 5-second execution timeout.
5. **Theme & A11y Standards**: WCAG 2.2 AA contrast compliance across light and dark modes (`#A7452A` / `#E07A5F`), zero Cumulative Layout Shift (CLS) in interactive islands.

---

## 2. Frontmatter & Schema Specification

The frontmatter validates against `src/content.config.ts`:

```yaml
---
title: "Functions and Loops in Python"
track: "python"
category: "Python Tutorial"
order: 5
difficulty: "beginner"
xp: 60
description: "Master Python functions and loops: custom definitions, return values vs side effects, while and for iteration, nested loops, docstrings, and variable scope with the LEGB rule."
topic: "Functions & Loops"
prerequisites: ["python-zero-to-hero/04-numbers-and-math"]
---
```

---

## 3. Lesson Content Architecture (Detailed Outline)

### 5.1 What is a Function, Really?
- **Functions as First-Class Values**:
  - In Python, functions are first-class citizens and instances of `<class 'builtin_function_or_method'>` or `<class 'function'>`.
  - A function's identifier is a variable holding a reference to the function object in memory.
  - Cautionary analysis: Reassigning built-in names (e.g. `len = "hello"`) shadows the built-in reference in the global scope.
- **Python Function Execution Lifecycle (The 3-Step Model)**:
  1. *Call & Input*: Arguments evaluated and bound to parameters in a new stack frame.
  2. *Execution*: Interpreter executes the function body line-by-line.
  3. *Return*: Execution halts; the return expression is evaluated and replaces the function call expression at the call site.
- **Return Values vs. Side Effects**:
  - *Return Value*: Value passed back to the caller frame ($f(x) \to y$).
  - *Side Effect*: Observable interaction with the outside world (terminal output, file mutation, network socket, state mutation).
  - The `print()` vs `return` distinction: `print()` yields a screen side effect but returns `None` (`NoneType`).
  - Mathematical analogy:
    $$y = f(x) \quad \text{vs.} \quad \text{void } g(x) \implies \text{I/O}$$

### 5.2 Writing Custom Functions
- **Anatomy of a Function**:
  - Syntax breakdown: `def` keyword, identifier, formal parameters `(x, y)`, terminating colon `:`, indented body.
  - The DRY ("Don't Repeat Yourself") software engineering principle.
- **PEP 8 Indentation & Syntax Constraints**:
  - Exact four spaces per indentation level.
  - `IndentationError` prevention.
  - Definition before call (Python parses procedurally top-to-bottom).
  - Implicit return semantics: Omitting `return` or executing `return` bare evaluates to `None`.
- **Function Documentation with Docstrings**:
  - PEP 257 docstrings: Triple-quoted string literal (`"""..."""`) on the first line of the body.
  - Runtime introspection via `help(function_name)` and `function_name.__doc__`.
- **Practical Challenge 6.3: Temperature Conversion**:
  - Celsius to Fahrenheit formula:
    $$F = C \times \frac{9}{5} + 32$$
  - Fahrenheit to Celsius formula:
    $$C = (F - 32) \times \frac{5}{9}$$
  - Implementation with docstrings, type conversions, and f-string formatted output (`{temp_c:.2f}`).

### 5.3 Mastering Loops (Iteration)
- **`while` Loops (Indefinite Iteration)**:
  - Structure: Condition evaluation, body execution, control variable modification.
  - Infinite loops: Causes, hazards, and termination conditions. Pyodide 5s execution timeout watchdog protection.
- **`for` Loops (Definite Iteration)**:
  - Traversing iterables (strings, lists, tuples).
  - Pythonic iteration: Why `for char in string:` is preferred over index counters `while i < len(string):`.
- **The Built-in `range()` Sequence Generator**:
  - Overloads:
    - `range(stop)` $\to [0, \text{stop})$
    - `range(start, stop)` $\to [\text{start}, \text{stop})$
    - `range(start, stop, step)` $\to \{ \text{start} + i \cdot \text{step} \}$
  - Memory efficiency: `range` is an immutable sequence type computing elements on demand in $O(1)$ memory.
- **Nested Loops**:
  - Execution mechanics: Inner loop completes full cycle for each iteration of outer loop.
  - Iteration complexity: Total operations $N_{\text{total}} = N_{\text{outer}} \times N_{\text{inner}}$.
- **Practical Challenge 6.5: Compound Investment Tracker**:
  - Compound interest recurrence:
    $$A_{t} = A_{t-1} \times (1 + r) = A_0 \times (1 + r)^t$$
  - Implementation of `invest(amount, rate, years)` with tabular formatted yearly output (`${amount:,.2f}`).

### 5.4 Variable Scope & The LEGB Rule
- **Definition of Scope & Namespaces**:
  - Where identifiers exist, are visible, and can be accessed.
- **The LEGB Scope Resolution Hierarchy**:
  1. **L — Local**: Bound inside the active function.
  2. **E — Enclosing**: Bound in parent functions (closures / nested functions).
  3. **G — Global**: Top-level module variables.
  4. **B — Built-in**: Pre-loaded Python namespace (`len`, `range`, `abs`, `print`).
- **Scope Hierarchy Resolution Flowchart**:
  $$\text{Local} \xrightarrow{\text{miss}} \text{Enclosing} \xrightarrow{\text{miss}} \text{Global} \xrightarrow{\text{miss}} \text{Built-in} \xrightarrow{\text{miss}} \text{NameError}$$
- **The `UnboundLocalError` Trap**:
  - How Python's compiler marks any variable assigned inside a function (`x = ...`) as local to that function.
  - Reading the variable before assignment raises `UnboundLocalError`.
- **The `global` Keyword Anti-Pattern**:
  - Why modifying global state violates functional isolation and makes testing difficult.
  - Refactoring patterns: Passing state via arguments and returning new values explicitly.

---

## 4. Interactive Components & Exercises

### 4.1 Interactive Sandbox 1: Custom Functions & Temperature Converter
- **Component**: `<PythonRunner client:visible title="Example 1: Functions, Return Values & Temperature Conversion" />`
- **Initial Code**:
  ```python
  # 1. Functions are values & inspection
  print("Type of len:", type(len))

  # 2. Return value vs Side Effect
  result = print("This is printed to terminal!")
  print("Return value of print():", result)

  # 3. Custom Function with Docstring: Temperature Converter
  def convert_cel_to_far(celsius):
      """Convert degrees Celsius to degrees Fahrenheit."""
      return celsius * 9 / 5 + 32

  def convert_far_to_cel(fahrenheit):
      """Convert degrees Fahrenheit to degrees Celsius."""
      return (fahrenheit - 32) * 5 / 9

  temp_f = 72
  temp_c = convert_far_to_cel(temp_f)
  print(f"{temp_f}°F evaluates to {temp_c:.2f}°C")

  temp_c_orig = 22.22
  temp_f_calc = convert_cel_to_far(temp_c_orig)
  print(f"{temp_c_orig}°C evaluates to {temp_f_calc:.2f}°F")
  ```

### 4.2 Interactive Sandbox 2: Loops, range(), and Compound Investment Tracker
- **Component**: `<PythonRunner client:visible title="Example 2: Loops, range(), and the Investment Growth Tracker" />`
- **Initial Code**:
  ```python
  # 1. Definite iteration with for & range()
  print("--- Iterating with range(1, 4) ---")
  for i in range(1, 4):
      print(f"Step {i}")

  # 2. Indefinite iteration with while
  print("\n--- While Loop Counter ---")
  count = 3
  while count > 0:
      print(f"Countdown: {count}")
      count -= 1
  print("Liftoff!")

  # 3. Nested Loops
  print("\n--- Nested Coordinate Grid ---")
  for row in range(1, 3):
      for col in range(1, 3):
          print(f"Row {row}, Col {col}")

  # 4. Challenge 6.5: Compound Investment Tracker
  print("\n--- Investment Growth Simulation ---")
  def invest(amount, rate, years):
      """Track the annual compound growth of an investment."""
      for year in range(1, years + 1):
          amount = amount * (1 + rate)
          print(f"Year {year:2d}: ${amount:,.2f}")

  # Track $1,000 at 7% annual return for 5 years
  invest(1000, 0.07, 5)
  ```

### 4.3 Conceptual Quiz Card
- **Component**: `<QuizCard client:visible ... />`
- **Configuration**:
  - **Question**: "Consider the following code snippet:
    ```python
    counter = 10

    def increment():
        counter = counter + 1
        return counter

    increment()
    ```
    What occurs when `increment()` is executed?"
  - **Options**:
    - `"The function executes cleanly and returns 11."`
    - `"Python raises an UnboundLocalError: cannot access local variable 'counter' where it is not associated with a value."`
    - `"The global variable counter remains 10, and a new local variable is returned with value 10."`
    - `"Python raises a NameError: name 'counter' is not defined."`
  - **Correct Answer**: `1` (0-indexed: the second option, `UnboundLocalError`)
  - **Explanation**: "Because Python compiles function bodies as discrete code objects, encountering an assignment (`counter = ...`) anywhere inside `increment()` marks `counter` as a local variable for the entire scope of that function. When the right-hand side `counter + 1` is evaluated, Python searches the local scope first, finds that `counter` has not yet been assigned a value locally, and immediately raises an `UnboundLocalError` without falling back to the global scope."

---

## 5. Files to Touch

1. **Create Lesson File**:
   - `src/content/lessons/python-zero-to-hero/05-functions-and-loops.mdx`
2. **Review Existing Artifacts**:
   - `src/content/lessons/python-zero-to-hero/04-numbers-and-math.mdx` (Style & import consistency reference)
   - `src/content.config.ts` (Zod schema reference)

---

## 6. Testing & Verification Gate

1. **Static Type & Content Verification**:
   - Command: `pnpm astro check`
   - Criteria: 0 errors, full type-check pass, frontmatter schema validation success.
2. **Production SSG Build Check**:
   - Command: `pnpm build`
   - Criteria: Successful static compilation of all routes, including `/lessons/python-zero-to-hero/05-functions-and-loops`.
3. **Execution Safety**:
   - Ensure all loop examples in initial code have guaranteed finite termination bounds to prevent triggering the Pyodide Web Worker 5s watchdog timeout.
4. **Accessibility (WCAG 2.2 AA)**:
   - Ensure heading hierarchy is strictly semantic (`##`, `###`, `####`).
   - Validate that code blocks and interactive components include accessible labels and contrast ratios conforming to `DESIGN.md`.
