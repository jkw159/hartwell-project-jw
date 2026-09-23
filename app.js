const bids = [
  ["BID-9019", "HRT-1009", 120000, "Quote Intake & Requirements", "Pro Desk Coordinator", 6, 6, true, "Discount approval sitting in manager inbox"],
  ["BID-9020", "BGS-2004", 120000, "Product & Spec Matching", "Merchandising Support", 3, 5, false, ""],
  ["BID-9001", "BGS-2007", 94000, "Inventory & Sourcing Check", "Inventory Planning", 6, 9, true, "Bluegrass SKU numbers do not match Hartwell catalog; manual remap in progress"],
  ["BID-9007", "HRT-1031", 94000, "Follow-Up & Order Conversion", "Pro Rep", 1, 7, false, ""],
  ["BID-9024", "HRT-1020", 78000, "Quote Assembly", "Pro Rep", 1, 7, false, ""],
  ["BID-9009", "HRT-1027", 56000, "Pricing & Discount Approval", "Pro Sales Manager", 2, 5, true, "Bluegrass SKU numbers do not match Hartwell catalog; manual remap in progress"],
  ["BID-9017", "HRT-1025", 56000, "Quote Intake & Requirements", "Pro Desk Coordinator", 2, 2, true, "Handoff email missed; rediscovered in shared inbox"],
  ["BID-9006", "HRT-1003", 42000, "Pricing & Discount Approval", "Pro Sales Manager", 1, 6, false, ""],
  ["BID-9008", "HRT-1010", 42000, "Follow-Up & Order Conversion", "Pro Rep", 4, 15, false, ""],
  ["BID-9014", "BGS-2001", 42000, "Inventory & Sourcing Check", "Inventory Planning", 2, 6, false, ""],
  ["BID-9022", "HRT-1029", 42000, "Pricing & Discount Approval", "Pro Sales Manager", 1, 7, false, ""],
  ["BID-9015", "HRT-1006", 31000, "Inventory & Sourcing Check", "Inventory Planning", 3, 8, true, "Bluegrass SKU numbers do not match Hartwell catalog; manual remap in progress"],
  ["BID-9023", "HRT-1008", 31000, "Product & Spec Matching", "Merchandising Support", 4, 5, false, ""],
  ["BID-9002", "HRT-1013", 24000, "Quote Intake & Requirements", "Pro Desk Coordinator", 2, 2, false, ""],
  ["BID-9010", "HRT-1024", 24000, "Quote Intake & Requirements", "Pro Desk Coordinator", 5, 5, false, ""],
  ["BID-9011", "HRT-1019", 24000, "Pricing & Discount Approval", "Pro Sales Manager", 3, 8, true, "Handoff email missed; rediscovered in shared inbox"],
  ["BID-9021", "HRT-1032", 24000, "Quote Intake & Requirements", "Pro Desk Coordinator", 5, 5, true, "Discount approval sitting in manager inbox"],
  ["BID-9005", "HRT-1017", 18500, "Quote Assembly", "Pro Rep", 2, 7, false, ""],
  ["BID-9018", "HRT-1023", 18500, "Inventory & Sourcing Check", "Inventory Planning", 4, 7, false, ""],
  ["BID-9003", "HRT-1002", 12000, "Inventory & Sourcing Check", "Inventory Planning", 2, 5, true, "Bluegrass SKU numbers do not match Hartwell catalog; manual remap in progress"],
  ["BID-9016", "BGS-2003", 12000, "Inventory & Sourcing Check", "Inventory Planning", 1, 7, false, ""],
  ["BID-9004", "BGS-2005", 8500, "Quote Assembly", "Pro Rep", 4, 11, false, ""],
  ["BID-9012", "HRT-1018", 8500, "Inventory & Sourcing Check", "Inventory Planning", 5, 8, true, "Handoff email missed; rediscovered in shared inbox"],
  ["BID-9013", "HRT-1011", 8500, "Follow-Up & Order Conversion", "Pro Rep", 4, 13, true, "Waiting on vendor availability confirmation"],
].map(([id, accountId, value, stage, owner, stageDays, totalDays, blocked, blocker]) => ({ id, accountId, value, stage, owner, stageDays, totalDays, blocked, blocker }));

