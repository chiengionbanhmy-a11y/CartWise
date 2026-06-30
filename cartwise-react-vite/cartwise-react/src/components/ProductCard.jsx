import { formatCurrency } from '../data/currency.js';
import { getBestFinalStore, getFinalCost } from '../data/products.js';

function ProductCard({ product, currency = 'VND', onOpenProduct }) {
  const bestFinal = getBestFinalStore(product);
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
        <div className="price-row final-card-price">
          <small>Giá thật sau cùng từ</small>
          <strong>{formatCurrency(getFinalCost(bestFinal), currency)}</strong>
          {product.originalPrice && <span>{formatCurrency(product.originalPrice, currency)}</span>}
        </div>
        <div className="store-line">Tiết kiệm nhất tại <b>{bestFinal.storeName}</b></div>
        <button className="primary full" onClick={() => onOpenProduct(product)}>So sánh giá thật</button>
      </div>
      {product.discountPercent > 0 && <span className="discount-badge">-{product.discountPercent}%</span>}
    </article>
  );
}

export default ProductCard;
