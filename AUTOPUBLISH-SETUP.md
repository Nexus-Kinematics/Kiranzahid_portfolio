# One-time secure publishing setup (required for Admin → Publish changes)

GitHub Pages is static hosting. A browser-only page cannot safely write to a GitHub repository without exposing a write credential. This package therefore includes a small Cloudflare Worker publisher. The GitHub token stays in the Worker as a server-side secret; it is never placed in the portfolio source or typed into the Admin Panel.

After this one-time setup, normal editing is: open `/admin/` → sign in with your Admin password → edit → **Publish changes**. You do not paste a GitHub token on every save.

## 1. Create a restricted GitHub token (one time)

1. In GitHub, open **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. Create a token restricted to only `Nexus-Kinematics/Kiranzahid_portfolio`.
3. Grant **Contents: Read and write** permission. Set an expiry and keep the token private.
4. Do not put this token in `admin/index.html`, `content.json`, chat, screenshots, or any committed file.

## 2. Deploy the included Worker

1. Create/sign in to a Cloudflare account and open **Workers & Pages**.
2. Create a Worker named e.g. `kiran-portfolio-publisher`.
3. Replace its starter code with the complete contents of `worker.js` from this repository and deploy.
4. In the Worker settings, add these **Secrets** (not plain public variables):
   - `GITHUB_TOKEN` — the fine-grained GitHub token from step 1.
   - `ADMIN_PASSWORD` — create a strong password of at least 16 characters.
   - `SESSION_SECRET` — create a separate random secret (at least 32 random characters).
5. Add this plain-text variable:
   - `ALLOWED_ORIGIN` = `https://nexus-kinematics.github.io`
6. Save/deploy the Worker again. Its URL will look like `https://kiran-portfolio-publisher.<your-subdomain>.workers.dev`.
7. Open `https://kiran-portfolio-publisher.<your-subdomain>.workers.dev/health`. It should return `{"ok":true,...}`.

## 3. Use the Admin Panel

1. Open `https://nexus-kinematics.github.io/Kiranzahid_portfolio/admin/`.
2. Enter the Worker URL and the Admin password you configured.
3. Sign in. The Worker URL is remembered in that browser; the password is not saved. A short-lived session is held in the current browser session.
4. Edit content and click **Publish changes**. The Worker commits `content.json` to the repository. Wait for the GitHub Pages deployment to finish.

## Security and limitations

- No GitHub token is entered into the browser. The server-side Worker holds it as a secret.
- The Admin password is checked by the Worker; this replaces the old hard-coded demo username/password.
- Admin-only certificate drafts are stored in that browser's local storage and are excluded from public `content.json`. They are not synchronized to other devices. To make a certificate public, add it under **Published certificates** and publish.
- Uploaded images/PDFs added through the generic editor are embedded into `content.json`; keep them small. This publisher updates `content.json` only, not arbitrary repository files.
- GitHub Pages deployment is asynchronous; a successful commit is not the same as the public page already being updated.
- If you do not deploy/configure the Worker and its secrets, the Admin editor cannot publish. That is a platform security requirement, not a portfolio bug.
