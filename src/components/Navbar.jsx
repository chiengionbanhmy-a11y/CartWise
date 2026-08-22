import { useMemo, useState } from 'react';
import { Bell, Menu, X, Star, Lock, ChevronDown, Sparkles, User, History, MessageSquare, Settings, ShoppingBag } from 'lucide-react';

function Navbar({ appState, onNavigate, onOpenSettings, onOpenLogin, onOpenRegister, onLogout, onOpenUpgrade, onOpenProfile, onOpenHistory, onOpenPurchaseHistory, onOpenGroupCart, planId = 'free' }) {
  const { page, t, user, profile, products } = appState;
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [thanksOpen, setThanksOpen] = useState(false);

  const navs = [
    ['home', t.home],
    ['flash', t.flash],
    ['stores', t.stores],
    ['optimal-cart', 'Giỏ Hàng Tối Ưu'],
    ['group-cart', 'Ghép Đơn Cùng Bạn Bè'],
    ['about', t.about]
  ];

  function handleNavClick(key) {
    if (key === 'group-cart') {
      onOpenGroupCart?.();
      return;
    }
    onNavigate(key);
  }

  const dailySaleProducts = useMemo(() => {
    const plannedPairs = [
      ['lego-classic', 'teddy-bear'],
      ['rice-cooker', 'notebook'],
      ['mouse-logitech', 'powerbank-anker'],
      ['sunscreen', 'lipstick'],
      ['mini-fan', 'water-lavie-500'],
      ['haohao', 'casio']
    ];
    const dayIndex = Math.floor(Date.now() / 86400000) % plannedPairs.length;
    const selected = plannedPairs[dayIndex]
      .map((id) => products.find((item) => item.id === id))
      .filter(Boolean);
    if (selected.length >= 2) return selected;

    const start = (Math.floor(Date.now() / 86400000) * 2) % Math.max(1, products.length);
    return [products[start], products[(start + 1) % products.length]].filter(Boolean);
  }, [products]);

  const topSale = dailySaleProducts[0];

  const notices = [
    topSale ? `Flash sale hôm nay: ${topSale.name} đang giảm mạnh.` : 'Flash sale hôm nay đã sẵn sàng.',
    'Voucher mới: giảm 10% cho người dùng mới.',
    dailySaleProducts[1] ? `${dailySaleProducts[1].name} vừa giảm thêm khoảng ${Math.max(5000, Math.round((dailySaleProducts[1].originalPrice - dailySaleProducts[1].basePrice) / 2)).toLocaleString('vi-VN')}đ.` : 'Một số sản phẩm đang có tổng chi phí dự kiến tốt hơn.'
  ];

  const ratingLabels = ['Không hài lòng', 'Chất lượng kém', 'Bình thường', 'Chất lượng tốt', 'Rất hài lòng'];
  const feedbackSuggestions = ['Điểm uy tín shop?', 'Tỷ lệ giao đúng?', 'Hàng chính hãng?'];

  function closePanels() {
    setMenuOpen(false);
    setNoticeOpen(false);
  }

  function submitFeedback() {
    const payload = {
      rating,
      text: feedbackText,
      createdAt: new Date().toISOString()
    };
    const old = JSON.parse(localStorage.getItem('cartwise-feedback') || '[]');
    localStorage.setItem('cartwise-feedback', JSON.stringify([payload, ...old].slice(0, 20)));
    setFeedbackText('');
    setRating(0);
    setFeedbackOpen(false);
    setThanksOpen(true);
  }

  return (
    <header className="navbar navbar-minimal">
      <button className="brand" onClick={() => { closePanels(); onNavigate('home'); }} aria-label="CartWise Home">
        <img src="/cartwise-logo-icon-v4.png" alt="CartWise logo" className="brand-logo-image" />
        <span className="brand-copy-row">
          <strong>CartWise</strong>
        </span>
      </button>

      <nav className="nav-links">
        {navs.map(([key, label]) => (
          <button key={key} className={page === key ? 'nav-active' : ''} onClick={() => { closePanels(); handleNavClick(key); }}>{label}</button>
        ))}
      </nav>

      <div className="nav-actions nav-actions-v43">
        {user ? (
          <>
            <button className="profile-pill" onClick={() => { closePanels(); onOpenProfile(); }}><span>{profile.avatar}</span>{profile.name}</button>
            <button className="ghost" onClick={onLogout}>{t.logout}</button>
          </>
        ) : (
          <>
            <button className="ghost auth-trigger" onClick={onOpenLogin}>{t.login}</button>
            <button className="primary small auth-trigger" onClick={onOpenRegister}>Đăng ký</button>
          </>
        )}

        <div className="nav-popover-host-v43 nav-notification-host-v53">
          <button className="notification-button-v43" onClick={() => { setNoticeOpen((open) => !open); setMenuOpen(false); }} aria-label="Thông báo CartWise">
            <Bell size={21} />
            <span>{notices.length}</span>
          </button>
          {noticeOpen && (
            <div className="notification-panel-v43">
              <div className="popover-head-v43">
                <strong>Thông báo</strong>
                <button onClick={() => setNoticeOpen(false)}><X size={16} /></button>
              </div>
              {notices.map((item, index) => (
                <button key={item} className="notice-item-v43" onClick={() => { setNoticeOpen(false); if (index === 0) onNavigate('flash'); }}>
                  <span>{index === 0 ? 'FLASH SALE' : index === 1 ? 'VOUCHER' : 'GIẢM GIÁ'}</span>
                  <b>{item}</b>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="nav-popover-host-v43 nav-hamburger-host-v53">
          <button className="hamburger-button-v43" onClick={() => { setMenuOpen((open) => !open); setNoticeOpen(false); }} aria-label="Mở menu">
            <Menu size={26} />
          </button>

          {menuOpen && (
            <div className="hamburger-panel-v44 hamburger-panel-v53">
              <div className="mobile-menu-head-v53">
                <span>CartWise</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Đóng menu"><X size={22} /></button>
              </div>

              <div className="mobile-primary-nav-v53">
                {navs.map(([key, label]) => (
                  <button
                    key={key}
                    className={page === key ? 'active' : ''}
                    onClick={() => { setMenuOpen(false); handleNavClick(key); }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button className="upgrade-row-v44" onClick={() => { setMenuOpen(false); onOpenUpgrade(); }}>
                <Sparkles size={19} />
                <span>Nâng cấp ứng dụng</span>
              </button>

              <button className="menu-row-v43" onClick={() => { setMenuOpen(false); onOpenProfile(); }}>
                <User size={18} />
                <span>Hồ sơ</span>
              </button>

              <button className="menu-row-v43" onClick={() => { setMenuOpen(false); onOpenHistory(); }}>
                <History size={18} />
                <span>Lịch sử kiểm tra giá</span>
              </button>

              <button className="menu-row-v43" onClick={() => { setMenuOpen(false); onOpenPurchaseHistory?.(); }}>
                <ShoppingBag size={18} />
                <span>Lịch sử mua hàng</span>
              </button>

              <button className="menu-row-v43" onClick={() => { setMenuOpen(false); setFeedbackOpen(true); }}>
                <MessageSquare size={18} />
                <span>Ý kiến, phản hồi của khách hàng</span>
              </button>

              <button className="menu-row-v43" onClick={() => { setMenuOpen(false); onOpenSettings(); }}>
                <Settings size={18} />
                <span>Cài đặt</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {feedbackOpen && (
        <div className="feedback-backdrop-v43" role="dialog" aria-modal="true">
          <section className="feedback-modal-v43">
            <button className="feedback-close-v43" onClick={() => setFeedbackOpen(false)}><X size={18} /></button>
            <span className="eyebrow">Phản hồi khách hàng</span>
            <h2>Bạn thấy CartWise thế nào?</h2>
            <div className="star-rating-v43">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className={rating >= star ? 'active' : ''} onClick={() => setRating(star)} title={ratingLabels[star - 1]}>
                  <Star size={26} fill="currentColor" />
                  <small>{ratingLabels[star - 1]}</small>
                </button>
              ))}
            </div>
            <div className="feedback-suggestions-v43">
              {feedbackSuggestions.map((text) => (
                <button key={text} onClick={() => setFeedbackText((old) => old ? `${old}\n${text} ` : `${text} `)}>{text}</button>
              ))}
            </div>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Viết góp ý của bạn tại đây..."
            />
            <button className="primary full" onClick={submitFeedback}>Gửi phản hồi</button>
          </section>
        </div>
      )}

      {thanksOpen && (
        <div className="feedback-thanks-overlay-v46" role="dialog" aria-modal="true" aria-label="Cảm ơn phản hồi">
          <section className="feedback-thanks-card-v46">
            <button onClick={() => setThanksOpen(false)} aria-label="Đóng lời cảm ơn">×</button>
            <h2>Cảm ơn vì đã phản hồi cho chúng tôi</h2>
            <img src="/cawi-feedback-thanks.png" alt="Cawi Robo vui mừng" />
          </section>
        </div>
      )}
    </header>
  );
}

export default Navbar;
