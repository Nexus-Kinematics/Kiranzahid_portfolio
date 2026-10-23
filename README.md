# Kiran Zahid Portfolio — Original Design + Content Studio

This package restores the original portfolio design, local fonts, real profile photograph, project screenshots, CV and adds a separate content editor. The navy/teal palette and Bricolage Grotesque / Source Serif typography are preserved.

## Files
- `index.html`, `style.css`, `script.js`: public portfolio and renderer
- `content.json`: editable portfolio data loaded by the public website
- `admin/index.html`: content editor
- `assets/`: profile and project screenshots
- `fonts/`: locally hosted fonts and licenses
- `Kiran-Zahid-CV.pdf`, `cv.html`: CV files

## Admin editor
Open `admin/` on the published website. Demo credentials: `kiranadmin` / `KZ-Portfolio!2026-ChangeMe`. This is a client-side demonstration login, not secure authentication. Do not use it for private or sensitive information.

The editor lets you change existing fields, add/remove items in links, skills, projects, experience, education, certificates and custom fields, and attach images, PDFs and small videos. Save Draft stores in the current browser only. To publish: Export `content.json`, then upload/replace `content.json` at the repository root and commit. The website fetches that file to render the latest published content. Media embedded as data URLs can make the JSON large; use relative paths or public URLs for large files/videos.

## Deploy to existing GitHub Pages repository
Upload the *contents* of this folder to the repository root, preserving the `assets/`, `fonts/`, and `admin/` directories. Commit the updated `index.html`, `style.css`, `script.js`, `content.json`, `admin/index.html`, and all included assets. Do not upload the ZIP file itself.

## Test locally
Open through a local static server (not `file://`) so `fetch('content.json')` works. For example in Cursor terminal: `python -m http.server 8000`, then visit `http://localhost:8000`.
