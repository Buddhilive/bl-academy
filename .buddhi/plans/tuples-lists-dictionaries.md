# Implementation Plan: Tuples, Lists, and Dictionaries (Chapter 8)

**Document Path**: `.buddhi/plans/tuples-lists-dictionaries.md`  
**Target Lesson**: `src/content/lessons/python-zero-to-hero/08-tuples-lists-and-dictionaries.mdx`  
**Track / Category**: `python` / `Python Tutorial` (Order: 8, XP: 80)  
**Parent Curriculum**: Python Zero-to-Hero (Chapter 8 / Compound Data Structures)  
**Prerequisites**: `["python-zero-to-hero/07-conditional-logic-and-control-flow"]`  
**Antislop Mode**: `during` (session override)

---

## 1. Overview & Pedagogical Objectives

Deliver an interactive, mathematically sound, and comprehensive lesson covering Python's core compound data structures—**tuples**, **lists**, and **dictionaries**—under `src/content/lessons/python-zero-to-hero/08-tuples-lists-and-dictionaries.mdx`.

The lesson complies strictly with the Buddhilive Academy engineering principles and content contract:
1. **Curriculum Grounding**: Fully addresses all topics from Chapter 8:
   - **8.1 Tuples: Immutable Sequences**: Tuple literals, empty tuples `()`, the single-element comma pitfall `(1,)` vs `(1)`, `tuple()` constructor and `TypeError` on non-iterables, indexing and slicing, immutability guarantees, sequence iteration, membership testing (`in`), tuple packing/unpacking, and returning multiple values from functions.
   - **8.2 Lists: Mutable Sequences**: List literals `[...]`, `list()` constructor, string `.split()`, in-place item and slice assignment, essential methods (`.append()`, `.extend()`, `.insert()`, `.pop()`), the in-place mutation return value pitfall (`append()` returns `None`), built-in aggregate functions (`sum()`, `min()`, `max()`), and list comprehensions with type conversion/filtering.
   - **8.3 Nesting, Copying, and Sorting**: Multi-dimensional matrices `matrix[row][col]`, reference semantics vs object copies, shallow copy via slice `a[:]` / `a.copy()` vs deep copy via `copy.deepcopy()`, and in-place sorting `.sort(key=...)` vs functional sorting with `sorted()`.
   - **8.4 Dictionaries: Key-Value Mappings**: Associative hashing concept, dictionary literals, key lookup and `KeyError`, mutation (`add`, `update`, `del`), membership checking on keys, iteration patterns (`dict.keys()`, `dict.values()`, `dict.items()`), and hashability rules (immutable keys vs `TypeError: unhashable type: 'list'`).
   - **8.5 Choosing the Right Data Structure**: Decision matrix comparing lists, tuples, and dictionaries on ordering, mutability, time complexity ($\mathcal{O}(1)$ average hash lookup vs $\mathcal{O}(n)$ sequence scan), and idiomatic use cases.
2. **W3Schools Model + Pathfinder Gamification**:
   - Quick conceptual summary and syntax block for every topic.
   - Copyable code examples with clear annotations.
   - Reference/method lookup tables (list methods, tuple operations, dictionary methods, time complexities).
   - High-value AdSense prose (>1,500 words) using KaTeX notation ($n$-tuples, $\mathcal{O}(1)$ vs $\mathcal{O}(n)$, matrix coordinate notation $M_{i,j}$).
   - Pre-allocated zero-CLS containers and WCAG 2.2 AA compliant palette (`#A7452A` light, `#E07A5F` dark).
3. **Zero-Backend Client-Side Execution**:
   - Interactive islands using `<PythonRunner client:visible />` powered by Pyodide v0.26+ in a dedicated Web Worker with 5-second execution watchdog.
   - Conceptual validation island `<QuizCard client:visible />` testing critical edge cases (e.g. key hashability and mutation side-effects).

---

## 2. Frontmatter & Schema Specification

Validates against `src/content.config.ts`:

