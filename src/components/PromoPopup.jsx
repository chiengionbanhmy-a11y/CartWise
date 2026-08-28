import { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';

function pickDailyFlashProducts(products = []) {
  if (!products.length) return [];
  // v85: đã bỏ 3 cặp dùng sản phẩm không còn tồn tại (notebook/casio/lego-classic/teddy-bear).
  const plannedPairs = [
    ['mouse-logitech', 'powerbank-anker'],
    ['sunscreen', 'lipstick'],
    ['mini-fan', 'water-lavie-500']
  ];
  const dayIndex = Math.floor(Date.now() / 86400000) % plannedPairs.length;
  const pair = plannedPairs[dayIndex]
    .map((id) => products.find((item) => item.id === id))
    .filter(Boolean);

  if (pair.length >= 2) return pair;

  const start = (Math.floor(Date.now() / 86400000) * 2) % products.length;
  return [products[start], products[(start + 1) % products.length]].filter(Boolean);
}

function PromoPopup({ onNavigate, products = [], onComplete }) {
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);

  const dailyFlashProducts = useMemo(() => pickDailyFlashProducts(products), [products]);

  const promos = useMemo(() => [
    {
      type: 'FLASH SALE',
      tone: 'hot',
      title: dailyFlashProducts.length
        ? `${dailyFlashProducts.map((item) => item.name).join(' & ')}`
        : 'Deal sốc hôm nay',
      text: 'Flash sale hôm nay đã được đổi mới. Bấm xem để kiểm tra sản phẩm đang giảm giá nổi bật.',
      action: 'Xem Flash Sale',
      navigate: 'flash'
    },
    {
      type: 'NEW USER',
      tone: 'voucher',
      title: 'Voucher người mới',
      text: 'Nhận ưu đãi lần đầu và thử so sánh tổng chi phí dự kiến trước khi mua.',
      action: 'Nhận voucher'
    }
  ], [dailyFlashProducts]);

  useEffect(() => {
    if (sessionStorage.getItem('cartwise-promo-closed')) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  const current = promos[index];

  const closeOrNext = () => {
    if (index < promos.length - 1) {
      setIndex((value) => value + 1);
      return;
    }
    sessionStorage.setItem('cartwise-promo-closed', '1');
    setShow(false);
    onComplete?.();
  };

  const skipAll = () => {
    sessionStorage.setItem('cartwise-promo-closed', '1');
    setShow(false);
    onComplete?.();
  };

  const handleAction = () => {
    if (current.navigate) {
      skipAll();
      onNavigate(current.navigate);
      return;
    }
    closeOrNext();
  };

  return (
    <div className="promo-center-backdrop-v44" role="dialog" aria-modal="true" aria-label="Ưu đãi CartWise">
      <section className={`promo-single-card-v46 ${current.tone}`}>
        <button onClick={skipAll} className="mini-close promo-center-close-v43" aria-label="Đóng quảng cáo">×</button>
        <div className="promo-step-v46">{index + 1}/{promos.length}</div>
        <span className="badge">{current.type}</span>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
        {current.tone === 'hot' && dailyFlashProducts.length > 0 && (
          <div className="promo-products-v46">
            {dailyFlashProducts.map((item) => (
              <div key={item.id}>
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="promo-sequence-actions-v44">
          <button className="dark-btn" onClick={handleAction}>{current.action}</button>
          <button className="secondary" onClick={closeOrNext}>
            {index < promos.length - 1 ? 'Quảng cáo tiếp theo' : 'Đóng'}
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default PromoPopup;
