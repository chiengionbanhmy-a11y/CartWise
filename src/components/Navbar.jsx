import { useMemo, useState } from 'react';
import { Bell, Menu, X, Star, Lock, ChevronDown, Sparkles, User, UserPlus, LogOut, History, MessageSquare, Settings, ShoppingBag, ShoppingCart, HelpCircle, Crown } from 'lucide-react';

function Navbar({ appState, onNavigate, onOpenSettings, onOpenLogin, onOpenRegister, onLogout, onOpenUpgrade, onOpenProfile, onOpenHistory, onOpenPurchaseHistory, onOpenGroupCart, planId = 'free', cartCount = 0, onOpenCart, onOpenGuide }) {
  const { page, t, user, profile, products } = appState;
  // v84 — Huy hiệu gói tài khoản hiện tại (Plus / Plus Student), hiện ngay cạnh icon
  // giỏ hàng trên thanh nav, theo yêu cầu — chỉ hiện khi đã nâng cấp (bỏ qua gói Free).
  const planBadgeLabel = planId === 'plus' ? 'Plus' : planId === 'student' ? 'Plus Student' : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [thanksOpen, setThanksOpen] = useState(false);

  // v69 — Thêm "Thành tựu tiết kiệm" ngay cạnh "Ghép Đơn Cùng Bạn Bè", dẫn tới trang
  // bản đồ cột mốc tiết kiệm kiểu game (đã đạt / còn phía trước).
  // v73 — Bỏ mục "Điểm bán" khỏi thanh nav (theo yêu cầu, để thanh ngang gọn hơn và
  // đủ chỗ hiện đầy đủ chữ các mục còn lại, không cần cắt bớt/ẩn chữ nữa). Trang
  // Stores.jsx vẫn còn nguyên trong code, chỉ là không còn link dẫn tới từ thanh nav.
  // v76 — Thêm "Cawi Đố Giá" (minigame đoán giá sản phẩm thật) vào thanh nav. Thêm
  // mục thứ 6 có thể khiến thanh nav xuống 2 hàng ở màn hình hẹp hơn — đây là hành vi
  // AN TOÀN đã chọn từ v73 (flex-wrap, không cắt/ẩn chữ mục nào), không phải lỗi.
  // v78 — Thay "Cawi Đố Giá" bằng "Thử Thách Săn Deal" (theo yêu cầu, game thiết thực
  // hơn — luyện đúng hành vi so sánh giá + ngân sách thay vì đoán mò). Vẫn giữ đúng
  // 6 mục như v76, không thêm mục nào để không lo xuống thêm hàng.
  // v79 — Bỏ hẳn mục game "Thử Thách Săn Deal" khỏi thanh nav theo yêu cầu (không cần
  // phần game nữa). Trang DealHuntGame.jsx (route 'deal-hunt') vẫn còn nguyên trong
  // code, chỉ là không còn link dẫn tới từ thanh nav/menu 3 gạch nữa — đúng theo cách
  // đã làm trước đây với trang Stores (v73) và Cawi Đố Giá (v78). Còn lại 5 mục.
  const navs = [
    ['home', t.home],
    ['flash', t.flash],
    ['group-cart', 'Ghép Đơn Cùng Bạn Bè'],
    ['savings-achievements', 'Thành tựu tiết kiệm'],
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
        {/* v73 — Bỏ icon giỏ hàng khỏi thanh nav trên cùng (theo yêu cầu), nhường
            chỗ cho nút thông báo (chuông) và nút menu 3 gạch dịch chuyển vào đúng
            chỗ đó. Giỏ hàng vẫn mở được bình thường qua dòng "Giỏ hàng so sánh"
            trong menu 3 gạch (đã có sẵn ở dưới, không đổi gì thêm ở đó). */}
        {/* v77 — Bỏ hẳn cụm đăng nhập/đăng ký (hoặc hồ sơ/đăng xuất) khỏi thanh nav
            chính theo yêu cầu (thấy thừa) — dời toàn bộ vào trong menu 3 gạch, xem
            khối "mobile-auth-block-v77" bên dưới. */}
        {/* v80 — Theo yêu cầu mới: đưa icon giỏ hàng ra lại thanh nav chính, đứng
            NGAY BÊN TRÁI nút chuông thông báo; đưa cụm đăng nhập/đăng ký ra lại
            thanh nav chính, đứng NGAY BÊN PHẢI nút chuông thông báo. Đây là bản
            desktop (màn hình rộng) — ở mobile (≤760px) vẫn giữ nguyên cách truy cập
            qua menu 3 gạch như trước (không hiện 2 cụm này ở thanh trên cùng trên
            mobile để tránh chật chội, đúng quyết định responsive đã chọn từ v73/v77),
            nên dòng "Giỏ hàng so sánh" và khối đăng nhập/đăng ký trong menu 3 gạch
            vẫn được GIỮ NGUYÊN làm lối vào cho mobile — chỉ ẩn 2 mục đó đi trên
            desktop (xem CSS `menu-row-cart-v80`, `auth-login-row-v77`, `auth-register-row-v80`
            trong khối `@media (min-width: 761px)`) để tránh trùng lặp không cần thiết. */}

        {/* v84 — Huy hiệu gói tài khoản (Plus/Plus Student), đặt ngay cạnh icon giỏ
            hàng theo yêu cầu — cùng màu gradient than-vàng với nút "Nâng cấp ứng dụng". */}
        {planBadgeLabel && (
          <span className="plan-badge-v84" title={`Bạn đang dùng gói ${planBadgeLabel}`}>
            <Crown size={13} /> {planBadgeLabel}
          </span>
        )}

        <button className="notification-button-v43 cart-nav-btn-v80" onClick={() => { onOpenCart?.(); closePanels(); }} aria-label="Giỏ hàng so sánh">
          <ShoppingCart size={21} />
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>

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

        <div className="nav-auth-cluster-v80">
          {user ? (
            <button className="profile-pill" onClick={() => { onOpenProfile(); closePanels(); }}>
              <span>{profile.avatar}</span>
              {profile.name}
            </button>
          ) : (
            <>
              <button className="primary nav-auth-login-v80" onClick={() => { onOpenLogin(); closePanels(); }}>
                <User size={16} /> {t.login}
              </button>
              <button className="ghost auth-trigger nav-auth-register-v80" onClick={() => { onOpenRegister(); closePanels(); }}>
                <UserPlus size={16} /> Đăng ký
              </button>
            </>
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

              {/* v77 — Khối đăng nhập/tài khoản đặt ngay đầu menu 3 gạch, thay cho cụm
                  đã bỏ khỏi thanh nav chính. Chưa đăng nhập: nút "Đăng nhập" được làm
                  nổi bật hẳn (nền gradient cam giống các nút CTA chính trong app) vì
                  đây là hành động quan trọng nhất, "Đăng ký" ở dưới dạng phụ. Đã đăng
                  nhập: thẻ tài khoản (bấm vào xem hồ sơ) + dòng "Đăng xuất" dạng phụ. */}
              <div className="mobile-auth-block-v77">
                {user ? (
                  <>
                    <button className="auth-account-row-v77" onClick={() => { setMenuOpen(false); onOpenProfile(); }}>
                      <span className="auth-account-avatar-v77">{profile.avatar}</span>
                      <span className="auth-account-info-v77">
                        <strong>{profile.name}</strong>
                        <small>Xem hồ sơ</small>
                      </span>
                    </button>
                    <button className="menu-row-v43" onClick={() => { setMenuOpen(false); onLogout(); }}>
                      <LogOut size={18} />
                      <span>{t.logout}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="auth-login-row-v77" onClick={() => { setMenuOpen(false); onOpenLogin(); }}>
                      <User size={19} />
                      <span>{t.login}</span>
                    </button>
                    <button className="menu-row-v43 auth-register-row-v80" onClick={() => { setMenuOpen(false); onOpenRegister(); }}>
                      <UserPlus size={18} />
                      <span>Đăng ký</span>
                    </button>
                  </>
                )}
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

              {/* v79 — Đổi số lượng giỏ hàng từ chữ số trong ngoặc (dễ bị lướt qua) sang
                  1 icon huy hiệu tròn đè lên icon giỏ hàng, giống hệt kiểu huy hiệu số
                  ở nút chuông thông báo — dễ nhận ra ngay cần phải hiện số lượng này. */}
              {/* v80 — Icon giỏ hàng đã có riêng ở thanh nav trên cùng (bên trái nút
                  chuông) cho desktop. Dòng này vẫn giữ nguyên, chỉ ẩn đi trên desktop
                  (CSS `menu-row-cart-v80`) để làm lối vào giỏ hàng cho mobile. */}
              <button className="menu-row-v43 menu-row-cart-v80" onClick={() => { setMenuOpen(false); onOpenCart?.(); }}>
                <span className="menu-row-icon-badge-wrap-v79">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && <span className="menu-row-icon-badge-v79">{cartCount}</span>}
                </span>
                <span>Giỏ hàng so sánh</span>
              </button>

              {/* v75 — Bỏ hẳn dòng "Trợ lý Cawi Robo" khỏi menu 3 gạch theo yêu cầu.
                  Robot vẫn mở chat bình thường qua icon nổi trên trang hoặc icon
                  trong header khung giỏ hàng (cawi-cart-side-btn-v71), chỉ là không
                  còn lối tắt riêng trong menu này nữa. */}

              {/* v79 — Thẻ giới thiệu "Sơ qua về CartWise" trước đây tự hiện ép buộc
                  ngay lần đầu vào web. Giờ đổi thành 1 mục trong menu, để người dùng
                  TỰ CHỌN có muốn xem hướng dẫn sử dụng hay không, không còn ép xem nữa. */}
              <button className="menu-row-v43" onClick={() => { setMenuOpen(false); onOpenGuide?.(); }}>
                <HelpCircle size={18} />
                <span>Hướng dẫn sử dụng</span>
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
