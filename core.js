/* ============================================================
   RBA Vote Tracker — shared core
   One source of logic for all three design directions.
   Each direction supplies its own CSS (via custom properties)
   and its own hero renderer; everything else lives here.
   The chart reads CSS custom properties at build time, so the
   look follows whatever theme the page defines.
   ============================================================ */
(function () {
  "use strict";

  var DATA = window.RBA_DATA;

  // ---------- date / number helpers ----------
  var DAY = 86400000;
  var MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  function parseDate(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function ts(s) { return parseDate(s).getTime(); }
  function yearOf(s) { return s.slice(0, 4); }
  function formatDate(s) { var d = parseDate(s); return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear(); }
  function formatDateShort(s) { var d = parseDate(s); return d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3) + " " + d.getFullYear(); }
  function shortDate(t) { var d = new Date(t); return MONTHS[d.getMonth()].slice(0, 3) + " " + d.getFullYear(); }
  function fmtRate(p) { return p.toFixed(2) + "%"; }
  function fmtPP(bps) {
    var v = (Math.abs(bps) / 100).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return v + "%";
  }
  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function rateAt(s) {
    var t = ts(s), r = null;
    DATA.rateHistory.forEach(function (p) { if (ts(p.date) <= t) r = p.cash_rate_pct; });
    return r;
  }
  function describe(d) {
    if (d.decision_type === "hike") {
      return { glyph: "▲", short: "Hike", verb: "Raised", verbLong: "Raised by " + fmtPP(d.change_bps), sub: "Cash-rate target raised", dir: "up" };
    }
    if (d.decision_type === "cut") {
      return { glyph: "▼", short: "Cut", verb: "Lowered", verbLong: "Lowered by " + fmtPP(d.change_bps), sub: "Cash-rate target lowered", dir: "down" };
    }
    return { glyph: "●", short: "Hold", verb: "Held", verbLong: "Held steady", sub: "Cash-rate target unchanged", dir: "flat" };
  }
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // ---------- count-up animation ----------
  // Animates a number from 0 -> target. Respects reduced motion.
  function countUp(el, target, opts) {
    opts = opts || {};
    var decimals = opts.decimals != null ? opts.decimals : 0;
    var dur = opts.duration != null ? opts.duration : 1100;
    var prefix = opts.prefix || "";
    var suffix = opts.suffix || "";
    var delay = opts.delay || 0;
    var ease = opts.ease || function (t) { return 1 - Math.pow(1 - t, 3); }; // easeOutCubic

    function set(v) { el.textContent = prefix + v.toFixed(decimals) + suffix; }

    if (prefersReducedMotion() || dur <= 0) { set(target); return; }
    set(0);
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / dur);
      set(target * ease(t));
      if (t < 1) requestAnimationFrame(frame);
      else set(target);
    }
    setTimeout(function () { requestAnimationFrame(frame); }, delay);
  }

  // ---------- chart ----------
  // Builds the cash-rate line + vote markers. Reads CSS vars so it
  // follows the active theme. Returns { instance, update, rebuild, dispose }.
  var UP = "path://M512 96 L928 864 L96 864 Z";
  var DOWN = "path://M96 160 L928 160 L512 928 Z";

  function buildChart(elId, cfg) {
    cfg = cfg || {};
    var el = typeof elId === "string" ? document.getElementById(elId) : elId;
    if (!el) return null;
    if (!window.echarts) {
      el.innerHTML = '<p style="padding:18px;opacity:.6">The chart could not load. The full record is in the table below.</p>';
      return null;
    }

    var chart = null;
    var currentYear = "all";
    var currentTypes = { cut: true, hold: true, hike: true };

    function theme() {
      return {
        ink: cssVar("--chart-ink", cssVar("--ink", "#1a1a1a")),
        accent: cssVar("--chart-accent", cssVar("--accent", "#1d4ed8")),
        muted: cssVar("--chart-muted", cssVar("--muted", "#888")),
        line: cssVar("--chart-line", cssVar("--line", "#d6d7da")),
        grid: cssVar("--chart-grid", cssVar("--grid", "#ebecee")),
        bg: cssVar("--chart-bg", "transparent"),
        font: cssVar("--font-mono", cssVar("--font", "sans-serif"))
      };
    }

    function scatterSeries(type, t) {
      var names = { hike: "Hike", hold: "Hold", cut: "Cut" };
      var symbols = { hike: UP, hold: "circle", cut: DOWN };
      return {
        name: names[type], type: "scatter",
        symbol: symbols[type], symbolSize: type === "hold" ? 11 : 13,
        z: 10,
        itemStyle: {
          color: cfg.markerFill === "ink" ? t.ink : t.accent,
          borderColor: t.bg === "transparent" ? "#fff" : t.bg,
          borderWidth: 1.5
        },
        emphasis: { scale: 1.4, focus: "none", itemStyle: { color: t.accent } },
        data: []
      };
    }
    function scatterData(type, year, on) {
      if (!on) return [];
      return DATA.decisions.filter(function (d) {
        return d.decision_type === type && (year === "all" || yearOf(d.meeting_date) === year);
      }).map(function (d) { return { value: [ts(d.meeting_date), d.cash_rate_pct], decision: d }; });
    }
    function tooltipFormatter(p) {
      if (p.data && p.data.decision) {
        var d = p.data.decision, info = describe(d);
        var split = d.votes_against === 0
          ? ("Unanimous · " + d.votes_for + "–0")
          : (d.votes_for + "–" + d.votes_against);
        var s = "<strong>" + formatDate(d.meeting_date) + "</strong><br>"
          + info.short + " · cash rate " + fmtRate(d.cash_rate_pct) + "<br>"
          + "Vote: " + split;
        if (d.dissent_note) s += '<br><span style="opacity:.7">' + escapeHtml(d.dissent_note) + "</span>";
        return s;
      }
      var v = p.value;
      return "<strong>" + fmtRate(v[1]) + "</strong> cash-rate target<br>" + shortDate(v[0]);
    }
    function yearWindow(year) {
      if (year === "all") return [null, null];
      var start = ts(year + "-01-01") - 12 * DAY;
      var latestYear = yearOf(DATA.meta.lastUpdated);
      var end = (year === latestYear) ? ts(DATA.meta.lastUpdated) + 18 * DAY : ts(year + "-12-31") + 12 * DAY;
      return [start, end];
    }

    function render() {
      if (chart) chart.dispose();
      var t = theme();
      chart = echarts.init(el, null, { renderer: "svg" });

      var boundaryTs = ts(DATA.meta.voteRecordStart);
      var boundaryRate = rateAt(DATA.meta.voteRecordStart);
      var firstTs = ts(DATA.rateHistory[0].date);
      var lastRate = DATA.rateHistory[DATA.rateHistory.length - 1].cash_rate_pct;

      var pre = [], post = [];
      DATA.rateHistory.forEach(function (p) {
        var pair = [ts(p.date), p.cash_rate_pct];
        if (ts(p.date) <= boundaryTs) pre.push(pair); else post.push(pair);
      });
      pre.push([boundaryTs, boundaryRate]);
      post.unshift([boundaryTs, boundaryRate]);
      post.push([ts(DATA.meta.lastUpdated), lastRate]);

      var anim = !prefersReducedMotion();
      var option = {
        animation: anim,
        animationDuration: anim ? 1600 : 0,
        animationEasing: "cubicOut",
        textStyle: { fontFamily: t.font, color: t.ink },
        grid: { left: 4, right: 18, top: 40, bottom: 4, containLabel: true },
        legend: cfg.hideLegend ? { show: false } : {
          top: 4, selectedMode: false, itemGap: 16, icon: "roundRect",
          textStyle: { color: t.muted, fontSize: 11, fontFamily: t.font },
          data: [
            { name: "Cash rate", icon: "line" },
            { name: "Hike", icon: UP },
            { name: "Hold", icon: "circle" },
            { name: "Cut", icon: DOWN }
          ]
        },
        tooltip: {
          trigger: "item", confine: true, triggerOn: "mousemove|click",
          backgroundColor: cssVar("--chart-tip-bg", "#fff"),
          borderColor: t.line, borderWidth: 1,
          textStyle: { color: cssVar("--chart-tip-ink", t.ink), fontSize: 12.5, fontFamily: t.font },
          extraCssText: "box-shadow:0 8px 30px rgba(0,0,0,.18);border-radius:" + (cfg.tipRadius || "8px") + ";padding:9px 12px;",
          formatter: tooltipFormatter
        },
        xAxis: {
          type: "time",
          axisLine: { lineStyle: { color: t.line } },
          axisTick: { lineStyle: { color: t.line } },
          axisLabel: { color: t.muted, fontSize: 11, fontFamily: t.font },
          splitLine: { show: false }
        },
        yAxis: {
          type: "value", min: 0, max: 5, interval: 1,
          axisLabel: { color: t.muted, fontSize: 11, fontFamily: t.font, formatter: "{value}%" },
          axisLine: { show: false }, axisTick: { show: false },
          splitLine: { lineStyle: { color: t.grid, type: cfg.gridDash || "solid" } }
        },
        series: [
          {
            name: "Cash rate (before vote records)", type: "line", step: "end",
            data: pre, showSymbol: false, z: 2,
            lineStyle: { color: t.muted, width: 1.5, type: "dashed", opacity: .8 },
            markArea: {
              silent: true, itemStyle: { color: cssVar("--chart-prearea", "rgba(128,128,128,0.06)") },
              data: [[{ xAxis: firstTs }, { xAxis: boundaryTs }]]
            }
          },
          {
            name: "Cash rate", type: "line", step: "end",
            data: post, showSymbol: false, z: 3,
            lineStyle: { color: t.ink, width: cfg.lineWidth || 2.4 },
            markLine: {
              symbol: "none", silent: true,
              lineStyle: { color: t.muted, type: "dotted", width: 1 },
              label: { formatter: "Vote records begin", position: "insideEndTop", color: t.muted, fontSize: 10.5, fontFamily: t.font },
              data: [{ xAxis: boundaryTs }]
            }
          },
          scatterSeries("hike", t), scatterSeries("hold", t), scatterSeries("cut", t)
        ]
      };
      chart.setOption(option);
      applyMarkers();
    }

    function applyMarkers() {
      if (!chart) return;
      var t = theme();
      var win = yearWindow(currentYear);
      function s(type) {
        var base = scatterSeries(type, t);
        base.data = scatterData(type, currentYear, currentTypes[type]);
        return base;
      }
      chart.setOption({
        xAxis: { min: win[0], max: win[1] },
        series: [{}, {}, s("hike"), s("hold"), s("cut")]
      }, false);
    }

    function update(year, types) {
      currentYear = year; currentTypes = types;
      applyMarkers();
    }

    render();
    var resizeRAF;
    window.addEventListener("resize", function () {
      cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(function () { if (chart) chart.resize(); });
    });

    return {
      get instance() { return chart; },
      update: update,
      rebuild: function () { render(); },   // re-read CSS vars (after theme switch)
      resize: function () { if (chart) chart.resize(); }
    };
  }

  // ---------- table ----------
  function renderTable(tbodyEl, year, types) {
    var tb = typeof tbodyEl === "string" ? document.getElementById(tbodyEl) : tbodyEl;
    var rows = DATA.decisions.slice().reverse().filter(function (d) {
      return (year === "all" || yearOf(d.meeting_date) === year) && types[d.decision_type];
    });
    if (!rows.length) {
      tb.innerHTML = '<tr class="empty-row"><td colspan="6">No decisions match these filters.</td></tr>';
      return 0;
    }
    tb.innerHTML = rows.map(function (d) {
      var info = describe(d);
      var change = d.change_bps === 0 ? "—" : (d.change_bps > 0 ? "+" : "−") + fmtPP(d.change_bps);
      var vote = d.votes_for + "–" + d.votes_against
        + (d.votes_against === 0 ? ' <span class="tag-unanimous">Unanimous</span>' : "");
      return '<tr data-type="' + d.decision_type + '">'
        + '<td class="num">' + formatDateShort(d.meeting_date) + "</td>"
        + "<td>"
        + '<span class="cell-decision" data-dir="' + info.dir + '"><span class="glyph" aria-hidden="true">' + info.glyph + "</span>" + info.short + "</span>"
        + (d.dissent_note ? '<div class="row-dissent">' + escapeHtml(d.dissent_note) + "</div>" : "")
        + "</td>"
        + '<td class="num">' + change + "</td>"
        + '<td class="num rate">' + fmtRate(d.cash_rate_pct) + "</td>"
        + '<td class="vote-cell">' + vote + "</td>"
        + '<td><a href="' + d.source_url + '" rel="noopener">RBA&nbsp;statement ↗</a></td>'
        + "</tr>";
    }).join("");
    return rows.length;
  }

  // ---------- theme toggle ----------
  function initTheme(opts) {
    opts = opts || {};
    var KEY = opts.key || "rba-theme";
    var html = document.documentElement;
    function apply(mode) {
      html.setAttribute("data-theme", mode);
      if (opts.onChange) opts.onChange(mode);
    }
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var initial = saved || opts.def || "light";
    apply(initial);
    return {
      get: function () { return html.getAttribute("data-theme"); },
      toggle: function () {
        var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        try { localStorage.setItem(KEY, next); } catch (e) {}
        apply(next);
        return next;
      }
    };
  }

  // ---------- filters wiring ----------
  function setupFilters(opts) {
    var yearSel = opts.yearSel, checks = opts.checks, resetBtn = opts.resetBtn,
      statusEl = opts.statusEl, onApply = opts.onApply;

    var years = [];
    DATA.decisions.forEach(function (d) { var y = yearOf(d.meeting_date); if (years.indexOf(y) < 0) years.push(y); });
    years.sort();
    years.forEach(function (y) {
      var o = document.createElement("option"); o.value = y; o.textContent = y; yearSel.appendChild(o);
    });

    function currentTypes() { var t = {}; checks.forEach(function (cb) { t[cb.value] = cb.checked; }); return t; }
    function apply() {
      var year = yearSel.value, types = currentTypes();
      var shown = onApply(year, types);
      if (statusEl) {
        statusEl.textContent = "Showing " + shown + " of " + DATA.decisions.length
          + " published votes" + (year === "all" ? "" : " in " + year) + ".";
      }
    }
    yearSel.addEventListener("change", apply);
    checks.forEach(function (cb) { cb.addEventListener("change", apply); });
    if (resetBtn) resetBtn.addEventListener("click", function () {
      yearSel.value = "all"; checks.forEach(function (cb) { cb.checked = true; }); apply();
    });
    apply();
  }

  // ---------- entrance reveal ----------
  function revealOnLoad() {
    var done = false;
    function go() { if (done) return; done = true; document.documentElement.setAttribute("data-revealed", "1"); }
    requestAnimationFrame(function () { requestAnimationFrame(go); });
    setTimeout(go, 140);
  }

  window.RBACore = {
    DATA: DATA,
    helpers: {
      parseDate: parseDate, ts: ts, yearOf: yearOf, formatDate: formatDate,
      formatDateShort: formatDateShort, shortDate: shortDate, fmtRate: fmtRate,
      fmtPP: fmtPP, describe: describe, escapeHtml: escapeHtml, rateAt: rateAt,
      prefersReducedMotion: prefersReducedMotion
    },
    countUp: countUp,
    buildChart: buildChart,
    renderTable: renderTable,
    initTheme: initTheme,
    setupFilters: setupFilters,
    revealOnLoad: revealOnLoad
  };
})();
