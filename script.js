const suggestBtn = document.getElementById("suggestBtn");
const resetBtn = document.getElementById("resetBtn");
const resultBadge = document.getElementById("resultBadge");
const reasonText = document.getElementById("reason");

suggestBtn.addEventListener("click", suggestAction);
resetBtn.addEventListener("click", resetForm);

function suggestAction() {
  const deviceType = document.getElementById("deviceType").value;
  const condition = document.getElementById("condition").value;
  const repairable = document.getElementById("repairable").value;
  const reusable = document.getElementById("reusable").value;
  const recovery = document.getElementById("recovery").value;

  let action = "";
  let reason = "";
  let badgeClass = "neutral";

  if ((condition === "working" || condition === "old") && reusable === "yes") {
    action = "Reuse / Refurbish";
    reason =
      "The device is still usable, so extending its life is the most sustainable option.";
    badgeClass = "reuse";
  } else if (repairable === "yes") {
    action = "Repair";
    reason =
      "The device is not fully usable now, but it can be repaired and brought back into use.";
    badgeClass = "repair";
  } else if (recovery === "yes") {
    if (deviceType === "battery") {
      action = "Recycle";
      reason =
        "The item may contain hazardous material, so formal recycling is the safest action.";
      badgeClass = "recycle";
    } else {
      action = "Recover";
      reason =
        "The device is not reusable, but useful materials can still be recovered from it.";
      badgeClass = "recover";
    }
  } else {
    action = "Recycle";
    reason = "The safest remaining option is formal recycling.";
    badgeClass = "recycle";
  }

  resultBadge.textContent = action;
  resultBadge.className = `result-badge ${badgeClass}`;
  reasonText.textContent = reason;
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
}