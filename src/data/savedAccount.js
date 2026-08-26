// v67 — Tài khoản nhận tiền đã lưu để dùng lại lần sau (Ghép Đơn Cùng Bạn Bè).
// v81 — Tách riêng thành module dùng chung, vì Profile.jsx giờ cũng cần hiển thị/xoá
// tài khoản đã lưu (trước đây các hàm này chỉ nằm cục bộ trong GroupCart.jsx).
export const SAVED_ACCOUNT_KEY = 'cartwise-saved-bank-account';

export function loadSavedAccount() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_ACCOUNT_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveSavedAccount(value) {
  localStorage.setItem(SAVED_ACCOUNT_KEY, JSON.stringify(value));
}

export function clearSavedAccount() {
  localStorage.removeItem(SAVED_ACCOUNT_KEY);
}
