import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';

function Stores({ appState, onOpenProduct }) {
  const { products, currency } = appState;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const categories = ['Tất cả', ...new Set(products.map((item) => item.category))];

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchQuery = product.name.toLowerCase().includes(query.toLowerCase());
    const matchCategory = category === 'Tất cả' || product.category === category;
    return matchQuery && matchCategory;
  }), [products, query, category]);

  return (
    <div className="page-stack">
      <section className="simple-hero stores">
        <span className="eyebrow">Price Comparison</span>
        <h1>So sánh sản phẩm theo tổng chi phí</h1>
        <p>Không chỉ xem giá niêm yết, CartWise tính cả phí ship, voucher, thời gian giao và độ tin cậy nơi bán.</p>
      </section>

      <div className="store-filters">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nhập tên sản phẩm cần so sánh..." />
        <div>
          {categories.map((item) => (
            <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => <ProductCard key={product.id} product={product} currency={currency} onOpenProduct={onOpenProduct} />)}
      </div>
    </div>
  );
}

export default Stores;
