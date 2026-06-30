import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { categoryGroups } from '../data/products.js';

function FlashSale({ appState, onOpenProduct }) {
  const { products, currency } = appState;
  const [active, setActive] = useState(categoryGroups[0] || 'Đồ điện tử');
  const saleProducts = useMemo(() => products.filter((p) => p.category === active), [products, active]);

  return (
    <section className="section-block page-block">
      <div className="section-heading center">
        <span className="eyebrow">Deal hot trong ngày</span>
        <h1>Flash Sale CartWise</h1>
        <p>Mỗi nhóm có 2 sản phẩm đại diện để so sánh nhanh giá thật sau cùng.</p>
      </div>
      <div className="category-tabs scroll-tabs big-tabs">
        {categoryGroups.map((tab) => <button key={tab} className={active === tab ? 'tab active' : 'tab'} onClick={() => setActive(tab)}>{tab}</button>)}
      </div>
      <div className="product-grid reveal">
        {saleProducts.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />)}
      </div>
    </section>
  );
}

export default FlashSale;
