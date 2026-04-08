# Mini Jigsaw — Card Puzzle Game

A mobile-first casual puzzle game built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — runs directly in any modern browser.

## Play Online

Open `index.html` in a browser, or visit the deployed GitHub Pages URL.

## Features

- **Jigsaw Puzzle Gameplay** — drag-and-drop puzzle pieces into matching slots
- **Card Collection** — collect themed card albums (Paris, Fantasy, Space, and more)
- **Battle Pass** — earn stars and claim tiered rewards
- **Weekly Leaderboard** — compete for weekly rankings
- **Wheel of Fortune** — spin for bonus rewards
- **Kart Rush** — racing mini-event
- **Lost Temple** — excavation dig event with hammers
- **Moon Observatory** — shape-matching puzzle event with energy and progression
- **Piggy Bank** — accumulate gems from gameplay
- **Star Chests** — spend duplicate-card stars on chest rewards
- **Energy System** — piece placement costs energy with a refill popup

## Project Structure

```
Card_Puzzle/
├── index.html          # Main HTML — all screens, modals, navigation
├── styles.css          # All CSS — responsive mobile-first layout
├── game.js             # All game logic — managers, UI, state, events
├── assets/
│   ├── cards/          # Card collection images (9 per album theme)
│   └── ui/             # UI assets (kart rush, pack art)
└── README.md
```

## Running Locally

No build step required. Just open the file:

1. Clone the repository
2. Open `index.html` in a browser

Or use any local server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8000` in your browser.

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch, **/ (root)** folder
5. Click **Save**
6. Your game will be live at `https://<username>.github.io/<repo-name>/`

## Cheats & Debug Tools

All cheat functionality is built into the game UI and always accessible:

| Cheat | Location | What it does |
|-------|----------|-------------|
| **Skip Level** | Game screen — top button | Instantly completes the current puzzle level |
| **AUTO** | Game screen — next to Skip | Places one puzzle piece automatically |
| **Open All Albums** | Settings → scroll down | Unlocks all card collection albums and cards |
| **Add 10,000 Stars** | Settings → scroll down | Grants 10,000 album stars for Star Chests |
| **Add 10,000 Hammers** | Settings → scroll down | Grants 10,000 event hammers for Lost Temple |
| **Reset Progress** | Settings → scroll down | Resets all game data to defaults |

The **Skip Level** button also supports long-press to reveal the AUTO button if hidden.

## Browser Compatibility

- Chrome / Edge (desktop & mobile) ✓
- Safari (iOS & macOS) ✓
- Firefox (desktop & mobile) ✓
- Samsung Internet ✓

Requires a modern browser with ES6+ support, CSS custom properties, and pointer events.

## Data Storage

All game progress is saved to `localStorage`. Clearing browser data will reset progress. No server or account system is required.

## License

Private project.