```yaml
---
title: "Tuples, Lists, and Dictionaries in Python"
track: "python"
category: "Python Tutorial"
order: 8
difficulty: "beginner"
xp: 80
description: "Master Python compound data structures: immutable tuples, mutable lists, hash-mapped dictionaries, shallow vs deep copying, list comprehensions, and data structure selection."
topic: "Compound Data Structures"
prerequisites: ["python-zero-to-hero/07-conditional-logic-and-control-flow"]
---
```

---

## 3. Lesson Content Architecture (Detailed Outline)

### 8.0 Introduction: From Primitives to Compound Structures
- Contrast primitive scalar data types (`int`, `float`, `str`, `bool`) with collection types.
- Why compound data structures are necessary for real-world domains (coordinate geometry, tabular data, key-value configurations).

### 8.1 Tuples: Immutable Sequences
- **Mathematical Foundation**: An ordered $k$-tuple $\tau = (x_1, x_2, \dots, x_k)$ where order is preserved and elements are indexed $0 \le i < k$.
- **Syntactic Forms**:
  - Literal syntax: `(1, 2.0, "three")`
  - Empty tuple: `()`
  - Single-element tuple: `(1,)` with deep explanation of why `(1)` is evaluated as parenthesized scalar expression of type `int`.
  - Type casting: `tuple("Python")` produces `('P', 'y', 't', 'h', 'o', 'n')`; passing non-iterables raises `TypeError`.
- **Operations & Immutability**:
  - Length `len()`, indexing `t[0]`, slicing `t[1:3]` ($\mathcal{O}(1)$ indexing, $\mathcal{O}(k)$ slice creation).
  - Immutability enforcement: Attempting `t[0] = 99` triggers `TypeError: 'tuple' object does not support item assignment`.
  - Membership testing via `in` ($\mathcal{O}(n)$ linear scan).
- **Packing, Unpacking & Multiple Return Values**:
  - Implicit tuple packing: `point = 10, 20`
  - Unpacking assignment: `x, y = point`; structural size mismatch triggers `ValueError: too many values to unpack (expected 2, got 3)`.
  - Returning multiple values from functions: `def min_max(seq): return min(seq), max(seq)`.

### 8.2 Lists: Mutable Sequences
- **Definition**: Dynamic, contiguous, mutable arrays holding references to arbitrary objects.
- **Instantiation Patterns**:
  - List literals: `[1, 2, 3]`
  - Iterable conversion: `list((1, 2, 3))`
  - String tokenization: `"apples, oranges, bananas".split(", ")`
- **In-Place Mutation**:
  - Single index reassignment: `items[0] = "val"`
  - Slice replacement: `items[1:3] = ["a", "b", "c"]` (dynamic resize capability).
- **Core List Methods (Reference Table)**:
  | Method | Signature | Mutation Target | Return Value | Complexity |
  | :--- | :--- | :--- | :--- | :--- |
  | `.append(x)` | `append(object)` | Adds single element to list tail | `None` | $\mathcal{O}(1)$ amortized |
  | `.extend(iterable)` | `extend(iterable)` | Unpacks and appends iterable elements | `None` | $\mathcal{O}(k)$ |
  | `.insert(i, x)` | `insert(index, object)` | Inserts `x` before index `i`, shifts right | `None` | $\mathcal{O}(n)$ |
  | `.pop(i)` | `pop([index])` | Removes and returns item at index (default last) | Removed object | $\mathcal{O}(1)$ tail / $\mathcal{O}(n)$ head |
- **The In-Place Return Pitfall**:
  - Highlight common beginner bug: `my_list = my_list.append("item")` assigning `None` to `my_list`.
- **Numeric Aggregate Functions**:
  - `sum(nums)`, `min(nums)`, `max(nums)`.
- **List Comprehensions**:
  - Syntax anatomy: `[expression for item in iterable if condition]`.
  - Mathematical set-builder correspondence: $\{ x^2 \mid x \in S, x > 0 \}$.
  - Concrete examples: parsing strings to floats `[float(x) for x in raw_data]`, filtering evens.

### 8.3 Nesting, Copying, and Sorting
- **Nested Structures & Multi-Dimensional Matrices**:
  - 2D grid representation: `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]`.
  - Matrix index notation: accessing cell $M_{r, c}$ via `matrix[r][c]`.
