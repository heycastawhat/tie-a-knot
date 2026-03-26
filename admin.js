function formatTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "invalid time";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function createLogEntry(entry) {
  const row = document.createElement("div");
  row.className = "log-entry";

  const time = document.createElement("span");
  time.className = "time";
  time.textContent = formatTime(entry.timestamp);

  const url = document.createElement("span");
  url.className = "url";
  url.textContent = ` ${entry.url || "unknown"}`;

  row.append(time, url);
  return row;
}

function renderLog(log, total) {
  document.getElementById("total-count").textContent = total;
  document.getElementById("log-count").textContent = log.length;

  const listEl = document.getElementById("log-list");
  listEl.textContent = "";

  if (log.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No blocks recorded yet. Scouts are behaving... for now.";
    listEl.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  log.forEach((entry) => fragment.appendChild(createLogEntry(entry)));
  listEl.appendChild(fragment);
}

function loadLog() {
  chrome.runtime.sendMessage({ type: "GET_LOG" }, (response) => {
    if (!response) return;
    if (response.error) {
      console.warn("[Tie a Knot] Could not load block log:", response.error);
      renderLog([], 0);
      return;
    }
    renderLog(response.log, response.total);
  });
}

document.getElementById("btn-refresh").addEventListener("click", loadLog);

document.getElementById("btn-clear").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "CLEAR_LOG" }, (response) => {
    if (response?.error) {
      console.warn("[Tie a Knot] Could not clear block log:", response.error);
      return;
    }
    loadLog();
  });
});

// Load on open
loadLog();
