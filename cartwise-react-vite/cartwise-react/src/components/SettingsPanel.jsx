import { useState } from 'react';
import { currencies } from '../data/products.js';

function SettingsPanel({ profile, language, currency, onClose, onSave }) {
  const [draft, setDraft] = useState({ profile, language, currency });

  function save(event) {
    event.preventDefault();
    onSave(draft);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <form className="settings-panel" onSubmit={save} onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Đóng">×</button>
        <h2>Cài đặt tài khoản</h2>
        <label>
          Tên hiển thị
          <input value={draft.profile.name} onChange={(event) => setDraft({ ...draft, profile: { ...draft.profile, name: event.target.value } })} />
        </label>
        <label>
          Avatar chữ tắt
          <input value={draft.profile.avatar} maxLength={3} onChange={(event) => setDraft({ ...draft, profile: { ...draft.profile, avatar: event.target.value.toUpperCase() } })} />
        </label>
        <label>
          Ngôn ngữ
          <select value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value })}>
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </label>
        <label>
          Đơn vị tiền tệ
          <select value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value })}>
            {currencies.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
          </select>
        </label>
        <button type="submit">Lưu cài đặt</button>
      </form>
    </div>
  );
}

export default SettingsPanel;
