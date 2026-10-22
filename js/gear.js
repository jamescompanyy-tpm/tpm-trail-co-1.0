/* ═══════════════════════════════════════════════════
   TPM TRAIL CO. — gear.js
   Loads data/gear.json, renders the packing list for the
   chosen trip type, tracks have / buy / rent per item,
   and wires the rental request form.
   Gear data is authored in Decap at /admin.
═══════════════════════════════════════════════════ */

const GEAR_ENDPOINT = 'https://formspree.io/f/maqvnqqd';

// Where the saved list lives. Bump the suffix if the shape ever changes.
const GEAR_STORE_KEY = 'tpm-gear-list-v1';

// On an overnight trip these categories are replaced wholesale by their
// overnight items rather than added to — so you get the backpacking pack
// instead of the daypack, never both.
const OVERNIGHT_REPLACES = ['Pack'];

const TYPE_LABELS = { day: 'Day Hike', overnight: 'Overnight' };

let ALL_ITEMS = [];
let gearType  = 'day';
let choices   = {};   // { itemKey: 'have' | 'buy' | 'rent' }

// ── load ──
async function loadGear() {
  try {
    const res = await fetch('data/gear.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Gear data returned ' + res.status);
    const data = await res.json();
    ALL_ITEMS = (Array.isArray(data.items) ? data.items : []).filter(i => val(i && i.name));
  } catch (e) {
    console.info('Gear data not loaded:', e.message);
    ALL_ITEMS = [];
  }
  restoreList();
  applyTypeFromUrl();
  renderGear();
}

// ── /gear?type=overnight — arriving from a trip card ──
function applyTypeFromUrl() {
  const want = (new URLSearchParams(location.search).get('type') || '').toLowerCase();
  if (want === 'day' || want === 'overnight') gearType = want;
  syncTypeButtons();
}

