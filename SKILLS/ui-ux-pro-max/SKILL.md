---
name: ui-ux-pro-max
description: Advanced UI/UX design intelligence skill that generates complete design systems (patterns, styles, colors, typography, UX rules) and implements production-ready interfaces across multiple platforms.
--------------------------------

## Purpose

The **ui-ux-pro-max** skill transforms vague UI requests into a **complete, production-grade design system + implementation**.

Instead of just generating UI code, this skill:

- analyzes product type and context
- selects optimal design patterns
- generates:
  - layout structure
  - UI style
  - color palette
  - typography pairing
  - motion & effects
- applies UX best practices and anti-pattern checks

Core idea:
Design system first → then implementation

---

## When to Use

Use this skill when:

- Designing:
  - landing pages
  - dashboards
  - web apps
  - mobile apps
- You need:
  - full design system (not just UI code)
  - color + typography decisions
  - UX improvement or audit
- You want:
  - professional, industry-aware UI
  - non-generic design output

Use especially when:
- user request is vague ("buat UI fintech", "design app")
- need structured UI/UX thinking
- need scalable multi-page design system

DO NOT use when:
- backend-only tasks
- algorithm problems
- non-UI logic

---

## Step-by-step Instructions for the agent

### 1. Understand User Intent

Extract:

- product type (SaaS, fintech, healthcare, etc.)
- target audience
- platform (web, mobile, dashboard)
- preferred stack (if any)

---

### 2. Run Design System Generation

Simulate reasoning engine:

Select:

- Pattern (layout structure)
- Style (UI aesthetic)
- Color palette (industry-matched)
- Typography pairing
- Key effects (motion, interaction)

This step MUST produce a **complete design system**

Reference structure:

- Pattern → sections (hero, features, etc.)
- Style → visual identity
- Colors → primary, secondary, background, text
- Typography → font pairing + mood
- Effects → animation rules
- Anti-patterns → what to avoid

---

### 3. Apply Industry-Specific Rules

Use domain-aware reasoning:

- fintech → trust, clean, no flashy colors
- healthcare → accessibility, calm palette
- SaaS → clarity, feature hierarchy
- creative → expressive visuals

The system contains:
- 161 product categories
- 67 UI styles
- 161 color palettes
- 57 typography pairings :contentReference[oaicite:1]{index=1}

---

### 4. Generate UI Structure

Build layout based on selected pattern:

Example:

- Hero
- Features / Services
- Testimonials
- CTA / Conversion section
- Footer

Ensure:
- logical hierarchy
- conversion-focused placement

---

### 5. Implement Code

Generate real working UI using:

- HTML + Tailwind (default)
- OR requested stack:
  - React / Next.js
  - Vue / Nuxt
  - Angular
  - Flutter / React Native
  - SwiftUI :contentReference[oaicite:2]{index=2}

Code must include:

- proper spacing
- consistent colors (from system)
- typography applied correctly
- responsive design

---

### 6. Apply UX Best Practices

Enforce:

- accessibility (WCAG contrast, keyboard nav)
- responsive breakpoints (375 / 768 / 1024 / 1440)
- hover + focus states
- smooth transitions (150–300ms)
- clickable affordances (cursor-pointer)

---

### 7. Enforce Anti-Patterns

NEVER allow:

- random color usage
- mismatched typography
- harsh animations
- generic AI gradients (purple/pink)
- poor contrast

---

### 8. Pre-delivery Validation

Checklist:

- design system consistency
- accessibility compliance
- responsive layout
- interaction states present
- no anti-patterns

---

## Expected Output Format

The agent MUST output:

### 1. Design System

- Pattern:
- Style:
- Colors:
- Typography:
- Effects:
- Anti-patterns:

---

### 2. UI Structure

- Sections breakdown
- Layout explanation (short)

---

### 3. Implementation Code

```html
<!-- or React / Vue etc -->

 4. Notes (optional)
customization tips
extension ideas
Rules and Constraints
Core Rules
ALWAYS generate design system first
NEVER jump directly to code
ALWAYS use industry-aware reasoning
Design Rules
design must be consistent
all elements must follow system
avoid generic UI patterns
Technical Rules
code must be working
responsive by default
accessible by default
Behavior Rules
do not guess randomly
do not mix styles inconsistently
do not skip validation
Key Behavior Summary
Generates full design system automatically
Uses multi-domain reasoning (pattern, style, colors, typography)
Applies 161 industry-specific rules
Outputs production-ready UI across multiple stacks
Includes UX validation and anti-pattern prevention
Trigger System
Auto Trigger (Default)

Activate when user asks:

"build landing page"
"design dashboard"
"create UI"
"improve UI/UX"
"buat tampilan app"
Manual Trigger

/ui-ux-pro-max

Workflow Trigger

/design-system generate
/design-system apply

Agent Reminder

Do not just design UI.

Engineer the entire design system first.
Then implement it properly.

::contentReference[oaicite:7]{index=7}