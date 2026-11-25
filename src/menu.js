// Galápagos Restaurant menu, transcribed from the printed menu at 98 Speedwell Ave.
// `name` is the dish name as printed (Spanish). `en` is its English name.
// `desc` holds the sides / ingredients in both languages.

export const OPTION_GROUPS = {
  sopaSide: {
    title: { en: 'Comes with', es: 'Acompañado de' },
    required: true,
    type: 'single',
    choices: [{ label: { en: 'Rice', es: 'Arroz' } }, { label: { en: 'Corn tortillas', es: 'Tortillas de maíz' } }],
  },
  filete: {
    title: { en: 'How would you like it?', es: '¿Cómo lo prefiere?' },
    required: true,
    type: 'single',
    choices: [{ label: { en: 'Breaded', es: 'Empanizado' } }, { label: { en: 'Fried', es: 'Frito' } }],
  },
  batido: {
    title: { en: 'Fruit', es: 'Fruta' },
    required: true,
    type: 'single',
    choices: [
      { label: 'Papaya' },
      { label: 'Banana' },
      { label: { en: 'Maracuyá (passion fruit)', es: 'Maracuyá' } },
      { label: { en: 'Fresa (strawberry)', es: 'Fresa' } },
      { label: 'Mango' },
      { label: { en: 'Mora (blackberry)', es: 'Mora' } },
      { label: { en: 'Guanábana (soursop)', es: 'Guanábana' } },
    ],
  },
  soda: {
    title: { en: 'Drink', es: 'Bebida' },
    required: true,
    type: 'single',
    choices: [
      { label: 'Coca-Cola' },
      { label: 'Sprite' },
      { label: 'Fanta' },
      { label: 'Tropical' },
      { label: { en: 'Grape', es: 'Uva' } },
      { label: { en: 'Apple', es: 'Manzana' } },
      { label: 'Snapple' },
      { label: 'Iced tea' },
    ],
  },
  energy: {
    title: { en: 'Drink', es: 'Bebida' },
    required: true,
    type: 'single',
    choices: [{ label: 'Red Bull' }, { label: 'Monster' }],
  },
  extras: {
    title: { en: 'Add a side', es: 'Agregue un acompañante' },
    type: 'multi',
    choices: [
      { label: { en: 'Tostones', es: 'Tostones' }, price: 3 },
      { label: { en: 'Maduro (sweet plantain)', es: 'Plátano maduro' }, price: 3 },
      { label: { en: 'Avocado salad', es: 'Ensalada de aguacate' }, price: 8 },
    ],
  },
};

const sidesPollo = { en: 'With rice, salad & french fries.', es: 'Arroz, ensalada y papas fritas.' };
const sidesMar = { en: 'With rice, salad & fried green plantain.', es: 'Arroz, ensalada y tostones.' };
const sidesMar2 = { en: 'With rice & fried green plantain.', es: 'Arroz y tostones.' };
const sidesCarne = { en: 'With rice, french fries, salad & beans.', es: 'Arroz, papas fritas, ensalada y frijoles.' };

