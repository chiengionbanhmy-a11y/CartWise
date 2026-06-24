import { useEffect, useState } from 'react';

function PromoPopup({ onNavigate }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem('cartwise-promo-closed')) return;
    const timer = setTimeout(() => setShow(true), 650);
    return () => clearTimeout(timer);
  }, []);
  if (!show) return null;
  const close = () => { sessionStorage.setItem('cartwise-promo-closed', '1'); setShow(false); };
  return (
    <div className="promo-stack">
      <section className="promo-card hot">
        <button onClick={close} className="mini-close">×</button>
        <span className="badge">FLASH SALE</span>
        <h3>Giảm tới 50% cho sản phẩm hot hôm nay</h3>
        <p>So sánh giá ngay để không bỏ lỡ deal tốt.</p>
        <button className="dark-btn" onClick={() => { close(); onNavigate('flash'); }}>Mua ngay</button>
      </section>
      <section className="promo-card voucher">
        <button onClick={close} className="mini-close">×</button>
        <span className="badge light">NEW USER</span>
        <h3>Người mới nhận voucher giảm 10%</h3>
        <p>Áp dụng cho đơn hàng trên 100.000₫.</p>
        <button className="dark-btn" onClick={close}>Nhận voucher</button>
      </section>
    </div>
  );
}

export default PromoPopup;
