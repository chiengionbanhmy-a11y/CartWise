import ProductCard from '../components/ProductCard.jsx';

const categories = [
  { label: 'Đồ uống', icon: '🥤' },
  { label: 'Thực phẩm', icon: '🛒' },
  { label: 'Điện tử', icon: '💻' },
  { label: 'Gia dụng', icon: '🏠' },
  { label: 'Mỹ phẩm', icon: '🧴' },
  { label: 'Thời trang', icon: '👕' }
];

function Home({ appState, onOpenProduct, onNavigate }) {
  const { t, products, currency } = appState;

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">CartWise AI Shopping Assistant</span>
          <h1>So sánh giá thông minh<br />Mua sắm tiết kiệm</h1>
          <p>So sánh giá từ nhiều cửa hàng uy tín, tính tổng chi phí thực trả và nhận gợi ý mua hàng phù hợp.</p>
          <div className="hero-actions">
            <button type="button" onClick={() => onNavigate('stores')}>{t.compareNow}</button>
            <button type="button" onClick={() => onNavigate('flash')}>{t.viewDeals}</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <span>🏷️</span><span>💸</span><span>🛍️</span><span>⚡</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>{t.popularCategories}</h2>
          <button type="button" onClick={() => onNavigate('stores')}>Xem tất cả</button>
        </div>
        <div className="category-grid">
          {categories.map((item) => (
            <button className="category-card" type="button" key={item.label} onClick={() => onNavigate('stores')}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>{t.featuredProducts}</h2>
          <button type="button" onClick={() => onNavigate('stores')}>Xem tất cả</button>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} currency={currency} onOpenProduct={onOpenProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
