# Plan: Add Conservative Estimation Scenario

## Context

The app currently supports two efficiency scenarios — **Realistic (75%)** and **Optimistic (90%)** — to estimate Projekt Tage for a team. Users need a full three-point estimation range (**Conservative / Realistic / Optimistic**) to model worst-case scenarios and communicate the full uncertainty span in project planning. The conservative scenario uses the same efficiency-% mechanism as the existing two; only the UI needs to expand to accommodate the third level.

Default value for conservative: **65%**. The "Difference" stat card becomes a **Range** card showing `Optimistic − Conservative`.

The conservative scenario can be toggled off entirely. When disabled, all conservative UI disappears and the summary reverts to its original three-card layout (Realistic, Optimistic, Difference).

---

## User Stories

| #    | As a…           | I want…                                                               | So that…                                                        |
| ---- | --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| US-1 | project planner | a Conservative efficiency % input alongside Realistic and Optimistic  | I can configure a worst-case scenario                           |
| US-2 | project planner | a Conservative PT stat card in the summary                            | I can see the full three-point range at a glance                |
| US-3 | project planner | the "Difference" card replaced by a "Range" card (Opt − Conservative) | I understand the total uncertainty span                         |
| US-4 | project planner | each person's conservative PT shown in their result row               | I can see per-person worst-case estimates                       |
| US-5 | project planner | the bar chart to include a Conservative column per person             | I can compare all three scenarios visually                      |
| US-6 | project planner | a third line in the cumulative chart for conservative                 | I can see the worst-case trajectory over time                   |
| US-7 | project planner | a toggle to enable/disable the conservative scenario                  | I can keep the UI focused when I don't need worst-case modeling |

---

## Vertical Slices

Each slice is a self-contained, working increment — deployable on its own.

---

### Slice 1 — Conservative Input + Summary Stats _(US-1, US-2, US-3)_

> **Outcome:** Users can enter a conservative efficiency % and immediately see the Conservative PT and Range values in the summary cards.

**Files touched:**

- `src/utils/storage.ts` — add `conservativeEfficiency: number` to `AppState`; add `conservativeEfficiency: 65` to `DEFAULT_STATE` (no version bump — spread `{ ...DEFAULT_STATE, ...parsed }` covers existing stored data)
- `src/index.css` — add `--color-conservative: #f59e0b` (amber-500) to `@theme` block
- `src/App.tsx` — add `conservativeData` memo via `calcTeamResultWithCumulative(…, state.conservativeEfficiency, …)`; add `onConservativeEfficiency` handler; pass props to `TimeframeSection` and `ResultsPanel`
- `src/components/TimeframeSection.tsx` — add Conservative % number input before Realistic (order: Conservative → Realistic → Optimistic); add props `conservativeEfficiency` + `onConservativeEfficiency`
- `src/components/ui/PTStat.tsx` — add `"conservative"` variant using `text-conservative`
- `src/components/ResultsPanel.tsx` — accept `conservativeResult: TeamResult`; expand stat grid from `grid-cols-3` → `grid-cols-4`; add Conservative card (first), keep Realistic and Optimistic, rename Difference → Range (`optimistic − conservative`)

---

### Slice 2 — Per-Person Conservative Breakdown _(US-4)_

> **Outcome:** Each person's row shows conservative PT and a fourth progress-bar layer, completing the per-person three-point range.

**Files touched:**

- `src/components/ResultsPanel.tsx` — index into `conservativeResult.persons[i]` alongside existing realistic/optimistic; display as `conservative − realistic − optimistic PT`; add amber bar layer (narrowest, on top)

**Progress-bar layer order** (widest → narrowest, rendered bottom → top via absolute positioning):

1. `bg-gray-400` — available working days
2. `bg-secondary` — optimistic PT
3. `bg-primary` — realistic PT
4. `bg-conservative` — conservative PT

---

### Slice 3 — Charts _(US-5, US-6)_

> **Outcome:** Both charts reflect all three scenarios, giving the full visual picture of Conservative / Realistic / Optimistic.

**Files touched:**

