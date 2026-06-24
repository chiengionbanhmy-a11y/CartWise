const img = (name) => new URL(`../assets/products/${name}.svg`, import.meta.url).href;

const future = (hours) => Date.now() + hours * 60 * 60 * 1000;

const storeSearchUrl = (storeName, productName) => {
  const q = encodeURIComponent(productName);
  const map = {
    'WinMart': `https://winmart.vn/search?keyword=${q}`,
    'Bách Hóa Xanh': `https://www.bachhoaxanh.com/tu-khoa/${q}`,
    'Co.op Food': `https://cooponline.vn/tim-kiem?query=${q}`,
    'Shopee Mall': `https://shopee.vn/search?keyword=${q}`,
    'Lazada Mall': `https://www.lazada.vn/catalog/?q=${q}`,
    'Tiki': `https://tiki.vn/search?q=${q}`,
    'FPT Shop': `https://fptshop.com.vn/tim-kiem/${q}`,
    'CellphoneS': `https://cellphones.com.vn/catalogsearch/result/?q=${q}`,
    'GearVN': `https://gearvn.com/search?type=product&q=${q}`,
    'Thế Giới Di Động': `https://www.thegioididong.com/tim-kiem?key=${q}`,
    'MyKingdom': `https://www.mykingdom.com.vn/search?query=${q}`,
    'Hasaki': `https://hasaki.vn/tim-kiem.html?key=${q}`,
    'Guardian': `https://www.guardian.com.vn/search?type=product&q=${q}`,
    'Nhà sách Fahasa': `https://www.fahasa.com/catalogsearch/result/?q=${q}`,
    'Điện Máy Xanh': `https://www.dienmayxanh.com/tim-kiem?key=${q}`
  };
  return map[storeName] || '#';
};

export const exchangeRates = {
  VND: 1,
  USD: 0.000039,
  CNY: 0.00028,
  EUR: 0.000036,
  JPY: 0.0061,
  KRW: 0.054
};

export const currencySymbols = {
  VND: '₫', USD: '$', CNY: '¥', EUR: '€', JPY: '¥', KRW: '₩'
};

