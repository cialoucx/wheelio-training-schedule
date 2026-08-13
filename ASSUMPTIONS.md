# Assumptions

This document records all design and implementation assumptions made during development of the Training Schedule List application.

---

## 1. API & Data Layer

| # | Assumption |
|---|---|
| 1.1 | No real API exists. **`src/services/scheduleService.ts` is the only module that knows where data comes from** — `src/data/mockData.ts` holds fixtures and is imported by nothing else. Every call is asynchronous and returns the shape a server would return, so connecting a backend means replacing three function bodies: `fetchLessons` → `GET /api/lessons`, `fetchInstructors` → `GET /api/instructors`, `updateAttendance` → `PATCH /api/lessons/:id/attendance`. |
| 1.6 | Writes go through the same boundary as reads. `updateAttendance` returns the persisted `Attendance` record and the hook applies exactly what came back, rather than reconstructing it locally — the behaviour it needs once the call is a real request. `timestamp` is assigned inside the service because a server would own it. |
| 1.7 | Components receive data as props and never import from `data/` or `services/`. The instructor list in the filter toolbar is fetched alongside the lessons and passed down, so `FilterPanel` has no data source of its own. |
| 1.5 | The error state cannot be reached by accident — mapping a static array never throws — so `?simulate=error` fails the **initial** load. Any user-initiated reload (Refresh, or Try again) succeeds, making the full error → retry → success path demonstrable without editing code. Keying the failure off "is this a retry?" rather than a one-shot flag also keeps it correct under React StrictMode, whose double-invoked mount effect would otherwise consume the failure on a discarded request. |
| 1.2 | API responses will return `Lesson` objects as defined in `src/types/index.ts`, with nested `trainee`, `instructor`, `vehicle`, and optionally `attendance` objects (no secondary fetch required). |
| 1.8 | The error state replaces the table rather than sitting above an empty one. Nothing loaded, so there are no columns to head and no rows to paginate; rendering a `0–0 of 0` paginator would describe a result set that does not exist. The filter toolbar stays, so an active filter survives a failed load and its retry. |
| 1.9 | Only one load may be in flight. `loadData` abandons any previous request before starting the next, so pressing Refresh twice cannot let an older response overwrite a newer one. Against 800 ms of simulated latency this is invisible; against a real API it is the difference between a correct table and a stale one. |
| 1.3 | Attendance submission is **not** optimistic — local state is updated only after the service resolves, so a failed request cannot leave the table showing something that was never saved. |
| 1.4 | Updating attendance replaces only the lesson's `attendance` object. Every other field on the lesson — `instructor` above all — is carried through unchanged by spreading the existing record. |

---

## 2. Pagination

| # | Assumption |
|---|---|
| 2.1 | Pagination is **client-side**. The full result set is loaded in one request, filtered and sorted in memory, then sliced for the current page. |
| 2.2 | Page size options are **10 / 25 / 50**, defaulting to 10. |
| 2.3 | For a production system with >200 lessons, this would move to server-side pagination (passing page, size, filters and sort as query params) or virtualisation via MUI DataGrid. The current approach is assumed safe up to roughly **≤500** rows. |
| 2.4 | The table body scrolls within the viewport with a sticky header. Its height is derived from a flex layout rather than a fixed pixel calculation, so the error banner, a wrapped filter toolbar, or any future content above it cannot push the pagination controls off screen. |
| 2.5 | Changing any filter resets the page index to 0, so the user is never left on a page that no longer exists. |

---

## 3. Date & Time

| # | Assumption |
|---|---|
| 3.1 | All dates are stored and displayed in **local browser time**. No timezone conversion is applied. |
| 3.2 | The application assumes a single timezone per deployment. A production app would need UTC storage + user-locale display. |
| 3.3 | Lesson times are stored as `"HH:mm"` strings (24-hour format) and displayed in 12-hour format with AM/PM. |
| 3.4 | `dayjs` is used for all date manipulation. The `isBetween` plugin is extended for date range filtering. |
| 3.6 | **Non-operating days are not disabled in the date pickers.** A school that closes at weekends would want Saturday and Sunday greyed out, which `shouldDisableDate` on the MUI X pickers supports directly. It is not implemented because operating days are a property of the *business*, and nothing in the current data model carries them — inferring "closed" from an absence of lessons would be wrong, since a quiet Tuesday is not a closed one. It needs a real source (a settings endpoint, or an `operatingDays` field alongside the schedule), and inventing one in mock data would bake a guess into the UI. Worth noting the constraint is a **usability hint here, not a correctness rule**: these pickers filter a read-only list, so choosing a closed day simply returns nothing. The same helper becomes load-bearing the moment this screen can *book* a lesson, where a closed day must be genuinely unselectable. |
| 3.5 | The details modal shows the lesson date relative where useful ("Today", "Tomorrow", "Yesterday") and falls back to the full date otherwise. The table always shows the absolute date, since relative labels do not sort or scan well in a column. |

