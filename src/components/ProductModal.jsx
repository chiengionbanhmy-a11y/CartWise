import { useEffect, useMemo, useState } from 'react';
import { MapPin, Truck, Store, Smartphone, ChevronDown, Clock3, TrendingDown, TrendingUp, Minus, BarChart3, Star, Sparkles, X, ChevronRight, ShoppingCart, Check, Navigation, Settings, Lock, Wand2 } from 'lucide-react';
// v82 — không còn render CawiRobot trong khung so sánh (xem modal-advisor-slot bên dưới), import giữ comment lại để không xoá hẳn:
// import CawiRobot from './CawiRobot.jsx';
import AIReviewSummary from './AIReviewSummary.jsx';
import BuySignalCard from './BuySignalCard.jsx';
import SpendingAdvisorCard from './SpendingAdvisorCard.jsx';
import { convertCurrency, formatCurrency, formatInputNumber, toVndAmount } from '../data/currency.js';
import { getStoreLogo, getOptimalSavingStats, getPriceHistory, getPriceInsight, getStorePopularityScore, getStoreDistanceLabel, getBuySignal } from '../data/products.js';
import { getReviewData } from '../data/reviews.js';
import { getPlan } from '../data/plans.js';
// v81 — Nút tự khai "Đã mua/Chưa mua" trong khung so sánh đã BỊ ẨN ở v84 theo yêu cầu
// (xem giải thích chi tiết ở khối markPurchased/markNotPurchased bên dưới) — cách tự
// khai chính giờ là popup tự động "Bạn đã mua chưa?" sau khi bấm "Mua tại đây" (v83,
// PurchaseConfirmationModal.jsx). isPurchaseReported/removeSelfReportedPurchase vẫn
// import vì addSelfReportedPurchase (App.jsx) và logic bên dưới còn cần tới.
import { isPurchaseReported, addSelfReportedPurchase, removeSelfReportedPurchase } from '../data/purchases.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];
const onlineStores = ['Shopee', 'Lazada', 'Tiki'];
// v84 — Bản đồ khuyến nghị rút gọn, dùng cho huy hiệu "Cawi Tín Hiệu Mua" gọn ở cột
// trái (xem BuySignalBadgeCompact) — trùng với recoMeta trong BuySignalCard.jsx vì đó
// là component riêng, không export sẵn bản đồ này ra ngoài để dùng chung.
const compactSignalMeta = {
  buy: { icon: TrendingDown, label: 'Mua ngay', tone: 'good' },
  wait: { icon: TrendingUp, label: 'Nên chờ', tone: 'warning' },
  neutral: { icon: Minus, label: 'Có thể mua', tone: 'stable' }
};

// v84 — Huy hiệu gọn cho "Cawi Tín Hiệu Mua" ở cột trái (ảnh sản phẩm), thay cho toàn
// bộ BuySignalCard trước đây — theo góp ý UX "cột trái chỉ nên còn ảnh + nút thêm giỏ
// hàng + biểu đồ lịch sử giá + huy hiệu tín hiệu mua", phần phân tích đầy đủ dời vào
// khung "Trợ lý Cawi" gộp chung ở cột phải (xem cawi-widget-v84 bên dưới).
function BuySignalBadgeCompact({ product, storeName, enabled, onOpenUpgrade, onExpand }) {
  if (!enabled) {
    return (
      <button type="button" className="buy-signal-badge-v84 locked" onClick={onOpenUpgrade}>
        <Lock size={14} /> Cawi Tín Hiệu Mua — CartWise Plus
      </button>
    );
  }
  const signal = getBuySignal(product, storeName, 180);
  const meta = compactSignalMeta[signal.recommendation] || compactSignalMeta.neutral;
  const Icon = meta.icon;
  return (
    <button type="button" className={`buy-signal-badge-v84 ${meta.tone}`} onClick={onExpand}>
      <Icon size={15} /> Cawi Tín Hiệu Mua: <b>{meta.label}</b> <span>· xem phân tích</span>
    </button>
  );
}

function getBasicTotal(row) {
  if (row?.available === false || row?.storePrice == null) return null;
  return Math.max(0, Number(row.storePrice || 0) + Number(row.shippingFee || 0));
}

