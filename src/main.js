import { animate, scroll, inView, stagger } from 'motion';
import { CATEGORIES, FEATURED, findItem, RESTAURANT } from './menu.js';
import { initHeader, money, imgSrc, icon, fmtTime, openStatus, esc, reduceMotion, EASE_OUT } from './shared.js';
import { t, L, getLang, onLang, initLangToggle } from './i18n.js';

/* ------------------------------------------------------------------ content */

// one line of the printed menu: name ........ price, with the translation underneath
const leader = (id) => {
  const it = findItem(id);
  const sub = getLang() === 'en' ? (it.en !== it.name ? it.en : '') : L(it.desc);
  return `
    <li>
      <button type="button" class="leader" data-add="${id}">
        <span class="leader__name">${esc(it.name)}</span>
        <span class="leader__dots" aria-hidden="true"></span>
        <span class="leader__price tnum">${money(it.price)}</span>
        ${sub ? `<span class="leader__sub">${esc(sub)}</span>` : ''}
      </button>
    </li>`;
};

// resting tilt and how far each plate turns on scroll. The soup is shot from the side, so it barely moves.
const PLATE_TILT = [-14, 9, -3];
const PLATE_SPIN = [18, 18, 3];
// on mobile, how much to blow up each photo so the plates read the same size (guatita and the soup have lots of empty margin)
const PLATE_ZOOM = [1.45, 1, 1.25];
let unbindSpin = [];

function renderPlates() {
  document.querySelector('[data-plates]').innerHTML = FEATURED.map((id, i) => {
    const it = findItem(id);
    return `
      <article class="plate ${i % 2 ? 'plate--flip' : ''}">
        <div class="plate__media" style="--tilt:${PLATE_TILT[i]}deg; --zoom:${PLATE_ZOOM[i]}">
          <img src="${imgSrc(it.img)}" alt="${esc(it.name)}" loading="lazy" data-spin="${PLATE_SPIN[i]}">
        </div>
        <div class="plate__body">
          <span class="plate__num tnum">0${i + 1}</span>
          <h3 class="plate__name">${esc(it.name)}</h3>
          ${getLang() === 'en' ? `<p class="plate__en">${esc(it.en)}</p>` : ''}
          <p class="plate__desc">${esc(L(it.desc))}</p>
          <div class="plate__foot">
            <span class="plate__price tnum">${money(it.price)}</span>
            <button type="button" class="btn btn--red btn--sm" data-add="${id}">${icon.plus} ${t('favs.add')}</button>
          </div>
        </div>
      </article>`;
  }).join('');
}

const CARTA = ['ecuador', 'sopas', 'tipicos', 'carnes', 'pollo', 'aperitivos', 'bebidas'];
let cartaActive = 'ecuador';

function renderTabs() {
  const tabs = document.querySelector('[data-tabs]');
  tabs.querySelectorAll('[role="tab"]').forEach((b) => b.remove());
  tabs.insertAdjacentHTML(
    'beforeend',
    CARTA.map((id) => {
      const c = CATEGORIES.find((x) => x.id === id);
      return `<button type="button" role="tab" id="tab-${id}" aria-controls="carta-panel" aria-selected="${id === cartaActive}" tabindex="${id === cartaActive ? 0 : -1}" data-tab="${id}">${esc(L(c.name))}</button>`;
    }).join(''),
  );
  placeTabPill(true);
}

function placeTabPill(instant) {
  const tabs = document.querySelector('[data-tabs]');
  const pill = tabs.querySelector('[data-tabs-pill]');
  const btn = tabs.querySelector(`[data-tab="${cartaActive}"]`);
  if (!btn) return;
  if (instant) pill.style.transition = 'none';
  pill.style.width = `${btn.offsetWidth}px`;
  pill.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
  pill.style.height = `${btn.offsetHeight}px`;
  if (instant) requestAnimationFrame(() => (pill.style.transition = ''));
}