---

## 4. Ownership & Access Control

| # | Assumption |
|---|---|
| 4.1 | **No authentication, user roles, or audit trail are implemented.** The screen is treated as a single anonymous operator view, and the scope of this assessment is the schedule itself rather than who is operating it. |
| 4.2 | The **instructor is a property of the lesson**, assigned when the lesson is booked. It is never derived from, or modified by, whoever records attendance. The attendance modal displays it as a read-only field to make that explicit. |
| 4.3 | Attendance can be marked for any lesson **except `CANCELLED`**, where the button is disabled with an explanatory tooltip. `COMPLETED` lessons remain markable, because attendance is normally recorded *after* a lesson has taken place. |
| 4.4 | The `Attendance` record intentionally carries **no owner field**. Recording who marked attendance would imply an ownership model the app does not have, and reads as though the operator replaced the instructor. |
| 4.5 | A production build would add authentication and restrict the attendance action by permission — most likely to the assigned instructor plus an administrator. |

---

## 5. Sorting & Filtering

| # | Assumption |
|---|---|
| 5.1 | Sorting is **client-side only** (applied after filtering). |
| 5.2 | Default sort order is **Date ascending** (earliest lesson first). |
| 5.3 | The search field filters on **trainee name and email** (case-insensitive substring match). It does not search on instructor name or lesson notes. |
| 5.4 | Multiple filters are combined with **AND** logic (a lesson must satisfy all active filters). |
| 5.5 | Date range filtering is **inclusive** on both bounds (lessons on the start and end dates are included). |
| 5.6 | The filter toolbar is permanently visible from the `sm` breakpoint up, since filtering is the primary task on this screen. Reset is always rendered and simply disabled when no filter is active, so enabling a filter never shifts the toolbar layout. |
| 5.7 | Filter state is not persisted to the URL. A production build would sync it to query params so a filtered view can be linked and restored. |
| 5.11 | Date and time are **separate columns** — "Lesson date" and "Lesson time" — rather than stacked in one cell. Two values in one column meant the header could only honestly name one of them, and the sort arrow sat ambiguously over both. Only the date column sorts; sorting by start time across different days answers no question a scheduler asks, and the date comparator already tie-breaks on start time so same-day lessons come out in chronological order anyway. |
| 5.8 | Sorting by **lesson status is alphabetical** (Cancelled → Completed → Rescheduled → Scheduled), which is an artefact of spelling rather than a lifecycle order. Ranking the statuses meaningfully is a product decision — whether Scheduled or Completed should lead depends on how the schedule is worked — so it was left as-is rather than guessed at. |
| 5.12 | **Filtering by vehicle type is not implemented.** The brief named four filters — date range, instructor, lesson status and trainee search — and this would be a fifth. It is a reasonable one: `Vehicle.type` already exists on the model (`Sedan`, `SUV`, `Hatchback`), a trainee is licensed for a class of vehicle, and "which lessons are on the SUV" is a real scheduling question. It was left out to keep the toolbar to what was asked for; a seventh control also pushes the `md` row past what fits without wrapping. Adding it is small and touches three places: a `vehicleType` field on `ScheduleFilters`, one clause in `matchesFilters`, and one `TextField` in `FilterPanel` — the same shape as the instructor filter, which is the point of keeping the predicate in one pure function. |
| 5.9 | Changing any filter resets pagination to page 1. This is derived from a change in the filter object inside `usePagination` rather than wired into each filter handler, so adding a new filter cannot forget to reset the page. |
| 5.10 | "What is on today" is the first question this screen gets asked, so the toolbar carries a **Today** shortcut. It is deliberately *not* a separate filter field or a dashboard: it writes the current date into both ends of the existing date range, so Reset, the active-filter count and the pagination reset all keep working untouched. It renders pressed whenever the range already covers exactly today — including when the dates were typed by hand — and a second press clears it. |

