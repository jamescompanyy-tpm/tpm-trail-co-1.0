/* ═══════════════════════════════════════════════════
   TPM TRAIL CO. — main.js
═══════════════════════════════════════════════════ */

// ── custom cursor ──
const cursorEl = document.getElementById('cursor');
const dot      = document.getElementById('cursorDot');
const ring     = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, input, select, textarea, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorEl.classList.add('cursor-expand'));
  el.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor-expand'));
});

// ── nav scroll state ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── scroll reveal ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

// ── smooth scroll helper ──
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
}

// ── booking form ──
document.getElementById('bookingForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    const res = await fetch('https://formspree.io/f/maqvnqqd', {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      showToast('🌲 Booking request sent! James will be in touch within 24 hours.');
      form.reset();
    } else {
      showToast('⚠️ Something went wrong. Please try again or email directly.');
    }
  } catch {
    showToast('⚠️ Could not connect. Please check your internet and try again.');
  } finally {
    btn.textContent = 'Send booking request →';
    btn.disabled = false;
  }
});

// ── contact form ──
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('✉️ Message sent! We\'ll get back to you shortly.');
  e.target.reset();
});

// ── mobile nav drawer ──
function toggleDrawer() {
  const btn    = document.getElementById('navHamburger');
  const drawer = document.getElementById('navDrawer');
  const open   = btn.classList.toggle('open');
  drawer.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
  drawer.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeDrawer() {
  const btn    = document.getElementById('navHamburger');
  const drawer = document.getElementById('navDrawer');
  btn.classList.remove('open');
  drawer.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeDrawer(); closeArticleBtn(); }
});

// ── page switcher ──
const MAIN_SECTIONS = ['hero', 'mission', 'services', 'booking', 'about', 'founding', 'contact'];

function showPage(page) {
  const blogPage   = document.getElementById('blogPage');
  const navJournal = document.getElementById('navJournal');
  const mainEls    = MAIN_SECTIONS.map(id => document.getElementById(id)).filter(Boolean);
  const mainFooter = document.querySelector('footer');

  if (page === 'blog') {
    mainEls.forEach(el => el.style.display = 'none');
    if (mainFooter) mainFooter.style.display = 'none';
    blogPage.style.display = 'block';
    if (navJournal) navJournal.classList.add('active');
    window.scrollTo(0, 0);

    if (!blogPage.dataset.initialized) {
      blogPage.dataset.initialized = 'true';
      const fc = document.getElementById('featuredContainer');
      const pg = document.getElementById('postsGrid');
      if (fc) fc.innerHTML = '<p style="font-family:var(--ff-mono);font-size:.8rem;color:var(--sage);padding:2rem 0;letter-spacing:.1em">Loading posts…</p>';
      if (pg) pg.innerHTML = '';
      loadCMSPosts().then(() => {
        renderGrid(ALL_POSTS);
        renderRecent();
        const fc2 = document.getElementById('filterCount');
        if (fc2) fc2.textContent = ALL_POSTS.length + ' posts';
      });
    }
  } else {
    mainEls.forEach(el => el.style.display = '');
    if (mainFooter) mainFooter.style.display = '';
    blogPage.style.display = 'none';
    if (navJournal) navJournal.classList.remove('active');
    window.scrollTo(0, 0);
  }
}

// ── service prefill ──
function prefillService(value) {
  setTimeout(() => {
    const sel = document.getElementById('b-service');
    if (sel) sel.value = value;
  }, 150);
}
