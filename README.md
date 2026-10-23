# Kiran Zahid portfolio

Personal portfolio of Kiran Zahid, AI & Robotics Developer.

- Live site: https://nexus-kinematics.github.io/Kiranzahid_portfolio/
- Repository: https://github.com/Nexus-Kinematics/Kiranzahid_portfolio

This is a plain static website: HTML, CSS, and a small amount of JavaScript. There is no framework, no build step, no tracking, and no third-party requests. Fonts are hosted in this repository.

## Project structure

```
index.html              Main page (About, Skills, Projects, Experience, Education, Contact)
style.css               Design system and all styles (light and dark mode)
script.js               Mobile menu, active-section highlight, footer year, personal dashboard
cv.html                 Printable CV page (source for the PDF)
Kiran-Zahid-CV.pdf      Downloadable CV linked from the site
404.html                "Page not found" page used by GitHub Pages
favicon.svg             Site icon
apple-touch-icon.png    Icon for iOS home screens
og-image.png            Preview image for links shared on social media (1200x630)
assets/                 Profile photo and workflow screenshots (optimized)
fonts/                  Self-hosted fonts with their licenses
```

All file references are relative (for example `assets/kiran-profile.jpg`), so the site works under the `/Kiranzahid_portfolio/` subpath that GitHub Pages uses, and also works when opened locally.

## Run it locally

Option 1: open `index.html` in a browser.

Option 2: serve it, which behaves most like GitHub Pages:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Edit the content

### Personal dashboard (Edit portfolio button)

The **Edit portfolio** button in the navigation opens a login panel. Use the same username and password as before. After logging in you can:
- **Edit existing information:** about text, every project (title, category, description, status label, note, tags, bullet list), every experience entry (role, organization, dates, description), and every education and course entry (qualification, institution, status). Tags and bullet lists take one item per line.
- **Attach pictures, videos, or PDFs to existing items** (any project, education entry, course, or experience entry), with an optional caption. PDFs open in a new tab. Each file must be under 1.8 MB; allowed types are JPG, PNG, WebP, GIF, MP4, WebM, and PDF.
- Change the profile photo, set the portfolio URL, and fill in CV details.
- Add brand-new items (education, certificate, project, other) with an optional picture, video, or document.

Important limits:
- Edits are saved in **this browser only** (browser storage). They do not change the website for other visitors and do not update the files in the repository. A different browser or device shows the original content.
- The login is a convenience lock. The password is not stored in the code, only a one-way hash of it, but a determined person could still guess a weak password. Do not rely on it to protect anything private.
- To change what **everyone** sees, edit the files and commit the change to GitHub (below).
- "Reset saved edits" clears edits, attachments on existing items, CV details, the profile photo, and the portfolio URL stored in your browser. Brand-new items you added are removed one by one with their Remove buttons.
- Browser storage holds only a few megabytes in total, so keep attachments small. For videos and larger files, upload them to the repository and link to them instead.
- The CV page (`cv.html`) shows the CV details saved in the dashboard. Open it and use **Print or save as PDF** to make a personalized PDF.

### Edit the files (changes everyone sees)

Edit the files directly (on GitHub, use the pencil icon on a file, then **Commit changes**).

| To change | Edit |
| --- | --- |
| Name, headline, intro, about text | `index.html`, the `hero` and `#about` sections |
| Skills | `index.html`, the `#skills` section |
| A project | `index.html`, the `#projects` section |
| Experience or education | `index.html`, `#experience` and `#education` |
| Email or profile links | `index.html`, the hero and `#contact` sections (and `cv.html`) |
| Colors and fonts | `style.css`, the `:root` block under "Design tokens" |

### Add or replace a screenshot

1. Save the image as WebP (or JPG) and put it in `assets/`. A width of 1920 px is enough.
2. Create a 1200 px wide copy for small screens (for example `name-1200.webp`).
3. Copy an existing workflow `<article class="project">` block in `index.html` and update the text, `src`, `srcset`, `width`, `height`, and `alt` text.

Always write alt text that describes what the screenshot shows.

### Update the CV

1. Edit `cv.html`.
2. Open it in Chrome or Edge, choose **Print or save as PDF**, set the destination to **Save as PDF**, paper size **A4**, margins **Default**, and turn off **Headers and footers**.
3. Save the result as `Kiran-Zahid-CV.pdf`, replacing the old file.

The CV intentionally leaves out a phone number and street-level location, because this repository is public. Add them to `cv.html` only if you want them public.

## Publish with GitHub Pages

The site is published from the `main` branch.

1. Replace the files in the repository with the files from this folder (see the update steps in the handover notes you received with this ZIP).
2. In the repository, open **Settings > Pages** and confirm **Source** is **Deploy from a branch**, with branch **main** and folder **/ (root)**.
3. Wait about a minute, then open https://nexus-kinematics.github.io/Kiranzahid_portfolio/ and refresh with Ctrl+F5 (Cmd+Shift+R on Mac) to bypass the cache.

## Security and privacy notes

- The dashboard login is checked against a hash, so the password no longer appears in the source. The old version had the password in plain text, and it remains in the repository's Git history. If you reuse that password anywhere else, change it there.
- The site collects no visitor data and sends nothing to any server. Browser storage is used only for the dashboard, and only after you save something. There is no contact form.
- Added items and text are inserted as plain text, never as HTML, and links must start with https:// or http://.
- External links use `rel="noopener noreferrer"`.

## Fonts and licenses

- Bricolage Grotesque and Source Serif 4, both under the SIL Open Font License 1.1 (see `fonts/`), obtained from the Fontsource packages.
- Profile photo, workflow screenshots, and written content belong to Kiran Zahid.
