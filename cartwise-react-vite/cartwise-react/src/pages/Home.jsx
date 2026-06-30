import { useMemo, useState } from 'react';
import { Search, Mic, ScanLine } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { categories } from '../data/products.js';

function Home({ appState, onOpenProduct, onNavigate }) {
  const { products, currency } = appState;
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

  const topProducts = filtered.slice(0, 8);
  function stubFeature(name) {
    alert(`${name} đang ở chế độ demo giao diện. Mình có thể làm chức năng thật ở bản tiếp theo.`);
  }

  return (
    <>
      <section className="home-hero section-block minimal-hero">
        <div className="hero-top-tag">
          <span>✧</span>
          <span>Mua sắm thông minh hơn mỗi ngày</span>
        </div>

        <h1 className="hero-title-center">
          <span className="hero-title-dark">Smart Cart, </span>
          <span className="hero-title-accent">Smart Decisions</span>
        </h1>

        <div className="browser-search-row">
          <div className="browser-search-shell">
            <Search size={24} className="shell-left-icon" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm trên CartWise hoặc nhập tên sản phẩm"
            />
            <div className="shell-right-icons">
              <button className="shell-icon-btn" aria-label="Tìm bằng giọng nói" onClick={() => stubFeature('Tìm kiếm bằng giọng nói')}>
                <Mic size={22} />
              </button>
              <button className="shell-icon-btn highlight" aria-label="Tìm kiếm" onClick={() => stubFeature('Tìm kiếm')}>
                <Search size={22} />
              </button>
            </div>
          </div>
          <button className="utility-tile" onClick={() => stubFeature('Quét mã vạch')}>
            <ScanLine size={22} />
            <span>Quét mã vạch</span>
          </button>
        </div>

        <div className="scroll-tabs home-tabs centered-tabs">
          {categories.map((c) => (
            <button key={c} className={category === c ? 'tab active' : 'tab'} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        <div className="hero-stats-strip">
          <div><strong>2/mục</strong><span>Sản phẩm đại diện</span></div>
          <div><strong>6</strong><span>Điểm bán mỗi sản phẩm</span></div>
          <div><strong>Giá thật</strong><span>Tính tổng chi phí</span></div>
        </div>

        <div className="hero-cta-row">
          <button className="primary" onClick={() => onNavigate('stores')}>Khám phá điểm bán</button>
          <button className="secondary" onClick={() => onNavigate('flash')}>Xem Flash Sale</button>
        </div>
      </section>

      <section className="section-block compact-products">
        <div className="section-heading center">
          <span className="eyebrow">Gợi ý nổi bật</span>
          <h2>Những sản phẩm được xem nhiều hôm nay</h2>
          <p>Giao diện sang trọng, rõ ràng và tập trung vào tổng tiền thật sự phải trả.</p>
        </div>
        <div className="product-grid">
          {topProducts.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />)}
        </div>
      </section>
    </>
  );
}

export default Home;
