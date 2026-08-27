import { useState } from 'react';
import { MessageCircleQuestion, Lock, Sparkles, Loader2, ListChecks } from 'lucide-react';
import { computeSpendingAdvice, getPurchaseHistoryCoverageDays } from '../data/purchases.js';
import SpendingAdvisorQuiz from './SpendingAdvisorQuiz.jsx';

// v63 — "Cawi Cố Vấn Chi Tiêu": kích hoạt on-demand qua nút "Hỏi Cawi trước khi mua",
// KHÔNG tự động cảnh báo (đúng nguyên tắc UX đã cam kết — tránh phiền người dùng).
// Chỉ mở khoá ở CartWise Plus, và cần ≥30 ngày dữ liệu Lịch sử mua hàng (Mục 4.2 báo cáo).
// v82 — Sau khi hiện lời khuyên theo ngân sách (giữ nguyên hành vi cũ), thêm CTA phụ
// tuỳ chọn mở "Bộ 5 câu hỏi đánh giá mức độ cần thiết" (widget SpendingAdvisorQuiz)
// để kết hợp thêm trục "mức độ cần thiết" — xem spendingAdvisorQuestions.js.

function SpendingAdvisorCard({ product, enabled, onOpenUpgrade, purchasePrice, hasBuySignalData, onViewBuySignal }) {
  const [asked, setAsked] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const coverageDays = getPurchaseHistoryCoverageDays();
  const hasEnoughHistory = coverageDays >= 30;

  function askCawi() {
    setThinking(true);
    setAsked(false);
    window.setTimeout(() => {
      setThinking(false);
      setAsked(true);
    }, 700);
  }

  if (!enabled) {
    return (
      <div className="spending-advisor-card-v63 locked">
        <div className="spending-advisor-head-v63">
          <span><MessageCircleQuestion size={16} /> Cawi Cố Vấn Chi Tiêu</span>
          <span className="buy-signal-plus-tag-v63">CartWise Plus</span>
        </div>
        <div className="buy-signal-locked-body-v63">
          <Lock size={22} />
          <p>Hỏi Cawi xem lần mua này có phù hợp với ngân sách và thói quen chi tiêu gần đây của bạn không — chỉ có ở CartWise Plus.</p>
          <button type="button" className="primary small" onClick={onOpenUpgrade}>Mở khoá CartWise Plus</button>
        </div>
      </div>
    );
  }

  if (!hasEnoughHistory) {
    return (
      <div className="spending-advisor-card-v63">
        <div className="spending-advisor-head-v63">
          <span><MessageCircleQuestion size={16} /> Cawi Cố Vấn Chi Tiêu</span>
        </div>
        <p className="spending-advisor-empty-v63">Cần thêm dữ liệu Lịch sử mua hàng (tối thiểu 30 ngày, hiện có {coverageDays} ngày) để Cawi đưa ra tư vấn đáng tin cậy.</p>
      </div>
    );
  }

  const advice = asked ? computeSpendingAdvice(product) : null;

  return (
    <div className="spending-advisor-card-v63">
      <div className="spending-advisor-head-v63">
        <span><MessageCircleQuestion size={16} /> Cawi Cố Vấn Chi Tiêu</span>
      </div>

      {!asked && !thinking && (
        <>
          <p className="spending-advisor-intro-v63">Cân nhắc lần mua này? Hỏi Cawi để xem có phù hợp với ngân sách và thói quen chi tiêu gần đây của bạn không.</p>
          <button type="button" className="secondary small spending-advisor-ask-btn-v63" onClick={askCawi}>
            <Sparkles size={15} /> Hỏi Cawi trước khi mua
          </button>
        </>
      )}

      {thinking && (
        <div className="spending-advisor-thinking-v63"><Loader2 size={16} className="spin" /> Cawi đang xem lịch sử chi tiêu của bạn...</div>
      )}

      {asked && advice && (
        <div className={`spending-advisor-result-v63 ${advice.tone}`}>
          <b className={`spending-advisor-verdict-v63 ${advice.tone}`}>{advice.verdict}</b>
          <p>{advice.headline}</p>
          <small>{advice.detail}</small>
        </div>
      )}

      {asked && advice && !quizOpen && (
        <button type="button" className="spending-advisor-quiz-cta-v82" onClick={() => setQuizOpen(true)}>
          <ListChecks size={14} /> Trả lời nhanh 5 câu hỏi để Cawi tư vấn chính xác hơn (~20 giây)
        </button>
      )}

      {quizOpen && (
        <SpendingAdvisorQuiz
          purchasePrice={purchasePrice}
          hasBuySignalData={hasBuySignalData}
          onViewBuySignal={onViewBuySignal}
          onClose={() => setQuizOpen(false)}
        />
      )}
    </div>
  );
}

export default SpendingAdvisorCard;
