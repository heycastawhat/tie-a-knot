function formatTime(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function renderLog(log, total) {
  document.getElementById("total-count").textContent = total;
  document.getElementById("log-count").textContent = log.length;

  const listEl = document.getElementById("log-list");

  if (log.length === 0) {
    listEl.innerHTML = '<div class="empty">No blocks recorded yet. Scouts are behaving... for now.</div>';
    return;
  }

  listEl.innerHTML = log.map((entry) =>
    `<div class="log-entry">
      <span class="time">${formatTime(entry.timestamp)}</span>
      <span class="url"> ${entry.url}</span>
    </div>`
  ).join("");
}

function loadLog() {
  chrome.runtime.sendMessage({ type: "GET_LOG" }, (response) => {
    if (response) {
      renderLog(response.log, response.total);
    }
  });
}

document.getElementById("btn-refresh").addEventListener("click", loadLog);

document.getElementById("btn-clear").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "CLEAR_LOG" }, () => {
    loadLog();
  });
});

// Load on open
loadLog();
