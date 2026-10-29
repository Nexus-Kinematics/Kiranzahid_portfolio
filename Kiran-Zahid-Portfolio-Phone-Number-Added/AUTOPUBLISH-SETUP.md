# Direct GitHub publishing setup (no Cloudflare Worker)

The admin panel can publish `content.json` directly using GitHub's Contents API. No Cloudflare Worker is required.

## One-time setup

1. In GitHub, open Settings → Developer settings → Personal access tokens → Fine-grained tokens.
2. Create a token restricted to the `Nexus-Kinematics/Kiranzahid_portfolio` repository. Grant **Contents: Read and write** permission. Set an expiry.
3. Open the deployed `/admin/` page, sign in, make an edit, and click **Save & Publish**. Paste the token when prompted. The token is held in this browser tab's `sessionStorage`, not written into the repository or website source.
4. GitHub receives a commit to `content.json`; GitHub Pages then deploys the update.

## Security and limits

- This avoids a separate backend, but the browser must hold a write-capable GitHub token during the session. Use a narrowly scoped, expiring token; never paste it into source code, screenshots, chat, or commit history. Clear the browser session/log out when finished.
- Anyone who can access the admin panel and its publishing session may be able to publish content. The existing front-end login is only a demo gate, not secure server-side authentication.
- The default branch is configured as `main` in `admin/index.html`. Change `GH_BRANCH` if the repository uses another default branch.
- Images/PDFs embedded in `content.json` increase its size. Prefer hosted URLs for large media.
- Save & Publish commits to GitHub. The public website updates after GitHub Pages finishes deploying; it may take a few minutes.
