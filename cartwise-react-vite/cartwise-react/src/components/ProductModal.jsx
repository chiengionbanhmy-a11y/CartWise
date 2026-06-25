import { currencies, formatCurrency, getBestOffer } from '../data/products.js';

function ProductModal({ product, currency, onCurrencyChange, onClose }) {
  const offers = product.stores
    .map((offer) => ({ ...offer, total: offer.price + offer.shipping - offer.voucher }))
    .sort((a, b) => a.total - b.total || b.trust - a.trust);
  const best = getBestOffer(product);
  const saving = Math.max(0, product.baseline - best.total);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-label="Chi tiết so sánh sản phẩm" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Đóng">×</button>
        <div className="modal-hero">
          <div className="modal-emoji">{product.image}</div>
          <div>
            <span className="category-pill">{product.category}</span>
            <h2>{product.name}</h2>
            <p>CartWise so sánh tổng chi phí thực trả gồm giá sản phẩm, phí vận chuyển và voucher.</p>
            <div className="modal-stats">
              <span>★ {product.rating}</span>
              <span>Need Score {product.needScore}/10</span>
              <span>Tiết kiệm {formatCurrency(saving, currency)}</span>
            </div>
          </div>
        </div>

        <div className="currency-row">
          <span>Quy đổi nhanh:</span>
          {currencies.map((item) => (
            <button
              key={item.code}
              className={currency === item.code ? 'active' : ''}
              type="button"
              onClick={() => onCurrencyChange(item.code)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="offer-table" role="table" aria-label="Bảng giá so sánh">
          <div className="offer-head" role="row">
            <span>Nơi bán</span>
            <span>Giá</span>
            <span>Ship</span>
            <span>Voucher</span>
            <span>Tổng trả</span>
            <span>Độ tin cậy</span>
          </div>
          {offers.map((offer, index) => (
            <div className={`offer-row ${index === 0 ? 'best' : ''}`} role="row" key={offer.store}>
              <span>{offer.store}{index === 0 && <b> Rẻ nhất</b>}</span>
              <span>{formatCurrency(offer.price, currency)}</span>
              <span>{formatCurrency(offer.shipping, currency)}</span>
              <span>-{formatCurrency(offer.voucher, currency)}</span>
              <strong>{formatCurrency(offer.total, currency)}</strong>
              <span>{offer.trust}/5 · {offer.delivery}</span>
            </div>
          ))}
        </div>

        <div className="modal-note">
          <strong>Gợi ý của Cawi:</strong> lựa chọn tốt nhất không chỉ là giá niêm yết thấp nhất. CartWise ưu tiên tổng chi phí thực trả, độ tin cậy và thời gian giao hàng.
        </div>
      </section>
    </div>
  );
}

export default ProductModal;
