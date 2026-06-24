import { useEffect, useMemo, useState } from 'react';
import CawiRobot from './CawiRobot.jsx';
import { formatCurrency } from '../data/currency.js';
import { getBestStore, getSavingAmount } from '../data/products.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];

function getCountdown(endTime) {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
  const total = Math.floor(diff / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function ProductModal({ product, currency, onCurrencyChange, onClose }) {
  const [localCurrency, setLocalCurrency] = useState(currency || 'VND');
  const [countdown, setCountdown] = useState(product.offerEndTime ? getCountdown(product.offerEndTime) : null);
  const best = useMemo(() => getBestStore(product), [product]);
  const saving = useMemo(() => getSavingAmount(product), [product]);

  useEffect(() => {
    if (!product.offerEndTime) return;
    const timer = setInterval(() => setCountdown(getCountdown(product.offerEndTime)), 1000);
    return () => clearInterval(timer);
  }, [product.offerEndTime]);

  function selectCurrency(cur) {
    setLocalCurrency(cur);
    onCurrencyChange?.(cur);
  }

  return (
    <div className="modal-backdrop product-backdrop" role="dialog" aria-modal="true">
      <div className="product-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-grid">
          <section className="modal-image-panel">
            <img src={product.image} alt={product.name} />
            <div className="quick-convert">
              <h4>Quy đổi tiền tệ nhanh</h4>
              <div className="currency-grid compact">
                {currencies.map((cur) => (
                  <button key={cur} className={localCurrency === cur ? 'choice active' : 'choice'} onClick={() => selectCurrency(cur)}>{cur}</button>
                ))}
              </div>
              <small>Quy đổi tham khảo từ VNĐ.</small>
            </div>
          </section>

          <section className="modal-info-panel">
            <span className="category-chip">{product.category} · {product.subCategory}</span>
            <h2>{product.name}</h2>
            <p>{product.description}</p>

            <div className="best-price-box">
              <span>Giá tốt nhất</span>
              <strong>{formatCurrency(best.storePrice, localCurrency)}</strong>
              <p>Rẻ nhất tại <b>{best.storeName}</b></p>
              {saving > 0 && <em>Tiết kiệm lên tới {formatCurrency(saving, localCurrency)}</em>}
              {countdown && <div className="countdown">Ưu đãi sắp hết: <b>{countdown}</b></div>}
            </div>

            <h3>Bảng so sánh giá</h3>
            <div className="store-table">
              {product.stores.map((store) => {
                const isBest = store.storeName === best.storeName;
                return (
                  <div className={isBest ? 'store-row best' : 'store-row'} key={store.storeName}>
                    <div>
                      <strong>{store.storeName}</strong>
                      {isBest && <span className="best-label">Giá tốt nhất</span>}
                    </div>
                    <b>{formatCurrency(store.storePrice, localCurrency)}</b>
                    <a href={store.storeUrl} target="_blank" rel="noreferrer">Mua ở đây</a>
                  </div>
                );
              })}
            </div>

            <div className="modal-robot-area">
              <CawiRobot
                mode="inline"
                message={saving > 0 ? `Bạn có thể tiết kiệm lên tới ${formatCurrency(saving, localCurrency)} tại ${best.storeName}!` : `Mình thấy ${best.storeName} đang có giá tốt nhất.`}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
