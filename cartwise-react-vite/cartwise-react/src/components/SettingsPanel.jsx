import { useState } from 'react';
import { languages } from '../data/i18n.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];
const avatarChoices = ['CW', '🛒', '🤖', '⭐', '💡', '🌏'];

function SettingsPanel({ profile, language, currency, onClose, onSave }) {
  const [draftProfile, setDraftProfile] = useState(profile);
  const [draftLanguage, setDraftLanguage] = useState(language);
  const [draftCurrency, setDraftCurrency] = useState(currency);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function requestSave() {
    setConfirmOpen(true);
  }

  function confirmSave() {
    onSave({ profile: draftProfile, language: draftLanguage, currency: draftCurrency });
    setConfirmOpen(false);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="settings-panel">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Cài đặt tài khoản</h2>
        <p className="muted">Thay đổi hồ sơ, ngôn ngữ và đơn vị tiền tệ. Thay đổi chỉ áp dụng sau khi bạn xác nhận.</p>

        <section className="setting-section">
          <h3>Thay đổi hồ sơ</h3>
          <div className="profile-editor">
            <div className="avatar-preview">{draftProfile.avatar}</div>
            <div>
              <label>Tên hiển thị</label>
              <input value={draftProfile.name} onChange={(e) => setDraftProfile({ ...draftProfile, name: e.target.value })} />
              <div className="avatar-grid">
                {avatarChoices.map((a) => <button key={a} className={draftProfile.avatar === a ? 'choice active' : 'choice'} onClick={() => setDraftProfile({ ...draftProfile, avatar: a })}>{a}</button>)}
              </div>
            </div>
          </div>
        </section>

        <section className="setting-section">
          <h3>Ngôn ngữ hiển thị</h3>
          <div className="choice-grid">
            {languages.map((lang) => (
              <button key={lang.code} className={draftLanguage === lang.code ? 'choice active' : 'choice'} onClick={() => setDraftLanguage(lang.code)}>{lang.label}</button>
            ))}
          </div>
        </section>

        <section className="setting-section">
          <h3>Đơn vị tiền tệ hiển thị</h3>
          <div className="choice-grid currency-grid">
            {currencies.map((cur) => <button key={cur} className={draftCurrency === cur ? 'choice active' : 'choice'} onClick={() => setDraftCurrency(cur)}>{cur}</button>)}
          </div>
        </section>

        <div className="settings-actions">
          <button className="ghost" onClick={onClose}>Hủy</button>
          <button className="primary" onClick={requestSave}>Lưu thay đổi</button>
        </div>

        {confirmOpen && (
          <div className="confirm-box">
            <div>
              <h3>Bạn có chắc chắn muốn lưu các thay đổi này không?</h3>
              <p>Sau khi xác nhận, hồ sơ, ngôn ngữ và tiền tệ hiển thị sẽ được cập nhật.</p>
              <div className="confirm-actions">
                <button className="ghost" onClick={() => setConfirmOpen(false)}>Không</button>
                <button className="primary" onClick={confirmSave}>Có</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPanel;
