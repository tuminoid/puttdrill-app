# Project: Putt Drill App

## Overview

This is a modern, single-page web application designed to track the "JYLY" disc
golf putting drill. It features persistent state management, high score tracking,
and a mobile-first design.

## Tech Stack

- **Core:** HTML5, JavaScript (ES6+), CSS3.
- **Frameworks:**
  - Bootstrap 5.3 (via CDN) for UI components and grid.
- **Storage:** `localStorage` for game state and history.

## Architecture

The project is structured as follows:

- `index.html`: The main entry point containing the markup (Menu, Game, Results)
  and layout.
- `css/style.css`: Custom styles, including the phone-emulation wrapper for
  desktop.
- `js/app.js`: Contains the `PuttDrill` class which handles:
  - **Routing:** Manages visibility of Menu, Game, and Results views.
  - **Game Logic:** Scoring, distance calculation (JYLY drill).
  - **State Management:** Interacting with `localStorage`.

## Game Logic

1. **Input:** User clicks a button (0-5) representing successful putts.
2. **Scoring:** `Points = Current Distance * Successful Putts`.
3. **Distance Adjustment:** `New Distance = 5 meters + Successful Putts`.
4. **Progression:** The game lasts for 20 rounds.
5. **Persistence:**
   - **Current Game (`puttdrill_current_game`):** Saved on every input to allow
     resuming.
   - **History (`puttdrill_history`):** Array of completed game objects (date,
     score, series) used for Top 100 and Full History lists.

## Setup & Running

1. **Clone/Download** the repository.
2. **Run** the application:
   - **Option A (Make):** Run `make run` and open `http://localhost:8000`.
   - **Option B (Direct):** Open `index.html` directly in a web browser.
   - *Requirement:* Internet connection needed for Bootstrap CDN.