const proRepByAccount = {
  "HRT-1009": "N. Okonkwo", "BGS-2004": "D. Roush", "BGS-2007": "K. Womack", "HRT-1031": "B. Straka", "HRT-1020": "R. Han", "HRT-1027": "C. Albright", "HRT-1025": "R. Han", "HRT-1003": "B. Straka", "HRT-1010": "C. Albright", "BGS-2001": "G. Tillman", "HRT-1029": "C. Albright", "HRT-1006": "R. Han", "HRT-1008": "C. Albright", "HRT-1013": "N. Okonkwo", "HRT-1024": "N. Okonkwo", "HRT-1019": "C. Albright", "HRT-1032": "N. Okonkwo", "HRT-1017": "B. Straka", "HRT-1023": "B. Straka", "HRT-1002": "N. Okonkwo", "BGS-2003": "K. Womack", "BGS-2005": "S. Paredes", "HRT-1018": "B. Straka", "HRT-1011": "C. Albright",
};
const proReps = ["B. Straka", "C. Albright", "D. Roush", "G. Tillman", "K. Womack", "L. Duval", "M. Fenwick", "N. Okonkwo", "R. Han", "S. Paredes"];
bids.forEach(bid => { bid.proRep = proRepByAccount[bid.accountId]; });

const app = document.getElementById("app");
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function actionFor(bid) {
  const note = bid.blocker.toLowerCase();
  if (note.includes("discount approval")) return "Route to the Pro Sales Manager for approval review.";
  if (note.includes("sku numbers")) return "Route to Inventory Planning and Merchandising Support to verify the SKU crosswalk.";
  if (note.includes("handoff email")) return `Ask ${bid.owner} to confirm receipt and the next handoff.`;
  if (note.includes("vendor availability")) return "Route to Inventory Planning for vendor-availability confirmation.";
  return `Ask ${bid.owner} to confirm stage completion or identify a documented blocker.`;
}

function repActionFor(bid) {
  if (bid.blocker) return actionFor(bid);
  return "Follow up with current stage owner or update tracker with with stage completion or documented blocker.";
}

function isCritical(bid) { return bid.stageDays > 2 || bid.totalDays > 8; }
function whyToday(bid) {
  const reasons = [];
  if (bid.stageDays > 2) reasons.push(`${bid.stageDays} days in the current stage`);
  if (bid.totalDays > 8) reasons.push(`${bid.totalDays} total business days elapsed`);
  if (bid.blocked) reasons.push("documented blocker");
  return reasons.join(" · ");
}

function shell(content) {
  return `<header class="topbar"><div class="brand">Hartwell Supply Co. <span>Pro Bid Co-Pilot</span></div><div class="environment">Prototype · Operational data only</div></header>${content}`;
}

function renderLanding() {
  app.innerHTML = shell(`<section class="content">
    <p class="eyebrow">Pro desk workspace</p>
    <h1>What would you like to work on?</h1>
    <p class="lede">Choose the operational view that best matches the decision you need to make. This prototype uses the supplied de-identified quote-pipeline snapshot.</p>
    <div class="action-grid">
      <button class="action-card" id="show-attention" type="button">
        <span class="action-number">01</span><h2>Show which bids need attention today</h2>
        <p>Review bids that have remained too long in a stage, exceeded the expected quote cycle, or carry a documented blocker.</p>
        <span class="available">Available in this prototype</span>
      </button>
      <button class="action-card" id="show-my-actions" type="button">
        <span class="action-number">02</span><h2>Show which actions are critical for me</h2>
        <p>See the bids assigned to a selected Pro Rep, ranked using the same operational thresholds.</p><span class="available">Available in this prototype</span>
      </button>
      <button class="action-card" type="button" disabled>
        <span class="action-number">03</span><h2>Help me build my personalized prioritized backlog</h2>
        <p>Build a role-specific work plan from the current quote pipeline.</p><span class="coming">Next capability</span>
      </button>
    </div>
  </section>`);
  document.getElementById("show-attention").addEventListener("click", () => renderQueue("critical"));
  document.getElementById("show-my-actions").addEventListener("click", renderRepPicker);
}

function renderRepPicker() {
  app.innerHTML = shell(`<section class="content picker-page">
    <button class="back-link" type="button" id="back">← Back to actions</button>
    <p class="eyebrow">Option 2</p>
    <h1>Which actions are critical for you?</h1>
    <p class="lede">Enter your name to view the bids assigned to you as the Pro Rep. The co-pilot uses the same critical thresholds as the shared bid-attention queue.</p>
    <form class="rep-form" id="rep-form">
      <label for="pro-rep">Your name</label>
      <input id="pro-rep" name="pro-rep" list="pro-rep-list" autocomplete="off" placeholder="Start typing your name" required />
      <datalist id="pro-rep-list">${proReps.map(rep => `<option value="${rep}"></option>`).join("")}</datalist>
      <button class="primary-button" type="submit">Show my critical actions</button>
      <p class="form-hint">Select a name from the Pro Rep list or type it exactly as it appears in the account assignment data.</p>
      <p class="form-error" id="rep-error" role="alert" hidden></p>
    </form>
  </section>`);
  document.getElementById("back").addEventListener("click", renderLanding);
  document.getElementById("rep-form").addEventListener("submit", event => {
    event.preventDefault();
    const rep = document.getElementById("pro-rep").value.trim();
    const error = document.getElementById("rep-error");
    if (!proReps.includes(rep)) {
      error.textContent = "Choose a Pro Rep name from the supplied account-assignment data.";
      error.hidden = false;
      return;
    }
    renderRepQueue(rep, "critical");
  });
}

