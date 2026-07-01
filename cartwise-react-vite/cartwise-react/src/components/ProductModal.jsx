import { useEffect, useMemo, useState } from 'react';
import CawiRobot from './CawiRobot.jsx';
import { formatCurrency } from '../data/currency.js';
import { getBestFinalStore, getStoreLogo } from '../data/products.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];
const accountOptions = ['Chưa có tài khoản', 'Đã có tài khoản', 'Đã có voucher cá nhân', 'Đã liên kết Shopee'];

function getCountdown(endTime) {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
  const total = Math.floor(diff / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function calculateFinal(row) {
  return Math.max(0, Number(row.storePrice || 0) + Number(row.shippingFee || 0) - Number(row.publicDiscount || 0) - Number(row.cashback || 0));
}

function ProductModal({ product, currency, onCurrencyChange, onClose }) {
  const [localCurrency, setLocalCurrency] = useState(currency || 'VND');
  const [countdown, setCountdown] = useState(product.offerEndTime ? getCountdown(product.offerEndTime) : null);
  const [offers, setOffers] = useState(() => product.stores.map((s) => ({ ...s })));
  const [shopeeConnected, setShopeeConnected] = useState(() => product.id === 'mouse-logitech');

  useEffect(() => {
    setOffers(product.stores.map((s) => ({ ...s })));
    setCountdown(product.offerEndTime ? getCountdown(product.offerEndTime) : null);
    setShopeeConnected(product.id === 'mouse-logitech');
  }, [product]);

  useEffect(() => {
    if (!product.offerEndTime) return;
    const timer = setInterval(() => setCountdown(getCountdown(product.offerEndTime)), 1000);
    return () => clearInterval(timer);
  }, [product.offerEndTime]);

  function selectCurrency(cur) {
    setLocalCurrency(cur);
    onCurrencyChange?.(cur);
  }

  function updateOffer(index, field, value) {
    setOffers((prev) => prev.map((item, i) => {
      if (i !== index) return item;
      if (field === 'accountStatus') return { ...item, [field]: value };
      return { ...item, [field]: Math.max(0, Number(value || 0)) };
    }));
  }

  const rows = useMemo(() => offers.map((offer, index) => {
    const linkedShopee = shopeeConnected && offer.storeName === 'Shopee';
    const hydratedOffer = linkedShopee ? { ...offer, accountStatus: 'Đã liên kết Shopee' } : offer;
    return { ...hydratedOffer, index, finalCost: calculateFinal(hydratedOffer) };
  }), [offers, shopeeConnected]);
  const bestFinal = useMemo(() => [...rows].sort((a, b) => a.finalCost - b.finalCost)[0], [rows]);
  const originalBest = useMemo(() => getBestFinalStore(product), [product]);
  const shopeeRow = rows.find((r) => r.storeName === 'Shopee');
  const hasNoAccount = rows.some((r) => r.accountStatus === 'Chưa có tài khoản');

  return (
    <div className="modal-backdrop product-backdrop" role="dialog" aria-modal="true">
      <div className="product-modal premium-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-grid premium-modal-grid">
          <section className="modal-image-panel premium-image-panel">
            <img
              src={product.image}
              alt={product.name}
              onError={(event) => {
                if (product.fallbackImage && event.currentTarget.src !== product.fallbackImage) {
                  event.currentTarget.src = product.fallbackImage;
                }
              }}
            />
            <div className="quick-convert premium-convert">
              <h4>Quy đổi tiền tệ nhanh</h4>
              <div className="currency-grid compact">
                {currencies.map((cur) => (
                  <button key={cur} className={localCurrency === cur ? 'choice active' : 'choice'} onClick={() => selectCurrency(cur)}>{cur}</button>
                ))}
              </div>
              <small>Quy đổi tham khảo từ VNĐ.</small>
            </div>
          </section>

          <section className="modal-info-panel has-advisor premium-info-panel">
            <div className="modal-advisor-slot">
              <CawiRobot
                mode="modal"
                message={`Đừng chỉ nhìn giá ban đầu — hãy xem tổng tiền thật sự phải trả. ${bestFinal?.storeName || originalBest.storeName} đang tiết kiệm nhất!`}
              />
            </div>
            <span className="category-chip">{product.category} · {product.subCategory}</span>
            <h2>{product.name}</h2>
            <p>{product.description}</p>

            <div className="best-price-box true-price-hero">
              <span>Giá thật sau cùng thấp nhất</span>
              <strong>{bestFinal ? formatCurrency(bestFinal.finalCost, localCurrency) : '—'}</strong>
              <p>Tiết kiệm nhất tại <b>{bestFinal?.storeName}</b></p>
              {countdown && <div className="countdown">Ưu đãi sắp hết: <b>{countdown}</b></div>}
            </div>

            <div className="true-price-message">
              <b>Đừng chỉ nhìn giá ban đầu</b>
              <span>CartWise tính cả phí vận chuyển, mã giảm giá và hoàn xu để ước tính tổng tiền thật sự phải trả.</span>
            </div>

            <div className={shopeeConnected ? 'shopee-account-card connected' : 'shopee-account-card'}>
              <div className="shopee-account-left">
                <img src={getStoreLogo('Shopee')} alt="Shopee" />
                <div>
                  <b>Liên kết tài khoản Shopee</b>
                  <span>
                    {shopeeConnected
                      ? 'Đã liên kết Shopee với CartWise trong bản demo. Hàng Shopee sẽ dùng dữ liệu phí/voucher đã cấu hình.'
                      : 'Kết nối Shopee để CartWise ước tính phí vận chuyển, voucher và tổng chi phí sát hơn.'}
                  </span>
                  {shopeeConnected && shopeeRow && (
                    <small>Tổng Shopee hiện tại: {formatCurrency(shopeeRow.finalCost, localCurrency)}</small>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => setShopeeConnected((prev) => !prev)}>
                {shopeeConnected ? 'Đã liên kết' : 'Liên kết Shopee'}
              </button>
            </div>
            <p className="shopee-demo-note">
              Lưu ý: bản demo chưa đăng nhập Shopee thật. Để lấy phí vận chuyển, voucher cá nhân và điều kiện tài khoản theo thời gian thực, CartWise cần tích hợp API/đăng nhập hợp lệ từ Shopee.
            </p>

            <h3>So sánh giá thật sau cùng</h3>
            <div className="final-price-panel">
              <div className="final-price-table">
                <div className="final-row final-head">
                  <span>Nơi bán</span>
                  <span>Giá sản phẩm</span>
                  <span>Phí ship</span>
                  <span>Giảm giá</span>
                  <span>Hoàn xu</span>
                  <span>Tài khoản</span>
                  <span>Tổng cuối</span>
                  <span></span>
                </div>
                {rows.map((row) => {
                  const isBest = row.index === bestFinal?.index;
                  return (
                    <div className={isBest ? 'final-row best-final' : 'final-row'} key={`${row.storeName}-${row.channel}`}>
                      <span className="final-store-cell">
                        <img src={getStoreLogo(row.storeName)} alt={row.storeName} />
                        <b>{row.storeName}</b>
                        <em>{row.accountStatus === 'Đã liên kết Shopee' ? 'Đã liên kết' : 'Dữ liệu so sánh'}</em>
                        {isBest && <i>Giá thật thấp nhất</i>}
                        {row.dataNote && <small className="row-data-note">{row.dataNote}</small>}
                      </span>
                      <span>{formatCurrency(row.storePrice, localCurrency)}</span>
                      <label>
                        <input type="number" min="0" value={row.shippingFee} onChange={(e) => updateOffer(row.index, 'shippingFee', e.target.value)} />
                      </label>
                      <label>
                        <input type="number" min="0" value={row.publicDiscount} onChange={(e) => updateOffer(row.index, 'publicDiscount', e.target.value)} />
                      </label>
                      <label>
                        <input type="number" min="0" value={row.cashback} onChange={(e) => updateOffer(row.index, 'cashback', e.target.value)} />
                      </label>
                      <label>
                        <select value={row.accountStatus} onChange={(e) => updateOffer(row.index, 'accountStatus', e.target.value)}>
                          {accountOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                      <strong>{formatCurrency(row.finalCost, localCurrency)}</strong>
                      <a className="buy-link" href={row.storeUrl} target="_blank" rel="noreferrer">Mua tại đây</a>
                    </div>
                  );
                })}
              </div>

              {hasNoAccount && (
                <div className="account-warning">
                  Một số mã giảm giá hoặc ưu đãi có thể yêu cầu đăng nhập hoặc tài khoản đủ điều kiện.
                </div>
              )}

              <p className="final-price-note">
                CartWise so sánh dựa trên tổng chi phí ước tính, bao gồm giá sản phẩm, phí vận chuyển, mã giảm giá công khai và hoàn xu/điểm thưởng nếu có. Giá cuối cùng có thể thay đổi tùy tài khoản, vị trí giao hàng, voucher cá nhân và chính sách của từng nền tảng.
              </p>
              <div className="formula-box">
                <b>Công thức:</b> Tổng chi phí ước tính = Giá sản phẩm + Phí vận chuyển - Mã giảm giá - Giá trị hoàn xu/điểm thưởng
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
