# StudyFlow - Project Sitemap

This repository is a static website (HTML + CSS + JS, no build step).

## Structure
```
StudyFlow/
├── index.html                 # Landing (links to pages/*)
├── pages/
│   ├── home.html              # Home dashboard (stats, recent sets)
│   ├── create.html            # Create/import study sets
│   ├── study.html             # Study modes (flashcards, quiz, matching)
│   ├── search.html            # Discover/search/edit/delete sets
│   └── profile.html           # Stats and achievements
├── scripts/
│   ├── storage.js             # localStorage access, normalization, stats helpers
│   ├── main.js                # bootstrapping, recent sets, nav highlighting, toasts (SFUI)
│   ├── import_from_txt.js     # .txt import flow and success feedback
│   ├── flashcards.js          # flashcard mode + mode switching
│   ├── quiz.js                # quiz mode logic
│   ├── matching.js            # matching type quiz
│   ├── discover.js            # search page edit/delete modal logic
│   └── achievements.js        # achievements catalog + unlock helpers
├── styles/
│   ├── globals.css            # tokens, utilities, components, mobile bottom nav, toasts
│   ├── create.css             # create page additions
│   ├── flashcards.css         # flashcard component styles
│   ├── quiz.css               # quiz styles
│   ├── matching.css           # matching quiz styles
│   ├── memory.css             # memory mode (if used)
│   └── modal.css              # shared modal layout
└── assets/
    └── sf_logo.png            # logo (also used as favicon)
```

## Page → Script/Style Map
- `index.html`: `styles/globals.css`, `styles/home.css`, `scripts/storage.js`, `scripts/achievements.js`, `scripts/main.js`
- `pages/home.html`: `styles/globals.css`, `styles/home.css`, `scripts/storage.js`, `scripts/achievements.js`, `scripts/main.js`
- `pages/create.html`: `styles/globals.css`, `styles/create.css`, `scripts/storage.js`, `scripts/achievements.js`, `scripts/import_from_txt.js`, `scripts/main.js`
- `pages/study.html`: `styles/globals.css`, `styles/flashcards.css`, `styles/quiz.css`, `styles/matching.css`, `scripts/storage.js`, `scripts/achievements.js`, `scripts/main.js`, `scripts/flashcards.js`, `scripts/quiz.js`, `scripts/matching.js`
- `pages/search.html`: `styles/globals.css`, `styles/modal.css`, `scripts/storage.js`, `scripts/main.js`, `scripts/discover.js`
- `pages/profile.html`: `styles/globals.css`, `styles/profile.css`, `scripts/storage.js`, `scripts/achievements.js`, `scripts/main.js`

## Data
- All data lives in localStorage keys: `sf_sets`, `studyflow_sets` (mirror), `sf_stats`, `sf_achievements`.
- No server; data is per device/browser.

## UI & Accessibility
- Global utilities for layout/spacing/typography in `globals.css`.
- Toasts via `SFUI.showSuccessMessage` (role="alert", aria-live="polite").
- Focus-visible outlines enabled; keyboard controls for flashcards.
- Responsive with a bottom mobile navigation bar.

## Notes
- No inline styles; styles are externalized in CSS.
- Favicon set to `assets/sf_logo.png` on all pages.

