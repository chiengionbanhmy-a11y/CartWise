import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, Lock, SearchCheck, Store, Tag, Crown, Info } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getPlan } from '../data/plans.js';

function getHistoryItems(days) {
  const raw = JSON.parse(localStorage.getItem('cartwise-price-check-history') || '[]');
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const filtered = raw
    .filter((item) => new Date(item.checkedAt).getTime() >= since)
    .sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime());

  const latestByProduct = new Map();
  filtered.forEach((item) => {
    if (!latestByProduct.has(item.productId)) latestByProduct.set(item.productId, item);
  });

  return { items: Array.from(latestByProduct.values()), checkCount: filtered.length };
}

function CheckHistory({ currency, planId = 'free', onBack, onOpenUpgrade }) {
  const [range, setRange] = useState(7);
  const plan = getPlan(planId);
  const tabs = [7, 30, 90, 180].map((value) => ({
    value,
    label: `${value} ngày`,
    locked: !plan.priceHistoryDays.includes(value)
  }));
  const locked = !plan.priceHistoryDays.includes(range);

  const summary = useMemo(() => locked ? { items: [], checkCount: 0 } : getHistoryItems(range), [range, locked]);

  return (
    <section className="standalone-page-v45 check-history-page-v48">
      <button className="standalone-back-v45" onClick={onBack}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      <div className="standalone-hero-v45 check-history-hero-v48">
        <span className="eyebrow"><SearchCheck size={15} /> Lịch sử kiểm tra giá</span>
        <h1>Những sản phẩm bạn đã mở để kiểm tra giá</h1>
        <p><strong>Đây không phải lịch sử tìm kiếm.</strong> CartWise lưu các sản phẩm bạn đã mở bảng so sánh giá/tổng chi phí dự kiến để bạn xem lại sau.</p>
      </div>

      <div className="history-definition-card-v50">
        <Info size={18} />
        <div>
          <strong>Phân biệt 2 loại lịch sử</strong>
          <span><b>Lịch sử kiểm tra giá</b> = sản phẩm đã mở bảng so sánh. <b>Lịch sử mua hàng</b> = các đơn/sản phẩm bạn đã mua và chi tiêu thực tế.</span>
        </div>
      </div>

      <div className="history-tabs-page-v48">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`${range === tab.value ? 'active' : ''} ${tab.locked ? 'locked' : ''}`}
            onClick={() => setRange(tab.value)}
          >
            {tab.locked && <Lock size={14} />}
            {tab.label}
          </button>
        ))}
      </div>

      {locked ? (
        <div className="history-locked-page-v48">
          <div>
            <span><Crown size={18} /> {planId === 'free' ? 'Gói trả phí' : 'Quyền lợi nâng cao'}</span>
            <h2>Mở khóa lịch sử kiểm tra giá {range} ngày</h2>
            <p>Gói CartWise Plus Student và CartWise Plus mở rộng lịch sử kiểm tra giá lên 90 và 180 ngày.</p>
          </div>
          <button className="primary" onClick={onOpenUpgrade}>Xem gói nâng cấp</button>
        </div>
      ) : (
        <>
          <div className="history-summary-page-v48">
            <article><span><CalendarDays size={17} /> Khoảng thời gian</span><strong>{range} ngày gần đây</strong></article>
            <article><span><SearchCheck size={17} /> Sản phẩm đã kiểm tra</span><strong>{summary.items.length}</strong></article>
            <article><span><Clock3 size={17} /> Tổng lượt kiểm tra</span><strong>{summary.checkCount}</strong></article>
          </div>

          {summary.items.length === 0 ? (
            <div className="history-empty-page-v48">
              <SearchCheck size={46} />
              <h2>Chưa có sản phẩm được kiểm tra trong {range} ngày gần đây</h2>
              <p>Khi bạn mở bảng so sánh tổng chi phí của một sản phẩm, CartWise sẽ lưu lại thời điểm kiểm tra trong lịch sử này.</p>
              <button className="secondary" onClick={onBack}>Về trang chủ</button>
            </div>
          ) : (
            <div className="history-grid-page-v48">
              {summary.items.map((item) => (
                <article key={`${item.productId}-${item.checkedAt}`} className="history-card-page-v48">
                  <img src={item.image} alt={item.productName} />
                  <div className="history-card-body-v48">
                    <span className="history-category-v48">{item.category || 'Sản phẩm'}</span>
                    <h3>{item.productName}</h3>
                    <div className="history-meta-v48">
                      <span><Clock3 size={14} /> {new Date(item.checkedAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                      <span><Store size={14} /> {item.bestStoreName || 'Đang cập nhật'}</span>
                    </div>
                    <div className="history-price-row-v48">
                      <div><small>Giá gốc tham chiếu</small><b>{formatCurrency(item.originalPrice || 0, currency)}</b></div>
                      <div><small>Tổng chi phí dự kiến tốt nhất</small><b>{formatCurrency(item.bestTotal || 0, currency)}</b></div>
                    </div>
                    <p><Tag size={14} /> Ghi nhận tại thời điểm bạn mở bảng so sánh; đây là dữ liệu demo nếu chưa có dữ liệu lịch sử thật.</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default CheckHistory;
