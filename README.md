# Kiran Zahid Portfolio

A responsive static portfolio for GitHub Pages, with a browser-based content editor.

## Files

- `index.html` — portfolio layout.
- `styles.css` — responsive styling.
- `script.js` — loads `content.json` and renders the portfolio.
- `content.json` — all editable portfolio text, links, project/skill/experience/education/certificate entries, and optional embedded media.
- `admin/index.html` — content editor with add/remove/edit fields, image/PDF/small-video uploads, JSON import/export.
- `Kiran-Zahid-CV.pdf` — current resume file.
- `assets/images/favicon.svg` — favicon.

## Edit and publish content

1. Open the live admin page at `https://nexus-kinematics.github.io/Kiranzahid_portfolio/admin/`.
2. Sign in with the demo credentials in the admin page. These are client-side demonstration credentials only and are **not secure authentication**.
3. Edit any section using the left navigation. Edit existing values, use **Add item** for projects/skills/experience/education/certificates/links, and **Add field** for custom fields.
4. Add an image by uploading a small image or pasting a URL. Certificate images can be added to an education entry or a separate certificate entry. Upload small PDFs or videos only when needed; for large videos, paste a hosted URL.
5. Click **Export content.json for GitHub**. This downloads the complete current content file.
6. In the existing GitHub repository, upload the downloaded `content.json` to the repository root and commit the change. It should replace the old `content.json` at that same path. Wait for GitHub Pages to deploy and refresh the site.
7. If you also changed the actual CV PDF file, upload the new `Kiran-Zahid-CV.pdf` to the repository root as a separate file. Set `profile.cv` to the correct file path or URL if you rename it.

## Important technical limits

GitHub Pages is static hosting. The admin editor cannot directly write to the repository or publish changes by itself; exporting and uploading `content.json` is the publishing step. Drafts saved in localStorage exist only in the current browser. Uploaded media is embedded as a data URL inside `content.json`, so keep images small (ideally under 1 MB), PDFs small, and videos under 8 MB. For larger files, upload them as separate repository assets or use a hosted media URL and paste that URL in the editor. A separate file's path must be a relative path such as `assets/images/project.png` or a full public URL.

Because the admin password is hardcoded in client-side JavaScript, anyone can inspect it. Do not use this for private information or treat it as a secure account. A real secure editor requires a backend or a properly configured CMS/authentication provider.

## Local preview

Because the portfolio fetches `content.json`, use a local web server instead of opening `index.html` directly as a `file://` URL. In Cursor, use a local server extension or run `python -m http.server` from this folder, then open the displayed localhost URL.

## Content accuracy

Review course names, completion status, work dates, and availability before publishing. Project illustrations should be replaced with genuine screenshots or photos when available; don't claim results or credentials that you cannot verify.
