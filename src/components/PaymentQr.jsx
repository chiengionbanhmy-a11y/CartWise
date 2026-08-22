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

function PaymentQr({ memberName, amount, bin, bankShortName, accountNo, accountName, groupTitle }) {
  const qrUrl = buildVietQrUrl({
    bin,
    accountNo,
    accountName,
    amount,
    addInfo: `${groupTitle} ${memberName}`
  });

  return (
    <div className="payment-qr-v64">
      <div className="payment-qr-badge-v64">{bankShortName}</div>
      <a href={qrUrl} target="_blank" rel="noreferrer" className="payment-qr-image-wrap-v64">
        <img src={qrUrl} alt={`Mã QR chuyển khoản cho ${memberName}`} loading="lazy" />
      </a>
      <div className="payment-qr-info-v64">
        <b>Yêu cầu thanh toán</b>
        <span>{memberName} → {formatCurrency(amount, 'VND')}</span>
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
