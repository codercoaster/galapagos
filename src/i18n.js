// Tiny EN/ES layer. Static copy uses data-i18n="key" (textContent) or data-i18n-html="key" (innerHTML, trusted strings only)
// and data-i18n-attr="attr:key;attr2:key2". Dynamic UI calls t('key') and L({ en, es }) and re-renders on change.

const DICT = {
  en: {
    'meta.title': 'Galápagos Restaurant · Ecuadorian & Central American food in Morristown, NJ',
    'meta.titleOrder': 'Order online · Galápagos Restaurant, Morristown NJ',
    skip: 'Skip to content',
    skipMenu: 'Skip to menu',
    'nav.menu': 'Menu',
    'nav.seafood': 'Seafood',
    'nav.pupusas': 'Pupusas',
    'nav.visit': 'Visit',
    'nav.home': 'Home',
    'cta.order': 'Order online',
    'cta.orderShort': 'Order',
    'cart.open': 'Open your order',
    'cart.yours': 'Your order',
    'lang.switch': 'Ver en español',

    'hero.kicker': 'Ecuadorian & Central American cuisine',
    'hero.l1': 'The best',
    'hero.l2': 'seafood',
    'hero.l3': 'on Speedwell.',
    'hero.lede': 'Ceviche, Galápagos-style shrimp, guatita, seco de chivo and $2 pupusas, made to order in Morristown.',
    'hero.lede2': 'Order ahead and pick it up in about 20 minutes.',
    'hero.start': 'Start your order',
    'hero.menu': 'See the menu',
    'hero.band': 'Restaurant · Pupusas · 98 Speedwell Ave',

    'neon.eyebrow': 'Lo mejor en mariscos',
    'neon.title': 'Seafood is the house specialty',
    'neon.lede': 'Snapper fried whole or steamed, tilapia catracha, ceviche and six ways with shrimp. Every plate comes with rice and tostones.',
    'neon.all': 'All seafood',

    'favs.eyebrow': 'De la casa',
    'favs.title': 'Three plates to start with',
    'favs.lede': 'Classics from Ecuador and Central America, as they come out of our kitchen.',
    'favs.add': 'Add to order',

    'pup.eyebrow': 'Pupusas salvadoreñas',
    'pup.title': 'Pupusas, made by hand',
    'pup.each': 'each',
    'pup.lede': 'Corn dough stuffed and griddled to order. Get a few of each, they go fast.',
    'pup.baleadas': 'Baleadas hondureñas',
    'pup.order': 'Order pupusas',

    'carta.eyebrow': 'La carta',
    'carta.title': 'The menu, as printed',
    'carta.lede': 'Pick a section. Everything here can be ordered online for pickup.',
    'carta.full': 'Full menu & ordering',
    'carta.tabs': 'Menu sections',

    'visit.eyebrow': 'Visítenos',
    'visit.title': 'Under the red awning',
    'visit.lede': 'A few blocks up Speedwell Ave from the Morristown Green. Dine in, take out or order ahead.',
    'visit.directions': 'Get directions',
    'visit.hours': 'Hours',
    'visit.today': 'Today',
    'visit.photo': 'Galápagos Restaurant storefront on Speedwell Ave, with its red and yellow awning and neon window signs',
    'visit.map': 'Map to Galápagos Restaurant',

    'footer.blurb': 'Ecuadorian and Central American cooking on Speedwell Ave, Morristown.',
    'footer.eat': 'Eat',
    'footer.visit': 'Visit',
    'footer.legal': 'Consuming raw or undercooked meats, seafood or eggs may increase your risk of foodborne illness.',
    'footer.prices': 'Prices and availability subject to change.',
    'footer.made': 'Made by',

    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'status.open': 'Open now · until {t}',
    'status.closedToday': 'Closed · opens {t} today',
    'status.closedTomorrow': 'Closed · opens {t} tomorrow',

    'order.eyebrow': 'Order online · pickup & curbside',
    'order.title': 'Order for pickup',
    'order.ready': 'Ready in',
    'order.search': 'Search the menu',
    'order.searchPh': 'Search ceviche, pupusas, churrasco…',
    'order.type': 'Order type',
    'order.pickup': 'Pickup',
    'order.curbside': 'Curbside',
    'order.cats': 'Menu categories',
    'order.summary': 'Order summary',
    'order.empty': 'Your bag is empty.<br>Pick something delicious.',
    'order.subtotal': 'Subtotal',
    'order.review': 'Review & checkout',
    'order.noMatch': 'No matches',
    'order.noMatchHint': 'Try “ceviche”, “pupusa” or “camarones”.',
    'order.items': '{n} items · View order',
    'order.items1': '1 item · View order',
    'order.inOrder': '{n} in your order',

    'tag.house': 'House favorite',
    'tag.spicy': 'Spicy',
    'tag.veg': 'Veggie',

    'sheet.close': 'Close',
    'sheet.qty': 'Quantity',
    'sheet.dec': 'Decrease quantity',
    'sheet.inc': 'Increase quantity',
    'sheet.add': 'Add to order',
    'sheet.required': 'Required',
    'sheet.optional': 'Optional',
    'sheet.selected': 'Selected',
    'sheet.notes': 'Special instructions',
    'sheet.notesPh': 'No onions, sauce on the side…',
    'toast.added': '{name} added',
    'toast.view': 'View order',

    'drawer.back': 'Back to your order',
    'drawer.checkout': 'Checkout',
    'drawer.placed': 'Order placed',
    'drawer.emptyTitle': 'Nothing here yet',
    'drawer.emptyText': 'Ceviche, a churrasco, a few pupusas… your table is waiting.',
    'drawer.browse': 'Browse the menu',
    'drawer.remove': 'Remove',
    'drawer.dec': 'Decrease',
    'drawer.inc': 'Increase',
    'drawer.upsell': 'Goes great with',
    'drawer.tax': 'Tax',
    'drawer.tip': 'Tip',
    'drawer.total': 'Total',

    'co.when': 'Pickup time',
    'co.asap': 'As soon as possible',
    'co.asapSub': 'Ready in about 20 minutes',
    'co.later': 'Schedule for later',
    'co.laterSub': 'Pick a time that works',
    'co.today': 'Today',
    'co.tomorrow': 'Tomorrow',
    'co.details': 'Your details',
    'co.first': 'First name',
    'co.last': 'Last name',
    'co.phone': 'Mobile number',
    'co.email': 'Email for your receipt',
    'co.car': 'Car make & color',
    'co.carPh': 'Red Honda Civic',
    'co.tipTitle': 'Add a tip',
    'co.noTip': 'No tip',
    'co.tipNote': '100% of tips go to our kitchen and front-of-house team.',
    'co.payment': 'Payment',
    'co.payCard': 'Pay now with card',
    'co.payCardSub': 'Skip the line at the register',
    'co.payStore': 'Pay at pickup',
    'co.payStoreSub': 'Cash or card in the restaurant',
    'co.cc': 'Card number',
    'co.exp': 'Expiry',
    'co.cvc': 'CVC',
    'co.secure': 'Payments are encrypted and processed securely.',
    'co.place': 'Place order',
    'co.placing': 'Placing order…',
    'err.first': 'Please add your first name',
    'err.last': 'Please add your last name',
    'err.phone': 'We’ll text you when it’s ready',
    'err.email': 'Enter a valid email',
    'err.car': 'So we can find you',
    'err.cc': 'Check your card number',
    'err.cvc': '3–4 digits',

    'done.thanks': '¡Gracias, {name}!',
    'done.title': 'We’re on it.',
    'done.lede': 'We sent a confirmation to <strong>{email}</strong> and we’ll text <strong>{phone}</strong> the moment your order is ready.',
    'done.progress': 'Order progress',
    'done.received': 'Received',
    'done.kitchen': 'In the kitchen',
    'done.ready': 'Ready',
    'done.order': 'Order',
    'done.where': 'Where',
    'done.item': 'item',
    'done.items': 'items',
    'done.paid': 'paid',
    'done.payAtPickup': 'pay at pickup',
    'done.curbNote': 'Park out front on Speedwell Ave and reply “here” to our text. We’ll bring it right out.',
    'done.done': 'Done',
  },
  es: {
    'meta.title': 'Galápagos Restaurant · Comida ecuatoriana y centroamericana en Morristown, NJ',
    'meta.titleOrder': 'Ordene en línea · Galápagos Restaurant, Morristown NJ',
    skip: 'Ir al contenido',
    skipMenu: 'Ir al menú',
    'nav.menu': 'Menú',
    'nav.seafood': 'Mariscos',
    'nav.pupusas': 'Pupusas',
    'nav.visit': 'Visítenos',
    'nav.home': 'Inicio',
    'cta.order': 'Ordenar en línea',
    'cta.orderShort': 'Ordenar',
    'cart.open': 'Ver su orden',
    'cart.yours': 'Su orden',
    'lang.switch': 'View in English',

    'hero.kicker': 'Comida ecuatoriana y centroamericana',
    'hero.l1': 'Lo mejor',
    'hero.l2': 'en mariscos',
    'hero.l3': 'de Speedwell.',
    'hero.lede': 'Ceviche, camarones estilo Galápagos, guatita, seco de chivo y pupusas a $2, hechos al momento en Morristown.',
    'hero.lede2': 'Ordene por adelantado y recójalo en unos 20 minutos.',
    'hero.start': 'Empezar mi orden',
    'hero.menu': 'Ver el menú',
    'hero.band': 'Restaurant · Pupusas · 98 Speedwell Ave',

    'neon.eyebrow': 'Lo mejor en mariscos',
    'neon.title': 'Los mariscos son la especialidad',
    'neon.lede': 'Pargo frito o sudado, tilapia catracha, ceviche y camarones de seis maneras. Todos los platos vienen con arroz y tostones.',
    'neon.all': 'Todos los mariscos',

    'favs.eyebrow': 'De la casa',
    'favs.title': 'Tres platos para empezar',
    'favs.lede': 'Clásicos de Ecuador y Centroamérica, tal como salen de nuestra cocina.',
    'favs.add': 'Agregar a la orden',

    'pup.eyebrow': 'Pupusas salvadoreñas',
    'pup.title': 'Pupusas hechas a mano',
    'pup.each': 'c/u',
    'pup.lede': 'Masa de maíz rellena y hecha a la plancha al momento. Pida varias de cada una, se acaban rápido.',
    'pup.baleadas': 'Baleadas hondureñas',
    'pup.order': 'Ordenar pupusas',

    'carta.eyebrow': 'La carta',
    'carta.title': 'El menú, tal como está impreso',
    'carta.lede': 'Elija una sección. Todo se puede ordenar en línea para recoger.',
    'carta.full': 'Menú completo y órdenes',
    'carta.tabs': 'Secciones del menú',

    'visit.eyebrow': 'Visítenos',
    'visit.title': 'Bajo el toldo rojo',
    'visit.lede': 'En Speedwell Ave, a pocas cuadras del Morristown Green. Coma aquí, pida para llevar u ordene por adelantado.',
    'visit.directions': 'Cómo llegar',
    'visit.hours': 'Horario',
    'visit.today': 'Hoy',
    'visit.photo': 'Fachada de Galápagos Restaurant en Speedwell Ave, con su toldo rojo y amarillo y letreros de neón',
    'visit.map': 'Mapa a Galápagos Restaurant',

    'footer.blurb': 'Cocina ecuatoriana y centroamericana en Speedwell Ave, Morristown.',
    'footer.eat': 'Comer',
    'footer.visit': 'Visitar',
    'footer.legal': 'Consumir carnes, mariscos o huevos crudos o poco cocidos puede aumentar el riesgo de enfermedades transmitidas por alimentos.',
    'footer.prices': 'Precios y disponibilidad sujetos a cambios.',
    'footer.made': 'Hecho por',

    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    'status.open': 'Abierto · hasta las {t}',
    'status.closedToday': 'Cerrado · abre hoy a las {t}',
    'status.closedTomorrow': 'Cerrado · abre mañana a las {t}',

    'order.eyebrow': 'Ordene en línea · para recoger',
    'order.title': 'Ordene para recoger',
    'order.ready': 'Lista en',
    'order.search': 'Buscar en el menú',
    'order.searchPh': 'Busque ceviche, pupusas, churrasco…',
    'order.type': 'Tipo de orden',
    'order.pickup': 'Recoger',
    'order.curbside': 'En el auto',
    'order.cats': 'Categorías del menú',
    'order.summary': 'Resumen de la orden',
    'order.empty': 'Su orden está vacía.<br>Elija algo rico.',
    'order.subtotal': 'Subtotal',
    'order.review': 'Revisar y pagar',
    'order.noMatch': 'Sin resultados',
    'order.noMatchHint': 'Pruebe “ceviche”, “pupusa” o “camarones”.',
    'order.items': '{n} productos · Ver orden',
    'order.items1': '1 producto · Ver orden',
    'order.inOrder': '{n} en su orden',

    'tag.house': 'De la casa',
    'tag.spicy': 'Picante',
    'tag.veg': 'Vegetariano',

    'sheet.close': 'Cerrar',
    'sheet.qty': 'Cantidad',
    'sheet.dec': 'Menos',
    'sheet.inc': 'Más',
    'sheet.add': 'Agregar',
    'sheet.required': 'Obligatorio',
    'sheet.optional': 'Opcional',
    'sheet.selected': 'Listo',
    'sheet.notes': 'Instrucciones especiales',
    'sheet.notesPh': 'Sin cebolla, salsa aparte…',
    'toast.added': '{name} agregado',
    'toast.view': 'Ver orden',

    'drawer.back': 'Volver a su orden',
    'drawer.checkout': 'Pagar',
    'drawer.placed': 'Orden enviada',
    'drawer.emptyTitle': 'Todavía nada',
    'drawer.emptyText': 'Un ceviche, un churrasco, unas pupusas… su mesa le espera.',
    'drawer.browse': 'Ver el menú',
    'drawer.remove': 'Quitar',
    'drawer.dec': 'Menos',
    'drawer.inc': 'Más',
    'drawer.upsell': 'Para acompañar',
    'drawer.tax': 'Impuesto',
    'drawer.tip': 'Propina',
    'drawer.total': 'Total',

    'co.when': 'Hora de recogida',
    'co.asap': 'Lo antes posible',
    'co.asapSub': 'Lista en unos 20 minutos',
    'co.later': 'Programar para más tarde',
    'co.laterSub': 'Elija la hora que le convenga',
    'co.today': 'Hoy',
    'co.tomorrow': 'Mañana',
    'co.details': 'Sus datos',
    'co.first': 'Nombre',
    'co.last': 'Apellido',
    'co.phone': 'Celular',
    'co.email': 'Email para el recibo',
    'co.car': 'Marca y color del auto',
    'co.carPh': 'Honda Civic rojo',
    'co.tipTitle': 'Propina',
    'co.noTip': 'Sin propina',
    'co.tipNote': 'El 100% de la propina es para nuestro equipo de cocina y salón.',
    'co.payment': 'Pago',
    'co.payCard': 'Pagar ahora con tarjeta',
    'co.payCardSub': 'Evite la fila en la caja',
    'co.payStore': 'Pagar al recoger',
    'co.payStoreSub': 'Efectivo o tarjeta en el restaurante',
    'co.cc': 'Número de tarjeta',
    'co.exp': 'Vencimiento',
    'co.cvc': 'CVC',
    'co.secure': 'Los pagos se cifran y procesan de forma segura.',
    'co.place': 'Enviar orden',
    'co.placing': 'Enviando…',
    'err.first': 'Agregue su nombre',
    'err.last': 'Agregue su apellido',
    'err.phone': 'Le avisamos por texto cuando esté lista',
    'err.email': 'Ingrese un email válido',
    'err.car': 'Para poder encontrarle',
    'err.cc': 'Revise el número de tarjeta',
    'err.cvc': '3–4 dígitos',

    'done.thanks': '¡Gracias, {name}!',
    'done.title': 'Ya la estamos preparando.',
    'done.lede': 'Enviamos la confirmación a <strong>{email}</strong> y le escribiremos al <strong>{phone}</strong> cuando su orden esté lista.',
    'done.progress': 'Estado de la orden',
    'done.received': 'Recibida',
    'done.kitchen': 'En la cocina',
    'done.ready': 'Lista',
    'done.order': 'Orden',
    'done.where': 'Dónde',
    'done.item': 'producto',
    'done.items': 'productos',
    'done.paid': 'pagada',
    'done.payAtPickup': 'paga al recoger',
    'done.curbNote': 'Estacione al frente en Speedwell Ave y responda “aquí” a nuestro mensaje. Se la llevamos al auto.',
    'done.done': 'Listo',
  },
};

