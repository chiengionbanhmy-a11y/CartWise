import { CheckCircle2, ExternalLink, PackageCheck, PackageX } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';

// v83 — Ghép lại từ bản "sửa lỗi so sánh": hiện ra khi người dùng bấm "Mua tại đây"
// (ProductModal.jsx) rồi quay lại tab CartWise (App.jsx theo dõi focus/pageshow/
// visibilitychange). Chỉ ghi nhận vào lịch sử mua hàng sau khi người dùng tự bấm
// "Đã mua" ở đây — không suy đoán chỉ vì đã bấm link, đúng nguyên tắc minh bạch dữ
// liệu tự khai đã áp dụng cho nút "Đã mua/Chưa mua" thủ công trong ProductModal.jsx.
function PurchaseConfirmationModal({ pendingPurchase, onPurchased, onNotPurchased }) {
  if (!pendingPurchase) return null;
  const { product, row } = pendingPurchase;
  const paid = Number(row?.basicTotal ?? row?.storePrice ?? 0);

  return (
    <div className="modal-backdrop purchase-confirm-backdrop-v82" role="dialog" aria-modal="true">
      <div className="purchase-confirm-card-v82">
        <span className="eyebrow"><ExternalLink size={14} /> Bạn vừa quay lại CartWise</span>
        <h2>Bạn đã mua sản phẩm này trên {row?.storeName || 'sàn vừa mở'} chưa?</h2>
        <div className="purchase-confirm-product-v82">
          <img src={product.image} alt={product.name} />
          <div>
            <b>{product.name}</b>
            <span>{row?.storeName || 'Sàn mua hàng'} · Tổng đã ghi nhận {formatCurrency(paid, 'VND')}</span>
          </div>
        </div>
        <p>Nếu chọn "Đã mua", CartWise sẽ ghi nhận đúng khoản chi của sàn này, cập nhật "Số tiền đã tiết kiệm" và cộng khoản mua vào ngân sách tháng trong hồ sơ.</p>
        <div className="purchase-confirm-actions-v82">
          <button type="button" className="primary" onClick={onPurchased}><PackageCheck size={17} /> Đã mua</button>
          <button type="button" className="secondary" onClick={onNotPurchased}><PackageX size={17} /> Chưa mua</button>
        </div>
        <small><CheckCircle2 size={13} /> CartWise chỉ ghi nhận sau khi bạn tự xác nhận.</small>
      </div>
    </div>
  );
}

export default PurchaseConfirmationModal;
