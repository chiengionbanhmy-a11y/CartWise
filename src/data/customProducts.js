// v85 — "Dán link sản phẩm để so sánh": cho phép người dùng dán 1 link sản phẩm bất kỳ
// (Shopee/Lazada/Tiki/website khác...) vào ô tìm kiếm ở trang chủ, CartWise sẽ tạo ra 1
// sản phẩm mới với đủ 6 sàn (3 online + 3 offline) để so sánh, y hệt 8 sản phẩm mẫu có
// sẵn — tái dùng đúng công thức tạo giá onlineStores/offlineByCategory trong products.js
// để dữ liệu tạo ra có "hình dạng" giống hệt sản phẩm thật, không phải 1 hệ thống riêng.
//
// LƯU Ý QUAN TRỌNG — MINH BẠCH DỮ LIỆU (giữ đúng nguyên tắc "demo phải ghi rõ là demo"
// đã áp dụng xuyên suốt dự án): CartWise không có backend thật để tự động đọc giá/tên/
// ảnh từ link người dùng dán vào. Vì vậy, ngoại trừ sàn nguồn (nếu nhận diện được domain
// quen thuộc — Shopee/Lazada/Tiki/...) được gắn ĐÚNG link thật bạn dán, các mức giá và
// tên gợi ý là ƯỚC TÍNH tạo tự động (dựa trên chính link đó, không đổi mỗi lần xem lại).
// Dữ liệu được lưu bằng localStorage — CHỈ trên trình duyệt này, không đồng bộ với người
// dùng khác hay thiết bị khác (không có server thật để dùng chung dữ liệu).
import { onlineStores, offlineByCategory, storeDomains, storeSearchUrlFor } from './products.js';

const CACHE_KEY = 'cartwise-custom-products';
export const CUSTOM_PRODUCT_EVENT = 'cartwise-custom-product-added';

// Nhận diện 1 chuỗi có phải là link sản phẩm hay không (chấp nhận cả khi người dùng
// quên gõ "https://", ví dụ dán thẳng "shopee.vn/...").
export function looksLikeUrl(text) {
  const t = String(text || '').trim();
  if (!t || /\s/.test(t)) return false;
  if (/^https?:\/\/\S+\.\S+/i.test(t)) return true;
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+\/\S+/i.test(t);
}

function normalizeUrl(rawUrl) {
  const t = String(rawUrl || '').trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

// Hàm băm chuỗi đơn giản (djb2) — dùng để mọi số "ngẫu nhiên" bên dưới (giá, id) đều ổn
// định theo đúng link đó, không đổi giá trị mỗi lần người khác mở lại cùng 1 link.
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const domainToStore = Object.fromEntries(Object.entries(storeDomains).map(([store, domain]) => [domain, store]));

function detectSourceStore(hostname) {
  if (!hostname) return null;
  const host = hostname.replace(/^www\./i, '').toLowerCase();
  const match = Object.entries(domainToStore).find(([domain]) => host === domain || host.endsWith(`.${domain}`));
  return match ? match[1] : null;
}

const CATEGORY_KEYWORDS = [
  { category: 'Đồ điện tử', terms: ['dien-tu', 'dien-thoai', 'laptop', 'may-tinh', 'tai-nghe', 'chuot', 'ban-phim', 'sac-du-phong', 'phone', 'electronic', 'gadget'] },
  { category: 'Mỹ phẩm', terms: ['my-pham', 'cosmetic', 'son-', '-son', 'kem-chong-nang', 'skincare', 'sua-rua-mat', 'nuoc-hoa', 'beauty', 'lipstick'] },
  { category: 'Đồ gia dụng', terms: ['gia-dung', 'noi-com', 'quat-', 'may-loc', 'bep-', 'appliance', 'noi-chien'] },
  { category: 'Đồ ăn & đồ uống', terms: ['do-an', 'do-uong', 'food', 'drink', 'nuoc-', 'mi-goi', 'snack', 'banh-'] }
];

function guessCategoryFromUrl(url) {
  const lower = url.toLowerCase();
  const found = CATEGORY_KEYWORDS.find((group) => group.terms.some((term) => lower.includes(term)));
  return found ? found.category : 'Đồ điện tử';
}

function guessNameFromUrl(url, sourceStore) {
  try {
    const slug = decodeURIComponent(new URL(url).pathname)
      .split('/')
      .filter(Boolean)
      .pop() || '';
    const cleaned = slug
      .replace(/\.(html?|php)$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b(i|p)\.?\d[\d.]*\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length > 3) {
      return cleaned
        .split(' ')
        .slice(0, 10)
        .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
        .join(' ');
    }
  } catch {
    // link không hợp lệ để parse chi tiết — dùng tên mặc định bên dưới
  }
  return sourceStore ? `Sản phẩm từ ${sourceStore}` : 'Sản phẩm từ link bạn dán';
}

// Ảnh minh hoạ dạng SVG nhúng thẳng (data URI) — không có ảnh thật để tải vì CartWise
// không đọc được nội dung trang từ link, luôn ghi rõ "(demo)" để không gây hiểu lầm.
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">'
  + '<rect width="480" height="480" fill="#eef2ff"/>'
  + '<circle cx="240" cy="188" r="72" fill="#c7d2fe"/>'
  + '<rect x="140" y="280" width="200" height="96" rx="18" fill="#c7d2fe"/>'
  + '<text x="240" y="420" font-family="sans-serif" font-size="22" fill="#4338ca" text-anchor="middle">Ảnh minh hoạ (demo)</text>'
  + '</svg>'
);

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeCache(all) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
  } catch {
    // localStorage đầy hoặc bị chặn (chế độ ẩn danh) — bỏ qua, sản phẩm vẫn dùng được
    // trong phiên hiện tại, chỉ không lưu lại cho lần sau.
  }
}

