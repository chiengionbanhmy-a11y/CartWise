import { useMemo, useState } from 'react';
import { Languages, Coins, ArrowRightLeft } from 'lucide-react';
import { languages } from '../data/i18n.js';
import { convertCurrency, formatCurrency, formatInputNumber, toVndAmount } from '../data/currency.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];
const avatarChoices = ['CW', '🛒', '🤖', '⭐', '💡', '🌏'];

function parseFormattedAmount(value) {
  const clean = String(value || '').replace(/,/g, '').replace(/[^0-9.]/g, '');
  const parts = clean.split('.');
  const normalized = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : clean;
  return Number(normalized || 0);
}

function formatAmountTyping(value, currency = 'VND') {
  const clean = String(value || '').replace(/,/g, '').replace(/[^0-9.]/g, '');
  if (!clean) return '';

  const [rawInteger, ...decimalParts] = clean.split('.');
  const integer = rawInteger.replace(/^0+(?=\d)/, '') || '0';
  const formattedInteger = Number(integer).toLocaleString('en-US');
  const allowDecimal = !['VND', 'JPY', 'KRW'].includes(currency);
  if (!allowDecimal || decimalParts.length === 0) return formattedInteger;

  const decimal = decimalParts.join('').slice(0, 2);
  return `${formattedInteger}.${decimal}`;
}

function SettingsPanel({ user, profile, language, currency, onClose, onSave, onOpenLogin, onOpenRegister }) {
  const [draftProfile, setDraftProfile] = useState(profile);
  const [draftLanguage, setDraftLanguage] = useState(language);
  const [draftCurrency, setDraftCurrency] = useState(currency);
  const [amount, setAmount] = useState('1,000,000');
  const [fromCurrency, setFromCurrency] = useState(currency || 'VND');
  const [toCurrency, setToCurrency] = useState(currency || 'USD');

  const convertedVnd = useMemo(() => toVndAmount(parseFormattedAmount(amount), fromCurrency), [amount, fromCurrency]);
  const convertedValue = useMemo(() => convertCurrency(convertedVnd, toCurrency), [convertedVnd, toCurrency]);

  function handleAmountChange(value) {
    setAmount(formatAmountTyping(value, fromCurrency));
  }

  function confirmSave() {
    const ok = window.confirm(`Bạn chắc chắn muốn lưu ngôn ngữ ${draftLanguage.toUpperCase()} và đơn vị tiền tệ ${draftCurrency} làm mặc định hiển thị?`);
    if (!ok) return;
    onSave({ profile: draftProfile, language: draftLanguage, currency: draftCurrency });
    onClose();
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="settings-panel v30-settings-panel v31-settings-panel">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>⚙️ Cài đặt</h2>
        <p className="muted">Điều chỉnh ngôn ngữ hiển thị, đơn vị tiền tệ và quy đổi nhanh ngay tại đây.</p>
        <section className="setting-section v31-language-section">
          <h3><Languages size={22} /> Ngôn ngữ hiển thị</h3>
          <div className="choice-grid language-grid-v30">
            {languages.map((lang) => (
              <button key={lang.code} className={draftLanguage === lang.code ? 'choice active' : 'choice'} onClick={() => setDraftLanguage(lang.code)}>{lang.label}</button>
            ))}
          </div>
        </section>

        <section className="setting-section currency-converter-section v31-currency-section">
          <h3><Coins size={22} /> Đơn vị tiền tệ hiển thị</h3>
          <p className="setting-help">Giá trong các trang sẽ chuyển sang đơn vị này sau khi bạn bấm xác nhận thay đổi.</p>
          <div className="currency-display-pills-v31">
            {currencies.map((cur) => (
              <button key={cur} className={draftCurrency === cur ? 'choice active' : 'choice'} onClick={() => setDraftCurrency(cur)}>{cur}</button>
            ))}
          </div>

          <div className="quick-converter-v31">
            <h4>Quy đổi tiền tệ nhanh</h4>
            <div className="converter-row-v31">
              <label>
                <span>Số tiền</span>
                <input value={amount} onChange={(e) => handleAmountChange(e.target.value)} />
              </label>
              <select value={fromCurrency} onChange={(e) => {
                const next = e.target.value;
                setFromCurrency(next);
                setAmount((current) => formatAmountTyping(current, next));
              }}>
                {currencies.map((cur) => <option key={cur} value={cur}>{cur}</option>)}
              </select>
              <ArrowRightLeft size={22} className="converter-arrow-v31" />
              <div className="converter-result-v31">
                <span>Sang</span>
                <strong>{toCurrency === 'VND' ? formatCurrency(convertedVnd, 'VND') : formatInputNumber(convertedValue, toCurrency)}</strong>
              </div>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {currencies.map((cur) => <option key={cur} value={cur}>{cur}</option>)}
              </select>
            </div>
            <small>Tỷ giá mẫu để demo giao diện, có thể thay bằng API tỷ giá thật ở bản sau.</small>
          </div>
        </section>

        <div className="settings-actions confirm-change-row">
          <button className="ghost" onClick={onClose}>Hủy</button>
          <button className="primary" onClick={confirmSave}>Xác nhận thay đổi</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
