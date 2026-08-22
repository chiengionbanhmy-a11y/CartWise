import { ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';

// v63 — Mã QR yêu cầu thanh toán (đề xuất tích hợp Techcombank — Mục 4.2, 4.3 báo cáo
// cải tiến Vòng 4). Đây CHỈ là giao diện mô phỏng: không mã hoá dữ liệu thật, không xử
// lý giao dịch. Đề xuất tích hợp Upside, chưa có thoả thuận chính thức với Techcombank.
//
// v64 — Cập nhật theo góp ý: "chia đều" chỉ cần 1 mã QR chung cho cả nhóm (vì ai cũng trả
// số tiền như nhau); "tự nhập" mỗi người một mã QR riêng, và ngay trên hình mã QR có ghi
// chú rõ tên người đó (nhãn dán ở góc dưới ảnh QR) để phân biệt mã nào của ai khi nhiều
// người cùng xem chung một màn hình lúc thanh toán.

function pseudoQrPattern(seedText) {
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  const cells = [];
  for (let i = 0; i < 49; i += 1) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    cells.push((seed >> 16) % 3 === 0);
  }
  return cells;
}

function PaymentQrMock({ label, amount, currency, shared = false }) {
  const cells = pseudoQrPattern(`${label}-${amount}`);
  return (
    <div className="payment-qr-mock-v63">
      <div className="payment-qr-badge-v63">Demo minh hoạ</div>
      <div className="payment-qr-grid-wrap-v63">
        <div className="payment-qr-grid-v63">
          {cells.map((filled, index) => (
            <span key={index} className={filled ? 'on' : ''} />
          ))}
        </div>
        <div className="payment-qr-name-tag-v63">{label}</div>
      </div>
      <div className="payment-qr-info-v63">
        <b>{shared ? 'Yêu cầu thanh toán chung (chia đều)' : 'Yêu cầu thanh toán'}</b>
        <span>{shared ? `Mỗi người quét mã này, trả ${formatCurrency(amount, currency)}` : `${label} → ${formatCurrency(amount, currency)}`}</span>
        <small>Techcombank · VietQR (mô phỏng)</small>
      </div>
      <div className="payment-qr-disclaimer-v63">
        <ShieldAlert size={13} />
        <span>Không xử lý giao dịch thật. CartWise không giữ tiền và không đóng vai trò trung gian thanh toán ở giai đoạn này.</span>
      </div>
    </div>
  );
}

export default PaymentQrMock;
