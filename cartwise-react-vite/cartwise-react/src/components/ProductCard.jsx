import { formatCurrency, getBestOffer } from '../data/products.js';

function ProductCard({ product, currency = 'VND', onOpenProduct }) {
  const best = getBestOffer(product);
  const saving = Math.max(0, product.baseline - best.total);

  return (
    <article className="product-card">
      <div className="product-emoji">{product.image}</div>
      <div className="product-info">
        <span className="category-pill">{product.category}</span>
        <h3>{product.name}</h3>
        <p>★ {product.rating} ({product.reviews})</p>
      </div>
      <div className="product-bottom">
        <div>
          <small>Nơi tốt nhất</small>
          <strong>{best.store}</strong>
        </div>
        <div>
          <small>Tổng trả</small>
          <strong>{formatCurrency(best.total, currency)}</strong>
        </div>
      </div>
      <div className="product-save">Tiết kiệm tới {formatCurrency(saving, currency)}</div>
      <button className="card-button" type="button" onClick={() => onOpenProduct(product)}>Xem so sánh</button>
    </article>
  );
}

export default ProductCard;
