import { useEffect, useState } from 'react';
import { ArrowLeft, Banknote, KeyRound, Mail, ShieldCheck, Trash2, UserRound, Pencil } from 'lucide-react';
import SavingsCounter from '../components/SavingsCounter.jsx';
import { getPlan } from '../data/plans.js';
import { loadSavedAccount, clearSavedAccount } from '../data/savedAccount.js';
import { getMonthlyBudgetEditCount, getMonthlyBudgetSnapshot, updateMonthlyBudgetOnce } from '../data/purchases.js';
import BudgetSetupModal from '../components/BudgetSetupModal.jsx';

function Profile({ user, profile, currency = 'VND', planId = 'free', onBack, onOpenLogin, onOpenRegister }) {
  const [passwordDraft, setPasswordDraft] = useState({ old: '', next: '', confirm: '' });
  // v81 — Hiện tài khoản ngân hàng đã lưu (nếu có) ngay trong hồ sơ, kèm nút xoá —
  // xem giải thích đầy đủ ở popup hỏi lưu tài khoản trong GroupCart.jsx.
  const [savedAccount, setSavedAccount] = useState(() => (user ? loadSavedAccount() : null));
  const plan = getPlan(planId);
  const [budgetRevision, setBudgetRevision] = useState(0);
  const [budgetEditOpen, setBudgetEditOpen] = useState(false);
  const budget = getMonthlyBudgetSnapshot();
  const budgetEditCount = getMonthlyBudgetEditCount();
  void budgetRevision;

  useEffect(() => {
    const refresh = () => setBudgetRevision((value) => value + 1);
    window.addEventListener('cartwise-budget-updated', refresh);
    window.addEventListener('cartwise-purchase-updated', refresh);
    return () => {
      window.removeEventListener('cartwise-budget-updated', refresh);
      window.removeEventListener('cartwise-purchase-updated', refresh);
    };
  }, []);

  const email = user?.email || localStorage.getItem('cartwise-email') || 'Chưa liên kết Gmail';

  function removeSavedAccount() {
    if (!window.confirm('Xoá tài khoản ngân hàng đã lưu trên máy này?')) return;
    clearSavedAccount();
    setSavedAccount(null);
  }

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


            <div className="profile-budget-box-v82">
              <h3><Banknote size={18} /> Ngân sách chi tiêu tháng này</h3>
              {budget.budget > 0 ? (
                <>
                  <div className="profile-budget-value-v82">Đã dùng <strong>{budget.spent.toLocaleString('vi-VN')}đ</strong> / {budget.budget.toLocaleString('vi-VN')}đ</div>
                  <div className="profile-budget-bar-v82"><span style={{ width: `${Math.min(100, budget.percent)}%` }} /></div>
                  <div className="profile-budget-actions-v82">
                    <small>Còn lại {budget.remaining.toLocaleString('vi-VN')}đ. {budgetEditCount < 1 ? 'Bạn còn 1 lần chỉnh sửa ngân sách.' : 'Ngân sách đã khóa vì bạn đã dùng lần chỉnh sửa duy nhất.'}</small>
                    {budgetEditCount < 1 && <button type="button" className="ghost" onClick={() => setBudgetEditOpen(true)}><Pencil size={14} /> Chỉnh sửa 1 lần</button>}
                  </div>
                </>
              ) : (
                <p className="saved-account-empty-v81">Bạn chưa khai báo ngân sách tháng này. CartWise sẽ yêu cầu nhập sau khi đăng nhập/đăng ký.</p>
              )}
            </div>

            <div className="saved-account-box-v81">
              <h3><Banknote size={18} /> Tài khoản ngân hàng đã lưu</h3>
              {savedAccount?.bank ? (
                <>
                  <p className="saved-account-bank-v81">{savedAccount.bank.shortName} ({savedAccount.bank.code})</p>
                  <p className="saved-account-number-v81">{savedAccount.accountNo}</p>
                  <p className="saved-account-name-v81">{savedAccount.accountName}</p>
                  <small>Dùng để tự điền khi chốt nhóm ghép đơn tạo mã QR trong "Ghép Đơn Cùng Bạn Bè".</small>
                  <button type="button" className="ghost saved-account-delete-v81" onClick={removeSavedAccount}>
                    <Trash2 size={15} /> Xoá tài khoản
                  </button>
                </>
              ) : (
                <p className="saved-account-empty-v81">Bạn chưa lưu tài khoản ngân hàng nào. Khi chốt nhóm ghép đơn trong "Ghép Đơn Cùng Bạn Bè", CartWise sẽ hỏi bạn có muốn lưu lại không.</p>
              )}
            </div>
          </article>
        </div>
      )}

      {budgetEditOpen && budget.budget > 0 && budgetEditCount < 1 && (
        <BudgetSetupModal
          mode="edit"
          initialValue={budget.budget}
          onClose={() => setBudgetEditOpen(false)}
          onSave={(amount) => {
            if (updateMonthlyBudgetOnce(amount)) {
              setBudgetEditOpen(false);
              setBudgetRevision((value) => value + 1);
              window.dispatchEvent(new CustomEvent('cartwise-budget-updated'));
            }
          }}
        />
      )}
    </section>
  );
}

export default Profile;
