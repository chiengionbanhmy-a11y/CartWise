import { TrendingDown, TrendingUp, Minus, Lock, Sparkles } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getBuySignal } from '../data/products.js';

// v63 — "Cawi Tín Hiệu Mua": khuyến nghị Mua ngay / Nên chờ dựa trên lịch sử giá tích
// luỹ tối đa 180 ngày. Trả lời trực tiếp Nhận xét 1 của Ban Giám khảo (Google chỉ cho
// biết giá tại 1 thời điểm; CartWise cần dữ liệu lịch sử tích luỹ theo sản phẩm — thứ
// công cụ tìm kiếm không có). Chỉ mở khoá ở CartWise Plus (Mục 3, Mục 4.2 báo cáo).

const recoMeta = {
  buy: { icon: TrendingDown, label: 'Mua ngay', tone: 'good' },
  wait: { icon: TrendingUp, label: 'Nên chờ', tone: 'warning' },
  neutral: { icon: Minus, label: 'Có thể mua', tone: 'stable' }
};

function BuySignalCard({ product, storeName, enabled, onOpenUpgrade }) {
  if (!enabled) {
    return (
      <div className="buy-signal-card-v63 locked">
        <div className="buy-signal-head-v63">
          <span><Sparkles size={16} /> Cawi Tín Hiệu Mua</span>
          <span className="buy-signal-plus-tag-v63">CartWise Plus</span>
        </div>
        <div className="buy-signal-locked-body-v63">
          <Lock size={22} />
          <p>Khuyến nghị <b>"Mua ngay"</b> hay <b>"Nên chờ"</b> dựa trên xu hướng giá tích luỹ tới 180 ngày — chỉ có ở CartWise Plus, vì cần đủ lịch sử dài để độ tin cậy cao.</p>
          <button type="button" className="primary small" onClick={onOpenUpgrade}>Mở khoá CartWise Plus</button>
        </div>
      </div>
    );
  }

  const signal = getBuySignal(product, storeName, 180);
  const meta = recoMeta[signal.recommendation] || recoMeta.neutral;
  const Icon = meta.icon;
  const markerPct = Number.isFinite(signal.percentile) ? Math.min(100, Math.max(0, signal.percentile)) : 50;

  return (
    <div className={`buy-signal-card-v63 ${meta.tone}`}>
      <div className="buy-signal-head-v63">
        <span><Sparkles size={16} /> Cawi Tín Hiệu Mua</span>
        <span className="buy-signal-confidence-v63">Độ tin cậy {signal.confidence}%</span>
      </div>

      <div className="buy-signal-reco-row-v63">
        <b className={`buy-signal-reco-badge-v63 ${meta.tone}`}><Icon size={16} /> {meta.label}</b>
        <span>{signal.headline}</span>
      </div>

      {Number.isFinite(signal.min) && (
        <div className="buy-signal-range-v63">
          <div className="buy-signal-range-track-v63">
            <span className="buy-signal-range-marker-v63" style={{ left: `${markerPct}%` }} title={`Giá hiện tại: ${formatCurrency(signal.current, 'VND')}`} />
          </div>
          <div className="buy-signal-range-labels-v63">
            <span>Thấp nhất {formatCurrency(signal.min, 'VND')}</span>
            <span>Cao nhất {formatCurrency(signal.max, 'VND')}</span>
          </div>
        </div>
      )}

      <p className="buy-signal-detail-v63">{signal.detail}</p>
      <small className="buy-signal-note-v63">Công thức minh bạch dựa trên dữ liệu giá demo đã ghi nhận — không phải dự đoán bằng AI, không đảm bảo diễn biến giá thực tế trong tương lai.</small>
    </div>
  );
}

export default BuySignalCard;
