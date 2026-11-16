export interface BikeSpecs {
  motor: string;
  battery: string;
  torque: string;
  topSpeed: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'Small Electric Cross Motorbike' | 'Mini Surron';
  price: number;
  featured: boolean;
  defaultImage: string;
  specs: BikeSpecs;
  description: string;
}

export const HERO_DEFAULT_IMAGE = '/src/assets/images/hero_surron_wheelie_1794856158811.jpg';
export const HERO_GIF_STORAGE_KEY = 'surron4you_hero_gif';
export const PRODUCT_IMG_STORAGE_PREFIX = 'surron4you_img_';

export const PRODUCTS: Product[] = [
  {
    id: 'black-purple',
    name: 'Electric Dirt Bike – Black / Purple',
    type: 'Small Electric Cross Motorbike',
    price: 1000,
    featured: false,
    defaultImage: '/src/assets/images/bike_black_purple_1794856159174.jpg',
    specs: {
      motor: '3000W',
      battery: '48V Battery',
      torque: '200 Nm Max Torque',
      topSpeed: '50 km/h',
    },
    description:
      'Small electric cross motorbike in matte black with an anodized purple rear shock. Powered by a 3000W motor, 48V battery, 200 Nm max torque, and 50 km/h top speed.',
  },
  {
    id: 'rogue-black',
    name: 'Rogue 01 – All Black',
    type: 'Small Electric Cross Motorbike',
    price: 1000,
    featured: false,
    defaultImage: '/src/assets/images/bike_rogue_black_1794856160494.jpg',
    specs: {
      motor: '3000W',
      battery: '48V Battery',
      torque: '200 Nm Max Torque',
      topSpeed: '50 km/h',
    },
    description:
      'Full-black Rogue 01 small electric cross motorbike with signature 01 number plate and horizontal LED light bar. 3000W motor, 48V battery, 200 Nm max torque, and 50 km/h top speed.',
  },
  {
    id: 'rogue-white',
    name: 'Rogue 01 – White / Black',
    type: 'Small Electric Cross Motorbike',
    price: 1000,
    featured: false,
    defaultImage: '/src/assets/images/bike_rogue_white_1794856160314.jpg',
    specs: {
      motor: '3000W',
      battery: '48V Battery',
      torque: '200 Nm Max Torque',
      topSpeed: '50 km/h',
    },
    description:
      'High-contrast alpine white and black Rogue 01 electric cross motorbike with 01 plate and LED light bar. 3000W motor, 48V battery, 200 Nm max torque, and 50 km/h top speed.',
  },
  {
    id: 'strollwheel-red',
    name: 'Strollwheel – Red Edition',
    type: 'Mini Surron',
    price: 1200,
    featured: true,
    defaultImage: '/src/assets/images/bike_strollwheel_red_1794856160018.jpg',
    specs: {
      motor: '3000W',
      battery: '48V Battery',
      torque: '200 Nm Max Torque',
      topSpeed: '55 km/h',
    },
    description:
      'Black and crimson Strollwheel Mini Surron with red ribbed seat, red motor guard, red rear coil spring, and bright LED headlight. 3000W motor, 48V battery, 200 Nm torque, and 55 km/h top speed.',
  },
];