function row(bid, actionResolver = actionFor) {
  const state = bid.blocked ? "Blocked" : "Watch";
  return `<button class="bid-row" data-id="${bid.id}" type="button" aria-label="View ${bid.id}">
    <div><div class="bid-id">${bid.id}</div><span class="tag ${bid.blocked ? "blocked" : "watch"}">${state}</span></div>
    <div class="why">${whyToday(bid)}</div>
    <div class="stage-owner"><div><span class="field-label">Stage</span><div class="stage">${bid.stage}</div></div><div class="owner-field"><span class="field-label">Stage owner</span><div class="owner">${bid.owner}</div></div></div>
    <div class="days">${bid.stageDays}d<br><span class="owner">in stage</span></div>
    <div class="value">${money.format(bid.value)}</div>
    <div><span class="field-label">Next action</span><div class="next-action">${actionResolver(bid)}</div></div>
  </button>`;
}

function renderQueue(filter) {
  const critical = bids.filter(isCritical);
  const blockedUnderThreshold = bids.filter(b => b.blocked && !isCritical(b));
  const filtered = filter === "critical" ? critical : filter === "blocked" ? blockedUnderThreshold : bids;
  const totalBlocked = bids.filter(b => b.blocked);
  const criticalValue = critical.reduce((sum, b) => sum + b.value, 0);
  app.innerHTML = shell(`<section class="content">
    <button class="back-link" type="button" id="back">← Back to actions</button>
    <div class="queue-header">
      <div><p class="eyebrow">Option 1</p><h1>Today’s bid attention queue</h1><p class="snapshot">Current operational snapshot: ${bids.length} active bids imported from the supplied quote-pipeline file.</p></div>
      <aside class="guardrail"><strong>Safety boundary</strong>The co-pilot recommends internal routing and next steps. It does not recommend a price, discount, policy, inventory commitment, or customer-facing response.</aside>
    </div>
    <div class="metrics">
      <div class="metric critical"><div class="metric-label">Critical today</div><div class="metric-value">${critical.length}</div></div>
      <div class="metric"><div class="metric-label">Critical bid value</div><div class="metric-value">${money.format(criticalValue)}</div></div>
      <div class="metric"><div class="metric-label">Blocked bids</div><div class="metric-value">${totalBlocked.length}</div></div>
      <div class="metric"><div class="metric-label">Blocked bid value</div><div class="metric-value">${money.format(totalBlocked.reduce((sum, b) => sum + b.value, 0))}</div></div>
    </div>
    <section class="criteria"><div><h2>Why a bid is critical today</h2><p>A bid is critical when it has spent more than two business days in its current stage or more than eight business days in the full quote cycle. The queue also shows documented blockers and the accountable team so users can act.</p></div></section>
    <div class="filter-bar"><h2>${filter === "critical" ? "Critical today" : filter === "blocked" ? "Blocked, below critical threshold" : "All active bids"}</h2><div class="filters" role="group" aria-label="Queue filter">
      <button class="filter" data-filter="critical" aria-pressed="${filter === "critical"}">Critical today (${critical.length})</button>
      <button class="filter" data-filter="blocked" aria-pressed="${filter === "blocked"}">Blocked, below threshold (${blockedUnderThreshold.length})</button>
      <button class="filter" data-filter="all" aria-pressed="${filter === "all"}">All bids (${bids.length})</button>
    </div></div>
    <section class="queue" aria-label="Bid attention queue"><div class="queue-head"><div>Bid</div><div>Why today</div><div>Stage and owner</div><div>Age</div><div>Value</div><div>Recommended next step</div></div>${filtered.length ? filtered.sort((a,b) => b.totalDays - a.totalDays || b.stageDays - a.stageDays || b.value - a.value).map(row).join("") : `<div class="empty">No bids match this view.</div>`}</section>
    <section class="detail" id="detail" hidden></section>
  </section>`);
  document.getElementById("back").addEventListener("click", renderLanding);
  document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => renderQueue(button.dataset.filter)));
  document.querySelectorAll(".bid-row").forEach(button => button.addEventListener("click", () => showDetail(bids.find(b => b.id === button.dataset.id))));
}

