const img = (name) => new URL(`../assets/products/${name}.svg`, import.meta.url).href;

const future = (hours) => Date.now() + hours * 60 * 60 * 1000;

const encode = (text) => encodeURIComponent(text);

const storeDomains = {
  'Shopee': 'shopee.vn',
  'Tiki': 'tiki.vn',
  'Lazada': 'lazada.vn',
  'FPT Shop': 'fptshop.com.vn',
  'CellphoneS': 'cellphones.com.vn',
  'Thế Giới Di Động': 'thegioididong.com',
  'WinMart': 'winmart.vn',
  'Beauty Box': 'beautybox.com.vn',
  'Guardian': 'guardian.com.vn',
  'Điện Máy Xanh': 'dienmayxanh.com',
  'Co.op Mart': 'cooponline.vn',
  'Bách Hóa Xanh': 'bachhoaxanh.com',
  'Nhà sách Fahasa': 'fahasa.com',
  'MyKingdom': 'mykingdom.com.vn'
};

const storeSearchUrl = (storeName, productName) => {
  const q = encode(productName);
  const map = {
    'Shopee': `https://shopee.vn/search?keyword=${q}`,
    'Tiki': `https://tiki.vn/search?q=${q}`,
    'Lazada': `https://www.lazada.vn/catalog/?q=${q}`,
    'FPT Shop': `https://fptshop.com.vn/tim-kiem/${q}`,
    'CellphoneS': `https://cellphones.com.vn/catalogsearch/result/?q=${q}`,
    'Thế Giới Di Động': `https://www.thegioididong.com/tim-kiem?key=${q}`,
    'WinMart': `https://winmart.vn/search?keyword=${q}`,
    'Beauty Box': `https://beautybox.com.vn/search?type=product&q=${q}`,
    'Guardian': `https://www.guardian.com.vn/search?type=product&q=${q}`,
    'Điện Máy Xanh': `https://www.dienmayxanh.com/tim-kiem?key=${q}`,
    'Co.op Mart': `https://cooponline.vn/tim-kiem?query=${q}`,
    'Bách Hóa Xanh': `https://www.bachhoaxanh.com/tu-khoa/${q}`,
    'Nhà sách Fahasa': `https://www.fahasa.com/catalogsearch/result/?q=${q}`,
    'MyKingdom': `https://www.mykingdom.com.vn/search?query=${q}`
  };
  return map[storeName] || '#';
};

const offer = (storeName, channel, storePrice, shippingFee, publicDiscount, cashback, accountStatus = 'Đã có tài khoản') => ({
  storeName,
  channel,
  storePrice,
  shippingFee,
  publicDiscount,
  cashback,
  accountStatus,
  storeUrl: '#'
});

const onlineStores = (base) => [
  offer('Shopee', 'online', Math.round(base * 0.98), 25000, 0, 0, 'Dữ liệu cơ bản'),
  offer('Lazada', 'online', Math.round(base * 0.96), 30000, 0, 0, 'Dữ liệu cơ bản'),
  offer('Tiki', 'online', Math.round(base * 1.04), 20000, 0, 0, 'Dữ liệu cơ bản')
];

const offlineByCategory = (category, base) => {
  if (category === 'Đồ điện tử') {
    return [
      offer('FPT Shop', 'offline', Math.round(base * 1.04), 0, 20000, 0, 'Đã có tài khoản'),
      offer('CellphoneS', 'offline', Math.round(base * 1.01), 0, 15000, 0, 'Đã có tài khoản'),
      offer('Thế Giới Di Động', 'offline', Math.round(base * 1.07), 0, 30000, 0, 'Đã có voucher cá nhân')
    ];
  }

  if (category === 'Mỹ phẩm') {
    return [
      offer('WinMart', 'offline', Math.round(base * 1.08), 0, 5000, 0, 'Đã có tài khoản'),
      offer('Beauty Box', 'offline', Math.round(base * 1.03), 0, 20000, 0, 'Đã có voucher cá nhân'),
      offer('Guardian', 'offline', Math.round(base * 1.05), 0, 15000, 0, 'Đã có tài khoản')
    ];
  }

  if (category === 'Đồ gia dụng') {
    return [
      offer('WinMart', 'offline', Math.round(base * 1.06), 0, 10000, 0, 'Đã có tài khoản'),
      offer('Điện Máy Xanh', 'offline', Math.round(base * 1.04), 0, 20000, 0, 'Đã có voucher cá nhân'),
      offer('Co.op Mart', 'offline', Math.round(base * 1.02), 0, 12000, 0, 'Đã có tài khoản')
    ];
  }

  if (category === 'Học tập') {
    return [
      offer('WinMart', 'offline', Math.round(base * 1.08), 0, 3000, 0, 'Đã có tài khoản'),
      offer('Nhà sách Fahasa', 'offline', Math.round(base * 1.02), 0, 8000, 0, 'Đã có voucher cá nhân'),
      offer('Co.op Mart', 'offline', Math.round(base * 1.05), 0, 5000, 0, 'Đã có tài khoản')
    ];
  }

  if (category === 'Đồ chơi') {
    return [
      offer('WinMart', 'offline', Math.round(base * 1.09), 0, 5000, 0, 'Đã có tài khoản'),
      offer('MyKingdom', 'offline', Math.round(base * 1.03), 0, 12000, 0, 'Đã có voucher cá nhân'),
      offer('Co.op Mart', 'offline', Math.round(base * 1.06), 0, 7000, 0, 'Đã có tài khoản')
    ];
  }

  return [
    offer('WinMart', 'offline', Math.round(base * 1.01), 0, 3000, 0, 'Đã có tài khoản'),
    offer('Bách Hóa Xanh', 'offline', Math.round(base * 1.04), 0, 2000, 0, 'Đã có tài khoản'),
    offer('Co.op Mart', 'offline', Math.round(base * 1.05), 0, 5000, 0, 'Đã có voucher cá nhân')
  ];
};