export const CATEGORIES = [
  {
    id: 'ecuador',
    name: { en: 'Ecuadorian food', es: 'Comida ecuatoriana' },
    items: [
      { id: 'e1', name: 'Churrasco', en: 'Beef steak', price: 13.95, desc: { en: 'With rice, french fries, egg, salad & avocado.', es: 'Arroz, papas fritas, huevo, ensalada y aguacate.' }, options: ['extras'] },
      { id: 'e2', name: 'Guatita', en: 'Tripe stew', price: 11.95, desc: { en: 'With rice, salad, avocado & fried ripe plantain.', es: 'Arroz, ensalada, aguacate y maduro.' }, img: 'guatita', tags: ['house'] },
      { id: 'e3', name: 'Seco de chivo', en: 'Goat stew', price: 11.95, desc: { en: 'With rice, salad, avocado & fried ripe plantain.', es: 'Arroz, ensalada, aguacate y maduro.' } },
      { id: 'e4', name: 'Bandera', en: 'The flag plate', price: 13.95, desc: { en: 'A bit of everything: chicken, tripe stew, goat, rice & salad.', es: 'Pollo, guatita, chivo, arroz y ensalada.' } },
      { id: 'e5', name: 'Mote pillo', en: 'Hominy with eggs', price: 11.95, desc: { en: 'Grilled steak, hominy scrambled with eggs & chimol.', es: 'Carne asada, mote con huevo y chimol.' } },
      { id: 'e6', name: 'Chaulafán', en: 'Ecuadorian fried rice', price: 11.95, desc: { en: 'Rice tossed with chicken, pork, egg, shrimp & vegetables.', es: 'Arroz mixto con pollo, chancho, huevo, camarones y vegetales.' } },
      { id: 'e7', name: 'Arroz marinero', en: 'Seafood rice', price: 12.95, desc: { en: 'Rice tossed with seafood & vegetables.', es: 'Arroz mixto con vegetales y mariscos.' } },
    ],
  },
  {
    id: 'mariscos',
    name: { en: 'Seafood', es: 'Mariscos' },
    items: [
      { id: 'm1', name: 'Camarones estilo Galápagos', en: 'Galápagos-style shrimp', price: 13.95, desc: sidesMar, tags: ['house'] },
      { id: 'm2', name: 'Camarones al ajillo', en: 'Garlic shrimp', price: 13.95, desc: sidesMar },
      { id: 'm3', name: 'Combinación de mariscos', en: 'Seafood combo', price: 15.95, desc: sidesMar2 },
      { id: 'm4', name: 'Pargo frito', en: 'Fried snapper', price: 14.95, desc: sidesMar },
      { id: 'm5', name: 'Pargo sudado', en: 'Steamed snapper', price: 14.95, desc: sidesMar2 },
      { id: 'm6', name: 'Tilapia roja frita', en: 'Fried red tilapia', price: 14.95, desc: sidesMar },
      { id: 'm7', name: 'Tilapia catracha', en: 'Honduran-style tilapia', price: 12.0, desc: sidesMar },
      { id: 'm8', name: 'Corvina a la francesa', en: 'French-style corvina', price: 13.95, desc: sidesMar },
      { id: 'm9', name: 'Filete empanizado o frito', en: 'Breaded or fried fish fillet', price: 12.95, desc: sidesMar, options: ['filete'] },
      { id: 'm10', name: 'Camarones apanados', en: 'Breaded shrimp', price: 13.95, desc: sidesMar },
      { id: 'm11', name: 'Camarones enchilados', en: 'Chili shrimp', price: 13.95, desc: sidesMar, tags: ['spicy'] },
      { id: 'm12', name: 'Camarones a la francesa', en: 'French-style shrimp', price: 13.95, desc: sidesMar },
      { id: 'm13', name: 'Arroz con camarones', en: 'Shrimp & rice', price: 12.95, desc: { en: 'Rice tossed with shrimp & vegetables.', es: 'Arroz mixto con vegetales y camarones.' } },
    ],
  },
  {
    id: 'aperitivos',
    name: { en: 'Appetizers', es: 'Aperitivos' },
    items: [
      { id: 'a1', name: 'Ceviche de camarones', en: 'Shrimp ceviche', price: 9.95, desc: null },
      { id: 'a2', name: 'Ceviche mixto', en: 'Mixed seafood ceviche', price: 15.95, desc: null },
      { id: 'a3', name: 'Camarones empanizados', en: 'Breaded shrimp', price: 9.95, desc: { en: 'Just the shrimp, no sides.', es: 'Solo camarones.' } },
      { id: 'a4', name: 'Tacos de pollo', en: 'Chicken tacos', price: 7.0, desc: null },
      { id: 'a5', name: 'Yuca con chicharrón', en: 'Cassava with fried pork', price: 8.0, desc: null },
    ],
  },
  {
    id: 'pupusas',
    name: { en: 'Pupusas & baleadas', es: 'Pupusas y baleadas' },
    note: { en: 'Salvadoran stuffed corn tortillas and Honduran wrapped flour tortillas.', es: 'Pupusas salvadoreñas y baleadas hondureñas.' },
    items: [
      { id: 'p1', name: 'Pupusa mixta', en: 'Pork & cheese pupusa', price: 2.0, desc: { en: 'Chicharrón and cheese.', es: 'Chicharrón con queso.' } },
      { id: 'p2', name: 'Pupusa de queso', en: 'Cheese pupusa', price: 2.0, desc: { en: 'Just cheese.', es: 'Solo queso.' }, tags: ['veg'] },
      { id: 'p3', name: 'Pupusa de frijol con queso', en: 'Bean & cheese pupusa', price: 2.0, desc: { en: 'Beans and cheese.', es: 'Frijol con queso.' }, tags: ['veg'] },
      { id: 'p4', name: 'Pupusa de loroco con queso', en: 'Loroco & cheese pupusa', price: 2.0, desc: { en: 'Loroco vine flower bud and cheese.', es: 'Flor de loroco con queso.' }, tags: ['veg'] },
      { id: 'p5', name: 'Orden de chicharrón', en: 'Order of fried pork', price: 7.0, desc: null },
      { id: 'p6', name: 'Baleada regular', en: 'Baleada', price: 3.0, desc: { en: 'Flour tortilla with beans, cream & cheese.', es: 'Frijoles, crema y queso.' }, tags: ['veg'] },
      { id: 'p7', name: 'Baleada con todo', en: 'Loaded baleada', price: 5.0, desc: { en: 'Beans, cream, cheese, meat & avocado.', es: 'Frijoles, crema, queso, carne y aguacate.' } },
    ],
  },
  {
    id: 'tipicos',
    name: { en: 'Traditional plates', es: 'Platos típicos' },
    note: { en: 'Every típico comes with rice, beans, cream, cheese, avocado, egg, fried ripe plantain & tortillas.', es: 'Todos vienen con arroz, frijoles, crema, queso, aguacate, huevo, maduro y tortillas.' },
    items: [
      { id: 't1', name: 'Típico mixto', en: 'Mixed traditional plate', price: 15.95, desc: { en: 'Chicken, beef & fried pork.', es: 'Pollo, carne y chicharrón.' } },
      { id: 't2', name: 'Típico con carne', en: 'Traditional plate with beef', price: 11.95, desc: { en: 'Crispy beef with all the fixings.', es: 'Carne con todo el acompañamiento.' }, img: 'tipico', tags: ['house'] },
      { id: 't3', name: 'Típico con pollo', en: 'Traditional plate with chicken', price: 11.95, desc: { en: 'Chicken with all the fixings.', es: 'Pollo con todo el acompañamiento.' } },
      { id: 't4', name: 'Típico con chicharrón', en: 'Traditional plate with fried pork', price: 11.95, desc: { en: 'Fried pork with all the fixings.', es: 'Chicharrón con todo el acompañamiento.' } },
    ],
  },
  {
    id: 'sopas',
    name: { en: 'Soups', es: 'Sopas' },
    note: { en: 'With your choice of rice or corn tortillas.', es: 'Con opción de arroz o tortillas de maíz.' },
    items: [
      { id: 's1', name: 'Sopa de gallina india', en: 'Cornish hen soup', price: 8.95, desc: { en: 'Slow-simmered hen with corn, yuca and vegetables.', es: 'Gallina con mazorca, yuca y vegetales.' }, options: ['sopaSide'], img: 'sopa-gallina', tags: ['house'] },
      { id: 's2', name: 'Sopa de costilla de res', en: 'Beef rib soup', price: 8.95, desc: null, options: ['sopaSide'] },
      { id: 's3', name: 'Sopa de cola de res', en: 'Oxtail soup', price: 8.95, desc: null, options: ['sopaSide'] },
      { id: 's4', name: 'Sopa de pata de res', en: 'Cow foot soup', price: 8.95, desc: null, options: ['sopaSide'] },
      { id: 's5', name: 'Sopa de vegetales', en: 'Vegetable soup', price: 8.95, desc: null, options: ['sopaSide'], tags: ['veg'] },
      { id: 's6', name: 'Sopa de pollo', en: 'Chicken soup', price: 8.95, desc: null, options: ['sopaSide'] },
      { id: 's7', name: 'Sopa de mariscos', en: 'Seafood soup', price: 12.95, desc: null, options: ['sopaSide'] },
    ],
  },
  {
    id: 'carnes',
    name: { en: 'Meats', es: 'Carnes' },
    items: [
      { id: 'c1', name: 'Parrillada', en: 'Mixed grill', price: 13.95, desc: { en: 'Beef, chicken, pork chop, sausage, rice & salad.', es: 'Arroz, carne, pollo, chuleta, salchicha y ensalada.' } },
      { id: 'c2', name: 'Picada mixta', en: 'Mixed picada', price: 20.0, desc: { en: 'Chicken, beef & fried pork to share.', es: 'Pollo, carne y chicharrón.' } },
      { id: 'c3', name: 'Carne asada', en: 'Grilled steak', price: 11.95, desc: { en: 'With rice, beans, salad & chimol.', es: 'Arroz, frijoles, ensalada y chimol.' } },
      { id: 'c4', name: 'Chuleta a la parrilla', en: 'Grilled pork chops', price: 11.95, desc: sidesCarne },
      { id: 'c5', name: 'Bistec a la criolla', en: 'Creole-style steak', price: 11.95, desc: sidesCarne },
    ],
  },
  {
    id: 'pollo',
    name: { en: 'Chicken', es: 'Pollo' },
    items: [
      { id: 'po1', name: 'Pollo estilo Galápagos', en: 'Galápagos-style chicken', price: 10.95, desc: sidesPollo, tags: ['house'] },
      { id: 'po2', name: 'Pollo al limón', en: 'Lemon chicken', price: 10.95, desc: sidesPollo },
      { id: 'po3', name: 'Pollo a la parrilla', en: 'Grilled chicken', price: 9.95, desc: sidesPollo },
      { id: 'po4', name: 'Pollo frito', en: 'Fried chicken', price: 9.95, desc: sidesPollo },
      { id: 'po5', name: 'Pollo apanado', en: 'Breaded chicken', price: 9.95, desc: sidesPollo },
      { id: 'po6', name: 'Pollo con tajadas', en: 'Fried chicken with tajadas', price: 9.95, desc: { en: 'Fried chicken with fried green banana slices.', es: 'Pollo frito con tajadas.' } },
      { id: 'po7', name: 'Pollo salteado', en: 'Sautéed chicken', price: 10.95, desc: sidesPollo },
      { id: 'po8', name: 'Arroz con pollo', en: 'Chicken & rice', price: 9.95, desc: { en: 'Rice tossed with chicken & vegetables.', es: 'Arroz mixto con pollo y vegetales.' } },
    ],
  },
  {
    id: 'ensaladas',
    name: { en: 'Salads', es: 'Ensaladas' },
    items: [
      { id: 'en1', name: 'Ensalada de pollo', en: 'Chicken salad', price: 8.0, desc: null },
      { id: 'en2', name: 'Ensalada de aguacate', en: 'Avocado salad', price: 8.0, desc: null, tags: ['veg'] },
      { id: 'en3', name: 'Ensalada de aguacate y pollo', en: 'Avocado & chicken salad', price: 10.0, desc: null },
    ],
  },
  {
    id: 'ninos',
    name: { en: 'Kids menu', es: 'Menú infantil' },
    items: [
      { id: 'k1', name: 'Salchipapas', en: 'Fries with sausage', price: 7.0, desc: { en: 'French fries topped with sliced sausage.', es: 'Papas fritas con salchichas.' } },
      { id: 'k2', name: 'Papas fritas con mozzarella', en: 'Fries with mozzarella', price: 3.0, desc: null, tags: ['veg'] },
      { id: 'k3', name: 'Chicken fingers con papas', en: 'Chicken fingers & fries', price: 7.0, desc: null },
      { id: 'k4', name: 'Alitas con papas fritas', en: 'Chicken wings & fries', price: 8.0, desc: null },
    ],
  },
  {
    id: 'ordenes',
    name: { en: 'Sides', es: 'Órdenes' },
    items: [
      { id: 'o1', name: 'Arroz', en: 'Rice', price: 3.0, desc: null },
      { id: 'o2', name: 'Frijoles', en: 'Beans', price: 3.0, desc: null },
      { id: 'o3', name: 'Tostones', en: 'Fried green plantain', price: 3.0, desc: null },
      { id: 'o4', name: 'Plátano frito', en: 'Fried ripe plantain', price: 3.0, desc: null },
      { id: 'o5', name: 'Tajadas', en: 'Fried green banana slices', price: 3.0, desc: null },
      { id: 'o6', name: 'Crema', en: 'Cream', price: 3.0, desc: null },
      { id: 'o7', name: 'Tortillas (3)', en: 'Three corn tortillas', price: 1.0, desc: null },
    ],
  },
  {
    id: 'bebidas',
    name: { en: 'Drinks', es: 'Bebidas' },
    items: [
      { id: 'b1', name: 'Horchata', en: 'Horchata', price: 2.5, desc: { en: 'Natural drink.', es: 'Bebida natural.' } },
      { id: 'b2', name: 'Tamarindo', en: 'Tamarind', price: 2.5, desc: { en: 'Natural drink.', es: 'Bebida natural.' } },
      { id: 'b3', name: 'Piña', en: 'Pineapple', price: 2.5, desc: { en: 'Natural drink.', es: 'Bebida natural.' } },
      { id: 'b4', name: 'Melón', en: 'Cantaloupe', price: 2.5, desc: { en: 'Natural drink.', es: 'Bebida natural.' } },
      { id: 'b5', name: 'Batido en leche', en: 'Fruit milkshake', price: 3.0, desc: { en: 'Papaya, banana, passion fruit, strawberry, mango, blackberry or soursop.', es: 'Papaya, banana, maracuyá, fresa, mango, mora o guanábana.' }, options: ['batido'] },
      { id: 'b6', name: 'Café', en: 'Coffee', price: 1.25, desc: null },
      { id: 'b7', name: 'Chocolate', en: 'Hot chocolate', price: 2.0, desc: null },
      { id: 'b8', name: 'Té', en: 'Tea', price: 2.0, desc: null },
      { id: 'b9', name: 'Osmil', en: 'Osmil', price: 2.0, desc: null },
      // Cold drink prices aren't printed on the menu; placeholder until confirmed with the restaurant.
      { id: 'b10', name: 'Refresco', en: 'Soda', price: 2.0, desc: null, options: ['soda'] },
      { id: 'b11', name: 'Bebida energética', en: 'Energy drink', price: 3.5, desc: null, options: ['energy'] },
    ],
  },
];

export const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items.map((i) => ({ ...i, category: c.id })));
export const findItem = (id) => ALL_ITEMS.find((i) => i.id === id);

// the three plates we have photos of
export const FEATURED = ['e2', 't2', 's1'];
export const UPSELLS = ['p1', 'p2', 'b1', 'o3', 'o4', 'b5'];

export const RESTAURANT = {
  name: 'Galápagos Restaurant',
  address: '98 Speedwell Ave',
  city: 'Morristown, NJ 07960',
  phone: '(973) 285-1224',
  phoneHref: 'tel:+19732851224',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Galapagos+Restaurant+98+Speedwell+Ave+Morristown+NJ+07960',
  timeZone: 'America/New_York',
  taxRate: 0.06625,
  // 0 = Sunday. [open, close] in minutes after midnight, America/New_York.
  // From the sign on the front door.
  hours: [
    [600, 1260], // Sun 10:00 am – 9:00 pm
    [630, 1320], // Mon 10:30 am – 10:00 pm
    [630, 1320],
    [630, 1320],
    [630, 1320], // Thu
    [630, 1410], // Fri 10:30 am – 11:30 pm
    [630, 1410], // Sat
  ],
};
