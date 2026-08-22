import { useEffect, useState } from 'react';
import { Info, Loader2 } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { buildVietQrUrl } from '../utils/vietqr.js';
import { composeQrWithName } from '../utils/qrCompose.js';

// v67 — Ghép tên người cần chuyển thẳng vào file ảnh QR (canvas), thay vì chỉ
// dán nhãn đè bằng CSS như v66. Ảnh đang hiển thị trên trang VÀ ảnh mở ra ở tab
// mới khi bấm vào mã QR giờ là CÙNG MỘT ảnh đã ghép tên — không còn dòng chữ
// tên đứng tách riêng bên ngoài khung QR nữa.
//
// Nếu trình duyệt không ghép được (ảnh của VietQR không cho phép đọc lại pixel
// qua CORS), tự động dùng lại ảnh gốc + dán nhãn tên bằng CSS như cách cũ, để
// tính năng QR luôn hoạt động được trong mọi trường hợp.
function PaymentQr({ label, memberName, amount, bin, bankShortName, accountNo, accountName, groupTitle, shared = false }) {
  const displayLabel = label || memberName;
  const qrUrl = buildVietQrUrl({
    bin,
    accountNo,
    accountName,
    amount,
    addInfo: shared ? `${groupTitle} chia deu` : `${groupTitle} ${memberName}`
  });

  const [composedUrl, setComposedUrl] = useState(null);
  const [composeState, setComposeState] = useState('loading'); // loading | done | failed

  useEffect(() => {
    let cancelled = false;
    setComposedUrl(null);
    setComposeState('loading');
    composeQrWithName(qrUrl, displayLabel)
      .then((dataUrl) => {
        if (!cancelled) {
          setComposedUrl(dataUrl);
          setComposeState('done');
        }
      })
      .catch(() => {
        if (!cancelled) setComposeState('failed');
      });
    return () => {
      cancelled = true;
    };
  }, [qrUrl, displayLabel]);

  // Trong lúc chờ ghép xong vẫn hiển thị ảnh QR gốc bình thường (không chặn quét
  // mã) — chỉ thay bằng bản đã ghép tên ngay khi có kết quả.
  const finalSrc = composedUrl || qrUrl;

  return (
    <div className="payment-qr-v64">
      <div className="payment-qr-badge-v64">{bankShortName}</div>
      <a href={finalSrc} target="_blank" rel="noreferrer" className="payment-qr-image-wrap-v64">
        <img src={finalSrc} alt={`Mã QR chuyển khoản cho ${displayLabel}${composeState === 'done' ? ' (đã có tên trong ảnh)' : ''}`} loading="lazy" />
        {composeState === 'loading' && (
          <span className="payment-qr-composing-v67"><Loader2 size={12} className="spin" /> Đang ghép tên vào ảnh…</span>
        )}
        {composeState === 'failed' && (
          // Phương án dự phòng: trình duyệt không ghép được tên vào ảnh (thường do
          // giới hạn CORS từ VietQR) — vẫn dán nhãn tên đè bằng CSS như bản trước.
          <span className="payment-qr-name-tag-v64">{displayLabel}</span>
        )}
      </a>
      <div className="payment-qr-info-v64">
        <b>{shared ? 'Yêu cầu thanh toán chung (chia đều)' : 'Yêu cầu thanh toán'}</b>
        <span>{shared ? `Mỗi người quét mã này, chuyển ${formatCurrency(amount, 'VND')}` : `${displayLabel} → ${formatCurrency(amount, 'VND')}`}</span>
        <small>Quét bằng app ngân hàng bất kỳ hỗ trợ VietQR{composeState === 'done' ? ' · Bấm vào ảnh để mở tab mới, đã có tên ngay trong ảnh' : ''}</small>
      </div>
      <div className="payment-qr-disclaimer-v64">
        <Info size={13} />
        <span>Trưởng nhóm tự đánh dấu "Đã thanh toán" sau khi nhận được tiền — ứng dụng chưa tự động phát hiện giao dịch.</span>
      </div>
    </div>
  );
}

export default PaymentQr;
