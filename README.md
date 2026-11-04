# Kiran Zahid — Portfolio

A static GitHub Pages portfolio for Kiran Zahid, with a private Admin editor and an optional secure publishing Worker.

## Public website files
- `index.html`, `style.css`, `script.js`: responsive public portfolio
- `content.json`: public portfolio content (never put private certificate drafts here)
- `cv.html`, `Kiran-Zahid-CV.pdf`: web and downloadable CV
- `assets/`: profile image, project workflow screenshots, and AQSA POS testing evidence
- `fonts/`: locally hosted fonts and their licenses
- `admin/`: unlinked private content editor

## Upload to the existing GitHub Pages project
Upload the contents of this package to the repository root, preserving `assets/`, `fonts/`, and `admin/`. Do not upload the ZIP itself. The existing project URL remains:

`https://nexus-kinematics.github.io/Kiranzahid_portfolio/`

## Admin publishing
The editor is at `/admin/` and is not linked from the public navigation. GitHub Pages is static hosting, so secure publishing requires a server-side publisher. This package includes `worker.js` for Cloudflare Workers. Follow `AUTOPUBLISH-SETUP.md` once. After setup, sign in to the editor and use **Publish changes**; no GitHub token is entered into the browser or requested on each save.

Certificate drafts are stored locally in the current browser and are excluded from public `content.json`. To publish a certificate, add it under **Published certificates** after you receive it.

## Local preview
Run a local static server from this folder, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`. The public page loads `content.json` with `fetch`, so opening `index.html` directly as a `file://` URL is not a valid test.

## Important
- Do not commit GitHub or Cloudflare secrets into this repository.
- Do not describe prototypes as completed projects or invent metrics.
- External profile URLs are preserved from the links supplied by the portfolio owner; verify each destination from the account owner before sharing the portfolio widely.
