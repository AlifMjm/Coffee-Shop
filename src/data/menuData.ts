import type { MenuCategory, MenuItem } from '../types/coffee';

export const MENU_CATEGORIES: Array<MenuCategory | 'Semua'> = [
  'Semua',
  'Espresso',
  'Manual Brew',
  'Non-Kopi',
  'Pastry',
];

export const PRICING_ADDONS = {
  largeSize: 6000,
  oatMilk: 8000,
  almondMilk: 9000,
  extraShot: 7000,
  deliveryFee: 12000,
  freeDeliveryThreshold: 100000,
} as const;

export const PICKUP_TIME_SLOTS = [
  'Secepatnya (10–15 menit)',
  '30 menit dari sekarang',
  '1 jam dari sekarang',
  'Pukul 12.00 WIB',
  'Pukul 15.00 WIB',
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'kopi-susu-kala',
    name: 'Kopi Susu Kala',
    category: 'Espresso',
    basePrice: 32000,
    image: '/src/assets/images/menu_kopi_susu_kala_1795418034118.jpg',
    imageAlt: 'Segelas es Kopi Susu Kala dengan lapisan espresso dan susu gula aren di atas meja batu terang',
    tastingNotes: 'Gula aren organik, karamel lembut, tekstur creamy',
    description:
      'Double ristretto house blend Gayo–Flores dipadukan susu segar dan sirup gula aren organik buatan dapur kami.',
    origin: 'House Blend Gayo & Flores',
    prepMinutes: 5,
    availableTemps: ['Dingin', 'Panas'],
    supportsSize: true,
    supportsMilk: true,
    supportsSugar: true,
    supportsExtraShot: true,
    supportsWarmUp: false,
    featuredTag: 'Favorit Pelanggan',
    defaultCustomization: {
      temp: 'Dingin',
      size: 'Regular',
      milk: 'Fresh Milk',
      sugar: 'Normal (100%)',
      extraShot: false,
      note: '',
    },
  },
  {
    id: 'espresso-tonic-citrus',
    name: 'Espresso Tonic Citrus',
    category: 'Espresso',
    basePrice: 36000,
    image: '/src/assets/images/menu_espresso_tonic_1795418034329.jpg',
    imageAlt: 'Gelas tinggi Espresso Tonic dengan air tonik berkarbonasi, espresso di atas, dan irisan jeruk kering',
    tastingNotes: 'Jeruk manis, botani segar, akhir rasa bersih',
    description:
      'Single-origin espresso ringan dituang perlahan di atas tonic water dingin dengan aroma kulit jeruk kering.',
    origin: 'Bali Kintamani Washed',
    prepMinutes: 4,
    availableTemps: ['Dingin'],
    supportsSize: true,
    supportsMilk: false,
    supportsSugar: true,
    supportsExtraShot: true,
    supportsWarmUp: false,
    defaultCustomization: {
      temp: 'Dingin',
      size: 'Regular',
      sugar: 'Tanpa Gula (0%)',
      extraShot: false,
      note: '',
    },
  },
  {
    id: 'v60-gayo-natural',
    name: 'V60 Gayo Natural',
    category: 'Manual Brew',
    basePrice: 38000,
    image: '/src/assets/images/menu_v60_pourover_1795418034368.jpg',
    imageAlt: 'Server kaca bergaris berisi kopi filter V60 berwarna amber dengan cangkir keramik putih',
    tastingNotes: 'Beri merah, teh melati, keasaman seimbang',
    description:
      'Diseduh manual dengan rasio 1:15 menggunakan air terkalibrasi untuk menonjolkan karakter buah alami biji Aceh Gayo.',
    origin: 'Aceh Gayo · 1.550 mdpl',
    prepMinutes: 8,
    availableTemps: ['Panas', 'Dingin'],
    supportsSize: false,
    supportsMilk: false,
    supportsSugar: false,
    supportsExtraShot: false,
    supportsWarmUp: false,
    featuredTag: 'Panen Musiman',
    defaultCustomization: {
      temp: 'Panas',
      note: '',
    },
  },
  {
    id: 'cold-brew-kintamani',
    name: 'Cold Brew Kintamani',
    category: 'Manual Brew',
    basePrice: 35000,
    image: '/src/assets/images/menu_cold_brew_bottle_1795418035589.jpg',
    imageAlt: 'Botol kaca amber cold brew bersama gelas pendek berisi es batu bening dan kopi hitam',
    tastingNotes: 'Cokelat hitam, kulit jeruk, rendah asam',
    description:
      'Ekstraksi dingin selama 16 jam menghasilkan konsentrat kopi yang halus, manis alami, dan segar diminum dengan es.',
    origin: 'Kintamani · Honey Process',
    prepMinutes: 3,
    availableTemps: ['Dingin'],
    supportsSize: true,
    supportsMilk: false,
    supportsSugar: false,
    supportsExtraShot: false,
    supportsWarmUp: false,
    defaultCustomization: {
      temp: 'Dingin',
      size: 'Regular',
      note: '',
    },
  },
  {
    id: 'uji-matcha-oat',
    name: 'Uji Matcha Oat Latte',
    category: 'Non-Kopi',
    basePrice: 40000,
    image: '/src/assets/images/menu_uji_matcha_oat_1795418033527.jpg',
    imageAlt: 'Minuman Uji Matcha hijau pekat berlapis susu oat dalam gelas kaca bening',
    tastingNotes: 'Umami lembut, kacang panggang, manis ringan',
    description:
      'Bubuk ceremonial matcha asal Uji, Kyoto, dikocok tangan dengan chasen lalu dituangkan di atas susu oat pilihan.',
    origin: 'Uji, Kyoto · First Harvest',
    prepMinutes: 5,
    availableTemps: ['Dingin', 'Panas'],
    supportsSize: true,
    supportsMilk: true,
    supportsSugar: true,
    supportsExtraShot: false,
    supportsWarmUp: false,
    defaultCustomization: {
      temp: 'Dingin',
      size: 'Regular',
      milk: 'Oat Milk',
      sugar: 'Sedikit (50%)',
      note: '',
    },
  },
  {
    id: 'butter-croissant',
    name: 'Artisan Butter Croissant',
    category: 'Pastry',
    basePrice: 28000,
    image: '/src/assets/images/menu_butter_croissant_1795418034688.jpg',
    imageAlt: 'Croissant mentega renyah keemasan di atas piring keramik matte terang',
    tastingNotes: 'Mentega Prancis fermentasi, lapisan renyah hangat',
    description:
      'Dipanggang setiap pagi pukul 06.30 dengan teknik laminasi 72 jam. Dapat dihangatkan kembali sebelum disajikan.',
    origin: 'Dipanggang Harian',
    prepMinutes: 4,
    availableTemps: ['Panas'],
    supportsSize: false,
    supportsMilk: false,
    supportsSugar: false,
    supportsExtraShot: false,
    supportsWarmUp: true,
    defaultCustomization: {
      temp: 'Panas',
      warmedUp: true,
      note: '',
    },
  },
];

