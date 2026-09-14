// netlify/functions/get-posts.js
// Reads all Markdown posts from the _posts folder in your GitHub repo
// and returns them as JSON for the website to display.
//
// Environment variables (set in Netlify dashboard):
//   GITHUB_TOKEN  — a GitHub personal access token (read-only, repo scope)
//   GITHUB_OWNER  — your GitHub username
//   GITHUB_REPO   — your repository name (e.g. tpm-trail-co)

const https = require('https');

// ── markdown → HTML ──
function markdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // images before links — image syntax contains link syntax
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)(\n(?!<li>)|$)/g, '<ul>$1</ul>')
    .replace(/^---$/gm, '<hr>')
    .split(/\n{2,}/)
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (/^<(h[1-6]|ul|ol|blockquote|hr)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');
}

// ── parse YAML frontmatter ──
// Handles the subset of YAML a CMS actually emits: quoted scalars (so values
// may contain ":" or "#"), block sequences, inline arrays, and folded/literal
// block scalars. Values stay strings — no type coercion — except sequences,
// which come back as arrays.
function unquote(value) {
  const v = value.trim();
  if (v.length > 1 && ((v[0] === '"' && v.endsWith('"')) || (v[0] === "'" && v.endsWith("'")))) {
    const q = v[0];
    const inner = v.slice(1, -1);
    return q === '"'
      ? inner.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
      : inner.replace(/''/g, "'");
  }
  return v;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const lines = match[1].split(/\r?\n/);
  const data  = {};
  let key = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;

    // "- item" belonging to the key above it
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && key) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(unquote(item[1]));
      continue;
    }

    const idx = line.indexOf(':');
    if (idx === -1) continue;
    key = line.slice(0, idx).trim();
    const rest = line.slice(idx + 1).trim();

    // folded (>) or literal (|) block scalar — consume the indented lines below
    if (/^[>|][-+]?$/.test(rest)) {
      const folded = rest[0] === '>';
      const buf = [];
      while (i + 1 < lines.length && (!lines[i + 1].trim() || /^\s{2,}\S/.test(lines[i + 1]))) {
        buf.push(lines[++i].trim());
      }
      data[key] = (folded ? buf.join(' ') : buf.join('\n')).trim();
      continue;
    }

    if (rest.startsWith('[') && rest.endsWith(']')) {
      data[key] = rest.slice(1, -1).split(',').map(unquote).filter(Boolean);
    } else {
      data[key] = unquote(rest);   // "" here may become an array via "- " lines
    }
  }

  return { data, content: match[2] || '' };
}

// ── HTTPS helper ──
function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, res => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { resolve(body); }
      });
    });
    req.on('error', reject);
  });
}

// ── handler ──
exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO  = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing env vars: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO' })
    };
  }

  const apiHeaders = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'User-Agent':    'TPM-Trail-Co-Site',
    'Accept':        'application/vnd.github.v3+json',
  };

  try {
    const listUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/_posts`;
    const files   = await httpsGet(listUrl, apiHeaders);

    if (!Array.isArray(files)) {
      return { statusCode: 200, headers, body: JSON.stringify([]) };
    }

    const markdownFiles = files.filter(f => f.name.endsWith('.md'));

    const posts = await Promise.all(
      markdownFiles.map(async (file, index) => {
        const raw     = await httpsGet(file.download_url, apiHeaders);
        const content = typeof raw === 'string' ? raw : JSON.stringify(raw);
        const { data, content: body } = parseFrontmatter(content);
        return {
          id:       index + 1000,
          featured: data.featured === true || data.featured === 'true',
          title:    data.title    || 'Untitled',
          category: data.category || 'Trail Stories',
          date:     data.date     || '',
          readTime: data.readTime || '5 min read',
          author:   data.author   || 'James Rivera',
          excerpt:  data.excerpt  || '',
          tags:     Array.isArray(data.tags)
                      ? data.tags
                      : (data.tags ? String(data.tags).split(',').map(t => t.trim()).filter(Boolean) : []),
          gradient: data.gradient || 'linear-gradient(135deg, #1c3a28 0%, #2d5a3d 40%, #4a7c59 100%)',
          body:     markdownToHtml(body),
          slug:     file.name.replace('.md', ''),
          source:   'cms',
        };
      })
    );

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { statusCode: 200, headers, body: JSON.stringify(posts) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