---

## 6. Attendance Logic

### 6.0 Lesson status and attendance status are independent

They answer different questions. **Lesson status** describes the lifecycle of the *booking* — did the slot run? **Attendance** describes the *trainee's participation* in it. Neither is derived from the other, and recording attendance never mutates the lesson's status.

They are independent, but not unconstrained. These are the combinations the model treats as valid:

| Lesson status | Valid attendance | Reasoning |
|---|---|---|
| `SCHEDULED` | `Pending` only | The lesson has not happened; nobody can have attended a future slot. |
| `RESCHEDULED` | `Pending` only | The booking moved — this instance did not occur. |
| `CANCELLED` | `Pending` / N/A | The slot was released before it ran, so there is nothing to attend or miss. |
| `COMPLETED` | `Present`, `Late`, **or** `Absent` | The slot ran; the trainee's participation is now a recorded fact. |

The load-bearing row is the last one. **A no-show is `COMPLETED` + `Absent`, not `CANCELLED`** — the instructor attended, the vehicle was reserved, and the slot could not be resold, so the lesson consumed its resources and happened. `CANCELLED` means the slot was released in advance and nothing was consumed. The two have different billing consequences, which is precisely why they cannot be one field.

The fixtures in `mockData.ts` demonstrate every row of this table, including `COMPLETED` + `Absent` (`les-004`) and `COMPLETED` + `Late` (`les-006`). Attendance is passed into `makeLesson` explicitly rather than derived from `status`, so the fixture does not re-assert the coupling the model rejects.

**Considered and rejected:** encoding the matrix as a discriminated union (`ScheduledLesson | CompletedLesson | CancelledLesson`, where only the completed variant carries `attendance`) would make the invalid states unrepresentable. It was rejected because the table renders all lessons uniformly, so every cell would require narrowing — a material readability cost to buy a guarantee that a twenty-row fixture does not need. The constraint is documented and enforced in the UI instead.

| # | Assumption |
|---|---|
| 6.1 | `AttendanceStatus.NOT_MARKED` is the default for lessons with no attendance record and is labelled **"Pending"** in the UI — naming the state of the record rather than a task the user has not done. It renders in `text.secondary` (quieter than a recorded status) via the `text` variant of `StatusLabel`, which substitutes a readable muted token wherever `text.disabled` would fall under the 4.5:1 AA threshold. |
| 6.2 | An attendance record can be **updated** (re-submitting overwrites the previous record). The modal pre-fills with existing data, and the row action's tooltip and label read "Edit attendance" instead of "Mark attendance" when a record already exists. |
| 6.3 | Comments are optional but capped at **500 characters**. The remaining-character count appears only within the last 60 characters, rather than permanently. |
| 6.4 | Validation is client-side only and runs **on submit**: attendance status is required (`"Please select an attendance status."`), and comment length is enforced. Save is deliberately left enabled when no status is selected, so pressing it produces the validation message rather than doing nothing. A production build would also surface server-side validation errors returned by the API. |
| 6.6 | The confirmation distinguishes creating from updating — *"Attendance recorded successfully."* for a first record, *"Attendance updated."* when overwriting one. The row action already reads "Mark" or "Edit"; the confirmation matching it means the message never contradicts the button that produced it. |
| 6.5 | Saving updates only the trainee's attendance status and notes. The lesson's instructor, vehicle, date, time and status are untouched, and the table reflects the new attendance immediately. |

---

### 6.7 The summary strip

Four counts sit above the filters: **Lessons**, **Upcoming**, **Completed** and **Pending attendance**.

`pendingAttendance` is the load-bearing one — it is the screen's to-do list, and it counts lessons that *can* be marked and have not been. Cancelled lessons are excluded, because there is nothing to record against a slot that never ran; including them would inflate a number the operator reads as work outstanding. It falls straight out of `canMarkAttendance(lesson) && !hasAttendance(lesson)`, the same predicate that disables the row's pencil, so the number and the button can never disagree.

