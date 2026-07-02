const img = (name) => new URL(`../assets/products/${name}`, import.meta.url).href;

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
  available: true,
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

const product = ({ id, name, category, subCategory, image, description, basePrice, originalPrice, discountPercent, offerHours, tags, flashSaleToday = false }) => ({
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
  flashSaleToday,
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
    image: 'logitech-m331.jpg',
    description: 'Chuột không dây yên tĩnh, phù hợp học tập và làm việc hằng ngày.',
    basePrice: 360483,
    originalPrice: 418000,
    discountPercent: 14,
    offerHours: 12,
    flashSaleToday: true,
    tags: ['chuột', 'logitech', 'đồ điện tử', 'laptop', 'máy tính']
  }),
  product({
    id: 'powerbank-anker',
    name: 'Pin sạc dự phòng Anker 10000mAh',
    category: 'Đồ điện tử',
    subCategory: 'Phụ kiện điện thoại',
    image: 'anker-powercore.jpg',
    description: 'Pin dự phòng nhỏ gọn, tiện mang đi học, đi làm hoặc du lịch.',
    basePrice: 459000,
    originalPrice: 590000,
    discountPercent: 22,
    offerHours: 20,
    tags: ['sạc dự phòng', 'anker', 'điện thoại', 'đồ điện tử']
  }),
  product({
    id: 'sunscreen',
    name: 'Kem chống nắng Anessa',
    category: 'Mỹ phẩm',
    subCategory: 'Chống nắng',
    image: 'anessa-sunscreen.jpg',
    description: 'Kem chống nắng Anessa SPF50+, dùng hằng ngày, phù hợp khi đi học, đi làm và hoạt động ngoài trời.',
    basePrice: 219000,
    originalPrice: 299000,
    discountPercent: 27,
    offerHours: 8,
    flashSaleToday: true,
    tags: ['kem chống nắng', 'anessa', 'mỹ phẩm', 'spf']
  }),
  product({
    id: 'lipstick',
    name: 'Son Dưỡng Có Màu Dior Addict Lip Glow 3.2g',
    category: 'Mỹ phẩm',
    subCategory: 'Son môi',
    image: 'dior-lip-glow.webp',
    description: 'Son dưỡng có màu Dior Addict Lip Glow 3.2g, màu nhẹ tự nhiên, phù hợp đi học và đi chơi.',
    basePrice: 129000,
    originalPrice: 179000,
    discountPercent: 28,
    offerHours: 16,
    tags: ['son', 'dior', 'lip glow', 'mỹ phẩm']
  }),
  product({
    id: 'rice-cooker',
    name: 'Nồi cơm điện tử mini Philips 0.85 lít HD3170/66',
    category: 'Đồ gia dụng',
    subCategory: 'Nhà bếp',
    image: 'philips-rice-cooker.jpg',
    description: 'Nồi cơm điện tử mini Philips 0.85 lít, phù hợp phòng trọ, ký túc xá và gia đình nhỏ.',
    basePrice: 429000,
    originalPrice: 590000,
    discountPercent: 27,
    offerHours: 18,
    tags: ['nồi cơm', 'philips', 'đồ gia dụng', 'nhà bếp']
  }),
  product({
    id: 'mini-fan',
    name: 'Quạt mini để bàn gấp gọn S-18',
    category: 'Đồ gia dụng',
    subCategory: 'Quạt',
    image: 'mini-fan-s18.jpg',
    description: 'Quạt mini để bàn gấp gọn S-18, nhỏ gọn, tiện dùng trên bàn học hoặc bàn làm việc.',
    basePrice: 149000,
    originalPrice: 219000,
    discountPercent: 32,
    offerHours: 24,
    tags: ['quạt', 's-18', 'đồ gia dụng', 'mini fan']
  }),
  product({
    id: 'water-lavie-500',
    name: 'Nước khoáng Lavie 500ml',
    category: 'Đồ ăn & đồ uống',
    subCategory: 'Nước uống',
    image: 'lavie-water.jpg',
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
    image: 'haohao-noodle.jpg',
    description: 'Mì ăn liền phổ biến, dễ mua, phù hợp bữa ăn nhanh.',
    basePrice: 5500,
    originalPrice: 7500,
    discountPercent: 27,
    offerHours: 10,
    tags: ['mì', 'hảo hảo', 'đồ ăn']
  }),
  product({
    id: 'notebook',
    name: 'Vở Hồng Hà 200 trang A4 4586',
    category: 'Học tập',
    subCategory: 'Vở',
    image: 'hongha-a4-notebook.webp',
    description: 'Vở Hồng Hà 200 trang A4 4586, phù hợp ghi chép, học tập và ôn thi.',
    basePrice: 22000,
    originalPrice: 30000,
    discountPercent: 27,
    offerHours: 30,
    tags: ['vở', 'hồng hà', 'học tập', 'notebook']
  }),
  product({
    id: 'casio',
    name: 'Máy tính Casio học sinh',
    category: 'Học tập',
    subCategory: 'Máy tính',
    image: 'casio-calculator.jpg',
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
    image: 'lego-classic.jpg',
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
    image: 'teddy-bear.jpg',
    description: 'Gấu bông mềm, dễ thương, phù hợp làm quà tặng.',
    basePrice: 99000,
    originalPrice: 150000,
    discountPercent: 34,
    offerHours: 9,
    tags: ['gấu bông', 'đồ chơi', 'quà tặng']
  })
];


