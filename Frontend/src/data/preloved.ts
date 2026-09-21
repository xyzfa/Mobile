// src/data/preloved.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  seller: string;
  location: string;
  timeAgo: string;
  condition: string;
  description: string;
  bg: string;
  iconColor: string;
  tags: string[];
}

export interface ChatMessage {
  from: 'me' | 'them';
  text: string;
  time: string;
}

export interface ChatThread {
  id: number;
  name: string;
  product: string;
  lastMsg: string;
  time: string;
  unread: number;
  isArchived: boolean;  // TAMBAHKAN
  isMuted: boolean;    // TAMBAHKAN
  messages: ChatMessage[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Kemeja Flanel Kotak',
    category: 'Pakaian',
    price: 75000,
    seller: 'Nina R.',
    location: 'Jakarta Selatan',
    timeAgo: '2 jam lalu',
    condition: '9/10',
    description: 'Kemeja flanel motif kotak warna earth tone. Bahan tebal dan nyaman, cocok untuk casual day. Ukuran M, panjang lengan 60cm. Hanya dipakai 3–4 kali, kondisi masih sangat bagus.',
    bg: '#F1E2CC',
    iconColor: '#C68B59',
    tags: ['M', 'Casual', 'Unisex'],
  },
  {
    id: 2,
    name: 'Tas Selempang Kulit',
    category: 'Tas',
    price: 185000,
    seller: 'Budi S.',
    location: 'Bandung',
    timeAgo: '5 jam lalu',
    condition: '8/10',
    description: 'Tas selempang bahan kulit sintetis cokelat tua. Terdapat satu ruang utama dan dua kantong kecil. Ukuran 25x18cm, sangat cocok untuk outing harian maupun ke kantor.',
    bg: '#E7EEE3',
    iconColor: '#3F6048',
    tags: ['Unisex', 'Office', 'Casual'],
  },
  {
    id: 3,
    name: 'Sneakers Putih Bersih',
    category: 'Sepatu',
    price: 230000,
    seller: 'Citra A.',
    location: 'Surabaya',
    timeAgo: '1 hari lalu',
    condition: '8/10',
    description: 'Sneakers warna putih full, clean look. Ukuran 39, kondisi masih sangat bersih, sole belum tipis. Cocok dipasangkan dengan berbagai outfit casual maupun semi-formal.',
    bg: '#EDE8F5',
    iconColor: '#7B5EA7',
    tags: ['39', 'Unisex', 'Casual'],
  },
  {
    id: 4,
    name: 'Kacamata Vintage Round',
    category: 'Aksesoris',
    price: 55000,
    seller: 'Raka M.',
    location: 'Yogyakarta',
    timeAgo: '1 hari lalu',
    condition: '9/10',
    description: 'Kacamata frame bulat vintage, warna tortoise. Lensa jernih tanpa goresan. Cocok untuk bergaya retro atau daily casual. Dilengkapi pouch kulit ori.',
    bg: '#F5EDDE',
    iconColor: '#A0522D',
    tags: ['Vintage', 'Unisex', 'Retro'],
  },
  {
    id: 5,
    name: 'Denim Jacket Vintage',
    category: 'Pakaian',
    price: 145000,
    seller: 'Sari N.',
    location: 'Jakarta Barat',
    timeAgo: '2 hari lalu',
    condition: '7/10',
    description: 'Jaket denim vintage berwarna biru medium wash. Ukuran L, sudah ada natural fade yang membuat tampilan lebih keren. Ada kantong dada dan dua saku samping.',
    bg: '#DDEAF5',
    iconColor: '#4A6FA5',
    tags: ['L', 'Vintage', 'Casual'],
  },
  {
    id: 6,
    name: 'Hoodie Oversized Abu',
    category: 'Pakaian',
    price: 95000,
    seller: 'Budi S.',
    location: 'Bandung',
    timeAgo: '3 hari lalu',
    condition: '9/10',
    description: 'Hoodie oversized warna abu-abu misty. Bahan tebal 320gsm, lembut dan hangat. Ukuran XL, muat untuk badan L–XL. Dipakai kurang dari 5 kali, masih sangat fresh.',
    bg: '#E8E8E8',
    iconColor: '#666666',
    tags: ['XL', 'Comfy', 'Oversize'],
  },
  {
    id: 7,
    name: 'Kaos Polos Premium',
    category: 'Pakaian',
    price: 65000,
    seller: 'Anita P.',
    location: 'Jakarta Pusat',
    timeAgo: '4 hari lalu',
    condition: '8/10',
    description: 'Kaos polos premium bahan cotton combed 30s. Sangat nyaman dipakai sehari-hari. Ukuran M, warna hitam. Belum pernah dipakai, masih baru dengan tag.',
    bg: '#E8E0D8',
    iconColor: '#2C4533',
    tags: ['M', 'Premium', 'Basic'],
  },
  {
    id: 8,
    name: 'Ransel Kanvas Vintage',
    category: 'Tas',
    price: 120000,
    seller: 'Denny K.',
    location: 'Tangerang',
    timeAgo: '5 hari lalu',
    condition: '9/10',
    description: 'Ransel kanvas vintage style warna krem. Bahan tebal dan tahan lama. Kapasitas 15L, cukup untuk laptop 14 inch dan perlengkapan harian.',
    bg: '#D4C5B0',
    iconColor: '#8A6E4B',
    tags: ['Unisex', 'Vintage', 'Travel'],
  },
  {
    id: 9,
    name: 'Sandal Kulit Pria',
    category: 'Aksesoris',
    price: 98000,
    seller: 'Rudi H.',
    location: 'Depok',
    timeAgo: '1 minggu lalu',
    condition: '7/10',
    description: 'Sandal kulit asli warna cokelat. Ukuran 42, bahan kulit sapi berkualitas. Cocok untuk santai atau acara semi-formal. Masih bagus dan nyaman dipakai.',
    bg: '#D4C5B0',
    iconColor: '#8A6E4B',
    tags: ['42', 'Pria', 'Casual'],
  },
  {
    id: 10,
    name: 'Jam Tangan Retro',
    category: 'Aksesoris',
    price: 75000,
    seller: 'Maya L.',
    location: 'Bekasi',
    timeAgo: '2 minggu lalu',
    condition: '8/10',
    description: 'Jam tangan retro dengan strap kulit berwarna cokelat. Desain klasik dan elegan. Baterai masih bagus, semua fungsi berjalan normal. Sangat cocok untuk koleksi.',
    bg: '#C5D4D4',
    iconColor: '#2C4533',
    tags: ['Unisex', 'Retro', 'Classic'],
  },
  {
    id: 11,
    name: 'Headphone Bluetooth',
    category: 'Elektronik',
    price: 250000,
    seller: 'Tech Store',
    location: 'Jakarta Pusat',
    timeAgo: '2 hari lalu',
    condition: '9/10',
    description: 'Headphone Bluetooth premium dengan noise cancellation. Baterai tahan 20 jam, suara jernih dan bass yang powerful. Cocok untuk musik dan meeting online.',
    bg: '#DDEAF5',
    iconColor: '#4A6FA5',
    tags: ['Wireless', 'Premium', 'Bluetooth'],
  },
  {
    id: 12,
    name: 'Smartwatch Series 5',
    category: 'Elektronik',
    price: 350000,
    seller: 'Gadget Hub',
    location: 'Tangerang',
    timeAgo: '3 hari lalu',
    condition: '8/10',
    description: 'Smartwatch dengan fitur lengkap: detak jantung, step counter, notifikasi, dan tahan air. Layar AMOLED 1.4 inch, baterai tahan 3 hari.',
    bg: '#C5D4D4',
    iconColor: '#2C4533',
    tags: ['Smartwatch', 'Fitness', 'AMOLED'],
  },
  {
    id: 13,
    name: 'Powerbank 20000mAh',
    category: 'Elektronik',
    price: 120000,
    seller: 'Battery Center',
    location: 'Depok',
    timeAgo: '1 minggu lalu',
    condition: '9/10',
    description: 'Powerbank kapasitas 20000mAh dengan fast charging. Bisa charge HP hingga 4-5 kali. Dilengkapi dengan 2 port USB dan 1 port Type-C.',
    bg: '#E8E0D8',
    iconColor: '#2C4533',
    tags: ['Fast Charging', 'Portable', '20W'],
  },
];

