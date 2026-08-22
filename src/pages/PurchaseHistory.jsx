import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, ShoppingBag, Wallet, PiggyBank, Lock, Crown } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getPlan } from '../data/plans.js';
import { getPurchaseRecords } from '../data/purchases.js';

const ranges = [
  { value:7, label:'7 ngày' },
  { value:30, label:'1 tháng' },
  { value:60, label:'2 tháng' },
  { value:365, label:'1 năm' }
];

function PurchaseHistory({ currency, planId='free', onBack, onOpenUpgrade }) {
  const [range, setRange] = useState(7);
  const plan = getPlan(planId);
  const allowed = range <= plan.purchaseAnalyticsDays;

  const items = useMemo(() => {
    const source = getPurchaseRecords();
    const since = Date.now() - range * 86400000;
    return source.filter((item) => new Date(item.date).getTime() >= since);
  }, [range]);

  const total = items.reduce((sum,item) => sum + item.paid, 0);
  const saved = items.reduce((sum,item) => sum + item.saved, 0);

  return (
    <section className="standalone-page-v45 purchase-history-page-v50">
      <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18}/> Quay lại</button>
      <div className="standalone-hero-v45">
        <span className="eyebrow"><ShoppingBag size={15}/> Lịch sử mua hàng</span>
        <h1>Những gì bạn đã mua và chi tiêu</h1>
        <p>Phần này khác với <b>Lịch sử kiểm tra giá</b>: đây là các sản phẩm/đơn hàng bạn đã mua. Bản demo dùng dữ liệu mô phỏng.</p>
      </div>

      <div className="purchase-range-card-v50">
        <div><CalendarDays size={18}/><div><strong>Khoảng thống kê</strong><span>Danh sách mua hàng cơ bản vẫn có cùng giao diện ở mọi gói.</span></div></div>
        <div className="purchase-range-tabs-v50">
          {ranges.map((item) => {
            const locked = item.value > plan.purchaseAnalyticsDays;
            return <button key={item.value} className={range===item.value?'active':''} disabled={locked} onClick={()=>setRange(item.value)}>
              {locked && <Lock size={13}/>} {item.label}
            </button>
          })}
        </div>
      </div>

      {!allowed ? (
        <div className="history-locked-page-v48">
          <div><span><Crown size={18}/> Thống kê nâng cao</span><h2>Mở khóa thống kê {ranges.find(r=>r.value===range)?.label}</h2><p>Gói hiện tại cho phép thống kê tối đa {plan.purchaseAnalyticsDays === 7 ? '7 ngày' : plan.purchaseAnalyticsDays === 30 ? '1 tháng' : '1 năm'}.</p></div>
          <button className="primary" onClick={onOpenUpgrade}>Xem gói nâng cấp</button>
        </div>
      ) : (
        <>
          <div className="purchase-stat-grid-v50">
            <article><span><ShoppingBag size={17}/> Đã mua</span><strong>{items.length}</strong><small>sản phẩm trong kỳ</small></article>
            <article><span><Wallet size={17}/> Tổng chi</span><strong>{formatCurrency(total,currency)}</strong><small>giá đã ghi nhận</small></article>
            <article><span><PiggyBank size={17}/> Tiết kiệm nhờ CartWise</span><strong>{formatCurrency(saved,currency)}</strong><small>so với giá tham chiếu</small></article>
          </div>

          <div className="purchase-list-v50">
            {items.length ? items.map(item => (
              <article key={item.id}>
                <div><span>{item.category}</span><h3>{item.name}</h3><small>{new Date(item.date).toLocaleDateString('vi-VN')}</small></div>
                <div className="purchase-money-v50"><b>{formatCurrency(item.paid,currency)}</b><small>Giá tham chiếu {formatCurrency(item.reference,currency)}</small></div>
              </article>
            )) : <div className="history-empty-page-v48"><ShoppingBag size={40}/><h2>Chưa có giao dịch trong kỳ</h2><p>Hãy thêm đơn hàng khi người dùng bắt đầu sử dụng dữ liệu mua hàng thật.</p></div>}
          </div>
        </>
      )}
    </section>
  );
}
export default PurchaseHistory;
