import { useState } from 'react';

function LoginModal({ mode, onClose, onLogin }) {
  const [name, setName] = useState('');

  function submit(event) {
    event.preventDefault();
    onLogin(name.trim() || 'Người dùng CartWise');
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <form className="login-modal" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Đóng">×</button>
        <h2>{mode === 'register' ? 'Tạo tài khoản demo' : 'Đăng nhập demo'}</h2>
        <p>Nhập tên để thử phần hồ sơ và cài đặt.</p>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tên của bạn" autoFocus />
        <button type="submit">Tiếp tục</button>
      </form>
    </div>
  );
}

export default LoginModal;
