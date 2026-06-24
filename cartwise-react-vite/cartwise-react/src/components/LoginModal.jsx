import { useState } from 'react';

function LoginModal({ onClose, onLogin }) {
  const [name, setName] = useState('');
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="auth-card">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Đăng nhập / Đăng ký</h2>
        <p>Đây là chế độ demo. Nhập tên để mở hồ sơ, cài đặt ngôn ngữ và tiền tệ.</p>
        <label>Tên hiển thị</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Linh" />
        <button className="primary full" onClick={() => onLogin(name.trim())}>Tiếp tục</button>
      </div>
    </div>
  );
}

export default LoginModal;