function renderCarta(animateIn = false) {
  const c = CATEGORIES.find((x) => x.id === cartaActive);
  const panel = document.querySelector('[data-carta-panel]');
  panel.id = 'carta-panel';
  panel.setAttribute('aria-labelledby', `tab-${cartaActive}`);
  panel.innerHTML = `
    <div class="carta__head">
      <h3>${esc(L(c.name))}</h3>
      ${c.note ? `<p>${esc(L(c.note))}</p>` : ''}
    </div>
    <ul class="leaders leaders--cols">${c.items.map((i) => leader(i.id)).join('')}</ul>`;
  if (animateIn && !reduceMotion) {
    animate(panel.querySelectorAll('.leaders li'), { opacity: [0, 1], y: [8, 0] }, { duration: 0.3, ease: EASE_OUT, delay: stagger(0.025) });
  }
}

document.querySelector('[data-tabs]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tab]');
  if (!b || b.dataset.tab === cartaActive) return;
  selectTab(b.dataset.tab);
});
document.querySelector('[data-tabs]').addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const i = CARTA.indexOf(cartaActive);
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? CARTA.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + CARTA.length) % CARTA.length;
  selectTab(CARTA[next]);
  document.querySelector(`[data-tab="${CARTA[next]}"]`).focus();
});
function selectTab(id) {
  cartaActive = id;
  document.querySelectorAll('[data-tab]').forEach((b) => {
    const on = b.dataset.tab === id;
    b.setAttribute('aria-selected', on);
    b.tabIndex = on ? 0 : -1;
  });
  placeTabPill();
  renderCarta(true);
}
window.addEventListener('resize', () => placeTabPill(true));

function renderHours() {
  const days = t('days');
  const today = openStatus().day;
  document.querySelector('[data-hours]').innerHTML = [1, 2, 3, 4, 5, 6, 0]
    .map(
      (d) =>
        `<li class="${d === today ? 'is-today' : ''}"><span>${days[d]}${d === today ? `<em>${t('visit.today')}</em>` : ''}</span><span>${fmtTime(RESTAURANT.hours[d][0])} – ${fmtTime(RESTAURANT.hours[d][1])}</span></li>`,
    )
    .join('');
}

function renderAll() {
  document.querySelector('[data-seafood-list]').innerHTML = ['m1', 'm2', 'm4', 'm5', 'm7', 'a2'].map(leader).join('');
  document.querySelector('[data-pupusa-list]').innerHTML = ['p1', 'p2', 'p3', 'p4'].map(leader).join('');
  document.querySelector('[data-baleada-list]').innerHTML = ['p6', 'p7', 'p5'].map(leader).join('');
  renderPlates();
  renderTabs();
  renderCarta();
  renderHours();
  bindPlateSpin();
}

/* string lights above the awning */
const bulbsEl = document.querySelector('[data-bulbs]');
function renderBulbs() {
  const n = Math.max(6, Math.round(window.innerWidth / 92));
  bulbsEl.innerHTML = Array.from({ length: n }, (_, i) => `<i style="--i:${i}"></i>`).join('');
}
renderBulbs();

/* the hero fills exactly one screen: measure its natural height and shrink the title to give back any excess
   (the plate is out of the flow when stacked, and capped by height in CSS on wide screens) */
const heroEl = document.querySelector('.hero');
const heroTitle = heroEl.querySelector('.awning__title');
const svhProbe = Object.assign(document.createElement('div'), { className: 'svh-probe' });
heroEl.append(svhProbe);

function fitHero() {
  heroEl.style.removeProperty('--title-fit');
  heroEl.classList.add('is-measuring');
  const over = heroEl.offsetHeight - svhProbe.offsetHeight;
  const fs = parseFloat(getComputedStyle(heroTitle).fontSize);
  const perPx = heroTitle.offsetHeight / fs; // title height per px of font size
  if (over > 0) heroEl.style.setProperty('--title-fit', `${fs - over / perPx}px`);
  heroEl.classList.remove('is-measuring');
}
let fitQueued = 0;
const queueFit = () => { cancelAnimationFrame(fitQueued); fitQueued = requestAnimationFrame(fitHero); };

initLangToggle();
initHeader();
renderAll();
fitHero();
document.fonts.ready.then(fitHero);
window.addEventListener('resize', queueFit);
onLang(() => { renderAll(); fitHero(); });

