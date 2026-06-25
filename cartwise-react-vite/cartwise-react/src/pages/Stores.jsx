import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';

const groups = ['Đồ ăn', 'Đồ uống', 'Điện tử', 'Chuột & phụ kiện', 'Đồ chơi', 'Mỹ phẩm', 'Học tập', 'Gia dụng', 'Nội thất'];

function Stores({ appState, onOpenProduct }) {
  const { products, currency } = appState;
  const [openGroup, setOpenGroup] = useState('Đồ uống');
  const list = useMemo(() => products.filter((p) => p.category === openGroup), [products, openGroup]);

  return (
    <section className="section-block page-block">
      <div className="section-heading center">
        <span className="eyebrow">Điểm bán</span>
        <h1>So sánh sản phẩm theo từng nhóm</h1>
        <p>Bấm “Xem” để mở danh sách sản phẩm và biết nơi nào đang bán rẻ hơn.</p>
      </div>
      <div className="store-group-grid">
        {groups.map((g) => (
          <article key={g} className={openGroup === g ? 'store-group active' : 'store-group'}>
            <h3>{g}</h3>
            <p>{products.filter((p) => p.category === g).length || 0} sản phẩm demo</p>
            <button className={openGroup === g ? 'dark-btn' : 'primary'} onClick={() => setOpenGroup(g)}>Xem</button>
          </article>
        ))}
      </div>
      <div className="section-heading compact">
        <h2>Đang xem: {openGroup}</h2>
        <p>Mỗi sản phẩm có bảng so sánh giá chi tiết khi bấm vào.</p>
      </div>
      <div className="product-grid">
        {list.length ? list.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />) : <p className="empty-state">Nhóm này chưa có dữ liệu, hãy thêm sản phẩm vào products.js.</p>}
      </div>
    </section>
  );
}

export default Stores;
