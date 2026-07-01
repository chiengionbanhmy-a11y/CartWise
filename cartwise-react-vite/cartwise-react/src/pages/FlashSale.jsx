import { useMemo } from 'react';
import ProductCard from '../components/ProductCard.jsx';

function FlashSale({ appState, onOpenProduct }) {
  const { products, currency } = appState;
  const saleProducts = useMemo(() => {
    const chosen = products.filter((p) => p.flashSaleToday).slice(0, 2);
    const fallback = chosen.length ? chosen : products.slice(0, 2);
    return fallback.map((p) => ({ ...p, discountPercent: 49, flashSaleToday: true }));
  }, [products]);

  return (
    <section className="section-block page-block flash-page-v30">
      <div className="section-heading center">
        <span className="eyebrow">Deal hot hôm nay</span>
        <h1>Flash Sale CartWise</h1>
        <p>Hôm nay CartWise chỉ chọn 1–2 sản phẩm giảm sâu để bạn không bị rối khi so sánh.</p>
      </div>
      <div className="flash-alert-v30">
        <b>Giảm 49%</b>
        <span>Flash sale hôm nay chỉ áp dụng cho một số sản phẩm nổi bật.</span>
      </div>
      <div className="product-grid reveal flash-grid-v30">
        {saleProducts.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />)}
      </div>
    </section>
  );
}

export default FlashSale;