/* ------------------------------------------------------------------ motion */
function bindPlateSpin() {
  unbindSpin.forEach((f) => f());
  unbindSpin = [];
  if (reduceMotion) return;
  // each plate turns slowly as it travels through the viewport, like it's being set down
  document.querySelectorAll('[data-spin]').forEach((img, i) => {
    const deg = Number(img.dataset.spin) * (i % 2 ? -1 : 1);
    unbindSpin.push(scroll(animate(img, { rotate: [-deg, deg] }, { ease: 'linear' }), { target: img.closest('.plate'), offset: ['start end', 'end start'] }));
  });
}

if (!reduceMotion) {
  const root = document.documentElement;
  const plate = document.querySelector('.hero__plate');
  const heroImg = document.querySelector('[data-hero-plate]');
  const bulbs = [...bulbsEl.children];

  const play = () => {
    // bulbs switch on left to right, the one first-visit flourish
    bulbs.forEach((b, i) => setTimeout(() => b.classList.add('is-lit'), 120 + i * 55));
    // em, not %: the glyphs (Yellowtail's ascenders especially) poke well outside their line box,
    // so starting at 105% of the box left their tops peeking through the mask before the rise
    animate('.awning__title .line > span', { y: ['1.6em', '0em'] }, { duration: 0.95, ease: EASE_OUT, delay: stagger(0.09) });
    animate('[data-hero-fade], .awning__band .wrap', { opacity: [0, 1], y: [12, 0] }, { duration: 0.7, ease: EASE_OUT, delay: stagger(0.06, { startDelay: 0.25 }) });
    animate(plate, { opacity: [0, 1], scale: [0.92, 1], rotate: [-40, 0] }, { duration: 1.1, ease: EASE_OUT, delay: 0.2 });
    animate('.site-header__bar', { opacity: [0, 1], y: [-10, 0] }, { duration: 0.6, ease: EASE_OUT });
    // unhide only after motion has written the first keyframes; unhiding first painted one frame
    // of the finished hero before everything snapped back to its start position
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-intro')));
  };
  const imgReady = heroImg.complete ? Promise.resolve() : heroImg.decode().catch(() => {});
  Promise.race([Promise.all([document.fonts.ready, imgReady]), new Promise((r) => setTimeout(r, 1200))]).then(() => requestAnimationFrame(play));

  // hero plate keeps turning as you scroll away from it
  scroll(animate(heroImg, { rotate: [0, 70] }, { ease: 'linear' }), { target: document.querySelector('.hero'), offset: ['start start', 'end start'] });

  // headings rise in once
  document.querySelectorAll('[data-reveal]').forEach((h) => {
    h.style.opacity = '0';
    inView(h, () => void animate(h, { opacity: [0, 1], y: [16, 0] }, { duration: 0.7, ease: EASE_OUT }), { amount: 0.4 });
  });

  // menu lines: short stagger when a list scrolls into view
  document.querySelectorAll('.seafood .leaders, .pupusas .leaders').forEach((list) => {
    inView(list, () => void animate(list.querySelectorAll('li'), { opacity: [0, 1], y: [10, 0] }, { duration: 0.5, ease: EASE_OUT, delay: stagger(0.04) }), { amount: 0.2 });
  });

  // neon sign: tubes buzz on, once
  const neon = document.querySelector('[data-neon]');
  neon.classList.add('is-off');
  inView(
    neon,
    () => {
      neon.querySelectorAll('.neon__line, .neon__turtle, .neon__phone').forEach((tube, i) => {
        setTimeout(() => {
          neon.classList.remove('is-off');
          animate(tube, { opacity: [0.08, 1, 0.25, 1, 0.6, 1] }, { duration: 0.7, times: [0, 0.1, 0.25, 0.4, 0.55, 1], ease: 'linear' });
        }, 120 + i * 140);
      });
    },
    { amount: 0.5 },
  );

  // the "$2" stamps in
  inView('.bigprice', (el) => void animate(el, { opacity: [0, 1], scale: [0.94, 1] }, { duration: 0.5, ease: EASE_OUT }), { amount: 0.6 });
} else {
  bulbsEl.querySelectorAll('i').forEach((b) => b.classList.add('is-lit'));
}

let lastW = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth === lastW) return;
  lastW = window.innerWidth;
  const lit = bulbsEl.querySelector('.is-lit');
  renderBulbs();
  if (lit || reduceMotion) bulbsEl.querySelectorAll('i').forEach((b) => b.classList.add('is-lit'));
});
