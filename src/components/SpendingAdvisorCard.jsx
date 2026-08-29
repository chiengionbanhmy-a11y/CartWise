import { useState } from 'react';
// eslint-disable-next-line no-unused-vars -- Loader2/ListChecks giữ lại cho luồng cũ đã comment (xem SpendingAdvisorCard v86 bên dưới)
import { MessageCircleQuestion, Lock, Sparkles, Loader2, ListChecks } from 'lucide-react';
import { computeSpendingAdvice, getPurchaseHistoryCoverageDays } from '../data/purchases.js';
import SpendingAdvisorQuiz from './SpendingAdvisorQuiz.jsx';

// v63 — "Cawi Cố Vấn Chi Tiêu": kích hoạt on-demand qua nút "Hỏi Cawi trước khi mua",
// KHÔNG tự động cảnh báo (đúng nguyên tắc UX đã cam kết — tránh phiền người dùng).
// Chỉ mở khoá ở CartWise Plus, và cần ≥30 ngày dữ liệu Lịch sử mua hàng (Mục 4.2 báo cáo).
// v82 — Sau khi hiện lời khuyên theo ngân sách (giữ nguyên hành vi cũ), thêm CTA phụ
// tuỳ chọn mở "Bộ 5 câu hỏi đánh giá mức độ cần thiết" (widget SpendingAdvisorQuiz)
// để kết hợp thêm trục "mức độ cần thiết" — xem spendingAdvisorQuestions.js.
// v86 — Theo góp ý: bấm "Hỏi Cawi" giờ mở THẲNG bộ 5 câu hỏi dạng popup toàn màn hình
// (SpendingAdvisorQuiz đã tự bọc overlay từ v86), bỏ bước "lời khuyên chỉ theo ngân
// sách" ở giữa (trước đây phải bấm thêm 1 CTA phụ mới tới được 5 câu hỏi). Lời khuyên
// cuối cùng vẫn được SpendingAdvisorQuiz tính từ CẢ ngân sách còn lại (getBudgetLevel)
// LẪN kết quả 5 câu hỏi (computeCombinedAdvice) — không đổi công thức, chỉ đổi luồng bấm.
// Giữ nguyên askCawi/asked/thinking (không xoá) để có thể bật lại lời khuyên nhanh này
// nếu cần, chỉ không còn gọi từ nút chính nữa.

function SpendingAdvisorCard({ product, enabled, onOpenUpgrade, purchasePrice, hasBuySignalData, onViewBuySignal }) {
  const [asked, setAsked] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const coverageDays = getPurchaseHistoryCoverageDays();
  const hasEnoughHistory = coverageDays >= 30;

  // eslint-disable-next-line no-unused-vars
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

  // v86 — advice/asked/thinking không còn dùng để render chính (xem comment đầu file),
  // giữ dòng này lại vì computeSpendingAdvice có thể cần cho lần bật lại flow cũ.
  // eslint-disable-next-line no-unused-vars
  const advice = asked ? computeSpendingAdvice(product) : null;

  return (
    <div className="spending-advisor-card-v63">
      <div className="spending-advisor-head-v63">
        <span><MessageCircleQuestion size={16} /> Cawi Cố Vấn Chi Tiêu</span>
      </div>

      {/* v86 — Giới thiệu mặc định giờ luôn hiện (không còn điều kiện !asked && !thinking,
          vì askCawi không còn được gọi từ nút chính nữa — xem comment đầu file). Nút "Hỏi
          Cawi" mở THẲNG bộ 5 câu hỏi toàn màn hình thay vì hiện lời khuyên chỉ-theo-ngân-sách
          rồi mới có CTA phụ mở 5 câu hỏi như trước. */}
      {!quizOpen && (
        <div className="spending-advisor-intro-row-v85">
          <p className="spending-advisor-intro-v63 spending-advisor-intro-v85">Cân nhắc lần mua này?</p>
          <button type="button" className="secondary small spending-advisor-ask-btn-v63" onClick={() => setQuizOpen(true)}>
            <Sparkles size={15} /> Hỏi Cawi
          </button>
        </div>
      )}

      {/* v86 — Unlink 3 khối bên dưới (KHÔNG xoá, chỉ comment) vì thuộc luồng cũ 2 bước
          "lời khuyên chỉ theo ngân sách → CTA phụ mở 5 câu hỏi". Luồng mới: bấm "Hỏi Cawi"
          mở thẳng SpendingAdvisorQuiz, lời khuyên cuối cùng đã gộp cả ngân sách lẫn 5 câu
          hỏi trong computeCombinedAdvice (spendingAdvisorQuestions.js), nên không cần hiện
          lời khuyên tạm theo ngân sách riêng ở giữa nữa.

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
      */}

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
