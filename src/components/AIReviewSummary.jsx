import { useMemo, useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ChevronDown, Star, Info, Play, ImageIcon } from 'lucide-react';
import { getReviewData } from '../data/reviews.js';

function AIReviewSummary({ productId }) {
  const [rawOpen, setRawOpen] = useState(false);
  // Luôn lấy dữ liệu đánh giá gắn đúng với productId của sản phẩm đang xem
  // (đúng link/sản phẩm đang hiển thị trên web) — không dùng dữ liệu tổng hợp chung.
  const data = getReviewData(productId);

  const sentiment = useMemo(() => {
    const reviews = data?.rawReviews || [];
    if (!reviews.length) return null;
    const positiveCount = reviews.filter((review) => Number(review.rating || 0) >= 4).length;
    const total = reviews.length;
    const negativeCount = total - positiveCount;
    const positive = Math.round((positiveCount / total) * 100);
    return { positive, negative: 100 - positive, positiveCount, negativeCount, total };
  }, [data]);

  if (!data) {
    return (
      <div className="ai-review-empty-v58">
        <Sparkles size={16} />
        <span>CartWise chưa thu thập đủ đánh giá cho sản phẩm này để tóm tắt bằng AI.</span>
      </div>
    );
  }

  const { aiSummary, rawReviews, reviewCount, sourceCount, lastUpdated } = data;

  return (
    <div className="ai-review-summary-v58">
      {sentiment && (
        <div className="ai-review-sentiment-bar-v60" role="img" aria-label={`${sentiment.positive}% đánh giá tích cực, ${sentiment.negative}% đánh giá tiêu cực`}>
          <div className="ai-review-sentiment-track-v60">
            <span className="positive" style={{ width: `${sentiment.positive}%` }} />
            <span className="negative" style={{ width: `${sentiment.negative}%` }} />
          </div>
          <div className="ai-review-sentiment-legend-v60">
            <span className="legend-positive"><i />Tích cực {sentiment.positive}%</span>
            <span className="legend-negative"><i />Tiêu cực {sentiment.negative}%</span>
          </div>
        </div>
      )}

      <div className="ai-review-head-v58">
        <span className="ai-review-badge-v58"><Sparkles size={15} /> Tóm tắt bởi AI</span>
        <span className="ai-review-meta-v58">Tổng hợp từ {reviewCount} đánh giá · {sourceCount} nguồn</span>
      </div>

      <div className="ai-review-columns-v58">
        <div className="ai-review-col-v58 pros">
          <b><CheckCircle2 size={16} /> Điểm được khen</b>
          <ul>
            {aiSummary.pros.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
        <div className="ai-review-col-v58 cons">
          <b><XCircle size={16} /> Điểm cần lưu ý</b>
          <ul>
            {aiSummary.cons.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      </div>

      <button type="button" className="ai-review-toggle-v58" onClick={() => setRawOpen((open) => !open)}>
        {rawOpen ? 'Ẩn đánh giá gốc' : `Xem ${rawReviews.length} đánh giá gốc đã tổng hợp`}
        <ChevronDown size={15} className={rawOpen ? 'rotated' : ''} />
      </button>

      {rawOpen && (
        <div className="ai-review-raw-list-v58">
          {rawReviews.map((review, index) => (
            <article key={`${review.author}-${index}`} className="ai-review-raw-item-v58">
              <div className="ai-review-raw-top-v58">
                <span className="ai-review-store-tag-v58">{review.store}</span>
                <span className="ai-review-stars-v58">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} size={12} fill={starIndex < review.rating ? 'currentColor' : 'none'} />
                  ))}
                </span>
                <span className="ai-review-author-v58">{review.author}</span>
              </div>
              <p>{review.text}</p>
              {review.media && (
                <div className="ai-review-media-v82">
                  <div className="ai-review-media-thumb-v82">
                    <img src={review.media.src} alt={review.media.type === 'video' ? 'Video minh hoạ đánh giá' : 'Ảnh minh hoạ đánh giá'} loading="lazy" />
                    {review.media.type === 'video' ? (
                      <span className="ai-review-media-play-v82"><Play size={16} fill="currentColor" /></span>
                    ) : (
                      <span className="ai-review-media-imgtag-v82"><ImageIcon size={12} /></span>
                    )}
                    {review.media.duration && <span className="ai-review-media-duration-v82">{review.media.duration}</span>}
                  </div>
                  <span className="ai-review-media-caption-v82">{review.media.caption || (review.media.type === 'video' ? 'Video minh hoạ (demo)' : 'Ảnh minh hoạ (demo)')}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="ai-review-note-v58">
        <Info size={14} />
        <span>
          Tóm tắt được AI tạo <b>1 lần</b> khi hệ thống thu thập đủ đánh giá cho sản phẩm (cập nhật gần nhất: {lastUpdated})
          và được lưu lại để dùng chung cho mọi lượt xem — không gọi lại AI mỗi lượt truy cập, giữ chi phí vận hành
          gần như không đổi khi có thêm người dùng. Ảnh/video kèm theo một số đánh giá là ảnh minh hoạ (demo) —
          bản chính thức cần tính năng cho phép người mua tự đăng ảnh/video thật kèm đánh giá.
        </span>
      </div>
    </div>
  );
}

export default AIReviewSummary;
