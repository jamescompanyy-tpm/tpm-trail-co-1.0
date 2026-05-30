  // cursor
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const cur  = document.getElementById('cursor');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a,button,input,select,textarea,.service-card').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('cursor-expand'));
    el.addEventListener('mouseleave', () => cur.classList.remove('cursor-expand'));
  });

  // nav scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  revealEls.forEach(el => obs.observe(el));

  // toast
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
  }

  // booking form
  document.getElementById('bookingForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    try {
      const res = await fetch('https://formspree.io/f/maqvnqqd', {
        method: 'POST',
        body: data,
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
    }
  });

  // contact form
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    showToast('✉️ Message sent! We\'ll get back to you shortly.');
    e.target.reset();
  });

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOBILE NAV DRAWER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function toggleDrawer() {
  const btn = document.getElementById('navHamburger');
  const drawer = document.getElementById('navDrawer');
  const open = btn.classList.toggle('open');
  drawer.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
  drawer.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeDrawer() {
  const btn = document.getElementById('navHamburger');
  const drawer = document.getElementById('navDrawer');
  btn.classList.remove('open');
  drawer.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PAGE SWITCHER â€” single-file SPA router
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function showPage(page) {
  const blog = document.getElementById('blogPage');
  const navJournal = document.getElementById('navJournal');
  const mainSections = ['hero','mission','services','booking','about','testimonials','contact'];
  const mainEls = mainSections.map(id => document.getElementById(id)).filter(Boolean);
  const mainFooter = document.querySelector('footer');

  if (page === 'blog') {
    mainEls.forEach(el => el.style.display = 'none');
    if (mainFooter) mainFooter.style.display = 'none';
    if (blog) blog.style.display = 'block';
    if (navJournal) navJournal.style.color = 'var(--gold)';
    window.scrollTo(0, 0);
    if (blog && !blog.dataset.initialized) {
      blog.dataset.initialized = 'true';
      // Show loading state
      const fc = document.getElementById('featuredContainer');
      const pg = document.getElementById('postsGrid');
      if (fc) fc.innerHTML = '<p style="font-family:var(--ff-m);font-size:.8rem;color:var(--sage);padding:2rem 0;letter-spacing:.1em">Loading posts...</p>';
      if (pg) pg.innerHTML = '';
      // Load CMS posts then render
      loadCMSPosts().then(() => {
        renderGrid(ALL_POSTS);
        renderRecent();
        const filterCount = document.getElementById('filterCount');
        if (filterCount) filterCount.textContent = ALL_POSTS.length + ' posts';
      });
    }
  } else {
    mainEls.forEach(el => el.style.display = '');
    if (mainFooter) mainFooter.style.display = '';
    if (blog) blog.style.display = 'none';
    if (navJournal) navJournal.style.color = '';
    window.scrollTo(0, 0);
  }
}

// nav logo click always goes home
const navLogoEl = document.querySelector('.nav-logo');
if (navLogoEl) {
  navLogoEl.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('main');
  });
}

