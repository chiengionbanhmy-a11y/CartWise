import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PromoPopup from './components/PromoPopup.jsx';
import IntroPopup from './components/IntroPopup.jsx';
import FirstVisitPopup from './components/FirstVisitPopup.jsx';
import CawiRobot from './components/CawiRobot.jsx';
import ProductModal from './components/ProductModal.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import SetupWizard from './components/SetupWizard.jsx';
import LoginModal from './components/LoginModal.jsx';
import BudgetSetupModal from './components/BudgetSetupModal.jsx';
import PurchaseConfirmationModal from './components/PurchaseConfirmationModal.jsx';
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
// v85 — "Dán link sản phẩm để so sánh": sản phẩm người dùng tự thêm qua link, lưu trên
// trình duyệt này (localStorage), gộp chung với 8 sản phẩm mẫu để tìm kiếm/mở lại được
// như sản phẩm thường (xem data/customProducts.js để biết chi tiết + lưu ý minh bạch).
import { getAllCustomProducts, CUSTOM_PRODUCT_EVENT } from './data/customProducts.js';
import { translations } from './data/i18n.js';
import { applyLanguageToDom } from './utils/uiTranslator.js';
import { loadCart, saveCart, isInCart } from './data/cart.js';
// v83 — Ghép lại từ bản "sửa lỗi so sánh": tự động hỏi "Bạn đã mua chưa?" khi người
// dùng bấm "Mua tại đây" (mở sàn ở tab mới) rồi quay lại CartWise, + popup thiết lập
// ngân sách tháng 1 lần sau khi đăng nhập — bổ sung cho nút "Đã mua/Chưa mua" thủ công
// đã có sẵn trong ProductModal.jsx (v81), không thay thế.
import { addSelfReportedPurchase, getMonthlyBudget, hasMonthlyBudget, setMonthlyBudget } from './data/purchases.js';

const savedSettings = JSON.parse(localStorage.getItem('cartwise-settings') || '{}');
const savedUser = JSON.parse(localStorage.getItem('cartwise-user') || 'null');
const savedPlan = localStorage.getItem('cartwise-plan') || 'free';

const setupComplete = localStorage.getItem('cartwise-setup-v52-complete') === 'yes';

