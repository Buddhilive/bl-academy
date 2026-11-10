# Implementation Plan: Python Zero to Hero — Chapter 11 (File I/O)

**Target**: `src/content/lessons/python-zero-to-hero/11-file-input-and-output.mdx`  
**Track**: `python`  
**Order**: `11`  
**Status**: Ready for Implementation (Awaiting User Sign-off)

---

## 1. Context & Objectives

Create an interactive lesson for **Chapter 11: File Input and Output (I/O)** following the established W3Schools-style architecture and Pathfinder gamification contract:
- Complete coverage of Chapter 11 reference materials: File systems, POSIX vs Windows paths, `pathlib.Path`, directory operations, plain text read/write with context managers, and structured tabular CSV parsing.
- Strict adherence to the Zod content schema in `src/content.config.ts`.
- High-value AdSense-compliant explanatory prose (350+ words per section) with formal mathematical/conceptual models ($...$).
- One interactive conceptual `<QuizCard client:visible />`.
- Two interactive `<PythonRunner client:visible />` sandboxes running client-side in Pyodide's Web Worker with idempotent execution.

---

## 2. Frontmatter Specification (`src/content.config.ts`)

```yaml
---
title: "File Input and Output (I/O) in Python"
track: "python"
category: "Python Tutorial"
order: 11
difficulty: "intermediate"
xp: 100
description: "Master Python file handling and filesystem operations: navigate paths with pathlib, safely read and write text files using context managers, and process tabular CSV datasets."
topic: "File Input and Output"
prerequisites: ["python-zero-to-hero/10-modules-and-packages"]
---
```

---

## 3. Lesson Structure & Pedagogical Design

### 3.1 Introduction: The Need for Persistent State
- Limitation of runtime memory and standard streams (`input()` / `print()`).
- Formal definition of a file: contiguous byte sequence $S = (b_0, b_1, \dots, b_{n-1})$ where $b_i \in \{0, \dots, 255\}$.
- Character encoding function $E: \Sigma^* \leftrightarrow \{0, \dots, 255\}^*$ (UTF-8 standard).
- Filesystem hierarchy: Directed Tree $T = (V, E)$, root node $v_{\text{root}}$, POSIX vs. Windows separator conventions.

### 3.2 Object-Oriented Path Manipulation with `pathlib`
- Introduction of `from pathlib import Path`.
- Instantiation modes: string paths, raw strings `r"..."`, `Path.home()`, `Path.cwd()`.
- The division operator (`/`) for cross-platform concatenation: $P_{\text{child}} = P_{\text{parent}} / \text{"folder"} / \text{"file.txt"}$.
- Absolute vs. relative paths and resolution mapping $R: (P_{\text{base}}, P_{\text{rel}}) \mapsto P_{\text{abs}}$.
- Inspection attributes: `.name`, `.stem`, `.suffix`, `.parent`, `.anchor`.
- Path predicates: `.exists()`, `.is_file()`, `.is_dir()`.

### 3.3 File System Traversal & Management
- Directory creation: `path.mkdir(parents=True, exist_ok=True)` avoiding `FileExistsError`.
- File creation: `path.touch()`.
- Iteration & pattern matching: `.iterdir()`, wildcard `.glob("*.txt")`, and recursive `.rglob("*.png")`.
- File lifecycle operations: `.replace()` (atomic move/rename) and `.unlink(missing_ok=True)`.
- Directory deletion safety: `dir.rmdir()` vs. `shutil.rmtree()`.

### 3.4 Conceptual Checkpoint (`<QuizCard client:visible />`)
- **Question**: Tests understanding of `pathlib.Path` operator overloading, directory creation safety (`parents=True`, `exist_ok=True`), and exception-safe deletion.
- Immediate feedback with explanatory breakdown.

### 3.5 Reading and Writing Plain Text Files
- The context manager invariant: `with path.open(mode="...", encoding="utf-8") as file:`.
  - Invariant guarantee: deterministic teardown $\mathcal{F} \to \emptyset$ in $\mathcal{O}(1)$ time regardless of runtime exceptions.
- Modes: `"r"` (read), `"w"` (overwrite/create), `"a"` (append).
- Read mechanics & complexity:
  - `file.read()`: Reads entire payload into string ($\mathcal{O}(N)$ memory).
  - `file.readlines()`: Reads all lines into list of strings ($\mathcal{O}(N)$ memory).
  - `for line in file:`: Generator streaming line-by-line ($\mathcal{O}(1)$ memory buffer).
- Write mechanics: `file.write()` and `file.writelines()`.

### 3.6 Structured Tabular Data with the `csv` Module
- Tabular matrix structure: $M \in \mathcal{T}^{R \times C}$.
- List-based processing:
  - `csv.writer` with `newline=""`.
  - `csv.reader` and explicit type coercion from string tokens.
- Dictionary-based processing:
  - `csv.DictReader` extracting `.fieldnames` and yielding row dictionaries.
  - `csv.DictWriter` requiring `writeheader()` and `writerows()`.

### 3.7 Interactive Sandboxes (`<PythonRunner client:visible />`)

#### Sandbox 1: Filesystem Scaffolding & Pattern Matching (`pathlib`)
- **Scenario**: Scaffolds a project hierarchy (`workspace/reports`, `workspace/images`, `workspace/logs`), touches multiple files, filters logs using `.glob("*.log")`, and reports matching stems and sizes.
- **Pyodide Guarantee**: Uses relative paths inside Pyodide's MEMFS with `parents=True` and `exist_ok=True` for 100% idempotent execution.
- **Expected Output**:
  ```text
  Workspace initialized.
  Discovered log files:
  - error_2026.log (stem: error_2026, suffix: .log)
  - system_audit.log (stem: system_audit, suffix: .log)
  Total logs found: 2
  ```

#### Sandbox 2: Tabular Data Pipeline (`csv.DictReader` & `csv.DictWriter`)
- **Scenario**: Reads an input dataset of player scores (`name,game,score`), aggregates each player's highest score using a dictionary, and writes the summarized leaderboard to `high_scores.csv` using `csv.DictWriter`.
- **Pyodide Guarantee**: Generates in-memory CSV file, processes records, writes aggregated CSV, and prints verification table without external dependencies.
- **Expected Output**:
  ```text
  Processing raw score logs...
  Aggregated High Scores:
  - Alice: 940
  - Bob: 880
  - Charlie: 910
  Leaderboard saved to high_scores.csv successfully.
  ```

### 3.8 Chapter Summary & Best Practices
- Cross-platform path handling best practices.
- Mandatory UTF-8 encoding specification.
- Memory-safe streaming iteration for large files.
- Tabular schema mapping with `csv.DictReader`.

---

## 4. Verification & Testing Strategy

1. **Static Type & Astro Content Validation**:
   ```bash
   pnpm astro check
   ```
   *Validates Zod frontmatter schema, types, and MDX component props.*

2. **Production SSG Build Verification**:
   ```bash
   pnpm build
   ```
   *Verifies MDX compilation, KaTeX math parsing, React island bundling, and route generation.*

3. **Client-Side Sandbox Idempotency Audit**:
   *Verify that repeated runs of both sandboxes inside Pyodide complete within < 1000ms (well under the 5s watchdog) and do not produce collision errors.*
