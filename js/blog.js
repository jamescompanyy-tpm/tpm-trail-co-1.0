/* ═══════════════════════════════════════════════════
   TPM TRAIL CO. — blog.js
   Post data · rendering · filtering ·
   article modal · newsletter · CMS fetch
═══════════════════════════════════════════════════ */

// ── post data ──
// Posts now live as Markdown in _posts/ and are edited at /admin.
// netlify/functions/get-posts.js reads them from GitHub at request time.
// This array is a fallback for posts you want hardcoded into the bundle —
// leave it empty unless you have a reason not to. Anything added here appears
// AFTER the CMS posts, and will duplicate if it also exists in _posts/.
const POSTS = [];


// ── state ──
let ALL_POSTS    = [...POSTS];
let currentFilter = 'all';
let cmsLoaded    = false;

// ── helpers ──
function getCatClass(cat) {
  if (cat === 'Trail Stories') return 'cat-stories';
  if (cat === 'Ecology')       return 'cat-ecology';
  if (cat === 'Gear')          return 'cat-gear';
  return 'cat-stories';
}

// ── render featured ──
function renderFeatured(post) {
  const fc = document.getElementById('featuredContainer');
  if (!post) { fc.innerHTML = ''; return; }
  fc.innerHTML = `
    <div class="featured-post reveal" onclick="openArticle(${post.id})">
      <div class="featured-img">
        <div class="featured-img-bg" style="background:${post.gradient}"></div>
      </div>
      <div class="featured-body">
        <span class="post-category ${getCatClass(post.category)}">${post.category}</span>
        <div class="post-title">${post.title}</div>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-meta">
          <span class="post-author">${post.author}</span>
          <span class="post-date">${post.date}</span>
          <span class="post-read-time">${post.readTime}</span>
        </div>
        <span class="read-more">Read full post →</span>
      </div>
    </div>`;
  setTimeout(() => fc.querySelector('.reveal')?.classList.add('visible'), 50);
}

// ── render grid ──
function renderGrid(posts) {
  const grid  = document.getElementById('postsGrid');
  const empty = document.getElementById('emptyState');
  const fc    = document.getElementById('featuredContainer');

  if (posts.length === 0) {
    grid.innerHTML = '';
    fc.innerHTML   = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const featured = currentFilter === 'all' ? posts.find(p => p.featured) : null;
  renderFeatured(featured);

  const rest = featured ? posts.filter(p => p.id !== featured.id) : posts;
  grid.innerHTML = rest.map((p, i) => `
    <div class="post-card reveal" style="transition-delay:${i * 80}ms" onclick="openArticle(${p.id})">
      <div class="card-img">
        <div class="card-img-bg" style="background:${p.gradient}"></div>
      </div>
      <div class="card-body">
        <span class="post-category ${getCatClass(p.category)}">${p.category}</span>
        <div class="post-title">${p.title}</div>
        <p class="post-excerpt">${p.excerpt}</p>
        <div class="card-footer">
          <span class="card-meta">${p.date} · ${p.readTime}</span>
          <span class="card-read">Read →</span>
        </div>
      </div>
    </div>`).join('');

  document.querySelectorAll('#postsGrid .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 60 + i * 60);
  });

  const fc2 = document.getElementById('filterCount');
  if (fc2) fc2.textContent = `${posts.length} post${posts.length !== 1 ? 's' : ''}`;
}

// ── render recent sidebar ──
function renderRecent() {
  const list = document.getElementById('recentList');
  if (!list) return;
  list.innerHTML = ALL_POSTS.slice(0, 4).map(p => `
    <li class="recent-item" onclick="openArticle(${p.id})">
      <div class="recent-thumb"><div class="recent-thumb-bg" style="background:${p.gradient}"></div></div>
      <div class="recent-info">
        <div class="recent-title">${p.title}</div>
        <div class="recent-date">${p.date}</div>
      </div>
    </li>`).join('');
}

// ── filter ──
function filterPosts(cat, btn) {
  currentFilter = cat;
  if (btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const filtered = cat === 'all' ? ALL_POSTS : ALL_POSTS.filter(p => p.category === cat);
  renderGrid(filtered);
}

// ── article modal ──
function openArticle(id) {
  const post = ALL_POSTS.find(p => p.id === id);
  if (!post) return;
  document.getElementById('articleHeroImg').style.background = post.gradient;
  document.getElementById('articleCat').innerHTML = `<span class="post-category ${getCatClass(post.category)}">${post.category}</span>`;
  document.getElementById('articleTitle').textContent = post.title;
  document.getElementById('articleByline').innerHTML = `
    <span>By <strong>${post.author}</strong></span>
    <span>${post.date}</span>
    <span>${post.readTime}</span>`;
  document.getElementById('articleBody').innerHTML = post.body;
  const overlay = document.getElementById('articleOverlay');
  overlay.classList.add('open');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeArticle(e) {
  if (e.target === document.getElementById('articleOverlay')) closeArticleBtn();
}

function closeArticleBtn() {
  const overlay = document.getElementById('articleOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── newsletter ──
async function handleNewsletter(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.newsletter-btn');
  const btnLabel = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    const res = await fetch('https://formspree.io/f/xbdbydpw', {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      showToast('🌲 You\'re on the trail list! First email coming soon.');
      form.reset();
    } else {
      showToast('⚠️ Something went wrong. Please try again.');
    }
  } catch {
    showToast('⚠️ Could not connect. Please check your internet and try again.');
  } finally {
    btn.textContent = btnLabel;
    btn.disabled = false;
  }
}

// ── CMS fetch ──
async function loadCMSPosts() {
  if (cmsLoaded) return;
  try {
    const res = await fetch('/.netlify/functions/get-posts');
    if (!res.ok) throw new Error('Function returned ' + res.status);
    const cmsPosts = await res.json();
    if (Array.isArray(cmsPosts) && cmsPosts.length > 0) {
      ALL_POSTS = [...cmsPosts, ...POSTS];
      if (cmsPosts.some(p => p.featured)) {
        ALL_POSTS = ALL_POSTS.map(p => p.source === 'cms' ? p : { ...p, featured: false });
      }
    }
  } catch (e) {
    console.info('CMS posts not loaded, using sample posts:', e.message);
  }
  cmsLoaded = true;
}
