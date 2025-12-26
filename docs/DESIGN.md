# Design Document: Putt Drill App

## 1. Architecture Overview

The Putt Drill App is a lightweight, client-side Single Page Application (SPA).
A primary goal of the modernization was to move from a monolithic single-file
approach to a standard modular structure.

### 1.1 File Separation Rationale

- **Maintainability:** Splitting logic (`app.js`), styling (`style.css`), and
  structure (`index.html`) makes the codebase easier to navigate and debug.
- **Separation of Concerns:** Business logic for the JYLY drill is isolated
  from the presentational layer.

### 1.2 Tech Stack Choices

- **Vanilla JS (ES6+):** jQuery was removed to reduce dependency weight and
  leverage modern browser APIs (like `querySelector` and `localStorage`).
- **Bootstrap 5.3:** Upgraded from v3 to utilize modern flexbox/grid utilities
  and because it no longer requires jQuery.
- **Client-Side Persistence:** `localStorage` was chosen for simplicity and
  offline-first capability, as users often practice in areas with poor
  connectivity.

## 2. UI/UX & Design Decisions

### 2.1 Phone Emulation on Desktop

A unique design choice was to constrain the app width to 500px on desktop
screens.

- **Reasoning:** Since the app is primarily a mobile utility, maintaining a
  consistent aspect ratio ensures that the grid of large buttons remains
  ergonomic. It prevents the UI from becoming "stretched" on wide monitors,
  keeping the user's focus centered.
- **Mobile Fidelity:** On devices < 500px, the app automatically switches to
  `100%` width to utilize all available screen real estate.

### 2.2 Header & Navigation Evolution

- **Two-Line Header:** The "Throw from" text was split into two lines (Label vs
  Value). This prevents horizontal wrapping issues on narrow screens and
  increases the legibility of the distance—the most critical info during play.
- **Routing Logic:** The app implements a simple state-based router. It detects
  active games on load; if a game is in progress, it skips the Menu and resumes
  immediately to minimize friction.

### 2.3 Results Screen Hierarchy

The Results screen was iterated to prioritize information based on user value:

1. **Final Score:** Large, prominent display at the top.
2. **Series Breakdown:** Displayed in two rows of 10. This layout was chosen
   over a single long string to ensure all 20 rounds are visible at a glance
   without horizontal scrolling or awkward wrapping.
3. **Leaderboard:** Placed below the series to provide competitive context
   without distracting from the current session's results.

## 3. Leaderboard & Statistics

### 3.1 Contextual Leaderboard Logic

Instead of showing the entire history, the post-game leaderboard uses a
"3-us-3" slice logic:

- **Rank #1** is always shown to provide a benchmark for excellence.
- **User Rank** is centered with up to 3 scores above and 3 below.
- **Ellipses (...)** are used to indicate gaps in the ranking.
- **Rationale:** This provides meaningful context (how close am I to my
  neighbors?) without overwhelming the user with a long list on a small screen.

### 3.2 Data Storage

- **`puttdrill_current_game`:** A volatile state object updated on every putt.
- **`puttdrill_history`:** A persistent archive. Each entry includes the full
  `series` array, allowing the "All Games" view to display the exact breakdown
  of past performances.

## 4. Outdoor Optimization

- **High Contrast:** Uses Bootstrap's standard semantic colors (`btn-danger`,
  `btn-success`) which provide clear visual cues even in bright sunlight.
- **No Rounded Corners:** The `.hitbtn` class overrides Bootstrap's
  `border-radius` to create a seamless, solid grid that is easier to tap
  rapidly.
