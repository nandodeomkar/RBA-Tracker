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
- **Membership is not attribution.** `board.members` records who sat on the Board
  and when. It is a separate public fact and must stay separate: never join it to
  `decisions`, never render a name beside a vote split, and never present a change
  of membership as explaining a vote.

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

## Board membership (`board.members[]`)

The **"The board, and how it has changed"** section is built from `board.members`
— a record of who has sat on the Monetary Policy Board since it was created on
**1 March 2025**, replacing the former Reserve Bank Board. It seats nine: three ex
officio (Governor, Deputy Governor, Secretary to the Treasury) and six external
members appointed by the Treasurer.

> **This is membership, not attribution.** The section is rendered well away from
> the voting record and is never joined to it. See the rule above.

| Field | Type | Notes |
|---|---|---|
| `name` | string | As the RBA styles it, including post-nominals. |
| `role` | string | Ex officio title, or `"External member"`. |
| `seat` | `"ex-officio"` \| `"external"` | Three ex officio, six external. |
| `start` | string `YYYY-MM-DD` | First day on the Board. |
| `end` | string \| `null` | Last day — actual for past members, scheduled for current ones. `null` where the seat has no fixed expiry (the Treasury Secretary holds it for as long as they hold the office). |
| `note` | string *(optional)* | Anything the dates alone don't explain. |
| `source_url` | string *(optional)* | RBA release announcing the appointment. |

### When the board changes

1. Add the incoming member with their `start`, scheduled `end`, and `source_url`.
2. Set the outgoing member's `end` to their **last day**, not the successor's first.
   The page pairs a join with the departure that ended the day before, to render
   "X joined, replacing Y" — get this wrong and the two show as unrelated events.
3. Leave `board.seats` at `9` unless the legislation changes.

Membership doubles as a check on the vote data: the number of members seated on a
meeting date should equal `votes_for + votes_against` for that meeting. If it
doesn't, either the vote counts or the membership dates are wrong.

## Sources

- RBA — [Monetary policy decisions](https://www.rba.gov.au/monetary-policy/int-rate-decisions/)
- RBA — [Cash rate target history](https://www.rba.gov.au/statistics/cash-rate/)
- RBA — [Monetary Policy Board minutes](https://www.rba.gov.au/monetary-policy/rba-board-minutes/)
- RBA — [Past and present Monetary Policy Board members](https://www.rba.gov.au/about-rba/history/monetary-policy-board-members.html)

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

