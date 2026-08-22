import { useState } from 'react';
import { ArrowLeft, KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react';
import SavingsCounter from '../components/SavingsCounter.jsx';
import { getPlan } from '../data/plans.js';

function Profile({ user, profile, currency = 'VND', planId = 'free', onBack, onOpenLogin, onOpenRegister }) {
  const [passwordDraft, setPasswordDraft] = useState({ old: '', next: '', confirm: '' });
  const plan = getPlan(planId);

  const email = user?.email || localStorage.getItem('cartwise-email') || 'Chưa liên kết Gmail';

  function savePasswordDemo() {
    if (!passwordDraft.next || passwordDraft.next !== passwordDraft.confirm) {
      alert('Mật khẩu mới chưa khớp. Bạn kiểm tra lại nhé.');
      return;
    }
    localStorage.setItem('cartwise-password-updated-at', new Date().toISOString());
    setPasswordDraft({ old: '', next: '', confirm: '' });
    alert('Đã lưu thay đổi mật khẩu ở chế độ demo.');
  }

  return (
    <section className="standalone-page-v45 profile-page-v45">
      <button className="standalone-back-v45" onClick={onBack}>
        <ArrowLeft size={18} />
        Quay lại
      </button>

      <div className="standalone-hero-v45">
        <span className="eyebrow"><UserRound size={15} /> Hồ sơ</span>
        <h1>Thông tin tài khoản</h1>
        <p>Quản lý tên đăng nhập, Gmail, ảnh đại diện và thay đổi mật khẩu của bạn.</p>
      </div>

      {!user ? (
        <div className="profile-login-card-page-v45">
          <div className="profile-avatar-large-v44">{profile.avatar}</div>
          <h2>Bạn cần đăng nhập để xem hồ sơ</h2>
          <p>Hồ sơ sẽ hiển thị tên đăng nhập, Gmail, ảnh đại diện và thay đổi mật khẩu sau khi đăng nhập.</p>
          <div>
            <button className="primary" onClick={onOpenLogin}>Đăng nhập</button>
            <button className="secondary" onClick={onOpenRegister}>Đăng ký</button>
          </div>
        </div>
      ) : (
        <div className="profile-layout-page-v45">
          <article className="profile-summary-page-v45">
            <div className="profile-avatar-large-v44">{profile.avatar}</div>
            <h2>{profile.name}</h2>
            <p><Mail size={16} /> {email}</p>
            <span><ShieldCheck size={16} /> Tài khoản CartWise</span>
            {plan.savingsCounter.variant === 'simple' && (
              <SavingsCounter variant="simple" currency={currency} />
            )}
          </article>

          <article className="profile-details-page-v45">
            <div className="profile-fields-v44">
              <label>
                <span>Tên đăng nhập</span>
                <input value={profile.name} readOnly />
              </label>
              <label>
                <span>Gmail</span>
                <input value={email} readOnly />
              </label>
            </div>

            <div className="password-box-v44">
              <h3><KeyRound size={18} /> Thay đổi mật khẩu</h3>
              <input type="password" placeholder="Mật khẩu hiện tại" value={passwordDraft.old} onChange={(e) => setPasswordDraft({ ...passwordDraft, old: e.target.value })} />
              <input type="password" placeholder="Mật khẩu mới" value={passwordDraft.next} onChange={(e) => setPasswordDraft({ ...passwordDraft, next: e.target.value })} />
              <input type="password" placeholder="Nhập lại mật khẩu mới" value={passwordDraft.confirm} onChange={(e) => setPasswordDraft({ ...passwordDraft, confirm: e.target.value })} />
              <button className="primary full" onClick={savePasswordDemo}>Lưu mật khẩu</button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

export default Profile;
