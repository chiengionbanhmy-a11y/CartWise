import { useEffect, useRef, useState } from 'react';
import { PiggyBank, Share2, Check, Sparkles } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getSavingsSummary, getSavingsMilestoneProgress } from '../data/purchases.js';

// v63 — Bộ đếm "Số tiền đã tiết kiệm" (Mục 4.2 báo cáo cải tiến Vòng 4).
// variant="simple": 1 dòng text (gói Free, đặt trong trang Hồ sơ).
// variant="prominent": card nổi bật với animation đếm số, progress bar, huy hiệu,
// nút chia sẻ (gói Plus Student trở lên, đặt ngay dưới hero trang chủ).
// maxBadges giới hạn số huy hiệu hiển thị (Plus Student); CartWise Plus dùng Infinity.

function useCountUp(target, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    startRef.current = null;
    cancelAnimationFrame(frameRef.current);

    function tick(timestamp) {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min(1, (timestamp - startRef.current) / durationMs);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(target * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

function SavingsCounter({ variant = 'simple', maxBadges = Infinity, currency = 'VND', onOpenUpgrade }) {
  const [shared, setShared] = useState(false);
  const summary = getSavingsSummary();
  const milestone = getSavingsMilestoneProgress(summary.totalSaved);
  const animatedValue = useCountUp(variant === 'prominent' ? summary.totalSaved : summary.totalSaved, variant === 'prominent' ? 1200 : 0);
  const displayValue = variant === 'prominent' ? animatedValue : summary.totalSaved;

  const visibleBadges = Number.isFinite(maxBadges) ? milestone.achieved.slice(-maxBadges) : milestone.achieved;
  const hiddenBadgeCount = Math.max(0, milestone.achieved.length - visibleBadges.length);

  function shareResult() {
    const text = `Mình đã tiết kiệm được ${formatCurrency(summary.totalSaved, currency)} nhờ so sánh giá trên CartWise! 🎉`;
    if (navigator.share) {
      navigator.share({ title: 'CartWise', text }).catch(() => {});
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setShared(true);
        window.setTimeout(() => setShared(false), 2200);
      }).catch(() => window.prompt('Sao chép để chia sẻ:', text));
    } else {
      window.prompt('Sao chép để chia sẻ:', text);
    }
  }

  if (variant === 'simple') {
    return (
      <div className="savings-counter-simple-v63">
        <PiggyBank size={16} />
        <span>Bạn đã tiết kiệm được <b>{formatCurrency(displayValue, currency)}</b> khi mua sắm qua CartWise.</span>
      </div>
    );
  }

  return (
    <section className="savings-counter-prominent-v63">
      <div className="savings-counter-head-v63">
        <span className="savings-counter-badge-v63"><PiggyBank size={16} /> Số tiền đã tiết kiệm</span>
        <span className="savings-counter-hint-v63">Tính theo chênh lệch giữa giá đã mua và mức giá tham chiếu CartWise ghi nhận</span>
      </div>

      <strong className="savings-counter-value-v63">{formatCurrency(displayValue, currency)}</strong>

      {milestone.next ? (
        <div className="savings-counter-progress-wrap-v63">
          <div className="savings-counter-progress-bar-v63">
            <div className="savings-counter-progress-fill-v63" style={{ width: `${milestone.progressPct}%` }} />
          </div>
          <span className="savings-counter-progress-label-v63">
            Còn {formatCurrency(Math.max(0, milestone.next.amount - summary.totalSaved), currency)} tới mốc "{milestone.next.icon} {milestone.next.label}"
          </span>
        </div>
      ) : (
        <span className="savings-counter-progress-label-v63">🎉 Đã đạt mọi mốc thành tích hiện có!</span>
      )}

      {visibleBadges.length > 0 && (
        <div className="savings-counter-badges-v63">
          {visibleBadges.map((badge) => (
            <span key={badge.label} className="savings-badge-chip-v63" title={badge.label}>{badge.icon} {badge.label}</span>
          ))}
          {hiddenBadgeCount > 0 && (
            <button type="button" className="savings-badge-more-v63" onClick={onOpenUpgrade}>
              <Sparkles size={13} /> +{hiddenBadgeCount} huy hiệu nữa ở CartWise Plus
            </button>
          )}
        </div>
      )}

      <button type="button" className="savings-counter-share-v63" onClick={shareResult}>
        {shared ? <><Check size={15} /> Đã sao chép!</> : <><Share2 size={15} /> Chia sẻ thành tích</>}
      </button>
    </section>
  );
}

export default SavingsCounter;
