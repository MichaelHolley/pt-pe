# PT Planner

A lightweight, frontend-only tool for estimating how many **Personen-Tage (PT)** a team can realistically achieve within a given timeframe.

One PT = 8 hours of work.

## Features

- **Timeframe selection** — pick a start and end date; the app renders a Mon–Fri week grid for the full range
- **Global blocked days** — click any day in the calendar to block it for the entire team (e.g. company holidays); click again to unblock
- **Dynamic team roster** — add or remove team members; each member has a configurable name and per-weekday hours
- **Per-person blocked dates** — block specific calendar dates per person (e.g. individual vacation days)
- **Efficiency factor** — a global percentage (default 85%) applied to gross available hours to account for meetings and overhead
- **Live results** — total achievable PT plus a per-person breakdown of working days, gross hours, net hours, and PT contribution
- **Floating summary** — a fixed footer displays the total PT whenever the results panel is scrolled out of view
- **Persistence** — all configuration is saved to `localStorage` and restored on page reload; no backend required

## Calculation

For each team member:

```
working_days = days in [start, end] that are Mon–Fri
               AND not a blocked date for this person
               AND not a globally blocked date
               AND hoursPerDay[weekday] > 0
gross_hours  = sum of hoursPerDay[weekday] for each working day
net_hours    = gross_hours × (efficiency_percent / 100)
PT           = net_hours / 8
```

**Total achievable PT** = sum of all members' PT (rounded to 2 decimal places).

## Tech stack

- [SolidJS](https://solidjs.com) — fine-grained reactive UI
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- [Vite](https://vitejs.dev) — build tool and dev server
- TypeScript

## Setup

**Prerequisites:** [Bun](https://bun.sh)

```bash
bun install
```

### Development

```bash
bun run dev
```

Opens at [http://localhost:3000](http://localhost:3000). The page hot-reloads on file changes.

### Production build

```bash
bun run build
```

Output goes to `dist/`. Deploy the folder to any static host (Netlify, Vercel, GitHub Pages, etc.).

### Preview production build locally

```bash
bun run serve
```
