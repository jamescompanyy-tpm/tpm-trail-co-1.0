// netlify/functions/get-posts.js
// Reads all Markdown posts from the _posts folder in your GitHub repo
// and returns them as JSON for the website to display.
//
// Environment variables needed in Netlify dashboard:
//   GITHUB_TOKEN  — a GitHub personal access token (read-only)
//   GITHUB_OWNER  — your GitHub username
//   GITHUB_REPO   — your repository name (e.g. tpm-trail-co)

const https = require("https");

// ── simple markdown → HTML converter ────────────────────────────────────────
function markdownToHtml(md) {
  if (!md) return "";
  return md
    // headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm,  "<h2>$1</h2>")
    .replace(/^# (.+)$/gm,   "<h1>$1</h1>")
    // bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // blockquote
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // unordered list items
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    // wrap consecutive <li> in <ul>
    .replace(/(<li>[\s\S]+?<\/li>)(\n(?!<li>)|$)/g, "<ul>$1</ul>")
    // horizontal rule
    .replace(/^---$/gm, "<hr>")
    // paragraphs — wrap lines that aren't already HTML tags
    .split(/\n{2,}/)
    .map(block => {
      block = block.trim();
      if (!block) return "";
      if (/^<(h[1-6]|ul|ol|blockquote|hr)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");
}

// ── parse frontmatter from markdown file ─────────────────────────────────────
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]+?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const frontmatter = match[1];
  const content = match[2] || "";
  const data = {};

  frontmatter.split("\n").forEach(line => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key   = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = value;
  });

  return { data, content };
}

// ── HTTPS helper ─────────────────────────────────────────────────────────────
function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, res => {
      let body = "";
      res.on("data", chunk => (body += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { resolve(body); }
      });
    });
    req.on("error", reject);
  });
}

// ── main handler ─────────────────────────────────────────────────────────────
exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // allow CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO  = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Missing environment variables: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO"
      })
    };
  }

  const apiHeaders = {
    "Authorization": `token ${GITHUB_TOKEN}`,
    "User-Agent":    "TPM-Trail-Co-Site",
    "Accept":        "application/vnd.github.v3+json",
  };

  try {
    // 1. Get list of files in _posts folder
    const listUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/_posts`;
    const files = await httpsGet(listUrl, apiHeaders);

    if (!Array.isArray(files)) {
      // _posts folder doesn't exist yet — return empty array gracefully
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    // 2. Fetch each markdown file
    const markdownFiles = files.filter(f => f.name.endsWith(".md"));

    const posts = await Promise.all(
      markdownFiles.map(async (file, index) => {
        const raw = await httpsGet(file.download_url, apiHeaders);
        const content = typeof raw === "string" ? raw : JSON.stringify(raw);
        const { data, content: body } = parseFrontmatter(content);

        return {
          id:        index + 1000, // offset to avoid clashing with hardcoded posts
          featured:  data.featured === "true",
          title:     data.title     || "Untitled",
          category:  data.category  || "Trail Stories",
          date:      data.date      || "",
          readTime:  data.readTime  || "5 min read",
          author:    data.author    || "James Rivera",
          excerpt:   data.excerpt   || "",
          tags:      data.tags      ? data.tags.split(",").map(t => t.trim()) : [],
          gradient:  data.gradient  || "linear-gradient(135deg, #1c3a28 0%, #2d5a3d 40%, #4a7c59 100%)",
          body:      markdownToHtml(body),
          slug:      file.name.replace(".md", ""),
          source:    "cms", // marks this as a CMS post
        };
      })
    );

    // Sort by date descending (newest first)
    posts.sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      return db - da;
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(posts),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