const product = ({ id, name, category, subCategory, image, description, basePrice, originalPrice, discountPercent, offerHours, tags }) => ({
  id,
  name,
  category,
  subCategory,
  image: img(image),
  fallbackImage: img(image),
  description,
  basePrice,
  originalPrice,
  discountPercent,
  offerEndTime: future(offerHours),
  tags,
  stores: [...onlineStores(basePrice), ...offlineByCategory(category, basePrice)]
});


export const exchangeRates = {
  VND: 1,
  USD: 0.000039,
  CNY: 0.00028,
  EUR: 0.000036,
  JPY: 0.0061,
  KRW: 0.054
};

export const currencySymbols = {
  VND: '₫',
  USD: '$',
  CNY: '¥',
  EUR: '€',
  JPY: '¥',
  KRW: '₩'
};

export const products = [
  product({
    id: 'mouse-logitech',
    name: 'Chuột không dây Logitech M331',
    category: 'Đồ điện tử',
    subCategory: 'Phụ kiện máy tính',
    image: 'logitech',
    description: 'Chuột không dây yên tĩnh, phù hợp học tập và làm việc hằng ngày.',
    basePrice: 289000,
    originalPrice: 369000,
    discountPercent: 22,
    offerHours: 12,
    tags: ['chuột', 'logitech', 'đồ điện tử', 'laptop', 'máy tính']
  }),
  product({
    id: 'powerbank-anker',
    name: 'Pin sạc dự phòng Anker 10000mAh',
    category: 'Đồ điện tử',
    subCategory: 'Phụ kiện điện thoại',
    image: 'powerbank',
    description: 'Pin dự phòng nhỏ gọn, tiện mang đi học, đi làm hoặc du lịch.',
    basePrice: 459000,
    originalPrice: 590000,
    discountPercent: 22,
    offerHours: 20,
    tags: ['sạc dự phòng', 'anker', 'điện thoại', 'đồ điện tử']
  }),
  product({
    id: 'sunscreen',
    name: 'Kem chống nắng SPF50',
    category: 'Mỹ phẩm',
    subCategory: 'Chống nắng',
    image: 'sunscreen',
    description: 'Kem chống nắng hằng ngày, phù hợp nhiều loại da.',
    basePrice: 219000,
    originalPrice: 299000,
    discountPercent: 27,
    offerHours: 8,
    tags: ['kem chống nắng', 'mỹ phẩm', 'spf']
  }),
  product({
    id: 'lipstick',
    name: 'Son dưỡng có màu',
    category: 'Mỹ phẩm',
    subCategory: 'Son môi',
    image: 'lipstick',
    description: 'Son dưỡng nhẹ, màu tự nhiên, phù hợp đi học và đi chơi.',
    basePrice: 129000,
    originalPrice: 179000,
    discountPercent: 28,
    offerHours: 16,
    tags: ['son', 'mỹ phẩm', 'lipstick']
  }),
  product({
    id: 'rice-cooker',
    name: 'Nồi cơm điện mini',
    category: 'Đồ gia dụng',
    subCategory: 'Nhà bếp',
    image: 'ricecooker',
    description: 'Nồi cơm mini phù hợp ký túc xá, phòng trọ và hộ nhỏ.',
    basePrice: 429000,
    originalPrice: 590000,
    discountPercent: 27,
    offerHours: 18,
    tags: ['nồi cơm', 'đồ gia dụng', 'nhà bếp']
  }),
  product({
    id: 'mini-fan',
    name: 'Quạt mini để bàn',
    category: 'Đồ gia dụng',
    subCategory: 'Quạt',
    image: 'fan',
    description: 'Quạt mini sạc USB, tiện dùng trên bàn học hoặc bàn làm việc.',
    basePrice: 149000,
    originalPrice: 219000,
    discountPercent: 32,
    offerHours: 24,
    tags: ['quạt', 'đồ gia dụng', 'mini fan']
  }),
  product({
    id: 'water-lavie-500',
    name: 'Nước khoáng Lavie 500ml',
    category: 'Đồ ăn & đồ uống',
    subCategory: 'Nước uống',
    image: 'lavie',
    description: 'Nước khoáng đóng chai tiện lợi cho học sinh, sinh viên và văn phòng.',
    basePrice: 7000,
    originalPrice: 9000,
    discountPercent: 22,
    offerHours: 5,
    tags: ['lavie', 'nước khoáng', 'đồ uống']
  }),
  product({
    id: 'haohao',
    name: 'Mì Hảo Hảo tôm chua cay',
    category: 'Đồ ăn & đồ uống',
    subCategory: 'Mì ăn liền',
    image: 'noodle',
    description: 'Mì ăn liền phổ biến, dễ mua, phù hợp bữa ăn nhanh.',
    basePrice: 5500,
    originalPrice: 7500,
    discountPercent: 27,
    offerHours: 10,
    tags: ['mì', 'hảo hảo', 'đồ ăn']
  }),
  product({
    id: 'notebook',
    name: 'Vở kẻ ngang 200 trang',
    category: 'Học tập',
    subCategory: 'Vở',
    image: 'notebook',
    description: 'Vở dày, giấy sáng, phù hợp ghi chép hằng ngày.',
    basePrice: 22000,
    originalPrice: 30000,
    discountPercent: 27,
    offerHours: 30,
    tags: ['vở', 'học tập', 'notebook']
  }),
  product({
    id: 'casio',
    name: 'Máy tính Casio học sinh',
    category: 'Học tập',
    subCategory: 'Máy tính',
    image: 'casio',
    description: 'Máy tính học sinh phục vụ học tập và thi cử.',
    basePrice: 459000,
    originalPrice: 550000,
    discountPercent: 17,
    offerHours: 26,
    tags: ['casio', 'máy tính', 'học tập']
  }),
  product({
    id: 'lego-classic',
    name: 'Bộ xếp hình LEGO Classic',
    category: 'Đồ chơi',
    subCategory: 'Xếp hình',
    image: 'lego',
    description: 'Bộ xếp hình sáng tạo, phù hợp trẻ em và người sưu tầm.',
    basePrice: 329000,
    originalPrice: 450000,
    discountPercent: 27,
    offerHours: 14,
    tags: ['lego', 'đồ chơi', 'xếp hình']
  }),
  product({
    id: 'teddy-bear',
    name: 'Gấu bông mini',
    category: 'Đồ chơi',
    subCategory: 'Gấu bông',
    image: 'bear',
    description: 'Gấu bông mềm, dễ thương, phù hợp làm quà tặng.',
    basePrice: 99000,
    originalPrice: 150000,
    discountPercent: 34,
    offerHours: 9,
    tags: ['gấu bông', 'đồ chơi', 'quà tặng']
  })
];

