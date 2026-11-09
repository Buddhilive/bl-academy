# Implementation Plan: Object-Oriented Programming (OOP) in Python (Chapter 9)

**Document Path**: `.buddhi/plans/object-oriented-programming.md`  
**Target Lesson**: `src/content/lessons/python-zero-to-hero/09-object-oriented-programming.mdx`  
**Track / Category**: `python` / `Python Tutorial` (Order: 9, XP: 90)  
**Parent Curriculum**: Python Zero-to-Hero (Chapter 9: Object-Oriented Programming)  
**Prerequisites**: `["python-zero-to-hero/08-tuples-lists-and-dictionaries"]`  
**Antislop Mode**: `during` (session override)

---

## 1. Overview & Pedagogical Objectives

Deliver an interactive, mathematically rigorous, and comprehensive lesson covering Python's **Object-Oriented Programming (OOP)** paradigm under `src/content/lessons/python-zero-to-hero/09-object-oriented-programming.mdx`.

The lesson complies strictly with the Buddhilive Academy engineering principles and content contract:
1. **Curriculum Grounding**: Fully addresses all sections from the provided Chapter 9/10 lesson context:
   - **9.1 Defining a Class and Initializing Attributes**: Distinguishing classes (blueprints) from instances (concrete objects). CamelCase naming, 4-space indentation rules, the `pass` placeholder, the `.__init__()` initializer, the `self` parameter (reference to the calling instance), and the critical difference between class attributes (shared namespace) and instance attributes (unique to each object instance).
   - **9.2 Instantiating Objects, Accessing Data, and Methods**: Calling the class constructor, dot notation attribute access, dynamic attribute mutability, defining instance methods, dunder methods (`.__str__()` for human-readable output vs default memory hex representation), and the practical `Car` model (color, mileage, `drive()`).
   - **9.3 Inheritance, Method Overriding, and `super()`**: Base (parent) vs derived (child) classes, implicit inheritance from `object`, overriding methods, extending parent functionality using `super()`, runtime type introspection via `isinstance()`, and the geometric `Rectangle` and `Square` hierarchy.
   - **9.4 Practical Challenge: Modeling a Farm Simulation**: Designing an extensible object model with base `Animal(name, age, sound)` and specialized subclasses `Cow` and `Chicken`, implementing behaviors (`make_sound()`, `eat()`, `produce_milk()`, `lay_egg()`).
2. **W3Schools Model + Pathfinder Gamification**:
   - Quick conceptual summary and syntax block for every topic.
   - Clean, copyable code examples with detailed step-by-step annotations.
   - Reference/comparison tables (Class vs Instance attributes, Dunder methods, Inheritance terms).
   - High-value AdSense prose (>1,500 words) using KaTeX notation (modeling objects as state-transition tuples $\mathcal{M} = (S, \Sigma, \delta, s_0)$, MRO linearization, geometric formulas $A = l \times w$).
   - Pre-allocated zero-CLS layout containers and WCAG 2.2 AA compliant palette (`#A7452A` light, `#E07A5F` dark).
3. **Zero-Backend Client-Side Execution**:
   - Interactive islands using `<PythonRunner client:visible />` powered by Pyodide v0.26+ in a dedicated Web Worker with 5-second execution watchdog.
   - Conceptual validation island `<QuizCard client:visible />` testing class vs instance attribute scoping and mutation pitfalls before moving to the execution sandboxes.

---

## 2. Frontmatter & Schema Specification

Strictly validates against `src/content.config.ts`:

```yaml
---
title: "Object-Oriented Programming (OOP) in Python"
track: "python"
category: "Python Tutorial"
order: 9
difficulty: "beginner"
xp: 90
description: "Master Python Object-Oriented Programming: classes, instances, constructors, instance vs class attributes, methods, __str__, inheritance, super(), and polymorphism."
topic: "Object-Oriented Programming"
prerequisites: ["python-zero-to-hero/08-tuples-lists-and-dictionaries"]
---
```

---

## 3. Lesson Content Architecture (Detailed Outline)

### 9.0 Introduction: The Object-Oriented Paradigm
- **From Procedural to Object-Oriented**:
  - Contrast procedural programming (isolated functions operating on disconnected primitive data structures) with OOP (bundling state and behavior into coherent autonomous entities).
  - The Assembly Line mental model: Objects hold raw data (attributes) and apply dedicated operations (methods) to transition between states.
- **Formal State Representation**:
  - Representing an object as an encapsulated state machine:
    $$\mathcal{O} = \langle S, \mathcal{A}, \mathcal{M} \rangle$$
    where $S$ represents internal state (attributes), $\mathcal{A}$ denotes access interfaces, and $\mathcal{M}$ represents state-mutating methods.

### 9.1 Defining Classes and Initializing State
- **Class vs Instance Conceptual Dichotomy**:
  - **Class**: The abstract blueprint, schema, or type specification (no concrete data).
  - **Instance**: A concrete instantiation allocated in memory holding specific values.
