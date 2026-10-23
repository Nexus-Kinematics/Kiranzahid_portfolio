# Kiran Zahid Portfolio — Restored Design + Save/Export Editor

This package preserves the original portfolio's navy/teal theme, local fonts, profile photograph, project screenshots, CV and adds an expanded content editor.

## Files
- `index.html`, `style.css`, `script.js`: public portfolio and content renderer
- `content.json`: editable portfolio data loaded by the public website
- `admin/index.html`: content editor
- `assets/`: profile and project screenshots
- `fonts/`: locally hosted fonts and licenses
- `Kiran-Zahid-CV.pdf`, `cv.html`: CV files

## Admin editor
Open `/admin/` on the published website. Demo credentials: `kiranadmin` / `KZ-Portfolio!2026-ChangeMe`. This is a client-side demonstration login, not secure authentication.

The editor lets you edit existing fields, add/remove links, skills, projects, experience, education, certificates and custom fields, and attach images, PDFs and small videos. Use **Save changes** to keep a browser draft. Use **Save & Download for GitHub** to download the updated `content.json` after editing. Upload that downloaded `content.json` to the repository root and commit it to publish changes to the live site. The editor cannot directly publish to GitHub Pages without a separate authenticated publishing integration.

Uploaded images/PDFs/videos are embedded in the JSON data. This is convenient for small assets but can make the JSON large. For large videos, use a public video URL. If browser storage cannot hold a large file, use **Save & Download for GitHub**; it downloads the edited JSON separately from the browser draft.

## Deploy to existing GitHub Pages repository
Upload the *contents* of this folder to the repository root, preserving the `assets/`, `fonts/`, and `admin/` directories. Commit the updated `index.html`, `style.css`, `script.js`, `content.json`, `admin/index.html`, and all included assets. Do not upload the ZIP file itself.

## Test locally
Open through a local static server (not `file://`) so `fetch('content.json')` works. For example in Cursor terminal: `python -m http.server 8000`, then visit `http://localhost:8000`.
