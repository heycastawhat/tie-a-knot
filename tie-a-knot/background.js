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

function logBlock(url) {
  const entry = {
    url: url,
    timestamp: new Date().toISOString()
  };

  chrome.storage.local.get({ blockLog: [] }, (data) => {
    const log = data.blockLog;
    log.unshift(entry);
    // Keep last 500 entries
    if (log.length > 500) log.length = 500;
    chrome.storage.local.set({ blockLog: log });
  });

  // Update total count
  chrome.storage.local.get({ totalBlocked: 0 }, (data) => {
    chrome.storage.local.set({ totalBlocked: data.totalBlocked + 1 });
  });
}

// Listen for redirect events from declarativeNetRequest
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener((info) => {
  if (info.request && info.request.url) {
    logBlock(info.request.url);
  }
});

// Fallback: listen for navigation to redirect.html (works without debug permission)
chrome.webNavigation?.onCompleted?.addListener((details) => {
  if (details.url && details.url.includes(chrome.runtime.getURL("redirect.html"))) {
    // The blocked URL won't be directly available here, but we log it from the redirect page
  }
});

// Listen for messages from redirect page to log blocks
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LOG_BLOCK") {
    logBlock(message.url);
    sendResponse({ success: true });
  }
  if (message.type === "GET_LOG") {
    chrome.storage.local.get({ blockLog: [], totalBlocked: 0 }, (data) => {
      sendResponse({ log: data.blockLog, total: data.totalBlocked });
    });
    return true; // keep channel open for async response
  }
  if (message.type === "CLEAR_LOG") {
    chrome.storage.local.set({ blockLog: [], totalBlocked: 0 }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("[Back to Basics] Extension installed. " + BLOCKED_DOMAINS.length + " domains blocked.");
});
