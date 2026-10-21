/* ═══════════════════════════════════════════════════
   TPM TRAIL CO. — trips.js
   Loads data/trips-2027.json, renders trip cards,
   filters by type, and wires the request form.
   Trip data is authored in Decap at /admin.
═══════════════════════════════════════════════════ */

const TRIPS_ENDPOINT = 'https://formspree.io/f/maqvnqqd';

let ALL_TRIPS   = [];
let tripFilter  = 'all';

// ── load ──
async function loadTrips() {
  try {
    const res = await fetch('data/trips-2027.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Trip data returned ' + res.status);
    const data = await res.json();
    ALL_TRIPS = Array.isArray(data.trips) ? data.trips : [];
  } catch (e) {
    console.info('Trip data not loaded:', e.message);
    ALL_TRIPS = [];
  }
  renderTrips();
  renderTripChoices();
  syncFormMode();
}

// ── helpers ──
// Anything the CMS left blank shows as TBA rather than an empty row.
function val(v) {
  if (Array.isArray(v)) v = v.filter(Boolean).join(' · ');
  const s = (v === null || v === undefined) ? '' : String(v).trim();
  return s === '' ? null : s;
}

function cell(v) {
  const s = val(v);
  return s === null
    ? '<span class="trip-spec-value is-tba">TBA</span>'
    : `<span class="trip-spec-value">${esc(s)}</span>`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function statusOf(trip) {
  const s = (val(trip.status) || 'open').toLowerCase();
  return ['open', 'waitlist', 'full'].includes(s) ? s : 'open';
}

function tripId(trip, i) {
  return val(trip.name) ? `${val(trip.name)}` : `Trip ${i + 1}`;
}

// ── render cards ──
function renderTrips() {
  const grid  = document.getElementById('tripsGrid');
  const empty = document.getElementById('tripsEmpty');
  const count = document.getElementById('tripCount');
  const filters = document.getElementById('tripFilters');
  if (!grid) return;

  // No trips at all — show the "coming soon" state and hide the filter bar.
  if (ALL_TRIPS.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    if (filters) filters.hidden = true;
    if (count) { count.textContent = ''; count.hidden = true; }
    return;
  }

  empty.hidden = true;
  if (filters) filters.hidden = false;

  const shown = tripFilter === 'all'
    ? ALL_TRIPS
    : ALL_TRIPS.filter(t => (val(t.type) || '').toLowerCase() === tripFilter);

  if (shown.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>No trips of this kind yet — try the other filter.</p></div>';
    if (count) count.textContent = '0 trips';
    return;
  }

  grid.innerHTML = shown.map((t, i) => {
    const status = statusOf(t);
    const name   = tripId(t, ALL_TRIPS.indexOf(t));
    const type   = val(t.type);
    const state  = val(t.state);
    const tagline = [type, state].filter(Boolean).join(' · ');

    const cta = status === 'full'
      ? '<div class="trip-full-note">This trip is full</div>'
      : `<button type="button" class="btn-primary trip-cta" data-trip="${esc(name)}">
           ${status === 'waitlist' ? 'Join waitlist' : 'Request this trip'}
         </button>`;

    return `
      <article class="trip-card reveal">
        <div class="trip-card-head">
          <h3 class="trip-name">${esc(name)}</h3>
          <span class="trip-status status-${status}">${status}</span>
        </div>
        ${tagline ? `<p class="trip-tagline">${esc(tagline)}</p>` : ''}
        <ul class="trip-specs">
          <li><span class="trip-spec-label">Dates</span>${cell(t.dates)}</li>
          <li><span class="trip-spec-label">Difficulty</span>${cell(t.difficulty)}</li>
          <li><span class="trip-spec-label">Distance</span>${cell(t.distance)}</li>
          <li><span class="trip-spec-label">Elevation gain</span>${cell(t.elevationGain)}</li>
          <li><span class="trip-spec-label">Max group</span>${cell(t.maxGroupSize)}</li>
          <li><span class="trip-spec-label">Price / person</span>${cell(t.price)}</li>
        </ul>
        ${cta}
      </article>`;
  }).join('');

  if (count) {
    count.textContent = `🌲 ${shown.length} trip${shown.length !== 1 ? 's' : ''}`;
    count.hidden = false;
  }

  grid.querySelectorAll('.reveal').forEach((el, i) =>
    setTimeout(() => el.classList.add('visible'), 60 + i * 60));

  // "Request this trip" ticks the matching box and scrolls to the form
  grid.querySelectorAll('.trip-cta').forEach(btn => {
    btn.addEventListener('click', () => selectTrip(btn.dataset.trip));
  });
}

// ── filter ──
function filterTrips(type, btn) {
  tripFilter = type;
  document.querySelectorAll('#tripFilters .filter-btn')
    .forEach(b => b.classList.toggle('active', b === btn));
  renderTrips();
}

// ── form: one checkbox per selectable trip ──
function renderTripChoices() {
  const wrap = document.getElementById('tripChoices');
  if (!wrap) return;

  // Full trips can't be requested, so they're not offered in the form.
  const selectable = ALL_TRIPS.filter(t => statusOf(t) !== 'full');

  if (selectable.length === 0) { wrap.innerHTML = ''; return; }

  wrap.innerHTML = selectable.map((t, i) => {
    const name   = tripId(t, ALL_TRIPS.indexOf(t));
    const status = statusOf(t);
    const label  = status === 'waitlist' ? `${name} (waitlist)` : name;
    const id     = 'trip-' + i;
    return `
      <label class="trip-choice" for="${id}">
        <input type="checkbox" id="${id}" name="trips" value="${esc(label)}">
        <span>${esc(label)}</span>
      </label>`;
  }).join('');
}

function selectTrip(name) {
  const boxes = [...document.querySelectorAll('#tripChoices input[name="trips"]')];
  const match = boxes.find(b => b.value === name || b.value === `${name} (waitlist)`);
  if (match) match.checked = true;
  const form = document.getElementById('tripForm');
  if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (match) setTimeout(() => match.focus({ preventScroll: true }), 400);
}

// ── swap the form between "pick a trip" and "general interest" ──
function syncFormMode() {
  const hasTrips = ALL_TRIPS.some(t => statusOf(t) !== 'full');
  const picker   = document.getElementById('tripPickerBlock');
  const interest = document.getElementById('interestBlock');
  const intro    = document.getElementById('formIntro');
  if (picker)   picker.hidden   = !hasTrips;
  if (interest) interest.hidden = hasTrips;
  if (intro) {
    intro.textContent = hasTrips
      ? 'Tell me which trips interest you and I\'ll follow up by email to confirm availability and send the waiver and intake paperwork.'
      : 'The 2027 schedule isn\'t published yet. Leave your details and I\'ll reach out as soon as dates are set — no obligation.';
  }
}

// ── submit ──
document.addEventListener('DOMContentLoaded', () => {
  loadTrips();

  const form = document.getElementById('tripForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const btn  = form.querySelector('.form-submit');
    const label = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(TRIPS_ENDPOINT, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        showToast('🌲 Request sent! James will follow up by email within 24 hours.');
        form.reset();
      } else {
        showToast('⚠️ Something went wrong. Please try again or email james.companyy@gmail.com.');
      }
    } catch {
      showToast('⚠️ Could not connect. Please check your internet and try again.');
    } finally {
      btn.textContent = label;
      btn.disabled = false;
    }
  });
});