// Toàn bộ sản phẩm tự thêm đã lưu trên trình duyệt này — App.jsx dùng hàm này để gộp
// vào danh sách sản phẩm chung (tìm kiếm theo tên vẫn hoạt động với sản phẩm tự thêm).
export function getAllCustomProducts() {
  return Object.values(readCache());
}

// Lấy sản phẩm tự thêm theo id (dùng khi mở lại 1 sản phẩm tự thêm qua link chia sẻ/lịch sử).
export function getCustomProductById(id) {
  return readCache()[id] || null;
}

// Lấy dữ liệu đã lưu cho đúng link này nếu có (không tạo mới, không phát sự kiện) — dùng
// để kiểm tra trước khi quyết định có cần tạo mới hay không.
export function findCachedCustomProduct(rawUrl) {
  const url = normalizeUrl(rawUrl);
  const id = `custom-${hashString(url)}`;
  return readCache()[id] || null;
}

// Hàm chính: trả về sản phẩm tự thêm khớp với link này — dùng lại dữ liệu đã lưu nếu
// link này từng được dán trước đó (trên chính trình duyệt này), tạo mới nếu chưa có.
export function getOrCreateCustomProduct(rawUrl) {
  const url = normalizeUrl(rawUrl);
  const id = `custom-${hashString(url)}`;

  const all = readCache();
  if (all[id]) return all[id];

  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch {
    hostname = '';
  }
  const sourceStore = detectSourceStore(hostname);
  const name = guessNameFromUrl(url, sourceStore);
  const category = guessCategoryFromUrl(url);
  const seed = hashString(url);
  // Giá cơ sở ước tính (demo), ổn định theo link — dao động 40.000đ đến 900.000đ để phù
  // hợp nhiều loại sản phẩm khác nhau khi không có giá thật để đọc.
  const basePrice = 40000 + (seed % 860000);

  const rawStores = [...onlineStores(basePrice), ...offlineByCategory(category, basePrice)];
  const stores = rawStores.map((store) => {
    const withSearchUrl = {
      ...store,
      storeUrl: storeSearchUrlFor(store.storeName, name),
      available: store.available !== false
    };
    if (sourceStore && store.storeName === sourceStore) {
      return { ...withSearchUrl, storeUrl: url, accountStatus: 'Theo link bạn cung cấp' };
    }
    return withSearchUrl;
  });

  const availableOnline = stores.filter((s) => s.channel === 'online' && s.available !== false && Number.isFinite(Number(s.storePrice)));
  const finalBasePrice = availableOnline.length ? Math.min(...availableOnline.map((s) => Number(s.storePrice))) : basePrice;

  const product = {
    id,
    name,
    category,
    subCategory: 'Link tự thêm',
    image: PLACEHOLDER_IMAGE,
    fallbackImage: PLACEHOLDER_IMAGE,
    description: 'Sản phẩm được thêm từ link bạn dán vào ô tìm kiếm. Giá các sàn (trừ sàn nguồn) là ước tính minh hoạ, không phải giá thời gian thực.',
    basePrice: finalBasePrice,
    originalPrice: Math.round(finalBasePrice * 1.2),
    discountPercent: 0,
    offerEndTime: null,
    tags: ['link tự thêm'],
    flashSaleToday: false,
    stores,
    isCustom: true,
    sourceUrl: url,
    sourceStore
  };

  all[id] = product;
  writeCache(all);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CUSTOM_PRODUCT_EVENT, { detail: { product } }));
  }

  return product;
}
