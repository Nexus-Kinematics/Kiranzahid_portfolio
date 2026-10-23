# Kiran Zahid portfolio: handover

Deliverables in this folder:

| File | What it is |
| --- | --- |
| `Kiranzahid_portfolio_revised.zip` | The complete revised project (one folder, `Kiranzahid_portfolio/`) |
| `Kiranzahid_portfolio_ORIGINAL_backup.zip` | Your original ZIP, untouched |
| `HANDOVER.md` | This document |

The README inside the revised ZIP explains the project structure, local use, editing, and publishing.

**Nothing has been deployed.** I had no write access to your GitHub repository, so the live site at https://nexus-kinematics.github.io/Kiranzahid_portfolio/ still shows the old version until you upload these files (steps in section 6).

---

## 0. Update: admin panel restored

The "Edit portfolio" panel is back, in the new design, and **your original username and password work** (I did not change them). What changed underneath:
- The password is no longer stored as readable text in `script.js`; only a one-way hash is. This is still only a convenience lock.
- The panel's edits are saved **in your browser only**, exactly as before. They never change the site for other visitors, and they do not change files in GitHub. To change what everyone sees, edit the files in the repository.
- Previously saved edits in your browser carry over where the fields still exist.
- Everything you add is shown as plain text, links must be https:// or http://, and nothing is sent anywhere.
- Your phone number is **not** pre-filled any more. Type it into the CV details if you want it on your personal CV page.

Tested (25 checks): wrong password rejected; original credentials log in; text, email, photo, CV details and added items save and survive a reload; invalid email and `javascript:` links are refused; pasted HTML is displayed as text, not run; Esc closes the panel and it asks for login again; Reset restores the original content; works on mobile; a fresh visitor sees the original content.

### Update 2: editing existing items and attaching files

In the panel you can now edit the existing projects, education, courses, and experience (57 fields, including titles, descriptions, status labels, notes, dates, tags, and bullet lists) and attach pictures, videos, or PDFs to any of 13 existing items, with optional captions. Tested: all edits update the page immediately and survive a reload; PDFs open in a new tab; unsafe or oversized files (.exe, SVG, over 1.8 MB) are refused; Reset restores the original content; no accessibility violations in light or dark mode on desktop, tablet, or mobile. Not testable in my environment: how the PDF looks inside a real browser's PDF viewer (I verified the file it opens is a valid `application/pdf`).

Limits to know: everything here is saved **in your browser only**, with roughly 5 MB of storage in total, so a handful of small files at most. Visitors will not see your edits or attachments. For files everyone should see, add them to the repository's `assets/` folder and reference them in `index.html` (README explains how).

## 1. Finding: the old login was public (now partly addressed)

The old `script.js` contained the dashboard username and password in plain text. I confirmed that the copy in your public GitHub repository is byte-identical to the one in your ZIP, so **those credentials are readable by anyone right now**. The login also protected nothing real: it only gated a browser-side editor, and anyone could bypass it with the browser console.

What I did: replaced the plain-text credentials with a hash (see section 0). The plain-text version is still readable in your repository's Git history and in the live site until you upload this version.

What only you can do:
- If you use that password (or a similar one) on any other account, change it there.
- The old file remains in the repository's Git history after you upload the new version. For a convenience lock on a portfolio this is low risk, so I do not recommend a history rewrite, but do not reuse that password anywhere.

Also removed from the public source: your phone number (it was pre-filled in the dashboard form) and the exact town in the CV defaults.

---

## 2. Major design and content improvements

**Design**
- New design system: one accent color, two self-hosted typefaces (Bricolage Grotesque for headings, Source Serif 4 for text), consistent spacing, one border style, light and dark modes that follow the visitor's device setting.
- Replaced the dark purple template look (gradient text, blurred glows, all-caps monospace labels, numbered section markers, decorative placeholder art) with a calmer, more credible layout.
- Hero with a clear headline, one-sentence introduction, two actions, and an arch-framed portrait. Motion is limited to one gentle load-in and is switched off for visitors who prefer reduced motion.
- Projects redesigned: the two automation projects show the screenshot, a plain-language description, tools used, and a numbered "How it works" list that matches the actual flow in your workflow screenshots. The three other projects are compact cards with honest status labels.
- Skills presented as grouped lists with no invented proficiency bars or percentages.

**Content** (all derived from your original text, your screenshots, and your brief)
- Rewrote the intro, about text, and project descriptions for clarity and consistent terminology.
- Removed editor-facing placeholder text that visitors could see ("can be edited in the dashboard", "as listed in CV", "Case study coming soon").
- AQSA POS System Testing now describes the type of work (executing test cases, comparing expected and actual results, reporting issues, documenting outcomes). It makes no claim about number of test cases, pass rates, fixed defects, or grades, and says the write-up is not yet published.
- CKD Screening AI now states it is a demonstration project, not a medical or diagnostic tool.

