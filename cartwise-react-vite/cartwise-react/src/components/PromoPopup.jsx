import { useEffect, useState } from 'react';

function PromoPopup({ onNavigate }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('cartwise-popup-seen');
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 650);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  function close() {
    sessionStorage.setItem('cartwise-popup-seen', '1');
    setVisible(false);
  }

  return (
    <div className="promo-backdrop" role="presentation" onClick={close}>
      <section className="promo-popup" role="dialog" aria-modal="true" aria-label="Thông báo ưu đãi" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={close} aria-label="Đóng">×</button>
        <span className="promo-badge">Flash Sale hôm nay</span>
        <h2>So sánh giá trước khi mua để tránh mua hớ</h2>
        <p>CartWise kiểm tra giá, phí ship, voucher và gợi ý nơi đáng mua nhất.</p>
        <button type="button" onClick={() => { close(); onNavigate('flash'); }}>Xem ưu đãi ngay</button>
      </section>
    </div>
  );
}

export default PromoPopup;