const productStoreOverrides = {
  "mouse-logitech": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/Chu%E1%BB%99t-kh%C3%B4ng-d%C3%A2y-Logitech-M331-1000-DPI-Pin-24-th%C3%A1ng-K%E1%BA%BFt-n%E1%BB%91i-10m-B%E1%BA%A3o-h%C3%A0nh-12-th%C3%A1ng-i.1256164758.24680442740?extraParams=%7B%22display_model_id%22%3A245820218328%2C%22model_selection_logic%22%3A3%7D&sp_atk=9beda66d-5ec1-456e-9ecb-7bb4d22daa5f&xptdk=9beda66d-5ec1-456e-9ecb-7bb4d22daa5f",
      "storePrice": 360483,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i1168010387-s4311666005.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AChu%2525E1%2525BB%252599t%252Bkh%2525C3%2525B4ng%252Bd%2525C3%2525A2y%252BLogitech%252BM331%253Bnid%253A1168010387%253Bsrc%253ALazadaMainSrp%253Brn%253A503a5ff7b0734b71bcea92e4a1a9d557%253Bregion%253Avn%253Bsku%253A1168010387_VNAMZ%253Bprice%253A399000%253Bclient%253Adesktop%253Bsupplier_id%253A200165709073%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A1%253Butlog_bucket_id%253A470687%253Basc_category_id%253A4460%253Bitem_id%253A1168010387%253Bsku_id%253A4311666005%253Bshop_id%253A1885553%253BtemplateInfo%253A107883_E%2523-1_A3_C%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=H%E1%BB%93%20Ch%C3%AD%20Minh&price=3.99E%205&priceCompare=skuId%3A4311666005%3Bsource%3Alazada-search-voucher%3Bsn%3A503a5ff7b0734b71bcea92e4a1a9d557%3BoriginPrice%3A399000%3BdisplayPrice%3A399000%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782967027444&ratingscore=4.9195561719833565&request_id=503a5ff7b0734b71bcea92e4a1a9d557&review=721&sale=3182&search=1&source=search&spm=a2o4n.searchlist.list.1&stock=1",
      "storePrice": 399000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "https://tiki.vn/chuot-khong-day-logitech-m331-hang-chinh-hang-p160305888.html?spid=160305892",
      "storePrice": 469000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    }
  },
  "powerbank-anker": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/Pin-s%E1%BA%A1c-d%E1%BB%B1-ph%C3%B2ng-ANKER-A1239-PowerCore-Redux-10000mAh-PD-18W-PiQ-12W-si%C3%AAu-nh%E1%BB%8F-g%E1%BB%8Dn-s%E1%BA%A1c-nhanh-c%E1%BB%95ng-type-C-i.2849999.23931861793?extraParams=%7B%22display_model_id%22%3A221297328914%2C%22model_selection_logic%22%3A3%7D&sp_atk=2479e25c-b5d6-4f2a-8108-ead0d800ecb6&xptdk=2479e25c-b5d6-4f2a-8108-ead0d800ecb6",
      "storePrice": 246400,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i292806573-s465132448.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253APin%252Bs%2525E1%2525BA%2525A1c%252Bd%2525E1%2525BB%2525B1%252Bph%2525C3%2525B2ng%252BAnker%252B10000mAh%253Bnid%253A292806573%253Bsrc%253ALazadaMainSrp%253Brn%253A6e25a925b0b040740198759501b46925%253Bregion%253Avn%253Bsku%253A292806573_VNAMZ%253Bprice%253A499000%253Bclient%253Adesktop%253Bsupplier_id%253A1000100623%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A2%253Butlog_bucket_id%253A470687%253Basc_category_id%253A9031%253Bitem_id%253A292806573%253Bsku_id%253A465132448%253Bshop_id%253A357407%253BtemplateInfo%253A107883_A3_C_E%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=H%E1%BB%93%20Ch%C3%AD%20Minh&price=4.99E%205&priceCompare=skuId%3A465132448%3Bsource%3Alazada-search-voucher%3Bsn%3A6e25a925b0b040740198759501b46925%3BoriginPrice%3A499000%3BdisplayPrice%3A499000%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782971600258&ratingscore=4.892857142857143&request_id=6e25a925b0b040740198759501b46925&review=28&sale=89&search=1&source=search&spm=a2o4n.searchlist.list.2&stock=1",
      "storePrice": 499000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "https://tiki.vn/pin-sac-du-phong-anker-redux-10000mah-a1234-hang-chinh-hang-p15064380.html?spid=36502080",
      "storePrice": 750000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    }
  },
  "sunscreen-anessa": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/Gel-Ch%E1%BB%91ng-N%E1%BA%AFng-Anessa-D%C6%B0%E1%BB%A1ng-S%C3%A1ng-N%C3%A2ng-T%C3%B4ng-90g-(athen)-i.1698276414.52858921259?extraParams=%7B%22display_model_id%22%3A277541323613%2C%22model_selection_logic%22%3A3%7D&sp_atk=6404b79d-320d-48b1-a77c-60adadae8f7f&xptdk=6404b79d-320d-48b1-a77c-60adadae8f7f",
      "storePrice": 472000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i3148282062-s15011894951.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AKem%252Bch%2525E1%2525BB%252591ng%252Bn%2525E1%2525BA%2525AFng%252BAnessa%253Bnid%253A3148282062%253Bsrc%253ALazadaMainSrp%253Brn%253Ac423537a55adce2d53b5ab18c1d13c89%253Bregion%253Avn%253Bsku%253A3148282062_VNAMZ%253Bprice%253A855000%253Bclient%253Adesktop%253Bsupplier_id%253A200991104467%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A9%253Butlog_bucket_id%253A470687%253Basc_category_id%253A2285%253Bitem_id%253A3148282062%253Bsku_id%253A15011894951%253Bshop_id%253A5023966%253BtemplateInfo%253A107883_C_E%2523-1_A3%2523164594_J%2523&freeshipping=0&fs_ab=2&fuse_fs=&lang=vi&location=Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh&price=8.55E%205&priceCompare=skuId%3A15011894951%3Bsource%3Alazada-search-voucher%3Bsn%3Ac423537a55adce2d53b5ab18c1d13c89%3BoriginPrice%3A855000%3BdisplayPrice%3A855000%3BisGray%3Afalse%3BsinglePromotionId%3A900000971584718%3BsingleToolCode%3AflashSale%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782971685674&qSellingPoint=b--anessa___p--kem%20ch%E1%BB%91ng%20n%E1%BA%AFng&ratingscore=4.895833333333333&request_id=c423537a55adce2d53b5ab18c1d13c89&review=144&sale=298&search=1&source=search&spm=a2o4n.searchlist.list.9&stock=1",
      "storePrice": 855000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "https://tiki.vn/kem-chong-nang-dang-gel-duong-sang-nang-tong-hieu-chinh-sac-da-anessa-brightening-uv-sunscreen-gel-spf50-pa-90g-p274882973.html?spid=274882976",
      "storePrice": 488000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    }
  },
  "lipstick": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/Son-D%C6%B0%E1%BB%A1ng-%F0%9D%94%BB%F0%9D%95%80%F0%9D%95%86%E2%84%9D-%F0%9D%94%B8%F0%9D%94%BB%F0%9D%94%BB%F0%9D%95%80%E2%84%82%F0%9D%95%8B-%F0%9D%95%83%F0%9D%95%80%E2%84%99-%F0%9D%94%BE%F0%9D%95%83%F0%9D%95%86%F0%9D%95%8E-D%C6%B0%E1%BB%A1ng-M%C3%B4i-C%C4%83ng-M%E1%BB%8Dng-L%C3%AAn-M%C3%A0u-T%E1%BB%B1-Nhi%C3%AAn-L%E1%BB%9Bp-N%E1%BB%81n-B%C3%B3ng-M%C6%B0%E1%BB%A3t-i.1501088395.47760069792?extraParams=%7B%22display_model_id%22%3A228282661916%2C%22model_selection_logic%22%3A3%7D&sp_atk=043ea9d4-a02c-4ee7-9f8c-89d19208a6bd&xptdk=043ea9d4-a02c-4ee7-9f8c-89d19208a6bd",
      "storePrice": 242000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i3179570699-s15132448160.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253ASon%252BD%2525C6%2525B0%2525E1%2525BB%2525A1ng%252BC%2525C3%2525B3%252BM%2525C3%2525A0u%252BDior%252BAddict%252BLip%252BGlow%252B3.2g%253Bnid%253A3179570699%253Bsrc%253ALazadaMainSrp%253Brn%253A00c5add0fa46db4df0c346d10510bdc1%253Bregion%253Avn%253Bsku%253A3179570699_VNAMZ%253Bprice%253A510000%253Bclient%253Adesktop%253Bsupplier_id%253A1000255346%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A5%253Butlog_bucket_id%253A470687%253Basc_category_id%253A14371%253Bitem_id%253A3179570699%253Bsku_id%253A15132448160%253Bshop_id%253A509237%253BtemplateInfo%253A107883_E%2523-1_A3_C%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=H%E1%BB%93%20Ch%C3%AD%20Minh&price=5.1E%205&priceCompare=skuId%3A15132448160%3Bsource%3Alazada-search-voucher%3Bsn%3A00c5add0fa46db4df0c346d10510bdc1%3BoriginPrice%3A510000%3BdisplayPrice%3A510000%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782971786642&ratingscore=1.0&request_id=00c5add0fa46db4df0c346d10510bdc1&review=1&sale=14&search=1&source=search&spm=a2o4n.searchlist.list.5&stock=1",
      "storePrice": 510000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "#",
      "storePrice": null,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": false,
      "accountStatus": "Không có sản phẩm"
    }
  },
  "rice-cooker": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/N%E1%BB%93i-c%C6%A1m-%C4%91i%E1%BB%87n-t%E1%BB%AD-mini-Philips-HD3170-66-600W-0.85-l%C3%ADt-8-menu-n%E1%BA%A5u-t%E1%BB%B1-%C4%91%E1%BB%99ng-l%C3%A0m-n%C3%B3ng-%C4%91%E1%BB%81u-i.1511575634.26831841797?extraParams=%7B%22display_model_id%22%3A178831069287%2C%22model_selection_logic%22%3A3%7D&sp_atk=5d5cfad0-753b-497f-9f53-18f43bdd9c6c&xptdk=5d5cfad0-753b-497f-9f53-18f43bdd9c6c",
      "storePrice": 950000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i2637916546-s12872264231.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AN%2525E1%2525BB%252593i%252Bc%2525C6%2525A1m%252B%2525C4%252591i%2525E1%2525BB%252587n%252Bt%2525E1%2525BB%2525AD%252Bmini%252BPhilips%252B0.85%252Bl%2525C3%2525ADt%252BHD3170%25252F66%253Bnid%253A2637916546%253Bsrc%253ALazadaMainSrp%253Brn%253A20e9eb8fa187ac8139a92732bd81932c%253Bregion%253Avn%253Bsku%253A2637916546_VNAMZ%253Bprice%253A1099000%253Bclient%253Adesktop%253Bsupplier_id%253A200166441866%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A0%253Butlog_bucket_id%253A470687%253Basc_category_id%253A12582%253Bitem_id%253A2637916546%253Bsku_id%253A12872264231%253Bshop_id%253A2011559%253BtemplateInfo%253A107883_E%2523-1_A3_C%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=Viet%20Nam&price=1.099E%206&priceCompare=skuId%3A12872264231%3Bsource%3Alazada-search-voucher%3Bsn%3A20e9eb8fa187ac8139a92732bd81932c%3BoriginPrice%3A1099000%3BdisplayPrice%3A1099000%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782971917142&ratingscore=&request_id=20e9eb8fa187ac8139a92732bd81932c&review=&sale=1&search=1&source=search&spm=a2o4n.searchlist.list.0&stock=1",
      "storePrice": 1099000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "https://tiki.vn/noi-com-dien-tu-mini-philips-hd3170-66-600w-0-85-lit-hang-chinh-hang-p274106659.html?itm_campaign=SRC_YPD_TKA_PLA_UNK_ALL_UNK_UNK_UNK_UNK_X.310143_Y.1892464_Z.4042969_CN.Philips-l-Noi-Com-%C4%90ien-Tu&itm_medium=CPC&itm_source=tiki-ads&spid=275126343",
      "storePrice": 909000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    }
  },
  "mini-fan": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/Qu%E1%BA%A1t-T%C3%ADch-%C4%90i%E1%BB%87n-Xiaomi-S18-Ch%C3%ADnh-H%C3%A3ng-Cao-C%E1%BA%A5p-%E2%80%93-G%E1%BA%A5p-G%E1%BB%8Dn-Du-L%E1%BB%8Bch-Pin-Tr%C3%A2u-D%C3%B9ng-C%E1%BA%A3-Ng%C3%A0y-i.1338415596.45409832119?extraParams=%7B%22display_model_id%22%3A395974805124%2C%22model_selection_logic%22%3A3%7D&sp_atk=fee2f7d3-8077-49ee-b8f6-8ea1bbd79624&xptdk=fee2f7d3-8077-49ee-b8f6-8ea1bbd79624",
      "storePrice": 320000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i2416791135-s11883025504.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AQu%2525E1%2525BA%2525A1t%252Bmini%252B%2525C4%252591%2525E1%2525BB%252583%252Bb%2525C3%2525A0n%252Bg%2525E1%2525BA%2525A5p%252Bg%2525E1%2525BB%25258Dn%252BS-18%253Bnid%253A2416791135%253Bsrc%253ALazadaMainSrp%253Brn%253A918fe32bea69768f31dd22754504bf72%253Bregion%253Avn%253Bsku%253A2416791135_VNAMZ%253Bprice%253A59000%253Bclient%253Adesktop%253Bsupplier_id%253A200174241019%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A14%253Butlog_bucket_id%253A470687%253Basc_category_id%253A10100301%253Bitem_id%253A2416791135%253Bsku_id%253A11883025504%253Bshop_id%253A2645628%253BtemplateInfo%253A107883_A3_C_E%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=H%E1%BB%93%20Ch%C3%AD%20Minh&price=5.9E%204&priceCompare=skuId%3A11883025504%3Bsource%3Alazada-search-voucher%3Bsn%3A918fe32bea69768f31dd22754504bf72%3BoriginPrice%3A59000%3BdisplayPrice%3A59000%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782971978020&ratingscore=4.409302325581395&request_id=918fe32bea69768f31dd22754504bf72&review=215&sale=644&search=1&source=search&spm=a2o4n.searchlist.list.14&stock=1",
      "storePrice": 59000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "https://tiki.vn/quat-tich-dien-gap-gon-quat-mini-de-ban-xoay-180-do-3-toc-do-gio-cong-sac-usb-co-the-dieu-chinh-do-cao-sieu-tien-loi-hang-chinh-hang-miniin-p189475890.html?spid=189475894",
      "storePrice": 219000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    }
  },
  "water-lavie-500": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/-Chai-l%E1%BA%BB-N%C6%B0%E1%BB%9Bc-kho%C3%A1ng-Lavie-500ml-i.31086296.52160179062?extraParams=%7B%22display_model_id%22%3A330895475436%2C%22model_selection_logic%22%3A3%7D&sp_atk=7126d34e-e083-4709-ac34-b41f42fb2337&xptdk=7126d34e-e083-4709-ac34-b41f42fb2337",
      "storePrice": 5900,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i1405733046-s11882258582.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AN%2525C6%2525B0%2525E1%2525BB%25259Bc%252Bkho%2525C3%2525A1ng%252BLavie%252B500ml%253Bnid%253A1405733046%253Bsrc%253ALazadaMainSrp%253Brn%253Ae9824e0593a283e0737a5c791fa7232c%253Bregion%253Avn%253Bsku%253A1405733046_VNAMZ%253Bprice%253A10000%253Bclient%253Adesktop%253Bsupplier_id%253A200167680761%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A1%253Butlog_bucket_id%253A470687%253Basc_category_id%253A10003078%253Bitem_id%253A1405733046%253Bsku_id%253A11882258582%253Bshop_id%253A2111392%253BtemplateInfo%253A107883_E%2523-1_A3_C%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=B%E1%BA%BFn%20Tre&price=1E%204&priceCompare=skuId%3A11882258582%3Bsource%3Alazada-search-voucher%3Bsn%3Ae9824e0593a283e0737a5c791fa7232c%3BoriginPrice%3A10000%3BdisplayPrice%3A10000%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3A-1%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782972085713&ratingscore=1.0&request_id=e9824e0593a283e0737a5c791fa7232c&review=1&sale=1&search=1&source=search&spm=a2o4n.searchlist.list.1&stock=1",
      "storePrice": 10000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "#",
      "storePrice": null,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": false,
      "accountStatus": "Không có sản phẩm"
    }
  },
  "haohao": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/M%C3%AC-H%E1%BA%A3o-H%E1%BA%A3o-t%C3%B4m-chua-cay-g%C3%B3i-75g-i.155886241.25650474392?extraParams=%7B%22display_model_id%22%3A79370195823%2C%22model_selection_logic%22%3A3%7D&sp_atk=46237e4e-4920-410b-9262-ee5f115079e1&xptdk=46237e4e-4920-410b-9262-ee5f115079e1",
      "storePrice": 7500,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i1750030175-s9586287638.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AM%2525C3%2525AC%252BH%2525E1%2525BA%2525A3o%252BH%2525E1%2525BA%2525A3o%252Bt%2525C3%2525B4m%252Bchua%252Bcay%253Bnid%253A1750030175%253Bsrc%253ALazadaMainSrp%253Brn%253A6e99b7fe6b7cd32264d8fdf55b704b63%253Bregion%253Avn%253Bsku%253A1750030175_VNAMZ%253Bprice%253A7500%253Bclient%253Adesktop%253Bsupplier_id%253A200168772103%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A18%253Butlog_bucket_id%253A470687%253Basc_category_id%253A10003492%253Bitem_id%253A1750030175%253Bsku_id%253A9586287638%253Bshop_id%253A2189895%253BtemplateInfo%253A107883_E%2523-1_A3_C%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=Tr%C3%A0%20Vinh&price=7.5E%203&priceCompare=skuId%3A9586287638%3Bsource%3Alazada-search-voucher%3Bsn%3A6e99b7fe6b7cd32264d8fdf55b704b63%3BoriginPrice%3A7500%3BdisplayPrice%3A7500%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3A-1%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782972180674&ratingscore=5.0&request_id=6e99b7fe6b7cd32264d8fdf55b704b63&review=1&sale=24&search=1&source=search&spm=a2o4n.searchlist.list.18&stock=1",
      "storePrice": 7500,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "https://tiki.vn/acecook-hao-hao-huong-vi-tom-chua-cay-mi-an-lien-hao-hao-tom-chua-cay-mi-goi-hao-hao-tom-chua-cay-75g-goi-p278099100.html?spid=278099102",
      "storePrice": 11800,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    }
  },
  "notebook": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/S%E1%BB%95-_V%E1%BB%9F-b%C3%ACa-b%E1%BB%93i-Subject-A4-200-trang-d%C3%B2ng-k%E1%BA%BB-ngang-H%E1%BB%93ng-H%C3%A0-_MS-4586-i.24528665.22034043938?extraParams=%7B%22display_model_id%22%3A146750159410%2C%22model_selection_logic%22%3A3%7D&sp_atk=53c67557-b701-4ab5-9061-461b0c8be957&xptdk=53c67557-b701-4ab5-9061-461b0c8be957",
      "storePrice": 34800,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i2742856181-s13436508918.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AV%2525E1%2525BB%25259F%252BH%2525E1%2525BB%252593ng%252BH%2525C3%2525A0%252B200%252Btrang%252BA4%252B4586%253Bnid%253A2742856181%253Bsrc%253ALazadaMainSrp%253Brn%253A41cf4681e47c3b009725342217f9e272%253Bregion%253Avn%253Bsku%253A2742856181_VNAMZ%253Bprice%253A33200%253Bclient%253Adesktop%253Bsupplier_id%253A200723488342%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A1%253Butlog_bucket_id%253A470687%253Basc_category_id%253A12976%253Bitem_id%253A2742856181%253Bsku_id%253A13436508918%253Bshop_id%253A4773000%253BtemplateInfo%253A107883_A3_C_E%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=Ph%C3%BA%20Th%E1%BB%8D&price=3.32E%204&priceCompare=skuId%3A13436508918%3Bsource%3Alazada-search-voucher%3Bsn%3A41cf4681e47c3b009725342217f9e272%3BoriginPrice%3A33200%3BdisplayPrice%3A33200%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3A-1%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782972270662&ratingscore=&request_id=41cf4681e47c3b009725342217f9e272&review=&sale=0&search=1&source=search&spm=a2o4n.searchlist.list.1&stock=1",
      "storePrice": 33200,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "#",
      "storePrice": null,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": false,
      "accountStatus": "Không có sản phẩm"
    }
  },
  "casio": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/M%C3%A1y-T%C3%ADnh-Casio-FX-580VN-X-D%C3%A0nh-Cho-H%E1%BB%8Dc-Sinh-C%E1%BA%A5p-3-C%E1%BA%A5p-2-Chuy%C3%AAn-D%E1%BB%A5ng-Cho-Ph%C3%B2ng-Thi-Chuy%E1%BB%83n-C%E1%BA%A5p-%C4%90%E1%BA%A1i-H%E1%BB%8Dc-i.688878745.45359922171?extraParams=%7B%22display_model_id%22%3A420873765652%2C%22model_selection_logic%22%3A3%7D&sp_atk=7b7f31fb-3569-4230-96d8-d828667a5ef6&xptdk=7b7f31fb-3569-4230-96d8-d828667a5ef6",
      "storePrice": 499000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i3177278566-s15212308703.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AM%2525C3%2525A1y%252Bt%2525C3%2525ADnh%252BCasio%252Bh%2525E1%2525BB%25258Dc%252Bsinh%253Bnid%253A3177278566%253Bsrc%253ALazadaMainSrp%253Brn%253A742e68420c36f41bdebdcb5b39a5ad39%253Bregion%253Avn%253Bsku%253A3177278566_VNAMZ%253Bprice%253A420000%253Bclient%253Adesktop%253Bsupplier_id%253A200587328236%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A3%253Butlog_bucket_id%253A470687%253Basc_category_id%253A13010%253Bitem_id%253A3177278566%253Bsku_id%253A15212308703%253Bshop_id%253A4388667%253BtemplateInfo%253A107883_A3_C_E%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=H%E1%BB%93%20Ch%C3%AD%20Minh&price=4.2E%205&priceCompare=skuId%3A15212308703%3Bsource%3Alazada-search-voucher%3Bsn%3A742e68420c36f41bdebdcb5b39a5ad39%3BoriginPrice%3A420000%3BdisplayPrice%3A420000%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782972347361&ratingscore=4.808219178082192&request_id=742e68420c36f41bdebdcb5b39a5ad39&review=73&sale=382&search=1&source=search&spm=a2o4n.searchlist.list.3&stock=1",
      "storePrice": 420000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "https://tiki.vn/may-tinh-casio-fx580vn-x-p104769768.html?itm_campaign=SRC_YPD_TKA_PLA_UNK_ALL_UNK_UNK_UNK_UNK_X.232216_Y.1814536_Z.3676410_CN.may-tinh-casio-fx&itm_medium=CPC&itm_source=tiki-ads&spid=107005518",
      "storePrice": 822600,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    }
  },
  "lego-classic": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/Th%C3%B9ng-G%E1%BA%A1ch-Trung-Classic-S%C3%A1ng-T%E1%BA%A1o-LEGO-Classic-10696-(484-Chi-Ti%E1%BA%BFt)-i.14983509.6258976362?extraParams=%7B%22display_model_id%22%3A71515535780%2C%22model_selection_logic%22%3A3%7D&sp_atk=dc93deb4-e644-48ef-b69c-0375aef931d2&xptdk=dc93deb4-e644-48ef-b69c-0375aef931d2",
      "storePrice": 1015000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i3010217722-s14500623910.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AB%2525E1%2525BB%252599%252Bx%2525E1%2525BA%2525BFp%252Bh%2525C3%2525ACnh%252BLEGO%252BClassic%253Bnid%253A3010217722%253Bsrc%253ALazadaMainSrp%253Brn%253Ac7a677dbff404ba9d33f748f59ba2e80%253Bregion%253Avn%253Bsku%253A3010217722_VNAMZ%253Bprice%253A1360000%253Bclient%253Adesktop%253Bsupplier_id%253A200441664930%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A8%253Butlog_bucket_id%253A470687%253Basc_category_id%253A10347%253Bitem_id%253A3010217722%253Bsku_id%253A14500623910%253Bshop_id%253A3615465%253BtemplateInfo%253A107883_E%2523-1_A3_C%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=B%E1%BA%AFc%20Ninh&price=1.36E%206&priceCompare=skuId%3A14500623910%3Bsource%3Alazada-search-voucher%3Bsn%3Ac7a677dbff404ba9d33f748f59ba2e80%3BoriginPrice%3A1360000%3BdisplayPrice%3A1360000%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782972464770&ratingscore=&request_id=c7a677dbff404ba9d33f748f59ba2e80&review=&sale=0&search=1&source=search&spm=a2o4n.searchlist.list.8&stock=1",
      "storePrice": 1360000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "https://tiki.vn/bo-lap-rap-thung-gach-lon-classic-sang-tao-lego-classic-10698-790-chi-tiet-p2758763.html?spid=146281285",
      "storePrice": 2399000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    }
  },
  "teddy-bear": {
    "Shopee": {
      "storeUrl": "https://shopee.vn/Th%C3%BA-B%C3%B4ng-Mini-D%E1%BB%85-Th%C6%B0%C6%A1ng-Nhi%E1%BB%81u-H%C3%ACnh-Th%C3%BA-nh%E1%BB%93i-b%C3%B4ng%E2%80%93-GTh%E1%BB%8F-Heo-Voi-C%C3%A1o-Chim-%E2%80%93-G%E1%BA%A5u-B%C3%B4ng-Nh%E1%BB%93i-B%C3%B4ng-Size-Nh%E1%BB%8F-M%E1%BB%81m-M%E1%BB%8Bn-i.1107906013.44006732423?extraParams=%7B%22display_model_id%22%3A258579189531%2C%22model_selection_logic%22%3A3%7D&sp_atk=807428cb-0871-4c65-b43d-438cdfb8935b&xptdk=807428cb-0871-4c65-b43d-438cdfb8935b",
      "storePrice": 20000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Lazada": {
      "storeUrl": "https://www.lazada.vn/products/pdp-i3250455209-s15669381478.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253AG%2525E1%2525BA%2525A5u%252Bb%2525C3%2525B4ng%252Bmini%253Bnid%253A3250455209%253Bsrc%253ALazadaMainSrp%253Brn%253Adb1a5869ec8d03f8312c5d3c9d6b15d8%253Bregion%253Avn%253Bsku%253A3250455209_VNAMZ%253Bprice%253A37490%253Bclient%253Adesktop%253Bsupplier_id%253A200722880090%253Bsession_id%253A%253Bbiz_source%253Ah5_internal%253Bslot%253A0%253Butlog_bucket_id%253A470687%253Basc_category_id%253A10492%253Bitem_id%253A3250455209%253Bsku_id%253A15669381478%253Bshop_id%253A4772014%253BtemplateInfo%253A107883_E%2523-1_A3_C%2523164594_J%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=vi&location=China&price=3.749E%204&priceCompare=skuId%3A15669381478%3Bsource%3Alazada-search-voucher%3Bsn%3Adb1a5869ec8d03f8312c5d3c9d6b15d8%3BoriginPrice%3A37490%3BdisplayPrice%3A37490%3BisGray%3Afalse%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1782972570027&qSellingPoint=p--mini&ratingscore=4.636363636363637&request_id=db1a5869ec8d03f8312c5d3c9d6b15d8&review=33&sale=134&search=1&source=search&spm=a2o4n.searchlist.list.0&stock=1",
      "storePrice": 37490,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    },
    "Tiki": {
      "storeUrl": "https://tiki.vn/gau-bong-chim-canh-cut-sieu-mem-min-de-thuong-cho-be-20cm-45cm-vai-miniso-4-chieu-co-gian-em-ai-hang-cao-cap-an-toan-cho-tre-nho-p275603398.html?spid=275603400",
      "storePrice": 139000,
      "shippingFee": 0,
      "publicDiscount": 0,
      "cashback": 0,
      "available": true,
      "accountStatus": "Theo link bạn cung cấp"
    }
  }
};

