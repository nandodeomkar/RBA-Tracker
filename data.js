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
    lastUpdated: "2026-09-21",
    // Next scheduled RBA decision announcement (for the "awaiting update" note).
    nextMeetingDate: "2026-09-29",
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
    },
    {
      meeting_date: "2026-06-16",
      decision_type: "hold",
      change_bps: 0,
      cash_rate_pct: 4.35,
      votes_for: 9,
      votes_against: 0,
      source_url: "https://www.rba.gov.au/media-releases/2026/mr-26-15.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2026/2026-06-16.html",
      notes: "First hold after three consecutive increases in February, March and May 2026."
    },
    {
      meeting_date: "2026-08-11",
      decision_type: "hold",
      change_bps: 0,
      cash_rate_pct: 4.35,
      votes_for: 9,
      votes_against: 0,
      source_url: "https://www.rba.gov.au/media-releases/2026/mr-26-19.html",
      minutes_url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/2026/2026-08-11.html"
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
  ],

  /*
   * Monetary Policy Board membership — for the composition timeline only.
   *
   * THIS IS NOT VOTE DATA, AND MUST NEVER BECOME IT. The record in
   * `decisions` above is unattributed: the RBA publishes the count of votes
   * for and against, never who voted how. Who sits on the Board is a
   * separate, public fact. Keep the two apart — never add a field linking a
   * member to a decision, and never render a name beside a vote split.
   *
   * The Board was created on 1 March 2025 by the RBA governance reforms,
   * replacing the former Reserve Bank Board. It seats nine: three ex officio
   * (Governor, Deputy Governor, Secretary to the Treasury) and six external
   * members appointed by the Treasurer.
   *
   * Fields:
   *   name        as the RBA styles it, including post-nominals
   *   role        ex officio title, or "External member"
   *   seat        "ex-officio" | "external"
   *   start       "YYYY-MM-DD" — first day on the Board
   *   end         "YYYY-MM-DD" — last day, actual for past members or
   *               scheduled for current ones; null where the seat has no
   *               fixed end (the Treasury Secretary holds it for as long as
   *               they hold the office)
   *   note        OPTIONAL — anything the dates alone do not explain
   *   source_url  OPTIONAL — RBA release announcing the appointment
   */
  board: {
    established: "2025-03-01",
    seats: 9,
    membersSource: "https://www.rba.gov.au/about-rba/history/monetary-policy-board-members.html",
    members: [
      {
        name: "Michele Bullock",
        role: "Governor and Chair",
        seat: "ex-officio",
        start: "2025-03-01",
        end: "2030-09-17",
        note: "Holds the seat as Governor; the end date is the end of that term."
      },
      {
        name: "Andrew Hauser",
        role: "Deputy Governor and Deputy Chair",
        seat: "ex-officio",
        start: "2025-03-01",
        end: "2029-09-11",
        note: "Holds the seat as Deputy Governor; the end date is the end of that term."
      },
      {
        name: "Steven Kennedy PSM",
        role: "Secretary to the Treasury",
        seat: "ex-officio",
        start: "2025-03-01",
        end: "2025-06-15"
      },
      {
        name: "Jenny Wilkinson PSM",
        role: "Secretary to the Treasury",
        seat: "ex-officio",
        start: "2025-06-16",
        end: null,
        note: "Holds the seat ex officio for as long as she is Secretary to the Treasury."
      },
      {
        name: "Marnie Baker AM",
        role: "External member",
        seat: "external",
        start: "2025-03-01",
        end: "2030-02-28"
      },
      {
        name: "Renée Fry-McKibbin",
        role: "External member",
        seat: "external",
        start: "2025-03-01",
        end: "2030-02-28"
      },
      {
        name: "Ian Harper AO",
        role: "External member",
        seat: "external",
        start: "2025-03-01",
        end: "2026-08-31"
      },
      {
        name: "Carolyn Hewson AO",
        role: "External member",
        seat: "external",
        start: "2025-03-01",
        end: "2027-02-28"
      },
      {
        name: "Iain Ross AO",
        role: "External member",
        seat: "external",
        start: "2025-03-01",
        end: "2028-08-31"
      },
      {
        name: "Alison Watkins AM",
        role: "External member",
        seat: "external",
        start: "2025-03-01",
        end: "2026-02-28"
      },
      {
        name: "Bruce Preston",
        role: "External member",
        seat: "external",
        start: "2026-03-01",
        end: "2031-02-28",
        source_url: "https://www.rba.gov.au/media-releases/2026/mr-26-04.html"
      },
      {
        name: "Melinda Cilento",
        role: "External member",
        seat: "external",
        start: "2026-09-01",
        end: "2031-08-31",
        source_url: "https://www.rba.gov.au/media-releases/2026/mr-26-20.html"
      }
    ]
  }
};

// Make the data available to app.js whether loaded via <script> (file://) or
// imported as a module. The dashboard itself only relies on the global.
if (typeof window !== "undefined") { window.RBA_DATA = RBA_DATA; }
if (typeof module !== "undefined" && module.exports) { module.exports = RBA_DATA; }
