export const exchangeRates = {
  VND: 1,
  USD: 24500,
  CNY: 3400,
  EUR: 26700,
  JPY: 165,
  KRW: 18.5
};

export const currencies = [
  { code: 'VND', label: 'VND' },
  { code: 'USD', label: 'USD' },
  { code: 'CNY', label: 'CNY' },
  { code: 'EUR', label: 'EUR' },
  { code: 'JPY', label: 'JPY' },
  { code: 'KRW', label: 'KRW' }
];

export const products = [
  {
    id: 'aquafina-500',
    name: 'Aquafina 500ml',
    category: 'Đồ uống',
    image: '💧',
    rating: 4.8,
    reviews: 120,
    baseline: 7500,
    needScore: 8.1,
    stores: [
      { store: 'WinMart', price: 6000, shipping: 0, voucher: 0, trust: 4.7, delivery: 'Trong ngày' },
      { store: 'Bách hoá XANH', price: 6500, shipping: 0, voucher: 0, trust: 4.6, delivery: 'Trong ngày' },
      { store: 'Shopee', price: 5900, shipping: 15000, voucher: 6000, trust: 4.5, delivery: '2-3 ngày' }
    ]
  },
  {
    id: 'coca-cola-320',
    name: 'Coca-Cola Lon 320ml',
    category: 'Đồ uống',
    image: '🥤',
    rating: 4.7,
    reviews: 98,
    baseline: 10500,
    needScore: 6.9,
    stores: [
      { store: 'Bách hoá XANH', price: 8500, shipping: 0, voucher: 0, trust: 4.7, delivery: 'Trong ngày' },
      { store: 'WinMart', price: 9000, shipping: 0, voucher: 0, trust: 4.8, delivery: 'Trong ngày' },
      { store: 'Lazada', price: 7900, shipping: 18000, voucher: 8000, trust: 4.4, delivery: '2 ngày' }
    ]
  },
  {
    id: 'oreo-137',
    name: 'Oreo Bánh Quy Kem Vani 137g',
    category: 'Thực phẩm',
    image: '🍪',
    rating: 4.9,
    reviews: 156,
    baseline: 23500,
    needScore: 7.6,
    stores: [
      { store: 'Shopee', price: 18000, shipping: 16000, voucher: 12000, trust: 4.8, delivery: '2 ngày' },
      { store: 'WinMart', price: 21500, shipping: 0, voucher: 0, trust: 4.8, delivery: 'Trong ngày' },
      { store: 'Tiki', price: 19900, shipping: 14000, voucher: 6000, trust: 4.6, delivery: '1-2 ngày' }
    ]
  },
  {
    id: 'mouse-m331',
    name: 'Logitech M331 Silent Plus',
    category: 'Điện tử',
    image: '🖱️',
    rating: 4.8,
    reviews: 210,
    baseline: 369000,
    needScore: 8.7,
    stores: [
      { store: 'Lazada', price: 299000, shipping: 0, voucher: 20000, trust: 4.7, delivery: '1-2 ngày' },
      { store: 'Shopee Mall', price: 315000, shipping: 0, voucher: 25000, trust: 4.8, delivery: '2 ngày' },
      { store: 'Tiki Trading', price: 329000, shipping: 0, voucher: 15000, trust: 4.9, delivery: '1 ngày' }
    ]
  },
  {
    id: 'sunplay-70',
    name: 'Sữa chống nắng Sunplay SPF70 55g',
    category: 'Mỹ phẩm',
    image: '🧴',
    rating: 4.6,
    reviews: 88,
    baseline: 125000,
    needScore: 8.4,
    stores: [
      { store: 'Watsons', price: 109000, shipping: 0, voucher: 0, trust: 4.7, delivery: 'Trong ngày' },
      { store: 'Shopee Mall', price: 99000, shipping: 18000, voucher: 15000, trust: 4.7, delivery: '2-3 ngày' },
      { store: 'Lazada', price: 105000, shipping: 12000, voucher: 10000, trust: 4.5, delivery: '2 ngày' }
    ]
  },
  {
    id: 'omachi',
    name: 'Mì Omachi bò hầm 5 gói',
    category: 'Thực phẩm',
    image: '🍜',
    rating: 4.7,
    reviews: 145,
    baseline: 53000,
    needScore: 7.2,
    stores: [
      { store: 'WinMart', price: 47500, shipping: 0, voucher: 0, trust: 4.6, delivery: 'Trong ngày' },
      { store: 'Bách hoá XANH', price: 48900, shipping: 0, voucher: 0, trust: 4.7, delivery: 'Trong ngày' },
      { store: 'Shopee', price: 45500, shipping: 15000, voucher: 10000, trust: 4.4, delivery: '2 ngày' }
    ]
  }
];

export function getBestOffer(product) {
  return product.stores
    .map((offer) => ({ ...offer, total: offer.price + offer.shipping - offer.voucher }))
    .sort((a, b) => a.total - b.total || b.trust - a.trust)[0];
}

export function formatCurrency(amount, currency = 'VND') {
  const rate = exchangeRates[currency] || 1;
  const converted = amount / rate;
  if (currency === 'VND') {
    return `${Math.round(converted).toLocaleString('vi-VN')}đ`;
  }
  return `${converted.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} ${currency}`;
}