function renderRepQueue(rep, filter) {
  const repBids = bids.filter(bid => bid.proRep === rep);
  const critical = repBids.filter(isCritical);
  const blockedUnderThreshold = repBids.filter(bid => bid.blocked && !isCritical(bid));
  const filtered = filter === "critical" ? critical : filter === "blocked" ? blockedUnderThreshold : repBids;
  const blocked = repBids.filter(bid => bid.blocked);
  const criticalValue = critical.reduce((sum, bid) => sum + bid.value, 0);
  app.innerHTML = shell(`<section class="content">
    <button class="back-link" type="button" id="back">← Choose another Pro Rep</button>
    <div class="queue-header">
      <div><p class="eyebrow">Option 2 · ${rep}</p><h1>My critical bid actions</h1><p class="snapshot">${repBids.length} active bids assigned to ${rep} through the account-to-Pro Rep lookup.</p></div>
      <aside class="guardrail"><strong>Safety boundary</strong>The co-pilot recommends internal routing and next steps. It does not recommend a price, discount, policy, inventory commitment, or customer-facing response.</aside>
    </div>
    <div class="metrics">
      <div class="metric critical"><div class="metric-label">Critical today</div><div class="metric-value">${critical.length}</div></div>
      <div class="metric"><div class="metric-label">Critical bid value</div><div class="metric-value">${money.format(criticalValue)}</div></div>
      <div class="metric"><div class="metric-label">My blocked bids</div><div class="metric-value">${blocked.length}</div></div>
      <div class="metric"><div class="metric-label">My blocked bid value</div><div class="metric-value">${money.format(blocked.reduce((sum, bid) => sum + bid.value, 0))}</div></div>
    </div>
    <section class="criteria"><div><h2>Why a bid is critical today</h2><p>A bid is critical when it has spent more than two business days in its current stage or more than eight business days in the full quote cycle. This view includes only bids assigned to ${rep}.</p></div></section>
    <div class="filter-bar"><h2>${filter === "critical" ? "My critical actions" : filter === "blocked" ? "My blocked bids, below critical threshold" : "All my active bids"}</h2><div class="filters" role="group" aria-label="Queue filter">
      <button class="filter" data-filter="critical" aria-pressed="${filter === "critical"}">Critical today (${critical.length})</button>
      <button class="filter" data-filter="blocked" aria-pressed="${filter === "blocked"}">Blocked, below threshold (${blockedUnderThreshold.length})</button>
      <button class="filter" data-filter="all" aria-pressed="${filter === "all"}">All my bids (${repBids.length})</button>
    </div></div>
    <section class="queue" aria-label="Pro Rep bid attention queue"><div class="queue-head"><div>Bid</div><div>Why today</div><div>Stage and owner</div><div>Age</div><div>Value</div><div>Recommended next step</div></div>${filtered.length ? filtered.sort((a,b) => b.totalDays - a.totalDays || b.stageDays - a.stageDays || b.value - a.value).map(bid => row(bid, repActionFor)).join("") : `<div class="empty">No bids match this view.</div>`}</section>
    <section class="detail" id="detail" hidden></section>
  </section>`);
  document.getElementById("back").addEventListener("click", renderRepPicker);
  document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => renderRepQueue(rep, button.dataset.filter)));
  document.querySelectorAll(".bid-row").forEach(button => button.addEventListener("click", () => showDetail(bids.find(bid => bid.id === button.dataset.id), repActionFor)));
}

function showDetail(bid, actionResolver = actionFor) {
  const detail = document.getElementById("detail");
  detail.hidden = false;
  detail.innerHTML = `<div><h2>${bid.id}</h2><p>${isCritical(bid) ? "Critical today based on the published queue thresholds." : "Blocked bid that remains below the critical threshold."}</p>
    <div class="fact-list"><div class="fact"><div class="fact-label">Current stage</div><div class="fact-value">${bid.stage}</div></div><div class="fact"><div class="fact-label">Accountable team</div><div class="fact-value">${bid.owner}</div></div><div class="fact"><div class="fact-label">Assigned Pro Rep</div><div class="fact-value">${bid.proRep}</div></div><div class="fact"><div class="fact-label">Stage age</div><div class="fact-value">${bid.stageDays} business days</div></div><div class="fact"><div class="fact-label">Total elapsed time</div><div class="fact-value">${bid.totalDays} business days</div></div><div class="fact"><div class="fact-label">Bid value</div><div class="fact-value">${money.format(bid.value)}</div></div><div class="fact"><div class="fact-label">Blocked status</div><div class="fact-value">${bid.blocked ? "Yes" : "No"}</div></div></div>
    <h3>Documented source record</h3><p>${bid.blocker || "No blocker is recorded. The next step is to confirm stage completion or capture a documented blocker."}</p></div>
    <aside class="safe-boundary"><h3>Recommended next action</h3><p>${actionResolver(bid)}</p><h3>Opportunity for future capability development</h3><p>The co-pilot cannot set a price, discount, or interpret policy. AI-pricing would require detailed inputs, but could be developed at a later date.</p></aside>`;
  detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

renderLanding();
