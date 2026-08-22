import { ArrowLeft, Crown, CheckCircle2, Sparkles } from 'lucide-react';
import { PLAN_DETAILS } from '../data/plans.js';

function Upgrade({ onBack, onChoosePlan }) {
  const plans = [
    {
      id: 'plus',
      ...PLAN_DETAILS.plus,
      tone: 'plus',
      ribbon: '49.000đ/tháng',
      cta: 'Chọn CartWise Plus',
      features: [
        'Lịch sử kiểm tra giá 90 ngày và 180 ngày',
        'Cảnh báo thông minh',
        'Thống kê mua sắm nâng cao',
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
        'Lịch sử kiểm tra giá 90 ngày và 180 ngày',
        'Cảnh báo giảm giá',
        'Ưu tiên tính năng mới',
        'Phù hợp học sinh, sinh viên'
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
