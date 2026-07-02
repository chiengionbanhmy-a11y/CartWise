import { useState } from 'react';
import { Globe2, Coins } from 'lucide-react';
import { languages } from '../data/i18n.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];

function SetupWizard({ initialLanguage = 'vi', initialCurrency = 'VND', onConfirm }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [currency, setCurrency] = useState(initialCurrency);

  function handleConfirm() {
    const ok = window.confirm(`Bạn chắc chắn muốn dùng ngôn ngữ ${language.toUpperCase()} và đơn vị tiền tệ ${currency} làm mặc định cho CartWise?`);
    if (ok) onConfirm({ language, currency });
  }

  return (
    <div className="modal-backdrop setup-backdrop" role="dialog" aria-modal="true">
      <div className="setup-card-v31">
        <span className="setup-eyebrow">Thiết lập ban đầu</span>
        <h2>Chọn ngôn ngữ và đơn vị tiền tệ hiển thị</h2>
        <p>CartWise sẽ dùng lựa chọn này làm mặc định. Website sẽ không tự đổi ngôn ngữ hoặc tiền tệ sau khi bạn xác nhận.</p>

        <section className="setup-section-v31">
          <h3><Globe2 size={20} /> Ngôn ngữ hiển thị</h3>
          <div className="setup-choice-grid-v31">
            {languages.map((lang) => (
              <button key={lang.code} className={language === lang.code ? 'choice active' : 'choice'} onClick={() => setLanguage(lang.code)}>{lang.label}</button>
            ))}
          </div>
        </section>

        <section className="setup-section-v31">
          <h3><Coins size={20} /> Đơn vị tiền tệ hiển thị</h3>
          <div className="setup-choice-grid-v31 currency-row-v31">
            {currencies.map((cur) => (
              <button key={cur} className={currency === cur ? 'choice active' : 'choice'} onClick={() => setCurrency(cur)}>{cur}</button>
            ))}
          </div>
        </section>

        <div className="setup-actions-v31">
          <button className="primary" onClick={handleConfirm}>Xác nhận thiết lập</button>
        </div>
      </div>
    </div>
  );
}

export default SetupWizard;
