---
name: superpowers
description: A structured agentic development workflow that forces AI to behave like a disciplined software engineering team using composable skills, planning, and test-driven execution.
--------------------------------

## Purpose

The **superpowers** skill transforms an AI agent from a “code generator” into a **structured software engineering system**.

Instead of jumping directly into coding, the agent is forced to:

- understand the problem first  
- generate a clear design  
- create a step-by-step plan  
- execute using controlled workflows  
- validate with testing and review  

Core idea:
The agent does NOT improvise.  
The agent follows a **strict engineering process**.

This solves common AI failures:
- random coding without planning  
- skipping tests  
- inconsistent logic  
- poor maintainability  

Superpowers enforces:
- discipline
- structure
- verification

---

## When to Use

Use this skill when:

- Building any non-trivial software project
- Working with:
  - web apps
  - APIs
  - backend systems
  - fullstack apps
- You want:
  - predictable results
  - maintainable code
  - structured workflow
- You need:
  - planning before coding
  - test-driven development
  - systematic debugging

Use especially when:
- project is complex
- multiple features involved
- long-running agent tasks

DO NOT use when:
- quick one-line scripts
- trivial coding tasks
- simple Q&A

---

## Step-by-step Instructions for the agent

### 0. NEVER START WITH CODE

Hard rule:
DO NOT write code immediately.

Always start with:
- understanding
- clarification
- design

---

### 1. Brainstorming Phase

Goal: turn vague idea into clear spec

Actions:
- ask clarifying questions
- identify requirements
- propose multiple approaches
- refine with user

Output:
- structured design document

Rule:
No coding yet.

---

### 2. Design Approval Gate

- Present design in small chunks
- Wait for user confirmation

Rule:
DO NOT proceed without approval

---

### 3. Writing Plans

Goal: break design into executable steps

Each task must:
- be small (2–5 min work)
- include exact file paths
- include exact code to write
- include verification steps

Principles:
- YAGNI (no overengineering)
- DRY (no duplication)
- clarity over cleverness

---

### 4. Execution Phase (Subagent-driven)

For each task:

- spawn fresh execution context (subagent mindset)
- implement ONLY the current task
- do NOT jump ahead

Two-stage validation:
1. spec compliance
2. code quality

---

### 5. Test-Driven Development (MANDATORY)

Follow strictly:

1. Write test (must fail)
2. Run test → confirm failure
3. Write minimal code
4. Run test → confirm pass
5. Refactor if needed

Rule:
Delete any code written before tests.

---

### 6. Continuous Code Review

After each task:

- review against plan
- classify issues:
  - critical (block progress)
  - minor
- fix before continuing

---

### 7. Debugging (if needed)

Use systematic debugging:

1. reproduce issue
2. trace root cause
3. fix cause (not symptom)
4. verify fix

Rule:
Never guess. Always verify.

---

### 8. Branch & Workspace Management

- use isolated work environments (worktrees)
- keep main branch clean
- validate baseline before work

---

### 9. Completion Phase

When all tasks done:

- run all tests
- verify full system works
- present options:
  - merge
  - create PR
  - revise
  - discard

---

## Expected Output Format

The agent MUST follow structured outputs:

### During brainstorming:
- questions
- assumptions
- proposed design

---

### During planning:

Task format:

Task:
- goal

Files:
- exact paths

Steps:
1. action
2. action

Code:
```language
exact code

Verification:

how to confirm success
During execution:
current task
implementation
test result
review result
Rules and Constraints
Core Rules
NEVER skip planning
NEVER skip tests
NEVER jump steps
NEVER assume correctness
Process Rules
follow order strictly:
brainstorming → design → plan → execute → review → finish
each phase is REQUIRED
each phase blocks next phase
Engineering Principles
Test-Driven Development first
Simplicity over complexity
Evidence over assumptions
Process over intuition
Agent Behavior Rules
do not improvise workflow
do not skip validation
do not merge incomplete work
do not continue after critical errors
Key Behavior Summary
Converts AI into structured engineering workflow
Uses composable skills that auto-trigger based on context
Enforces spec → plan → execution → review pipeline
Implements strict TDD, DRY, YAGNI principles
Uses subagent-style execution for reliability
Agent Reminder

Do not be smart.

Be disciplined.

Follow the process.