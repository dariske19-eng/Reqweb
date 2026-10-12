// Halaman awam "Request completed" dengan Open Graph tags supaya WhatsApp
// menunjukkan pratonton pautan (kad + tajuk), seperti pautan YouTube.
const { verify, cardUrl, baseUrl } = require('../lib/card');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = (req, res) => {
  const n = String((req.query && req.query.n) || '').trim();
  const t = String((req.query && req.query.t) || '').trim();
  if (!n || n.length > 40 || t.length > 60) return res.status(400).send('Invalid link');
  if (!verify('done|' + n + '|' + t, req.query.s)) return res.status(403).send('Invalid link');

  const base = baseUrl() || ('https://' + (req.headers['x-forwarded-host'] || req.headers.host));
  const ogImage = cardUrl(n, 'og', base);
  const full = cardUrl(n, '', base);
  const title = 'Request completed!';
  const desc = (t ? t + ' • ' : '') + 'Requested by ' + n;
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} - ${esc(n)}</title>
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="675">
<meta name="twitter:card" content="summary_large_image">
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#04140b;color:#f2fff6;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;padding:20px;box-sizing:border-box}
main{max-width:760px;width:100%;text-align:center}
img{width:100%;height:auto;border-radius:14px;box-shadow:0 0 40px rgba(78,229,126,.35)}
h1{margin:24px 0 6px;font-size:1.8rem;color:#4ee57e}
p{margin:4px 0;color:#9ec7ad}
a{color:#4ee57e}
</style></head><body><main>
<img src="${esc(full)}" alt="Request of ${esc(n)}">
<h1>${esc(title)}</h1>
<p>${esc(t)}</p>
<p>Requested by ${esc(n)}</p>
<p><a href="${esc(base)}/">Request your own addon</a></p>
</main></body></html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(html);
};
