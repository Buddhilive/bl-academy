# Implementation Plan: Python Numbers and Math Lesson

**Document Path**: `.buddhi/plans/python-numbers-math.md`  
**Target Lesson**: `src/content/lessons/python-zero-to-hero/04-numbers-and-math.mdx`  
**Track / Category**: `python` / `Python Tutorial` (Order: 4, XP: 50)  
**Parent Curriculum**: Python Zero-to-Hero (Chapter 4 / Numbers and Math)  
**Prerequisites**: `["python-zero-to-hero/03-strings-and-text-manipulation"]`

---

## 1. Overview & Pedagogical Objectives

Deliver a comprehensive, interactive lesson on numbers, mathematical expressions, and numerical methods in Python under `src/content/lessons/python-zero-to-hero/04-numbers-and-math.mdx`. 

The lesson follows the proven W3Schools-style scannable structure, Pathfinder gamification schema, Zero-Backend Pyodide execution constraints, WCAG 2.2 AA accessibility, and AdSense word-count/depth standards (>= 350 words, with rich mathematical formulations, execution tables, and interactive sandboxes).

All topics and code snippets are strictly grounded in Chapter 4 of the curriculum context:
1. Built-in number types (`int`, `float`, underscores, arbitrary precision, E-notation, infinity).
2. Arithmetic operators (`+`, `-`, `*`, `/`, `//`, `**`, `%`, float promotion, floor division with negatives, division by zero, operator precedence, PEP 8 spacing).
3. Floating-point representation errors (Base 10 vs Base 2, infinite binary fractions, IEEE 754 approximations, `0.1 + 0.2`).
4. Math functions and number methods (`round()` with banker's rounding, `abs()`, `pow(x, y, z)` modular exponentiation, `.is_integer()`).
5. Formatting numbers in strings (f-strings with `:.2f`, `:,.2f`, `:.0%` / `:.2%`).
6. Complex numbers (`real + imag j`, `.real`, `.imag`, `.conjugate()`, unsupported `//`, duck-typing across numeric primitives).
7. Code challenges & practical examples (`exponent.py`, integer difference validation).

---

## 2. Frontmatter & Schema Specification

The frontmatter validates strictly against `src/content.config.ts`:

```yaml
---
title: "Numbers and Math in Python"
track: "python"
category: "Python Tutorial"
order: 4
difficulty: "beginner"
xp: 50
description: "Master Python numbers: integers, floats, arithmetic operators, floor division caveats, floating-point representation errors, math functions, f-strings, and complex numbers."
topic: "Numbers & Math"
prerequisites: ["python-zero-to-hero/03-strings-and-text-manipulation"]
---
```

---

## 3. Lesson Content Architecture (Detailed Outline)

### 4.1 Built-in Number Types: Integers and Floating-Point Numbers
- **Integers (`int`)**:
  - Definition: Whole numbers with no fractional component ($n \in \mathbb{Z}$).
  - Construction: Direct integer literals or explicit type conversion via `int()`.
  - Visual Digit Separators: Underscores (`_`) to format large numbers (e.g. `25_000_000` vs `25000000`). PEP 515 rules—ignored by interpreter, purely for human readability.
  - Arbitrary Precision: Unlike languages with fixed-width 32-bit or 64-bit integers (e.g., C, Java), Python integers possess **unlimited precision**, bounded solely by available machine RAM.
- **Floating-Point Numbers (`float`)**:
  - Definition: Real numbers containing a decimal point ($x \in \mathbb{R}$).
  - Construction: Direct literals, `float()`, or scientific exponential notation (**E-notation**).
  - E-Notation Mechanics: $1\text{e}6 = 1 \times 10^6 = 1,000,000.0$, and $1\text{e-}4 = 1 \times 10^{-4} = 0.0001$.
  - Maximum Finite Bounds: Python floats conform to IEEE 754 double precision (64-bit). Exceeding maximum magnitude evaluates to `inf` or `-inf`.

### 4.2 Arithmetic Operators and Expressions
- **The Seven Arithmetic Operators Table**:
  - `+` (Addition): $a + b$
  - `-` (Subtraction): $a - b$
  - `*` (Multiplication): $a \times b$
  - `/` (True Division): Always returns `float`, even for clean divisions ($9 / 3 = 3.0$).
  - `//` (Integer / Floor Division): Rounds down to the nearest lower integer ($5.0 // 2 = 2.0$).
  - `**` (Exponentiation): $x^y$.
  - `%` (Modulus): Computes remainder $r = x - (y \times (x // y))$.
- **Execution Rules & Nuances**:
  - **Float Promotion**: Mixing `int` with `float` in any arithmetic operation automatically promotes the result to `float` ($3 + 2.0 = 5.0$).
  - **Floor Division with Negatives**: Rounds toward $-\infty$. Emphasize why `-3 // 2` yields `-2` (since $-1.5$ rounds down to $-2$), a common pitfall for newcomers.
  - **Division by Zero**: Dividing by zero with `/`, `//`, or `%` triggers a runtime `ZeroDivisionError`.
  - **Modulus Application**: Parity checks (`n % 2 == 0`). Modulus with negative operands using Python's mathematical definition.
  - **Operator Precedence & PEP 8 Spacing**: Order of operations: `**` > `*`, `/`, `//`, `%` > `+`, `-`. PEP 8 style advises adding whitespace around lower-precedence operators in complex expressions (`x = 4/2 + 2**3`).

### 4.3 Floating-Point Representation Errors
- **The Classical Dilemma**: Why `0.1 + 0.2` outputs `0.30000000000000004` rather than `0.3`.
- **Base 10 vs. Base 2 (Binary)**:
  - In base 10, fractions terminate if and only if the denominator's prime factors are 2 and 5. For example, $1/3$ produces an infinitely repeating decimal $0.3333\dots$.
  - In base 2 (binary), fractions terminate only if the denominator is a power of 2.
  - The decimal fraction $1/10 = 0.1_{10}$ becomes an infinitely repeating binary fraction:
    $$\frac{1}{10} = 0.0001100110011\dots_2$$
- **Finite Storage & Inaccuracies**: Because computers store floats in fixed 64-bit IEEE 754 registers, numbers are truncated approximations. Adding two binary approximations accumulates small rounding discrepancies exposed upon conversion back to decimal.

### 4.4 Math Functions and Number Methods
- **`round(number, ndigits)`**:
  - Precision parameter: `round(3.14159, 2)` $\to$ `3.14`.
  - **Banker's Rounding (Round Ties to Even)**: When equidistant from two integers (ending in `.5`), Python rounds to the nearest **even** integer. Compare `round(2.5) == 2` with `round(3.5) == 4`. Explain statistical rationale: eliminates upward rounding accumulation bias.
- **`abs(number)`**:
  - Computes $|x|$. Preserves operand type: `abs(-5)` returns `5` (`int`), while `abs(-5.0)` returns `5.0` (`float`).
- **`pow(x, y, [z])`**:
  - Standard power: `pow(2, 3)` returns `8`.
  - Three-argument modular exponentiation: `pow(x, y, z)` computes $(x^y) \pmod z$ using binary exponentiation, far faster and memory-bounded compared to `(x ** y) % z`.
- **Float Method `.is_integer()`**:
  - Tests whether a float represents an exact whole number: `(2.0).is_integer()` returns `True`; `(2.5).is_integer()` returns `False`.

### 4.5 Formatting Numbers in Strings (f-Strings)
- **Formatting Specification Syntax**: Adding `:spec` after expressions inside f-strings `{value:spec}`.
- **Fixed-Point Formatting (`:.2f`)**: Limits decimals and rounds to 2 decimal places (following ties-to-even).
- **Thousand Separators (`:,.2f`)**: Inserts comma separators for large financial values (`$1,743.65`).
- **Percentage Formatting (`:.0%`, `:.2%`)**: Automatically multiplies by 100 and formats with `%` symbol.

### 4.6 Complex Numbers
- **Python Complex Number Representation**: Written as `real + imag j` (e.g. `1 + 2j`).
- **Attributes & Methods**:
  - Attributes: `.real` (`float`) and `.imag` (`float`).
  - Method: `.conjugate()` returning $a - bj$.
- **Arithmetic Constraints**: Supports `+`, `-`, `*`, `/`, `**`. Floor division `//` is undefined for complex numbers and raises a `TypeError`.
- **Numeric Polymorphism**: Note that `int` and `float` also implement `.real`, `.imag`, and `.conjugate()` for duck-typing compatibility.

### 4.7 Code Challenges & Practical Examples
- **Exponent Calculation Script (`exponent.py`)**: Calculating powers with user inputs, handling float conversion and formatted printing.
- **Integer Difference Validation Script**: Testing if the difference between two floating-point numbers is integral via `.is_integer()`.

---

## 4. Interactive Components & Exercises

### 4.1 Interactive Island 1: Types, Arithmetic Operators, and Representation Caveats
- **Component**: `<PythonRunner client:visible title="Example 1: Numeric Types, Operators, and Representation Caveats" />`
- **Initial Code**:
  ```python
  # 1. Integers with underscores and large precision
  large_num = 25_000_000
  print("Underscore Integer:", large_num, "| Type:", type(large_num))

  # 2. Floats and E-notation
  speed_of_light = 3e8
  planck_const = 6.626e-34
  print("Speed of light (m/s):", speed_of_light)
  print("Planck constant:", planck_const)

  # 3. Division vs Floor Division (Notice positive vs negative behavior!)
  print("\n--- Division Mechanics ---")
  print("9 / 3     =", 9 / 3)       # Always float: 3.0
  print("5.0 // 2  =", 5.0 // 2)    # 2.0
  print("-3 // 2   =", -3 // 2)     # -2 (rounds down toward -inf!)
  print("16 % 5    =", 16 % 5)      # 1

  # 4. Floating-Point Representation Inaccuracy
  print("\n--- Floating-Point Representation ---")
  sum_floats = 0.1 + 0.2
  print("0.1 + 0.2 =", sum_floats)
  print("Is 0.1 + 0.2 == 0.3?", sum_floats == 0.3)
  ```

### 4.2 Interactive Island 2: Math Functions, f-Strings, Complex Numbers, and Challenges
- **Component**: `<PythonRunner client:visible title="Example 2: Math Functions, f-Strings, Complex Numbers & Challenges" />`
- **Initial Code**:
  ```python
  # 1. Rounding ties to even (Banker's Rounding)
  print("round(2.5)   =", round(2.5))    # 2
  print("round(3.5)   =", round(3.5))    # 4
  print("round(3.14159, 2) =", round(3.14159, 2))

  # 2. Math functions: abs, pow, is_integer
  print("abs(-42.0)   =", abs(-42.0))
  print("pow(2, 3, 5) =", pow(2, 3, 5))  # (2**3) % 5 = 8 % 5 = 3
  val = 4.0
  print(f"{val} is integer?", val.is_integer())

  # 3. Formatting with f-strings
  balance = 1254367.892
  ratio = 0.854
  print("\n--- f-String Formatting ---")
  print(f"Account Balance : ${balance:,.2f}")
  print(f"Completion Rate : {ratio:.1%}")

  # 4. Complex numbers
  z = 3 + 4j
  print("\n--- Complex Numbers ---")
  print("Complex z     :", z)
  print("Real part     :", z.real)
  print("Imag part     :", z.imag)
  print("Conjugate     :", z.conjugate())

  # 5. Challenge: Integer Difference Validation
  num1 = 7.5
  num2 = 2.5
  diff = num1 - num2
  print(f"\nDifference between {num1} and {num2} is integral? {diff.is_integer()} (Value = {diff})")
  ```

### 4.3 QuizCard Conceptual Check
- **Component**: `<QuizCard client:visible />`
- **Question**: "What are the evaluated results of the expressions `-7 // 2` and `round(2.5)` in Python 3?"
- **Options**:
  1. `-3` and `3`
  2. `-4` and `2`
  3. `-3` and `2`
  4. `-4` and `3`
- **Correct Index**: `1`
- **Explanation**: "Floor division (`//`) rounds down toward $-\infty$. Since $-7 / 2 = -3.5$, rounding down to the nearest lower integer evaluates to `-4`. Furthermore, Python 3 implements Banker's Rounding ('round half to even') where numbers ending in exact `.5` round to the nearest even number. Thus, `round(2.5)` rounds down to `2`, while `round(3.5)` would round up to `4`."

---

## 5. Quick Reference Table Layout

A clean markdown summary table will be placed before the QuizCard:

| Category | Syntax / Operator | Return Type | Description & Example |
| :--- | :--- | :---: | :--- |
| **Addition** | `x + y` | `int` or `float` | Sums two numbers; returns `float` if any operand is float. |
| **Subtraction** | `x - y` | `int` or `float` | Subtracts `y` from `x`. |
| **Multiplication**| `x * y` | `int` or `float` | Multiplies two numbers. |
| **True Division** | `x / y` | `float` | Divides `x` by `y`; always returns float (`4 / 2 -> 2.0`). |
| **Floor Division**| `x // y` | `int` or `float` | Divides and rounds down toward $-\infty$ (`-3 // 2 -> -2`). |
| **Exponent** | `x ** y` | `int` or `float` | Raises `x` to power `y`. |
| **Modulus** | `x % y` | `int` or `float` | Returns division remainder ($x - y \times (x // y)$). |
| **Round** | `round(x, n)` | `int` or `float` | Rounds to `n` digits; ties round to nearest even integer. |
| **Absolute** | `abs(x)` | `int` or `float` | Returns $|x|$ while preserving the numeric type. |
| **Power** | `pow(x, y, z)` | `int` | Modular exponentiation $(x^y) \pmod z$. |
| **Float Method**| `f.is_integer()`| `bool` | Returns `True` if float has no fractional part. |
| **Formatting** | `f"{x:,.2f}"` | `str` | Fixed-point 2 decimals with comma thousand separators. |
| **Percentage** | `f"{x:.1%}"` | `str` | Multiplies by 100 and formats with `%`. |
| **Complex** | `z.real`, `z.imag`, `z.conjugate()` | `float` / `complex` | Extracts components or computes conjugate; `//` raises `TypeError`. |

---

## 6. Implementation Steps

1. **Create File**: Write `src/content/lessons/python-zero-to-hero/04-numbers-and-math.mdx` using the detailed content architecture, LaTeX formulas, code snippets, and imports.
2. **Typecheck & Astro Check**: Execute `pnpm astro check` to confirm frontmatter Zod validation and MDX syntax.
3. **Production SSG Build Verification**: Run `pnpm build` to verify static site generation without errors.
4. **Contrast & Theme Validation**: Ensure all markdown and interactive blocks adhere to WCAG 2.2 AA.

---

## 7. Verification & Testing

- **Astro Check**: `pnpm astro check` succeeds with 0 errors across content collections.
- **Build Verification**: `pnpm build` creates the static page `/lessons/python-zero-to-hero/04-numbers-and-math/` without issues.
- **AdSense & Word Count Verification**: Total explanatory prose exceeds 500+ words with rich LaTeX math formulas.
- **Interactive Component Verification**: Both `<PythonRunner />` blocks contain valid Python 3 code compatible with browser Pyodide runtime.
