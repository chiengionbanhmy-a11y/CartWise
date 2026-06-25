function Icon({ children }) {
  return <span className="nav-icon" aria-hidden="true">{children}</span>;
}

function Navbar({ appState, onNavigate, onOpenSettings, onOpenLogin, onOpenRegister, onLogout }) {
  const { page, t, user, profile } = appState;
  const navItems = [
    { id: 'home', label: t.home, icon: '⌂' },
    { id: 'stores', label: 'So sánh sản phẩm', icon: '⇄' },
    { id: 'stores', label: t.stores, icon: '⌖' },
    { id: 'flash', label: t.flash, icon: '⚡' },
    { id: 'about', label: t.about, icon: 'ⓘ' }
  ];

  return (
    <>
      <aside className="sidebar">
        <button className="brand" type="button" onClick={() => onNavigate('home')}>
          <span className="brand-mark">🛒</span>
          <span><b>Cart</b><em>Wise</em></span>
        </button>

        <nav className="nav-list" aria-label="Điều hướng chính">
          {navItems.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              type="button"
              onClick={() => onNavigate(item.id)}
            >
              <Icon>{item.icon}</Icon>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <span>Mới</span>
          <strong>Tiết kiệm thông minh<br />Mua sắm dễ dàng</strong>
          <p>CartWise giúp bạn so sánh giá và tìm ưu đãi tốt nhất.</p>
          <button type="button" onClick={() => onNavigate('stores')}>Khám phá ngay →</button>
        </div>
      </aside>

      <header className="topbar">
        <label className="top-search">
          <span>⌕</span>
          <input placeholder="Tìm sản phẩm, thương hiệu..." aria-label="Tìm sản phẩm" />
        </label>

        <div className="top-actions">
          <button className="round-action" type="button" aria-label="Thông báo">🔔<small>3</small></button>
          <button className="round-action" type="button" aria-label="Yêu thích">♡</button>
          {user ? (
            <>
              <button className="profile-chip" type="button" onClick={onOpenSettings}>
                <span>{profile.avatar || 'CW'}</span>{profile.name}
              </button>
              <button className="ghost-small" type="button" onClick={onLogout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <button className="ghost-small" type="button" onClick={onOpenLogin}>Đăng nhập</button>
              <button className="solid-small" type="button" onClick={onOpenRegister}>Đăng ký</button>
            </>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