- **Class Definition Syntax & Conventions**:
  - The `class` keyword and `PascalCase` / `CamelCase` naming convention (PEP 8).
  - The `pass` keyword as a syntactic null statement for scaffolding classes and method stubs.
  - Python indentation hierarchy: Class body at 4 spaces, method body at 8 spaces.
- **The Initializer Method (`.__init__()`) and `self`**:
  - The dual-phase object creation process: `__new__()` (allocation) followed by `__init__()` (initialization).
  - Demystifying `self`: Explicit reference to the current object instance passed implicitly by Python at runtime.
- **Class Attributes vs Instance Attributes**:
  - **Instance Attributes** (`self.name`, `self.age`): Bound to the specific instance's namespace dictionary (`instance.__dict__`).
  - **Class Attributes** (`species = "Canis familiaris"`): Bound to the class namespace dictionary (`Class.__dict__`), shared across all instances.
  - The namespace lookup rule: Attribute access looks first in `instance.__dict__`, then falls back to `Class.__dict__`.

### 9.2 Instantiating Objects, Accessing Data, and Defining Methods
- **Instantiation Mechanics**:
  - Invoking the class like a function: `miles = Dog("Miles", 4)`.
  - Dot notation for reading and mutating attributes (`miles.name`, `miles.age = 5`).
  - Mutability: Python user-defined objects are mutable by default.
- **Instance Methods**:
  - Defining behaviors: Functions inside a class that take `self` as their first parameter.
  - Calling methods: `miles.speak("Woof")` syntactic sugar for `Dog.speak(miles, "Woof")`.
- **String Representation with Special Methods (`.__str__`)**:
  - Default representation pitfall: `<Dog object at 0x7f8b9012a4c0>`.
  - Overriding `.__str__(self)`: Returning human-readable, formatted descriptive strings for `print()` and `str()`.
  - Contrast `.__str__()` (user-facing readability) vs `.__repr__()` (developer-facing unambiguous representation).
- **Practical Engineering Implementation: The `Car` Class**:
  - Class attributes vs instance attributes.
  - Tracking mutable state over time (`mileage += miles`).
  - Formatted mileage with thousands separators (`{self.mileage:,}`).

### 9.3 Inheritance, Method Overriding, and `super()`
- **Foundations of Inheritance**:
  - Parent (Base / Super) class vs Child (Derived / Sub) class.
  - Universal inheritance: All Python 3 classes implicitly inherit from the built-in `object` base class.
- **Method Overriding**:
  - Redefining a method in a child class with identical name to customize behavior.
- **Extending Behavior with `super()`**:
  - Avoiding duplicated code: Invoking parent implementations dynamically via `super().method_name()`.
  - Parameter forwarding and constructor chaining: `super().__init__(...)`.
- **Runtime Introspection (`isinstance()` and `issubclass()`)**:
  - Verifying instance-class relationships across inheritance hierarchies:
    - `isinstance(miles, Dog) -> True`
    - `isinstance(miles, JackRussellTerrier) -> True`
    - `isinstance(miles, Bulldog) -> False`
- **Geometric Hierarchy: `Rectangle` and `Square`**:
  - Mathematical relationship: A square is a constrained rectangle where $\text{length} = \text{width} = s$.
  - Passing arguments up the chain: `super().__init__(side_length, side_length)`.
  - Calculating area:
    $$A_{\text{rect}} = l \times w, \quad A_{\text{sq}} = s^2$$

### 9.4 Practical Architectural Challenge: Farm Simulation
- **Domain Modeling**:
  - `Animal` base class with attributes `name`, `age`, `sound` and common behaviors `make_sound()`, `eat(food)`.
  - Specialized derived classes: `Cow` (`produce_milk()`) and `Chicken` (`lay_egg()`).
  - Overriding constructor with specialized default sounds (`"Moo"`, `"Cluck"`) via `super().__init__()`.
- **Polymorphism in Practice**:
  - Iterating over heterogeneous animal collections and invoking shared interfaces polymorphically.

---

## 4. Interactive Components & Execution Islands

### Component 1: Conceptual Self-Check (`<QuizCard />`)
- **Placement**: Directly after Section 9.2 (Class vs Instance Attributes and String Representation).
- **Question**: "What happens when you execute `miles.species = 'Canis lupus'` on an instance of class `Dog` where `species = 'Canis familiaris'` is defined at the class level?"
- **Options**:
  1. It modifies `Dog.species`, altering the species value for all existing and future `Dog` instances.
  2. It raises an `AttributeError` because class attributes are immutable through instance references.
  3. It creates a new instance attribute `species` on `miles`, leaving `Dog.species` and all other instances unchanged.
  4. It raises a `TypeError` because modifying attributes dynamically requires a setter method.
- **Correct Answer**: Option 3 (Index 2 in 0-based indexing).
- **Explanation**: "In Python, assigning to an attribute via an instance (`miles.species = ...`) writes directly to that instance's local `__dict__`. It shadows (overrides) the class attribute for that specific instance only, leaving the shared class-level `Dog.species` and all other instances completely unaffected."

