---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when building web components, pages, or applications. Produces polished, creative code that avoids generic AI aesthetics.
--------------------------------

## Purpose

The **frontend-design** skill guides an AI agent to create **visually distinctive, production-grade frontend interfaces**.

It solves a core problem in AI-generated UI:
- generic layouts
- overused fonts (Inter, Arial, Roboto)
- predictable color gradients
- “AI-looking” design

This skill forces the agent to:
- commit to a strong aesthetic direction
- design intentionally (not generically)
- implement real, working frontend code

Core principle:
Every UI must feel intentionally designed, not statistically generated.

---

## When to Use

Use this skill when:

- Building:
  - landing pages
  - dashboards
  - web apps
  - UI components
- Styling or redesigning frontend interfaces
- Improving visual quality of existing UI
- Creating design-driven frontend prototypes
- Generating HTML/CSS/JS, React, Vue, etc.

Use especially when:
- Output looks “too generic”
- You want **high-end design quality**
- You need **memorable, unique UI**

DO NOT use when:
- Backend-only tasks
- Pure logic or algorithm problems
- Non-visual code generation

---

## Step-by-step Instructions for the agent

### 1. Understand Context First

Before coding, extract:

- Purpose  
  → What problem does this UI solve?

- Audience  
  → Who will use it?

- Constraints  
  → Framework, performance, accessibility

---

### 2. Choose a Bold Aesthetic Direction

You MUST pick a **clear and strong design direction**.

Examples:
- Brutalist
- Minimalist luxury
- Retro-futuristic
- Editorial / magazine
- Playful / toy-like
- Industrial
- Organic / natural
- Maximalist chaos
- Soft pastel
- Art deco / geometric

Rule:
Do NOT mix randomly. Commit to ONE direction.

---

### 3. Define Differentiation

Ask:

What makes this UI unforgettable?

Pick ONE defining trait:
- typography
- layout
- motion
- color system
- interaction pattern

This becomes the identity of the design.

---

### 4. Implement Production-Grade Code

Generate real working code:

- HTML / CSS / JS OR
- React / Vue / framework requested

Code MUST be:
- functional
- clean
- structured
- reusable

---

### 5. Apply Aesthetic Systems

#### Typography
- Use distinctive fonts
- Avoid:
  - Inter
  - Arial
  - Roboto
- Pair:
  - display font (expressive)
  - body font (readable)

---

#### Color & Theme
- Use CSS variables
- Create strong hierarchy:
  - dominant color
  - accent color
- Avoid flat, generic palettes

---

#### Motion & Interaction
- Use animation intentionally:
  - page load sequences
  - staggered reveals
  - hover effects
- Prefer:
  - CSS animations (for HTML)
  - Motion libraries (for React)

Focus on:
One strong moment > many weak effects

---

#### Layout & Composition
- Avoid standard layouts
- Use:
  - asymmetry
  - overlapping elements
  - broken grids
  - diagonal flow

Balance:
- whitespace OR
- dense structured layout

---

#### Background & Visual Detail
Add depth using:
- gradients (non-generic)
- textures (noise, grain)
- shadows
- overlays
- patterns
- transparency layers

Avoid plain flat backgrounds unless intentional.

---

### 6. Enforce Anti-Generic Rules

NEVER use:
- default system fonts
- purple-blue gradients
- centered card layouts
- cookie-cutter UI patterns

Every design must feel:
custom, intentional, and context-aware

---

### 7. Match Complexity to Style

- Maximalist → complex code, animations, effects
- Minimalist → precision, spacing, restraint

Rule:
Design quality = execution consistency

---

### 8. Final Check Before Output

Ensure:
- strong visual identity
- cohesive design system
- no generic patterns
- working, complete code

---

## Expected Output Format

The agent MUST output:

1. Short explanation of chosen aesthetic (1–3 lines)

2. Full working code:

```html
<!-- or React / Vue -->

 (Optional) Notes:
how to customize
how to extend
Rules and Constraints
ALWAYS choose a clear aesthetic direction
NEVER generate generic UI
PRIORITIZE design quality over speed
DO NOT explain excessively
DO NOT fallback to safe defaults

Hard rules:

No Inter / Arial / Roboto
No generic gradients
No template-style layouts
No “AI-looking” UI
Key Behavior Summary
Forces intentional design thinking before coding
Produces production-grade frontend code
Avoids “AI slop” aesthetics completely
Emphasizes typography, motion, layout, and visual identity
Agent Reminder

Do not generate UI.

Design it.
Then build it.

::contentReference[oaicite:5]{index=5}