const applyProductStoreOverride = (productItem, store) => {
  const override = productStoreOverrides[productItem.id]?.[store.storeName];
  if (!override) return store;

  if (override.available === false) {
    return {
      ...store,
      ...override,
      storePrice: null,
      shippingFee: 0,
      publicDiscount: 0,
      cashback: 0,
      storeUrl: '#',
      accountStatus: 'Không có sản phẩm'
    };
  }

  return {
    ...store,
    ...override,
    channel: 'online',
    available: true
  };
};

products.forEach((p) => {
  p.stores = p.stores.map((store) => {
    const withUrl = {
      ...store,
      storeUrl: storeSearchUrl(store.storeName, p.name),
      available: store.available !== false
    };
    return applyProductStoreOverride(p, withUrl);
  });
  const availableOnline = p.stores.filter((store) => store.channel === 'online' && store.available !== false && Number.isFinite(Number(store.storePrice)));
  if (availableOnline.length) {
    const bestPrice = Math.min(...availableOnline.map((store) => Number(store.storePrice)));
    p.basePrice = bestPrice;
  }
});

export const categories = ['Tất cả', ...Array.from(new Set(products.map((p) => p.category)))];
export const categoryGroups = categories.filter((c) => c !== 'Tất cả');

export const getFinalCost = (store) => (store?.available === false || store?.storePrice == null) ? Number.POSITIVE_INFINITY : Math.max(0, Number(store.storePrice || 0) + Number(store.shippingFee || 0));
export const getBasicCost = getFinalCost;
export const getBestStore = (product) => [...product.stores].filter((s) => s.available !== false && s.storePrice != null).sort((a, b) => a.storePrice - b.storePrice)[0];
export const getBestFinalStore = (product) => [...product.stores].filter((s) => ['Shopee', 'Lazada', 'Tiki'].includes(s.storeName) && s.available !== false && s.storePrice != null).sort((a, b) => getFinalCost(a) - getFinalCost(b))[0];
export const getBestProjectedStore = getBestFinalStore;
export const getWorstStore = (product) => [...product.stores].filter((s) => s.available !== false && s.storePrice != null).sort((a, b) => b.storePrice - a.storePrice)[0];
export const getSavingAmount = (product) => { const worst = getWorstStore(product); const best = getBestStore(product); return worst && best ? Math.max(0, worst.storePrice - best.storePrice) : 0; };
export const getStoreLogo = (storeName) => {
  const domain = storeDomains[storeName];
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : 'https://www.google.com/s2/favicons?domain=google.com&sz=64';
};

