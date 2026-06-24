function Navbar({ appState, onNavigate, onOpenSettings, onOpenLogin, onLogout }) {
  const { page, t, user, profile } = appState;
  const navs = [
    ['home', t.home],
    ['flash', t.flash],
    ['stores', t.stores],
    ['about', t.about]
  ];
  return (
    <header className="navbar">
      <button className="brand" onClick={() => onNavigate('home')} aria-label="CartWise Home">
        <span className="brand-logo">CW</span>
        <span>
          <strong>CartWise</strong>
          <small>Smart shopping bot</small>
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
          <button className="primary small" onClick={onOpenLogin}>{t.login}</button>
        )}
        <button className="ghost" onClick={onOpenSettings}>{t.settings}</button>
      </div>
    </header>
  );
}

export default Navbar;