function syncTypeButtons() {
  document.querySelectorAll('#gearTypeBar .filter-btn').forEach(b => {
    const on = b.dataset.type === gearType;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

// ── helpers ──
// Anything the CMS left blank is treated as absent rather than an empty row.
function val(v) {
  const s = (v === null || v === undefined) ? '' : String(v).trim();
  return s === '' ? null : s;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// A stable id per item, so a saved list survives the CMS reordering the JSON.
function keyOf(item) {
  return String(item.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function typeOf(item) {
  return (val(item.tripType) || 'day').toLowerCase() === 'overnight' ? 'overnight' : 'day';
}

function categoryOf(item) {
  return val(item.category) || 'Other gear';
}

function priceOf(item) {
  return item.rentable ? (val(item.rentalPrice) || 'TBA') : null;
}

// Day items show on both trip types; overnight items only on an overnight
// trip, where they also replace the day items in OVERNIGHT_REPLACES.
function visibleItems() {
  if (gearType === 'day') return ALL_ITEMS.filter(i => typeOf(i) === 'day');

  const replaced = new Set(
    ALL_ITEMS.filter(i => typeOf(i) === 'overnight')
             .map(categoryOf)
             .filter(c => OVERNIGHT_REPLACES.includes(c))
  );
  return ALL_ITEMS.filter(i =>
    typeOf(i) === 'overnight' || !replaced.has(categoryOf(i)));
}

// ── localStorage — the page works exactly the same without it ──
function restoreList() {
  try {
    const raw = window.localStorage.getItem(GEAR_STORE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && typeof saved.choices === 'object' && saved.choices) choices = saved.choices;
    if (saved && (saved.tripType === 'day' || saved.tripType === 'overnight')) gearType = saved.tripType;
  } catch (e) {
    choices = {};
  }
}

function saveList() {
  try {
    window.localStorage.setItem(GEAR_STORE_KEY,
      JSON.stringify({ tripType: gearType, choices }));
  } catch (e) {
    /* private mode, blocked storage, quota — the list just won't persist */
  }
}

function clearSaved() {
  try {
    window.localStorage.removeItem(GEAR_STORE_KEY);
  } catch (e) { /* nothing to do */ }
}

// ── render the list ──
function renderGear() {
  const wrap  = document.getElementById('gearGroups');
  const empty = document.getElementById('gearEmpty');
  const bar   = document.getElementById('gearTypeBar');
  if (!wrap) return;

  if (ALL_ITEMS.length === 0) {
    wrap.innerHTML = '';
    if (empty) empty.hidden = false;
    if (bar) bar.hidden = true;
    document.querySelectorAll('#gear .gear-toolbar, #summary, #rental')
      .forEach(el => el.hidden = true);
    updateProgress();
    return;
  }

  if (empty) empty.hidden = true;
  if (bar) bar.hidden = false;

  const items = visibleItems();

  // Categories in the order they first appear in the data.
  const groups = [];
  items.forEach(item => {
    const cat = categoryOf(item);
    let group = groups.find(g => g.cat === cat);
    if (!group) { group = { cat, items: [] }; groups.push(group); }
    group.items.push(item);
  });

  wrap.innerHTML = groups.map(group => `
    <section class="gear-group">
      <h2 class="gear-group-title">${esc(group.cat)}</h2>
      ${group.items.map(item => itemRow(item)).join('')}
    </section>`).join('');

  updateProgress();
  updateSummary();
}

function itemRow(item) {
  const key   = keyOf(item);
  const note  = val(item.note);
  const price = priceOf(item);
  const picked = choices[key];

  const option = (value, label, extra = '') => {
    const id = `gear-${key}-${value}`;
    return `
      <input type="radio" class="gear-radio" id="${id}" name="gear-${key}"
             value="${value}" data-key="${key}"${picked === value ? ' checked' : ''}>
      <label class="gear-choice gear-choice--${value}" for="${id}">${label}${extra}</label>`;
  };

  return `
    <fieldset class="gear-item${picked ? ' is-sorted' : ''}" data-item="${key}">
      <legend class="gear-item-head">
        <span class="gear-item-name">${esc(item.name)}</span>
        ${note ? `<span class="gear-item-note">${esc(note)}</span>` : ''}
      </legend>
      <div class="gear-choices">
        ${option('have', 'Have it')}
        ${option('buy', 'Need to buy')}
        ${item.rentable ? option('rent', 'Rent from TPM',
          `<span class="gear-choice-price">${esc(price)}</span>`) : ''}
      </div>
    </fieldset>`;
}

// ── progress ──
function updateProgress() {
  const out = document.getElementById('gearProgress');
  if (!out) return;
  const items  = visibleItems();
  const sorted = items.filter(i => choices[keyOf(i)]).length;
  out.textContent = items.length
    ? `${sorted} of ${items.length} items sorted`
    : '';
}

// ── summary, print header and the form's hidden fields ──
function updateSummary() {
  const items = visibleItems();
  const buy   = items.filter(i => choices[keyOf(i)] === 'buy');
  const rent  = items.filter(i => choices[keyOf(i)] === 'rent');

  fillSummary('gearBuyList', 'gearBuyEmpty', buy.map(i =>
    `<li class="gear-summary-item">${esc(i.name)}</li>`));

  fillSummary('gearRentList', 'gearRentEmpty', rent.map(i =>
    `<li class="gear-summary-item">${esc(i.name)}
       <span class="gear-summary-price">${esc(priceOf(i) || 'TBA')}</span></li>`));

  const head = document.getElementById('gearPrintHead');
  if (head) {
    head.textContent =
      `TPM Trail Co. — Gear list · ${TYPE_LABELS[gearType]} · ${items.filter(i => choices[keyOf(i)]).length} of ${items.length} items sorted`;
  }

  const typeField = document.getElementById('gearTripTypeField');
  if (typeField) typeField.value = TYPE_LABELS[gearType];

  const rentalField = document.getElementById('gearRentalField');
  if (rentalField) {
    rentalField.value = rent.length
      ? rent.map(i => `${i.name} (${priceOf(i) || 'TBA'})`).join(', ')
      : 'None selected';
  }

  const recap = document.getElementById('gearRentalRecap');
  if (recap) {
    recap.innerHTML = rent.length
      ? `<p class="gear-recap-label">Included with this request</p>
         <ul class="gear-recap-list">${rent.map(i =>
           `<li>${esc(i.name)}</li>`).join('')}</ul>`
      : `<p class="gear-recap-label gear-recap-label--empty">No rental items selected yet — mark an item &ldquo;Rent from TPM&rdquo; above and it will be included here.</p>`;
  }
}

function fillSummary(listId, emptyId, rows) {
  const list  = document.getElementById(listId);
  const empty = document.getElementById(emptyId);
  if (list)  list.innerHTML = rows.join('');
  if (empty) empty.hidden = rows.length > 0;
}

// ── trip type toggle ──
function setTripType(type, btn) {
  gearType = type === 'overnight' ? 'overnight' : 'day';
  if (btn) {
    document.querySelectorAll('#gearTypeBar .filter-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
  } else {
    syncTypeButtons();
  }
  saveList();
  renderGear();
}

// ── reset ──
function resetList() {
  choices = {};
  clearSaved();
  renderGear();
  showToast('↺ Gear list cleared.');
}

// ── print ──
function printList() {
  window.print();
}

// ── choices ──
document.addEventListener('DOMContentLoaded', () => {
  loadGear();

  const wrap = document.getElementById('gearGroups');
  if (wrap) wrap.addEventListener('change', e => {
    const input = e.target.closest('.gear-radio');
    if (!input) return;
    choices[input.dataset.key] = input.value;
    const row = input.closest('.gear-item');
    if (row) row.classList.add('is-sorted');
    saveList();
    updateProgress();
    updateSummary();
  });

  const form = document.getElementById('gearForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const btn   = form.querySelector('.form-submit');
    const label = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(GEAR_ENDPOINT, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        showToast('🌲 Rental request sent! James will follow up by email within 24 hours.');
        form.reset();
        updateSummary();
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
