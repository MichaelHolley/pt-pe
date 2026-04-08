---
name: do-work
description: Structured implementation workflow: Plan → Explore → Build → Run Tests/Types → Commit. Use when user says "do-work", wants to implement a feature end-to-end, or needs a disciplined build-and-commit cycle.
---

# Do Work

A disciplined 5-phase workflow for implementing features or fixes from scratch to commit.

## Phases

### 1. Plan

- Enter plan mode (`EnterPlanMode`) and interogate the user to clarify the task, requirements, and constraints
- Break down the task into clear, actionable steps or logical units of work
- Confirm the plan with the user before proceeding to Explore

### 2. Explore

- Understand existing patterns, conventions, and data flow
- Do NOT write any code in this phase

### 3. Build

- Implement the plan, one logical unit at a time
- Follow existing code style and patterns observed in Explore
- Do not add features, refactors, or comments beyond what the plan specifies

### 4. Run Tests / Types

- Run the type checker: `bun run typecheck`
- Run the test suite if one exists (e.g. `bun test`, `npm test`)
- Fix any errors before proceeding — do not skip or suppress them

### 5. Commit

- Stage and commit changes with a conventional commit message focused on _why_

## Notes

- If the plan changes during Build, pause and re-align with the user before continuing
- If types/tests cannot be fixed, surface the blocker to the user rather than committing broken code