- **Object Identity vs Value Equality: Reference Semantics**:
  - Pointer aliasing: `b = a` assigns pointer reference, not memory copy (`id(a) == id(b)`).
  - Shallow copy: `copy_list = original[:]` or `original.copy()`. Creates new outer list, but inner mutable objects share memory addresses!
  - Deep copy: `import copy; deep = copy.deepcopy(nested_matrix)`. Recursively duplicates all nested containers.
- **In-Place Mutation vs Functional Sorting**:
  - In-place `.sort(key=..., reverse=...)` mutates caller in place ($\mathcal{O}(n \log n)$ Timsort), returns `None`.
  - Functional `sorted(iterable, key=...)` returns a new sorted list, leaving original sequence unchanged.
  - Custom key functions: `words.sort(key=len)`.

### 8.4 Dictionaries: Key-Value Associative Mappings
- **Conceptual Model**:
  - Hash tables / associative arrays mapping unique keys to values with $\mathcal{O}(1)$ average-time complexity.
- **Syntax & Access Patterns**:
  - Dictionary literal: `capitals = {"France": "Paris", "Japan": "Tokyo"}`.
  - Direct key indexing: `capitals["Japan"]`.
  - Non-existent key lookup raises `KeyError`. Safe lookup alternatives: `dict.get(key, default)`.
- **Mutation & Deletion**:
  - Adding/Updating: `capitals["Spain"] = "Madrid"`.
  - Deleting: `del capitals["France"]` or `.pop("France")`.
- **Dictionary Iteration**:
  - Default iteration loops over keys: `for key in capitals:`.
  - Pair iteration via `.items()`: `for key, val in capitals.items():`.
  - Value iteration: `for val in capitals.values():`.
- **Key Hashability Contract**:
  - A key **must be immutable and hashable** (`str`, `int`, `float`, `tuple` containing immutable items).
  - Mutable containers (`list`, `dict`, `set`) cannot be hashed. Attempting `{[1, 2]: "val"}` raises `TypeError: unhashable type: 'list'`.
  - Mathematical intuition of hashing: $h(k) \pmod m$ bucket indexing requires an invariant hash value over the object's lifetime.

### 8.5 Choosing the Right Data Structure (Decision Matrix)
- Comparative Decision Table:
  | Data Structure | Ordering | Mutability | Indexing Model | Key Lookup Time | Primary Use Case |
  | :--- | :--- | :--- | :--- | :--- | :--- |
  | **List** (`list`) | Ordered (insertion sequence) | Mutable | Zero-based integer index | $\mathcal{O}(n)$ search | Dynamic collections, sequential stacks, queue buffers |
  | **Tuple** (`tuple`) | Ordered (insertion sequence) | Immutable | Zero-based integer index | $\mathcal{O}(n)$ search | Fixed records, multi-value function returns, dictionary keys |
  | **Dictionary** (`dict`) | Key-insertion ordered (Python 3.7+) | Mutable | Unique hashable key | $\mathcal{O}(1)$ average | Associative lookups, frequency tables, relational entity maps |

---

## 4. Interactive Components & Execution Islands

### Component 1: Conceptual Self-Check (`<QuizCard />`)
- **Placement**: Right after Section 8.4 (Key Hashability and Immutability rules).
- **Question**: "Which of the following expressions will raise an unhandled `TypeError` in Python when executed?"
- **Options**:
  1. `user_records = {("John", "Doe"): 101, ("Jane", "Smith"): 102}`
  2. `coordinates = (42.0,)`
  3. `cache = {[1, 2, 3]: "cluster_alpha"}`
  4. `scores = {"Alice": [95, 88, 92], "Bob": [78, 85, 90]}`
- **Correct Answer**: Option 3 (Index 2 in 0-based indexing).
- **Explanation**: "Dictionary keys must be hashable and immutable. Lists are mutable and do not implement `__hash__()`, so passing a list as a dictionary key immediately triggers `TypeError: unhashable type: 'list'`. Tuples containing immutable items (Option 1) are hashable and valid keys, and dictionary values (Option 4) can be mutable lists."

