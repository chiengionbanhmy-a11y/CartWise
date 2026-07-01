import { useEffect, useMemo, useState } from 'react';
import CawiRobot from './CawiRobot.jsx';
import { convertCurrency, formatCurrency, formatInputNumber, toVndAmount } from '../data/currency.js';
import { getStoreLogo } from '../data/products.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];
const comparableStores = ['Shopee', 'Lazada', 'Tiki'];

function getBasicTotal(row) {
  return Math.max(0, Number(row.storePrice || 0) + Number(row.shippingFee || 0));
}

function cleanNumber(value) {
  const normalized = String(value ?? '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const parts = normalized.split('.');
  if (parts.length <= 2) return normalized;
  return `${parts[0]}.${parts.slice(1).join('')}`;
}

function ProductModal({ product, currency, onCurrencyChange, onClose }) {
  const [localCurrency, setLocalCurrency] = useState(currency || 'VND');
  const [voucherByStore, setVoucherByStore] = useState({});

  useEffect(() => {
    setVoucherByStore({});
  }, [product]);

  function selectCurrency(cur) {
    setLocalCurrency(cur);
    onCurrencyChange?.(cur);
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

  const rows = useMemo(() => {
    const onlineRows = product.stores
      .filter((store) => comparableStores.includes(store.storeName))
      .sort((a, b) => comparableStores.indexOf(a.storeName) - comparableStores.indexOf(b.storeName));

    return onlineRows.map((store) => {
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
    });
  }, [product, voucherByStore, localCurrency]);

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
      <div className="product-modal premium-modal expected-cost-modal v30-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-grid premium-modal-grid expected-cost-grid v30-expected-grid">
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
              <small>Voucher dạng giảm tiền sẽ được hiểu theo đúng đơn vị tiền tệ bạn đang chọn.</small>
            </div>
          </section>

          <section className="modal-info-panel has-advisor premium-info-panel expected-cost-panel v30-cost-panel">
            <div className="modal-advisor-slot">
              <CawiRobot
                mode="modal"
                message="Mình sẽ giúp bạn so sánh tổng chi phí dự kiến một cách công bằng!"
              />
            </div>

            <span className="category-chip">Tính năng chính của CartWise</span>
            <h2>So sánh tổng chi phí dự kiến</h2>

            <div className="best-price-box expected-hero-box v30-best-box">
              <span>Tổng chi phí dự kiến thấp nhất</span>
              <strong>{bestBasic ? formatCurrency(bestBasic.basicTotal, localCurrency) : '—'}</strong>
              <p>{basicConclusion}</p>
            </div>

            <div className="expected-workspace">
              <section className="expected-pane fair-pane">
                <div className="expected-section-title compact-title">
                  <span>Phần 1</span>
                  <h3>So sánh công bằng</h3>
                  <p>Chưa tính voucher cá nhân để tránh làm sai lệch kết quả chính.</p>
                </div>

                <div className="compact-fair-list">
                  {rows.map((row) => {
                    const isBest = row.storeName === bestBasic?.storeName;
                    const status = isBest ? 'Tốt nhất' : row.basicTotal === bestBasic?.basicTotal ? 'Tốt' : 'Cao hơn';
                    return (
                      <article className={isBest ? 'fair-cost-card best-basic' : 'fair-cost-card'} key={row.storeName}>
                        <div className="fair-cost-head">
                          <img src={getStoreLogo(row.storeName)} alt={row.storeName} />
                          <div>
                            <b>{row.storeName}</b>
                            <span className={status === 'Tốt nhất' ? 'status-pill best' : 'status-pill'}>{status}</span>
                          </div>
                        </div>
                        <dl>
                          <div><dt>Giá</dt><dd>{formatCurrency(row.storePrice, localCurrency)}</dd></div>
                          <div><dt>Ship</dt><dd>{formatCurrency(row.shippingFee, localCurrency)}</dd></div>
                          <div className="total-line"><dt>Tổng</dt><dd>{formatCurrency(row.basicTotal, localCurrency)}</dd></div>
                        </dl>
                        <a className="buy-link soft" href={row.storeUrl || '#'} target="_blank" rel="noreferrer">Mua tại đây</a>
                      </article>
                    );
                  })}
                </div>

                <div className="formula-box expected-formula compact-formula">
                  <b>Công thức:</b> Tổng cơ bản = Giá sản phẩm + Phí vận chuyển ước tính
                </div>
              </section>

              <section className="expected-pane personal-pane">
                <div className="expected-section-title compact-title">
                  <span>Phần 2</span>
                  <h3>Tùy chỉnh theo tài khoản của bạn</h3>
                  <p>Chọn giảm tiền hoặc giảm %, rồi nhập mức giảm bạn đang có.</p>
                </div>

                <div className="voucher-card-grid compact-voucher-grid">
                  {rows.map((row) => {
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
              </section>
            </div>

            <div className="expected-conclusion-card attention-card">
              <div className="attention-heading"><span>CHÚ Ý</span><b>Kết luận dự kiến</b></div>
              <p>{personalConclusion}</p>
            </div>

            <p className="final-price-note expected-note compact-note">
              Kết quả chỉ là dự kiến. Voucher bạn nhập sẽ được tính theo đơn vị tiền tệ đang chọn; nếu tài khoản hoặc nền tảng khác có voucher riêng, kết quả có thể thay đổi.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
