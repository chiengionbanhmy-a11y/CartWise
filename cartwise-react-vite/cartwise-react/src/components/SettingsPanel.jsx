import { useMemo, useState } from 'react';
import { Lock, UserRound, Languages, Coins, ArrowRightLeft } from 'lucide-react';
import { languages } from '../data/i18n.js';
import { convertCurrency, formatCurrency, formatInputNumber, toVndAmount } from '../data/currency.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];
const avatarChoices = ['CW', '🛒', '🤖', '⭐', '💡', '🌏'];

function SettingsPanel({ user, profile, language, currency, onClose, onSave, onOpenLogin, onOpenRegister }) {
  const [draftProfile, setDraftProfile] = useState(profile);
  const [draftLanguage, setDraftLanguage] = useState(language);
  const [draftCurrency, setDraftCurrency] = useState(currency);
  const [amount, setAmount] = useState('1000000');
  const [fromCurrency, setFromCurrency] = useState(currency || 'VND');
  const [toCurrency, setToCurrency] = useState(currency || 'USD');

  const convertedVnd = useMemo(() => toVndAmount(Number(String(amount).replace(/,/g, '.')) || 0, fromCurrency), [amount, fromCurrency]);
  const convertedValue = useMemo(() => convertCurrency(convertedVnd, toCurrency), [convertedVnd, toCurrency]);

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
        <h2>⚙️ Cài đặt CartWise</h2>
        <p className="muted">Bạn có thể đổi ngôn ngữ và đơn vị tiền tệ dù chưa đăng nhập. Riêng hồ sơ cá nhân chỉ mở sau khi đăng nhập hoặc đăng ký.</p>

        <section className="setting-section profile-first-section v31-profile-section">
          <h3><UserRound size={22} /> Hồ sơ</h3>
          {!user ? (
            <div className="profile-lock-card-v31">
              <Lock size={38} />
              <b>Bạn cần đăng nhập hoặc đăng ký để chỉnh sửa hồ sơ.</b>
              <p>Hồ sơ cá nhân như tên hiển thị và ảnh đại diện chỉ khả dụng sau khi đăng nhập.</p>
              <div>
                <button className="primary" onClick={onOpenLogin}>Đăng nhập</button>
                <button className="secondary" onClick={onOpenRegister}>Đăng ký</button>
              </div>
            </div>
          ) : (
            <div className="profile-editor">
              <div className="avatar-preview">{draftProfile.avatar}</div>
              <div>
                <label>Tên đăng nhập</label>
                <input value={draftProfile.name} onChange={(e) => setDraftProfile({ ...draftProfile, name: e.target.value })} />
                <div className="avatar-grid">
                  {avatarChoices.map((a) => <button key={a} className={draftProfile.avatar === a ? 'choice active' : 'choice'} onClick={() => setDraftProfile({ ...draftProfile, avatar: a })}>{a}</button>)}
                </div>
              </div>
            </div>
          )}
        </section>

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
                <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))} />
              </label>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
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
