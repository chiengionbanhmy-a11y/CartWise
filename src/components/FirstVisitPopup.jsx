import { Compass, Search, X } from 'lucide-react';

// v81 — Popup chào mừng tự động hiện khi mở web (chỉ ở lần 1 và lần 2 trên cùng 1
// máy — logic đếm số lần mở nằm ở App.jsx, dùng localStorage nên đổi trình duyệt/máy
// khác sẽ tính lại từ đầu). Nội dung đổi thành 2 lựa chọn ngắn gọn theo đúng yêu cầu:
// "Hướng dẫn sử dụng" hoặc "So sánh ngay" — khác với mục "Hướng dẫn sử dụng" trong
// menu 3 gạch (mở popup Sơ qua về CartWise, IntroPopup.jsx) vốn chỉ hiện khi người
// dùng tự bấm vào, không tự động hiện nữa từ v79.
function FirstVisitPopup({ onClose, onOpenGuide, onCompareNow }) {
  return (
    <div className="first-visit-backdrop-v81" role="dialog" aria-modal="true" aria-label="Chào mừng đến với CartWise">
      <section className="first-visit-card-v81">
        <button className="close-btn" onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>
        <img src="/cartwise-logo-icon-v4.png" alt="CartWise" className="first-visit-logo-v81" />
        <span className="first-visit-eyebrow-v81">Chào mừng đến với CartWise</span>
        <h2>Bạn muốn xem hướng dẫn sử dụng web, hay so sánh giá ngay?</h2>
        <p>CartWise giúp bạn so sánh tổng chi phí (giá + phí vận chuyển) của cùng một sản phẩm giữa nhiều nơi bán chỉ trong vài giây.</p>
        <div className="first-visit-actions-v81">
          <button type="button" className="secondary" onClick={onOpenGuide}>
            <Compass size={18} /> Hướng dẫn sử dụng
          </button>
          <button type="button" className="primary" onClick={onCompareNow}>
            <Search size={18} /> So sánh ngay
          </button>
        </div>
      </section>
    </div>
  );
}

export default FirstVisitPopup;
