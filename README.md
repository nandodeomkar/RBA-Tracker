# RBA Board Vote Tracker

An independent, public-facing dashboard showing how the Reserve Bank of Australia's
**Monetary Policy Board** has voted on each cash-rate decision since it began
publishing an **unattributed** vote record in **July 2025** — alongside the decision
and where the cash rate landed.

🌐 **Live site:** [rba-tracker.vercel.app](https://rba-tracker.vercel.app)

It is a single static page: plain HTML, CSS, and vanilla JavaScript, with
[Apache ECharts](https://echarts.apache.org/) vendored locally for the chart.
There is **no build step, no backend, and no data is fetched at runtime** — all of
the data lives in [`data.js`](data.js).

> **Disclaimer:** This is **not** an official RBA product and is not affiliated with the Reserve
> Bank of Australia. Every figure links to its RBA source.

---

## Files

| File | What it is |
|---|---|
| `index.html` | The page structure. |
| `styles.css` | The "Quiet" theme — warm off-white + muted teal-green accent, light/dark, Schibsted Grotesk, mobile-first, WCAG AA. |
| `core.js` | Shared engine: ECharts chart, table, filters, theme toggle, and the count-up / reveal animations. |
| `app.js` | Page wiring — builds the hero sentence, the rate count-up, and the vote dots, and hooks up `core.js`. |
| **`data.js`** | **The single source of truth — the only file you normally edit.** |
| `vendor/echarts.min.js` | The chart library, vendored so it works offline. |

> Visual design is the "Quiet" direction from a Claude Design handoff. Type uses
> Schibsted Grotesk (loaded from Google Fonts; falls back to system fonts offline).

## Viewing it

- **Quickest:** double-click `index.html` — it works straight from the file system
  (`file://`), because the data and chart library are local `<script>` files.
- **Like production (recommended before deploying):** serve the folder over HTTP, e.g.
  - `python -m http.server` then open <http://localhost:8000>, or
  - `npx serve`

## Deploying

It's a static folder — upload the whole directory (including `vendor/`) to any static
host (GitHub Pages, Netlify, Cloudflare Pages, S3, etc.). No configuration needed. See **[DEPLOY.md](DEPLOY.md)** for a free, step-by-step GitHub → Vercel walkthrough.

---

## Updating after a meeting (~8× a year)

The RBA announces a decision at 2:30 pm after each meeting; minutes follow ~2 weeks
later. To add a decision:

1. Open the RBA
   [monetary policy decision statement](https://www.rba.gov.au/monetary-policy/int-rate-decisions/)
   ("Statement by the Monetary Policy Board") for the meeting.
2. In **`data.js`**, add one object to the **end** of the `decisions` array:

   ```js
   {
     meeting_date: "2026-06-16",   // the announcement date (YYYY-MM-DD)
     decision_type: "hold",        // "cut" | "hold" | "hike"
     change_bps: 0,                // -25, 0, or 25
     cash_rate_pct: 4.35,          // the resulting target, in %
     votes_for: 9,                 // votes FOR the decision taken
     votes_against: 0,             // votes against (0 if unanimous)
     // dissent_note: "...",       // ONLY if the RBA states what the dissenters preferred
     source_url: "https://www.rba.gov.au/media-releases/2026/mr-26-XX.html",
     minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2026/2026-06-16.html"
   },
   ```

3. If the **cash rate changed**, also add a point to the `rateHistory` array using the
   **effective date** (the day after the meeting) and the new rate. For a **hold**, do
   nothing here.
4. Update `meta.lastUpdated` to today, and set `meta.nextMeetingDate` to the next
   scheduled decision.
5. Re-open / re-deploy the page.

### Rules to keep it honest

- **Unattributed only.** Record the *count* for/against. Never add names or imply who
  voted which way.
- **Unanimous = `votes_against: 0`.** Set `votes_for` to the number of members who
  voted (check the minutes' attendance; it is usually nine, but don't assume — a seat
  can be vacant or a member absent). The total is always derived from
  `votes_for + votes_against`, never hard-coded.
- **Dissent direction.** Only fill `dissent_note` when the RBA itself states what the
  minority preferred (e.g. "preferred to leave the cash rate unchanged"). Otherwise
  leave it out and show the bare count.
- **Casting vote / vacancy / absence.** Note it in the optional `notes` field rather
  than altering the counts.
- **Pre-vote-record history.** Rate moves before July 2025 belong only in
  `rateHistory` (no vote fields) and never get a placeholder split.

---

## Data dictionary (`decisions[]`)

| Field | Type | Notes |
|---|---|---|
| `meeting_date` | string `YYYY-MM-DD` | Announcement date. |
| `decision_type` | `"cut"` \| `"hold"` \| `"hike"` | |
| `change_bps` | integer | `-25`, `0`, `25`. |
| `cash_rate_pct` | number | Resulting target, %. |
| `votes_for` | integer | For the decision taken. |
| `votes_against` | integer | `0` if unanimous. |
| `dissent_note` | string *(optional)* | Only if the RBA stated the dissenters' preference. |
| `source_url` | string | RBA post-meeting statement. |
| `minutes_url` | string *(optional)* | RBA minutes (~2 weeks later). |
| `notes` | string *(optional)* | Casting vote, vacancy, absence, etc. |

## Sources

- RBA — [Monetary policy decisions](https://www.rba.gov.au/monetary-policy/int-rate-decisions/)
- RBA — [Cash rate target history](https://www.rba.gov.au/statistics/cash-rate/)
- RBA — [Monetary Policy Board minutes](https://www.rba.gov.au/monetary-policy/rba-board-minutes/)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Front end | Vanilla HTML, CSS, JavaScript |
| Charts | Apache ECharts (vendored) |
| Typography | Schibsted Grotesk (Google Fonts) |
| Hosting | Vercel (free tier) |

---

## License

This project is for personal/educational use.