### Component 2: Interactive Sandbox 1 (`<PythonRunner />` — Car Class & State Mutation)
- **Title**: "Interactive Sandbox: Vehicle Odometer & State Mutation"
- **Initial Code**:
  ```python
  class Car:
      def __init__(self, color, mileage):
          self.color = color
          self.mileage = mileage

      def __str__(self):
          return f"The {self.color} car has {self.mileage:,} miles."

      def drive(self, miles):
          if miles < 0:
              raise ValueError("Distance driven cannot be negative.")
          self.mileage += miles

  # Instantiate two distinct car objects
  blue_car = Car("blue", 20000)
  red_car = Car("red", 30000)

  print(blue_car)
  print(red_car)

  # Drive the blue car
  blue_car.drive(100)
  print(f"Updated: {blue_car}")
  ```
- **Expected Output**:
  ```text
  The blue car has 20,000 miles.
  The red car has 30,000 miles.
  Updated: The blue car has 20,100 miles.
  ```

### Component 3: Interactive Sandbox 2 (`<PythonRunner />` — Farm Polymorphism & Inheritance)
- **Title**: "Interactive Sandbox: Object Hierarchy & Farm Simulation"
- **Initial Code**:
  ```python
  class Animal:
      def __init__(self, name, age, sound):
          self.name = name
          self.age = age
          self.sound = sound

      def make_sound(self):
          return f"{self.name} says {self.sound}!"

      def eat(self, food):
          return f"{self.name} is eating {food}."

  class Cow(Animal):
      def __init__(self, name, age):
          super().__init__(name, age, sound="Moo")

      def produce_milk(self):
          return f"{self.name} produced a bucket of fresh milk."

  class Chicken(Animal):
      def __init__(self, name, age):
          super().__init__(name, age, sound="Cluck")

      def lay_egg(self):
          return f"{self.name} laid an egg."

  # Farm Simulation
  bessie = Cow("Bessie", 5)
  charlotte = Chicken("Charlotte", 2)

  farm_animals = [bessie, charlotte]

  for animal in farm_animals:
      print(animal.make_sound())
      print(animal.eat("grain"))

  print(bessie.produce_milk())
  print(charlotte.lay_egg())
  ```
- **Expected Output**:
  ```text
  Bessie says Moo!
  Bessie is eating grain.
  Charlotte says Cluck!
  Charlotte is eating grain.
  Bessie produced a bucket of fresh milk.
  Charlotte laid an egg.
  ```

---

## 5. Algorithmic and Mathematical Rigor

1. **Encapsulated State Machine Formulation**:
   - Model an object instance as a 4-tuple $(S, \Sigma, \delta, s_0)$:
     - $S$: State space (instance dictionary `__dict__`).
     - $\Sigma$: Set of input operations (method calls with parameters).
     - $\delta: S \times \Sigma \to S$: Transition function updating internal attributes.
     - $s_0 \in S$: Initial state constructed by `__init__()`.
2. **Namespace Resolution Hierarchy**:
   - Attribute resolution algorithm:
     $$\text{Resolve}(o, a) = \begin{cases} o.\_\_\text{dict}\_\_[a] & \text{if } a \in o.\_\_\text{dict}\_\_ \\ C.\_\_\text{dict}\_\_[a] & \text{if } a \in C.\_\_\text{dict}\_\_ \text{ where } C = \text{type}(o) \\ \text{MRO}(C) & \text{traversing base classes in C3 linearization} \end{cases}$$
3. **Geometric Specialization**:
   - Prove invariance and contract preservation in shape inheritance (Liskov Substitution Principle):
     $$A(l, w) = l \cdot w \implies A_{\text{square}}(s) = A(s, s) = s^2$$

---

## 6. Engineering & Style Standards

1. **Accessibility (WCAG 2.2 AA)**:
   - Primary terracotta `#A7452A` in light mode, `#E07A5F` in dark mode.
   - Strict 4.5:1 contrast for all descriptive text; keyboard focus indicators (`:focus-visible`).
2. **Zero Layout Shift (CLS)**:
   - Pre-allocated min-height containers for all interactive islands (`<PythonRunner />` and `<QuizCard />`).
3. **Execution Sandbox**:
   - 100% client-side Pyodide execution in worker thread with 5000ms watchdog termination.
4. **Prose Density**:
   - Over 1,500 words of rich technical prose with callout alerts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`).

---

## 7. Implementation & Verification Plan

1. **Phase 1: Lesson File Creation**:
   - Write `src/content/lessons/python-zero-to-hero/09-object-oriented-programming.mdx`.
2. **Phase 2: Schema & Typecheck**:
   - Run `pnpm astro check` to validate frontmatter and MDX AST.
3. **Phase 3: Production Build Test**:
   - Run `pnpm build` to verify clean static site generation.
4. **Phase 4: Contrast & A11y Audit**:
   - Check rendered elements against WCAG 2.2 AA standards.