const applyLogitechM331ExpectedDemo = (productItem, store) => {
  if (productItem.id !== 'mouse-logitech') return store;

  const demoStores = {
    'Shopee': {
      storePrice: 180000,
      shippingFee: 25000,
      publicDiscount: 0,
      cashback: 0,
      accountStatus: 'Dữ liệu cơ bản'
    },
    'Lazada': {
      storePrice: 175000,
      shippingFee: 30000,
      publicDiscount: 0,
      cashback: 0,
      accountStatus: 'Dữ liệu cơ bản'
    },
    'Tiki': {
      storePrice: 190000,
      shippingFee: 20000,
      publicDiscount: 0,
      cashback: 0,
      accountStatus: 'Dữ liệu cơ bản'
    }
  };

  const override = demoStores[store.storeName];
  return override ? { ...store, ...override } : store;
};

products.forEach((p) => {
  p.stores = p.stores.map((store) => {
    const withUrl = {
      ...store,
      storeUrl: storeSearchUrl(store.storeName, p.name)
    };
    return applyLogitechM331ExpectedDemo(p, withUrl);
  });
});

export const categories = ['Tất cả', ...Array.from(new Set(products.map((p) => p.category)))];
export const categoryGroups = categories.filter((c) => c !== 'Tất cả');

export const getFinalCost = (store) => Math.max(0, Number(store.storePrice || 0) + Number(store.shippingFee || 0));
export const getBasicCost = getFinalCost;
export const getBestStore = (product) => [...product.stores].sort((a, b) => a.storePrice - b.storePrice)[0];
export const getBestFinalStore = (product) => [...product.stores].filter((s) => ['Shopee', 'Lazada', 'Tiki'].includes(s.storeName)).sort((a, b) => getFinalCost(a) - getFinalCost(b))[0];
export const getBestProjectedStore = getBestFinalStore;
export const getWorstStore = (product) => [...product.stores].sort((a, b) => b.storePrice - a.storePrice)[0];
export const getSavingAmount = (product) => Math.max(0, getWorstStore(product).storePrice - getBestStore(product).storePrice);
export const getStoreLogo = (storeName) => {
  const domain = storeDomains[storeName];
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : 'https://www.google.com/s2/favicons?domain=google.com&sz=64';
};

export const storeSearchUrlFor = storeSearchUrl;