export const chatThreads: ChatThread[] = [
  {
    id: 1,
    name: 'Nina R.',
    product: 'Kemeja Flanel Kotak',
    lastMsg: 'Apakah masih ada?',
    time: '10.30',
    unread: 2,
    isArchived: false,
    isMuted: false,
    messages: [
      { from: 'them', text: 'Halo, apakah kemeja flanel nya masih available?', time: '10.15' },
      { from: 'me', text: 'Masih ada, kondisi bagus. Ada yang mau ditanyakan?', time: '10.20' },
      { from: 'them', text: 'Ukurannya kira-kira muat untuk bahu 44?', time: '10.28' },
      { from: 'them', text: 'Apakah masih ada?', time: '10.30' },
    ],
  },
  {
    id: 2,
    name: 'Budi S.',
    product: 'Tas Selempang Kulit',
    lastMsg: 'Oke, terima kasih!',
    time: '09.15',
    unread: 0,
    isArchived: false,
    isMuted: false,
    messages: [
      { from: 'them', text: 'Tasnya masih ada kak?', time: '08.40' },
      { from: 'me', text: 'Masih! Mau lihat foto detail?', time: '08.45' },
      { from: 'them', text: 'Boleh dong kak', time: '08.46' },
      { from: 'me', text: 'Ini kondisi masih oke banget, hampir baru', time: '08.55' },
      { from: 'them', text: 'Oke, terima kasih!', time: '09.15' },
    ],
  },
  {
    id: 3,
    name: 'Citra A.',
    product: 'Sneakers Putih',
    lastMsg: 'Barang sudah dikirim ya',
    time: 'Kemarin',
    unread: 0,
    isArchived: false,
    isMuted: false,
    messages: [
      { from: 'me', text: 'Barang sudah dikirim ya, nomor resi: JNE1234567890', time: '14.30' },
      { from: 'them', text: 'Siap kak, makasih banyak!', time: '14.45' },
    ],
  },
  {
    id: 4,
    name: 'Raka M.',
    product: 'Kacamata Vintage',
    lastMsg: 'Baik, ditunggu',
    time: 'Kemarin',
    unread: 0,
    isArchived: false,
    isMuted: false,
    messages: [
      { from: 'them', text: 'Bisa COD ga kak?', time: '16.00' },
      { from: 'me', text: 'Maaf, saya hanya melayani pengiriman', time: '16.05' },
      { from: 'them', text: 'Baik, ditunggu ya kak', time: '16.07' },
      { from: 'them', text: 'Baik, ditunggu', time: '16.10' },
    ],
  },
];

export interface Order {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  sellerName: string;
  buyerName: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  orderDate: string;
  chatId: number;
}

// Daftar pesanan
export const orders: Order[] = [];

// Fungsi untuk menambah pesanan
export const addOrder = (
  productId: number,
  quantity: number,
  totalPrice: number,
  sellerName: string,
  buyerName: string,
  chatId: number
): Order => {
  const product = products.find(p => p.id === productId);
  const newOrder: Order = {
    id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    productId,
    productName: product?.name || 'Produk',
    productPrice: product?.price || 0,
    quantity,
    totalPrice,
    sellerName,
    buyerName,
    status: 'pending',
    orderDate: new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    chatId,
  };
  orders.push(newOrder);
  return newOrder;
};

// Fungsi untuk mendapatkan pesanan berdasarkan pembeli
export const getOrdersByBuyer = (buyerName: string): Order[] => {
  return orders.filter(o => o.buyerName === buyerName);
};

export const formatRupiah = (n: number) =>
  'Rp ' + n.toLocaleString('id-ID');