/*
 * RBA Monetary Policy Board — Vote-Split Dashboard
 * =================================================
 * THIS FILE IS THE SINGLE SOURCE OF TRUTH. Edit it to update the dashboard.
 * No build step is required — just edit and re-open / re-deploy the page.
 * See README.md for the short post-meeting update checklist.
 *
 * IMPORTANT — the vote record is UNATTRIBUTED. The RBA publishes only the
 * COUNT of votes for and against the decision taken, never who voted how.
 * Do not add named members or infer individual positions.
 *
 * Every figure below is sourced from the RBA (links on each record).
 */
const RBA_DATA = {
  meta: {
    // Update this whenever you add or change a decision (YYYY-MM-DD).
    lastUpdated: "2026-06-05",
    // Next scheduled RBA decision announcement (for the "awaiting update" note).
    nextMeetingDate: "2026-06-16",
    // First meeting at which a vote split was published. Markers start here.
    voteRecordStart: "2025-07-08",
    cashRateSource: "https://www.rba.gov.au/statistics/cash-rate/"
  },

  /*
   * One record per meeting for which the RBA has published a vote split.
   * Keep in chronological order (oldest first); the hero uses the last entry.
   * Fields:
   *   meeting_date   "YYYY-MM-DD" — date the decision was announced
   *   decision_type  "cut" | "hold" | "hike"
   *   change_bps     integer change in basis points (-25, 0, 25)
   *   cash_rate_pct  resulting cash-rate target, in %
   *   votes_for      votes in favour of the decision taken
   *   votes_against  votes against (0 for a unanimous decision)
   *   dissent_note   OPTIONAL — only when the RBA states the dissenters' preference
   *   source_url     RBA post-meeting "Statement by the Monetary Policy Board"
   *   minutes_url    OPTIONAL — RBA minutes (published ~2 weeks later)
   *   notes          OPTIONAL — e.g. casting vote, a vacancy, an absence
   */
  decisions: [
    {
      meeting_date: "2025-07-08",
      decision_type: "hold",
      change_bps: 0,
      cash_rate_pct: 3.85,
      votes_for: 6,
      votes_against: 3,
      dissent_note: "The three members in the minority preferred to lower the cash rate; the Governor described the debate as one of timing rather than direction.",
      source_url: "https://www.rba.gov.au/media-releases/2025/mr-25-17.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2025/2025-07-08.html",
      notes: "First meeting at which the Board published an unattributed record of votes."
    },
    {
      meeting_date: "2025-08-12",
      decision_type: "cut",
      change_bps: -25,
      cash_rate_pct: 3.60,
      votes_for: 9,
      votes_against: 0,
      source_url: "https://www.rba.gov.au/media-releases/2025/mr-25-22.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2025/2025-08-12.html"
    },
    {
      meeting_date: "2025-09-30",
      decision_type: "hold",
      change_bps: 0,
      cash_rate_pct: 3.60,
      votes_for: 9,
      votes_against: 0,
      source_url: "https://www.rba.gov.au/media-releases/2025/mr-25-27.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2025/2025-09-30.html"
    },
    {
      meeting_date: "2025-11-04",
      decision_type: "hold",
      change_bps: 0,
      cash_rate_pct: 3.60,
      votes_for: 9,
      votes_against: 0,
      source_url: "https://www.rba.gov.au/media-releases/2025/mr-25-31.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2025/2025-11-04.html"
    },
    {
      meeting_date: "2025-12-09",
      decision_type: "hold",
      change_bps: 0,
      cash_rate_pct: 3.60,
      votes_for: 9,
      votes_against: 0,
      source_url: "https://www.rba.gov.au/media-releases/2025/mr-25-33.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2025/2025-12-09.html"
    },
    {
      meeting_date: "2026-02-03",
      decision_type: "hike",
      change_bps: 25,
      cash_rate_pct: 3.85,
      votes_for: 9,
      votes_against: 0,
      source_url: "https://www.rba.gov.au/media-releases/2026/mr-26-03.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2026/2026-02-03.html"
    },
    {
      meeting_date: "2026-03-17",
      decision_type: "hike",
      change_bps: 25,
      cash_rate_pct: 4.10,
      votes_for: 5,
      votes_against: 4,
      dissent_note: "The four members in the minority preferred to leave the cash rate unchanged at 3.85%.",
      source_url: "https://www.rba.gov.au/media-releases/2026/mr-26-08.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2026/2026-03-17.html"
    },
    {
      meeting_date: "2026-05-05",
      decision_type: "hike",
      change_bps: 25,
      cash_rate_pct: 4.35,
      votes_for: 8,
      votes_against: 1,
      dissent_note: "The one member in the minority preferred to leave the cash rate unchanged at 4.10%.",
      source_url: "https://www.rba.gov.au/media-releases/2026/mr-26-12.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2026/2026-05-05.html"
    }
  ],

  /*
   * Cash-rate target step changes (effective dates) for the chart line.
   * From January 2022 to show the full tightening -> easing -> re-tightening
   * cycle. These points carry NO vote data; vote markers come only from
   * `decisions` above. You normally do NOT need to edit this for a hold; add
   * a point here only when the cash-rate target actually changes.
   */
  rateHistory: [
    { date: "2022-01-01", cash_rate_pct: 0.10 },
    { date: "2022-05-04", cash_rate_pct: 0.35 },
    { date: "2022-06-08", cash_rate_pct: 0.85 },
    { date: "2022-07-06", cash_rate_pct: 1.35 },
    { date: "2022-08-03", cash_rate_pct: 1.85 },
    { date: "2022-09-07", cash_rate_pct: 2.35 },
    { date: "2022-10-05", cash_rate_pct: 2.60 },
    { date: "2022-11-02", cash_rate_pct: 2.85 },
    { date: "2022-12-07", cash_rate_pct: 3.10 },
    { date: "2023-02-08", cash_rate_pct: 3.35 },
    { date: "2023-03-08", cash_rate_pct: 3.60 },
    { date: "2023-05-03", cash_rate_pct: 3.85 },
    { date: "2023-06-07", cash_rate_pct: 4.10 },
    { date: "2023-11-08", cash_rate_pct: 4.35 },
    { date: "2025-02-19", cash_rate_pct: 4.10 },
    { date: "2025-05-21", cash_rate_pct: 3.85 },
    { date: "2025-08-13", cash_rate_pct: 3.60 },
    { date: "2026-02-04", cash_rate_pct: 3.85 },
    { date: "2026-03-18", cash_rate_pct: 4.10 },
    { date: "2026-05-06", cash_rate_pct: 4.35 }
  ]
};

// Make the data available to app.js whether loaded via <script> (file://) or
// imported as a module. The dashboard itself only relies on the global.
if (typeof window !== "undefined") { window.RBA_DATA = RBA_DATA; }
if (typeof module !== "undefined" && module.exports) { module.exports = RBA_DATA; }
