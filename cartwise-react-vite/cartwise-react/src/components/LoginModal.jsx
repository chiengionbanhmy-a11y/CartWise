import { useState } from 'react';

const options = [
  { key: 'google', label: 'Google', icon: 'https://cdn.simpleicons.org/google' },
  { key: 'gmail', label: 'Gmail', icon: 'https://cdn.simpleicons.org/gmail' },
  { key: 'facebook', label: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook' },
  { key: 'phone', label: 'Số điện thoại', icon: null, phone: true }
];

function LoginModal({ mode = 'login', onClose, onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const isRegister = mode === 'register';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className={`auth-card auth-card-${mode}`}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="auth-layout">
          <div className="auth-copy">
            <span className="eyebrow">{isRegister ? 'New member' : 'Welcome back'}</span>
            <h2>{isRegister ? 'Đăng ký tài khoản CartWise' : 'Đăng nhập vào CartWise'}</h2>
            <p>{isRegister ? 'Tạo tài khoản để lưu hồ sơ, cài đặt ngôn ngữ, tiền tệ và đồng bộ trải nghiệm mua sắm.' : 'Đăng nhập để tiếp tục sử dụng cài đặt hồ sơ, so sánh giá và trợ lý Cawi Robo.'}</p>
            <div className="auth-visual-card">
              <img src="/cartwise-logo-icon.png" alt="CartWise" />
              <p>So sánh giá, xem ưu đãi, và đi đến nơi mua chính thức chỉ trong vài bước.</p>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-switch-row">
              <button className={isRegister ? 'choice' : 'choice active'} type="button">Đăng nhập</button>
              <button className={isRegister ? 'choice active' : 'choice'} type="button">Đăng ký</button>
            </div>
            <label>Tên hiển thị</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Linh" />
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            {isRegister && (
              <>
                <label>Số điện thoại</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" />
              </>
            )}
            <button className="primary full" onClick={() => onLogin(name.trim() || 'Người dùng CartWise')}>
              {isRegister ? 'Tạo tài khoản' : 'Tiếp tục đăng nhập'}
            </button>
            <div className="auth-divider"><span>hoặc tiếp tục với</span></div>
            <div className="auth-provider-grid">
              {options.map((option) => (
                <button key={option.key} className="auth-provider" type="button" onClick={() => onLogin(name.trim() || option.label)}>
                  {option.phone ? <span className="provider-phone">☎</span> : <img src={option.icon} alt={option.label} />}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
