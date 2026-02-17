# Family Atlas

A premium, zero-backend family relationship app for quickly answering:

> **"How is this person related to me?"**

Built as a heartfelt gift project for a newborn son and future family storytelling.

## Current Status

The app now includes:

- Modern 2026-style UI polish (glassmorphism, gradients, theme toggle)
- Kinship resolver (human-friendly labels like aunt/uncle, grandparent)
- Extensible data model with metadata on people + relationships
- Jest + ESLint + CI checks

## Quick Start

1. Clone repo
2. Install deps: `npm ci`
3. Run tests: `npm test`
4. Open `index.html` in browser (or publish to GitHub Pages)

## Data Editing

Edit `data.js`:

- `ME_ID` = you
- `people[]` = person profiles (`display_name`, `nickname`, `notes`, `tags`, etc.)
- `relationships[]` = edges (`type`, `subtype`, `since`, `confidence`, etc.)

## Docs

- [Product Requirements](prd.md)
- [Roadmap](roadmap.md)
- [Changelog](changelog.md)

## License

MIT
