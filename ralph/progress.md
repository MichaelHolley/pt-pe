# Progress

## Slice 1 — Conservative Input + Summary Stats ✅

**Completed:** 2026-05-28

**Changes:**

- `src/index.css` — added `--color-conservative: #f59e0b` to `@theme`
- `src/utils/storage.ts` — added `conservativeEfficiency: number` to `AppState`; default 65
- `src/components/ui/PTStat.tsx` — added `"conservative"` variant with `text-conservative`
- `src/components/TimeframeSection.tsx` — added Conservative % input (first, before Realistic)
- `src/App.tsx` — added `conservativeData` memo; `onConservativeEfficiency` handler; prop threading
- `src/components/ResultsPanel.tsx` — `grid-cols-4`; Conservative card first; Range = Opt − Conservative

**Notes:**

- No storage version bump needed — `{ ...DEFAULT_STATE, ...parsed }` spread covers missing `conservativeEfficiency` in existing stored data
- `vp check` and `vp build` pass

## Slice 2 — Per-Person Conservative Breakdown ✅

**Completed:** 2026-05-28

**Changes:**

- `src/components/ResultsPanel.tsx` — added `con()` accessor for `conservativeResult.persons[i()]`; PT display updated to `conservative − realistic − optimistic PT` (amber/blue/light-blue); added `bg-conservative` bar layer on top (narrowest)

**Notes:**

- Only `ResultsPanel.tsx` touched — all conservative data already flowed in from Slice 1
- `vp check` and `vp build` pass

## Slice 3 — Charts ✅

**Completed:** 2026-05-28

**Changes:**

- `src/components/charts/BarChart.tsx` — added `conservativeResult` prop; data now `[conservative, realistic, optimistic]`; categories `["Conservative", "Realistic", "Optimistic"]`
- `src/components/charts/CumulativeLineChart.tsx` — added `conservativeCumulative` prop; Conservative series first (amber `#f59e0b`, `dashArray: 8`); colors `["#f59e0b", "#2563eb", "#93c5fd"]`
- `src/components/ChartsPanel.tsx` — added `conservativeResult` + `conservativeCumulative` props; threaded to `BarChart` and `CumulativeLineChart`
- `src/components/ResultsPanel.tsx` — added `conservativeCumulative` to Props; passed to `ChartsPanel`
- `src/App.tsx` — passed `conservativeData().cumulative` as `conservativeCumulative` to `ResultsPanel`

**Notes:**

- `vp check` and `vp build` pass

## Slice 4 — Conservative Toggle ✅

**Completed:** 2026-05-28

**Changes:**

- `src/utils/storage.ts` — added `conservativeEnabled: boolean` to `AppState`; default `true`
- `src/App.tsx` — `conservativeData` memo returns `null` when disabled; passed `conservativeEnabled` + `onConservativeEnabled` to `TimeframeSection` and `ResultsPanel`
- `src/components/TimeframeSection.tsx` — inline toggle switch (amber when on, gray when off); hides Conservative % input when disabled
- `src/components/ResultsPanel.tsx` — conditional `grid-cols-3` (Realistic / Optimistic / Difference) vs `grid-cols-4` (Conservative / Realistic / Optimistic / Range); per-person conservative PT and amber bar hidden when disabled
- `src/components/ChartsPanel.tsx` — threads `conservativeEnabled` and nullable conservative props to charts
- `src/components/charts/BarChart.tsx` — when disabled: 2 categories/data points (Realistic, Optimistic)
- `src/components/charts/CumulativeLineChart.tsx` — when disabled: 2-line config with original colors/dashArray

**Notes:**

- Conservative efficiency value is preserved when toggled off — re-enabling restores the previous input
- `conservativeResult` typed as `TeamResult | null` throughout; null when disabled
- `vp check` and `vp build` pass

## All slices complete
