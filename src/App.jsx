import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import PromoPopup from './components/PromoPopup.jsx';
import IntroPopup from './components/IntroPopup.jsx';
import CawiRobot from './components/CawiRobot.jsx';
import ProductModal from './components/ProductModal.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import SetupWizard from './components/SetupWizard.jsx';
import LoginModal from './components/LoginModal.jsx';
import Home from './pages/Home.jsx';
import FlashSale from './pages/FlashSale.jsx';
import Stores from './pages/Stores.jsx';
import About from './pages/About.jsx';
import Upgrade from './pages/Upgrade.jsx';
import Profile from './pages/Profile.jsx';
import CheckHistory from './pages/CheckHistory.jsx';
import PurchaseHistory from './pages/PurchaseHistory.jsx';
import GroupCart from './pages/GroupCart.jsx';
import SavingsAchievements from './pages/SavingsAchievements.jsx';
import PriceGuessGame from './pages/PriceGuessGame.jsx';
import DealHuntGame from './pages/DealHuntGame.jsx';
import CartPanel from './components/CartPanel.jsx';
import { products, getBestFinalStore, getFinalCost } from './data/products.js';
import { translations } from './data/i18n.js';
import { applyLanguageToDom } from './utils/uiTranslator.js';
import { loadCart, saveCart, isInCart } from './data/cart.js';

const savedSettings = JSON.parse(localStorage.getItem('cartwise-settings') || '{}');
const savedUser = JSON.parse(localStorage.getItem('cartwise-user') || 'null');
const savedPlan = localStorage.getItem('cartwise-plan') || 'free';

const setupComplete = localStorage.getItem('cartwise-setup-v52-complete') === 'yes';

