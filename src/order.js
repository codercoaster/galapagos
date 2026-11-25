import { animate, stagger } from 'motion';
import { CATEGORIES, findItem } from './menu.js';
import { initHeader, cart, money, imgSrc, icon, linePrice, lineMods, reduceMotion, drawer, esc, EASE_OUT } from './shared.js';
import { t, L, getLang, onLang, initLangToggle } from './i18n.js';

/* ------------------------------------------------------------------ menu render */
const menuEl = document.querySelector('[data-menu]');
const itemHTML = (item) => {
  const sub = getLang() === 'en' && item.en !== item.name ? item.en : '';
  const desc = L(item.desc);
  return `
  <button type="button" class="item" data-add="${item.id}" data-item="${item.id}" aria-label="${esc(item.name)}, ${money(item.price)}">
    <span class="item__body">
      <span class="item__name">${esc(item.name)}</span>
      ${sub ? `<span class="item__en">${esc(sub)}</span>` : ''}
      ${desc ? `<span class="item__desc">${esc(desc)}</span>` : ''}
      <span class="item__foot">
        <span class="item__price tnum">${money(item.price)}</span>
        ${(item.tags || []).map((tg) => `<span class="tag tag--${tg}">${t('tag.' + tg)}</span>`).join('')}
      </span>
    </span>
    ${
      item.img
        ? `<span class="item__thumb"><img src="${imgSrc(item.img)}" alt="" loading="lazy"><span class="item__plus">${icon.plus}</span></span>`
        : `<span class="item__plus item__plus--inline">${icon.plus}</span>`
    }
  </button>`;
};

const list = document.querySelector('[data-cat-list]');
const pill = document.querySelector('[data-cat-pill]');
const scroller = document.querySelector('[data-cat-scroller]');
const search = document.querySelector('[data-search]');

function renderMenu() {
  menuEl.innerHTML =
    CATEGORIES.map(
      (c) => `
    <section class="menu-cat" id="${c.id}" data-cat="${c.id}">
      <div class="menu-cat__head"><h2>${esc(L(c.name))}</h2></div>
      ${c.note ? `<p class="menu-cat__note">${esc(L(c.note))}</p>` : '<div class="menu-cat__gap"></div>'}
      <div class="items">${c.items.map(itemHTML).join('')}</div>
    </section>`,
    ).join('') + `<div class="empty-search" data-empty hidden><strong>${t('order.noMatch')}</strong>${t('order.noMatchHint')}</div>`;

  list.querySelectorAll('[data-cat-link]').forEach((a) => a.remove());
  list.insertAdjacentHTML('beforeend', CATEGORIES.map((c) => `<a href="#${c.id}" data-cat-link="${c.id}">${esc(L(c.name))}</a>`).join(''));
}

/* ------------------------------------------------------------------ category nav + scrollspy */
let activeCat = null;
let clickLock = false;
function setActive(id, instant = false) {
  if (id === activeCat) return;
  activeCat = id;
  const link = list.querySelector(`[data-cat-link="${id}"]`);
  if (!link) return;
  list.querySelectorAll('a').forEach((a) => a.classList.toggle('is-active', a === link));
  if (instant) pill.style.transition = 'none';
  pill.style.width = `${link.offsetWidth}px`;
  pill.style.transform = `translateX(${link.offsetLeft}px)`;
  if (instant) requestAnimationFrame(() => (pill.style.transition = ''));
  const target = link.offsetLeft - scroller.clientWidth / 2 + link.offsetWidth / 2;
  scroller.scrollTo({ left: target, behavior: reduceMotion || instant ? 'auto' : 'smooth' });
}

const spy = () => {
  if (clickLock) return;
  const line = Math.min(260, window.innerHeight * 0.32);
  let current = CATEGORIES[0].id;
  document.querySelectorAll('[data-cat]:not([hidden])').forEach((sec) => {
    if (sec.getBoundingClientRect().top - line <= 0) current = sec.dataset.cat;
  });
  setActive(current);
};
window.addEventListener('scroll', spy, { passive: true });
window.addEventListener('resize', () => {
  const id = activeCat;
  activeCat = null;
  setActive(id, true);
});

list.addEventListener('click', (e) => {
  const a = e.target.closest('[data-cat-link]');
  if (!a) return;
  e.preventDefault();
  const sec = document.getElementById(a.dataset.catLink);
  setActive(a.dataset.catLink);
  clickLock = true;
  const y = sec.getBoundingClientRect().top + window.scrollY - 140;
  window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  history.replaceState(null, '', `#${a.dataset.catLink}`);
  clearTimeout(list._t);
  list._t = setTimeout(() => (clickLock = false), 900);
});

