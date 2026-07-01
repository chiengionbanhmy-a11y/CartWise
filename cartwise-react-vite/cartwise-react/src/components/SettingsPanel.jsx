import { useState } from 'react';
import { languages } from '../data/i18n.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];
const avatarChoices = ['CW', '🛒', '🤖', '⭐', '💡', '🌏'];

function SettingsPanel({ profile, language, currency, onClose, onSave }) {
  const [draftProfile, setDraftProfile] = useState(profile);
  const [draftLanguage, setDraftLanguage] = useState(language);
  const [draftCurrency, setDraftCurrency] = useState(currency);
  const [fromCurrency, setFromCurrency] = useState('VND');

  function confirmSave() {
    onSave({ profile: draftProfile, language: draftLanguage, currency: draftCurrency });
    onClose();
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="settings-panel v30-settings-panel">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>⚙️ Cài đặt CartWise</h2>
        <p className="muted">Các mục được sắp xếp theo thứ tự: Hồ sơ, ngôn ngữ, đơn vị tiền tệ và xác nhận thay đổi.</p>

        <section className="setting-section profile-first-section">
          <h3>Hồ sơ</h3>
          <p className="setting-help">Bạn cần đăng ký hoặc đăng nhập để CartWise hiển thị tên đăng nhập và ảnh đại diện.</p>
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
        </section>

        <section className="setting-section">
          <h3>Ngôn ngữ</h3>
          <div className="choice-grid language-grid-v30">
            {languages.map((lang) => (
              <button key={lang.code} className={draftLanguage === lang.code ? 'choice active' : 'choice'} onClick={() => setDraftLanguage(lang.code)}>{lang.label}</button>
            ))}
          </div>
        </section>

        <section className="setting-section currency-converter-section">
          <h3>Đơn vị tiền tệ hiển thị</h3>
          <div className="currency-convert-table">
            <div>
              <label>Tiền tệ đổi ra</label>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                <option value="" disabled>Ấn vào đây</option>
                {currencies.map((cur) => <option key={cur} value={cur}>{cur}</option>)}
              </select>
            </div>
            <div>
              <label>Tiền tệ được đổi ra</label>
              <select value={draftCurrency} onChange={(e) => setDraftCurrency(e.target.value)}>
                <option value="" disabled>Ấn vào đây</option>
                {currencies.map((cur) => <option key={cur} value={cur}>{cur}</option>)}
              </select>
            </div>
          </div>
          <small>CartWise sẽ dùng đơn vị ở ô “Tiền tệ được đổi ra” để hiển thị giá trên website.</small>
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