// v81 — Đếm số lần mở web trên máy này (persist qua localStorage, không phải
// sessionStorage) để chỉ tự động hiện popup chào mừng ở lần 1 và lần 2, từ lần 3 trở
// đi thì thôi — đúng yêu cầu "mở lần thứ 3 rồi thì không cần hiện". Tính mỗi lần app
// được mount (mỗi lần mở/tải lại trang) là 1 lần mở.
const VISIT_COUNT_KEY = 'cartwise-visit-count-v81';
function bumpVisitCount() {
  const current = Number(localStorage.getItem(VISIT_COUNT_KEY) || '0') + 1;
  localStorage.setItem(VISIT_COUNT_KEY, String(current));
  return current;
}

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
  // v83 — Popup thiết lập ngân sách tháng (hiện sau khi đăng nhập nếu chưa khai) +
  // "đơn mua đang chờ xác nhận" (mở khi bấm "Mua tại đây", hỏi lại khi quay về tab).
  const [budgetPromptOpen, setBudgetPromptOpen] = useState(() => Boolean(savedUser && !hasMonthlyBudget()));
  const [pendingPurchase, setPendingPurchase] = useState(null);
  // v67 — Giỏ hàng so sánh: sản phẩm người dùng bấm "Thêm vào giỏ hàng" trong khung
  // so sánh sản phẩm, xem lại được từ icon giỏ hàng cạnh nút Đăng nhập ở navbar.
  const [cartItems, setCartItems] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  // v81 — Popup chào mừng tự động, chỉ hiện ở lần mở web thứ 1 và thứ 2 trên máy này.
  const [visitCount] = useState(bumpVisitCount);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  // v85 — Sản phẩm người dùng tự thêm bằng cách dán link vào ô tìm kiếm (lưu ở
  // trình duyệt này). Đọc lại từ localStorage khi mở app, và mỗi khi có link mới được
  // thêm (sự kiện CUSTOM_PRODUCT_EVENT, phát ra từ data/customProducts.js).
  const [customProducts, setCustomProducts] = useState(getAllCustomProducts);

  useEffect(() => {
    function refreshCustomProducts() {
      setCustomProducts(getAllCustomProducts());
    }
    window.addEventListener(CUSTOM_PRODUCT_EVENT, refreshCustomProducts);
    return () => window.removeEventListener(CUSTOM_PRODUCT_EVENT, refreshCustomProducts);
  }, []);

  const t = translations[language] || translations.vi;

  const allProducts = useMemo(() => [...products, ...customProducts], [customProducts]);

  const appState = useMemo(() => ({
    page, t, products: allProducts, user, profile, language, currency, planId, monthlyBudget: getMonthlyBudget()
  }), [page, t, allProducts, user, profile, language, currency, planId]);

  useEffect(() => applyLanguageToDom(language), [language]);

  // Chỉ tự mở popup chào mừng sau khi đã qua màn thiết lập ban đầu (setupDone), để
  // không hiện chồng 2 popup cùng lúc — và chỉ ở lần mở thứ 1/2.
  useEffect(() => {
    if (setupDone && visitCount <= 2) setWelcomeOpen(true);
  }, [setupDone, visitCount]);

  // v83 — Khi người dùng bấm "Mua tại đây" (mở sàn ở tab mới) rồi quay lại tab
  // CartWise (focus/pageshow/visibilitychange), đánh dấu "đã quay lại" để hiện popup
  // hỏi xác nhận đã mua chưa (PurchaseConfirmationModal) — bổ sung cách tự động này
  // bên cạnh nút "Đã mua/Chưa mua" thủ công đã có sẵn trong ProductModal.jsx.
  useEffect(() => {
    const onReturnToTab = () => {
      if (!pendingPurchase) return;
      setPendingPurchase((current) => (current ? { ...current, returnedAt: Date.now() } : current));
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') onReturnToTab();
    };
    window.addEventListener('focus', onReturnToTab);
    window.addEventListener('pageshow', onReturnToTab);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onReturnToTab);
      window.removeEventListener('pageshow', onReturnToTab);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pendingPurchase]);

  function focusHomeSearch() {
    window.setTimeout(() => {
      const input = document.querySelector('.browser-search-shell input');
      input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => input?.focus(), 360);
    }, 80);
  }

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
    if (!hasMonthlyBudget()) setBudgetPromptOpen(true);
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

  // v83 — Bấm "Mua tại đây" trong khung so sánh (ProductModal.jsx) mở sàn ở tab mới
  // và ghi lại "đơn đang chờ xác nhận"; khi quay về tab CartWise (useEffect ở trên),
  // hiện PurchaseConfirmationModal hỏi đã mua chưa. Chọn "Đã mua" mới thật sự ghi
  // vào lịch sử mua hàng — không tự suy đoán chỉ vì đã bấm link.
  function handleStoreLinkClick(product, row) {
    if (!product || !row || row.available === false || !row.storeUrl || row.storeUrl === '#') return;
    setPendingPurchase({ product, row, startedAt: Date.now() });
  }

  function handlePurchaseConfirmed() {
    if (!pendingPurchase?.product) return;
    const paidAmount = Number(pendingPurchase.row?.basicTotal ?? pendingPurchase.row?.storePrice ?? 0);
    addSelfReportedPurchase(pendingPurchase.product, paidAmount);
    setPendingPurchase(null);
  }

  function handleBudgetSave(amount) {
    if (!setMonthlyBudget(amount)) return;
    setBudgetPromptOpen(false);
    window.dispatchEvent(new CustomEvent('cartwise-budget-updated'));
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
        {page === 'upgrade' && (
          <Upgrade
            onBack={() => navigate('home')}
            onChoosePlan={(nextPlan) => {
              // v85: bắt buộc đăng nhập/đăng ký trước khi mua gói nâng cấp.
              if (!user) {
                alert('Bạn cần đăng ký/đăng nhập trước khi mua gói nâng cấp.');
                setAuthMode('login');
                return;
              }
              setPlanId(nextPlan);
              localStorage.setItem('cartwise-plan', nextPlan);
              navigate('home');
            }}
          />
        )}
        {page === 'profile' && (
          <Profile
            user={user}
            profile={profile}
            currency={currency}
            planId={planId}
            onBack={() => navigate('home')}
            onOpenLogin={() => setAuthMode('login')}
            onOpenRegister={() => setAuthMode('register')}
            onLogout={handleLogout}
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
            onOpenLogin={() => setAuthMode('login')}
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

      <Footer onNavigate={navigate} />

      {guideOpen && <IntroPopup onClose={closeGuide} />}

      {welcomeOpen && (
        <FirstVisitPopup
          onClose={() => setWelcomeOpen(false)}
          onOpenGuide={() => { setWelcomeOpen(false); openGuide(); }}
          onCompareNow={() => { setWelcomeOpen(false); navigate('home'); focusHomeSearch(); }}
        />
      )}

      {!welcomeOpen && setupDone && planId !== 'plus' && <PromoPopup onNavigate={navigate} products={products} />}

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
          onStoreLinkClick={handleStoreLinkClick}
        />
      )}

      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        products={allProducts}
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

      {authMode && <LoginModal mode={authMode} onClose={() => setAuthMode(null)} onLogin={handleLogin} onSwitchMode={setAuthMode} />}

      {budgetPromptOpen && user && <BudgetSetupModal onSave={handleBudgetSave} />}

      {pendingPurchase?.returnedAt && (
        <PurchaseConfirmationModal
          pendingPurchase={pendingPurchase}
          onPurchased={handlePurchaseConfirmed}
          onNotPurchased={() => setPendingPurchase(null)}
        />
      )}
    </div>
  );
}

export default App;