function cleanNumber(value) {
  const normalized = String(value ?? '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const parts = normalized.split('.');
  if (parts.length <= 2) return normalized;
  return `${parts[0]}.${parts.slice(1).join('')}`;
}

function formatCountdown(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return 'Đã kết thúc';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function PriceHistoryChart({ data, currency }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  if (!data?.length) return null;
  const width = 340;
  const height = 126;
  const paddingX = 18;
  const paddingY = 18;
  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const points = data.map((item, index) => {
    const x = paddingX + (index * (width - paddingX * 2)) / Math.max(1, data.length - 1);
    const y = height - paddingY - ((item.value - min) / range) * (height - paddingY * 2);
    return { x, y, ...item };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(' ');
  const last = data[data.length - 1];
  const average = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

  return (
    <div className="price-history-chart-v39">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Biểu đồ lịch sử giá">
        <defs>
          <linearGradient id="cw39ChartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,197,94,.24)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </linearGradient>
        </defs>
        <polyline
          points={`${paddingX},${height - paddingY} ${line} ${width - paddingX},${height - paddingY}`}
          fill="url(#cw39ChartFill)"
          stroke="none"
        />
        <polyline points={line} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <circle
            key={`${point.label}-${index}`}
            cx={point.x}
            cy={point.y}
            r={index === points.length - 1 ? 5 : 4}
            tabIndex="0"
            onMouseEnter={() => setHoveredPoint(point)}
            onMouseLeave={() => setHoveredPoint(null)}
            onFocus={() => setHoveredPoint(point)}
            onBlur={() => setHoveredPoint(null)}
          >
            <title>{point.label}: {formatCurrency(point.value, currency)}</title>
          </circle>
        ))}
      </svg>

      {hoveredPoint && (
        <div
          className="history-tooltip-v39"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100}%`
          }}
        >
          <b>{formatCurrency(hoveredPoint.value, currency)}</b>
          <span>{hoveredPoint.label}</span>
        </div>
      )}

      <div className="history-range-v39">
        <span>Giá hiện tại <b>{formatCurrency(last.value, currency)}</b></span>
        <span>Giá trung bình <b>{formatCurrency(average, currency)}</b></span>
      </div>
    </div>
  );
}

function ProductModal({ product, currency, onCurrencyChange, onClose, planId = 'free', onOpenUpgrade, inCart = false, onAddToCart, onStoreLinkClick }) {
  const plan = getPlan(planId);
  const [localCurrency, setLocalCurrency] = useState(currency || 'VND');
  const [voucherByStore, setVoucherByStore] = useState({});
  const [selectedChannel, setSelectedChannel] = useState('online');
  const [detailOpen, setDetailOpen] = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);
  const [resultSort, setResultSort] = useState('total');
  const [selectedHistoryStore, setSelectedHistoryStore] = useState('Shopee');
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [deliveryBasis, setDeliveryBasis] = useState(() => JSON.parse(localStorage.getItem('cartwise-delivery-basis') || 'null'));
  const [manualAddress, setManualAddress] = useState(deliveryBasis?.address || '');
  const [reviewPanelOpen, setReviewPanelOpen] = useState(false);
  // v81 — Nút tự khai "Đã mua / Chưa mua" — xem giải thích đầy đủ trong data/purchases.js.
  // v84 — JSX của nút này đã ẩn khỏi giao diện, nhưng vẫn giữ state để hàm markPurchased/
  // markNotPurchased không vỡ nếu cần bật lại nhanh.
  const [purchaseReported, setPurchaseReported] = useState(() => isPurchaseReported(product.id));
  // v84 — Tái cấu trúc khung so sánh theo góp ý UX (giảm rối mắt, "Progressive
  // Disclosure"): đơn vị hiển thị (tiền tệ) giờ ẩn sau icon cài đặt thay vì hiện luôn;
  // toàn bộ phân tích AI (đánh giá, cố vấn chi tiêu, tín hiệu mua) gộp vào 1 khung
  // "Trợ lý Cawi" duy nhất, mặc định thu gọn — chỉ mở khi người dùng chủ động bấm xem.
  const [currencyPanelOpen, setCurrencyPanelOpen] = useState(false);
  const [cawiWidgetOpen, setCawiWidgetOpen] = useState(false);

  useEffect(() => {
    setVoucherByStore({});
    setSelectedChannel('online');
    setDetailOpen(false);
    setPersonalOpen(false);
    setResultSort('total');
    setSelectedHistoryStore('Shopee');
    setHistoryMenuOpen(false);
    setReviewPanelOpen(false);
    setPurchaseReported(isPurchaseReported(product.id));
    setCurrencyPanelOpen(false);
    setCawiWidgetOpen(false);
  }, [product]);

  const reviewData = useMemo(() => getReviewData(product.id), [product.id]);
  const reviewAvgRating = useMemo(() => {
    if (!reviewData?.rawReviews?.length) return null;
    const total = reviewData.rawReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return total / reviewData.rawReviews.length;
  }, [reviewData]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  function selectCurrency(cur) {
    setLocalCurrency(cur);
    onCurrencyChange?.(cur);
  }

  function saveDeliveryBasis(next) {
    setDeliveryBasis(next);
    localStorage.setItem('cartwise-delivery-basis', JSON.stringify(next));
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
    if (!clean) return alert('Bạn hãy nhập khu vực hoặc địa chỉ giao hàng trước.');
    saveDeliveryBasis({ type: 'manual', label: clean, address: clean });
  }

  function toggleVoucherChooser(storeName) {
    setVoucherByStore((prev) => ({
      ...prev,
      [storeName]: {
        ...(prev[storeName] || {}),
        open: !prev[storeName]?.open
      }
    }));
  }

  function chooseVoucherMode(storeName, mode) {
    setVoucherByStore((prev) => ({
      ...prev,
      [storeName]: {
        ...(prev[storeName] || {}),
        mode,
        open: false,
        inputValue: '',
        inputCurrency: localCurrency,
        amountVnd: 0,
        percent: 0
      }
    }));
  }

  function updateVoucherValue(storeName, value) {
    const cleaned = cleanNumber(value);
    setVoucherByStore((prev) => {
      const current = prev[storeName] || { mode: 'amount' };
      const numeric = Number(cleaned || 0);

      if (current.mode === 'percent') {
        return {
          ...prev,
          [storeName]: {
            ...current,
            inputValue: cleaned,
            percent: Math.min(100, Math.max(0, numeric))
          }
        };
      }

      return {
        ...prev,
        [storeName]: {
          ...current,
          mode: 'amount',
          inputValue: cleaned,
          inputCurrency: localCurrency,
          amountVnd: Math.max(0, toVndAmount(numeric, localCurrency))
        }
      };
    });
  }

  function getVoucherInputValue(entry) {
    if (!entry?.mode) return '';
    if (entry.mode === 'percent') return entry.inputValue ?? '';
    if (entry.inputCurrency === localCurrency) return entry.inputValue ?? '';
    if (!entry.amountVnd) return '';
    return formatInputNumber(convertCurrency(entry.amountVnd, localCurrency), localCurrency).replace(/,/g, '');
  }

  function getVoucherDiscountVnd(entry, basicTotal) {
    if (!entry?.mode) return 0;
    if (entry.mode === 'percent') {
      return Math.min(basicTotal, Math.max(0, basicTotal * Number(entry.percent || 0) / 100));
    }
    return Math.min(basicTotal, Math.max(0, Number(entry.amountVnd || 0)));
  }

  const allRows = useMemo(() => product.stores.map((store) => {
    const basicTotal = getBasicTotal(store);
    const voucherEntry = voucherByStore[store.storeName];
    const voucherDiscount = getVoucherDiscountVnd(voucherEntry, basicTotal);
    const hasVoucher = Boolean(voucherEntry?.mode && voucherDiscount > 0);
    return {
      ...store,
      basicTotal,
      voucherEntry,
      voucherDiscount,
      hasVoucher,
      afterVoucher: hasVoucher ? Math.max(0, basicTotal - voucherDiscount) : null
    };
  }), [product, voucherByStore, localCurrency]);

  const onlineRows = useMemo(() => allRows.filter((row) => row.channel === 'online' || onlineStores.includes(row.storeName)).sort((a, b) => onlineStores.indexOf(a.storeName) - onlineStores.indexOf(b.storeName)), [allRows]);
  const offlineRows = useMemo(() => allRows.filter((row) => row.channel === 'offline'), [allRows]);
  const selectedRows = selectedChannel === 'online' ? onlineRows : offlineRows;
  const sortedSelectedRows = useMemo(() => {
    const rows = [...selectedRows];
    if (resultSort === 'shipping') {
      return rows.sort((a, b) => {
        const shipA = a.basicTotal == null ? Number.POSITIVE_INFINITY : Number(a.shippingFee || 0);
        const shipB = b.basicTotal == null ? Number.POSITIVE_INFINITY : Number(b.shippingFee || 0);
        return shipA - shipB;
      });
    }
    if (resultSort === 'popular') {
      return rows.sort((a, b) => getStorePopularityScore(a.storeName) - getStorePopularityScore(b.storeName));
    }
    return rows.sort((a, b) => {
      const totalA = a.basicTotal == null ? Number.POSITIVE_INFINITY : a.basicTotal;
      const totalB = b.basicTotal == null ? Number.POSITIVE_INFINITY : b.basicTotal;
      return totalA - totalB;
    });
  }, [selectedRows, resultSort]);

  const savingStats = useMemo(() => getOptimalSavingStats(product, selectedRows), [product, selectedRows]);
  const historyStoreOptions = useMemo(() => onlineRows.filter((row) => row.available !== false && row.storePrice != null), [onlineRows]);
  const activeHistoryStore = historyStoreOptions.some((row) => row.storeName === selectedHistoryStore)
    ? selectedHistoryStore
    : historyStoreOptions[0]?.storeName;
  const priceHistory = useMemo(() => getPriceHistory(product, activeHistoryStore), [product, activeHistoryStore]);
  const priceInsight = useMemo(() => getPriceInsight(product, activeHistoryStore), [product, activeHistoryStore]);
  const PriceStatusIcon = priceInsight.tone === 'good' ? TrendingDown : priceInsight.tone === 'warning' ? TrendingUp : Minus;

  const bestOnline = useMemo(() => [...onlineRows].filter((row) => row.basicTotal != null).sort((a, b) => a.basicTotal - b.basicTotal)[0], [onlineRows]);
  const bestOffline = useMemo(() => [...offlineRows].filter((row) => row.basicTotal != null).sort((a, b) => a.basicTotal - b.basicTotal)[0], [offlineRows]);
  const bestSelected = useMemo(() => [...selectedRows].filter((row) => row.basicTotal != null).sort((a, b) => a.basicTotal - b.basicTotal)[0], [selectedRows]);
  const personalizedRows = useMemo(() => onlineRows.filter((row) => row.hasVoucher), [onlineRows]);
  const bestPersonalized = useMemo(() => personalizedRows.length ? [...personalizedRows].sort((a, b) => a.afterVoucher - b.afterVoucher)[0] : null, [personalizedRows]);

  const conclusion = bestPersonalized && selectedChannel === 'online'
    ? `Theo voucher bạn đã nhập, ${bestPersonalized.storeName} đang là lựa chọn tiết kiệm nhất cho tài khoản của bạn.`
    : selectedChannel === 'online'
      ? `${bestOnline?.storeName || 'Nền tảng online'} đang có tổng chi phí dự kiến thấp nhất theo dữ liệu online hiện có.`
      : `${bestOffline?.storeName || 'Cửa hàng trực tiếp'} đang có mức giá tham khảo tốt nhất trong nhóm cửa hàng trực tiếp.`;

  function markPurchased() {
    const referenceRow = bestSelected || bestOnline || bestOffline;
    addSelfReportedPurchase(product, referenceRow?.basicTotal);
    setPurchaseReported(true);
  }

  function markNotPurchased() {
    removeSelfReportedPurchase(product.id);
    setPurchaseReported(false);
  }

  function renderRow(row, bestRow, compact = false) {
    const isUnavailable = row.available === false || row.basicTotal == null;
    const isBest = !isUnavailable && row.storeName === bestRow?.storeName;
    const saleActive = !isUnavailable && row.channel === 'online' && product.flashSaleToday && product.offerEndTime && product.offerEndTime > now;
    const distanceLabel = row.channel === 'offline' && deliveryBasis?.type === 'geo'
      ? getStoreDistanceLabel(row.storeName, product.id, deliveryBasis.coords)
      : null;
    return (
      <article className={isBest ? 'fair-cost-card best-basic channel-row-v31' : 'fair-cost-card channel-row-v31'} key={`${row.channel}-${row.storeName}`}>
        <div className="fair-cost-head">
          <img src={getStoreLogo(row.storeName)} alt={row.storeName} />
          <div>
            <b>{row.storeName}</b>
            <span className={isBest ? 'status-pill best' : 'status-pill'}>{isBest ? 'Tốt nhất' : 'Tham khảo'}</span>
            {distanceLabel && (
              <span className="store-distance-pill-v81" title="Khoảng cách minh hoạ dựa trên vị trí bạn đã cấp quyền">
                <Navigation size={11} /> Cách bạn {distanceLabel}
              </span>
            )}
          </div>
        </div>
        <dl>
          <div><dt>Giá</dt><dd>{isUnavailable ? 'Không có sản phẩm' : formatCurrency(row.storePrice, localCurrency)}</dd></div>
          {row.channel === 'online' && <div><dt>Ship ước tính</dt><dd>{isUnavailable ? '—' : formatCurrency(row.shippingFee, localCurrency)}</dd></div>}
          {row.channel === 'offline' && <div><dt>Hình thức</dt><dd>Mua trực tiếp</dd></div>}
          <div className="total-line"><dt>{row.channel === 'online' ? 'Tổng dự kiến' : 'Giá tại cửa hàng'}</dt><dd>{isUnavailable ? 'Không có sản phẩm' : formatCurrency(row.basicTotal, localCurrency)}</dd></div>
        </dl>
        {saleActive && (
          <div className="sale-countdown-v31">
            <Clock3 size={16} />
            <span>Kết thúc ưu đãi sau <b>{formatCountdown(product.offerEndTime - now)}</b></span>
          </div>
        )}
        {!compact && (isUnavailable ? <span className="buy-link soft disabled-link">Không có sản phẩm</span> : <a className="buy-link soft" href={row.storeUrl || '#'} target="_blank" rel="noreferrer" onClick={() => onStoreLinkClick?.(product, row)}>Mua tại đây</a>)}
      </article>
    );
  }

  return (
    <div className="modal-backdrop product-backdrop" role="dialog" aria-modal="true">
      <div className="product-modal premium-modal expected-cost-modal v30-modal v31-product-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-grid premium-modal-grid expected-cost-grid v30-expected-grid v31-expected-grid">
          <section className="modal-image-panel premium-image-panel expected-product-card">
            <span className="expected-card-label">Sản phẩm đang so sánh</span>
            <img
              src={product.image}
              alt={product.name}
              onError={(event) => {
                if (product.fallbackImage && event.currentTarget.src !== product.fallbackImage) {
                  event.currentTarget.src = product.fallbackImage;
                }
              }}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="expected-card-meta">
              <span>{product.category}</span>
              <span>{product.subCategory}</span>
            </div>

            <button
              type="button"
              className={inCart ? 'product-add-cart-btn-v67 added' : 'product-add-cart-btn-v67'}
              onClick={() => !inCart && onAddToCart?.()}
              disabled={inCart}
            >
              {inCart ? <><Check size={16} /> Đã có trong giỏ hàng</> : <><ShoppingCart size={16} /> Thêm vào giỏ hàng</>}
            </button>

            {/* v81 — Tự khai đã mua sản phẩm này chưa, đặt ngay dưới nút "Thêm vào giỏ
                hàng". v84 — ẨN khỏi giao diện theo yêu cầu (không xoá code): cách quan
                trọng hơn để tự khai giờ là popup tự động "Bạn đã mua chưa?" sau khi bấm
                "Mua tại đây" và quay lại tab (v83, App.jsx + PurchaseConfirmationModal.jsx)
                — 1 lối tự khai chủ động là đủ, tránh trùng lặp/rối UI theo góp ý.
                markPurchased/markNotPurchased vẫn còn nguyên trong file, dễ bật lại.
            <div className="self-report-purchase-v81">
              <div className="self-report-toggle-v81">
                <button type="button" className={purchaseReported ? 'active' : ''} onClick={markPurchased} aria-pressed={purchaseReported}>
                  <PackageCheck size={15} /> Đã mua
                </button>
                <button type="button" className={!purchaseReported ? 'active' : ''} onClick={markNotPurchased} aria-pressed={!purchaseReported}>
                  <PackageX size={15} /> Chưa mua
                </button>
              </div>
              <small>Bạn tự khai để mở khoá "Thành tựu tiết kiệm" — dữ liệu minh hoạ, chưa liên kết tài khoản mua sắm thật.</small>
            </div>
            */}

            {/* v84 — Đơn vị hiển thị (tiền tệ) trước đây hiện luôn thành 1 khối riêng ở
                cột trái, chiếm nhiều chỗ dù ít khi cần đổi. Theo góp ý UX, giờ ẩn sau 1
                icon cài đặt gọn, chỉ mở ra khi người dùng chủ động bấm. */}
            <div className="currency-settings-v84">
              <button
                type="button"
                className="currency-settings-trigger-v84"
                onClick={() => setCurrencyPanelOpen((open) => !open)}
                aria-expanded={currencyPanelOpen}
              >
                <Settings size={15} /> Đơn vị hiển thị: <b>{localCurrency}</b>
                <ChevronDown size={14} className={currencyPanelOpen ? 'rotated' : ''} />
              </button>
              {currencyPanelOpen && (
                <div className="currency-settings-panel-v84">
                  <div className="currency-grid compact">
                    {currencies.map((cur) => (
                      <button key={cur} className={localCurrency === cur ? 'choice active' : 'choice'} onClick={() => selectCurrency(cur)}>{cur}</button>
                    ))}
                  </div>
                  <small>Voucher dạng giảm tiền sẽ được hiểu theo đúng đơn vị tiền tệ bạn đang chọn.</small>
                </div>
              )}
            </div>

            <div className={`price-insight-panel-v39 ${priceInsight.tone}`}>
              <div className="price-insight-head-v39">
                <span><BarChart3 size={17} /> Lịch sử giá</span>
                <div className="history-store-picker-v39">
                  <button type="button" onClick={() => setHistoryMenuOpen((open) => !open)}>
                    {activeHistoryStore || 'Chọn sàn'}
                    <ChevronDown size={15} className={historyMenuOpen ? 'rotated' : ''} />
                  </button>
                  {historyMenuOpen && (
                    <div className="history-store-menu-v39">
                      {historyStoreOptions.map((row) => (
                        <button
                          type="button"
                          key={`history-${row.storeName}`}
                          onClick={() => {
                            setSelectedHistoryStore(row.storeName);
                            setHistoryMenuOpen(false);
                          }}
                        >
                          {row.storeName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <b><PriceStatusIcon size={16} /> {priceInsight.status}</b>
              </div>
              <PriceHistoryChart data={priceHistory} currency={localCurrency} />
              <small className="history-source-note-v39">Dữ liệu biểu đồ hiện là dữ liệu ghi nhận trong bản demo từ giá sản phẩm đã nhập; để có lịch sử thật theo thời gian cần backend/API lưu snapshot giá hằng ngày.</small>
            </div>

            {/* v84 — Huy hiệu gọn thay cho BuySignalCard đầy đủ trước đây (đã dời phần
                phân tích chi tiết vào khung "Trợ lý Cawi" ở cột phải) — bấm để mở khung
                đó đúng ngay chỗ có phân tích tín hiệu mua chi tiết. */}
            <BuySignalBadgeCompact
              product={product}
              storeName={activeHistoryStore}
              enabled={plan.buySignal.enabled}
              onOpenUpgrade={onOpenUpgrade}
              onExpand={() => setCawiWidgetOpen(true)}
            />
          </section>

          <section className="modal-info-panel has-advisor premium-info-panel expected-cost-panel v30-cost-panel v31-cost-panel">
            <div className="modal-advisor-slot">
              {/* v82 — Theo yêu cầu, Cawi Robo không hiển thị nữa bên trong khung so sánh
                  tổng chi phí (khi bấm "So sánh tổng chi phí"). Giữ lại slot + import
                  CawiRobot (không xoá) để không phá layout/CSS liên quan và có thể bật
                  lại dễ dàng nếu cần — chỉ bỏ dòng render bên dưới.
              <CawiRobot mode="modal" message="Mình sẽ giúp bạn so sánh online và cửa hàng trực tiếp gọn hơn!" /> */}
            </div>

            <span className="category-chip">Tính năng chính của CartWise</span>
            <h2>So sánh tổng chi phí dự kiến</h2>

            {/* v84 — Gộp "banner giá tốt nhất" và "thẻ tính khoản tiết kiệm tối ưu"
                (trước đây 2 khối tách rời, lặp thông tin) thành 1 banner hero duy nhất
                theo góp ý UX. Ô "Đánh giá & Chất lượng sản phẩm" dời sang khung "Trợ lý
                Cawi" gộp chung bên dưới (cùng nhóm với các tính năng AI khác). */}
            <div className="best-price-box expected-hero-box v30-best-box v31-best-box hero-merged-v84">
              <div className="hero-price-col-v60">
                <span>{selectedChannel === 'online' ? 'Tổng online dự kiến thấp nhất' : 'Giá trực tiếp tham khảo thấp nhất'}</span>
                <strong>{bestSelected ? formatCurrency(bestSelected.basicTotal, localCurrency) : '—'}</strong>
                <p>{conclusion}</p>
              </div>

              <div className="hero-merged-divider-v84" />

              <div className="hero-merged-saving-v84">
                <span className="hero-merged-saving-label-v84">Khoản tiết kiệm tối ưu</span>
                <b className="hero-merged-saving-title-v84">{savingStats.best ? `Chọn ${savingStats.best.storeName}` : 'Đang cập nhật'}</b>
                <p className="hero-merged-saving-desc-v84">
                  {savingStats.saveMax > 0
                    ? `Tiết kiệm tối đa ${formatCurrency(savingStats.saveMax, localCurrency)} so với lựa chọn cao nhất trong danh sách.`
                    : 'Chưa đủ chênh lệch để tính khoản tiết kiệm.'}
                </p>
                <div className="hero-merged-saving-metrics-v84">
                  <span>So với kế tiếp <b>{formatCurrency(savingStats.saveVsNext, localCurrency)}</b></span>
                  <span>So với trung bình <b>{formatCurrency(savingStats.saveVsAverage, localCurrency)}</b></span>
                </div>
              </div>
            </div>

            <div className="expected-workspace v31-workspace">
              <section className="expected-pane fair-pane v31-fair-pane">
                <div className="expected-section-title compact-title">
                  <span>Phần 1</span>
                  <h3>So sánh công bằng</h3>
                  <p>Chọn online hoặc cửa hàng trực tiếp để xem chi tiết, tránh hiển thị quá nhiều cùng lúc.</p>
                </div>

                <div className="channel-columns-v31">
                  <article className={selectedChannel === 'online' ? 'channel-summary-v31 active' : 'channel-summary-v31'} onClick={() => { setSelectedChannel('online'); setDetailOpen(false); }}>
                    <div className="channel-summary-head-v31"><Smartphone size={22} /><b>Mua online</b><span>{onlineRows.length} nền tảng</span></div>
                    <p>Tính giá sản phẩm + phí vận chuyển ước tính.</p>
                    <strong>{bestOnline ? formatCurrency(bestOnline.basicTotal, localCurrency) : '—'}</strong>
                    <button className="channel-toggle-v31" type="button" onClick={(event) => { event.stopPropagation(); setSelectedChannel('online'); setDetailOpen((open) => selectedChannel === 'online' ? !open : true); }}>
                      {selectedChannel === 'online' && detailOpen ? 'Thu gọn online' : 'Xem online'} <ChevronDown size={16} className={selectedChannel === 'online' && detailOpen ? 'rotated' : ''} />
                    </button>
                  </article>

                  <article className={selectedChannel === 'offline' ? 'channel-summary-v31 active' : 'channel-summary-v31'} onClick={() => { setSelectedChannel('offline'); setDetailOpen(false); }}>
                    <div className="channel-summary-head-v31"><Store size={22} /><b>Mua trực tiếp</b><span>{offlineRows.length} cửa hàng</span></div>
                    <p>Tham khảo giá tại cửa hàng, không cộng phí vận chuyển.</p>
                    <strong>{bestOffline ? formatCurrency(bestOffline.basicTotal, localCurrency) : '—'}</strong>
                    <button className="channel-toggle-v31" type="button" onClick={(event) => { event.stopPropagation(); setSelectedChannel('offline'); setDetailOpen((open) => selectedChannel === 'offline' ? !open : true); }}>
                      {selectedChannel === 'offline' && detailOpen ? 'Thu gọn trực tiếp' : 'Xem trực tiếp'} <ChevronDown size={16} className={selectedChannel === 'offline' && detailOpen ? 'rotated' : ''} />
                    </button>
                  </article>
                </div>

                {detailOpen && (
                  <div className="selected-channel-detail-v31 detail-slide-v41">
                    <div className="detail-title-row-v38">
                      <h4>{selectedChannel === 'online' ? 'Chi tiết mua online' : 'Chi tiết mua trực tiếp'}</h4>
                      <label className="sort-select-v38">
                        <span>Sắp xếp</span>
                        <select value={resultSort} onChange={(event) => setResultSort(event.target.value)}>
                          <option value="total">Tổng chi phí thấp nhất</option>
                          <option value="shipping">Phí vận chuyển thấp nhất</option>
                          <option value="popular">Nơi bán phổ biến</option>
                        </select>
                      </label>
                    </div>
                    <div className="compact-fair-list v31-compact-list">
                      {sortedSelectedRows.map((row) => renderRow(row, selectedChannel === 'online' ? bestOnline : bestOffline))}
                    </div>
                  </div>
                )}

                <div className="formula-box expected-formula compact-formula v31-formula">
                  <Truck size={17} />
                  <span>{selectedChannel === 'online' ? 'Tổng online dự kiến = Giá sản phẩm + phí vận chuyển ước tính.' : 'Mua trực tiếp không cộng phí vận chuyển, giá có thể thay đổi theo chi nhánh.'}</span>
                </div>
              </section>

              {selectedChannel === 'online' && (
                <section className="expected-pane personal-pane v31-personal-pane">
                  <button className="personal-toggle-v31" type="button" onClick={() => setPersonalOpen((open) => !open)}>
                    <span>Phần 2</span>
                    <b>Tùy chỉnh theo tài khoản của bạn</b>
                    <ChevronDown size={18} className={personalOpen ? 'rotated' : ''} />
                  </button>

                  {personalOpen && (
                    <div className="voucher-card-grid compact-voucher-grid v31-voucher-area">
                      {onlineRows.filter((row) => row.available !== false && row.basicTotal != null).map((row) => {
                        const entry = row.voucherEntry || {};
                        const inputValue = getVoucherInputValue(entry);
                        return (
                          <article className="voucher-card compact-voucher-card" key={`voucher-${row.storeName}`}>
                            <div className="voucher-card-head">
                              <img src={getStoreLogo(row.storeName)} alt={row.storeName} />
                              <div>
                                <b>{row.storeName}</b>
                                <span>Tổng cơ bản: {formatCurrency(row.basicTotal, localCurrency)}</span>
                              </div>
                            </div>

                            <div className="voucher-picker">
                              <button type="button" className="voucher-mode-trigger" onClick={() => toggleVoucherChooser(row.storeName)}>
                                {entry.mode === 'amount' ? `Giảm tiền (${localCurrency})` : entry.mode === 'percent' ? 'Giảm %' : 'Hãy chọn giảm % hay tiền'}
                              </button>
                              {entry.open && (
                                <div className="voucher-mode-menu">
                                  <button type="button" onClick={() => chooseVoucherMode(row.storeName, 'amount')}>Giảm tiền</button>
                                  <button type="button" onClick={() => chooseVoucherMode(row.storeName, 'percent')}>Giảm %</button>
                                </div>
                              )}
                            </div>

                            {entry.mode && (
                              <label className="voucher-value-field">
                                <span>{entry.mode === 'amount' ? `Nhập số tiền giảm bằng ${localCurrency}` : 'Nhập phần trăm giảm'}</span>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  placeholder={entry.mode === 'amount' ? (localCurrency === 'VND' ? 'Ví dụ: 10000 hoặc 20000' : 'Ví dụ: 3 hoặc 5') : 'Ví dụ: 15 hoặc 20'}
                                  value={inputValue}
                                  onChange={(event) => updateVoucherValue(row.storeName, event.target.value)}
                                />
                              </label>
                            )}

                            <div className="voucher-result total compact-result">
                              <span>Tổng sau tùy chỉnh</span>
                              <strong>{row.hasVoucher ? formatCurrency(row.afterVoucher, localCurrency) : 'Chưa có dữ liệu voucher'}</strong>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* v84 — "Trợ lý Cawi": gộp cả 3 tính năng AI trước đây nằm rải rác 3 nơi
                khác nhau (đánh giá & chất lượng, cố vấn chi tiêu, tín hiệu mua) vào 1
                khung duy nhất, mặc định THU GỌN — đúng nguyên tắc "Progressive
                Disclosure" từ góp ý UX: mặc định chỉ hiện ảnh+biểu đồ, kết quả giá tốt
                nhất, và bảng so sánh online/trực tiếp; phân tích AI chi tiết chỉ hiện
                khi người dùng chủ động bấm xem. */}
            <div className="cawi-widget-v84">
              <button type="button" className="cawi-widget-toggle-v84" onClick={() => setCawiWidgetOpen((open) => !open)} aria-expanded={cawiWidgetOpen}>
                <span className="cawi-widget-toggle-label-v84"><Wand2 size={18} /> Trợ lý Cawi</span>
                <span className="cawi-widget-toggle-cta-v84">
                  {cawiWidgetOpen ? 'Thu gọn' : 'Xem phân tích AI Cawi'} <ChevronDown size={16} className={cawiWidgetOpen ? 'rotated' : ''} />
                </span>
              </button>

              {cawiWidgetOpen && (
                <div className="cawi-widget-body-v84">
                  <button type="button" className="cawi-widget-review-row-v84" onClick={() => setReviewPanelOpen(true)}>
                    <span className="hero-review-badge-v60"><Sparkles size={16} /> Đánh giá &amp; Chất lượng sản phẩm</span>
                    {reviewAvgRating != null && (
                      <span className="cawi-widget-review-rating-v84"><Star size={13} fill="currentColor" /> {reviewAvgRating.toFixed(1)}</span>
                    )}
                    <span className="cawi-widget-review-meta-v84">
                      {reviewData
                        ? `Tổng hợp từ ${reviewData.reviewCount} đánh giá bằng AI · ${reviewData.sourceCount} nguồn`
                        : 'Chưa có đủ đánh giá để tổng hợp bằng AI'}
                    </span>
                    <span className="cawi-widget-review-cta-v84">Xem đánh giá chi tiết <ChevronRight size={14} /></span>
                  </button>

                  <SpendingAdvisorCard
                    product={product}
                    enabled={plan.spendingAdvisor.enabled}
                    onOpenUpgrade={onOpenUpgrade}
                    purchasePrice={(bestSelected || bestOnline || bestOffline)?.basicTotal}
                    hasBuySignalData={plan.buySignal.enabled}
                    onViewBuySignal={() => {
                      document.querySelector('.buy-signal-card-v63')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  />

                  <BuySignalCard
                    product={product}
                    storeName={activeHistoryStore}
                    enabled={plan.buySignal.enabled}
                    onOpenUpgrade={onOpenUpgrade}
                  />
                </div>
              )}
            </div>

            {/* v84 — Bỏ khối "CHÚ Ý — Kết luận dự kiến" ở cuối trang theo góp ý UX: nội
                dung lặp lại y hệt câu kết luận đã hiện ngay trong banner hero ở đầu
                trang (biến `conclusion` dùng chung) — 2 lần cùng 1 câu là dư thừa. Giữ
                lại code, chỉ không render, để dễ bật lại nếu cần:
            <div className="expected-conclusion-card attention-card v31-attention-card">
              <div className="attention-heading"><span>CHÚ Ý</span><b>Kết luận dự kiến</b></div>
              <p>{conclusion}</p>
            </div>
            */}

            <p className="final-price-note expected-note compact-note">
              Phí vận chuyển và thời gian ưu đãi hiện là dữ liệu demo. Để đồng bộ 100% theo thời gian thực với Shopee, Lazada, Tiki hoặc cửa hàng, CartWise cần backend/API chính thức từ từng nền tảng.
            </p>
          </section>
        </div>

        {reviewPanelOpen && (
          <div className="review-overlay-v59" role="dialog" aria-modal="true" aria-label="Đánh giá & chất lượng sản phẩm">
            <div className="review-overlay-card-v59">
              <div className="review-overlay-head-v59">
                <div>
                  <span className="review-overlay-eyebrow-v59">Đánh giá &amp; chất lượng sản phẩm</span>
                  <p>Không chỉ tìm nơi rẻ nhất — tóm tắt nhanh sản phẩm có đáng mua không, dựa trên nhiều đánh giá thật từ các sàn.</p>
                </div>
                <button type="button" className="review-overlay-close-v59" onClick={() => setReviewPanelOpen(false)} aria-label="Đóng khung đánh giá"><X size={18} /></button>
              </div>
              <div className="review-overlay-body-v59">
                <AIReviewSummary productId={product.id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductModal;
