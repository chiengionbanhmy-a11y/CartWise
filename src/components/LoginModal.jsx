import { useState } from 'react';
import { Phone, ShieldCheck, Sparkles, Tags, Wallet } from 'lucide-react';

const options = [
  { key: 'google', label: 'Google', icon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' },
  { key: 'gmail', label: 'Gmail', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg' },
  { key: 'facebook', label: 'Facebook', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg' },
  { key: 'phone', label: 'Số điện thoại', icon: null, phone: true }
];

// v81 — Điểm nhấn ngắn gọn ở panel bên trái, thay cho khối ảnh tĩnh cũ — nêu đúng 3
// giá trị thật CartWise đang có (so sánh giá, ưu đãi, an toàn dữ liệu demo) thay vì
// 1 câu mô tả chung chung duy nhất.
const highlights = [
  { icon: Tags, text: 'So sánh tổng chi phí (giá + phí ship) giữa nhiều nơi bán' },
  { icon: Wallet, text: 'Theo dõi lịch sử giá và tiết kiệm của riêng bạn' },
  { icon: ShieldCheck, text: 'Dữ liệu tài khoản chỉ lưu trên máy bạn ở bản demo này' }
];

function LoginModal({ mode = 'login', onClose, onLogin, onSwitchMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const isRegister = mode === 'register';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className={`auth-card auth-card-${mode} auth-card-v81`}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="auth-layout">
          <div className="auth-copy auth-copy-v81">
            <span className="eyebrow"><Sparkles size={13} /> {isRegister ? 'Thành viên mới' : 'Chào mừng trở lại'}</span>
            <h2>{isRegister ? 'Đăng ký tài khoản CartWise' : 'Đăng nhập vào CartWise'}</h2>
            <p>{isRegister ? 'Tạo tài khoản để lưu hồ sơ, cài đặt ngôn ngữ, tiền tệ và đồng bộ trải nghiệm mua sắm.' : 'Đăng nhập để tiếp tục sử dụng cài đặt hồ sơ, so sánh giá và trợ lý Cawi Robo.'}</p>
            <div className="auth-visual-card auth-visual-card-v81">
              <img src="/cartwise-logo-icon-v4.png" alt="CartWise" />
              <ul className="auth-highlight-list-v81">
                {highlights.map((item) => (
                  <li key={item.text}><item.icon size={16} /><span>{item.text}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-switch-row">
              <button className={isRegister ? 'choice' : 'choice active'} type="button" onClick={() => onSwitchMode?.('login')}>Đăng nhập</button>
              <button className={isRegister ? 'choice active' : 'choice'} type="button" onClick={() => onSwitchMode?.('register')}>Đăng ký</button>
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
                  {option.phone ? <span className="provider-phone provider-phone-v81"><Phone size={17} /></span> : <img src={option.icon} alt={option.label} />}
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
