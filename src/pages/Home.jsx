import { useEffect, useMemo, useState } from 'react';
import { Search, Mic, MapPin, ChevronRight, ChevronDown, X, Link2 } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import SavingsCounter from '../components/SavingsCounter.jsx';
import { categories, getBestFinalStore, getFinalCost, getStorePopularityScore } from '../data/products.js';
import { getPlan } from '../data/plans.js';
// v85 — "Dán link sản phẩm để so sánh": xem data/customProducts.js để biết chi tiết.
import { looksLikeUrl, getOrCreateCustomProduct } from '../data/customProducts.js';

function Home({ appState, onOpenProduct, onNavigate, onOpenUpgrade }) {
  const { products, currency, planId } = appState;
  const plan = getPlan(planId);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState(() => localStorage.getItem('cartwise-home-sort') || 'default');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => JSON.parse(localStorage.getItem('cartwise-search-history') || '[]'));
  const [visibleCount, setVisibleCount] = useState(8);
  const [locationPromptOpen, setLocationPromptOpen] = useState(() => !localStorage.getItem('cartwise-delivery-basis') && sessionStorage.getItem('cartwise-location-prompt-hidden') !== '1');
  const [manualAddress, setManualAddress] = useState('');

  const filtered = useMemo(() => {
    const matched = products.filter((p) => category === 'Tất cả' || p.category === category);

    if (sortBy === 'default') return matched;

    return [...matched].sort((a, b) => {
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
  }, [products, category, sortBy]);

  // v85 — Dán link sản phẩm: khi ô tìm kiếm chứa 1 link (thay vì tên sản phẩm), không
  // tìm theo tên nữa — hiện gợi ý riêng "Xem sản phẩm từ link này" (xem JSX bên dưới).
  const isUrlQuery = useMemo(() => looksLikeUrl(query), [query]);

  const searchSuggestions = useMemo(() => {
    if (isUrlQuery) return [];
    const q = query.trim().toLowerCase();
    if (q) {
      return products.filter((product) => product.name.toLowerCase().includes(q)).slice(0, 8);
    }

    if (!searchFocused || !searchHistory.length) return [];
    return searchHistory
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean)
      .slice(0, 6);
  }, [products, query, searchFocused, searchHistory, isUrlQuery]);

  useEffect(() => {
    setVisibleCount(8);
  }, [category, sortBy]);

  const dailyFlashIds = useMemo(() => {
    // v85: đã bỏ 3 cặp dùng sản phẩm không còn tồn tại (notebook/casio/lego-classic/teddy-bear).
    const plannedPairs = [
      ['mouse-logitech', 'powerbank-anker'],
      ['sunscreen', 'lipstick'],
      ['mini-fan', 'water-lavie-500']
    ];
    return new Set(plannedPairs[Math.floor(Date.now() / 86400000) % plannedPairs.length]);
  }, []);

  const visibleProducts = filtered.slice(0, visibleCount).map((product) => (
    dailyFlashIds.has(product.id)
      ? {
          ...product,
          flashSaleToday: true,
          discountPercent: product.discountPercent || 49,
          offerEndTime: Date.now() + 8 * 60 * 60 * 1000
        }
      : {
          ...product,
          flashSaleToday: false,
          discountPercent: 0,
          offerEndTime: null
        }
  ));
  const hasMoreProducts = visibleCount < filtered.length;

  function showMoreProducts() {
    setVisibleCount((count) => Math.min(count + 8, filtered.length));
  }

  function rememberSearch(product) {
    const next = [product.id, ...searchHistory.filter((id) => id !== product.id)].slice(0, 8);
    setSearchHistory(next);
    localStorage.setItem('cartwise-search-history', JSON.stringify(next));
  }

  function changeSort(nextSort) {
    setSortBy(nextSort);
    localStorage.setItem('cartwise-home-sort', nextSort);
  }

  function saveDeliveryBasis(next) {
    localStorage.setItem('cartwise-delivery-basis', JSON.stringify(next));
    setLocationPromptOpen(false);
    sessionStorage.setItem('cartwise-location-prompt-hidden', '1');
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      alert('Trình duyệt này chưa hỗ trợ lấy vị trí. Bạn có thể nhập khu vực giao hàng thủ công.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: Number(position.coords.latitude.toFixed(4)),
          lng: Number(position.coords.longitude.toFixed(4))
        };
        saveDeliveryBasis({ type: 'geo', label: `Vị trí hiện tại (${coords.lat}, ${coords.lng})`, coords });
      },
      () => alert('CartWise chưa lấy được vị trí. Bạn có thể nhập khu vực giao hàng thủ công.'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function saveManualAddress() {
    const clean = manualAddress.trim();
    if (!clean) {
      alert('Bạn hãy nhập khu vực giao hàng trước.');
      return;
    }
    saveDeliveryBasis({ type: 'manual', label: clean, address: clean });
  }

  // v85 — Mở màn hình so sánh cho 1 link sản phẩm bên ngoài: tạo (hoặc lấy lại nếu đã
  // từng dán link này trước đó — xem cache trong customProducts.js) rồi mở như 1 sản
  // phẩm bình thường, đủ 6 sàn (3 online + 3 offline).
  function openFromLink(rawUrl) {
    const product = getOrCreateCustomProduct(rawUrl);
    rememberSearch(product);
    setQuery('');
    setSearchFocused(false);
    onOpenProduct(product);
  }

  function handleSearchAction() {
    const raw = query.trim();
    if (!raw) return;
    if (looksLikeUrl(raw)) {
      openFromLink(raw);
      return;
    }
    const q = raw.toLowerCase();
    const firstMatch = products.find((product) => product.name.toLowerCase().includes(q));
    if (firstMatch) {
      rememberSearch(firstMatch);
      setQuery('');
      setSearchFocused(false);
      onOpenProduct(firstMatch);
    }
  }

  function selectSuggestion(product) {
    rememberSearch(product);
    setQuery('');
    setSearchFocused(false);
    onOpenProduct(product);
  }

  function focusSearchBox() {
    const input = document.querySelector('.browser-search-shell input');
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => input?.focus(), 360);
  }

  function stubFeature(name) {
    alert(`${name} đang ở chế độ demo giao diện. Mình có thể làm chức năng thật ở bản tiếp theo.`);
  }

  return (
    <>
      <section className="home-hero section-block minimal-hero">
        <div className="hero-top-tag">
          <span>✧</span>
          <span>Công cụ so sánh tổng chi phí mua sắm</span>
        </div>

        <h1 className="hero-title-center hero-title-stacked hero-title-cost-v49">
          <span className="hero-title-dark">Biết nơi mua rẻ nhất</span>
          <span className="hero-title-accent">chỉ trong một lần tìm kiếm.</span>
        </h1>
        <p className="hero-subline-v49">So sánh giá, phí vận chuyển và ưu đãi giữa nhiều nơi bán trong một màn hình.</p>
        <div className="browser-search-row">
          <div className="browser-search-shell">
            <Search size={24} className="shell-left-icon" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 160)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchAction();
              }}
              placeholder="Nhập tên sản phẩm hoặc dán link sản phẩm từ Shopee, Lazada, Tiki..."
            />
            <div className="shell-right-icons">
              <button className="shell-icon-btn" aria-label="Tìm bằng giọng nói" onClick={() => stubFeature('Tìm kiếm bằng giọng nói')}>
                <Mic size={22} />
              </button>
              <button className="shell-icon-btn highlight" aria-label="Tìm kiếm" onClick={handleSearchAction}>
                <Search size={22} />
              </button>
            </div>
          </div>

          {/* v85 — Dán link sản phẩm: khi ô tìm kiếm nhận ra 1 link (thay vì tên), hiện
              gợi ý riêng để mở màn hình so sánh cho đúng sản phẩm từ link đó — dữ liệu sẽ
              được lưu lại trên trình duyệt này để lần sau dán lại link cũ không phải chờ. */}
          {isUrlQuery && (
            <div className="search-suggestion-panel-v40 search-suggestion-panel-url-v85">
              <button type="button" className="search-suggestion-item-v40 search-suggestion-url-item-v85" onMouseDown={(event) => { event.preventDefault(); openFromLink(query); }}>
                <span className="search-suggestion-url-icon-v85"><Link2 size={20} /></span>
                <span>
                  <b>So sánh sản phẩm từ link này</b>
                  <small>CartWise sẽ tạo màn hình so sánh đủ 6 sàn (3 online + 3 offline) — dữ liệu ước tính, lưu lại cho lần xem sau</small>
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {!isUrlQuery && searchSuggestions.length > 0 && (
            <div className="search-suggestion-panel-v40">
              {searchSuggestions.map((product) => (
                <button key={product.id} type="button" className="search-suggestion-item-v40" onMouseDown={(event) => { event.preventDefault(); selectSuggestion(product); }}>
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span>
                    <b>{product.name}</b>
                    <small>{query.trim() ? product.category : `Lịch sử · ${product.category}`}</small>
                  </span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="scroll-tabs home-tabs centered-tabs">
          {categories.map((c) => (
            <button key={c} className={category === c ? 'tab active' : 'tab'} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        <div className="hero-stats-strip">
          <div><strong>8</strong><span>Sản phẩm mẫu</span></div>
          <div><strong>6+</strong><span>Nơi bán online và trực tiếp</span></div>
          <div><strong>Tổng phí</strong><span>Giá sản phẩm + phí vận chuyển</span></div>
        </div>

        <div className="hero-cta-row">
          <button className="primary hero-cta-main-v81" onClick={focusSearchBox}>
            <Search size={22} /> Thử so sánh ngay
          </button>
          <button className="secondary" onClick={() => onNavigate('flash')}>Xem Flash Sale hôm nay</button>
        </div>
      </section>

      {plan.savingsCounter.variant === 'prominent' && (
        <section className="section-block savings-counter-section-v63">
          <SavingsCounter
            variant="prominent"
            maxBadges={plan.savingsCounter.maxBadges}
            currency={currency}
            onOpenUpgrade={onOpenUpgrade}
            onOpenAchievements={() => onNavigate('savings-achievements')}
          />
        </section>
      )}

      {locationPromptOpen && (
        <div className="location-notice-v40" role="dialog" aria-label="Thiết lập khu vực giao hàng">
          <button
            type="button"
            className="location-notice-close-v40"
            onClick={() => {
              setLocationPromptOpen(false);
              sessionStorage.setItem('cartwise-location-prompt-hidden', '1');
            }}
            aria-label="Đóng thông báo vị trí"
          >
            <X size={18} />
          </button>
          <div className="location-notice-copy-v40">
            <span className="location-notice-chip-v40"><MapPin size={16} /> Thiết lập giao hàng</span>
            <h3>Cho phép CartWise lấy vị trí hoặc nhập khu vực giao hàng</h3>
            <p>Thiết lập một lần để CartWise có căn cứ ước tính phí vận chuyển online rõ ràng hơn ngay từ trang chủ.</p>
          </div>
          <div className="location-notice-actions-v40">
            <button className="secondary" type="button" onClick={requestLocation}>Cho phép lấy vị trí</button>
            <div className="location-notice-input-v40">
              <input value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} placeholder="Nhập khu vực giao hàng" />
              <button className="ghost" type="button" onClick={saveManualAddress}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      <section className="section-block compact-products">
        <div className="section-heading center home-products-heading-clean">
          <h2>Sản phẩm</h2>
          <p>So sánh tổng chi phí dự kiến trước khi mua.</p>
        </div>

        <div className="home-filter-summary-v39">
          <div>
            <span>Danh mục hiện tại</span>
            <b>{category}</b>
            <small>{filtered.length} sản phẩm đang hiển thị</small>
          </div>
          <label>
            <span>Sắp xếp kết quả</span>
            <select value={sortBy} onChange={(event) => changeSort(event.target.value)}>
              <option value="default">Mặc định</option>
              <option value="total">Tổng chi phí thấp nhất</option>
              <option value="shipping">Phí vận chuyển thấp nhất</option>
              <option value="popular">Nơi bán phổ biến</option>
            </select>
          </label>
        </div>

        <div className="product-grid">
          {visibleProducts.map((p) => <ProductCard key={p.id} product={p} currency={currency} onOpenProduct={onOpenProduct} />)}
        </div>

        {hasMoreProducts && (
          <div className="load-more-wrap-v42">
            <button type="button" className="load-more-btn-v42" onClick={showMoreProducts}>
              <span>Xem thêm</span>
              <ChevronDown size={22} />
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
