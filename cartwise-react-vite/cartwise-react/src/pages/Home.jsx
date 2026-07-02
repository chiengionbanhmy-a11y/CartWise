import { useMemo, useState } from 'react';
import { Search, Mic } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { categories, getBestFinalStore, getFinalCost, getStorePopularityScore } from '../data/products.js';

function Home({ appState, onOpenProduct, onNavigate }) {
  const { products, currency } = appState;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('popular');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = products.filter((p) => {
      const matchCategory = category === 'Tất cả' || p.category === category;
      const haystack = [p.name, p.category, p.subCategory, p.description, ...(p.tags || [])].join(' ').toLowerCase();
      return matchCategory && (!q || haystack.includes(q));
    });

    return matched.sort((a, b) => {
      const bestA = getBestFinalStore(a);
      const bestB = getBestFinalStore(b);
      if (sortBy === 'total') {
        return (bestA ? getFinalCost(bestA) : Number.POSITIVE_INFINITY) - (bestB ? getFinalCost(bestB) : Number.POSITIVE_INFINITY);
      }
      if (sortBy === 'shipping') {
        return Number(bestA?.shippingFee ?? Number.POSITIVE_INFINITY) - Number(bestB?.shippingFee ?? Number.POSITIVE_INFINITY);
      }
      return getStorePopularityScore(bestA?.storeName) - getStorePopularityScore(bestB?.storeName);
    });
  }, [products, query, category, sortBy]);

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

        <h1 className="hero-title-center hero-title-stacked">
          <span className="hero-title-dark">Smart Cart,</span>
          <span className="hero-title-accent">Smart Decisions.</span>
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
        </div>

        <div className="scroll-tabs home-tabs centered-tabs">
          {categories.map((c) => (
            <button key={c} className={category === c ? 'tab active' : 'tab'} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        <div className="home-filter-summary-v38">
          <div>
            <span>Danh mục hiện tại</span>
            <b>{category}</b>
            <small>{filtered.length} sản phẩm phù hợp{query ? ` cho “${query}”` : ''}</small>
          </div>
          <label>
            <span>Sắp xếp kết quả</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="popular">Nơi bán phổ biến</option>
              <option value="total">Tổng chi phí thấp nhất</option>
              <option value="shipping">Phí vận chuyển thấp nhất</option>
            </select>
          </label>
        </div>

        <div className="hero-stats-strip">
          <div><strong>2/mục</strong><span>Sản phẩm đại diện</span></div>
          <div><strong>6</strong><span>Điểm bán mỗi sản phẩm</span></div>
          <div><strong>Dự kiến</strong><span>So sánh chi phí</span></div>
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
          <p>Giao diện sang trọng, rõ ràng và tập trung vào tổng chi phí dự kiến cần trả.</p>
        </div>
        <div className="product-grid">
          {topProducts.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />)}
        </div>
      </section>
    </>
  );
}

export default Home;
