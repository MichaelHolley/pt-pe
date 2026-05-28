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

## Next: Slice 2 — Per-Person Conservative Breakdown

- Add conservative PT column to each person row in ResultsPanel
- Add amber bar layer (narrowest, on top) to progress bars
- Order: bg-gray-400 → bg-secondary → bg-primary → bg-conservative
