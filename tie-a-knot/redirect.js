const MESSAGES = [
  "Touch grass. Or at least touch some rope.",
  "The bowline knot won't tie itself.",
  "Just tie a knot.",
  "You could be earning a badge right now.",
  "A reef knot a day keeps the game sites away.",
  "This site has been yeeted into the void.",
  "Skill issue. Try knots instead.",
  "Your leader will never know. Your conscience will.",
  "Achievement unlocked: caught trying to play games.",
  "The clove hitch is literally more fun than this.",
  "You came here for games. Tie a knot.",
  "Try animatedknots.com.",
  "Error 403: Fun not permitted. Try rope instead.",
  "Roses are red, your site is blocked, go tie a sheet bend.",
  "You have been intercepted by the Knot Police.",
  "Alt+F4 won't save you. Neither will Ctrl+Z.",
  "Your patrol leader sends their regards.",
  "This knot in your plans is called a stopper knot.",
  "Be prepared... to learn some knots.",
  "Did you really think this would work?",
  "Distraction neutralized. Deploying rope.",
  "404: Games not found. Knots found instead."
];

const REDIRECT_SECONDS = 20;
const REDIRECT_URL = "https://www.animatedknots.com";

function getBlockedUrl() {
  // Try to extract from referrer or document.referrer
  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get("url");
  if (fromParam) return fromParam;

  // Fallback: try referrer
  if (document.referrer) return document.referrer;

  return "unknown (nice try)";
}

function init() {
  // Display blocked URL
  const blockedUrl = getBlockedUrl();
  document.getElementById("blocked-url").textContent = blockedUrl;

  // Pick random message
  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  document.getElementById("cheeky-message").textContent = "> " + msg;

  // Log this block to the background service worker
  try {
    chrome.runtime?.sendMessage({ type: "LOG_BLOCK", url: blockedUrl });
  } catch (e) {
    // Extension context may not be available
  }

  // Countdown
  let remaining = REDIRECT_SECONDS;
  const countdownEl = document.getElementById("countdown");
  const progressEl = document.getElementById("progress-fill");

  // Initial progress
  progressEl.style.width = "0%";

  const interval = setInterval(() => {
    remaining--;
    countdownEl.textContent = remaining;
    progressEl.style.width = ((REDIRECT_SECONDS - remaining) / REDIRECT_SECONDS * 100) + "%";

    if (remaining <= 0) {
      clearInterval(interval);
      window.location.href = REDIRECT_URL;
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", init);
