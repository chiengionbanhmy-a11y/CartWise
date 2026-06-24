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

  function stubFeature(name) {
    alert(`${name} đang ở chế độ demo giao diện. Nếu bạn muốn, mình có thể làm tiếp chức năng thật ở bản cập nhật sau.`);
  }

  return (
    <>
      <section className="home-hero section-block">
        <div className="hero-top-tag">
          <span>✧</span>
          <span>Mua sắm thông minh hơn mỗi ngày</span>
        </div>

        <h1 className="hero-title-center">
          <span className="hero-title-dark">Smart Cart, </span>
          <span className="hero-title-accent">Smart Decisions</span>
        </h1>

        <div className="hero-search-wrap">
          <div className="hero-search-input">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm sản phẩm bạn muốn so sánh giá..."
            />
            <button className="icon-btn search-btn" aria-label="Tìm kiếm">🔍</button>
          </div>
          <button className="utility-btn" onClick={() => stubFeature('Tải ảnh / chụp ảnh')}>📷 Tải ảnh / chụp ảnh</button>
          <button className="utility-btn" onClick={() => stubFeature('Quét mã vạch')}>▦ Quét mã vạch</button>
        </div>

        <div className="category-tabs scroll-tabs home-tabs">
          {categories.map((c) => (
            <button key={c} className={category === c ? 'tab active' : 'tab'} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        <div className="hero-cta-row">
          <button className="primary" onClick={() => onNavigate('stores')}>Khám phá điểm bán</button>
          <button className="secondary" onClick={() => onNavigate('flash')}>Xem Flash Sale</button>
        </div>
      </section>

      <section className="section-block compact-products">
        <div className="section-heading center">
          <span className="eyebrow">Gợi ý nổi bật</span>
          <h2>Sản phẩm đang được tìm kiếm nhiều</h2>
          <p>Chọn một sản phẩm để xem chi tiết, so sánh giá và mở link mua trực tiếp.</p>
        </div>
        <div className="product-grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />)}
        </div>
      </section>
    </>
  );
}

export default Home;
