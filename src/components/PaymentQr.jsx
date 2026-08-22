import { Info } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { buildVietQrUrl } from '../utils/vietqr.js';

// v64 — Mã QR yêu cầu thanh toán, dùng chuẩn VietQR liên ngân hàng (NAPAS 247).
// Thay cho PaymentQrMock (giao diện mô phỏng) trước đây — mã QR ở đây là THẬT,
// tạo trực tiếp từ ngân hàng + số tài khoản người dùng tự nhập khi chốt nhóm
// (không exclusive với bất kỳ ngân hàng nào, xem src/utils/vietqr.js).
//
// Số tiền luôn hiển thị bằng VND (không theo currency hiển thị của app) vì
// giao dịch chuyển khoản thật luôn phải là VND, kể cả khi người dùng đang xem
// giá bằng USD/ngoại tệ khác ở những nơi khác trong app.
//
// Trạng thái thanh toán KHÔNG được xác nhận tự động — trưởng nhóm tự đánh dấu
// thủ công sau khi nhận được tiền (đúng như đã nêu trong báo cáo cải tiến).
//
// `shared`: dùng cho chế độ "Chia đều" khi mọi thành viên trả đúng cùng 1 số
// tiền — lúc đó chỉ cần tạo 1 mã QR chung thay vì lặp lại cùng 1 mã QR cho
// từng người. Ngay trên ảnh QR luôn có nhãn tên (người/nhóm) để phân biệt rõ
// mã nào của ai khi nhiều mã QR khác nhau hiển thị gần nhau lúc thanh toán.
function PaymentQr({ label, memberName, amount, bin, bankShortName, accountNo, accountName, groupTitle, shared = false }) {
  const displayLabel = label || memberName;
  const qrUrl = buildVietQrUrl({
    bin,
    accountNo,
    accountName,
    amount,
    addInfo: shared ? `${groupTitle} chia deu` : `${groupTitle} ${memberName}`
  });

  return (
    <div className="payment-qr-v64">
      <div className="payment-qr-badge-v64">{bankShortName}</div>
      <a href={qrUrl} target="_blank" rel="noreferrer" className="payment-qr-image-wrap-v64">
        <img src={qrUrl} alt={`Mã QR chuyển khoản cho ${displayLabel}`} loading="lazy" />
        <span className="payment-qr-name-tag-v64">{displayLabel}</span>
      </a>
      <div className="payment-qr-info-v64">
        <b>{shared ? 'Yêu cầu thanh toán chung (chia đều)' : 'Yêu cầu thanh toán'}</b>
        <span>{shared ? `Mỗi người quét mã này, chuyển ${formatCurrency(amount, 'VND')}` : `${displayLabel} → ${formatCurrency(amount, 'VND')}`}</span>
        <small>Quét bằng app ngân hàng bất kỳ hỗ trợ VietQR</small>
      </div>
      <div className="payment-qr-disclaimer-v64">
        <Info size={13} />
        <span>Trưởng nhóm tự đánh dấu "Đã thanh toán" sau khi nhận được tiền — ứng dụng chưa tự động phát hiện giao dịch.</span>
      </div>
    </div>
  );
}

export default PaymentQr;
