import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { categoryGroups } from '../data/products.js';

function Stores({ appState, onOpenProduct }) {
  const { products, currency } = appState;
  const [openGroup, setOpenGroup] = useState(categoryGroups[0] || 'Đồ điện tử');
  const list = useMemo(() => products.filter((p) => p.category === openGroup), [products, openGroup]);

  return (
    <section className="section-block page-block">
      <div className="section-heading center">
        <span className="eyebrow">Điểm bán</span>
        <h1>So sánh theo từng nhóm sản phẩm</h1>
        <p>Mỗi nhóm chỉ giữ 2 sản phẩm đại diện để demo rõ tính năng “So sánh tổng chi phí dự kiến”.</p>
      </div>
      <div className="store-group-grid">
        {categoryGroups.map((g) => (
          <article key={g} className={openGroup === g ? 'store-group active' : 'store-group'}>
            <h3>{g}</h3>
            <p>{products.filter((p) => p.category === g).length || 0} sản phẩm đại diện</p>
            <button className={openGroup === g ? 'dark-btn' : 'primary'} onClick={() => setOpenGroup(g)}>Xem</button>
          </article>
        ))}
      </div>
      <div className="section-heading compact">
        <h2>Đang xem: {openGroup}</h2>
        <p>Bấm “So sánh” để xem tổng chi phí dự kiến.</p>
      </div>
      <div className="product-grid">
        {list.length ? list.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />) : <p className="empty-state">Nhóm này chưa có dữ liệu.</p>}
      </div>
    </section>
  );
}

export default Stores;
