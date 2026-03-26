const BLOCKED_DOMAINS = [
  "coolmathgames.com", "miniclip.com", "poki.com", "crazygames.com", "friv.com",
  "silvergames.com", "gameflare.com", "kizi.com", "y8.com", "addictinggames.com",
  "agame.com", "kongregate.com", "newgrounds.com", "armorgames.com", "girlsgogames.com",
  "roblox.com", "1v1.lol", "slither.io", "agar.io", "skribbl.io",
  "garticphone.com", "wtfgames.io", "papergames.io",
  "twoplayergames.org", "unblocked-games.com", "unblockedgames77.com",
  "unblockedgames24h.com", "classroom6x.com", "66ez.com", "hoodamath.com",
  "primarygames.com", "funbrain.com", "abcya.com", "mathplayground.com",
  "jacksmith.com", "classroom.google.com", "sites.google.com",
  "epicgames.com", "steampowered.com", "store.steampowered.com",
  "twitch.tv", "tiktok.com",
  "ultrasurf.us", "proxysite.com", "hide.me", "croxyproxy.com", "kproxy.com",
  "plus.google.com"
];

const MAX_LOG_ENTRIES = 500;

function logBlock(url, callback = () => {}) {
  const entry = {
    url: url,
    timestamp: new Date().toISOString()
  };

  chrome.storage.local.get({ blockLog: [], totalBlocked: 0 }, (data) => {
    const log = Array.isArray(data.blockLog) ? data.blockLog : [];
    log.unshift(entry);
    if (log.length > MAX_LOG_ENTRIES) log.length = MAX_LOG_ENTRIES;

    chrome.storage.local.set(
      { blockLog: log, totalBlocked: Number(data.totalBlocked || 0) + 1 },
      () => {
        if (chrome.runtime.lastError) {
          console.warn("[Tie a Knot] Failed to persist block log:", chrome.runtime.lastError.message);
        }
        callback();
      }
    );
  });
}

// Listen for redirect events from declarativeNetRequest
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener((info) => {
  if (info.request && info.request.url) {
    logBlock(info.request.url);
  }
});

// Listen for messages from redirect page to log blocks
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LOG_BLOCK") {
    logBlock(message.url, () => sendResponse({ success: true }));
    return true;
  }
  if (message.type === "GET_LOG") {
    chrome.storage.local.get({ blockLog: [], totalBlocked: 0 }, (data) => {
      if (chrome.runtime.lastError) {
        sendResponse({ log: [], total: 0, error: chrome.runtime.lastError.message });
        return;
      }
      sendResponse({ log: data.blockLog, total: data.totalBlocked });
    });
    return true; // keep channel open for async response
  }
  if (message.type === "CLEAR_LOG") {
    chrome.storage.local.set({ blockLog: [], totalBlocked: 0 }, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      sendResponse({ success: true });
    });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("[Tie a Knot] Extension installed. " + BLOCKED_DOMAINS.length + " seed domains listed.");
});