/* ------------------------------------------------------------------ search (matches both languages) */
const haystack = (it, c) => [it.name, it.en, it.desc?.en, it.desc?.es, c.name.en, c.name.es].filter(Boolean).join(' ');
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function applySearch() {
  const q = fold(search.value.trim());
  let any = false;
  CATEGORIES.forEach((c) => {
    const sec = document.getElementById(c.id);
    let catHas = false;
    c.items.forEach((it) => {
      const hit = !q || fold(haystack(it, c)).includes(q);
      sec.querySelector(`[data-item="${it.id}"]`).hidden = !hit;
      if (hit) catHas = true;
    });
    sec.hidden = !catHas;
    list.querySelector(`[data-cat-link="${c.id}"]`).hidden = !catHas;
    if (catHas) any = true;
  });
  menuEl.querySelector('[data-empty]').hidden = any;
  activeCat = null;
  spy();
}
search.addEventListener('input', applySearch);

/* ------------------------------------------------------------------ mode toggle (page) */
const seg = document.querySelector('[data-page-mode]');
function syncMode() {
  const mode = cart.get().mode;
  seg.querySelectorAll('[data-mode-btn]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.modeBtn === mode));
  const active = seg.querySelector('[aria-pressed="true"]');
  const p = seg.querySelector('.segmented__pill');
  p.style.width = `${active.offsetWidth}px`;
  p.style.transform = `translateX(${active.offsetLeft - 4}px)`;
}
seg.addEventListener('click', (e) => {
  const b = e.target.closest('[data-mode-btn]');
  if (b) cart.setMode(b.dataset.modeBtn);
});

/* ------------------------------------------------------------------ sticky offsets */
// The mini cart sticks just below the category bar, so it needs that bar's real height.
const catNavEl = document.querySelector('.cat-nav');
if (catNavEl) {
  const setCatNavH = () => document.documentElement.style.setProperty('--cat-nav-h', `${catNavEl.offsetHeight}px`);
  setCatNavH();
  new ResizeObserver(setCatNavH).observe(catNavEl);
}

/* ------------------------------------------------------------------ mini cart + bar + badges */
const mini = document.querySelector('[data-mini-cart]');
const bar = document.querySelector('[data-cart-bar]');
const headerTotal = document.querySelector('[data-header-total]');

function renderMini() {
  const s = cart.get();
  const sub = cart.subtotal();
  if (!s.lines.length) {
    mini.innerHTML = `
      <h3>${t('cart.yours')}</h3>
      <div class="mini-cart__empty">${icon.turtle}<span>${t('order.empty')}</span></div>`;
  } else {
    mini.innerHTML = `
      <h3>${t('cart.yours')}</h3>
      <ul>${s.lines
        .map((l) => {
          const it = findItem(l.id);
          const mods = lineMods(l);
          return `<li><b class="tnum">${l.qty}×</b><span>${esc(it.name)}${mods.length ? `<br><small>${esc(mods.join(' · '))}</small>` : ''}</span><span class="tnum">${money(linePrice(l) * l.qty)}</span></li>`;
        })
        .join('')}</ul>
      <div class="mini-cart__total tnum"><span>${t('order.subtotal')}</span><span>${money(sub)}</span></div>
      <button type="button" class="btn btn--red btn--block" data-open-cart-mini>${t('order.review')}</button>`;
  }
  headerTotal.textContent = s.lines.length ? ` · ${money(sub)}` : '';
  bar.querySelector('[data-bar-label]').textContent = cart.count() === 1 ? t('order.items1') : t('order.items', { n: cart.count() });
  bar.querySelector('[data-bar-total]').textContent = money(sub);
  bar.classList.toggle('is-visible', s.lines.length > 0);
  document.body.classList.toggle('has-cart-bar', s.lines.length > 0 && window.innerWidth <= 1080);

  // per-item quantity badges
  document.querySelectorAll('.item__qty').forEach((b) => b.remove());
  const qty = {};
  s.lines.forEach((l) => (qty[l.id] = (qty[l.id] || 0) + l.qty));
  Object.entries(qty).forEach(([id, n]) => {
    const el = document.querySelector(`[data-item="${id}"]`);
    if (el) el.insertAdjacentHTML('beforeend', `<span class="item__qty tnum" aria-label="${t('order.inOrder', { n })}">${n}</span>`);
  });
  syncMode();
}
mini.addEventListener('click', (e) => {
  if (e.target.closest('[data-open-cart-mini]')) drawer.open();
});

/* ------------------------------------------------------------------ boot */
initLangToggle();
renderMenu();
initHeader();
cart.subscribe(renderMini);
onLang(() => {
  renderMenu();
  if (search.value) applySearch();
  renderMini();
  activeCat = null;
  setActive(CATEGORIES[0].id, true);
  spy();
});

const start = location.hash.slice(1);
requestAnimationFrame(() => {
  const sec = start && document.getElementById(start);
  if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - 140, behavior: 'auto' });
  setActive(sec ? start : CATEGORIES[0].id, true);
  spy();
});

if (!reduceMotion) {
  animate('.order-hero .eyebrow, .order-hero h1, .store-card, .order-tools > *', { opacity: [0, 1], y: [14, 0] }, { duration: 0.6, ease: EASE_OUT, delay: stagger(0.05) });
  animate('.menu-cat:first-child .item', { opacity: [0, 1], y: [16, 0] }, { duration: 0.5, ease: EASE_OUT, delay: stagger(0.03, { startDelay: 0.15 }) });
}
