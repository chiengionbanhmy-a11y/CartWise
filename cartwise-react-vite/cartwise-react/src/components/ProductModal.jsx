import { useEffect, useMemo, useState } from 'react';
import CawiRobot from './CawiRobot.jsx';
import { formatCurrency } from '../data/currency.js';
import { getStoreLogo } from '../data/products.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];
const comparableStores = ['Shopee', 'Lazada', 'Tiki'];

function getCountdown(endTime) {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
  const total = Math.floor(diff / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function getBasicTotal(row) {
  return Math.max(0, Number(row.storePrice || 0) + Number(row.shippingFee || 0));
}

function ProductModal({ product, currency, onCurrencyChange, onClose }) {
  const [localCurrency, setLocalCurrency] = useState(currency || 'VND');
  const [countdown, setCountdown] = useState(product.offerEndTime ? getCountdown(product.offerEndTime) : null);
  const [voucherByStore, setVoucherByStore] = useState({});

  useEffect(() => {
    setCountdown(product.offerEndTime ? getCountdown(product.offerEndTime) : null);
    setVoucherByStore({});
  }, [product]);

  useEffect(() => {
    if (!product.offerEndTime) return;
    const timer = setInterval(() => setCountdown(getCountdown(product.offerEndTime)), 1000);
    return () => clearInterval(timer);
  }, [product.offerEndTime]);

  function selectCurrency(cur) {
    setLocalCurrency(cur);
    onCurrencyChange?.(cur);
  }

  function updateVoucher(storeName, value) {
    setVoucherByStore((prev) => ({
      ...prev,
      [storeName]: value === '' ? '' : Math.max(0, Number(value || 0))
    }));
  }

  const rows = useMemo(() => {
    const onlineRows = product.stores
      .filter((store) => comparableStores.includes(store.storeName))
      .sort((a, b) => comparableStores.indexOf(a.storeName) - comparableStores.indexOf(b.storeName));

    return onlineRows.map((store) => {
      const basicTotal = getBasicTotal(store);
      const rawVoucher = voucherByStore[store.storeName];
      const hasVoucher = rawVoucher !== undefined && rawVoucher !== '' && Number(rawVoucher) > 0;
      const voucher = hasVoucher ? Number(rawVoucher) : 0;
      return {
        ...store,
        basicTotal,
        voucher,
        hasVoucher,
        afterVoucher: hasVoucher ? Math.max(0, basicTotal - voucher) : null
      };
    });
  }, [product, voucherByStore]);

  const bestBasic = useMemo(() => [...rows].sort((a, b) => a.basicTotal - b.basicTotal)[0], [rows]);
  const personalizedRows = useMemo(() => rows.filter((row) => row.hasVoucher), [rows]);
  const bestPersonalized = useMemo(() => personalizedRows.length ? [...personalizedRows].sort((a, b) => a.afterVoucher - b.afterVoucher)[0] : null, [personalizedRows]);

  const basicConclusion = bestBasic
    ? `${bestBasic.storeName} đang có tổng chi phí dự kiến thấp nhất theo dữ liệu cơ bản hiện có.`
    : 'Chưa có đủ dữ liệu để kết luận.';

  const personalConclusion = bestPersonalized
    ? `Theo voucher bạn đã nhập, ${bestPersonalized.storeName} đang là lựa chọn tiết kiệm nhất cho tài khoản của bạn.`
    : `${bestBasic?.storeName || 'Nền tảng tốt nhất'} là lựa chọn tốt nhất theo giá cơ bản. Nếu bạn có voucher ở nền tảng khác, kết quả có thể thay đổi.`;

  return (
    <div className="modal-backdrop product-backdrop" role="dialog" aria-modal="true">
      <div className="product-modal premium-modal expected-cost-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-grid premium-modal-grid expected-cost-grid">
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

            <div className="quick-convert premium-convert">
              <h4>Quy đổi tiền tệ nhanh</h4>
              <div className="currency-grid compact">
                {currencies.map((cur) => (
                  <button key={cur} className={localCurrency === cur ? 'choice active' : 'choice'} onClick={() => selectCurrency(cur)}>{cur}</button>
                ))}
              </div>
              <small>Quy đổi tham khảo từ VNĐ.</small>
            </div>
          </section>

          <section className="modal-info-panel has-advisor premium-info-panel expected-cost-panel">
            <div className="modal-advisor-slot">
              <CawiRobot
                mode="modal"
                message="Đừng chỉ nhìn giá ban đầu — hãy xem tổng tiền dự kiến cần trả sau phí vận chuyển."
              />
            </div>

            <span className="category-chip">Tính năng chính của CartWise</span>
            <h2>So sánh tổng chi phí dự kiến</h2>
            <p className="expected-lead">
              Đừng chỉ nhìn giá ban đầu — hãy xem tổng tiền thật sự có thể phải trả sau khi cộng phí vận chuyển.
            </p>

            <div className="expected-explain-box">
              CartWise không chỉ so sánh giá niêm yết, mà còn giúp bạn ước tính tổng chi phí cần trả sau khi cộng phí vận chuyển. Vì voucher có thể khác nhau theo từng tài khoản, CartWise tách riêng phần so sánh công bằng và phần tùy chỉnh theo voucher cá nhân của bạn.
            </div>

            <div className="best-price-box expected-hero-box">
              <span>Tổng chi phí dự kiến thấp nhất</span>
              <strong>{bestBasic ? formatCurrency(bestBasic.basicTotal, localCurrency) : '—'}</strong>
              <p>{basicConclusion}</p>
              {countdown && <div className="countdown">Ưu đãi tham khảo: <b>{countdown}</b></div>}
            </div>

            <div className="expected-section-title">
              <span>Phần 1</span>
              <h3>So sánh công bằng</h3>
              <p>Bảng này so sánh theo cùng điều kiện cơ bản, chưa tính voucher cá nhân vì ưu đãi có thể khác nhau theo từng tài khoản.</p>
            </div>

            <div className="expected-table-wrap">
              <div className="expected-table fair-table">
                <div className="expected-row expected-head">
                  <span>Nền tảng</span>
                  <span>Giá sản phẩm</span>
                  <span>Phí vận chuyển ước tính</span>
                  <span>Tổng chi phí cơ bản</span>
                  <span>Trạng thái đề xuất</span>
                </div>
                {rows.map((row) => {
                  const isBest = row.storeName === bestBasic?.storeName;
                  const status = isBest ? 'Tốt nhất' : row.basicTotal === bestBasic?.basicTotal ? 'Tốt' : 'Cao hơn';
                  return (
                    <div className={isBest ? 'expected-row best-basic' : 'expected-row'} key={row.storeName}>
                      <span className="expected-store-cell">
                        <img src={getStoreLogo(row.storeName)} alt={row.storeName} />
                        <b>{row.storeName}</b>
                        {isBest && <i>Tổng dự kiến thấp nhất</i>}
                      </span>
                      <span>{formatCurrency(row.storePrice, localCurrency)}</span>
                      <span>{formatCurrency(row.shippingFee, localCurrency)}</span>
                      <strong>{formatCurrency(row.basicTotal, localCurrency)}</strong>
                      <span className={status === 'Tốt nhất' ? 'status-pill best' : 'status-pill'}>{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="formula-box expected-formula">
              <b>Công thức:</b> Tổng chi phí cơ bản = Giá sản phẩm + Phí vận chuyển ước tính
            </div>

            <div className="expected-section-title personal-title">
              <span>Phần 2</span>
              <h3>Tùy chỉnh theo tài khoản của bạn</h3>
              <p>Nhập voucher thủ công nếu bạn đang có mã giảm giá ở từng nền tảng.</p>
            </div>

            <div className="voucher-card-grid">
              {rows.map((row) => (
                <article className="voucher-card" key={`voucher-${row.storeName}`}>
                  <div className="voucher-card-head">
                    <img src={getStoreLogo(row.storeName)} alt={row.storeName} />
                    <div>
                      <b>Voucher {row.storeName}</b>
                      <span>Tổng cơ bản: {formatCurrency(row.basicTotal, localCurrency)}</span>
                    </div>
                  </div>
                  <label>
                    Nhập số tiền giảm
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      placeholder="Ví dụ: 25000"
                      value={voucherByStore[row.storeName] ?? ''}
                      onChange={(event) => updateVoucher(row.storeName, event.target.value)}
                    />
                  </label>
                  <div className="voucher-result">
                    <span>Voucher cá nhân</span>
                    <b>{row.hasVoucher ? formatCurrency(row.voucher, localCurrency) : 'Chưa có dữ liệu voucher'}</b>
                  </div>
                  <div className="voucher-result total">
                    <span>Tổng sau voucher</span>
                    <strong>{row.hasVoucher ? formatCurrency(row.afterVoucher, localCurrency) : 'Chưa xác định'}</strong>
                  </div>
                  <a className="buy-link soft" href={row.storeUrl || '#'} target="_blank" rel="noreferrer">Mua tại đây</a>
                </article>
              ))}
            </div>

            <div className="expected-table-wrap personalized-wrap">
              <div className="expected-table personalized-table">
                <div className="expected-row expected-head">
                  <span>Nền tảng</span>
                  <span>Tổng cơ bản</span>
                  <span>Voucher cá nhân</span>
                  <span>Tổng sau voucher</span>
                </div>
                {rows.map((row) => (
                  <div className={bestPersonalized?.storeName === row.storeName ? 'expected-row best-personal' : 'expected-row'} key={`personal-${row.storeName}`}>
                    <span className="expected-store-cell">
                      <img src={getStoreLogo(row.storeName)} alt={row.storeName} />
                      <b>{row.storeName}</b>
                      {bestPersonalized?.storeName === row.storeName && <i>Theo voucher của bạn</i>}
                    </span>
                    <span>{formatCurrency(row.basicTotal, localCurrency)}</span>
                    <span>{row.hasVoucher ? formatCurrency(row.voucher, localCurrency) : 'Chưa có dữ liệu'}</span>
                    <strong>{row.hasVoucher ? formatCurrency(row.afterVoucher, localCurrency) : 'Chưa xác định'}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="expected-conclusion-card">
              <b>Kết luận dự kiến</b>
              <p>{personalConclusion}</p>
            </div>

            <p className="final-price-note expected-note">
              Kết quả sau voucher chỉ phản ánh dữ liệu bạn đã nhập. Nếu bạn có voucher ở nền tảng khác, kết quả có thể thay đổi. CartWise không cam kết giá chính xác tuyệt đối vì phí vận chuyển, voucher cá nhân và chính sách từng nền tảng có thể thay đổi theo tài khoản và vị trí giao hàng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
