# Changelog

## v0.2.2 - 2026-01-06 (Current)

- **Infra:** Added `npm` ecosystem (package.json) and developer tooling.
- **Test:** Added Automated Testing suite with **Jest**.
- **Infra:** Added code quality checks with **ESLint** & **Prettier**.
- **CI:** Added GitHub Actions workflow to run tests on every push.
- **Refactor:** Updated `app.js` to support modular exports for testing.
- **Chore:** Removed legacy `tests.js` file.

## v0.2.1

- **Refactor:** Moved `ME_ID` configuration inside `data.js` object.
- **Refactor:** Extracted visual configuration (brick size, spacing) to `app.js`.
- **Fix:** Added `.gitignore` to keep repository clean.
- **Fix:** Added window resize listener to re-center the graph automatically.
- **Docs:** Split README into PRD, Roadmap, and Changelog.

## v0.2.0

- **Design:** Visual refresh with dark mode and pill-shaped nodes.
- **Feature:** Removed 1-D text path; focused entirely on 2-D visual path.

## v0.1.0

- **Feature:** Added initial 2-D visual diagram (SVG).

## v0.0.0

- **Launch:** Initial release with 1-D text path only.
