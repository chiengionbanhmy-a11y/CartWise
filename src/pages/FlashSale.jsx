import { useMemo } from 'react';
import ProductCard from '../components/ProductCard.jsx';

const dailyFlashPairs = [
  ['lego-classic', 'teddy-bear'],
  ['rice-cooker', 'notebook'],
  ['mouse-logitech', 'powerbank-anker'],
  ['sunscreen', 'lipstick'],
  ['mini-fan', 'water-lavie-500'],
  ['haohao', 'casio']
];

function pickDailyFlashProducts(products = []) {
  if (!products.length) return [];
  const dayIndex = Math.floor(Date.now() / 86400000) % dailyFlashPairs.length;
  const selected = dailyFlashPairs[dayIndex]
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  if (selected.length >= 2) return selected;

  const start = (Math.floor(Date.now() / 86400000) * 2) % products.length;
  return [products[start], products[(start + 1) % products.length]].filter(Boolean);
}

function FlashSale({ appState, onOpenProduct }) {
  const { products, currency } = appState;
  const saleProducts = useMemo(() => {
    return pickDailyFlashProducts(products).map((p, index) => ({
      ...p,
      discountPercent: index === 0 ? 49 : 39,
      flashSaleToday: true,
      offerEndTime: Date.now() + (index === 0 ? 8 : 12) * 60 * 60 * 1000
    }));
  }, [products]);

  return (
    <section className="section-block page-block flash-page-v30">
      <div className="section-heading center">
        <span className="eyebrow">Deal hot hôm nay</span>
        <h1>Flash Sale CartWise</h1>
      </div>
      <div className="flash-alert-v30">
        <b>Đổi deal mỗi ngày</b>
        <span>Hôm nay: {saleProducts.map((product) => product.name).join(' và ')}</span>
      </div>
      <div className="product-grid reveal flash-grid-v30">
        {saleProducts.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />)}
      </div>
    </section>
  );
}

export default FlashSale;
