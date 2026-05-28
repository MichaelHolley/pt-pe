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

## Next: Slice 3 — Charts

- Add `conservativeResult` + `conservativeCumulative` props to `ChartsPanel`
- `BarChart`: 3 categories/data-points per person (Conservative, Realistic, Optimistic)
- `CumulativeLineChart`: add third series (amber, dotted) for Conservative
