import { formatCurrency } from '../data/currency.js';
import { getBestStore } from '../data/products.js';

function ProductCard({ product, currency = 'VND', onOpenProduct }) {
  const best = getBestStore(product);
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="product-body">
        <span className="category-chip">{product.subCategory}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="price-row">
          <strong>{formatCurrency(best.storePrice, currency)}</strong>
          {product.originalPrice && <span>{formatCurrency(product.originalPrice, currency)}</span>}
        </div>
        <div className="store-line">Rẻ nhất tại <b>{best.storeName}</b></div>
        <button className="primary full" onClick={() => onOpenProduct(product)}>So sánh</button>
      </div>
      {product.discountPercent > 0 && <span className="discount-badge">-{product.discountPercent}%</span>}
    </article>
  );
}

export default ProductCard;
