import { useEffect, useRef, useState } from 'react';
import { PiggyBank, Share2, Check, Map } from 'lucide-react';
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

function SavingsCounter({ variant = 'simple', maxBadges = Infinity, currency = 'VND', onOpenUpgrade, onOpenAchievements }) {
  const [shared, setShared] = useState(false);

  // v82 — `getSavingsSummary()` đọc localStorage mới nhất mỗi lần render, nhưng
  // trước đây không có gì khiến component này render lại khi lịch sử mua hàng đổi
  // ở nơi khác (ví dụ nút "Đã mua" trong ProductModal.jsx) — số tiền tiết kiệm chỉ
  // cập nhật sau khi điều hướng/tải lại trang. Lắng nghe sự kiện `cartwise-purchase-
  // updated` (phát ra từ purchases.js) để buộc render lại ngay khi có thay đổi.
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const onPurchaseUpdate = () => forceUpdate((n) => n + 1);
    window.addEventListener('cartwise-purchase-updated', onPurchaseUpdate);
    window.addEventListener('storage', onPurchaseUpdate);
    return () => {
      window.removeEventListener('cartwise-purchase-updated', onPurchaseUpdate);
      window.removeEventListener('storage', onPurchaseUpdate);
    };
  }, []);

  const summary = getSavingsSummary();
  const milestone = getSavingsMilestoneProgress(summary.totalSaved);
  const animatedValue = useCountUp(variant === 'prominent' ? summary.totalSaved : summary.totalSaved, variant === 'prominent' ? 1200 : 0);
  const displayValue = variant === 'prominent' ? animatedValue : summary.totalSaved;

  // v69 — Làm rõ khối "Số tiền đã tiết kiệm": mỗi bậc chỉ hiện ĐÚNG 1 tên thành tựu
  // (mốc mới nhất vừa đạt được), thay vì liệt kê cả dãy huy hiệu như bản cũ — tránh
  // rối mắt và đúng yêu cầu "mỗi 1 bậc chỉ hiển thị 1 cái tên thành tựu".
  const currentAchievement = milestone.achieved.length ? milestone.achieved[milestone.achieved.length - 1] : null;
  const earlierAchievedCount = Math.max(0, milestone.achieved.length - 1);

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

  // v69 — Thứ tự & mức độ nổi bật theo đúng yêu cầu: số tiền tiết kiệm to nhất, căn
  // giữa, ngay dưới là thanh tiến trình, dưới nữa là tên thành tựu hiện tại (chỉ 1).
  return (
    <section className="savings-counter-prominent-v63 savings-counter-v69-centered">
      <span className="savings-counter-badge-v63"><PiggyBank size={16} /> Số tiền đã tiết kiệm</span>

      <strong className="savings-counter-value-v63 savings-counter-value-v69">{formatCurrency(displayValue, currency)}</strong>
      <span className="savings-counter-hint-v63">Tính theo chênh lệch giữa giá đã mua và mức giá tham chiếu CartWise ghi nhận</span>

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

      <div className={`savings-counter-current-achv-v69 ${currentAchievement ? 'unlocked' : 'locked'}`}>
        <span className="savings-counter-current-achv-label-v69">{currentAchievement ? 'Thành tựu hiện tại' : 'Thành tựu tiếp theo'}</span>
        <span className="savings-counter-current-achv-name-v69">
          {currentAchievement ? `${currentAchievement.icon} ${currentAchievement.label}` : milestone.next ? `${milestone.next.icon} ${milestone.next.label}` : '👑 Huyền thoại tiết kiệm'}
        </span>
      </div>

      {onOpenAchievements && (
        <button type="button" className="savings-counter-map-link-v69" onClick={onOpenAchievements}>
          <Map size={14} /> Xem bản đồ thành tựu{earlierAchievedCount > 0 ? ` (đã đạt ${milestone.achieved.length} mốc)` : ''}
        </button>
      )}

      <button type="button" className="savings-counter-share-v63" onClick={shareResult}>
        {shared ? <><Check size={15} /> Đã sao chép!</> : <><Share2 size={15} /> Chia sẻ thành tích</>}
      </button>
    </section>
  );
}

export default SavingsCounter;
