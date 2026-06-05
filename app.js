/* ============================================================
   RBA Board Vote Tracker — "Quiet" direction wiring
   Page-specific glue. All reusable logic (chart, table, filters,
   theme, count-up, reveal) lives in core.js (window.RBACore).
   ============================================================ */
(function(){
  "use strict";
  var C = window.RBACore, H = C.helpers, DATA = C.DATA;
  var d = DATA.decisions[DATA.decisions.length-1];
  var info = H.describe(d);
  var total = d.votes_for + d.votes_against;
  var unanimous = d.votes_against === 0;

  // hero statement
  var verbWord = info.dir==="flat" ? "held the cash rate steady" : (info.dir==="up" ? "raised the cash rate" : "lowered the cash rate");
  var voteWord = unanimous ? "unanimously" : "in an "+d.votes_for+"–"+d.votes_against+" vote";
  document.getElementById("hero-h").innerHTML =
    'On '+H.formatDate(d.meeting_date)+', the Board <span class="accent">'+verbWord+'</span>, '+voteWord+'.';
  document.getElementById("hero-eyebrow").textContent = "Latest decision · "+H.formatDate(d.meeting_date);

  // rate art
  var chip = document.getElementById("rate-chip");
  if (d.change_bps===0){ chip.innerHTML = '<span class="ar">●</span> No change'; }
  else { chip.innerHTML = '<span class="ar">'+(d.change_bps>0?"▲":"▼")+'</span> '+(d.change_bps>0?"Up ":"Down ")+H.fmtPP(d.change_bps); }
  document.getElementById("rate-meet").textContent = "this meeting";

  // vote
  document.getElementById("v-tag").textContent = unanimous ? "Unanimous" : "Majority";
  document.getElementById("key-for").textContent = d.votes_for + " for the decision";
  document.getElementById("key-against").textContent = d.votes_against + " against";
  var dots = document.getElementById("dots");
  dots.setAttribute("aria-label", unanimous ? ("All "+d.votes_for+" members for; 0 against.") : (d.votes_for+" for; "+d.votes_against+" against, of "+total+"."));
  var dotHtml = "";
  for (var i=0;i<total;i++){ dotHtml += '<span class="dot" data-i="'+i+'" style="animation-delay:'+(0.5 + i*0.07)+'s"></span>'; }
  dots.innerHTML = dotHtml;

  if (d.dissent_note) document.getElementById("hero-dissent").innerHTML = '<p class="dissent">'+H.escapeHtml(d.dissent_note)+'</p>';
  document.getElementById("hero-read").href = d.source_url;

  // theme
  var chartApi=null;
  var themeLabel=document.getElementById("theme-label");
  var theme=C.initTheme({ def:"light", key:"rba-theme-quiet", onChange:function(mode){
    themeLabel.textContent = mode==="dark" ? "Light" : "Dark";
    if (chartApi) chartApi.rebuild();
  }});
  document.getElementById("theme-toggle").addEventListener("click", theme.toggle);

  // chart
  chartApi = C.buildChart("chart", { markerFill:"accent", lineWidth:2.2, tipRadius:"12px" });

  // table + filters
  C.setupFilters({
    yearSel: document.getElementById("filter-year"),
    checks: Array.prototype.slice.call(document.querySelectorAll('input[name="type"]')),
    resetBtn: document.getElementById("filter-reset"),
    statusEl: document.getElementById("filter-status"),
    onApply: function(year, types){
      var n = C.renderTable("record-tbody", year, types);
      if (chartApi) chartApi.update(year, types);
      return n;
    }
  });

  // animate
  C.revealOnLoad();
  C.countUp(document.getElementById("rate-num"), d.cash_rate_pct, { decimals:2, suffix:"%", duration:1500, delay:400 });
  C.countUp(document.getElementById("v-for"), d.votes_for, { decimals:0, duration:1000, delay:650 });
  C.countUp(document.getElementById("v-against"), d.votes_against, { decimals:0, duration:1000, delay:650 });
  // colour the dots after they pop
  var dotEls = dots.querySelectorAll(".dot");
  dotEls.forEach(function(el, idx){ if (idx < d.votes_for) el.classList.add("for"); else el.classList.add("against"); });
})();
