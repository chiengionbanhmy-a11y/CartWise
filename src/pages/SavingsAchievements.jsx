import { ArrowLeft, Check, Lock } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getSavingsSummary, SAVINGS_MILESTONES } from '../data/purchases.js';

// v69 — Trang "Thành tựu tiết kiệm": bản đồ cột mốc kiểu game, mở từ thanh nav ngay
// cạnh "Ghép Đơn Cùng Bạn Bè" (và từ nút "Xem bản đồ thành tựu" trong khối tiết kiệm
// ở trang chủ). Mốc đã đạt tô đậm + dấu tích, mốc đang hướng tới có thanh tiến trình
// riêng, các mốc còn lại phía trước hiện mờ kèm ổ khoá — đúng cảm giác "đã đạt được
// và vẫn còn phía trước" mà đội yêu cầu.
function SavingsAchievements({ currency = 'VND', onBack }) {
  const summary = getSavingsSummary();
  const totalSaved = summary.totalSaved;
  const finalGoal = SAVINGS_MILESTONES[SAVINGS_MILESTONES.length - 1].amount;
  const overallPct = Math.min(100, Math.round((totalSaved / finalGoal) * 100));
  const firstUnachievedIndex = SAVINGS_MILESTONES.findIndex((m) => totalSaved < m.amount);
  const allDone = firstUnachievedIndex === -1;

  return (
    <section className="standalone-page-v45 savings-achv-page-v69">
      <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

      <div className="standalone-hero-v45 savings-achv-hero-v69">
        <span className="eyebrow">🏆 Thành tựu tiết kiệm</span>
        <h1>Bản đồ hành trình tiết kiệm của bạn</h1>
        <p>Mỗi mốc được mở khoá theo tổng số tiền bạn đã tiết kiệm khi mua sắm qua CartWise — so sánh giá càng kỹ, bạn càng lên bậc nhanh hơn.</p>

        <div className="savings-achv-overview-v69">
          <div className="savings-achv-overview-top-v69">
            <span>Tổng đã tiết kiệm</span>
            <strong>{formatCurrency(totalSaved, currency)}</strong>
          </div>
          <div className="savings-achv-overview-bar-v69"><div style={{ width: `${overallPct}%` }} /></div>
          <span className="savings-achv-overview-pct-v69">
            {allDone ? '🎉 Đã hoàn thành toàn bộ hành trình!' : `${overallPct}% chặng đường tới mốc cao nhất (${formatCurrency(finalGoal, currency)})`}
          </span>
        </div>
      </div>

      <div className="savings-achv-path-v69">
        {SAVINGS_MILESTONES.map((m, index) => {
          const done = totalSaved >= m.amount;
          const status = done ? 'done' : index === firstUnachievedIndex ? 'current' : 'locked';
          const prevAmount = index > 0 ? SAVINGS_MILESTONES[index - 1].amount : 0;
          const segmentPct = status === 'current' ? Math.min(100, Math.round(((totalSaved - prevAmount) / (m.amount - prevAmount)) * 100)) : 0;
          const isLast = index === SAVINGS_MILESTONES.length - 1;

          return (
            <div key={m.label} className={`savings-achv-node-v69 ${status}`}>
              {!isLast && <span className="savings-achv-node-line-v69" />}
              <div className="savings-achv-node-icon-v69">
                {done ? <Check size={20} strokeWidth={3.4} /> : status === 'locked' ? <Lock size={16} /> : <span>{m.icon}</span>}
              </div>
              <div className="savings-achv-node-body-v69">
                <span className="savings-achv-node-tag-v69">{done ? 'Đã đạt' : status === 'current' ? 'Đang hướng tới' : 'Sắp tới'}</span>
                <h3>{m.icon} {m.label}</h3>
                <span className="savings-achv-node-amount-v69">Mốc {formatCurrency(m.amount, currency)}</span>
                {status === 'current' && (
                  <div className="savings-achv-node-progress-v69">
                    <div className="savings-achv-node-progress-bar-v69"><div style={{ width: `${segmentPct}%` }} /></div>
                    <small>Còn {formatCurrency(Math.max(0, m.amount - totalSaved), currency)} nữa là tới mốc này</small>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SavingsAchievements;
