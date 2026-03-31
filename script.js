const suggestBtn = document.getElementById("suggestBtn");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadCsvBtn = document.getElementById("downloadCsvBtn");
const printBtn = document.getElementById("printBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const resultBadge = document.getElementById("resultBadge");
const reasonText = document.getElementById("reason");
const hazardLevel = document.getElementById("hazardLevel");
const routeText = document.getElementById("routeText");
const awarenessTip = document.getElementById("awarenessTip");
const historyBody = document.getElementById("historyBody");

const totalCount = document.getElementById("totalCount");
const repairCount = document.getElementById("repairCount");
const reuseCount = document.getElementById("reuseCount");
const recycleRecoverCount = document.getElementById("recycleRecoverCount");

const reuseBar = document.getElementById("reuseBar");
const repairBar = document.getElementById("repairBar");
const recycleBar = document.getElementById("recycleBar");
const recoverBar = document.getElementById("recoverBar");

let currentResult = null;
let historyList = [];

suggestBtn.addEventListener("click", suggestAction);
addBtn.addEventListener("click", addToHistory);
resetBtn.addEventListener("click", resetForm);
downloadCsvBtn.addEventListener("click", downloadCSV);
printBtn.addEventListener("click", () => window.print());
clearHistoryBtn.addEventListener("click", clearHistory);

function suggestAction() {
  const inputs = getInputs();
  const result = classifyDevice(inputs);
  currentResult = { ...inputs, ...result };

  resultBadge.textContent = result.action;
  resultBadge.className = `result-badge ${result.badgeClass}`;
  reasonText.textContent = result.reason;
  hazardLevel.textContent = result.hazard;
  routeText.textContent = result.route;
  awarenessTip.textContent = result.tip;
}

function getInputs() {
  return {
    deviceType: document.getElementById("deviceType").value,
    condition: document.getElementById("condition").value,
    repairable: document.getElementById("repairable").value,
    reusable: document.getElementById("reusable").value,
    recovery: document.getElementById("recovery").value
  };
}

function classifyDevice({ deviceType, condition, repairable, reusable, recovery }) {
  let action = "";
  let reason = "";
  let badgeClass = "neutral";
  let hazard = "Low";
  let route = "";
  let tip = "";

  if (deviceType === "battery") {
    hazard = "High";
  } else if (deviceType === "charger" || deviceType === "cable") {
    hazard = "Moderate";
  }

  if ((condition === "working" || condition === "old") && reusable === "yes") {
    action = "Reuse / Refurbish";
    reason = "The device is still usable, so extending its life is the most sustainable option.";
    badgeClass = "reuse";
    route = "Refurbishment / Reuse Center";
    tip = "Working devices should be reused before recycling to reduce waste generation.";
  } else if (repairable === "yes") {
    action = "Repair";
    reason = "The device is not fully usable now, but it can be repaired and brought back into use.";
    badgeClass = "repair";
    route = "Repair Center / Technician";
    tip = "Repairing a device can extend product life and reduce early disposal.";
  } else if (recovery === "yes") {
    if (deviceType === "battery") {
      action = "Recycle";
      reason = "The item may contain hazardous material, so formal recycling is the safest action.";
      badgeClass = "recycle";
      route = "Authorized Hazardous Recycler";
      tip = "Do not throw batteries in general waste. Always send them to formal recyclers.";
    } else {
      action = "Recover";
      reason = "The device is not reusable, but useful materials can still be recovered from it.";
      badgeClass = "recover";
      route = "Material Recovery Unit";
      tip = "Material recovery helps prevent loss of valuable metals and components.";
    }
  } else {
    action = "Recycle";
    reason = "The safest remaining option is formal recycling.";
    badgeClass = "recycle";
    route = "Authorized Recycler";
    tip = "Non-reusable electronics should be sent to formal recycling channels.";
  }

  return { action, reason, badgeClass, hazard, route, tip };
}

function addToHistory() {
  if (!currentResult) {
    alert("Please click 'Suggest Best Action' first.");
    return;
  }

  historyList.push(currentResult);
  renderHistory();
  updateCounters();
  updateChart();
}

function renderHistory() {
  if (historyList.length === 0) {
    historyBody.innerHTML = `<tr class="empty-row"><td colspan="8">No records added yet.</td></tr>`;
    return;
  }

  historyBody.innerHTML = historyList
    .map(
      item => `
      <tr>
        <td>${formatDevice(item.deviceType)}</td>
        <td>${formatCondition(item.condition)}</td>
        <td>${capitalizeYesNo(item.repairable)}</td>
        <td>${capitalizeYesNo(item.reusable)}</td>
        <td>${capitalizeYesNo(item.recovery)}</td>
        <td>${item.action}</td>
        <td>${item.hazard}</td>
        <td>${item.route}</td>
      </tr>
    `
    )
    .join("");
}

function updateCounters() {
  const repair = historyList.filter(item => item.action === "Repair").length;
  const reuse = historyList.filter(item => item.action === "Reuse / Refurbish").length;
  const recycleRecover = historyList.filter(
    item => item.action === "Recycle" || item.action === "Recover"
  ).length;

  totalCount.textContent = historyList.length;
  repairCount.textContent = repair;
  reuseCount.textContent = reuse;
  recycleRecoverCount.textContent = recycleRecover;
}

function updateChart() {
  const total = historyList.length || 1;

  const reuse = historyList.filter(item => item.action === "Reuse / Refurbish").length;
  const repair = historyList.filter(item => item.action === "Repair").length;
  const recycle = historyList.filter(item => item.action === "Recycle").length;
  const recover = historyList.filter(item => item.action === "Recover").length;

  setBar(reuseBar, reuse, total);
  setBar(repairBar, repair, total);
  setBar(recycleBar, recycle, total);
  setBar(recoverBar, recover, total);
}

function setBar(element, count, total) {
  const percent = Math.round((count / total) * 100);
  element.style.width = `${percent}%`;
  element.textContent = `${percent}%`;
}

function resetForm() {
  document.getElementById("deviceType").selectedIndex = 0;
  document.getElementById("condition").selectedIndex = 0;
  document.getElementById("repairable").selectedIndex = 0;
  document.getElementById("reusable").selectedIndex = 0;
  document.getElementById("recovery").selectedIndex = 0;

  resultBadge.textContent = "Waiting";
  resultBadge.className = "result-badge neutral";
  reasonText.textContent = "The result and explanation will appear here.";
  hazardLevel.textContent = "—";
  routeText.textContent = "—";
  awarenessTip.textContent = "Useful guidance will appear here after classification.";
  currentResult = null;
}

function clearHistory() {
  if (historyList.length === 0) return;

  const confirmed = confirm("Are you sure you want to clear all history?");
  if (!confirmed) return;

  historyList = [];
  renderHistory();
  updateCounters();
  updateChart();
}

function downloadCSV() {
  if (historyList.length === 0) {
    alert("No history available to download.");
    return;
  }

  const headers = [
    "Device",
    "Condition",
    "Repairable",
    "Reusable",
    "Recovery",
    "Action",
    "Hazard",
    "Recommended Route"
  ];

  const rows = historyList.map(item => [
    formatDevice(item.deviceType),
    formatCondition(item.condition),
    capitalizeYesNo(item.repairable),
    capitalizeYesNo(item.reusable),
    capitalizeYesNo(item.recovery),
    item.action,
    item.hazard,
    item.route
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "ewaste_classification_history.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function formatDevice(value) {
  const map = {
    mobile: "Mobile Phone",
    laptop: "Laptop",
    charger: "Charger",
    battery: "Battery",
    printer: "Printer",
    cable: "Cable"
  };
  return map[value] || value;
}

function formatCondition(value) {
  const map = {
    working: "Working",
    not_working: "Not Working",
    old: "Old but Working"
  };
  return map[value] || value;
}

function capitalizeYesNo(value) {
  return value === "yes" ? "Yes" : "No";
}