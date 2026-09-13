/* Thursday — the one file that knows when and where.
 *
 * THE ONLY LINE A HOST EVER EDITS IS joinUrl BELOW. Paste the recurring meeting link once; every
 * page that shows Thursday (the practice café, docs/THURSDAY, the Foundation's Thursday page, the
 * community platform's events card) reads this file and renders the next Thursday's date itself —
 * 15:00 Pacific, with the UTC hour worked out for daylight-saving — so nothing goes stale and nobody
 * updates a line each week.
 */
window.THURSDAY = {
  joinUrl: "",            // ← paste the recurring meeting link here (Google Meet / Zoom). Empty = "posted by 14:45 Pacific".
  host: "Ken",
  hourPacific: 15
};

(function () {
  var cfg = window.THURSDAY, TZ = "America/Los_Angeles";
  function fmt(d, opts) { return new Intl.DateTimeFormat("en-GB", Object.assign({ timeZone: TZ }, opts)).format(d); }
  function hourIn(d) { return parseInt(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hour12: false }).format(d), 10) % 24; }
  function ymd(d) { return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d); }

  // Next Thursday in Pacific time. On a Thursday before 10:00 Pacific, that is today.
  var d = new Date();
  for (var i = 0; i < 8; i++) {
    var wd = fmt(d, { weekday: "long" });
    if (wd === "Thursday" && !(i === 0 && hourIn(d) >= cfg.hourPacific + 1)) break;
    d = new Date(d.getTime() + 864e5);
  }
  // The UTC hour of 15:00 Pacific on that day (22 in summer, 23 in winter).
  var utcHour = null, day = ymd(d);
  [22, 23, 21, 0, 16, 17, 15, 18, 19, 20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].some(function (h) { var t = new Date(day + "T" + (h < 10 ? "0" + h : h) + ":00:00Z"); if (hourIn(t) === cfg.hourPacific) { utcHour = h; return true; } });

  var dateStr = fmt(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var timeStr = (cfg.hourPacific < 10 ? "0" : "") + cfg.hourPacific + ":00 Pacific" + (utcHour !== null ? " (" + utcHour + ":00 UTC)" : "");

  function render() {
    document.querySelectorAll('[data-thursday="date"]').forEach(function (el) { el.textContent = dateStr; });
    document.querySelectorAll('[data-thursday="time"]').forEach(function (el) { el.textContent = timeStr; });
    document.querySelectorAll('[data-thursday="host"]').forEach(function (el) { el.textContent = cfg.host; });
    document.querySelectorAll('[data-thursday="line"]').forEach(function (el) { el.textContent = dateStr + " · " + timeStr + " · " + cfg.host + " hosts"; });
    document.querySelectorAll('[data-thursday="join"]').forEach(function (el) {
      if (cfg.joinUrl) { el.setAttribute("href", cfg.joinUrl); el.textContent = "Join the call →"; el.removeAttribute("aria-disabled"); }
      else { el.textContent = "Join link — posted here by 14:45 Pacific on the day"; el.setAttribute("aria-disabled", "true"); if (!el.getAttribute("href")) el.setAttribute("href", "#"); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
  window.THURSDAY.next = { date: dateStr, time: timeStr, iso: day };
})();
