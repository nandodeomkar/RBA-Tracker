# RBA Board Vote Tracker — UI Design Brief

A brief for a visual designer. The **product, content, information architecture,
accessibility rules, and "honest visuals" guardrails are fixed** (they come from the
product requirements). Everything about the **look — type, spacing, palette nuance,
component styling, hierarchy, iconography, micro-interactions, and the chart theme —
is open for you to make tasteful.**

---

## 1. What it is

A single, public, mobile-first web page that shows **how the Reserve Bank of
Australia's Monetary Policy Board has voted on each interest-rate (cash-rate)
decision** since it began publishing its vote splits in July 2025 — plus what was
decided and where the cash rate landed.

It is a civic information tool for a general audience, **not** an analyst terminal. A
mortgage-holder, journalist, or student should land on it and within ~10 seconds know
(a) the most recent decision and how split the Board was, and (b) the record over
time. It is intentionally calm and legible, not a busy "fintech dashboard."

## 2. Audience & context

- **Non-specialists**, many arriving on a **phone** on mobile data. Plain language; no
  jargon without a gloss.
- Three personas: the curious citizen/mortgage-holder ("did rates change, was it
  close?"), the journalist (a quick citable record with a source link), the
  student/educator (how a committee votes over time).

## 3. Tone & brand direction

- **Trustworthy, factual, civic, quietly authoritative.** Every number is sourced.
- **Honest above all.** This is the design's defining constraint (see §9). No visual
  that could mislead about how close a vote was or how rates moved.
- **Unofficial.** It is *about* the RBA but is **not** the RBA and must never look like
  an official RBA site. A clear "independent / not affiliated" line is required, and
  the styling should not impersonate RBA branding.
- **Agreed aesthetic direction: minimal monochrome + one accent, light theme.**
  Greyscale type-led design with a single restrained accent used sparingly for the
  latest decision and interactive states. You may choose/refine the exact palette,
  but keep it monochrome-led and AA-contrast. Dark mode is deferred — but please build
  the palette as tokens so a dark variant is a small future step.
- Reference feel: a well-set news "explainer" or a public-institution data page —
  generous whitespace, strong typographic hierarchy, restraint.

## 4. Hard constraints (do not change)

- **One page, top to bottom.** No multi-page nav, no app shell.
- **Static & data-driven.** All content is rendered from one data file; the layout
  must tolerate the dataset growing (~8 new decisions/year) and the "latest" changing.
- **Mobile-first, responsive**, scaling up to desktop (single readable column; the
  page never becomes a wide multi-pane dashboard).
- **WCAG 2.1 AA**; **never rely on colour alone**; keyboard operable; honest scales.
- **Unattributed framing.** Only the *count* for/against is ever shown — never who
  voted which way, never named members, never an implied "this member dissented."
- The time-series chart is rendered with **Apache ECharts**, so "styling the chart"
  means giving an ECharts theme direction (colors, symbols, gridlines, tooltip, fonts)
  rather than a bespoke SVG.

## 5. Where you have creative freedom

Typography and type scale · spacing/rhythm · the exact accent and grey ramp · the hero
composition and how the split is dramatised (honestly) · iconography for cut/hold/hike
· component styling (cards, chips, table, filters, tooltips) · the chart theme · hover/
focus micro-interactions · empty/loading/awaiting states. Elevate the current
functional layout into something polished and distinctive.

---

## 6. Information architecture (the single page)

1. **Header** — wordmark, one-line description, "last updated" date, unofficial line.
2. **Latest-decision hero** — the single most important block; the "present".
3. **Voting-record section** — filters → time-series chart → equivalent table; the
   "past".
4. **About / sources footer** — the unattributed-vote explainer, the Board, sources.

---

## 7. Section-by-section

### 7.1 Header
- **Wordmark:** "RBA Board Vote Tracker" (the page `<h1>`; treat "RBA Board" as
  emphasis, "Vote Tracker" lighter — or your own tasteful treatment).
- **Tagline:** "How the Reserve Bank's Monetary Policy Board has voted on the cash rate
  — in plain language."
- **Meta line:** `Last updated 5 June 2026` · `Independent project — not affiliated
  with the Reserve Bank of Australia`.

### 7.2 Latest-decision hero (most important element)
Shows the most recent meeting. Must read in seconds. Current real content:

- **Eyebrow:** "The latest decision".
- **Context line:** `5 May 2026 · Reserve Bank of Australia · Monetary Policy Board`.
- **Headline:** a decision indicator (icon) + plain verb. Examples by type:
  - Hike → "Raised by 0.25%"  ·  Cut → "Lowered by 0.25%"  ·  Hold → "Held steady".
- **Sub-line / resulting rate:** "Cash-rate target raised — now **4.35%**." The
  resulting rate is a key number; consider giving it strong typographic weight.
- **Vote panel ("How the board voted"):**
  - A short descriptor: **"Majority (8–1)"** or **"Unanimous (9–0)"**.
  - A **proportional split bar** (the honest centrepiece — see §8).
  - A legend with exact counts: "8 for the decision" / "1 against".
- **Dissent note (only sometimes present):** e.g. "The one member in the minority
  preferred to leave the cash rate unchanged at 4.10%." (Absent for unanimous votes.)
- **Footer row:** a source link ("Read the RBA statement →") and "Next decision:
  16 June 2026".

Design all three decision types and both vote shapes (unanimous vs split, with/without
a dissent note) — see §10 for which is which.

### 7.3 Voting-record section
Heading "The voting record" + one explanatory line: "The line shows the cash-rate
target over time. Each marker is a meeting where the Board published how it voted —
shapes show whether the rate was cut, held or hiked. Vote records begin in July 2025;
earlier rate moves are shown for context only and have no vote."

**a) Filters** (a compact control bar):
- **Year** dropdown: All years / 2025 / 2026 (derived from the data).
- **Decision type** — three toggles: Cut ▼ · Hold ● · Hike ▲ (multi-select, all on by
  default).
