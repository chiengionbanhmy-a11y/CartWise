import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getSavingsSummary, SAVINGS_MILESTONES } from '../data/purchases.js';

// v69 — Trang "Thành tựu tiết kiệm": bản đồ cột mốc kiểu game, mở từ thanh nav ngay
// cạnh "Ghép Đơn Cùng Bạn Bè" (và từ nút "Xem bản đồ thành tựu" trong khối tiết kiệm
// ở trang chủ). Mốc đã đạt tô đậm + dấu tích, mốc đang hướng tới có thanh tiến trình
// riêng, các mốc còn lại phía trước hiện mờ kèm ổ khoá — đúng cảm giác "đã đạt được
// và vẫn còn phía trước" mà đội yêu cầu.
// v72 — Thêm hẳn 1 khung "bản đồ trò chơi" sinh động phía trên danh sách mốc: nền
// trời đêm (sao + trăng + dãy núi mờ), 1 con đường cong dạng SVG chạy zigzag qua 5
// điểm mốc (tô sáng dần theo % tiến trình thật), toà lâu đài + cúp ở đỉnh đường đi,
// ghim "BẠN ĐANG Ở ĐÂY" tại đúng mốc đang hướng tới — đúng tinh thần bản đồ game như
// ảnh tham khảo, còn danh sách chi tiết từng mốc (tên/số tiền/thanh tiến trình riêng)
// vẫn giữ dạng danh sách dọc rõ ràng, dễ đọc ở mọi kích thước màn hình như bản cũ.
const MAP_VIEWBOX = { w: 400, h: 560 };
const NODE_POS = [
  { x: 60, y: 480 },
  { x: 280, y: 380 },
  { x: 100, y: 280 },
  { x: 300, y: 170 },
  { x: 150, y: 70 }
];
const MAP_PATH_D = 'M60,480 C180,460 200,420 280,380 C340,350 40,320 100,280 C160,240 360,210 300,170 C240,130 90,110 150,70 C160,55 260,35 340,20';

function SavingsAchievements({ currency = 'VND', onBack }) {
  const summary = getSavingsSummary();
  const totalSaved = summary.totalSaved;
  const finalGoal = SAVINGS_MILESTONES[SAVINGS_MILESTONES.length - 1].amount;
  const overallPct = Math.min(100, Math.round((totalSaved / finalGoal) * 100));
  const firstUnachievedIndex = SAVINGS_MILESTONES.findIndex((m) => totalSaved < m.amount);
  const allDone = firstUnachievedIndex === -1;
  const achievedCount = SAVINGS_MILESTONES.filter((m) => totalSaved >= m.amount).length;

  const progressPathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  useEffect(() => {
    if (progressPathRef.current) setPathLength(progressPathRef.current.getTotalLength());
  }, []);
  const dashOffset = pathLength ? pathLength - (pathLength * overallPct) / 100 : 0;

  return (
    <section className="standalone-page-v45 savings-achv-page-v69">
      <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

      <div className="standalone-hero-v45 savings-achv-hero-v69">
        <span className="eyebrow">🏆 Thành tựu tiết kiệm</span>
        <h1>Bản đồ hành trình tiết kiệm của bạn</h1>
        <p>Mỗi mốc được mở khoá theo tổng số tiền bạn đã tiết kiệm khi mua sắm qua CartWise — so sánh giá càng kỹ, bạn càng lên bậc nhanh hơn.</p>
        {/* v81 — Minh bạch nguồn dữ liệu: số liệu bắt đầu từ dữ liệu demo, cộng thêm
            các sản phẩm bạn tự khai "Đã mua" ở khung so sánh sản phẩm. Bản chính thức
            cần liên kết tài khoản mua sắm/API đối tác để ghi nhận đơn hàng thật, tự
            động, không cần tự khai. */}
        <p className="savings-achv-demo-note-v81">
          <b>Dữ liệu minh hoạ:</b> số tiền bắt đầu từ 7 đơn hàng demo, cộng thêm các sản phẩm bạn bấm "Đã mua" khi xem so sánh giá. Ở bản chính thức, CartWise sẽ ghi nhận đơn hàng thật qua liên kết tài khoản mua sắm/API đối tác thay vì tự khai thủ công.
        </p>

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

      {/* v72 — Khung bản đồ trò chơi, thuần trang trí (không có chữ đè lên ảnh để luôn
          gọn gàng ở mọi màn hình) — chi tiết từng mốc đọc ở danh sách bên dưới. */}
      <div className="savings-achv-map-v72" role="img" aria-label={`Bản đồ hành trình, đã đạt ${achievedCount}/${SAVINGS_MILESTONES.length} mốc`}>
        <div className="savings-achv-map-stars-v72" />
        <div className="savings-achv-map-moon-v72" />
        <div className="savings-achv-map-mountains-v72" />

        <div className="savings-achv-map-hud-v72">
          <span className="savings-achv-map-hud-level-v72">🏅 Bậc {achievedCount}/{SAVINGS_MILESTONES.length}</span>
          <span className="savings-achv-map-hud-pct-v72">{overallPct}%</span>
        </div>

        <svg className="savings-achv-map-svg-v72" viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="achv-path-gradient-v72" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="55%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
          </defs>
          <path d={MAP_PATH_D} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="9" strokeLinecap="round" />
          <path
            ref={progressPathRef}
            d={MAP_PATH_D}
            fill="none"
            stroke="url(#achv-path-gradient-v72)"
            strokeWidth="5.5"
            strokeLinecap="round"
            style={{ strokeDasharray: pathLength, strokeDashoffset: dashOffset, transition: 'stroke-dashoffset .8s ease' }}
          />
        </svg>

        <div
          className={`savings-achv-map-castle-v72 ${allDone ? 'reached' : ''}`}
          style={{ left: `${((MAP_VIEWBOX.w - 46) / MAP_VIEWBOX.w) * 100}%`, top: `${(34 / MAP_VIEWBOX.h) * 100}%` }}
        >
          <span className="savings-achv-map-castle-icon-v72">🏰</span>
          <span className="savings-achv-map-castle-trophy-v72">🏆</span>
        </div>

        {SAVINGS_MILESTONES.map((m, index) => {
          const done = totalSaved >= m.amount;
          const status = done ? 'done' : index === firstUnachievedIndex ? 'current' : 'locked';
          const pos = NODE_POS[index];
          return (
            <div
              key={m.label}
              className={`savings-achv-map-node-v72 ${status}`}
              style={{ left: `${(pos.x / MAP_VIEWBOX.w) * 100}%`, top: `${(pos.y / MAP_VIEWBOX.h) * 100}%` }}
            >
              {status === 'current' && <span className="savings-achv-map-pin-v72">📍 BẠN Ở ĐÂY</span>}
              <span className="savings-achv-map-node-num-v72">{index + 1}</span>
              {done ? <Check size={17} strokeWidth={3.6} /> : status === 'locked' ? <Lock size={14} /> : <span>{m.icon}</span>}
            </div>
          );
        })}
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
