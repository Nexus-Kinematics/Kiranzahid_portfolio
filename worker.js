/**
 * Private publisher for Kiran Zahid's GitHub Pages portfolio.
 * Deploy as a Cloudflare Worker. Store GITHUB_TOKEN, ADMIN_PASSWORD,
 * and SESSION_SECRET as Worker secrets; never place them in the website.
 */
const OWNER = 'Nexus-Kinematics';
const REPO = 'Kiranzahid_portfolio';
const BRANCH = 'main';
const TOKEN_TTL_SECONDS = 8 * 60 * 60;

function b64url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function fromB64url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}
async function hmac(secret, value) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}
async function issueSession(secret) {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ exp: Math.floor(Date.now()/1000) + TOKEN_TTL_SECONDS, aud: 'kiran-portfolio-admin' })));
  const sig = b64url(await hmac(secret, payload));
  return payload + '.' + sig;
}
async function verifySession(token, secret) {
  if (!token || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');
  const expected = b64url(await hmac(secret, payload));
  if (signature.length !== expected.length) return false;
  let diff = 0; for (let i=0;i<signature.length;i++) diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff) return false;
  try { const data = JSON.parse(new TextDecoder().decode(fromB64url(payload))); return data.aud === 'kiran-portfolio-admin' && data.exp > Math.floor(Date.now()/1000); }
  catch (_) { return false; }
}
function cors(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGIN || 'https://nexus-kinematics.github.io';
  if (origin !== allowed) return {};
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS, GET', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '86400', 'Vary': 'Origin' };
}
function response(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
}
async function githubRequest(path, env, options = {}) {
  return fetch('https://api.github.com' + path, { ...options, headers: { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + env.GITHUB_TOKEN, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Kiran-Portfolio-Publisher', ...(options.headers || {}) } });
}
export default {
  async fetch(request, env) {
    const headers = cors(request, env);
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || 'https://nexus-kinematics.github.io';
    if (request.method === 'OPTIONS') return new Response(null, { status: origin === allowed ? 204 : 403, headers });
    if (origin && origin !== allowed) return response({ error: 'Origin not allowed.' }, 403, headers);
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') return response({ ok: true, service: 'Kiran portfolio publisher' }, 200, headers);
    if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405, headers);
    if (url.pathname === '/auth') {
      let body; try { body = await request.json(); } catch (_) { return response({ error: 'Invalid request.' }, 400, headers); }
      if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET || !env.GITHUB_TOKEN) return response({ error: 'Publisher is not fully configured.' }, 503, headers);
      if (typeof body.password !== 'string' || body.password.length < 16 || body.password !== env.ADMIN_PASSWORD) return response({ error: 'Incorrect admin password.' }, 401, headers);
      return response({ token: await issueSession(env.SESSION_SECRET), expiresIn: TOKEN_TTL_SECONDS }, 200, headers);
    }
    if (url.pathname === '/publish') {
      const bearer = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
      if (!(await verifySession(bearer, env.SESSION_SECRET || ''))) return response({ error: 'Session expired or unauthorized. Sign in again.' }, 401, headers);
      let body; try { body = await request.json(); } catch (_) { return response({ error: 'Invalid JSON request.' }, 400, headers); }
      const content = body && body.content;
      if (!content || typeof content !== 'object' || !content.profile || !content.site || !Array.isArray(content.projects)) return response({ error: 'Portfolio content is incomplete.' }, 400, headers);
      delete content.certificateDrafts;
      const json = JSON.stringify(content, null, 2);
      if (new TextEncoder().encode(json).length > 5 * 1024 * 1024) return response({ error: 'Content exceeds the 5 MB publishing limit. Use smaller images or hosted media links.' }, 413, headers);
      const apiPath = `/repos/${OWNER}/${REPO}/contents/content.json`;
      const current = await githubRequest(apiPath + '?ref=' + encodeURIComponent(BRANCH), env);
      if (!current.ok) return response({ error: 'GitHub could not read content.json (HTTP ' + current.status + '). Check the server-side repository token.' }, 502, headers);
      const currentData = await current.json();
      const bytes = new TextEncoder().encode(json);
      const encoded = b64url(bytes).replace(/-/g, '+').replace(/_/g, '/');
      const contentBase64 = encoded + '='.repeat((4 - encoded.length % 4) % 4);
      const update = await githubRequest(apiPath, env, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Update portfolio content from private admin editor', content: contentBase64, sha: currentData.sha, branch: BRANCH }) });
      const result = await update.json().catch(() => ({}));
      if (!update.ok) return response({ error: result.message || ('GitHub publish failed (HTTP ' + update.status + ').') }, 502, headers);
      return response({ ok: true, message: 'Published to GitHub successfully. GitHub Pages will update after deployment finishes.' }, 200, headers);
    }
    return response({ error: 'Not found.' }, 404, headers);
  }
};
