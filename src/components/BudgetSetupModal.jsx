import { useState } from 'react';
import { LockKeyhole, Wallet } from 'lucide-react';

function BudgetSetupModal({ onSave, initialValue = '', mode = 'setup', onClose }) {
  const [value, setValue] = useState(String(initialValue || ''));
  const numeric = Number(String(value).replace(/[^0-9]/g, ''));

  function submit(event) {
    event.preventDefault();
    if (!Number.isFinite(numeric) || numeric <= 0) return;
    onSave(numeric);
  }

  return (
    <div className="modal-backdrop budget-setup-backdrop-v82" role="dialog" aria-modal="true" aria-labelledby="budget-setup-title-v82">
      <div className="budget-setup-card-v82">
        {mode === 'edit' && onClose && <button type="button" className="close-btn budget-setup-close-v82" onClick={onClose}>×</button>}
        <div className="budget-setup-icon-v82"><Wallet size={24} /></div>
        <span className="eyebrow">{mode === 'edit' ? 'Chỉnh sửa ngân sách' : 'Thiết lập ngân sách tháng'}</span>
        <h2 id="budget-setup-title-v82">{mode === 'edit' ? 'Cập nhật ngân sách tháng này' : 'Bạn dự kiến chi bao nhiêu trong tháng này?'}</h2>
        <p>{mode === 'edit' ? 'Bạn còn đúng 1 lần chỉnh sửa ngân sách. Sau khi lưu lần này, mức ngân sách sẽ được khóa.' : 'CartWise sẽ lưu mức ngân sách này để Cawi Cố Vấn Chi Tiêu đưa lời khuyên dựa trên số liệu thực tế. Mức ngân sách chỉ được chỉnh sửa một lần.'}</p>
        <form onSubmit={submit}>
          <label className="budget-input-label-v82">Ngân sách tháng này</label>
          <div className="budget-input-shell-v82">
            <input
              autoFocus
              inputMode="numeric"
              value={value}
              onChange={(event) => setValue(event.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Ví dụ: 2000000"
              aria-label="Ngân sách tháng này"
            />
            <span>đ</span>
          </div>
          <small>Chỉ nhập số tiền. Bạn sẽ không thể sửa mức này sau khi lưu.</small>
          <button className="primary full" type="submit" disabled={!numeric}>
            <LockKeyhole size={16} /> {mode === 'edit' ? 'Lưu thay đổi' : 'Lưu ngân sách'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BudgetSetupModal;
