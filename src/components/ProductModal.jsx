import { useEffect, useMemo, useState } from 'react';
import { MapPin, Truck, Store, Smartphone, ChevronDown, Clock3 } from 'lucide-react';
import CawiRobot from './CawiRobot.jsx';
import { convertCurrency, formatCurrency, formatInputNumber, toVndAmount } from '../data/currency.js';
import { getStoreLogo } from '../data/products.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];
const onlineStores = ['Shopee', 'Lazada', 'Tiki'];

function getBasicTotal(row) {
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

function ProductModal({ product, currency, onCurrencyChange, onClose }) {
  const [localCurrency, setLocalCurrency] = useState(currency || 'VND');
  const [voucherByStore, setVoucherByStore] = useState({});
  const [selectedChannel, setSelectedChannel] = useState('online');
  const [personalOpen, setPersonalOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [deliveryBasis, setDeliveryBasis] = useState(() => JSON.parse(localStorage.getItem('cartwise-delivery-basis') || 'null'));
  const [manualAddress, setManualAddress] = useState(deliveryBasis?.address || '');

  useEffect(() => {
    setVoucherByStore({});
    setSelectedChannel('online');
    setPersonalOpen(false);
  }, [product]);

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

  const bestOnline = useMemo(() => [...onlineRows].sort((a, b) => a.basicTotal - b.basicTotal)[0], [onlineRows]);
  const bestOffline = useMemo(() => [...offlineRows].sort((a, b) => a.basicTotal - b.basicTotal)[0], [offlineRows]);
  const bestSelected = useMemo(() => [...selectedRows].sort((a, b) => a.basicTotal - b.basicTotal)[0], [selectedRows]);
  const personalizedRows = useMemo(() => onlineRows.filter((row) => row.hasVoucher), [onlineRows]);
  const bestPersonalized = useMemo(() => personalizedRows.length ? [...personalizedRows].sort((a, b) => a.afterVoucher - b.afterVoucher)[0] : null, [personalizedRows]);

  const conclusion = bestPersonalized && selectedChannel === 'online'
    ? `Theo voucher bạn đã nhập, ${bestPersonalized.storeName} đang là lựa chọn tiết kiệm nhất cho tài khoản của bạn.`
    : selectedChannel === 'online'
      ? `${bestOnline?.storeName || 'Nền tảng online'} đang có tổng chi phí dự kiến thấp nhất theo dữ liệu online hiện có.`
      : `${bestOffline?.storeName || 'Cửa hàng trực tiếp'} đang có mức giá tham khảo tốt nhất trong nhóm cửa hàng trực tiếp.`;

  function renderRow(row, bestRow, compact = false) {
    const isBest = row.storeName === bestRow?.storeName;
    const saleActive = row.channel === 'online' && product.flashSaleToday && product.offerEndTime && product.offerEndTime > now;
    return (
      <article className={isBest ? 'fair-cost-card best-basic channel-row-v31' : 'fair-cost-card channel-row-v31'} key={`${row.channel}-${row.storeName}`}>
        <div className="fair-cost-head">
          <img src={getStoreLogo(row.storeName)} alt={row.storeName} />
          <div>
            <b>{row.storeName}</b>
            <span className={isBest ? 'status-pill best' : 'status-pill'}>{isBest ? 'Tốt nhất' : 'Tham khảo'}</span>
          </div>
        </div>
        <dl>
          <div><dt>Giá</dt><dd>{formatCurrency(row.storePrice, localCurrency)}</dd></div>
          {row.channel === 'online' && <div><dt>Ship ước tính</dt><dd>{formatCurrency(row.shippingFee, localCurrency)}</dd></div>}
          {row.channel === 'offline' && <div><dt>Hình thức</dt><dd>Mua trực tiếp</dd></div>}
          <div className="total-line"><dt>{row.channel === 'online' ? 'Tổng dự kiến' : 'Giá tại cửa hàng'}</dt><dd>{formatCurrency(row.basicTotal, localCurrency)}</dd></div>
        </dl>
        {saleActive && (
          <div className="sale-countdown-v31">
            <Clock3 size={16} />
            <span>Kết thúc ưu đãi sau <b>{formatCountdown(product.offerEndTime - now)}</b></span>
          </div>
        )}
        {!compact && <a className="buy-link soft" href={row.storeUrl || '#'} target="_blank" rel="noreferrer">Mua tại đây</a>}
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

            <div className="quick-convert premium-convert">
              <h4>Đơn vị hiển thị</h4>
              <div className="currency-grid compact">
                {currencies.map((cur) => (
                  <button key={cur} className={localCurrency === cur ? 'choice active' : 'choice'} onClick={() => selectCurrency(cur)}>{cur}</button>
                ))}
              </div>
              <small>Voucher dạng giảm tiền sẽ được hiểu theo đúng đơn vị tiền tệ bạn đang chọn.</small>
            </div>
          </section>

          <section className="modal-info-panel has-advisor premium-info-panel expected-cost-panel v30-cost-panel v31-cost-panel">
            <div className="modal-advisor-slot">
              <CawiRobot mode="modal" message="Mình sẽ giúp bạn so sánh online và cửa hàng trực tiếp gọn hơn!" />
            </div>

            <span className="category-chip">Tính năng chính của CartWise</span>
            <h2>So sánh tổng chi phí dự kiến</h2>

            <div className="shipping-basis-card-v31">
              <div>
                <b><MapPin size={18} /> Căn cứ tính phí vận chuyển</b>
                <p>{deliveryBasis ? `Đang dùng: ${deliveryBasis.label}` : 'Bạn nên cho phép lấy vị trí hoặc nhập khu vực giao hàng để CartWise có căn cứ ước tính phí vận chuyển online.'}</p>
                <small>Trong bản demo, phí ship là dữ liệu mẫu theo từng nền tảng. Khi có API chính thức từ sàn/cửa hàng, phần này có thể thay bằng phí vận chuyển thật theo địa chỉ và shop cụ thể.</small>
              </div>
              <div className="shipping-actions-v31">
                <button className="secondary" onClick={requestLocation}>Cho phép lấy vị trí</button>
                <label>
                  <input value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} placeholder="Nhập khu vực giao hàng" />
                  <button className="ghost" onClick={saveManualAddress}>Lưu</button>
                </label>
              </div>
            </div>

            <div className="best-price-box expected-hero-box v30-best-box v31-best-box">
              <span>{selectedChannel === 'online' ? 'Tổng online dự kiến thấp nhất' : 'Giá trực tiếp tham khảo thấp nhất'}</span>
              <strong>{bestSelected ? formatCurrency(bestSelected.basicTotal, localCurrency) : '—'}</strong>
              <p>{conclusion}</p>
            </div>

            <div className="expected-workspace v31-workspace">
              <section className="expected-pane fair-pane v31-fair-pane">
                <div className="expected-section-title compact-title">
                  <span>Phần 1</span>
                  <h3>So sánh công bằng</h3>
                  <p>Chọn online hoặc cửa hàng trực tiếp để xem chi tiết, tránh hiển thị quá nhiều cùng lúc.</p>
                </div>

                <div className="channel-columns-v31">
                  <article className={selectedChannel === 'online' ? 'channel-summary-v31 active' : 'channel-summary-v31'} onClick={() => setSelectedChannel('online')}>
                    <div className="channel-summary-head-v31"><Smartphone size={22} /><b>Mua online</b><span>{onlineRows.length} nền tảng</span></div>
                    <p>Tính giá sản phẩm + phí vận chuyển ước tính.</p>
                    <strong>{bestOnline ? formatCurrency(bestOnline.basicTotal, localCurrency) : '—'}</strong>
                    <button className="channel-toggle-v31" type="button">Xem online <ChevronDown size={16} /></button>
                  </article>

                  <article className={selectedChannel === 'offline' ? 'channel-summary-v31 active' : 'channel-summary-v31'} onClick={() => setSelectedChannel('offline')}>
                    <div className="channel-summary-head-v31"><Store size={22} /><b>Mua trực tiếp</b><span>{offlineRows.length} cửa hàng</span></div>
                    <p>Tham khảo giá tại cửa hàng, không cộng phí vận chuyển.</p>
                    <strong>{bestOffline ? formatCurrency(bestOffline.basicTotal, localCurrency) : '—'}</strong>
                    <button className="channel-toggle-v31" type="button">Xem trực tiếp <ChevronDown size={16} /></button>
                  </article>
                </div>

                <div className="selected-channel-detail-v31">
                  <h4>{selectedChannel === 'online' ? 'Chi tiết mua online' : 'Chi tiết mua trực tiếp'}</h4>
                  <div className="compact-fair-list v31-compact-list">
                    {selectedRows.map((row) => renderRow(row, selectedChannel === 'online' ? bestOnline : bestOffline))}
                  </div>
                </div>

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
                      {onlineRows.map((row) => {
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

            <div className="expected-conclusion-card attention-card v31-attention-card">
              <div className="attention-heading"><span>CHÚ Ý</span><b>Kết luận dự kiến</b></div>
              <p>{conclusion}</p>
            </div>

            <p className="final-price-note expected-note compact-note">
              Phí vận chuyển và thời gian ưu đãi hiện là dữ liệu demo. Để đồng bộ 100% theo thời gian thực với Shopee, Lazada, Tiki hoặc cửa hàng, CartWise cần backend/API chính thức từ từng nền tảng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