export const storeSearchUrlFor = storeSearchUrl;


// v38 — helpers for optimal savings, sorting, price history, and buy/wait suggestion
export const storePopularityRank = {
  'Shopee': 1,
  'Lazada': 2,
  'Tiki': 3,
  'Thế Giới Di Động': 4,
  'FPT Shop': 5,
  'CellphoneS': 6,
  'WinMart': 7,
  'Guardian': 8,
  'Beauty Box': 9,
  'Điện Máy Xanh': 10,
  'Co.op Mart': 11,
  'Bách Hóa Xanh': 12,
  'Nhà sách Fahasa': 13,
  'MyKingdom': 14
};

export const getStorePopularityScore = (storeName) => storePopularityRank[storeName] || 99;

export const getStoreTotalCost = (store) => {
  if (!store || store.available === false || store.storePrice == null) return null;
  return Math.max(0, Number(store.storePrice || 0) + Number(store.shippingFee || 0));
};

export const getAvailableCostRows = (product, rows = product?.stores || []) => rows
  .map((store) => ({ ...store, totalCost: getStoreTotalCost(store) }))
  .filter((store) => store.totalCost != null);

export const getOptimalSavingStats = (product, rows = product?.stores || []) => {
  const available = getAvailableCostRows(product, rows).sort((a, b) => a.totalCost - b.totalCost);
  if (!available.length) {
    return {
      best: null,
      next: null,
      worst: null,
      saveVsNext: 0,
      saveMax: 0,
      saveVsAverage: 0,
      averageCost: 0
    };
  }

  const best = available[0];
  const next = available[1] || null;
  const worst = available[available.length - 1];
  const averageCost = Math.round(available.reduce((sum, item) => sum + item.totalCost, 0) / available.length);

  return {
    best,
    next,
    worst,
    saveVsNext: next ? Math.max(0, next.totalCost - best.totalCost) : 0,
    saveMax: worst ? Math.max(0, worst.totalCost - best.totalCost) : 0,
    saveVsAverage: Math.max(0, averageCost - best.totalCost),
    averageCost
  };
};

