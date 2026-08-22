// Tiện ích tạo QR chuyển khoản theo chuẩn VietQR liên ngân hàng (NAPAS 247).
// v64 — thay cho QR mô phỏng (PaymentQrMock) trước đây: mã QR ở đây là thật,
// quét được bằng app ngân hàng bất kỳ có hỗ trợ VietQR.
//
// Hai API dùng đều CÔNG KHAI, KHÔNG cần đăng ký / API key, KHÔNG phải sản phẩm
// riêng của Techcombank hay bất kỳ ngân hàng nào — VietQR là chuẩn chạy trên
// NAPAS 247 mà 70+ ngân hàng Việt Nam tham gia (Techcombank là một trong số đó):
//   - Danh sách ngân hàng: https://api.vietqr.io/v2/banks
//   - Ảnh QR:              https://img.vietqr.io/image/{bin}-{soTaiKhoan}-{template}.png

export const FALLBACK_BANKS = [
  { bin: '970436', code: 'VCB', shortName: 'Vietcombank' },
  { bin: '970407', code: 'TCB', shortName: 'Techcombank' },
  { bin: '970422', code: 'MB', shortName: 'MB Bank' },
  { bin: '970432', code: 'VPB', shortName: 'VPBank' },
  { bin: '970418', code: 'BIDV', shortName: 'BIDV' },
  { bin: '970415', code: 'ICB', shortName: 'VietinBank' },
  { bin: '970416', code: 'ACB', shortName: 'ACB' },
  { bin: '970403', code: 'STB', shortName: 'Sacombank' },
  { bin: '970423', code: 'TPB', shortName: 'TPBank' },
  { bin: '970441', code: 'VIB', shortName: 'VIB' },
  { bin: '970405', code: 'VBA', shortName: 'Agribank' },
  { bin: '970443', code: 'SHB', shortName: 'SHB' },
  { bin: '970426', code: 'MSB', shortName: 'MSB' },
  { bin: '970448', code: 'OCB', shortName: 'OCB' },
  { bin: '970437', code: 'HDB', shortName: 'HDBank' }
];

const BANKS_API = 'https://api.vietqr.io/v2/banks';
const IMAGE_BASE = 'https://img.vietqr.io/image';

// Tải danh sách đầy đủ ngân hàng hỗ trợ VietQR. Nếu lỗi mạng / API tạm gián
// đoạn (ví dụ wifi ở nơi thi đấu), tự rơi về danh sách rút gọn phía trên để
// không bị đứng demo.
export async function fetchVietQrBanks() {
  try {
    const res = await fetch(BANKS_API);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (!Array.isArray(json?.data) || json.data.length === 0) throw new Error('empty bank list');
    return json.data.map((b) => ({ bin: b.bin, code: b.code, shortName: b.shortName || b.short_name }));
  } catch {
    return FALLBACK_BANKS;
  }
}

function removeDiacritics(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Nội dung chuyển khoản qua QR thường không hiển thị đúng dấu tiếng Việt trên
// nhiều app ngân hàng, nên bỏ dấu trước khi đưa vào QR.
export function buildVietQrUrl({ bin, accountNo, accountName, amount, addInfo, template = 'compact2' }) {
  const params = new URLSearchParams({
    amount: String(Math.max(0, Math.round(Number(amount) || 0))),
    addInfo: removeDiacritics(addInfo).slice(0, 50),
    accountName: removeDiacritics(accountName).toUpperCase().slice(0, 50)
  });
  return `${IMAGE_BASE}/${bin}-${accountNo}-${template}.png?${params.toString()}`;
}
