## Project

PT Planner: a frontend-only app that estimates how many **person-days (PD)** a team can deliver in a date range. 1 PD = 8 hours. No backend, no external APIs; all state lives in `localStorage`.

## Project Configuration

- TanStack Start (React 19, file-based routing via TanStack Router) served by Nitro
- TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui (`new-york`, Radix, lucide icons)
- TanStack Charts (`@tanstack/charts`) for all charts
- zustand for client state
- pnpm

Import app code via the `#/` alias (`#/lib/...`, `#/components/...`).

## Structure

- `src/routes/index.tsx` – the planner page; derives results with `calcTeamResultWithCumulative`
- `src/lib/calculator.ts` – the PD calculation (pure, framework-free)
- `src/lib/store.ts` – zustand store plus action functions; persists on every change
- `src/lib/storage.ts` – `localStorage` load/save, defaults, `STORAGE_VERSION`
- `src/lib/chartColors.ts` – person color scale and legend shared by charts
- `src/components/ui/` – shadcn-generated components
- `src/components/charts/` – chart definitions

## Technical Decisions

- **Client-only page.** The index route sets `ssr: false`: state comes from `localStorage`, so server rendering would only cause hydration mismatches. Keep that unless state moves elsewhere.
- **Store shape.** `usePlanner` holds plain `AppState` only; mutations are exported functions (`addPerson`, `updatePerson`, …) calling `setState`. Components read with selectors. Results are derived with `useMemo`, never stored.
- **Persistence contract.** Key `pt-planner`, JSON of `AppState` plus `version`. Data with a different version or no persons is discarded and replaced by defaults — there is no migration logic. Bump `STORAGE_VERSION` when changing `AppState` incompatibly.
- **Dates.** Dates are local `YYYY-MM-DD` strings built with `toISO()` (`getFullYear/getMonth/getDate`). Never use `toISOString().slice(0, 10)` – it is UTC and causes off-by-one days in UTC+ timezones. Parse with `new Date(iso + 'T00:00:00')`.
- **Colors.** Realistic/optimistic use the `realistic` / `optimistic` theme tokens (`text-realistic`, `bg-optimistic`, `var(--realistic)` in charts). Persons are colored by id, not index or name, so renames keep their color.
- **Charts.** Use `@tanstack/charts` with the `/react` adapter (not the `@tanstack/react-charts` compatibility package, not recharts). Build definitions with `defineChart` inside `useMemo`. Avoid D3 dependencies: write small custom `ChartCurve`s instead (see the step curve in `CumulativeLineChart.tsx`). The library's docs ship in `node_modules/@tanstack/charts/llms.txt` – read them before guessing APIs.
- **shadcn.** Add components with `pnpm dlx shadcn@latest add <name>`. The CLI misresolves the `#/lib/utils` alias and installs an unrelated npm package `cn`: afterwards, fix imports to `#/lib/utils` and remove `cn` from `package.json`. `src/components/ui/` is excluded from ESLint.

## Calculation

```
working_days = days in [start, end] that are Mon–Fri
               AND not in the person's blockedDates
               AND not in globalBlockedDates
               AND hoursPerDay[weekday] > 0
gross_hours  = sum of hoursPerDay[weekday] over working days
net_hours    = gross_hours × (efficiency / 100)
PD           = net_hours / 8
```

Computed twice: once with the realistic, once with the optimistic efficiency.

## Git

Use conventional commit messages like 'feat:', 'fix:', 'chore:', ...

## Feedback Loop

Use `package.json` scripts over `pnpx` and `npx` commands. Validate changes with:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run check` (Prettier; `pnpm run format` to fix)

## Testing

This is a vibe project – you must not write any tests.

## Documentation

- Only add a comment when complexity is genuinely high **and** the naming does not already convey enough information.
- A comment that restates the function name, parameters, or return type is worthless — delete it. Well-named identifiers are the documentation.
- Never add a comment just because a function is public or exported.
- When a comment truly is warranted, prefer explaining _why_ over _what_, use JSDoc syntax, and keep it short and concise.
