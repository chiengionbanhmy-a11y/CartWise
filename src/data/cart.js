// v67 — Giỏ hàng so sánh: lưu lại các sản phẩm người dùng bấm "Thêm vào giỏ hàng"
// trong khung so sánh sản phẩm, để xem lại sau (khác với "Ghép Đơn Cùng Bạn Bè" —
// tính năng đó là góp đơn theo nhóm để đạt ngưỡng freeship, còn giỏ hàng này chỉ là
// nơi lưu lại sản phẩm cá nhân đang cân nhắc). Lưu trên trình duyệt (localStorage).
const CART_KEY = 'cartwise-compare-cart';

export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveCart(list) {
  localStorage.setItem(CART_KEY, JSON.stringify(list));
}

export function isInCart(cartItems, productId) {
  return cartItems.some((item) => item.productId === productId);
}
