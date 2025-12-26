# Putt Drill App

A simple, offline-capable web application for tracking your disc golf putting
practice (JYLY drill).

## Features

- **Track Progress:** Input your successful putts from various distances.
- **Automatic Scoring:** Calculates points and adjusts distance automatically.
- **Leaderboards:** Tracks your **Top 100** best scores and keeps a **Full
  History** of every game played.
- **Auto-Save:** Your current game state is saved, so you can close the
  browser and resume later.
- **Mobile Friendly:** Large buttons and high-contrast interface designed for
  outdoor use.
- **Desktop Mode:** Emulates a phone screen layout when viewed on larger
  displays.

## How to Use

1. **Start:** Open `index.html` in your web browser.
2. **Play:** You start at 10 meters. Putt 5 discs.
3. **Input:** Tap the number of successful putts (0-5).
4. **Repeat:** The app will adjust your distance and track your score for 20
   rounds.
5. **Finish:** See your final score and series history.

## Development

- **Tech Stack:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.
- **Structure:**
  - `index.html`: Main entry point.
  - `js/app.js`: Game logic and storage.
  - `css/style.css`: Custom styling.

### Commands

You can use `make` to manage the project:

- `make run`: Starts a local development server at `http://localhost:8000`.