const KEY = 'galapagos.lang';
// language forced by the URL: ?lang=es, ?lang=en (also ES, es-MX…) or just ?es / ?en
const urlLang = () => {
  const p = new URLSearchParams(location.search);
  const q = (p.get('lang') || '').toLowerCase().slice(0, 2);
  if (q === 'en' || q === 'es') return q;
  return p.has('es') ? 'es' : p.has('en') ? 'en' : null;
};

const initial = () => {
  // the URL wins (handy for sharing a link in either language)
  const q = urlLang();
  if (q) {
    try {
      localStorage.setItem(KEY, q);
    } catch {
      /* storage unavailable */
    }
    return q;
  }
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'es') return saved;
  } catch {
    /* storage unavailable */
  }
  return (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
};

let lang = initial();
const listeners = new Set();

export const getLang = () => lang;

export function t(key, vars) {
  let s = DICT[lang][key] ?? DICT.en[key] ?? key;
  if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  return s;
}

// localized value: plain strings pass through, { en, es } objects pick the current language
export const L = (v) => (v && typeof v === 'object' ? v[lang] ?? v.en : v ?? '');

export function applyStatic(root = document) {
  document.documentElement.lang = lang;
  root.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  root.querySelectorAll('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr.trim(), t(key.trim()));
    });
  });
  root.querySelectorAll('[data-lang-toggle]').forEach((b) => {
    b.querySelectorAll('[data-lang]').forEach((s) => s.classList.toggle('is-active', s.dataset.lang === lang));
    b.setAttribute('aria-label', t('lang.switch'));
  });
  const title = document.querySelector('title[data-i18n-title]');
  if (title) document.title = t(title.dataset.i18nTitle);
  document.documentElement.classList.remove('i18n-pending');
}

export function setLang(next) {
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* storage unavailable */
  }
  // keep a language param in the URL in sync so a reload doesn't flip back
  if (urlLang()) {
    const u = new URL(location.href);
    u.searchParams.delete('es');
    u.searchParams.delete('en');
    u.searchParams.set('lang', lang);
    history.replaceState(history.state, '', u);
  }
  applyStatic();
  listeners.forEach((fn) => fn(lang));
}

export const onLang = (fn) => listeners.add(fn);

export function initLangToggle() {
  document.querySelectorAll('[data-lang-toggle]').forEach((b) => b.addEventListener('click', () => setLang(lang === 'en' ? 'es' : 'en')));
  applyStatic();
}