- A **Reset** affordance and a small live status line: "Showing 8 of 8 decisions with
  a published vote." Filters update the chart **and** table together.

**b) Time-series chart** (ECharts). Needs a theme for:
- **X axis:** time, ~Jan 2022 → today. **Y axis:** cash-rate %, **starting at 0**
  (honesty), ~0–5%, "%" labels.
- **Rate line:** a step line. The **pre-vote-record stretch (before Jul 2025) must be
  visually distinct** from the vote-record era (currently dashed/grey vs solid/ink),
  with a labelled boundary marker "Vote records begin".
- **Vote markers:** one per published decision, **shape-coded by type** (▲ hike /
  ● hold / ▼ cut) so type never depends on colour; a legend acts as the key.
- **Tooltip** on hover/tap/click: date, decision, resulting rate, the split, and the
  dissent note if any. Example: "5 May 2026 — Hike · cash rate 4.35% · Vote: 8 for, 1
  against. The one member in the minority preferred to leave the cash rate unchanged at
  4.10%."
- Selecting a single year zooms the chart to that year.

**c) Equivalent table** (the text-first, screen-reader-truth view; newest first).
Columns: **Meeting · Decision · Change · Cash rate · Vote (for–against) · Source.**
A unanimous row carries a small "Unanimous" tag; a row may carry an inline dissent
note. Source cell links to the RBA statement. On mobile the table scrolls horizontally.

### 7.4 About / sources footer
Three short blocks:
- **"The votes are unattributed"** — the RBA publishes only the count for/against, not
  who voted how; the site never names members or implies positions. The count is always
  for/against *the decision taken*; dissent direction is shown only where the RBA stated
  it.
- **"The Board"** — nine members (Governor as Chair, Deputy Governor, Secretary to the
  Treasury, six externals); meets ~8×/year; majority decides, Chair has a casting vote
  if needed.
- **"Sources"** — links to RBA decisions, the cash-rate table, and the Board minutes;
  a line noting data is entered by hand and every figure links to its RBA source.

---

## 8. Component inventory (reusable pieces to style)

1. **Decision indicator** — icon + label for **Cut / Hold / Hike**. Currently ▼ / ● /
   ▲. Design a tasteful, consistent set used identically in the hero, the table, the
   chart markers, and the filter toggles. Must carry meaning by **shape + text**, not
   colour. Avoid red=bad/green=good value judgements.
2. **Split bar (the honest hero visual)** — a horizontal bar split into "for" and
   "against" segments, **strictly proportional to the counts**. The two segments must
   be distinguishable **without colour** (the current design fills "for" solid and
   gives "against" a diagonal hatch). Must render cleanly for a **unanimous 9–0** (one
   segment full, the other zero, still clearly "0 against") and for a near-even **5–4**.
   Pair with exact-count labels.
