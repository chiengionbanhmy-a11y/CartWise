import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';

const flashTabs = ['Đồ uống', 'Đồ ăn', 'Điện tử', 'Chuột & phụ kiện', 'Đồ chơi', 'Mỹ phẩm', 'Học tập', 'Gia dụng'];

function FlashSale({ appState, onOpenProduct }) {
  const { products, currency } = appState;
  const [active, setActive] = useState('Đồ uống');
  const saleProducts = useMemo(() => {
    if (active === 'Gia dụng') return products.filter((p) => ['Gia dụng', 'Nội thất'].includes(p.category));
    if (active === 'Đồ ăn') return products.filter((p) => p.category === 'Đồ ăn');
    return products.filter((p) => p.category === active);
  }, [products, active]);

  return (
    <section className="section-block page-block">
      <div className="section-heading center">
        <span className="eyebrow">Deal hot trong ngày</span>
        <h1>Flash Sale CartWise</h1>
        <p>Bấm từng đề mục để xem sản phẩm đang có ưu đãi.</p>
      </div>
      <div className="category-tabs scroll-tabs big-tabs">
        {flashTabs.map((tab) => <button key={tab} className={active === tab ? 'tab active' : 'tab'} onClick={() => setActive(tab)}>{tab}</button>)}
      </div>
      <div className="product-grid reveal">
        {saleProducts.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />)}
      </div>
    </section>
  );
}

export default FlashSale;
