# Project: Putt Drill App

## Overview

This is a simple, single-page web application designed to track a disc golf
putting drill, specifically the "JYLY" drill. It helps users track their
successful putts from varying distances over the course of 20 rounds.

## Tech Stack

- **Core:** HTML5, JavaScript (ES5), CSS3.
- **Libraries (via CDN):**
  - jQuery 3.0.0
  - Bootstrap 3.3.6 (CSS & JS)

## Architecture

The project consists of a single file:

- `drill.html`: Contains the markup, styles (embedded CSS), and application
  logic (embedded JavaScript).

## Setup & Running

Since this is a static HTML file with no build process:

1. **Download/Clone** the repository.
2. **Open** `drill.html` directly in any modern web browser.
   - *Note:* An internet connection is required initially to load the Bootstrap
     and jQuery resources from CDNs.

## Game Logic (`recount` function)

The core logic resides in the `recount(btn)` JavaScript function:

1. **Input:** User clicks a button corresponding to the number of successful
   putts (0-5) for the current round.
2. **Scoring:** `Points = Current Distance * Successful Putts`.
3. **Next Distance:** `New Distance = 5 meters + Successful Putts`.
   - *Example:* 5 hits -> 10m next. 0 hits -> 5m next.
4. **Progression:**
   - Increments round counter.
   - Appends result to the "Series" string.
5. **Game Over:**
   - After 20 rounds, the input buttons are hidden (`.hide-on-complete`).
   - Final score and series summary are displayed (`.show-on-complete`).

## Development Conventions

- **Styles:** Currently using embedded `<style>` blocks and Bootstrap utility
  classes.
- **Scripts:** JavaScript is embedded directly in the `<script>` tag within
  `drill.html`.
- **External Resources:** Relies on specific versions of jQuery and Bootstrap
  hosted on CDNs.