export const products = [
  {
    id: 'water-lavie-500', name: 'Nước khoáng Lavie 500ml', category: 'Đồ uống', subCategory: 'Nước khoáng', image: img('lavie'),
    description: 'Nước khoáng đóng chai tiện lợi cho học sinh, sinh viên và văn phòng.', basePrice: 6500, originalPrice: 8000, discountPercent: 19, offerEndTime: future(5), tags: ['nuoc','lavie','water','do uong'],
    stores: [
      { storeName: 'Bách Hóa Xanh', storePrice: 6500, storeUrl: '#'  },
      { storeName: 'WinMart', storePrice: 7000, storeUrl: '#'  },
      { storeName: 'Co.op Food', storePrice: 7200, storeUrl: '#'  }
    ]
  },
  { id: 'water-aquafina-500', name: 'Nước Aquafina 500ml', category: 'Đồ uống', subCategory: 'Nước tinh khiết', image: img('aquafina'), description: 'Nước tinh khiết phổ biến, dễ mua tại nhiều cửa hàng.', basePrice: 6000, originalPrice: 8000, discountPercent: 25, offerEndTime: future(3), tags: ['nuoc','aquafina','water'], stores: [{storeName:'WinMart',storePrice:6000,storeUrl:'#'},{storeName:'Bách Hóa Xanh',storePrice:6500,storeUrl:'#'},{storeName:'Co.op Food',storePrice:7000,storeUrl:'#'}] },
  { id: 'coca-can', name: 'Coca-Cola lon 320ml', category: 'Đồ uống', subCategory: 'Nước ngọt', image: img('coca'), description: 'Nước ngọt có gas, phù hợp combo ăn vặt.', basePrice: 9500, originalPrice: 12000, discountPercent: 21, offerEndTime: future(8), tags: ['coca','nuoc ngot','do uong'], stores: [{storeName:'Shopee Mall',storePrice:9500,storeUrl:'#'},{storeName:'WinMart',storePrice:11000,storeUrl:'#'},{storeName:'Tiki',storePrice:10500,storeUrl:'#'}] },
  { id: 'th-milk', name: 'Sữa TH True Milk 180ml', category: 'Đồ ăn', subCategory: 'Sữa', image: img('milk'), description: 'Sữa hộp nhỏ gọn cho bữa phụ.', basePrice: 8200, originalPrice: 10000, discountPercent: 18, offerEndTime: future(4), tags: ['sua','milk','th true milk'], stores: [{storeName:'Bách Hóa Xanh',storePrice:8200,storeUrl:'#'},{storeName:'WinMart',storePrice:9000,storeUrl:'#'},{storeName:'Co.op Food',storePrice:8800,storeUrl:'#'}] },
  { id: 'haohao', name: 'Mì Hảo Hảo tôm chua cay', category: 'Đồ ăn', subCategory: 'Mì gói', image: img('noodle'), description: 'Mì gói phổ biến, dễ so sánh giá theo lốc/thùng.', basePrice: 3900, originalPrice: 5000, discountPercent: 22, offerEndTime: future(12), tags: ['mi','hao hao','do an'], stores: [{storeName:'Bách Hóa Xanh',storePrice:3900,storeUrl:'#'},{storeName:'WinMart',storePrice:4500,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:4100,storeUrl:'#'}] },
  { id: 'oreo', name: 'Bánh Oreo vị socola', category: 'Đồ ăn', subCategory: 'Bánh kẹo', image: img('oreo'), description: 'Bánh quy socola, nhiều mức giá theo gói/combo.', basePrice: 11500, originalPrice: 15000, discountPercent: 23, offerEndTime: future(10), tags: ['oreo','banh','snack'], stores: [{storeName:'WinMart',storePrice:11500,storeUrl:'#'},{storeName:'Bách Hóa Xanh',storePrice:12800,storeUrl:'#'},{storeName:'Tiki',storePrice:12000,storeUrl:'#'}] },

  { id: 'mouse-logitech', name: 'Chuột không dây Logitech M331', category: 'Chuột & phụ kiện', subCategory: 'Chuột văn phòng', image: img('logitech'), description: 'Chuột văn phòng yên tĩnh, pin lâu, dễ dùng.', basePrice: 249000, originalPrice: 329000, discountPercent: 24, offerEndTime: future(2), tags: ['chuot','logitech','chuot van phong','wireless mouse'], stores: [{storeName:'Shopee Mall',storePrice:249000,storeUrl:'#'},{storeName:'Tiki',storePrice:279000,storeUrl:'#'},{storeName:'FPT Shop',storePrice:329000,storeUrl:'#'}] },
  { id: 'mouse-razer', name: 'Chuột gaming Razer DeathAdder', category: 'Chuột & phụ kiện', subCategory: 'Chuột gaming', image: img('razer'), description: 'Chuột gaming form công thái học, phù hợp chơi game FPS/MOBA.', basePrice: 799000, originalPrice: 1299000, discountPercent: 38, offerEndTime: future(6), tags: ['chuot','gaming','razer','mouse'], stores: [{storeName:'Lazada Mall',storePrice:799000,storeUrl:'#'},{storeName:'CellphoneS',storePrice:990000,storeUrl:'#'},{storeName:'GearVN',storePrice:1090000,storeUrl:'#'}] },
  { id: 'mouse-rapoo', name: 'Chuột văn phòng Rapoo M100', category: 'Chuột & phụ kiện', subCategory: 'Chuột Bluetooth', image: img('rapoo'), description: 'Chuột Bluetooth/không dây giá tốt cho học tập và văn phòng.', basePrice: 169000, originalPrice: 249000, discountPercent: 32, offerEndTime: future(7), tags: ['chuot','rapoo','bluetooth mouse'], stores: [{storeName:'Shopee Mall',storePrice:169000,storeUrl:'#'},{storeName:'Tiki',storePrice:199000,storeUrl:'#'},{storeName:'FPT Shop',storePrice:249000,storeUrl:'#'}] },
  { id: 'keyboard-mechanical', name: 'Bàn phím cơ mini 68 phím', category: 'Điện tử', subCategory: 'Bàn phím', image: img('keyboard'), description: 'Bàn phím cơ nhỏ gọn, có đèn nền, phù hợp học tập và gaming.', basePrice: 489000, originalPrice: 690000, discountPercent: 29, offerEndTime: future(9), tags: ['ban phim','keyboard','gaming'], stores: [{storeName:'Shopee Mall',storePrice:489000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:520000,storeUrl:'#'},{storeName:'Tiki',storePrice:590000,storeUrl:'#'}] },
  { id: 'headphone-jbl', name: 'Tai nghe Bluetooth JBL Tune', category: 'Điện tử', subCategory: 'Tai nghe', image: img('headphone'), description: 'Tai nghe không dây, pin lâu, phù hợp nghe nhạc và học online.', basePrice: 699000, originalPrice: 990000, discountPercent: 29, offerEndTime: future(11), tags: ['tai nghe','bluetooth','jbl'], stores: [{storeName:'CellphoneS',storePrice:699000,storeUrl:'#'},{storeName:'Tiki',storePrice:749000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:720000,storeUrl:'#'}] },
  { id: 'powerbank-anker', name: 'Sạc dự phòng 10000mAh', category: 'Điện tử', subCategory: 'Sạc dự phòng', image: img('powerbank'), description: 'Pin dự phòng gọn nhẹ, phù hợp đi học, đi làm, đi du lịch.', basePrice: 399000, originalPrice: 550000, discountPercent: 27, offerEndTime: future(16), tags: ['sac du phong','power bank','pin'], stores: [{storeName:'Shopee Mall',storePrice:399000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:430000,storeUrl:'#'},{storeName:'Tiki',storePrice:450000,storeUrl:'#'}] },
  { id: 'phone-samsung', name: 'Samsung Galaxy A Series', category: 'Điện tử', subCategory: 'Điện thoại', image: img('phone'), description: 'Điện thoại Android tầm trung, nhiều ưu đãi theo cửa hàng.', basePrice: 3990000, originalPrice: 4990000, discountPercent: 20, offerEndTime: future(14), tags: ['dien thoai','samsung','phone'], stores: [{storeName:'Thế Giới Di Động',storePrice:3990000,storeUrl:'#'},{storeName:'FPT Shop',storePrice:4190000,storeUrl:'#'},{storeName:'CellphoneS',storePrice:4090000,storeUrl:'#'}] },
  { id: 'speaker-bluetooth', name: 'Loa Bluetooth mini chống nước', category: 'Điện tử', subCategory: 'Loa', image: img('speaker'), description: 'Loa mini tiện mang theo, phù hợp học nhóm và du lịch.', basePrice: 299000, originalPrice: 450000, discountPercent: 34, offerEndTime: future(13), tags: ['loa','bluetooth','speaker'], stores: [{storeName:'Shopee Mall',storePrice:299000,storeUrl:'#'},{storeName:'Tiki',storePrice:329000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:315000,storeUrl:'#'}] },

  { id: 'popmart-labubu', name: 'Pop Mart Blind Box', category: 'Đồ chơi', subCategory: 'Blind box', image: img('popmart'), description: 'Đồ chơi sưu tầm bất ngờ, nhiều series hot.', basePrice: 259000, originalPrice: 320000, discountPercent: 19, offerEndTime: future(15), tags: ['do choi','pop mart','blind box'], stores: [{storeName:'MyKingdom',storePrice:259000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:280000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:275000,storeUrl:'#'}] },
  { id: 'funko-hero', name: 'Funko Pop Hero Figure', category: 'Đồ chơi', subCategory: 'Mô hình', image: img('funko'), description: 'Mô hình sưu tầm phong cách Funko.', basePrice: 349000, originalPrice: 499000, discountPercent: 30, offerEndTime: future(18), tags: ['do choi','funko','figure'], stores: [{storeName:'Tiki',storePrice:349000,storeUrl:'#'},{storeName:'MyKingdom',storePrice:399000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:379000,storeUrl:'#'}] },
  { id: 'lego-classic', name: 'Lego Classic sáng tạo', category: 'Đồ chơi', subCategory: 'Lego', image: img('lego'), description: 'Bộ xếp hình sáng tạo cho học sinh và gia đình.', basePrice: 599000, originalPrice: 750000, discountPercent: 20, offerEndTime: future(20), tags: ['lego','do choi','xep hinh'], stores: [{storeName:'MyKingdom',storePrice:599000,storeUrl:'#'},{storeName:'Tiki',storePrice:650000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:625000,storeUrl:'#'}] },
  { id: 'anime-figure', name: 'Mô hình anime mini', category: 'Đồ chơi', subCategory: 'Mô hình anime', image: img('anime'), description: 'Mô hình trang trí bàn học, bàn làm việc.', basePrice: 129000, originalPrice: 199000, discountPercent: 35, offerEndTime: future(22), tags: ['anime','figure','do choi'], stores: [{storeName:'Shopee Mall',storePrice:129000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:150000,storeUrl:'#'},{storeName:'Tiki',storePrice:160000,storeUrl:'#'}] },
  { id: 'boardgame', name: 'Board Game gia đình', category: 'Đồ chơi', subCategory: 'Board game', image: img('boardgame'), description: 'Trò chơi nhóm giúp giải trí và kết nối.', basePrice: 189000, originalPrice: 260000, discountPercent: 27, offerEndTime: future(17), tags: ['board game','do choi','game'], stores: [{storeName:'Tiki',storePrice:189000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:205000,storeUrl:'#'},{storeName:'MyKingdom',storePrice:250000,storeUrl:'#'}] },
  { id: 'teddy-bear', name: 'Gấu bông mini', category: 'Đồ chơi', subCategory: 'Gấu bông', image: img('bear'), description: 'Gấu bông mềm, nhiều màu, phù hợp làm quà.', basePrice: 99000, originalPrice: 150000, discountPercent: 34, offerEndTime: future(6), tags: ['gau bong','do choi','gift'], stores: [{storeName:'Shopee Mall',storePrice:99000,storeUrl:'#'},{storeName:'Tiki',storePrice:120000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:110000,storeUrl:'#'}] },

  { id: 'lipstick', name: 'Son dưỡng có màu', category: 'Mỹ phẩm', subCategory: 'Son môi', image: img('lipstick'), description: 'Son dưỡng nhẹ nhàng, phù hợp đi học và đi chơi.', basePrice: 89000, originalPrice: 129000, discountPercent: 31, offerEndTime: future(24), tags: ['son','my pham','lipstick'], stores: [{storeName:'Hasaki',storePrice:89000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:99000,storeUrl:'#'},{storeName:'Guardian',storePrice:120000,storeUrl:'#'}] },
  { id: 'sunscreen', name: 'Kem chống nắng SPF50', category: 'Mỹ phẩm', subCategory: 'Chống nắng', image: img('sunscreen'), description: 'Chống nắng hằng ngày, phù hợp nhiều loại da.', basePrice: 199000, originalPrice: 290000, discountPercent: 31, offerEndTime: future(5), tags: ['kem chong nang','my pham','spf'], stores: [{storeName:'Hasaki',storePrice:199000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:230000,storeUrl:'#'},{storeName:'Guardian',storePrice:260000,storeUrl:'#'}] },
  { id: 'cleanser', name: 'Sữa rửa mặt dịu nhẹ', category: 'Mỹ phẩm', subCategory: 'Làm sạch', image: img('cleanser'), description: 'Làm sạch nhẹ, phù hợp da học sinh.', basePrice: 139000, originalPrice: 199000, discountPercent: 30, offerEndTime: future(9), tags: ['sua rua mat','my pham','cleanser'], stores: [{storeName:'Hasaki',storePrice:139000,storeUrl:'#'},{storeName:'Guardian',storePrice:170000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:155000,storeUrl:'#'}] },

  { id: 'notebook', name: 'Vở kẻ ngang 200 trang', category: 'Học tập', subCategory: 'Vở', image: img('notebook'), description: 'Vở dày, giấy sáng, phù hợp học sinh.', basePrice: 18000, originalPrice: 25000, discountPercent: 28, offerEndTime: future(32), tags: ['vo','hoc tap','notebook'], stores: [{storeName:'Nhà sách Fahasa',storePrice:18000,storeUrl:'#'},{storeName:'Tiki',storePrice:22000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:20000,storeUrl:'#'}] },
  { id: 'pen', name: 'Bút gel mực đen', category: 'Học tập', subCategory: 'Bút viết', image: img('pen'), description: 'Bút gel nét êm, dễ viết ghi chép.', basePrice: 7000, originalPrice: 10000, discountPercent: 30, offerEndTime: future(28), tags: ['but','hoc tap','pen'], stores: [{storeName:'Nhà sách Fahasa',storePrice:7000,storeUrl:'#'},{storeName:'Tiki',storePrice:8500,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:7900,storeUrl:'#'}] },
  { id: 'casio', name: 'Máy tính Casio học sinh', category: 'Học tập', subCategory: 'Máy tính', image: img('casio'), description: 'Máy tính học sinh phục vụ học tập và thi cử.', basePrice: 439000, originalPrice: 550000, discountPercent: 20, offerEndTime: future(19), tags: ['casio','may tinh','hoc tap'], stores: [{storeName:'Nhà sách Fahasa',storePrice:439000,storeUrl:'#'},{storeName:'Tiki',storePrice:470000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:455000,storeUrl:'#'}] },

  { id: 'study-chair', name: 'Ghế học tập chống gù', category: 'Nội thất', subCategory: 'Ghế', image: img('chair'), description: 'Ghế học tập có thể điều chỉnh độ cao.', basePrice: 899000, originalPrice: 1290000, discountPercent: 30, offerEndTime: future(23), tags: ['ghe','noi that','hoc tap'], stores: [{storeName:'Shopee Mall',storePrice:899000,storeUrl:'#'},{storeName:'Tiki',storePrice:990000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:950000,storeUrl:'#'}] },
  { id: 'desk-lamp', name: 'Đèn bàn học LED', category: 'Gia dụng', subCategory: 'Đèn', image: img('lamp'), description: 'Đèn LED nhiều chế độ sáng, bảo vệ mắt.', basePrice: 159000, originalPrice: 239000, discountPercent: 33, offerEndTime: future(21), tags: ['den','gia dung','hoc tap'], stores: [{storeName:'Shopee Mall',storePrice:159000,storeUrl:'#'},{storeName:'Tiki',storePrice:190000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:175000,storeUrl:'#'}] },
  { id: 'rice-cooker', name: 'Nồi cơm điện mini', category: 'Gia dụng', subCategory: 'Nhà bếp', image: img('ricecooker'), description: 'Nồi cơm mini phù hợp ký túc xá và hộ nhỏ.', basePrice: 399000, originalPrice: 590000, discountPercent: 32, offerEndTime: future(27), tags: ['noi com','gia dung','nha bep'], stores: [{storeName:'Điện Máy Xanh',storePrice:399000,storeUrl:'#'},{storeName:'Shopee Mall',storePrice:420000,storeUrl:'#'},{storeName:'Tiki',storePrice:450000,storeUrl:'#'}] },
  { id: 'mini-fan', name: 'Quạt mini để bàn', category: 'Gia dụng', subCategory: 'Quạt', image: img('fan'), description: 'Quạt mini sạc USB, tiện dùng trên bàn học.', basePrice: 99000, originalPrice: 159000, discountPercent: 38, offerEndTime: future(30), tags: ['quat','gia dung','mini fan'], stores: [{storeName:'Shopee Mall',storePrice:99000,storeUrl:'#'},{storeName:'Lazada Mall',storePrice:120000,storeUrl:'#'},{storeName:'Tiki',storePrice:135000,storeUrl:'#'}] }
];


products.forEach((product) => {
  product.stores = product.stores.map((store) => ({
    ...store,
    storeUrl: store.storeUrl && store.storeUrl !== '#' ? store.storeUrl : storeSearchUrl(store.storeName, product.name)
  }));
});

export const categories = ['Tất cả', ...Array.from(new Set(products.map((p) => p.category)))];

export const getBestStore = (product) => [...product.stores].sort((a, b) => a.storePrice - b.storePrice)[0];
export const getWorstStore = (product) => [...product.stores].sort((a, b) => b.storePrice - a.storePrice)[0];
export const getSavingAmount = (product) => Math.max(0, getWorstStore(product).storePrice - getBestStore(product).storePrice);
