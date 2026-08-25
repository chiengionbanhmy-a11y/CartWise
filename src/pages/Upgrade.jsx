import { ArrowLeft, Crown, CheckCircle2, Sparkles } from 'lucide-react';
import { PLAN_DETAILS } from '../data/plans.js';

function Upgrade({ onBack, onChoosePlan }) {
  // v79 — Cập nhật đúng danh sách tính năng + giới hạn theo từng gói, khớp với 6 tính
  // năng mới đã gắn theo gói từ v63 (Cawi Tín Hiệu Mua, Cawi Cố Vấn Chi Tiêu, Bộ đếm
  // tiết kiệm, Nhóm Góp Tiền...) — trước đó trang này vẫn hiện đúng bản danh sách cũ
  // trước v63 nên chưa khớp với những gì app đã thật sự mở khoá theo từng gói. Giá giữ
  // nguyên 19.000đ / 49.000đ (đã đúng theo Business Plan, không đổi).
  // v80 — Theo yêu cầu: liệt kê RÕ RÀNG "Lịch sử kiểm tra giá" mở tới đâu ở từng bậc
  // (Free 7 ngày / Plus Student 1 tháng / CartWise Plus 6 tháng và 1 năm) thay vì chỉ
  // ghi 1 con số gộp mơ hồ như trước ("tới 90 ngày" / "tới 180 ngày"). Đổi luôn số liệu
  // gốc trong `src/data/plans.js` + 4 mốc lọc trong trang "Lịch sử kiểm tra giá"
  // (`CheckHistory.jsx`) từ [7,30,90,180] sang [7,30,180,365] cho khớp — xem chi tiết
  // trong README bản giao.
  const plans = [
    {
      id: 'plus',
      ...PLAN_DETAILS.plus,
      tone: 'plus',
      ribbon: '49.000đ/tháng',
      cta: 'Chọn CartWise Plus',
      features: [
        'Lịch sử kiểm tra giá 6 tháng và 1 năm, thống kê mua sắm nâng cao tới 1 năm',
        'Cảnh báo thông minh',
        'Cawi Tín Hiệu Mua — khuyến nghị "Mua ngay" hay "Nên chờ" dựa trên lịch sử giá tích luỹ 180 ngày',
        'Cawi Cố Vấn Chi Tiêu — hỏi Cawi xem lần mua này có hợp ngân sách không, dựa trên lịch sử chi tiêu thật',
        'Nhóm Góp Tiền không giới hạn số nhóm + bộ đếm tiết kiệm không giới hạn huy hiệu',
        'Không quảng cáo'
      ]
    },
    {
      id: 'student',
      ...PLAN_DETAILS.student,
      tone: 'student',
      ribbon: '19.000đ/tháng',
      cta: 'Chọn Plus Student',
      features: [
        'Lịch sử kiểm tra giá 1 tháng, thống kê mua sắm 30 ngày',
        'Cảnh báo giảm giá',
        'Nhóm Góp Tiền không giới hạn số nhóm/tháng',
        'Bộ đếm tiết kiệm nổi bật (tối đa 2 huy hiệu)',
        'Ưu tiên tính năng mới, phù hợp học sinh, sinh viên'
      ]
    }
  ];

  return (
    <section className="standalone-page-v45 upgrade-page-v45">
      <button className="standalone-back-v45" onClick={onBack}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      <div className="standalone-hero-v45">
        <span className="eyebrow"><Sparkles size={15} /> Nâng cấp ứng dụng</span>
        <h1>Chọn gói CartWise Plus</h1>
        <p>Mở rộng lịch sử kiểm tra giá, nhận cảnh báo phù hợp và xem thống kê mua sắm theo nhu cầu.</p>
      </div>

      <div className="upgrade-history-compare-v80">
        <span className="upgrade-history-compare-label-v80">Lịch sử kiểm tra giá theo từng gói</span>
        <div className="upgrade-history-compare-row-v80">
          <div><b>Miễn phí</b><span>7 ngày gần nhất</span></div>
          <div><b>Plus Student</b><span>1 tháng</span></div>
          <div><b>CartWise Plus</b><span>6 tháng &amp; 1 năm</span></div>
        </div>
      </div>

      <div className="premium-plans-page-v45">
        {plans.map((plan) => (
          <article key={plan.id} className={`premium-plan-card-page-v45 ${plan.tone}`}>
            <div className="plan-ribbon-page-v45">{plan.ribbon}</div>
            <span className="plan-label-page-v45"><Crown size={18} /> {plan.name}</span>
            <h2>{plan.name.replace('CartWise ', '')}</h2>
            <strong>{plan.price}</strong>
            <ul>{plan.features.map((feature) => <li key={feature}><CheckCircle2 size={18} /> {feature}</li>)}</ul>
            <button onClick={() => onChoosePlan?.(plan.id)}>{plan.cta}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Upgrade;
