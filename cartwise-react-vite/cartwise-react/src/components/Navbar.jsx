function Navbar({ appState, onNavigate, onOpenSettings, onOpenLogin, onOpenRegister, onLogout }) {
  const { page, t, user, profile } = appState;
  const navs = [
    ['home', t.home],
    ['flash', t.flash],
    ['stores', t.stores],
    ['about', t.about]
  ];

  return (
    <header className="navbar navbar-minimal">
      <button className="brand" onClick={() => onNavigate('home')} aria-label="CartWise Home">
        <img src="/cartwise-logo-icon-v4.png" alt="CartWise logo" className="brand-logo-image" />
        <span>
          <strong>CartWise</strong>
          <small className="brand-slogan">Smart cart, smart decisions.</small>
        </span>
      </button>

      <nav className="nav-links">
        {navs.map(([key, label]) => (
          <button key={key} className={page === key ? 'nav-active' : ''} onClick={() => onNavigate(key)}>{label}</button>
        ))}
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <button className="profile-pill" onClick={onOpenSettings}><span>{profile.avatar}</span>{profile.name}</button>
            <button className="ghost" onClick={onLogout}>{t.logout}</button>
          </>
        ) : (
          <>
            <button className="ghost auth-trigger" onClick={onOpenLogin}>{t.login}</button>
            <button className="primary small auth-trigger" onClick={onOpenRegister}>Đăng ký</button>
          </>
        )}
        <button className="ghost settings-trigger gear-trigger" onClick={onOpenSettings} aria-label="Cài đặt">⚙️</button>
      </div>
    </header>
  );
}

export default Navbar;