The four categories **overlap the total rather than partitioning it**: a cancelled lesson is counted in `total` and in none of the other three, so `upcoming + completed + pendingAttendance` is not expected to equal `total`. This is deliberate — they answer separate questions rather than slicing one pie — and it is asserted in `lessonSummary.test.ts` so nobody later "fixes" it into a partition.

---

## 7. Caching

| # | Assumption |
|---|---|
| 7.1 | No client-side caching is implemented. Each page load fetches (simulates fetching) fresh data. |
| 7.2 | In production, React Query or SWR would be introduced to handle caching, background re-fetching, and cache invalidation after mutations. |

---

## 8. Responsive Behaviour

| # | Assumption |
|---|---|
| 8.1 | The table is horizontally scrollable below its minimum width; all columns remain visible rather than collapsing into a card layout. |
| 8.2 | Lesson details open in a **centered modal** (`maxWidth="sm"`), not a side drawer, so the record can use a multi-column layout. Its summary grid drops from 3 columns to 2, the notes pair and the expanded full record from 2 columns to 1, at the `sm` breakpoint. |
| 8.7 | Course progress, lesson notes and attendance notes **share one row** below the summary grid. They are the soft context — a metric and two pieces of prose — as against the booking facts above, and grouping them by position is what makes that distinction visible without a heading or a divider. The row uses the same three columns as the summary grid, so the whole dialog body reads as three rows of three on a single rhythm rather than as three different layouts. Either note may be absent, and the row degrades to whichever cells are populated. |
| 8.4 | The toolbar reads **search → instructor → status → date range → Today → Reset**: the identity filter first, then the two pickers that narrow by whom and what, then the range, then the shortcut into it, then the escape hatch. Today sits beside the dates it writes into. |
| 8.3 | The filter toolbar runs as a 7-column row at `md`, drops to 2 columns at `sm`, and below `sm` collapses behind a **Filters** disclosure. Stacking seven controls vertically cost roughly 300px on a phone — most of the first screen — so the table, not the toolbar, is what a phone opens on. Trainee search stays outside the disclosure because it is the one filter used most, and the toggle shows the active-filter count so a collapsed panel can never hide the fact that the list is filtered. |
| 8.4 | The header hides the page subtitle below `md`, keeping the logo, title and controls. |
| 8.5 | The app shell is sized with `100dvh` (falling back to `100vh` via `@supports`), because mobile browser chrome makes `100vh` taller than the visible viewport and would push the footer and pagination below the fold. |
| 8.6 | The table card sizes to its rows rather than filling the viewport, so a two-row result renders a compact card. Once the rows would overflow the space available, the card shrinks and the table body scrolls internally with its sticky header, keeping pagination anchored. |

---

## 9. Visual System