---

## 3. Significant bugs and problems fixed

| # | Problem in the original | Fix |
| --- | --- | --- |
| 1 | Hardcoded dashboard username and password in public JavaScript | Password stored as a hash only; dashboard kept |
| 2 | Phone number embedded in public HTML | Removed; CV omits it |
| 3 | "Download CV" depended on a third-party CDN script (jsPDF, loaded without integrity checking) and failed offline or if the CDN was blocked | Replaced with a static, pre-built `Kiran-Zahid-CV.pdf`; no third-party script |
| 4 | Google Fonts loaded from Google's servers (visitor IP sent to a third party) | Fonts self-hosted in `fonts/` |
| 5 | README described an `assets/` folder and a setup that did not match the files | New README matches the real structure; images are now actually in `assets/` |
| 6 | Dashboard markup and styling were tied to the old design | Rebuilt as an accessible dialog in the new design |
| 7 | Added items were inserted into the page as HTML, with one value unescaped | Items are now built as plain text with strict link and file-type checks |
| 8 | Screenshots were 1.5 MB of PNG | Converted to WebP with responsive sizes (about 90 KB each at full size); profile photo cropped and resized |
| 9 | No canonical URL, no Open Graph or social preview, no favicon, no 404 page | Added all of these, using your real Pages URL |
| 10 | Navigation used glyph-only toggle (☰), no `aria-controls`, no Escape to close, no skip link, small touch targets | Text toggle with proper ARIA, Escape closes it, skip link added, all tap targets at least 44 px |
| 11 | Mobile layout: scaled-down desktop hero art, overlapping elements at narrow widths | Rebuilt with real breakpoints; verified down to 320 px |
| 12 | Duplicate or misleading controls (a "Download CV" button handled in JavaScript, an "Add to your portfolio" panel) | Replaced with ordinary links that always work |
| 13 | Unused italic font file | Removed |

---

## 4. QA report

All checks below were run on the **final** files, served from a local web server under a `/Kiranzahid_portfolio/` subpath to imitate GitHub Pages, using headless Chromium 141 (Playwright), `axe-core`, and `html-validate`.

| Check | Result |
| --- | --- |
| Main HTML and every referenced asset exist; no broken local links or anchors | Pass |
| No root-absolute paths (nothing assumes hosting at the domain root) | Pass |
| Extracted revised ZIP served under the subpath: all requests return 200 | Pass |
| Only same-origin requests (no third-party requests of any kind) | Pass |
| `node --check` on `script.js` | Pass |
| `html-validate` on `index.html`, `cv.html`, `404.html` | Pass (0 errors) |
| Duplicate IDs | None |
| Browser console errors or warnings (desktop, tablet, mobile) | None |
| Horizontal overflow at 320, 375, 768, 820, 901, 1024, 1440 px | None |
| Mobile menu: opens, `aria-expanded` updates, Escape closes, link click closes | Pass |
| Every nav link lands on its section below the sticky header; active-link highlight follows scroll | Pass (Contact sits lower in the viewport because the page ends first, and it is still highlighted) |
| Hero "View projects", nav "Contact", footer "Back to top" buttons | Pass |
| "Download CV (PDF)" triggers a download of `Kiran-Zahid-CV.pdf` | Pass |
| "Open full-size screenshot" links load the images | Pass |
| All images decode (none broken) | Pass |
| Keyboard: first Tab reaches the skip link; skip link works; focus outlines visible | Pass |
| axe-core WCAG 2.0/2.1/2.2 A and AA plus best-practice rules on `index.html`: light and dark, desktop, tablet, and mobile (menu open) | 0 violations in all 6 runs; includes colour-contrast |
| axe-core on `cv.html` and `404.html` | 0 violations |
| Heading outline | One `h1`, sensible `h2` to `h4` nesting |
| Touch targets on mobile (including open menu) | All at least 44 px tall |
| Dark mode and reduced-motion preferences respected | Pass |
| Opened directly from disk (`file://`) | Works; fonts load. Only the font *preload hint* is blocked by the browser's file rules, which is harmless and does not occur on GitHub Pages |
| Old plain-text password and phone number absent from every file and from the CV PDF | Pass |
| Page weight | 8 requests, about 254 KB in total including lazy images (was about 1.7 MB of assets plus third-party scripts and fonts) |
| Visual review of screenshots at desktop, tablet, mobile, dark mode, CV PDF, social preview image | Done; issues found during review were fixed and re-tested |

