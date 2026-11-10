# Implementation Plan: Conditional Logic and Control Flow (Chapter 7)

**Document Path**: `.buddhi/plans/conditional-logic.md`  
**Target Lesson**: `src/content/lessons/python-zero-to-hero/07-conditional-logic-and-control-flow.mdx`  
**Track / Category**: `python` / `Python Tutorial` (Order: 7, XP: 70)  
**Parent Curriculum**: Python Zero-to-Hero (Chapter 7 / Conditional Logic & Control Flow)  
**Prerequisites**: `["python-zero-to-hero/06-finding-and-fixing-code-bugs"]`  
**Antislop Mode**: `during` (session override)

---

## 1. Overview & Pedagogical Objectives

Deliver an interactive, rigorous, and accessible lesson covering conditional logic, control flow, exception handling, and Monte Carlo probabilistic simulation under `src/content/lessons/python-zero-to-hero/07-conditional-logic-and-control-flow.mdx`.

The lesson adheres strictly to the Buddhilive Academy engineering principles and content contract:
1. **Curriculum Grounding**: Faithfully mirrors Chapter 7 (sections 8.1–8.9 in reference text):
   - **8.1 Comparing Values**: The `bool` primitive (`True`, `False`), the six standard comparison operators (`<`, `<=`, `==`, `>=`, `>`, `!=`), lexicographical string comparison via Unicode code points, and the `=` vs `==` assignment pitfall.
   - **8.2 Logical Operators & Compound Expressions**: Boolean algebra with `and`, `or`, and `not`; inclusive vs exclusive OR; strict operator precedence rules ($\text{Comparators} \succ \text{not} \succ \text{and} \succ \text{or}$); parentheses grouping.
   - **8.3 Branching Control with `if`, `elif`, `else`**: Mutually exclusive branches, short-circuit execution of first matching block, refactoring nested conditional pyramids into flat, readable compounds.
   - **8.4 Practical Challenge (Factors)**: Modular arithmetic definition ($a \equiv 0 \pmod b$), divisor calculation algorithm, algorithmic complexity ($\mathcal{O}(n)$ scan).
   - **8.5 Loop Control (`break`, `continue`, `for...else`)**: Premature loop termination (`break`), skipping iterations (`continue`), and the distinctive Pythonic `for...else` / `while...else` construct (no-break fallback).
   - **8.6 Defensive Error Handling (`try` / `except`)**: Exception hierarchy, common runtime exceptions (`ValueError`, `TypeError`, `NameError`, `ZeroDivisionError`, `OverflowError`), targeted exception catching vs the bare `except:` anti-pattern.
   - **8.7–8.9 Probabilistic Simulations & Monte Carlo Experiments**: The Law of Large Numbers, pseudorandom generation via `random.randint()` and `random.random()`, fair coin toss simulation, and multi-region mayoral election probability modeling ($P(\text{Win}) = P(\sum_{i=1}^3 \mathbb{I}_{r_i} \ge 2)$).
2. **W3Schools Architecture**: Clear conceptual overviews, syntax definition blocks, comparison and precedence reference tables, copyable code examples, a conceptual self-check quiz, and interactive client-side execution islands.
3. **SEO & AdSense Compliance**: Substantial conceptual prose (>1,500 words) formatted with KaTeX mathematical formulas ($\mathcal{O}(n)$, $a \pmod b = 0$, $\sum_{i=1}^k \mathbb{I}(X_i)$) and callouts (`> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`).
4. **Client-Side Sandbox (Zero Backend)**: Interactive Python execution runs purely client-side via Pyodide v0.26+ in a dedicated Web Worker (`/src/workers/pyodide.worker.ts`) guarded by a 5-second termination watchdog.
5. **Theme & A11y Standards**: WCAG 2.2 AA contrast compliance across light and dark modes (`#A7452A` / `#E07A5F`), zero Cumulative Layout Shift (CLS) with fixed containers, and keyboard-navigable interactive islands.

---

## 2. Frontmatter & Schema Specification

The frontmatter validates strictly against `src/content.config.ts`:

```yaml
---
title: "Conditional Logic and Control Flow in Python"
track: "python"
category: "Python Tutorial"
order: 7
difficulty: "beginner"
xp: 70
description: "Master Python conditional logic: boolean comparators, logical operators, if-elif-else branching, break/continue, for-else loops, try-except blocks, and Monte Carlo simulations."
topic: "Control Flow & Logic"
prerequisites: ["python-zero-to-hero/06-finding-and-fixing-code-bugs"]
---
```

---

## 3. Lesson Content Architecture (Detailed Outline)

### 7.1 Comparing Values and Boolean Primitives (8.1)
- **The `bool` Type**:
  - Python's boolean type is a subclass of `int` (`issubclass(bool, int) is True`), where `True == 1` and `False == 0`.