function hashNumber(text = '') {
  return [...String(text)].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 3), 0);
}

export const getPriceHistory = (product) => {
  const best = getBestFinalStore(product) || getBestStore(product);
  const current = best ? getFinalCost(best) : Number(product?.basePrice || 0);
  if (!current) return [];

  const seed = hashNumber(product?.id || product?.name || '');
  const basePattern = [1.11, 1.08, 1.04, 1.06, 1.02, 0.99, 1];
  return basePattern.map((factor, index) => {
    const variation = (((seed + index * 17) % 7) - 3) / 100;
    const value = index === basePattern.length - 1
      ? current
      : Math.max(0, Math.round(current * (factor + variation)));
    return {
      label: index === basePattern.length - 1 ? 'Hôm nay' : `${basePattern.length - 1 - index} ngày trước`,
      value
    };
  });
};

export const getPriceInsight = (product) => {
  const history = getPriceHistory(product);
  if (!history.length) {
    return {
      status: 'Đang cập nhật',
      tone: 'neutral',
      suggestion: 'Chưa đủ dữ liệu để gợi ý.',
      current: 0,
      average: 0,
      diff: 0
    };
  }

  const current = history[history.length - 1].value;
  const average = Math.round(history.reduce((sum, item) => sum + item.value, 0) / history.length);
  const diff = current - average;

  if (current <= average * 0.95) {
    return {
      status: 'Đang rẻ',
      tone: 'good',
      suggestion: 'Nên mua ngay nếu bạn đang cần, vì giá hiện thấp hơn mức trung bình gần đây.',
      current,
      average,
      diff
    };
  }

  if (current >= average * 1.06) {
    return {
      status: 'Giá cao',
      tone: 'warning',
      suggestion: 'Có thể chờ thêm hoặc kiểm tra voucher, vì giá hiện cao hơn mức trung bình gần đây.',
      current,
      average,
      diff
    };
  }

  return {
    status: 'Ổn định',
    tone: 'stable',
    suggestion: 'Có thể mua nếu sản phẩm phù hợp nhu cầu; giá hiện không chênh nhiều so với trung bình gần đây.',
    current,
    average,
    diff
  };
};
