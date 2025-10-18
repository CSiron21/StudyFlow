# StudyFlow

A modern, client‑side flashcard website built with plain HTML, CSS, and JavaScript. Create study sets, import from .txt, study with multiple modes, search/edit/delete sets, and track achievements — all persisted via localStorage.

## Quick Start
- Open `index.html` in a browser, or host the repo with GitHub Pages.
- Data is saved per device/browser (localStorage). No backend required.

## Features
- Create sets manually; dynamic card rows
- Import from `.txt` (format: `TERM, DEFINITION` per line)
- Study modes: Flashcards, Quiz (MCQ), Matching
- Discover/search sets; edit and delete
- Achievements and stats tracking
- Toast notifications for successes
- Mobile bottom navigation; responsive layout

## Tech
- HTML pages under `/` and `/pages`
- CSS in `/styles` (globals + page-specific styles)
- JS in `/scripts` (storage, UI, study modes, discover)

## Storage
- Uses `localStorage` keys: `sf_sets`, `studyflow_sets` (mirror), `sf_stats`, `sf_achievements`
- Data doesn’t sync across devices or browsers

## Accessibility
- `role="alert"`, `aria-live`, progressbar `aria-valuenow`, focus-visible outlines
- Keyboard control for flashcards (Space/Enter, Arrow keys)

## Notes
- No inline styles; all styling is in CSS
- Favicon: `assets/sf_logo.png`
- To clear data, use DevTools → Application → Local Storage
