import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getBestFinalStore, getFinalCost } from '../data/products.js';

function formatCountdown(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return 'Đã kết thúc';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function ProductCard({ product, currency = 'VND', onOpenProduct }) {
  const [now, setNow] = useState(Date.now());
  const bestFinal = getBestFinalStore(product);
  const showCountdown = product.flashSaleToday && product.offerEndTime && product.offerEndTime > now;

  useEffect(() => {
    if (!product.flashSaleToday) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [product.flashSaleToday]);

  return (
    <article className="product-card premium-product-card">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        onError={(event) => {
          if (product.fallbackImage && event.currentTarget.src !== product.fallbackImage) {
            event.currentTarget.src = product.fallbackImage;
          }
        }}
      />
      <div className="product-body">
        <span className="category-chip">{product.subCategory}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        {showCountdown && (
          <div className="card-countdown-v31">
            <Clock3 size={16} />
            <span>Kết thúc sau <b>{formatCountdown(product.offerEndTime - now)}</b></span>
          </div>
        )}
        <div className="price-row final-card-price">
          <small>Tổng chi phí dự kiến từ</small>
          <strong>{formatCurrency(getFinalCost(bestFinal), currency)}</strong>
          {product.originalPrice && <span>{formatCurrency(product.originalPrice, currency)}</span>}
        </div>
        <div className="store-line">Dự kiến tốt nhất tại <b>{bestFinal.storeName}</b></div>
        <button className="primary full" onClick={() => onOpenProduct(product)}>So sánh tổng chi phí</button>
      </div>
      {product.discountPercent > 0 && <span className="discount-badge">-{product.discountPercent}%</span>}
    </article>
  );
}

export default ProductCard;
