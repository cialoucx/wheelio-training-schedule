# Wheelio — Training Schedule List

A driving-school training schedule screen built with **React 18**, **TypeScript**, **Vite** and **MUI 5**.

Design and implementation decisions — including the lesson-status / attendance model — are recorded in **[ASSUMPTIONS.md](./ASSUMPTIONS.md)**.

**Contents** — [Quick start](#quick-start) · [Screenshots](#screenshots) · [Seeing every UI state](#seeing-every-ui-state) · [Project structure](#project-structure) · [Features](#features) · [Architecture notes](#architecture-notes) · [Tests](#tests) · [Not implemented](#not-implemented)

### What the brief asked for

| Requirement | Where |
|---|---|
| Trainee, lesson date, lesson time, instructor, vehicle, lesson status, attendance status | Table columns |
| Filters: date range, instructor, lesson status, trainee search | Filter toolbar (plus a **Today** shortcut) |
| View lesson details | Row click, <kbd>Enter</kbd>/<kbd>Space</kbd>, details modal |
| Attendance modal with validation | Pencil action → dialog, `"Please select an attendance status."` |
| Loading / empty / error states | All reachable without editing code — see below |
| Responsive layout | 1440px → 390px, toolbar collapses below `sm` |
| Structured for later API integration | One service boundary; three function bodies to replace |

---

## Quick start

**Requires** Node.js 18+.

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc`) then production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over `ts`/`tsx`, zero warnings tolerated |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest in watch mode |

---

## Screenshots

### Training schedule

![Training schedule](./screenshots/01-schedule-light.png?v=4)

### Lesson details

Row click or <kbd>Enter</kbd> opens the record, displaying the lesson summary, course-progress ring, and notes.

![Lesson details](./screenshots/02-lesson-details.png?v=4)

### Attendance, with validation

Save is deliberately left enabled with no status selected, so pressing it produces the message rather than doing nothing.

![Attendance validation](./screenshots/03-attendance-validation.png?v=4)

### Loading, empty and error states

| | |
|---|---|
| ![Loading state](./screenshots/06-loading-state.png?v=4) | ![Empty state](./screenshots/04-empty-state.png?v=4) |
| Skeleton rows preserve the layout while loading | Empty state distinguishes "no match" from "no lessons" and offers a Clear filters button |

![Error state](./screenshots/05-error-state.png?v=4)

The error state replaces the table rather than sitting above an empty one — nothing loaded, so there is nothing to paginate.

### Dark mode

![Dark mode](./screenshots/07-schedule-dark.png?v=4)

### Responsive

Below `sm` the filter toolbar collapses behind a **Filters** disclosure carrying the active-filter count, so the phone opens on the schedule rather than on 300px of controls.

| Collapsed | Expanded |
|---|---|
| ![Mobile](./screenshots/08-mobile.png?v=4) | ![Mobile filters](./screenshots/09-mobile-filters.png?v=4) |

---

## Seeing every UI state

The brief asks for loading, empty and error states. All four are reachable without editing code:

| State | How to reach it |
|---|---|
| **Loading** | Reload, or press **Refresh** in the header (800 ms simulated latency) |
| **Empty** | Search a trainee name that doesn't exist, e.g. `jonalyn` or `zzz` |
| **Error** | Open **`http://localhost:5173/?simulate=error`** |
| **Populated** | Default on load — 20 lessons spanning ±10 days from today |

`?simulate=error` fails only the **initial** load. Pressing **Try again** (or **Refresh**) succeeds, so the whole error → retry → success path is visible in one pass.

---

## Project structure

```
src/
├── components/
│   ├── TrainingScheduleList.tsx   # Page shell: header, layout, wiring, snackbar
│   ├── FilterPanel.tsx            # Permanent filter toolbar
│   ├── ScheduleSummary.tsx        # Four derived counts above the filters
│   ├── ScheduleTable.tsx          # Sortable table, skeleton, empty state, pagination
│   ├── AttendanceModal.tsx        # Attendance dialog with validation
│   ├── LessonDetailsPanel.tsx     # Centered lesson details modal
│   ├── StatusLabel.tsx            # The single visual form for any status (chip and text variants)
│   ├── WheelLogo.tsx              # Brand mark, painted as a theme-aware CSS mask
│   └── FiIcon.tsx                 # Flaticon UIcons wrapper
├── assets/
│   └── wheel-mark.png             # Logo silhouette (used as a mask, not an image)
├── theme/
│   ├── tokens.ts                  # Type scale, radii, icon sizes, motion durations, colour ramps
│   ├── status.ts                  # Lesson + attendance status tokens
│   └── index.ts                   # MUI theme construction
├── services/
│   └── scheduleService.ts         # The only module that knows where data comes from
├── hooks/
│   ├── useTrainingSchedule.ts     # Data: loading, filtering, sorting, submission
│   ├── useFilters.ts              # Filter state only
│   ├── usePagination.ts           # Page slicing, resets when its key changes
│   ├── useLessonDialogs.ts        # Which lesson each dialog is showing
│   └── useSnackbar.ts             # Transient confirmation messages
├── data/
│   └── mockData.ts                # Fixtures: 20 lessons, 4 instructors, 4 vehicles, 10 trainees
├── utils/
│   ├── lessonQuery.ts             # Filter predicate and sort comparator (pure)
│   ├── lessonSummary.ts           # Derived counts for the summary strip
│   ├── lessonRules.ts             # Attendance rules derived from a lesson
│   ├── dateHelpers.ts             # dayjs formatting and range logic
│   ├── validation.ts              # Attendance form validation
│   └── text.ts                    # Initials for avatar fallbacks
├── test/
│   └── factories.ts               # Valid fixtures, so tests state only what they test
├── types/index.ts                 # Interfaces and enums
├── App.tsx                        # Theme provider and colour-mode state
└── main.tsx                       # Entry point
```

---

## Features

### Summary
Four counts above the filters — lessons, upcoming, completed and pending attendance — derived from the filtered set so they always describe the table beneath them. Colour is confined to each card's icon chip; numbers and labels stay monochrome.

### Table
- Trainee, Lesson date, Lesson time, Instructor, Vehicle (model + registration), Lesson status, Attendance status
- Sortable by trainee, date, instructor and lesson status
- Row click or <kbd>Enter</kbd>/<kbd>Space</kbd> opens lesson details; a single pencil icon per row opens the attendance dialog, tooltipped and labelled with the trainee's name
- Client-side pagination — 10 / 25 / 50 rows, resets to page 1 whenever a filter changes
- Card sizes to its rows; scrolls internally with a sticky header once rows overflow

### Filters
Always-visible toolbar, in order — trainee name/email search, instructor, lesson status, date range with min/max constraints, a **Today** shortcut, and a **Clear filters** button that stays rendered but disabled when nothing is active. All filters combine with AND.

**Today** is a shortcut into the date range rather than a filter of its own: it sets both bounds to the current date, presses in whenever the range already covers exactly today, and clears on a second press. Clear filters and the active-filter count needed no changes to account for it.

Below the `sm` breakpoint the toolbar collapses behind a **Filters** disclosure, leaving only trainee search visible so a phone opens on the table rather than on 300px of controls. The toggle carries the active-filter count, so a collapsed panel never hides that the list is filtered.

### Attendance
A dialog showing the trainee, lesson date and time, the assigned **instructor as read-only**, a Present / Absent / Late picker, and optional notes capped at 500 characters.

Saving replaces only the lesson's `attendance` — the instructor, vehicle, date and lesson status are untouched. Pressing **Save** with no status selected raises the MUI validation message *"Please select an attendance status."*

### Lesson details
A centered modal headed by the trainee, leading with the lesson date (rendered relatively as "Today"/"Tomorrow" where applicable), then a summary grid of status, attendance, location, instructor, vehicle and registration. Below it, on the same three columns, the soft context — course-progress ring, lesson notes and attendance notes — followed by a collapsed **Full record** for reference data.

The **course-progress arc sweeps from zero every time the modal opens**: the dialog unmounts its children on close, so the ring remounts fresh on each open. It paints at zero, advances to the real value on the next animation frame, and lets the `stroke-dashoffset` transition carry it over 650 ms. Under `prefers-reduced-motion` the ring simply appears at its final value — not stuck at zero.

---

## Architecture notes

**One data boundary.** `services/scheduleService.ts` is the only module that knows where data comes from — `data/mockData.ts` is imported by nothing else, and no component imports from either. Every call is asynchronous and returns the shape a server would return, so connecting a backend means replacing three function bodies:

| Today | With a backend |
|---|---|
| `fetchLessons()` | `GET /api/lessons` |
| `fetchInstructors()` | `GET /api/instructors` |
| `updateAttendance(payload)` | `PATCH /api/lessons/:id/attendance` |

Writes go through the same door as reads: `updateAttendance` returns the persisted record and the hook applies exactly what came back rather than reconstructing it locally, which is the behaviour it needs once the call is real. `timestamp` is assigned inside the service because a server would own it. Nothing is optimistic — state updates only after the service resolves.

**Hooks split by concern.** `useFilters` owns filter state and knows nothing about data; `useTrainingSchedule` owns data, derivation and submission. Filtering and sorting are `useMemo`-derived from `(lessons, filters, sortConfig)` rather than stored, so there is no state to keep in sync.

**One design system, no local overrides.** Every visual constant lives in `theme/tokens.ts` — five type sizes, two radii, two icon sizes, one control height, and three motion durations (`MOTION.fast` 130 ms, `MOTION.base` 200 ms, `MOTION.reveal` 650 ms). No component declares its own font size, radius, colour or transition. Chrome is monochrome and green, amber and red are reserved for status, so colour in the UI carries meaning. The summary strip is the one deliberate exception, and it is contained: colour appears only inside a 38px icon chip, never on a number, a label or a row.

**Status has one visual form.** `StatusLabel` renders both lesson and attendance status identically wherever they appear, and always pairs the colour with a text label so nothing is conveyed by colour alone. The `chip` variant (lesson status) sets a tinted label on a tinted ground; the `text` variant (attendance) tints the label alone. Unrecorded attendance renders in `text.secondary` — quieter than a recorded value, without needing a separate hollow-dot asset.

**Lesson status and attendance are independent.** A no-show is `Completed` + `Absent`, not `Cancelled`. The full validity matrix and the reasoning are in [ASSUMPTIONS.md §6](./ASSUMPTIONS.md).

**Only four columns are sortable, and the type says so.** `SortableColumn` is a four-value union rather than `keyof Lesson`, which makes the `switch` in `compareLessons` exhaustive — adding a sortable column fails to compile until the comparator handles it, instead of silently falling through to a default.

---

## Tests

```bash
npm test
```

47 tests across 6 test suites covering pure domain logic — filtering/sorting predicates, summary counts, attendance validation, lesson rules, avatar background color hashing, initials, and course-progress ring animation:

| File | Covers |
|---|---|
| `utils/lessonQuery.test.ts` | Inclusive date bounds, open-ended ranges, AND-combination, search scope |
| `utils/lessonSummary.test.ts` | Category counts; cancelled and already-marked lessons excluded from pending |
| `utils/validation.test.ts` | Required status (exact message), enum guard, comment length boundaries |
| `utils/lessonRules.test.ts` | Cancelled lessons cannot be marked; a no-show is `Completed` + `Absent`; ring sweeps, re-open resets, reduced-motion correctness |
| `utils/avatarTone.test.ts` | Deterministic avatar color hashing per trainee name, dark mode lightness adjustment |
| `utils/text.test.ts` | First-and-last initials, not the first two words |

Filtering, sorting and validation are plain functions taking arguments and returning values — no React, no mocks, no DOM. `src/test/factories.ts` builds valid fixtures so each test states only what it is actually about.

---

## Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.2 | Type safety |
| Vite | 5.3 | Build tool and dev server |
| MUI Material | 5.16 | Component library |
| MUI X Date Pickers | 6.20 | Date range inputs |
| dayjs | 1.11 | Date formatting and comparison |
| Flaticon UIcons | 3.3 | Icon set |
| Outfit | — | Typeface |

---

## Not implemented

Deliberate omissions, with reasoning in [ASSUMPTIONS.md](./ASSUMPTIONS.md):

- **Server-side pagination, filtering and sorting** — all client-side; appropriate to roughly 500 rows
- **Authentication, roles and audit trail** — out of scope; attendance records carry no owner
- **Lesson lifecycle transitions** — nothing in the UI moves a lesson to Completed or Cancelled
- **Caching / request de-duplication** — React Query or SWR would own this in production
- **URL-synced filter state** — filters are not linkable or restorable
- **Vehicle-type filter** — `Vehicle.type` exists on the model but is not filterable; see ASSUMPTIONS 5.12
- **Disabled non-operating days in the date pickers** — needs a real source for the school's operating days; see ASSUMPTIONS 3.6
- **Component and hook tests** — the pure logic is covered (see below); rendering and hook behaviour would need React Testing Library
