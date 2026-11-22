#!/usr/bin/env python3
"""Verification script for Course 07: Harness Engineering."""

import argparse
import ast
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(r"c:\DevDojo\Buddhi\bl-academy")
LESSONS_DIR = ROOT / "src" / "content" / "lessons" / "harness-engineering"
NOTEBOOKS_DIR = ROOT / "notebook" / "harness-engineering"

REQUIRED_FRONTMATTER_KEYS = [
    "title",
    "track",
    "category",
    "order",
    "difficulty",
    "xp",
    "description",
    "topic",
    "prerequisites",
]


def parse_orders(orders_arg: str) -> set[int]:
    result: set[int] = set()
    for part in orders_arg.split(","):
        part = part.strip()
        if "-" in part:
            start, end = part.split("-", 1)
            result.update(range(int(start), int(end) + 1))
        else:
            result.add(int(part))
    return result


def extract_mdx_parts(text: str) -> tuple[str, str]:
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n(.*)$", text, re.DOTALL)
    if not match:
        raise ValueError("Missing YAML frontmatter")
    return match.group(1), match.group(2)


def count_prose_words(body: str) -> int:
    # Strip imports, JSX tags, fenced code blocks, and math blocks
    cleaned = re.sub(r"^import\s+.*$", "", body, flags=re.MULTILINE)
    cleaned = re.sub(r"```.*?```", " ", cleaned, flags=re.DOTALL)
    cleaned = re.sub(r"<PythonRunner[\s\S]*?/>", " ", cleaned)
    cleaned = re.sub(r"<ColabButton[\s\S]*?/>", " ", cleaned)
    cleaned = re.sub(r"<QuizCard[\s\S]*?/>", " ", cleaned)
    cleaned = re.sub(r"\$\$.*?\$\$", " ", cleaned, flags=re.DOTALL)
    return len(re.findall(r"\b\w+\b", cleaned))


def check_unescaped_currency(body: str) -> list[str]:
    # Remove fenced code blocks, JSX blocks, and inline code
    no_code = re.sub(r"```.*?```", " ", body, flags=re.DOTALL)
    no_code = re.sub(r"<PythonRunner[\s\S]*?/>", " ", no_code)
    no_code = re.sub(r"`[^`]+`", " ", no_code)
    no_code = re.sub(r"\$\$.*?\$\$", " ", no_code, flags=re.DOTALL)
    errors = []
    for idx, line in enumerate(no_code.splitlines(), 1):
        # Flag $<digit> not preceded by backslash or $
        if re.search(r"(?<![\\$])\$\d", line):
            errors.append(f"Line {idx}: unescaped currency $: {line.strip()[:80]}")
    return errors


def extract_python_runner(body: str) -> tuple[str, str | None]:
    m = re.search(r"<PythonRunner\b([\s\S]*?)/>", body)
    if not m:
        raise ValueError("Missing <PythonRunner /> component")
    attrs = m.group(1)
    code_match = re.search(r"initialCode=\{\s*`([\s\S]*?)`\s*\}", attrs)
    if not code_match:
        raise ValueError("Missing initialCode={`...`} in <PythonRunner />")
    code = code_match.group(1).replace("\\`", "`").replace("\\${", "${")

    exp_match = re.search(r'expectedOutput="([\s\S]*?)"', attrs)
    expected = exp_match.group(1) if exp_match else None
    return code, expected


def verify_lesson(mdx_path: Path) -> list[str]:
    errors: list[str] = []
    text = mdx_path.read_text(encoding="utf-8")
    if ".ref/" in text:
        errors.append("Contains forbidden '.ref/' reference")

    fm, body = extract_mdx_parts(text)
    for key in REQUIRED_FRONTMATTER_KEYS:
        if not re.search(rf"^{key}:", fm, re.MULTILINE):
            errors.append(f"Missing frontmatter key: {key}")

    if 'track: "harness-engineering"' not in fm and "track: 'harness-engineering'" not in fm:
        errors.append("Frontmatter track must be 'harness-engineering'")

    words = count_prose_words(body)
    if words < 350:
        errors.append(f"Prose word count {words} < 350")

    if "<ColabButton" not in body:
        errors.append("Missing <ColabButton />")
    if "<QuizCard" not in body:
        errors.append("Missing <QuizCard />")
    if "| " not in body or "| :---" not in body and "| ---" not in body:
        if "|---" not in body and "| :" not in body:
            errors.append("Missing markdown reference table")

    errors.extend(check_unescaped_currency(body))

    try:
        py_code, expected = extract_python_runner(body)
        ast.parse(py_code)
        proc = subprocess.run(
            [sys.executable, "-c", py_code],
            capture_output=True,
            text=True,
            timeout=4,
            encoding="utf-8",
        )
        if proc.returncode != 0:
            errors.append(f"PythonRunner execution failed: {proc.stderr.strip()}")
        elif expected is not None:
            if proc.stdout.strip() != expected.strip():
                errors.append(
                    f"PythonRunner output mismatch:\nExpected:\n{expected.strip()}\nGot:\n{proc.stdout.strip()}"
                )
    except Exception as exc:
        errors.append(f"PythonRunner check failed: {exc}")

    # Check matching notebook
    nb_path = NOTEBOOKS_DIR / f"{mdx_path.stem}.ipynb"
    if not nb_path.exists():
        errors.append(f"Missing companion notebook: {nb_path.name}")
    else:
        try:
            nb = json.loads(nb_path.read_text(encoding="utf-8"))
            if nb.get("nbformat") != 4:
                errors.append("Notebook nbformat != 4")
            if ".ref/" in json.dumps(nb):
                errors.append("Notebook contains forbidden '.ref/' reference")
            code_cells = [c for c in nb.get("cells", []) if c.get("cell_type") == "code"]
            if not code_cells:
                errors.append("Notebook has no code cells")
            for i, cell in enumerate(code_cells):
                src = "".join(cell.get("source", []))
                # Filter Colab !pip / %magics before ast.parse
                py_lines = [
                    ln for ln in src.splitlines() if not ln.lstrip().startswith(("!", "%"))
                ]
                ast.parse("\n".join(py_lines))
        except Exception as exc:
            errors.append(f"Notebook validation failed ({nb_path.name}): {exc}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--orders", default="1-24")
    args = parser.parse_args()
    target_orders = parse_orders(args.orders)

    mdx_files = sorted(LESSONS_DIR.glob("*.mdx"))
    found_orders: dict[int, Path] = {}
    for f in mdx_files:
        m = re.match(r"^(\d+)-", f.name)
        if m:
            found_orders[int(m.group(1))] = f

    total_errors = 0
    for order in sorted(target_orders):
        if order not in found_orders:
            print(f"[FAIL] Order {order:02d}: missing MDX file")
            total_errors += 1
            continue
        mdx_path = found_orders[order]
        errs = verify_lesson(mdx_path)
        if errs:
            print(f"[FAIL] {mdx_path.name}:")
            for e in errs:
                print(f"  - {e}")
            total_errors += len(errs)
        else:
            print(f"[PASS] {mdx_path.name} + {mdx_path.stem}.ipynb")

    return 1 if total_errors > 0 else 0


if __name__ == "__main__":
    raise SystemExit(main())