### Component 2: Interactive Sandbox 1 (`<PythonRunner />` — List Operations & Comprehensions)
- **Title**: "Interactive Sandbox: List Transformation & Dynamic Comprehensions"
- **Expected Output**:
  ```text
  Original temperatures: ['20.5C', '18.2C', '25.0C', '30.1C', '15.4C']
  Extracted Celsius floats: [20.5, 18.2, 25.0, 30.1, 15.4]
  Fahrenheit conversions (>= 70F): [77.0, 86.18]
  Stats: Min = 15.4C, Max = 30.1C, Average = 21.84C
  ```
- **Focus**: Tests list slicing, `.split()`, float conversion list comprehension, mathematical filtering, and numeric aggregations (`sum`, `min`, `max`).

### Component 3: Interactive Sandbox 2 (`<PythonRunner />` — Nested Matrix & Dictionary Frequency Map)
- **Title**: "Interactive Sandbox: Dictionary Word Frequency & Tabular Aggregation"
- **Expected Output**:
  ```text
  Inventory Summary:
  - apples: 45 units ($1.20/ea) -> Subtotal: $54.00
  - bananas: 120 units ($0.50/ea) -> Subtotal: $60.00
  - oranges: 30 units ($1.50/ea) -> Subtotal: $45.00
  Total Inventory Valuation: $159.00
  ```
- **Focus**: Tests dictionary iteration (`.items()`), nested dictionaries, dynamic key insertion, value calculations, and formatted output strings.

---

## 5. Algorithmic and Mathematical Rigor

1. **Mathematical Sequence Notation**:
   - Represent tuples and lists as finite ordered sequences $\mathbf{x} = \langle x_0, x_1, \dots, x_{n-1} \rangle$.
   - Slicing notation: $\mathbf{x}[i:j] = \langle x_k \mid i \le k < j \rangle$.
2. **Computational Complexity Analysis**:
   - Lookup by index: $\mathcal{O}(1)$ for both list and tuple.
   - Lookup by key: $\mathcal{O}(1)$ average for dictionary via hash function $h(k) \pmod m$; collision resolution via open addressing.
   - Lookup by value (linear search): $\mathcal{O}(n)$ using `in` operator on list/tuple.
   - Mutation at end: `.append()` is amortized $\mathcal{O}(1)$; dynamic array resizing factor $\sim 1.125 \times$.
   - Mutation at arbitrary index: `.insert(0, val)` is $\mathcal{O}(n)$ due to contiguous memory block shifting.
3. **Set-Builder Logic for Comprehensions**:
   - Compare Python list comprehension syntax with formal set builder:
     $$L = \{ f(x) \mid x \in S \land P(x) \}$$

---

## 6. Engineering & Style Standards

1. **Accessibility & Contrast**:
   - Validated against WCAG 2.2 AA (4.5:1 normal text, 3:1 bold/large).
   - Keyboard navigable execution buttons and focus rings (`:focus-visible`).
2. **Zero Layout Shift (CLS)**:
   - `<PythonRunner />` and `<QuizCard />` render inside predetermined CSS containment boxes to eliminate reflow during hydration.
3. **Pyodide Client-Side Sandbox**:
   - 100% browser execution via Web Worker (`src/workers/pyodide.worker.ts`).
   - 5000ms watchdog prevents infinite loops.
4. **Prose Density**:
   - Over 1,500 words of rigorous technical prose.
   - Use alerts (`> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`) to emphasize memory referencing and mutation side-effects.

---

## 7. Implementation Steps & Verification Protocol

1. **File Creation**:
   - Create `src/content/lessons/python-zero-to-hero/08-tuples-lists-and-dictionaries.mdx`.
2. **Type & Schema Verification**:
   - Execute `pnpm astro check` to confirm frontmatter Zod schema validity and MDX component imports.
3. **Astro Build Verification**:
   - Execute `pnpm build` to ensure static page generation succeeds with zero errors.
4. **A11y & Contrast Check**:
   - Validate contrast ratios and ensure interactive components meet standard AA profile.