**Limitations (things I could not or did not test)**
- Only Chromium was tested. Firefox and Safari were not available. The CSS used is widely supported, but I have not seen it render there.
- No physical phones or tablets; "mobile" and "tablet" are emulated viewports.
- No manual screen-reader testing (NVDA, VoiceOver). axe catches many issues but not all.
- No Lighthouse run. Page weight and request counts were measured directly instead.
- Colour contrast was checked by axe in the default states; hover states were not individually measured.
- I could not reach the live site, LinkedIn, Fiverr, or Upwork from my environment, so those links are preserved exactly as you had them but **not verified as working**. I could confirm that your GitHub repository and profile exist and are public.
- Social preview cards (Open Graph) cannot show up on platforms until the site is deployed; I verified the tags and image file only.

---

## 5. Items that need your input or access

**Please confirm (I kept your wording, but these are small judgment calls):**
1. **Job titles.** Your original site said "Internship" and "Teaching experience", and your CV defaults said "Teacher". I wrote "Intern" and "Teacher". Correct them if needed.
2. **Science Valley dates.** Your source said "October 2025 – 2026 (1 year)". The end date is ambiguous. I show "October 2025 to 2026". Please give a real end month, or "Present" if it continues.
3. **AQSA IT Solutions internship.** No dates or duties were provided, so the entry is short. Add dates and what you actually did.
4. **"n8n" and "OpenAI" tags** on the two workflow projects come from the visible interface and nodes in your screenshots and from your CV skills. Please confirm.
5. **"AI Elements, Riphah University"** is kept as written, but it looks like it might be a typo or duplicate of "Elements of AI". Please check the exact course name.
6. **Sample data in the lead-qualification screenshot** shows a lead named "Ali Raza" at "Ali's small shop". I assumed it is demo data. If it is a real person, replace the screenshot.
7. **Phone number and exact location** were deliberately left off the public site and CV. Add them to `cv.html` if you want them public.
8. **The CV** was composed from the details in your portfolio source and CV defaults, because your original CV file was not in the ZIP. Please read it once before sharing.

**To strengthen the AQSA POS project** (only add what is true and approved for sharing): a sanitized test summary or screenshot, the number of test cases you executed, and what you found. Do not include confidential business data or personal data of the business's customers. If a mentor or instructor gave feedback, add it only with their agreement and a verifiable source.

**Needs your access:** uploading to GitHub, confirming GitHub Pages settings, and verifying the live site and your external profile links.

**Optional:** submit the site to Google Search Console so it is indexed. A `robots.txt` or `sitemap.xml` was not added because those files only take effect at a domain root, not on a project subpath.

---

## 6. Updating the GitHub repository and publishing

The repository's default branch is `main`, and its current files are `index.html`, `style.css`, `script.js`, `README.txt`, `kiran-profile.jpg`, `lead-qualification-workflow.png`, and `customer-support-email-agent.png`.

### Option A: GitHub website (no tools needed)

1. Unzip `Kiranzahid_portfolio_revised.zip` on your computer. Open the inner `Kiranzahid_portfolio` folder.
2. Open https://github.com/Nexus-Kinematics/Kiranzahid_portfolio and sign in.
3. **Delete the files that no longer exist in the new version** (the website cannot do this during upload). For each of `README.txt`, `kiran-profile.jpg`, `lead-qualification-workflow.png`, and `customer-support-email-agent.png`: open the file, click the three-dot menu, choose **Delete file**, and commit. Do not delete `index.html`, `style.css`, or `script.js`; uploading replaces them.
4. Click **Add file > Upload files**. Drag in everything *inside* the `Kiranzahid_portfolio` folder (not the folder itself), including the `assets` and `fonts` folders.
5. Write a commit message such as "Redesign portfolio and remove client-side login", select **Commit directly to the main branch**, and click **Commit changes**.

### Option B: Git on the command line

```bash
git clone https://github.com/Nexus-Kinematics/Kiranzahid_portfolio.git
cd Kiranzahid_portfolio
git rm README.txt kiran-profile.jpg lead-qualification-workflow.png customer-support-email-agent.png
cp -R /path/to/unzipped/Kiranzahid_portfolio/. .
git add -A
git commit -m "Redesign portfolio and remove client-side login"
git push origin main
```

### Then publish and check

1. In the repository open **Settings > Pages**. Confirm **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)**. Keep your existing setting if it already looks like this.
2. Wait about a minute and open https://nexus-kinematics.github.io/Kiranzahid_portfolio/. Hard-refresh (Ctrl+F5, or Cmd+Shift+R on Mac).
3. Check: the page has the new design; the photo and both screenshots load; the "Download CV (PDF)" link downloads; the mobile menu works on your phone; and your LinkedIn, GitHub, Fiverr, and Upwork links open correctly.
4. Optional: paste your URL into a link-preview tool (for example the LinkedIn Post Inspector) to check the social preview image.

If something looks wrong, the original ZIP is your backup, and you can revert in GitHub from the repository's **Commits** list.
