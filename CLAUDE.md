# PT Planner — Claude Guide

## What this is

Frontend-only SolidJS app that estimates achievable **Projekt Tage (PT)** for a team in a date range. 1 PT = 8 hours. No backend, no external APIs.

## Stack

- **SolidJS** with fine-grained reactivity and `createStore` (not React — no `useState`, no `useEffect`)
- **Tailwind CSS v4** — use utility classes only, no custom CSS files
- **Vite + TypeScript** (strict)
- **Bun** as package manager and runner

## Commands

```bash
bun run dev      # dev server at localhost:3000
bun run build    # production build → dist/
bun run serve    # preview production build
```

## File structure

```
src/
├── App.tsx                        # root state, layout, IntersectionObserver for floating footer
├── components/
└── utils/
```

## Key data model

```ts
// storage.ts
interface AppState {
  // ...
}

// calculator.ts
interface Person {
  // ...
}
```

## Calculation

```
daily_hours  = hoursPerWeek / 5
working_days = days in [start, end] that are Mon–Fri
               AND not in blockedWeekdays
               AND not in blockedDates
               AND not in globalBlockedDates
gross_hours  = working_days × daily_hours
net_hours    = gross_hours × (efficiencyPercent / 100)
PT           = net_hours / 8
```

## SolidJS patterns — important

- Use `createStore` (not `createSignal`) for nested state; update via path syntax:
  `setState('persons', idx, updatedPerson)` — **not** `p.map(...)`, which creates new references and causes `<For>` to remount components and lose input focus.
- Date strings must be formatted with `getFullYear()/getMonth()/getDate()` (local time). **Never use `toISOString().slice(0,10)`** — it outputs UTC and causes off-by-one date bugs in UTC+ timezones.
- All state persists to `localStorage` under key `pt-planner`. `loadState()` backfills missing fields for forward compatibility.