- **The Six Boolean Comparators (Reference Table)**:
  | Operator | Description | Formal Logic | Example | Result |
  | :--- | :--- | :--- | :--- | :--- |
  | `==` | Equality | $a = b$ | `4 == 4` | `True` |
  | `!=` | Inequality | $a \neq b$ | `1 != 2` | `True` |
  | `<` | Strictly less than | $a < b$ | `3 < 5` | `True` |
  | `<=` | Less than or equal to | $a \le b$ | `5 <= 5` | `True` |
  | `>` | Strictly greater than | $a > b$ | `7 > 10` | `False` |
  | `>=` | Greater than or equal to | $a \ge b$ | `10 >= 5` | `True` |
- **String Comparisons & Lexicographical Ordering**:
  - Strings are evaluated character-by-character based on Unicode code points (`ord(c)`).
  - Why `"apple" < "astronaut"` (`"p"` vs `"s"`), and case sensitivity: `"Z" < "a"` because uppercase ASCII (65–90) precedes lowercase ASCII (97–122).
- **The Assignment vs. Equality Pitfall**:
  - Danger of using `=` (mutation/assignment) instead of `==` (equality testing), leading to `SyntaxError: invalid syntax`.

### 7.2 Compound Expressions & Boolean Algebra (8.2)
- **Logical Operators**:
  - `and`: Conjunction ($A \land B$); requires both truth values.
  - `or`: Inclusive disjunction ($A \lor B$); true if at least one operand is true.
  - `not`: Negation ($\neg A$); inverts truth polarity.
- **Truth Tables & Truth Matrix**:
  | $A$ | $B$ | `not A` | `A and B` | `A or B` |
  | :--- | :--- | :--- | :--- | :--- |
  | `True` | `True` | `False` | `True` | `True` |
  | `True` | `False` | `False` | `False` | `True` |
  | `False` | `True` | `True` | `False` | `True` |
  | `False` | `False` | `True` | `False` | `False` |
- **Operator Precedence Hierarchy**:
  $$\text{Comparators } (<, \le, ==, \ge, >, \neq) \quad \succ \quad \text{not} \quad \succ \quad \text{and} \quad \succ \quad \text{or}$$
  - Step-by-step algebraic evaluation walkthrough:
    $$\left(\text{"A"} \neq \text{"A"}\right) \lor \neg\left(2 \ge 3\right) \implies \text{False} \lor \neg(\text{False}) \implies \text{False} \lor \text{True} \implies \text{True}$$
  - Why parentheses must be used for semantic clarity and disambiguation.

### 7.3 Branching Execution: `if`, `elif`, and `else` (8.3)
- **The Single-Branch `if`**: Guarded execution.
- **The Two-Branch `if...else`**: Exhaustive bifurcation ($P \lor \neg P$).
- **The Multi-Branch `if...elif...else`**: Chained exclusive alternatives.
  - Short-circuit rule: Python executes *only* the first matching block and skips the rest.
- **Refactoring Nested Pyramids into Flat Compounds**:
  - Anti-pattern: 4-level deep nested `if` statements.
  - Pythonic refactoring: Combining guards using `and` / `or` to preserve flat readability (PEP 20: *"Flat is better than nested"*).

### 7.4 Practical Challenge: Finding Factors of an Integer (8.4)
- **Mathematical Definition**: An integer $d$ is a factor of $n$ if and only if $n \pmod d = 0$.
- **Algorithm Walkthrough**:
  - Linear scan: Iterating $i \in [1, n]$ and printing $i$ when `n % i == 0`.
  - Algorithmic time complexity analysis: $\mathcal{O}(n)$ vs optimized $\mathcal{O}(\sqrt{n})$.

### 7.5 Fine-Grained Loop Control: `break`, `continue`, and `for...else` (8.5)
- **`break`**: Immediate loop termination and jump to statement after loop body.
- **`continue`**: Immediate jump to the next loop iteration, bypassing remaining block code.
- **The `for...else` / `while...else` Construct**:
  - Semantics: The `else` clause runs if and only if the loop terminates normally (without hitting a `break`).
  - Search algorithm pattern: Searching a character/element; if found, `break`; `else` signals "not found" cleanly without boolean flag variables.

### 7.6 Robust Error Handling: `try` and `except` (8.6)
- **Runtime Exceptions vs Program Termination**:
  - How unhandled exceptions crash processes and raise tracebacks.
- **The Built-in Exception Hierarchy (Key Classes)**:
  - `ValueError`: Type matches, but invalid value representation (e.g. `int("abc")`).
  - `TypeError`: Incompatible type operation (e.g. `'2' + 2`).
  - `NameError`: Unbound variable identifier lookup failure.
  - `ZeroDivisionError`: Division or modulo by zero ($x / 0$).
  - `OverflowError`: Numerical calculation exceeding platform float representations.
- **Catching Specific Exceptions vs The Bare `except:` Anti-Pattern**:
  - Why bare `except:` is dangerous (swallows `KeyboardInterrupt`, `SystemExit`, and masking typos).
  - Idiomatic multi-exception handling: `except (TypeError, ValueError) as err:`.

