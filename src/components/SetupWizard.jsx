import { useState } from 'react';
import { Globe2, Coins } from 'lucide-react';
import { languages } from '../data/i18n.js';

const currencies = ['VND', 'USD', 'CNY', 'EUR', 'JPY', 'KRW'];

const setupCopy = {
  vi: {
    eyebrow: 'Thiết lập ban đầu',
    title: 'Chọn ngôn ngữ và đơn vị tiền tệ hiển thị',
    desc: 'CartWise sẽ dùng lựa chọn này làm mặc định. Website sẽ không tự đổi ngôn ngữ hoặc tiền tệ sau khi bạn xác nhận.',
    language: 'Ngôn ngữ hiển thị',
    currency: 'Đơn vị tiền tệ hiển thị',
    confirm: 'Xác nhận thiết lập',
    ask: (language, currency) => `Bạn chắc chắn muốn dùng ngôn ngữ ${language.toUpperCase()} và đơn vị tiền tệ ${currency} làm mặc định cho CartWise?`
  },
  en: {
    eyebrow: 'Initial setup',
    title: 'Choose display language and currency',
    desc: 'CartWise will use this as your default. The website will not change language or currency automatically after you confirm.',
    language: 'Display language',
    currency: 'Display currency',
    confirm: 'Confirm setup',
    ask: (language, currency) => `Are you sure you want to use language ${language.toUpperCase()} and currency ${currency} as the default for CartWise?`
  },
  de: {
    eyebrow: 'Ersteinrichtung',
    title: 'Sprache und Anzeigewährung wählen',
    desc: 'CartWise verwendet diese Auswahl als Standard. Nach der Bestätigung wird die Website Sprache oder Währung nicht automatisch ändern.',
    language: 'Anzeigesprache',
    currency: 'Anzeigewährung',
    confirm: 'Einrichtung bestätigen',
    ask: (language, currency) => `Möchten Sie wirklich ${language.toUpperCase()} und ${currency} als Standard für CartWise verwenden?`
  },
  fr: {
    eyebrow: 'Configuration initiale',
    title: 'Choisissez la langue et la devise d’affichage',
    desc: 'CartWise utilisera ce choix par défaut. Le site ne changera pas automatiquement de langue ou de devise après confirmation.',
    language: 'Langue d’affichage',
    currency: 'Devise d’affichage',
    confirm: 'Confirmer la configuration',
    ask: (language, currency) => `Voulez-vous vraiment utiliser ${language.toUpperCase()} et ${currency} par défaut pour CartWise ?`
  },
  ja: {
    eyebrow: '初期設定',
    title: '表示言語と通貨を選択',
    desc: 'CartWise はこの選択を既定値として使用します。確認後、サイトが言語や通貨を自動変更することはありません。',
    language: '表示言語',
    currency: '表示通貨',
    confirm: '設定を確認',
    ask: (language, currency) => `言語 ${language.toUpperCase()} と通貨 ${currency} を CartWise の既定値にしますか？`
  },
  ko: {
    eyebrow: '초기 설정',
    title: '표시 언어와 통화 선택',
    desc: 'CartWise는 이 선택을 기본값으로 사용합니다. 확인 후 웹사이트가 언어나 통화를 자동으로 변경하지 않습니다.',
    language: '표시 언어',
    currency: '표시 통화',
    confirm: '설정 확인',
    ask: (language, currency) => `${language.toUpperCase()} 언어와 ${currency} 통화를 CartWise 기본값으로 설정하시겠습니까?`
  },
  es: {
    eyebrow: 'Configuración inicial',
    title: 'Elige idioma y moneda de visualización',
    desc: 'CartWise usará esta selección como predeterminada. El sitio no cambiará automáticamente el idioma o la moneda después de confirmar.',
    language: 'Idioma de visualización',
    currency: 'Moneda de visualización',
    confirm: 'Confirmar configuración',
    ask: (language, currency) => `¿Seguro que quieres usar ${language.toUpperCase()} y ${currency} como predeterminados para CartWise?`
  }
};

function SetupWizard({ initialLanguage = 'vi', initialCurrency = 'VND', onConfirm }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [currency, setCurrency] = useState(initialCurrency);
  const copy = setupCopy[language] || setupCopy.vi;

  function handleConfirm() {
    const ok = window.confirm(copy.ask(language, currency));
    if (ok) onConfirm({ language, currency });
  }

  return (
    <div className="modal-backdrop setup-backdrop" role="dialog" aria-modal="true">
      <div className="setup-card-v31">
        <span className="setup-eyebrow">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.desc}</p>

        <section className="setup-section-v31">
          <h3><Globe2 size={20} /> {copy.language}</h3>
          <div className="setup-choice-grid-v31">
            {languages.map((lang) => (
              <button key={lang.code} className={language === lang.code ? 'choice active' : 'choice'} onClick={() => setLanguage(lang.code)}>{lang.label}</button>
            ))}
          </div>
        </section>

        <section className="setup-section-v31">
          <h3><Coins size={20} /> {copy.currency}</h3>
          <div className="setup-choice-grid-v31 currency-row-v31">
            {currencies.map((cur) => (
              <button key={cur} className={currency === cur ? 'choice active' : 'choice'} onClick={() => setCurrency(cur)}>{cur}</button>
            ))}
          </div>
        </section>

        <div className="setup-actions-v31">
          <button className="primary" onClick={handleConfirm}>{copy.confirm}</button>
        </div>
      </div>
    </div>
  );
}

export default SetupWizard;
