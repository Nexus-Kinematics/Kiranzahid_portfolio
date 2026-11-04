# Kiran Zahid Portfolio — Restored Design + Save/Export Editor

This package preserves the original portfolio's navy/teal theme, local fonts, profile photograph, project screenshots, CV and adds an expanded content editor.

## Files
- `index.html`, `style.css`, `script.js`: public portfolio and content renderer
- `content.json`: editable portfolio data loaded by the public website
- `admin/index.html`: content editor
- `assets/`: profile and project screenshots
- `fonts/`: locally hosted fonts and licenses
- `Kiran-Zahid-CV.pdf`, `cv.html`: CV files

## Admin editor and Direct GitHub publishing is available in `/admin/`. On first Save & Publish in a browser session, provide a fine-grained GitHub token scoped to this repository with Contents: Read and write permission. See `AUTOPUBLISH-SETUP.md`.

## Deploy to existing GitHub Pages repository
Upload the *contents* of this folder to the repository root, preserving the `assets/`, `fonts/`, and `admin/` directories. Commit the updated `index.html`, `style.css`, `script.js`, `content.json`, `admin/index.html`, and all included assets. Do not upload the ZIP file itself.

## Test locally
Open through a local static server (not `file://`) so `fetch('content.json')` works. For example in Cursor terminal: `python -m http.server 8000`, then visit `http://localhost:8000`.


## AQSA POS testing evidence
- `assets/AQSA-POS-Testing-Evidence.pdf`: two-page portfolio evidence PDF (original sign-off page plus test execution chart).
- The AQSA POS project card in `index.html` links to view and download this PDF.