export const CRAFT_PRINCIPLES = [
  {
    number: '01',
    title: 'Sangrai dalam Batch Kecil',
    body: 'Setiap biji dari Aceh Gayo, Flores Bajawa, dan Bali Kintamani kami sangrai tiap pekan agar profil aroma tetap segar di cangkir.',
  },
  {
    number: '02',
    title: 'Air & Resep Terkalibrasi',
    body: 'Kami mengukur suhu, berat gilingan, dan kandungan mineral air setiap pagi sebelum bar dibuka pukul 07.00.',
  },
  {
    number: '03',
    title: 'Pesan Dulu, Ambil Tanpa Antre',
    body: 'Pesan langsung lewat halaman ini sebelum berangkat ke kedai—minuman diseduh tepat menjelang waktu pengambilan Anda.',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'Setiap pagi sebelum rapat pukul sembilan, saya pesan Kopi Susu Kala Oat 50% gula lewat web. Sampai kedai tinggal ambil, rasanya selalu konsisten.',
    author: 'Nadia Pramesti',
    role: 'Arsitek Interior, Studio Rupa Kemang',
  },
  {
    quote:
      'V60 Gayo Natural di sini salah satu yang paling bersih ekstraksinya di Jakarta Selatan. Croissant-nya juga selalu hangat saat diantar ke kantor.',
    author: 'Bima Wijaya',
    role: 'Product Lead, Ruang Digital',
  },
];

export const ROASTERY_IMAGE = {
  src: '/src/assets/images/story_roastery_craft_1795418036501.jpg',
  alt: 'Roaster Kala Seduh memeriksa biji kopi sangrai segar di atas nampan kayu bersama ketel leher angsa dan V60',
};

export const HERO_IMAGE = {
  src: '/src/assets/images/hero_kala_seduh_bar_1795418035226.jpg',
  alt: 'Interior minimalis bar kopi Kala Seduh dengan meja kayu oak, mesin espresso hitam matte, dan cahaya matahari pagi',
};
