import { useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import PromoPopup from './components/PromoPopup.jsx';
import CawiRobot from './components/CawiRobot.jsx';
import ProductModal from './components/ProductModal.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import LoginModal from './components/LoginModal.jsx';
import Home from './pages/Home.jsx';
import FlashSale from './pages/FlashSale.jsx';
import Stores from './pages/Stores.jsx';
import About from './pages/About.jsx';
import { products } from './data/products.js';
import { translations } from './data/i18n.js';

const savedSettings = JSON.parse(localStorage.getItem('cartwise-settings') || '{}');
const savedUser = JSON.parse(localStorage.getItem('cartwise-user') || 'null');

function App() {
  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(savedUser);
  const [profile, setProfile] = useState(savedSettings.profile || { name: savedUser?.name || 'Người dùng CartWise', avatar: 'CW' });
  const [language, setLanguage] = useState(savedSettings.language || 'vi');
  const [currency, setCurrency] = useState(savedSettings.currency || 'VND');

  const t = translations[language] || translations.vi;

  const appState = useMemo(() => ({
    page, t, products, user, profile, language, currency
  }), [page, t, user, profile, language, currency]);

  function navigate(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleLogin(name) {
    const newUser = { name: name || 'Người dùng CartWise' };
    setUser(newUser);
    setProfile((prev) => ({ ...prev, name: newUser.name }));
    localStorage.setItem('cartwise-user', JSON.stringify(newUser));
    setAuthMode(null);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('cartwise-user');
  }

  function openSettings() {
    if (!user) {
      alert('Bạn cần đăng nhập hoặc đăng ký trước khi chỉnh sửa hồ sơ và cài đặt.');
      setAuthMode('login');
      return;
    }
    setSettingsOpen(true);
  }

  function saveSettings(next) {
    setProfile(next.profile);
    setLanguage(next.language);
    setCurrency(next.currency);
    const payload = { profile: next.profile, language: next.language, currency: next.currency };
    localStorage.setItem('cartwise-settings', JSON.stringify(payload));
  }

  return (
    <div className="app-shell">
      <Navbar
        appState={appState}
        onNavigate={navigate}
        onOpenSettings={openSettings}
        onOpenLogin={() => setAuthMode('login')}
        onOpenRegister={() => setAuthMode('register')}
        onLogout={handleLogout}
      />

      <main>
        {page === 'home' && <Home appState={appState} onOpenProduct={setSelectedProduct} onNavigate={navigate} />}
        {page === 'flash' && <FlashSale appState={appState} onOpenProduct={setSelectedProduct} />}
        {page === 'stores' && <Stores appState={appState} onOpenProduct={setSelectedProduct} />}
        {page === 'about' && <About appState={appState} />}
      </main>

      <PromoPopup onNavigate={navigate} />

      {!selectedProduct && (
        <CawiRobot
          mode="floating"
          page={page}
          message={page === 'stores' ? 'Mình sẽ giúp bạn tìm nơi bán rẻ nhất!' : page === 'flash' ? 'hôm nay đang giảm giá sốc đó!!!' : page === 'about' ? 'Tìm hiểu thêm về mình trong tab Robot CartWise nhé!' : 'Chào bạn, mình là Cawi CartBot!'}
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          currency={currency}
          onCurrencyChange={setCurrency}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {settingsOpen && (
        <SettingsPanel
          profile={profile}
          language={language}
          currency={currency}
          onClose={() => setSettingsOpen(false)}
          onSave={saveSettings}
        />
      )}

      {authMode && <LoginModal mode={authMode} onClose={() => setAuthMode(null)} onLogin={handleLogin} />}
    </div>
  );
}

export default App;
