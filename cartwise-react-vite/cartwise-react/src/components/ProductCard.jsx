import { useEffect, useState } from 'react';
import { Clock3, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getBestFinalStore, getFinalCost, getPriceInsight, getOptimalSavingStats } from '../data/products.js';

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
  const priceInsight = getPriceInsight(product);
  const savingStats = getOptimalSavingStats(product);
  const StatusIcon = priceInsight.tone === 'good' ? TrendingDown : priceInsight.tone === 'warning' ? TrendingUp : Minus;
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
        <div className="product-card-topline-v38">
          <span className="category-chip">{product.subCategory}</span>
          <span className={`price-status-badge-v38 ${priceInsight.tone}`}><StatusIcon size={14} />{priceInsight.status}</span>
        </div>
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
          <strong>{bestFinal ? formatCurrency(getFinalCost(bestFinal), currency) : 'Chưa có dữ liệu'}</strong>
          {product.originalPrice && <span>{formatCurrency(product.originalPrice, currency)}</span>}
        </div>
        <div className="store-line">Dự kiến tốt nhất tại <b>{bestFinal?.storeName || 'đang cập nhật'}</b></div>
        {savingStats.saveMax > 0 && <div className="saving-line-v38">Tiết kiệm tối đa <b>{formatCurrency(savingStats.saveMax, currency)}</b></div>}
        <button className="primary full" onClick={() => onOpenProduct(product)}>So sánh tổng chi phí</button>
      </div>
      {product.discountPercent > 0 && <span className="discount-badge">-{product.discountPercent}%</span>}
    </article>
  );
}

export default ProductCard;
