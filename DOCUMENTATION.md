# StudyFlow - Project Documentation

## Overview
StudyFlow is a client‑side (no backend) flashcard website built with plain HTML, CSS, and JavaScript. Users can create study sets, import from .txt, study in multiple modes, search/edit/delete sets, and track achievements and stats. All data persists in the browser using localStorage.

Key pages: `index.html` (landing), `pages/home.html`, `pages/create.html`, `pages/study.html`, `pages/search.html`, `pages/profile.html`.

## Data Model and Storage
Storage is local to the device/browser (per origin) via localStorage.

Keys
- `sf_sets`: Array<StudySet>
- `studyflow_sets` (mirror for compatibility): Array<StudySet>
- `sf_stats`: Stats
- `sf_achievements`: Array<Achievement>

Types
- StudySet: `{ id, title, subject, description, createdAt, dateCreated, cards: Card[] }`
- Card: `{ term, definition }`
- Stats: `{ totalCardsStudied, setsCreated, studyStreakDays, lastStudyDateISO, totalStudyMinutes }`
- Achievement: `{ id, title, description, unlockedAt? }`

Storage module (`scripts/storage.js`)
- Helpers `getLocalJson`/`setLocalJson` wrap JSON parse/stringify with try/catch.
- `initDefaults()` seeds a demo set, stats, and achievements if missing.
- `getSets()`/`saveSets()` read and normalize sets; mirror key is maintained.
- Stats helpers: `incrementCardsStudied`, `addStudyMinutes`, `incrementSetsCreated`.

Important: Because storage is local, data does not sync across devices/browsers. Clearing site data or using private mode resets progress.

## Features by Page
- Home (`index.html`, `pages/home.html`)
  - Hero section, quick stats (streak, study time, sets), recent sets grid.
  - Current nav highlighting and subtle entrance animations.

- Create (`pages/create.html`)
  - Manual set creation: title, subject, description, dynamic card rows (add/remove).
  - Import from `.txt`: lines as `TERM, DEFINITION`. Empty/invalid lines skipped; subject/title defaults if blank. Success toast: “Imported study set successfully!”.
  - Success toast on manual save: “Created study successfully!”.

- Study (`pages/study.html`)
  - Modes: Flashcards, Quiz (multiple choice), Matching.
  - Flip, next/prev, shuffle, progress bar, keyboard controls (Enter/Space to flip; arrows to navigate).
  - Add custom card to current set; session minutes tracked on unload.

- Discover (`pages/search.html`)
  - Search text + subject filter over `sf_sets`.
  - Edit (modal) and Delete actions. Success toasts on update/delete.

- Profile (`pages/profile.html`)
  - Stats overview and achievements grid; catalog ensured and unlocks checked.

## JavaScript Modules
- `scripts/main.js`
  - Bootstraps defaults, sets footer year, highlights nav, renders recent sets on landing, simple button press feedback.
  - Provides global `window.SFUI.showSuccessMessage(text, { durationMs? })` – accessible toast at bottom‑right (`role="alert"`, `aria-live="polite"`).

- `scripts/storage.js`
  - LocalStorage access, normalization, stats helpers, and export as `window.SFStorage`.

- `scripts/import_from_txt.js`
  - Parses `.txt` file, builds cards, creates a set, updates stats/achievements, shows success toast, and optionally navigates to the set.

- `scripts/flashcards.js`, `scripts/quiz.js`, `scripts/matching.js`
  - Implement study modes and UI updates; switcher handled in `flashcards.js`.

- `scripts/discover.js`
  - Edit modal rendering/handlers; delete flow; uses `SFUI.showSuccessMessage` for feedback.

- `scripts/achievements.js`
  - Achievement catalog, unlock helpers, visual announcement, and checks exposed via `window.SFAchievements`.

## Styling System
- Global design tokens and components in `styles/globals.css` (colors, spacing, utilities, buttons, panels, progress, toasts, mobile bottom nav).
- Page styles: `create.css`, `flashcards.css`, `quiz.css`, `matching.css`, `memory.css`, `modal.css`, `home.css`.
- Utilities include layout (`.d-flex`, `.ai-center`, `.jc-between`, `.grid-hero`), spacing (`.mt-*`, `.mb-*`, `.gap-*`), typography (`.fs-*`, `.fw-800`), forms (`.form-control`), and status helpers.
- Accessible focus rings and sufficient text contrast are enabled by default.

Favicon
- Defined on all pages using `assets/sf_logo.png` via `<link rel="icon" href="..." type="image/png" />`.

## Accessibility
- Semantics and ARIA: regions labeled (nav, main, sections), progress bars expose `aria-valuenow`, live regions for toasts/feedback.
- Keyboard: focus-visible styles, keyboard support for flashcard actions, modal focus management on open.
- Contrast: colors tuned for readability; buttons and inputs have visible hover/focus states.

## Deployment
- Static site; no build step required. Host the repository with GitHub Pages.
- Open `index.html` locally or via Pages URL. Data persists per device/browser.

## Maintenance & Contributing
- Keep all styling in external CSS. Prefer utility classes over inline styles.
- Reuse toasts (`SFUI.showSuccessMessage`) for feedback; do not introduce `alert()` for success.
- When changing set schema, add normalization in `saveSets()` and/or a migration in `initDefaults()`.
- Test flows: create/import/edit/delete sets; run a short study session; verify achievements unlock; inspect DevTools → Application → Local Storage for keys.

## Known Limitations
- No account system or server sync; localStorage only.
- Quota limits vary by browser (~5–10 MB per origin).
- Private browsing/incognito may restrict storage.
