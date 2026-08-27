import { useState } from 'react';
import { ChevronLeft, X, TrendingUp } from 'lucide-react';
import { SPENDING_ADVISOR_QUESTIONS, computeCombinedAdvice, getBudgetLevelLabel } from '../data/spendingAdvisorQuestions.js';
import { getBudgetLevel } from '../data/purchases.js';

// v82 — Widget "Trả lời nhanh 5 câu hỏi" của Cawi Cố Vấn Chi Tiêu (mục 4 đặc tả).
// Từng-câu-một, tự nhảy sang câu kế tiếp khi chọn (không cần bấm "Tiếp tục"), có
// chấm tròn báo tiến trình + nút quay lại để đổi đáp án. Không có màn hình loading
// giả "trông giống AI đang nghĩ" — công thức có sẵn, minh bạch, không cần giả vờ.

function SpendingAdvisorQuiz({ purchasePrice, hasBuySignalData, onViewBuySignal, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const total = SPENDING_ADVISOR_QUESTIONS.length;
  const showResult = answers.length >= total;
  const currentQuestion = SPENDING_ADVISOR_QUESTIONS[stepIndex];

  function selectOption(option, isUnsure) {
    const entry = {
      questionId: currentQuestion.id,
      value: option.value,
      reason: option.reason || null,
      isUnsure: Boolean(isUnsure),
      optionLabel: option.label
    };
    setAnswers((prev) => {
      const next = [...prev.slice(0, stepIndex), entry];
      return next;
    });
    setStepIndex((i) => Math.min(i + 1, total));
  }

  function goBack() {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
    setAnswers((prev) => prev.slice(0, stepIndex - 1));
  }

  let resultBlock = null;
  if (showResult) {
    const budget = getBudgetLevel(purchasePrice);
    const advice = computeCombinedAdvice(budget.level, answers);
    resultBlock = (
      <div className="spending-quiz-result-v82">
        <span className="spending-quiz-axis-row-v82">
          <b>{getBudgetLevelLabel(budget.level)}</b>
          <span>·</span>
          <b>{advice.necessity.label} ({advice.necessity.total >= 0 ? '+' : ''}{advice.necessity.total} điểm)</b>
        </span>

        <div className={`spending-quiz-verdict-v82 ${advice.tone}`}>{advice.verdict}</div>

        {advice.reasoning && <p className="spending-quiz-reasoning-v82">{advice.reasoning}.</p>}
        {advice.lowConfidenceNote && <p className="spending-quiz-lowconf-v82">{advice.lowConfidenceNote}</p>}

        <div className="spending-quiz-actions-v82">
          <button type="button" className="secondary small" onClick={onClose}>Vẫn mua</button>
          {hasBuySignalData && (
            <button
              type="button"
              className="primary small"
              onClick={() => {
                onViewBuySignal?.();
                onClose?.();
              }}
            >
              <TrendingUp size={14} /> Xem Cawi Tín Hiệu Mua
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="spending-quiz-v82">
      <div className="spending-quiz-head-v82">
        <div className="spending-quiz-dots-v82">
          {SPENDING_ADVISOR_QUESTIONS.map((q, i) => (
            <span key={q.id} className={i < answers.length || (i === stepIndex && showResult) ? 'dot filled' : i === stepIndex ? 'dot current' : 'dot'} />
          ))}
        </div>
        <button type="button" className="spending-quiz-close-v82" onClick={onClose} aria-label="Đóng">
          <X size={16} />
        </button>
      </div>

      {!showResult && currentQuestion && (
        <div className="spending-quiz-step-v82">
          <p className="spending-quiz-question-v82">{currentQuestion.text}</p>

          <div className="spending-quiz-options-v82">
            {currentQuestion.unsureInline
              ? [currentQuestion.options[0], currentQuestion.unsure, currentQuestion.options[1]].map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="spending-quiz-option-v82"
                    onClick={() => selectOption(opt, opt === currentQuestion.unsure)}
                  >
                    {opt.label}
                  </button>
                ))
              : currentQuestion.options.map((opt, idx) => (
                  <button key={idx} type="button" className="spending-quiz-option-v82" onClick={() => selectOption(opt, false)}>
                    {opt.label}
                  </button>
                ))}
          </div>

          {!currentQuestion.unsureInline && (
            <button type="button" className="spending-quiz-unsure-v82" onClick={() => selectOption(currentQuestion.unsure, true)}>
              {currentQuestion.unsure.label}
            </button>
          )}
        </div>
      )}

      {resultBlock}

      {stepIndex > 0 && (
        <button type="button" className="spending-quiz-back-v82" onClick={goBack}>
          <ChevronLeft size={14} /> Quay lại đổi đáp án
        </button>
      )}
    </div>
  );
}

export default SpendingAdvisorQuiz;