3. **Vote/score descriptor** — "Majority (8–1)" / "Unanimous (9–0)".
4. **Unanimous tag** — a small chip used in the table.
5. **Chart vote markers** — the three shapes as ECharts symbols + a legend key.
6. **Filter controls** — year select, three type toggles, reset, live status text.
7. **Tooltip** — compact, readable on mobile, holds up to ~3 lines incl. a dissent note.
8. **Source link** — recurring "RBA statement" affordance.
9. **Dissent note** — a quiet secondary block (hero + table rows).

---

## 9. Honest-visuals guardrails (please honour)

- **Never truncate or exaggerate the rate axis** to dramatise a move; y starts at 0.
- **The split bar is exactly proportional** — an 8–1 looks lopsided, a 5–4 looks nearly
  even. Do not round segments to look more or less dramatic.
- **No colour-only encoding** anywhere (decision type, for/against, pre/post-record all
  need shape/text/pattern too).
- **Unattributed** — nothing that visually implies an individual member's position
  (no nine seats lighting up red/green, no per-member avatars).
- **Pre-vote-record points have no split** — never show a placeholder or guessed vote.

## 10. Real data to design with

Use real content so mockups read true. **Latest = 5 May 2026** (the hero).

| Meeting | Decision | Change | Cash rate | Vote | Note |
|---|---|---|---|---|---|
| 8 Jul 2025 | Hold | — | 3.85% | **6–3** | 3 in the minority preferred to *cut* |
| 12 Aug 2025 | Cut | −0.25% | 3.60% | **9–0** unanimous | |
| 30 Sep 2025 | Hold | — | 3.60% | **9–0** unanimous | |
| 4 Nov 2025 | Hold | — | 3.60% | **9–0** unanimous | |
| 9 Dec 2025 | Hold | — | 3.60% | **9–0** unanimous | |
| 3 Feb 2026 | Hike | +0.25% | 3.85% | **9–0** unanimous | |
| 17 Mar 2026 | Hike | +0.25% | 4.10% | **5–4** | 4 in the minority preferred to *hold* |
| 5 May 2026 | Hike | +0.25% | 4.35% | **8–1** | 1 in the minority preferred to *hold* |

**Rate-line story (chart context):** flat at 0.10% in early 2022 → steep hiking cycle
through 2022 to a 4.35% peak (Nov 2023) → held through 2024 → easing in 2025 (cuts to
3.60%) → **re-tightening in 2026** back to 4.35%. Vote markers only appear from Jul 2025.

So the design must gracefully cover: **hold / cut / hike**, **unanimous (9–0) vs split
(8–1, 6–3, 5–4)**, **with and without a dissent note**.

## 11. States & edge cases to design

- **Hero loading** (brief) and **ready**.
- **Awaiting update:** between a meeting and the manual data refresh, the hero still
  shows the last known decision *with its clear date* — never blank or stale; a subtle
  "a newer decision may have been announced — updated by hand" note may appear.
- **Empty filter result:** "No decisions match these filters."
- **Unanimous vs split** hero and split bar (above).
- **Chart:** the pre/post-record distinction; clustered markers in the All-years view
  (markers bunch on the right) vs a zoomed single year.
- **No JavaScript:** a graceful message pointing to the RBA decisions page.

## 12. Accessibility checklist the design must satisfy

- Single `<h1>` (the wordmark); logical heading order; visible focus states; a skip
  link; AA contrast for all text and UI.
- Decision type, for/against, and the pre/post-record line all legible **without
  colour**.
- The chart has a text alternative and the **table is the full, screen-reader-friendly
  equivalent** — design it as a first-class element, not an afterthought.
- Respect `prefers-reduced-motion` (no essential motion).
- Touch targets comfortable on a ~360px-wide phone.

## 13. Current implementation (reference baseline)

A working version exists (vanilla HTML/CSS/JS + ECharts) in minimal monochrome with a
blue accent (`#1d4ed8`). It is functional and correct but deliberately plain — treat it
as the *content and behaviour reference*, and elevate the visual design. Screenshots can
be produced on request.

## 14. Suggested deliverables from Claude Design

- A small **design system**: type scale, spacing, the monochrome ramp + accent (as
  tokens), and states (default/hover/focus/disabled).
- **Hero** comps covering hike/cut/hold and unanimous/split (incl. a dissent note).
- The **filter + chart + table** block, desktop and mobile.
- A **chart theme** spec (line styles incl. the pre/post-record distinction, marker
  symbols, gridlines, axis, tooltip, legend).
- Mobile (~375px) and desktop (~1000px) layouts; light theme, with tokens ready for a
  later dark mode.
