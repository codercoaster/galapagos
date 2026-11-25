import { animate } from 'motion';
import { OPTION_GROUPS, findItem, RESTAURANT, UPSELLS } from './menu.js';
import { t, L, getLang, onLang } from './i18n.js';

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Emil Kowalski's strong ease-out, as a cubic-bezier array for Motion
export const EASE_OUT = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT = [0.77, 0, 0.175, 1];

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ------------------------------------------------------------------ icons */
export const icon = {
  bag: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  arrow: '<svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  plate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/></svg>',
  turtle: '<svg viewBox="0 0 64 40" aria-hidden="true"><use href="#turtle" /></svg>',
};

export const money = (n) => `$${n.toFixed(2)}`;
export const imgSrc = (name) => `./img/${name}.webp`;

/* ------------------------------------------------------------------ hours (America/New_York) */
function localNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: RESTAURANT.timeZone, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  return { day, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}
export const fmtTime = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const es = getLang() === 'es';
  const ap = h >= 12 ? (es ? 'pm' : 'PM') : es ? 'am' : 'AM';
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, '0')} ${ap}` : `${h12} ${ap}`;
};
export function openStatus() {
  const { day, minutes } = localNow();
  const [o, c] = RESTAURANT.hours[day];
  if (minutes >= o && minutes < c) return { open: true, label: t('status.open', { t: fmtTime(c) }), day, minutes };
  const before = minutes < o;
  const nextDay = before ? day : (day + 1) % 7;
  return { open: false, label: t(before ? 'status.closedToday' : 'status.closedTomorrow', { t: fmtTime(RESTAURANT.hours[nextDay][0]) }), day, minutes };
}
export function pickupSlots() {
  const { day, minutes } = localNow();
  const slots = [];
  const prep = 20;
  const build = (d, from, prefix) => {
    const [o, c] = RESTAURANT.hours[d];
    let tm = Math.max(o + prep, Math.ceil((from + prep) / 15) * 15);
    for (; tm <= c - 15; tm += 15) slots.push({ value: `${prefix}-${tm}`, label: `${t(prefix === 'today' ? 'co.today' : 'co.tomorrow')}, ${fmtTime(tm)}` });
  };
  build(day, minutes, 'today');
  build((day + 1) % 7, 0, 'tomorrow');
  return slots;
}

/* ------------------------------------------------------------------ cart store */
const KEY = 'galapagos.cart.v1';
const listeners = new Set();
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { lines: [], mode: 'pickup' };
  } catch {
    return { lines: [], mode: 'pickup' };
  }
};
let state = read();
// drop lines whose item no longer exists (menu edits)
state.lines = state.lines.filter((l) => findItem(l.id));
const persist = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: cart lives in memory */
  }
  listeners.forEach((fn) => fn(state));
};

export const resolveGroups = (item) => (item.options || []).map((o) => (typeof o === 'string' ? OPTION_GROUPS[o] : o));

export function linePrice(line) {
  const item = findItem(line.id);
  const groups = resolveGroups(item);
  let unit = item.price;
  Object.entries(line.choices || {}).forEach(([gi, idxs]) => idxs.forEach((ci) => (unit += groups[gi]?.choices[ci]?.price || 0)));
  return unit;
}
export function lineMods(line) {
  const item = findItem(line.id);
  const groups = resolveGroups(item);
  const mods = [];
  Object.entries(line.choices || {}).forEach(([gi, idxs]) => idxs.forEach((ci) => mods.push(L(groups[gi]?.choices[ci]?.label))));
  return mods.filter(Boolean);
}

export const cart = {
  get: () => state,
  subscribe(fn) {
    listeners.add(fn);
    fn(state);
    return () => listeners.delete(fn);
  },
  count: () => state.lines.reduce((s, l) => s + l.qty, 0),
  subtotal: () => state.lines.reduce((s, l) => s + linePrice(l) * l.qty, 0),
  add(id, qty = 1, choices = {}, notes = '') {
    const key = `${id}|${JSON.stringify(choices)}|${notes}`;
    const existing = state.lines.find((l) => l.key === key);
    if (existing) existing.qty += qty;
    else state.lines.push({ key, id, qty, choices, notes });
    persist();
  },
  setQty(key, qty) {
    const l = state.lines.find((x) => x.key === key);
    if (!l) return;
    if (qty <= 0) state.lines = state.lines.filter((x) => x.key !== key);
    else l.qty = qty;
    persist();
  },
  remove(key) {
    state.lines = state.lines.filter((x) => x.key !== key);
    persist();
  },
  clear() {
    state.lines = [];
    persist();
  },
  setMode(mode) {
    state.mode = mode;
    persist();
  },
  refresh: () => listeners.forEach((fn) => fn(state)),
};

window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    state = read();
    listeners.forEach((fn) => fn(state));
  }
});
// language change: re-render everything that shows cart content
onLang(() => cart.refresh());

/* ------------------------------------------------------------------ scroll lock + scrim */
let lockCount = 0;
const lock = () => {
  if (lockCount++ === 0) document.body.classList.add('is-locked');
};
const unlock = () => {
  if (--lockCount <= 0) {
    lockCount = 0;
    document.body.classList.remove('is-locked');
  }
};

function mount(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  const el = tpl.content.firstElementChild;
  document.body.appendChild(el);
  return el;
}

const scrim = mount('<div class="scrim" aria-hidden="true"></div>');
let activeOverlay = null;
scrim.addEventListener('click', () => activeOverlay?.close());
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') activeOverlay?.close();
});

function trapFocus(container, e) {
  if (e.key !== 'Tab') return;
  const f = [...container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
    (el) => !el.disabled && el.offsetParent !== null && !el.closest('[data-pos="left"], [data-pos="right"]'),
  );
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* ------------------------------------------------------------------ toast */
const toastEl = mount('<div class="toast" role="status" aria-live="polite"><span class="toast__icon">' + icon.check + '</span><span class="toast__msg"></span><button type="button"></button></div>');
let toastTimer;
toastEl.querySelector('button').addEventListener('click', () => {
  toastEl.classList.remove('is-visible');
  drawer.open();
});
export function toast(msg) {
  toastEl.querySelector('.toast__msg').textContent = msg;
  toastEl.querySelector('button').textContent = t('toast.view');
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3200);
}

/* ------------------------------------------------------------------ fly-to-cart */
export function flyToCart(fromEl) {
  const target = [...document.querySelectorAll('[data-cart-target]')].find((el) => el.offsetParent !== null);
  if (!fromEl || !target || reduceMotion) return bumpCart();
  const a = fromEl.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const dot = document.createElement('div');
  dot.className = 'fly-dot';
  document.body.appendChild(dot);
  const x0 = a.left + a.width / 2 - 9;
  const y0 = a.top + a.height / 2 - 9;
  const x1 = b.left + b.width / 2 - 9;
  const y1 = b.top + b.height / 2 - 9;
  const peak = Math.min(y0, y1) - 80;
  animate(dot, { x: [x0, x1] }, { duration: 0.62, ease: EASE_IN_OUT });
  animate(dot, { y: [y0, peak, y1], scale: [0.6, 1, 0.5], opacity: [1, 1, 0] }, { duration: 0.62, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] }).then(() => {
    dot.remove();
    bumpCart();
  });
}
function bumpCart() {
  if (reduceMotion) return;
  document.querySelectorAll('[data-cart-target]').forEach((el) => animate(el, { scale: [1, 1.12, 1] }, { duration: 0.3, ease: EASE_OUT }));
}

/* ------------------------------------------------------------------ item sheet */
const sheet = mount(`
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
    <div class="sheet__scroll"></div>
    <div class="sheet__foot">
      <div class="stepper">
        <button type="button" data-q="-1">${icon.minus}</button>
        <output class="tnum">1</output>
        <button type="button" data-q="1">${icon.plus}</button>
      </div>
      <button type="button" class="btn btn--red sheet__add"><span></span><span class="tnum sheet__total"></span></button>
    </div>
  </div>`);

let sheetState = null;
let sheetReturnFocus = null;

const groupBadge = (g, gi, choices) => {
  if (!g.required) return { cls: '', text: t('sheet.optional') };
  return choices[gi]?.length ? { cls: 'is-done', text: t('sheet.selected') } : { cls: 'is-required', text: t('sheet.required') };
};

function renderSheet() {
  const { item, choices } = sheetState;
  const groups = resolveGroups(item);
  const sub = getLang() === 'en' && item.en !== item.name ? item.en : '';
  sheet.querySelector('.sheet__scroll').innerHTML = `
    ${
      item.img
        ? `<div class="sheet__media"><img src="${imgSrc(item.img)}" alt="${esc(item.name)}"><button type="button" class="icon-btn sheet__close" aria-label="${t('sheet.close')}">${icon.close}</button></div>`
        : ''
    }
    <div class="sheet__head">
      <div class="sheet__head-row">
        <div>
          <h2 id="sheet-title">${esc(item.name)}</h2>
          ${sub ? `<p class="sheet__en">${esc(sub)}</p>` : ''}
        </div>
        ${item.img ? '' : `<button type="button" class="icon-btn sheet__close sheet__close--plain" aria-label="${t('sheet.close')}">${icon.close}</button>`}
      </div>
      ${item.desc ? `<p class="sheet__desc">${esc(L(item.desc))}</p>` : ''}
      <div class="sheet__price tnum">${money(item.price)}</div>
    </div>
    ${groups
      .map((g, gi) => {
        const badge = groupBadge(g, gi, choices);
        return `
      <fieldset class="opt-group" data-group="${gi}">
        <legend class="sr-only">${esc(L(g.title))}</legend>
        <div class="opt-group__head">
          <h3>${esc(L(g.title))}</h3>
          <span class="opt-group__badge ${badge.cls}">${badge.text}</span>
        </div>
        ${g.choices
          .map(
            (c, ci) => `
          <label class="opt ${g.type === 'multi' ? 'opt--multi' : ''}">
            <input type="${g.type === 'multi' ? 'checkbox' : 'radio'}" name="g${gi}" value="${ci}" ${choices[gi]?.includes(ci) ? 'checked' : ''}>
            <span class="opt__ctl"></span>
            <span class="opt__label">${esc(L(c.label))}</span>
            ${c.price ? `<span class="opt__price tnum">+${money(c.price)}</span>` : ''}
          </label>`,
          )
          .join('')}
      </fieldset>`;
      })
      .join('')}
    <div class="notes">
      <label class="field-label" for="sheet-notes">${t('sheet.notes')}</label>
      <textarea id="sheet-notes" placeholder="${esc(t('sheet.notesPh'))}" maxlength="160">${esc(sheetState.notes)}</textarea>
    </div>`;
  sheet.querySelector('.stepper').setAttribute('aria-label', t('sheet.qty'));
  sheet.querySelector('[data-q="-1"]').setAttribute('aria-label', t('sheet.dec'));
  sheet.querySelector('[data-q="1"]').setAttribute('aria-label', t('sheet.inc'));
  sheet.querySelector('.sheet__add span').textContent = t('sheet.add');
  updateSheetFoot();
}

function updateSheetFoot() {
  const { item, qty, choices } = sheetState;
  sheet.querySelector('.sheet__foot output').textContent = qty;
  const unit = linePrice({ id: item.id, choices });
  sheet.querySelector('.sheet__total').textContent = money(unit * qty);
  sheet.querySelector('[data-q="-1"]').disabled = qty <= 1;
}

sheet.addEventListener('change', (e) => {
  const input = e.target.closest('input[name^="g"]');
  if (!input) return;
  const gi = Number(input.name.slice(1));
  const group = resolveGroups(sheetState.item)[gi];
  const fs = sheet.querySelectorAll(`input[name="g${gi}"]`);
  sheetState.choices[gi] = [...fs].filter((x) => x.checked).map((x) => Number(x.value));
  if (!sheetState.choices[gi].length) delete sheetState.choices[gi];
  if (group.required) {
    const badge = input.closest('.opt-group').querySelector('.opt-group__badge');
    badge.className = 'opt-group__badge is-done';
    badge.textContent = t('sheet.selected');
  }
  updateSheetFoot();
});
sheet.addEventListener('input', (e) => {
  if (e.target.id === 'sheet-notes') sheetState.notes = e.target.value;
});
sheet.addEventListener('click', (e) => {
  if (e.target.closest('.sheet__close')) return itemSheet.close();
  const q = e.target.closest('[data-q]');
  if (q) {
    sheetState.qty = Math.max(1, Math.min(30, sheetState.qty + Number(q.dataset.q)));
    updateSheetFoot();
  }
  if (e.target.closest('.sheet__add')) {
    const groups = resolveGroups(sheetState.item);
    const missing = groups.findIndex((g, gi) => g.required && !sheetState.choices[gi]?.length);
    if (missing > -1) {
      const fs = sheet.querySelector(`[data-group="${missing}"]`);
      fs.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      fs.classList.remove('is-shake');
      void fs.offsetWidth;
      fs.classList.add('is-shake');
      return;
    }
    const { item, qty, choices, notes } = sheetState;
    cart.add(item.id, qty, choices, notes.trim());
    const origin = sheetState.origin;
    itemSheet.close();
    flyToCart(origin && origin.isConnected ? origin : sheet.querySelector('.sheet__add'));
    toast(t('toast.added', { name: `${qty > 1 ? qty + ' × ' : ''}${item.name}` }));
  }
});
sheet.addEventListener('keydown', (e) => trapFocus(sheet, e));

export const itemSheet = {
  open(id, origin) {
    const item = findItem(id);
    if (!item) return;
    sheetState = { item, qty: 1, choices: {}, notes: '', origin };
    sheetReturnFocus = document.activeElement;
    renderSheet();
    sheet.querySelector('.sheet__scroll').scrollTop = 0;
    activeOverlay = itemSheet;
    lock();
    scrim.classList.add('is-open');
    sheet.classList.add('is-open');
    requestAnimationFrame(() => sheet.querySelector('.sheet__close')?.focus({ preventScroll: true }));
  },
  close() {
    sheet.classList.remove('is-open');
    scrim.classList.remove('is-open');
    activeOverlay = null;
    unlock();
    sheetReturnFocus?.focus?.({ preventScroll: true });
  },
};

/* ------------------------------------------------------------------ drawer (cart → checkout → confirmation) */
const drawer = (() => {
  const el = mount(`
    <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div class="drawer__head">
        <div class="drawer__title">
          <button type="button" class="icon-btn drawer__back" hidden>${icon.back}</button>
          <h2 id="drawer-title"></h2>
        </div>
        <button type="button" class="icon-btn drawer__close">${icon.close}</button>
      </div>
      <div class="drawer__steps">
        <section class="drawer__step" data-step="cart" data-pos="center"></section>
        <section class="drawer__step" data-step="checkout" data-pos="right"></section>
        <section class="drawer__step" data-step="done" data-pos="right"></section>
      </div>
    </aside>`);

  const steps = ['cart', 'checkout', 'done'];
  let step = 'cart';
  let tipPct = 0.15;
  let returnFocus = null;
  const titleKey = { cart: 'cart.yours', checkout: 'drawer.checkout', done: 'drawer.placed' };

  const totals = () => {
    const sub = cart.subtotal();
    const tax = sub * RESTAURANT.taxRate;
    const tip = sub * tipPct;
    return { sub, tax, tip, total: sub + tax + tip };
  };

  const totalsHTML = (withTip) => {
    const x = totals();
    return `
      <div class="totals tnum">
        <div><span>${t('order.subtotal')}</span><span>${money(x.sub)}</span></div>
        <div><span>${t('drawer.tax')} (6.625%)</span><span>${money(x.tax)}</span></div>
        ${withTip ? `<div><span>${t('drawer.tip')}</span><span>${money(x.tip)}</span></div>` : ''}
        <div class="grand"><span>${t('drawer.total')}</span><span>${money(withTip ? x.total : x.sub + x.tax)}</span></div>
      </div>`;
  };

  function renderCart() {
    const node = el.querySelector('[data-step="cart"]');
    const s = cart.get();
    if (!s.lines.length) {
      node.innerHTML = `
        <div class="empty-cart">
          ${icon.turtle}
          <strong>${t('drawer.emptyTitle')}</strong>
          <p>${t('drawer.emptyText')}</p>
          <a class="btn btn--red" href="./order.html" data-browse>${t('drawer.browse')} ${icon.arrow}</a>
        </div>`;
      return;
    }
    const inCart = new Set(s.lines.map((l) => l.id));
    const upsells = UPSELLS.filter((id) => !inCart.has(id)).slice(0, 4).map(findItem);
    node.innerHTML = `
      <div class="drawer__body">
        <div class="segmented" data-mode style="margin-top:16px;width:100%">
          <span class="segmented__pill"></span>
          <button type="button" data-mode-btn="pickup" aria-pressed="${s.mode === 'pickup'}">${t('order.pickup')}</button>
          <button type="button" data-mode-btn="curbside" aria-pressed="${s.mode === 'curbside'}">${t('order.curbside')}</button>
        </div>
        <div class="cart-lines">
        ${s.lines
          .map((l) => {
            const item = findItem(l.id);
            const mods = lineMods(l);
            return `
            <div class="cart-line" data-key="${esc(l.key)}">
              <div class="cart-line__thumb">${item.img ? `<img src="${imgSrc(item.img)}" alt="" loading="lazy">` : icon.plate}</div>
              <div>
                <h4>${esc(item.name)}</h4>
                ${mods.length || l.notes ? `<div class="cart-line__mods">${esc(mods.join(' · '))}${l.notes ? `${mods.length ? '<br>' : ''}“${esc(l.notes)}”` : ''}</div>` : ''}
                <div class="cart-line__controls">
                  <div class="stepper stepper--sm">
                    <button type="button" data-line-q="-1" aria-label="${t('drawer.dec')}">${icon.minus}</button>
                    <output class="tnum">${l.qty}</output>
                    <button type="button" data-line-q="1" aria-label="${t('drawer.inc')}">${icon.plus}</button>
                  </div>
                  <button type="button" class="link-btn" data-remove>${t('drawer.remove')}</button>
                </div>
              </div>
              <div class="cart-line__price">${money(linePrice(l) * l.qty)}</div>
            </div>`;
          })
          .join('')}
        </div>
        ${
          upsells.length
            ? `<div class="upsell"><h3>${t('drawer.upsell')}</h3><div class="upsell__row">${upsells
                .map((u) => `<button type="button" class="upsell__item" data-upsell="${u.id}"><strong>${esc(u.name)}</strong><span class="tnum">${money(u.price)}</span></button>`)
                .join('')}</div></div>`
            : ''
        }
        ${totalsHTML(false)}
      </div>
      <div class="drawer__foot">
        <button type="button" class="btn btn--red btn--block" data-go="checkout" style="justify-content:space-between"><span>${t('drawer.checkout')}</span><span class="tnum">${money(totals().sub + totals().tax)}</span></button>
      </div>`;
    placePill(node.querySelector('[data-mode]'));
  }

  function placePill(seg) {
    if (!seg) return;
    const active = seg.querySelector('[aria-pressed="true"]');
    const pill = seg.querySelector('.segmented__pill');
    if (!active || !pill) return;
    pill.style.width = `${active.offsetWidth}px`;
    pill.style.transform = `translateX(${active.offsetLeft - 4}px)`;
  }

  function renderCheckout() {
    const node = el.querySelector('[data-step="checkout"]');
    const s = cart.get();
    const status = openStatus();
    const slots = pickupSlots();
    node.innerHTML = `
      <form class="drawer__body" novalidate>
        <div class="form-section">
          <h3><span>1</span>${t('co.when')}</h3>
          <div class="radio-cards">
            ${
              status.open
                ? `<label class="radio-card"><input type="radio" name="when" value="asap" checked><span class="opt__ctl"></span><span class="radio-card__text"><strong>${t('co.asap')}</strong><small>${t('co.asapSub')}</small></span></label>`
                : ''
            }
            <label class="radio-card"><input type="radio" name="when" value="later" ${status.open ? '' : 'checked'}><span class="opt__ctl"></span><span class="radio-card__text"><strong>${t('co.later')}</strong><small>${status.open ? t('co.laterSub') : esc(status.label)}</small></span></label>
          </div>
          <div class="card-fields ${status.open ? '' : 'is-open'}" data-later><div><div class="fields"><div class="field full">
            <label for="co-slot">${t('co.when')}</label>
            <select id="co-slot" class="input" name="slot">${slots.map((x) => `<option value="${x.value}">${x.label}</option>`).join('')}</select>
          </div></div></div></div>
        </div>
        <div class="form-section">
          <h3><span>2</span>${t('co.details')}</h3>
          <div class="fields">
            <div class="field"><label for="co-first">${t('co.first')}</label><input class="input" id="co-first" name="first" autocomplete="given-name" required><span class="err"></span></div>
            <div class="field"><label for="co-last">${t('co.last')}</label><input class="input" id="co-last" name="last" autocomplete="family-name" required><span class="err"></span></div>
            <div class="field full"><label for="co-phone">${t('co.phone')}</label><input class="input" id="co-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(973) 555-0123" required><span class="err"></span></div>
            <div class="field full"><label for="co-email">${t('co.email')}</label><input class="input" id="co-email" name="email" type="email" autocomplete="email" required><span class="err"></span></div>
            ${
              s.mode === 'curbside'
                ? `<div class="field full"><label for="co-car">${t('co.car')}</label><input class="input" id="co-car" name="car" placeholder="${esc(t('co.carPh'))}" required><span class="err"></span></div>`
                : ''
            }
          </div>
        </div>
        <div class="form-section">
          <h3><span>3</span>${t('co.tipTitle')}</h3>
          <div class="tips">
            ${[0, 0.1, 0.15, 0.2]
              .map(
                (p) =>
                  `<button type="button" class="tip" data-tip="${p}" aria-pressed="${p === tipPct}">${p ? Math.round(p * 100) + '%' : t('co.noTip')}<small class="tnum">${p ? money(cart.subtotal() * p) : '—'}</small></button>`,
              )
              .join('')}
          </div>
          <p class="form-note">${t('co.tipNote')}</p>
        </div>
        <div class="form-section">
          <h3><span>4</span>${t('co.payment')}</h3>
          <div class="radio-cards">
            <label class="radio-card"><input type="radio" name="pay" value="card" checked><span class="opt__ctl"></span><span class="radio-card__text"><strong>${t('co.payCard')}</strong><small>${t('co.payCardSub')}</small></span></label>
            <label class="radio-card"><input type="radio" name="pay" value="store"><span class="opt__ctl"></span><span class="radio-card__text"><strong>${t('co.payStore')}</strong><small>${t('co.payStoreSub')}</small></span></label>
          </div>
          <div class="card-fields is-open" data-card><div>
            <div class="fields">
              <div class="field full"><label for="co-cc">${t('co.cc')}</label><input class="input tnum" id="co-cc" name="cc" inputmode="numeric" autocomplete="off" placeholder="1234 1234 1234 1234" maxlength="19"><span class="err"></span></div>
              <div class="field"><label for="co-exp">${t('co.exp')}</label><input class="input tnum" id="co-exp" name="exp" inputmode="numeric" autocomplete="off" placeholder="MM / YY" maxlength="7"><span class="err"></span></div>
              <div class="field"><label for="co-cvc">${t('co.cvc')}</label><input class="input tnum" id="co-cvc" name="cvc" inputmode="numeric" autocomplete="off" placeholder="123" maxlength="4"><span class="err"></span></div>
            </div>
            <p class="secure-note">${icon.lock} ${t('co.secure')}</p>
          </div></div>
        </div>
        <div class="form-section" data-co-totals>${totalsHTML(true)}</div>
      </form>
      <div class="drawer__foot">
        <button type="button" class="btn btn--red btn--block" data-place style="justify-content:space-between"><span>${t('co.place')}</span><span class="tnum" data-co-grand>${money(totals().total)}</span></button>
      </div>`;
  }

  function refreshCheckoutTotals() {
    const node = el.querySelector('[data-step="checkout"]');
    node.querySelector('[data-co-totals]').innerHTML = totalsHTML(true);
    node.querySelector('[data-co-grand]').textContent = money(totals().total);
  }

  function validate(form) {
    let ok = true;
    const set = (name, msg) => {
      const input = form.elements[name];
      if (!input) return;
      input.classList.toggle('is-invalid', !!msg);
      const err = input.parentElement.querySelector('.err');
      if (err) err.textContent = msg || '';
      if (msg && ok) {
        input.focus({ preventScroll: true });
        input.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        ok = false;
      }
    };
    const v = (n) => (form.elements[n]?.value || '').trim();
    set('first', v('first') ? '' : t('err.first'));
    set('last', v('last') ? '' : t('err.last'));
    set('phone', v('phone').replace(/\D/g, '').length >= 10 ? '' : t('err.phone'));
    set('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email')) ? '' : t('err.email'));
    if (form.elements.car) set('car', v('car') ? '' : t('err.car'));
    if (form.elements.pay.value === 'card') {
      set('cc', v('cc').replace(/\D/g, '').length >= 15 ? '' : t('err.cc'));
      set('exp', /^\d{2}\s?\/\s?\d{2}$/.test(v('exp')) ? '' : 'MM / YY');
      set('cvc', /^\d{3,4}$/.test(v('cvc')) ? '' : t('err.cvc'));
    }
    return ok;
  }

  function renderDone(order) {
    const node = el.querySelector('[data-step="done"]');
    node.innerHTML = `
      <div class="confirm">
        <div class="confirm__check">${icon.check}</div>
        <h3><span class="confirm__thanks">${esc(t('done.thanks', { name: order.first }))}</span>${t('done.title')}</h3>
        <p class="confirm__lede">${t('done.lede', { email: esc(order.email), phone: esc(order.phone) })}</p>
        <div class="progress" aria-label="${t('done.progress')}">
          <div class="progress__step is-active"><div class="progress__bar"><i></i></div>${t('done.received')}</div>
          <div class="progress__step"><div class="progress__bar"><i></i></div>${t('done.kitchen')}</div>
          <div class="progress__step"><div class="progress__bar"><i></i></div>${t('done.ready')}</div>
        </div>
        <div class="ticket">
          <div class="ticket__row"><span>${t('done.order')}</span><strong class="tnum">#${order.number}</strong></div>
          <div class="ticket__row"><span>${order.mode === 'curbside' ? t('order.curbside') : t('order.pickup')}</span><strong>${esc(order.when)}</strong></div>
          <div class="ticket__row"><span>${t('done.where')}</span><strong>${RESTAURANT.address}<br>${RESTAURANT.city}</strong></div>
          <div class="ticket__row"><span>${order.items} ${order.items > 1 ? t('done.items') : t('done.item')}</span><strong class="tnum">${money(order.total)} · ${order.pay === 'store' ? t('done.payAtPickup') : t('done.paid')}</strong></div>
        </div>
        ${order.mode === 'curbside' ? `<p class="form-note">${t('done.curbNote')}</p>` : ''}
        <a class="btn btn--ghost btn--block" href="${RESTAURANT.mapsUrl}" target="_blank" rel="noopener">${t('visit.directions')}</a>
      </div>
      <div class="drawer__foot"><button type="button" class="btn btn--block" data-done>${t('done.done')}</button></div>`;
    const bars = node.querySelectorAll('.progress__bar i');
    const labels = node.querySelectorAll('.progress__step');
    if (reduceMotion) {
      bars[0].style.transform = 'scaleX(1)';
      labels[1].classList.add('is-active');
      bars[1].style.transform = 'scaleX(0.42)';
      return;
    }
    // a one-off celebration: the only spring with bounce on the site
    animate(node.querySelector('.confirm__check'), { scale: [0.6, 1], opacity: [0, 1] }, { type: 'spring', bounce: 0.35, duration: 0.6, delay: 0.25 });
    node.querySelectorAll('.confirm > *:not(.confirm__check)').forEach((c, i) => animate(c, { y: [14, 0], opacity: [0, 1] }, { duration: 0.5, ease: EASE_OUT, delay: 0.35 + i * 0.05 }));
    animate(bars[0], { scaleX: [0, 1] }, { duration: 1.4, ease: 'easeInOut', delay: 0.6 }).then(() => {
      labels[1].classList.add('is-active');
      animate(bars[1], { scaleX: [0, 0.42] }, { duration: 2.6, ease: 'easeOut' });
    });
  }

  function go(next) {
    const idx = steps.indexOf(next);
    steps.forEach((s, i) => {
      el.querySelector(`[data-step="${s}"]`).dataset.pos = i < idx ? 'left' : i > idx ? 'right' : 'center';
    });
    step = next;
    el.querySelector('#drawer-title').textContent = t(titleKey[next]);
    el.querySelector('.drawer__back').hidden = next !== 'checkout';
    el.querySelector(`[data-step="${next}"]`).scrollTop = 0;
  }

  const labelChrome = () => {
    el.querySelector('.drawer__back').setAttribute('aria-label', t('drawer.back'));
    el.querySelector('.drawer__close').setAttribute('aria-label', t('sheet.close'));
    el.querySelector('#drawer-title').textContent = t(titleKey[step]);
  };

  el.addEventListener('click', (e) => {
    const tg = e.target;
    if (tg.closest('.drawer__close') || tg.closest('[data-done]')) return api.close();
    if (tg.closest('.drawer__back')) return go('cart');
    if (tg.closest('[data-browse]') && location.pathname.endsWith('order.html')) {
      e.preventDefault();
      return api.close();
    }
    const modeBtn = tg.closest('[data-mode-btn]');
    if (modeBtn) return cart.setMode(modeBtn.dataset.modeBtn);
    const lineEl = tg.closest('.cart-line');
    if (lineEl) {
      const key = lineEl.dataset.key;
      const line = cart.get().lines.find((l) => l.key === key);
      const q = tg.closest('[data-line-q]');
      if (q && line) cart.setQty(key, line.qty + Number(q.dataset.lineQ));
      if (tg.closest('[data-remove]')) {
        if (reduceMotion) cart.remove(key);
        else animate(lineEl, { opacity: 0, x: 24 }, { duration: 0.2, ease: 'easeIn' }).then(() => cart.remove(key));
      }
      return;
    }
    const up = tg.closest('[data-upsell]');
    if (up) {
      const item = findItem(up.dataset.upsell);
      if (item.options?.length) {
        api.close();
        setTimeout(() => itemSheet.open(item.id), 200);
      } else {
        cart.add(item.id);
        toast(t('toast.added', { name: item.name }));
      }
      return;
    }
    if (tg.closest('[data-go="checkout"]')) {
      renderCheckout();
      go('checkout');
      return;
    }
    const tip = tg.closest('[data-tip]');
    if (tip) {
      tipPct = Number(tip.dataset.tip);
      el.querySelectorAll('[data-tip]').forEach((b) => b.setAttribute('aria-pressed', b === tip));
      refreshCheckoutTotals();
      return;
    }
    const place = tg.closest('[data-place]');
    if (place) {
      const form = el.querySelector('[data-step="checkout"] form');
      if (!validate(form)) return;
      place.disabled = true;
      place.firstElementChild.textContent = t('co.placing');
      const f = form.elements;
      const now = openStatus().minutes + 20;
      const slotLabel = f.when.value === 'asap' ? `${t('co.today')}, ~${fmtTime(now - (now % 5))}` : f.slot.selectedOptions[0]?.textContent;
      const order = {
        number: String(Math.floor(1000 + Math.random() * 8999)),
        first: f.first.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        when: slotLabel,
        pay: f.pay.value,
        mode: cart.get().mode,
        items: cart.count(),
        total: totals().total,
      };
      // demo: nothing is sent anywhere
      setTimeout(() => {
        renderDone(order);
        go('done');
        cart.clear();
        tipPct = 0.15;
      }, 1100);
    }
  });

  el.addEventListener('change', (e) => {
    const tg = e.target;
    if (tg.name === 'when') el.querySelector('[data-later]').classList.toggle('is-open', tg.value === 'later');
    if (tg.name === 'pay') el.querySelector('[data-card]').classList.toggle('is-open', tg.value === 'card');
  });
  el.addEventListener('input', (e) => {
    const tg = e.target;
    if (tg.classList.contains('is-invalid')) {
      tg.classList.remove('is-invalid');
      const err = tg.parentElement.querySelector('.err');
      if (err) err.textContent = '';
    }
    if (tg.name === 'cc') tg.value = tg.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    if (tg.name === 'exp') {
      const d = tg.value.replace(/\D/g, '').slice(0, 4);
      tg.value = d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
    }
    if (tg.name === 'cvc') tg.value = tg.value.replace(/\D/g, '').slice(0, 4);
  });
  el.addEventListener('keydown', (e) => trapFocus(el, e));

  let lastSig = '';
  cart.subscribe((st) => {
    labelChrome();
    const sig = JSON.stringify(st.lines) + getLang();
    if (step === 'cart' && sig === lastSig) {
      const seg = el.querySelector('[data-mode]');
      seg?.querySelectorAll('[data-mode-btn]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.modeBtn === st.mode));
      placePill(seg);
      return;
    }
    lastSig = sig;
    if (step === 'cart') renderCart();
    else if (step === 'checkout' && cart.count()) refreshCheckoutTotals();
  });

  const api = {
    open() {
      toastEl.classList.remove('is-visible');
      returnFocus = document.activeElement;
      renderCart();
      go('cart');
      activeOverlay = api;
      lock();
      scrim.classList.add('is-open');
      el.classList.add('is-open');
      requestAnimationFrame(() => {
        placePill(el.querySelector('[data-mode]'));
        el.querySelector('.drawer__close').focus({ preventScroll: true });
      });
    },
    close() {
      el.classList.remove('is-open');
      scrim.classList.remove('is-open');
      activeOverlay = null;
      unlock();
      if (step === 'done') setTimeout(() => go('cart'), 500);
      returnFocus?.focus?.({ preventScroll: true });
    },
  };
  return api;
})();
export { drawer };

/* ------------------------------------------------------------------ header + page chrome */
export function renderOpenStatus() {
  document.querySelectorAll('[data-open-status]').forEach((el) => {
    const s = openStatus();
    el.textContent = s.label;
    el.classList.toggle('is-closed', !s.open);
  });
}

/* ---------------------------------------------------------- in-page anchors */

// Where a section's content actually starts: skip the section's own top padding
// and leave just enough room for whatever is pinned at the top (header, category bar).
function anchorTop(el, currentY = window.scrollY) {
  const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const contentY = el.getBoundingClientRect().top + window.scrollY + padTop;
  const headerH = document.querySelector('.site-header__bar')?.offsetHeight || 72;
  const catNavH = document.querySelector('.cat-nav')?.offsetHeight || 0;
  const breathing = 28;
  // initHeader hides the header while scrolling down past 400px, and shows it when scrolling up
  const headerWillHide = contentY > currentY && contentY - headerH - catNavH - breathing > 400;
  const y = contentY - catNavH - breathing - (headerWillHide ? 0 : headerH);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(Math.round(y), max));
}

export function scrollToAnchor(el, { instant = false } = {}) {
  const top = anchorTop(el);
  const behavior = instant || reduceMotion ? 'auto' : 'smooth';
  window.scrollTo({ top, behavior });
  if (behavior === 'auto') return;
  // lazy images can shift the layout mid-flight: when the scroll settles, nudge to the exact spot
  let done = false;
  const settle = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scrollend', settle);
    const fix = anchorTop(el);
    if (Math.abs(fix - window.scrollY) > 2) window.scrollTo({ top: fix, behavior: 'smooth' });
  };
  window.addEventListener('scrollend', settle, { once: true });
  setTimeout(settle, 1400); // browsers without scrollend
}

function initAnchors() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.target === '_blank' || a.classList.contains('sr-only')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    scrollToAnchor(el);
  });

  const fromHash = (instant) => {
    const id = location.hash.slice(1);
    const el = id && document.getElementById(decodeURIComponent(id));
    if (el) scrollToAnchor(el, { instant });
  };
  window.addEventListener('popstate', () => fromHash(false));
  // arriving with a hash (e.g. index.html#visit from the order page): replace the browser's jump
  if (location.hash && !document.querySelector('[data-cat-link]')) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    requestAnimationFrame(() => fromHash(true));
    window.addEventListener('load', () => fromHash(true), { once: true });
  }
}

export function initHeader() {
  const header = document.querySelector('.site-header');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 12);
    const hide = y > 400 && y > lastY + 4 && !document.body.classList.contains('is-locked');
    const show = y < lastY - 4 || y < 400;
    if (hide) {
      header.classList.add('is-hidden');
      document.body.classList.add('header-hidden');
    } else if (show) {
      header.classList.remove('is-hidden');
      document.body.classList.remove('header-hidden');
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('[data-open-cart]').forEach((b) => b.addEventListener('click', () => drawer.open()));
  const counts = document.querySelectorAll('.cart-btn__count');
  cart.subscribe(() => {
    const n = cart.count();
    counts.forEach((c) => {
      c.textContent = n;
      c.classList.toggle('has-items', n > 0);
    });
  });

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (!add) return;
    e.preventDefault();
    itemSheet.open(add.dataset.add, add);
  });

  initAnchors();
  renderOpenStatus();
  onLang(renderOpenStatus);
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}