function App() {
  const [page, setPage] = useState(() => (
    new URLSearchParams(window.location.search).get('join') ? 'group-cart' : 'home'
  ));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // v79 — "Sơ qua về CartWise" không còn tự động hiện ngay khi vào app nữa (theo yêu
  // cầu) — giờ là 1 mục "Hướng dẫn sử dụng" tự chọn trong menu 3 gạch, người dùng
  // xem được bất cứ lúc nào (hoặc không bao giờ xem) chứ không bị ép xem lần đầu.
  const [guideOpen, setGuideOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(!setupComplete);
  const [setupDone, setSetupDone] = useState(setupComplete);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(savedUser);
  const [profile, setProfile] = useState(savedSettings.profile || { name: savedUser?.name || 'Người dùng CartWise', avatar: 'CW' });
  const [language, setLanguage] = useState(savedSettings.language || 'vi');
  const [currency, setCurrency] = useState(savedSettings.currency || 'VND');
  const [planId, setPlanId] = useState(savedPlan);
  // v67 — Giỏ hàng so sánh: sản phẩm người dùng bấm "Thêm vào giỏ hàng" trong khung
  // so sánh sản phẩm, xem lại được từ icon giỏ hàng cạnh nút Đăng nhập ở navbar.
  const [cartItems, setCartItems] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  const t = translations[language] || translations.vi;

  const appState = useMemo(() => ({
    page, t, products, user, profile, language, currency, planId
  }), [page, t, user, profile, language, currency, planId]);

  useEffect(() => applyLanguageToDom(language), [language]);

  function navigate(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openGuide() {
    setGuideOpen(true);
  }

  function closeGuide() {
    setGuideOpen(false);
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
    setSettingsOpen(true);
  }

  function recordPriceCheck(product) {
    if (!product) return;

    const best = getBestFinalStore(product);
    const bestTotal = best ? getFinalCost(best) : Number(product.basePrice || 0);
    const originalPrice = Number(product.originalPrice || product.basePrice || bestTotal || 0);
    const savedAmount = Math.max(0, originalPrice - Number(bestTotal || 0));

    const entry = {
      id: `${product.id || product.name}-${Date.now()}`,
      productId: product.id || product.name,
      productName: product.name,
      image: product.image,
      category: product.category,
      checkedAt: new Date().toISOString(),
      originalPrice,
      bestTotal,
      bestStoreName: best?.storeName || 'Đang cập nhật',
      savedAmount
    };

    const old = JSON.parse(localStorage.getItem('cartwise-price-check-history') || '[]');
    localStorage.setItem('cartwise-price-check-history', JSON.stringify([entry, ...old].slice(0, 200)));
  }

  function handleOpenProduct(product) {
    recordPriceCheck(product);
    setSelectedProduct(product);
  }

  function addToCart(product) {
    if (!product || isInCart(cartItems, product.id)) return;
    const next = [{ productId: product.id, name: product.name, image: product.image, addedAt: new Date().toISOString() }, ...cartItems];
    setCartItems(next);
    saveCart(next);
  }

  function removeFromCart(productId) {
    const next = cartItems.filter((item) => item.productId !== productId);
    setCartItems(next);
    saveCart(next);
  }

  // v69 — Xoá nhiều sản phẩm cùng lúc (chế độ "Sửa" trong giỏ hàng) hoặc xoá sạch
  // toàn bộ giỏ hàng — cả 2 đều đi qua hộp xác nhận riêng trong CartPanel trước khi
  // gọi tới đây, nên ở đây chỉ cần xoá thẳng.
  function removeManyFromCart(productIds) {
    const idSet = new Set(productIds);
    const next = cartItems.filter((item) => !idSet.has(item.productId));
    setCartItems(next);
    saveCart(next);
  }

  function clearCart() {
    setCartItems([]);
    saveCart([]);
  }

  function saveSettings(next) {
    setProfile(next.profile);
    setLanguage(next.language);
    setCurrency(next.currency);
    const payload = { profile: next.profile, language: next.language, currency: next.currency };
    localStorage.setItem('cartwise-settings', JSON.stringify(payload));
  }

  function confirmInitialSetup(next) {
    const nextProfile = savedSettings.profile || profile;
    setLanguage(next.language);
    setCurrency(next.currency);
    localStorage.setItem('cartwise-settings', JSON.stringify({ profile: nextProfile, language: next.language, currency: next.currency }));
    localStorage.setItem('cartwise-setup-complete', 'yes');
    localStorage.setItem('cartwise-setup-v52-complete', 'yes');
    setSetupOpen(false);
    setSetupDone(true);
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
        onOpenUpgrade={() => navigate('upgrade')}
        onOpenProfile={() => navigate('profile')}
        onOpenHistory={() => navigate('check-history')}
        onOpenPurchaseHistory={() => navigate('purchase-history')}
        onOpenGroupCart={() => navigate('group-cart')}
        onOpenGuide={openGuide}
        planId={planId}
        cartCount={cartItems.length}
        onOpenCart={() => setCartOpen(true)}
      />

      <main>
        {page === 'home' && <Home appState={appState} onOpenProduct={handleOpenProduct} onNavigate={navigate} onOpenUpgrade={() => navigate('upgrade')} />}
        {page === 'flash' && <FlashSale appState={appState} onOpenProduct={handleOpenProduct} />}
        {page === 'stores' && <Stores appState={appState} onOpenProduct={handleOpenProduct} />}
        {page === 'about' && <About appState={appState} />}
        {page === 'upgrade' && <Upgrade onBack={() => navigate('home')} onChoosePlan={(nextPlan) => { setPlanId(nextPlan); localStorage.setItem('cartwise-plan', nextPlan); navigate('home'); }} />}
        {page === 'profile' && (
          <Profile
            user={user}
            profile={profile}
            currency={currency}
            planId={planId}
            onBack={() => navigate('home')}
            onOpenLogin={() => setAuthMode('login')}
            onOpenRegister={() => setAuthMode('register')}
          />
        )}
        {page === 'check-history' && (
          <CheckHistory
            currency={currency}
            planId={planId}
            onBack={() => navigate('home')}
            onOpenUpgrade={() => navigate('upgrade')}
          />
        )}
        {page === 'purchase-history' && (
          <PurchaseHistory
            currency={currency}
            planId={planId}
            onBack={() => navigate('home')}
            onOpenUpgrade={() => navigate('upgrade')}
          />
        )}
        {page === 'group-cart' && (
          <GroupCart
            appState={appState}
            onBack={() => navigate('home')}
            onOpenProduct={handleOpenProduct}
            onOpenUpgrade={() => navigate('upgrade')}
          />
        )}
        {page === 'savings-achievements' && (
          <SavingsAchievements
            currency={currency}
            onBack={() => navigate('home')}
          />
        )}
        {page === 'price-game' && (
          <PriceGuessGame
            onBack={() => navigate('home')}
          />
        )}
        {/* v78 — "Thử Thách Săn Deal" thay cho "Cawi Đố Giá" trên thanh nav (theo yêu
            cầu, game "thiết thực" hơn — luyện đúng hành vi so sánh giá + ngân sách).
            Trang PriceGuessGame ở trên vẫn còn nguyên trong code, không xoá, chỉ là
            không còn link dẫn tới từ thanh nav nữa (giống cách đã làm với Stores). */}
        {page === 'deal-hunt' && (
          <DealHuntGame
            onBack={() => navigate('home')}
          />
        )}
      </main>

      {guideOpen && <IntroPopup onClose={closeGuide} />}

      {setupDone && planId !== 'plus' && <PromoPopup onNavigate={navigate} products={products} />}

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
          planId={planId}
          onOpenUpgrade={() => { setSelectedProduct(null); navigate('upgrade'); }}
          inCart={isInCart(cartItems, selectedProduct.id)}
          onAddToCart={() => addToCart(selectedProduct)}
        />
      )}

      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        products={products}
        currency={currency}
        onRemove={removeFromCart}
        onRemoveMany={removeManyFromCart}
        onClearAll={clearCart}
        onOpenProduct={handleOpenProduct}
      />

      {settingsOpen && (
        <SettingsPanel
          user={user}
          profile={profile}
          language={language}
          currency={currency}
          onClose={() => setSettingsOpen(false)}
          onSave={saveSettings}
          onOpenLogin={() => { setSettingsOpen(false); setAuthMode('login'); }}
          onOpenRegister={() => { setSettingsOpen(false); setAuthMode('register'); }}
        />
      )}

      {setupOpen && (
        <SetupWizard
          initialLanguage={language}
          initialCurrency={currency}
          onConfirm={confirmInitialSetup}
        />
      )}

      {authMode && <LoginModal mode={authMode} onClose={() => setAuthMode(null)} onLogin={handleLogin} />}
    </div>
  );
}

export default App;