- `src/components/ChartsPanel.tsx` — add `conservativeResult: TeamResult` + `conservativeCumulative: DailyPT[]` to `Props`; thread through to `BarChart` and `CumulativeLineChart`
- `src/components/ResultsPanel.tsx` — pass `conservativeCumulative` to `ChartsPanel`
- `src/components/charts/BarChart.tsx` — add `conservativeResult: TeamResult` prop; update `data` per person to `[conservative, realistic, optimistic]`; update `xaxis.categories` to `["Conservative", "Realistic", "Optimistic"]`
- `src/components/charts/CumulativeLineChart.tsx` — add `conservativeCumulative: DailyPT[]` prop; add third series `{ name: "Conservative" }` first in array; update `colors` to `["#f59e0b", "#2563eb", "#93c5fd"]`; update `stroke.dashArray` to `[8, 0, 6]` (dotted, solid, dashed)

---

### Slice 4 — Conservative Toggle _(US-7)_

> **Outcome:** A toggle in the timeframe section enables or disables the entire conservative scenario. When off, every conservative element across inputs, stats, per-person rows, and charts disappears; the summary reverts to the original three-card layout with the "Difference" card.

**Default state:** `conservativeEnabled: true` (on by default so existing users see no regression after Slices 1–3).

**Files touched:**

- `src/utils/storage.ts` — add `conservativeEnabled: boolean` to `AppState`; add `conservativeEnabled: true` to `DEFAULT_STATE`
- `src/App.tsx` — add `onConservativeEnabled` handler; gate `conservativeData` memo computation on `state.conservativeEnabled` (skip calc when off); pass `conservativeEnabled` + handler to `TimeframeSection` and `ResultsPanel`
- `src/components/TimeframeSection.tsx` — add a labelled checkbox/toggle next to the "Conservative" heading; when unchecked, hide the Conservative % input
- `src/components/ResultsPanel.tsx` — when `conservativeEnabled` is false: render `grid-cols-3` layout with Realistic, Optimistic, Difference (original); hide conservative per-person PT and the amber bar layer
- `src/components/ChartsPanel.tsx` — gate `conservativeResult` / `conservativeCumulative` props on `conservativeEnabled`; pass `conservativeEnabled` down
- `src/components/charts/BarChart.tsx` — when disabled, drop the Conservative data point and category, reverting to `["Realistic", "Optimistic"]`
- `src/components/charts/CumulativeLineChart.tsx` — when disabled, remove the Conservative series, reverting to the two-line config with original `colors` and `stroke.dashArray`

**Behaviour notes:**

- Toggling off does **not** reset `conservativeEfficiency` — the stored value is preserved so re-enabling restores the previous input.
- The toggle lives in `TimeframeSection` alongside the other efficiency inputs, visually grouped with the Conservative row (e.g. a small switch or checkbox inline with the label).

---

## Critical Files Summary

| File                                            | Slice   | Change                                              |
| ----------------------------------------------- | ------- | --------------------------------------------------- |
| `src/utils/storage.ts`                          | 1       | Add `conservativeEfficiency` to interface + default |
| `src/index.css`                                 | 1       | Add `--color-conservative` theme var                |
| `src/App.tsx`                                   | 1       | Add memo, handler, prop threading                   |
| `src/components/TimeframeSection.tsx`           | 1       | Add Conservative % input                            |
| `src/components/ui/PTStat.tsx`                  | 1       | Add `conservative` variant                          |
| `src/components/ResultsPanel.tsx`               | 1, 2, 3 | 4-col stats → per-person rows → pass chart props    |
| `src/components/ChartsPanel.tsx`                | 3       | Thread conservative props                           |
| `src/components/charts/BarChart.tsx`            | 3       | 3 categories + 3 data points per person             |
| `src/components/charts/CumulativeLineChart.tsx` | 3, 4    | Third line (amber, dotted); hidden when disabled    |
| `src/utils/storage.ts`                          | 4       | Add `conservativeEnabled` to interface + default    |
| `src/App.tsx`                                   | 4       | Gate memo + handler; pass enabled flag              |
| `src/components/TimeframeSection.tsx`           | 4       | Toggle control next to Conservative label           |
| `src/components/ResultsPanel.tsx`               | 4       | Conditional 3- vs 4-col stats; hide amber bar layer |
| `src/components/ChartsPanel.tsx`                | 4       | Gate conservative props on enabled flag             |
| `src/components/charts/BarChart.tsx`            | 4       | Drop Conservative category/data when disabled       |
