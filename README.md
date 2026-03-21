# Tie a Knot 🪢

A Chrome extension that keeps scouts focused by redirecting distracting websites (games, social media, streaming, proxies, VPNs) to [animatedknots.com](https://www.animatedknots.com) — because you should be tying knots instead.

## What it does

- **Blocks 200+ domains** including game sites, social media, streaming services, proxy/VPN tools, and sneaky "unblocked games" workarounds
- **Redirects** blocked pages to a cheeky interstitial with a random scouting-themed message, then forwards to animatedknots.com after 10 seconds
- **Logs every block** with timestamps, viewable from the extension popup
- **Mahitahi integration** — occasionally nudges scouts on mahitahi.scouts.nz with a friendly "Shouldn't you be tying knots instead?" overlay (1 in 50 chance)
- **Catches creative evasion** — regex rules detect unblocked-game proxies hosted on Vercel, Netlify, GitHub Pages, Cloudflare Workers, ngrok, and more

## Install

1. Clone or download this repo
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** and select this folder

## Project structure

| File | Purpose |
|---|---|
| `manifest.json` | Extension manifest (Manifest V3) |
| `rules.json` | Declarative net request redirect rules (225 rules) |
| `background.js` | Service worker — block logging and message handling |
| `redirect.html/css/js` | Blocked-site interstitial page with countdown |
| `admin.html/js` | Extension popup — block stats and log viewer |
| `mahitahi.js` | Content script for mahitahi.scouts.nz nudge overlay |
| `icons/` | Extension icons (16, 48, 128px) |

## Permissions

- `declarativeNetRequest` / `declarativeNetRequestWithHostAccess` — redirect blocked domains
- `storage` — persist block logs
- `<all_urls>` — apply rules across all sites
