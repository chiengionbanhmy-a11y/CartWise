import ProductCard from '../components/ProductCard.jsx';

function FlashSale({ appState, onOpenProduct }) {
  const { products, currency } = appState;
  const sorted = [...products].sort((a, b) => b.baseline - a.baseline);

  return (
    <div className="page-stack">
      <section className="simple-hero flash">
        <span className="eyebrow">Flash Sale</span>
        <h1>Ưu đãi hot đang diễn ra</h1>
        <p>CartWise giúp bạn phân biệt giá giảm thật với giá chỉ nhìn có vẻ rẻ nhờ tính tổng chi phí thực trả.</p>
      </section>
      <div className="deal-tabs">
        <span>Đang diễn ra</span><span>Rẻ nhất hôm nay</span><span>Freeship</span><span>Voucher mạnh</span>
      </div>
      <div className="product-grid">
        {sorted.map((product) => <ProductCard key={product.id} product={product} currency={currency} onOpenProduct={onOpenProduct} />)}
      </div>
    </div>
  );
}

export default FlashSale;