### 7.7 Probabilistic Simulations & Monte Carlo Experiments (8.7–8.9)
- **The Monte Carlo Method**:
  - Using empirical, repeated pseudorandom sampling to converge on theoretical probabilities (Law of Large Numbers: $\lim_{N \to \infty} \frac{1}{N}\sum_{i=1}^N X_i = \mathbb{E}[X]$).
- **Python's `random` Module**:
  - `random.randint(a, b)`: Discrete uniform distribution $U\{a, b\}$.
  - `random.random()`: Continuous uniform distribution $U[0.0, 1.0)$.
- **Experiment 1: Fair Coin Toss Simulation**:
  - Tracking heads vs tails over 10,000 trials; calculating ratio $\frac{N_{\text{heads}}}{N_{\text{tails}}} \approx 1.0$.
- **Experiment 2: Multi-Region Election Simulation (8.9)**:
  - Modeling 3 regions with independent winning probabilities: $p_1 = 0.87, p_2 = 0.65, p_3 = 0.17$.
  - Bernoulli trials: $r_i = 1 \iff U[0, 1) < p_i$.
  - Victory condition: $r_1 + r_2 + r_3 \ge 2$.
  - Monte Carlo estimation over 10,000 trials to compute simulated win percentage.

---

## 4. Interactive Components & Sandboxes

### Interactive Island 1: `<QuizCard client:visible />`
- **Location**: Inserted right after Section 7.2 (Operator Precedence & Boolean Logic).
- **Question**: Tests evaluation of compound logical expression with mixed comparators, `not`, `and`, and `or`.
  - Question: *"What is the evaluated result of the compound expression: `('Python' < 'python') and not (10 % 3 == 0) or (4 >= 5)`?"*
  - Options:
    1. `True`
    2. `False`
    3. `SyntaxError`
    4. `None`
  - Correct Answer: `0` (`True`)
  - Explanation: Breaks down step-by-step:
    1. `'Python' < 'python'` is `True` because uppercase `'P'` (ASCII 80) has a smaller code point than lowercase `'p'` (ASCII 112).
    2. `10 % 3 == 0` is `1 == 0` which is `False`. `not False` evaluates to `True`.
    3. `4 >= 5` is `False`.
    4. `True and True` yields `True`.
    5. `True or False` yields `True`.

### Interactive Island 2: `<PythonRunner client:visible />` (Finding Factors)
- **Location**: Inserted in Section 7.4 (Practical Challenge: Finding Factors).
- **Title**: *"Interactive Sandbox: Factor Finding with Modulus"*
- **Starter Code**:
  ```python
  def find_factors(num):
      """Find and print all positive integer factors of num."""
      print(f"Factors of {num}:")
      for i in range(1, num + 1):
          if num % i == 0:
              print(f"  {i} is a factor of {num}")

  # Test with integer 12
  find_factors(12)
  ```
- **Expected Output**:
  ```
  Factors of 12:
    1 is a factor of 12
    2 is a factor of 12
    3 is a factor of 12
    4 is a factor of 12
    6 is a factor of 12
    12 is a factor of 12
  ```

### Interactive Island 3: `<PythonRunner client:visible />` (Monte Carlo Simulation)
- **Location**: Inserted in Section 7.7 (Probabilistic Simulation & Monte Carlo Experiments).
- **Title**: *"Interactive Sandbox: Multi-Region Election Monte Carlo Simulation"*
- **Starter Code**:
  ```python
  import random

  def simulate_election(trials=10_000):
      candidate_a_wins = 0
      
      for _ in range(trials):
          # Candidate A wins each region if random draw < probability
          reg1 = random.random() < 0.87
          reg2 = random.random() < 0.65
          reg3 = random.random() < 0.17
          
          # Needs at least 2 regions to win the election
          if (reg1 + reg2 + reg3) >= 2:
              candidate_a_wins += 1
              
      win_pct = (candidate_a_wins / trials) * 100
      print(f"Simulated {trials:,} elections.")
      print(f"Candidate A Win Probability: {win_pct:.2f}%")

  simulate_election(10_000)
  ```

---

## 5. Implementation Steps & Validation

1. **Create MDX File**:
   - Write `src/content/lessons/python-zero-to-hero/07-conditional-logic-and-control-flow.mdx`.
   - Include all 7 conceptual sections, detailed tables, KaTeX equations, 1 `QuizCard`, and 2 `PythonRunner` islands.
2. **Typecheck & Astro Check**:
   - Execute `pnpm astro check` via the terminal to verify frontmatter Zod schema compliance and MDX syntax validity.
3. **Build Verification**:
   - Execute `pnpm build` to verify static site generation without SSG compilation errors.
4. **Delivery Audit**:
   - Verify word count (>1,500 words), responsive layout, zero CLS, and contrast standards.
