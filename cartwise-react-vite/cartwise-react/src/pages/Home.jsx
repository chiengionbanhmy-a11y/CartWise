import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { categories } from '../data/products.js';

function Home({ appState, onOpenProduct, onNavigate }) {
  const { products, t, currency } = appState;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchCategory = category === 'Tất cả' || p.category === category;
      const haystack = [p.name, p.category, p.subCategory, p.description, ...(p.tags || [])].join(' ').toLowerCase();
      return matchCategory && (!q || haystack.includes(q));
    });
  }, [products, query, category]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">AI Shopping Assistant</span>
          <h1>CartWise giúp bạn tìm nơi mua rẻ hơn trong vài giây</h1>
          <p>So sánh giá, xem ưu đãi, đổi tiền tệ và nhận tư vấn từ Cawi Robo trước khi mua.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => onNavigate('stores')}>Khám phá điểm bán</button>
            <button className="secondary" onClick={() => onNavigate('flash')}>Xem Flash Sale</button>
          </div>
        </div>
        <div className="hero-card">
          <div className="score-ring">98%</div>
          <h3>Tỉ lệ tìm được giá tốt</h3>
          <p>Demo dữ liệu sản phẩm đa dạng: đồ uống, điện tử, đồ chơi, mỹ phẩm, học tập, gia dụng.</p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">Tìm kiếm thông minh</span>
          <h2>Tìm sản phẩm để so sánh ngay</h2>
        </div>
        <div className="search-panel">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} />
          <div className="category-tabs scroll-tabs">
            {categories.map((c) => <button key={c} className={category === c ? 'tab active' : 'tab'} onClick={() => setCategory(c)}>{c}</button>)}
          </div>
        </div>
        <div className="product-grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />)}
        </div>
      </section>
    </>
  );
}

export default Home;