| # | Assumption |
|---|---|
| 9.1 | All visual constants live in `src/theme/tokens.ts` — **five** type sizes, **two** radii, **two** icon sizes (plus one for empty-state illustrations), a single control height, and **three motion durations** (`fast`/`base`/`reveal`) with one easing curve. Components do not declare their own font sizes, radii or colours. |
| 9.2 | The control height (40px) is MUI's natural `size="small"` height, chosen so inputs, selects, date pickers and icon buttons align without overriding MUI's internals. |
| 9.3 | Chrome is **monochrome** — including the logo, which is a silhouette painted as a CSS mask filled with `text.primary`, so it follows the theme without a second inverted asset. The **summary strip is the single exception**: its four icon chips are tinted so the page does not read as pure greyscale. The exception is contained deliberately — colour appears only in a 38px chip, never on a number, a label or a row, and two of the four reuse the status hues they describe (Completed is the same green as the Completed dot, Pending attendance the same amber as Late). `info` and `accent` exist solely for the two counts that are not statuses, and are used nowhere else. |
| 9.4 | Both statuses render through one component (`StatusLabel`) in two variants: **lesson status is a tinted pill** (`chip`), **attendance is the tinted label itself** (`text`). The attendance picker uses the same tinted-label form, so attendance looks the same in the table, the details modal and the dialog where it is set. The two axes are independent (§6.0) and adjacent in the table, so giving them different visual forms lets a reader tell at a glance which column they are scanning. Either way the status is spelled out in words, so nothing is carried by colour alone. |
| 9.9 | Wherever the label carries the colour, `text.secondary` is substituted for `text.disabled` — which covers Pending and Scheduled. That colour is legible as a 7px dot but measures 2.6:1 as body text, under the 4.5:1 AA threshold; the substitute keeps "Pending" visibly quieter than a recorded status while measuring 7.7:1 (light) and 7.5:1 (dark). Chip tint is 7% rather than 12% because the heavier tint pulled the ground down far enough to put Completed under AA. Every status colour was measured against its actual composited background: the lowest is 4.57:1. |
| 9.5 | Colour mode follows the OS via `prefers-color-scheme` on first load, and the user's explicit choice is persisted to `localStorage` thereafter. |
| 9.6 | The summary strip states counts **for the filtered set**, so it always describes the same lessons the table below is showing. A fixed total would contradict the pagination the moment a filter was applied — "20 lessons" above "1–3 of 3" reads as a bug. Colour is confined to each card's icon chip — the numbers and labels stay monochrome, so the tint identifies the card without competing with the value it holds. See 9.3 for how that squares with the colour rule. |
| 9.10 | Trainee avatars are tinted from a hue hashed off the name — stable per person, no palette to maintain as trainees are added. Saturation and lightness are fixed and only the hue varies, which keeps every tint far softer than the status hues, and the colour identifies a person rather than a state. Initials measure at least 5.88:1 against their own ground in both themes. |
| 9.8 | Category labels in the details modal carry an icon. They are **monochrome and matched to their label's weight** — the solid icon set at the label's own colour, so the glyph and the words read as one unit rather than a bold label with a faint mark beside it. Solid is used rather than the bold-stroke set because `solid/rounded` is already loaded; the bold weight would add a 350KB font for a stroke-width difference. Introducing no hue, they read as landmarks for scanning a two-column record without competing with the status dots, which remain the only coloured marks in the dialog. One glyph per concept: Instructor is a steering wheel and Vehicle a car wherever either appears. The icon is an optional prop on `SectionLabel` / `SummaryCell` / `DetailGroup`, so a label without one degrades to plain text rather than breaking. Field rows *inside* a section (Email, Phone, Colour) deliberately have none — a per-row glyph would be decoration, and several of those fields have no honest icon. |
| 9.7 | Course progress is a **labelled ring**, not a bar, and it sits with the two note blocks rather than in the dialog header or on the date row. The ring states the fraction numerically (`2/10`) so the arc reinforces rather than carries the value, and the "Course progress" label names it without depending on a hover — an unlabelled ring was tried in the header and read as an anonymous number. Its track and arc are drawn from `text.primary` alpha rather than a hue, keeping colour reserved for status. The arc **sweeps from zero every time the dialog opens**: the dialog unmounts its children on close, so `CourseProgress` remounts fresh on each open; it paints at zero, then hands the real value over on the next animation frame and lets the `stroke-dashoffset` transition carry it over `MOTION.reveal` (650 ms). Under `prefers-reduced-motion` the transition is collapsed by the global rule and the ring simply appears at its value — the correct end state, not zero. The 650 ms duration is a deliberate outlier: `MOTION.fast` (130 ms) and `MOTION.base` (200 ms) are feedback durations meant to be *felt*, while `MOTION.reveal` is meant to be *watched* — the token comment says exactly that so nobody later "fixes" the inconsistency. |

---

## 10. Accessibility

| # | Assumption |
|---|---|
| 10.1 | Table rows are focusable and open the details modal via Enter or Space, since the whole row is clickable. |
| 10.2 | Each row carries exactly **one** action button — a pencil opening the attendance dialog — because details are reached by clicking the row itself. A second "view" icon was tried and removed: it led to the same place as the row click, and the row is already focusable, labelled and Enter/Space-operable, so it added an affordance without adding a capability. Reserving the column for the one thing the row click *cannot* do makes its purpose legible. A **pencil** rather than a tick is deliberate: a tick would read as "mark present" and imply the button records attendance directly instead of opening a dialog. The button carries a tooltip and an `aria-label` naming the trainee (`"Edit attendance for Sophia Brown"`), and is wrapped in a `span` so the cancelled-lesson tooltip still fires while it is disabled. |
| 10.3 | Colour is never the sole carrier of meaning, which addresses the most common failure mode for a status table. Contrast was measured for the tinted attendance labels specifically (see 9.9) because promoting a dot colour to body text changes the threshold that applies; the rest of the palette has not been exhaustively audited. |
