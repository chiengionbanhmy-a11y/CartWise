// v82 — Bổ sung "Bộ 5 câu hỏi đánh giá mức độ cần thiết" cho Cawi Cố Vấn Chi Tiêu.
// Xem đặc tả đầy đủ trong tài liệu "Bổ sung Cawi Cố Vấn Chi Tiêu — Bộ 5 câu hỏi
// đánh giá mức độ cần thiết" (đã chốt trước khi implement).
//
// Nguyên tắc giữ nguyên như Cố Vấn Chi Tiêu bản gốc (v63): điểm số tính theo công
// thức cộng dồn CỐ ĐỊNH, minh bạch — không có bước "AI tự chấm điểm". Lớp AI chỉ
// diễn giải điểm số thành câu tư vấn + dòng "vì sao" bằng cách ghép các mẫu câu có
// sẵn theo đúng câu trả lời, không tự quyết định kết quả.
//
// Ngân sách (đã có, đo KHẢ NĂNG CHI TRẢ) và bộ 5 câu hỏi này (đo MỨC ĐỘ CẦN THIẾT
// tại thời điểm mua) là 2 trục độc lập — kết hợp lại ở computeCombinedAdvice() bên
// dưới theo đúng ma trận 3x4 trong đặc tả, để tránh đếm trùng tín hiệu (ví dụ: mua
// theo flash sale/mạng xã hội chỉ tính ở trục "cần thiết", không cộng thêm vào
// trục "ngân sách" như computeSpendingAdvice() bản gốc từng làm).

// Mỗi câu: `options` là các lựa chọn chính (nút to). `unsure` là lựa chọn phụ
// "Chưa chắc / không rõ" — điểm luôn = floor((điểm cao nhất + điểm thấp nhất) / 2)
// của đúng câu đó (quy tắc duy nhất áp dụng cho cả 5 câu, xem mục 2.1 đặc tả).
// Câu 5 có `unsureInline: true` vì lựa chọn "Chưa biết được" vốn đã là 1 trong 3
// nút chính cùng cỡ (không tách thành link nhỏ như 4 câu còn lại).
//
// `reason`: mẫu câu ngắn dùng để ghép vào dòng "vì sao" khi câu trả lời là lựa
// chọn CỰC TRỊ (điểm cao nhất hoặc thấp nhất) của câu đó — chỉ những lựa chọn thật
// sự "nói lên điều gì đó" mới có reason; lựa chọn ở giữa (trung tính) để `reason:
// null` vì không đủ rõ ràng để đưa vào lý do.

export const SPENDING_ADVISOR_QUESTIONS = [
  {
    id: 'q1',
    text: 'Nếu không mua ngay bây giờ, việc học/sinh hoạt của bạn có bị ảnh hưởng trong tuần này không?',
    options: [
      { value: 2, label: 'Có, đang cần gấp', reason: 'bạn đang thật sự cần gấp cho việc học/sinh hoạt tuần này' },
      { value: 0, label: 'Không, chỉ là muốn có thêm thôi', reason: 'hiện tại đây chỉ là muốn có thêm, chưa hẳn là đang cần gấp' }
    ],
    unsure: { value: 1, label: 'Chưa chắc, chưa nghĩ kỹ tới đâu' }
  },
  {
    id: 'q2',
    text: 'Bạn đã có món nào dùng được cho việc tương tự chưa?',
    options: [
      { value: 2, label: 'Chưa có, hoặc cái cũ đã hỏng/hết dùng được', reason: 'bạn chưa có món nào thay thế được' },
      { value: 0, label: 'Có rồi, nhưng muốn đổi cái mới/đẹp hơn', reason: null },
      { value: -1, label: 'Có rồi, thậm chí vài cái tương tự', reason: 'bạn đã có sẵn vài món tương tự rồi' }
    ],
    unsure: { value: 0, label: 'Chưa chắc, chưa để ý/chưa kiểm tra' }
  },
  {
    id: 'q3',
    text: 'Bạn biết đến / quyết định mua món này vì đâu?',
    options: [
      { value: 2, label: 'Đã tìm hiểu, lên kế hoạch mua từ trước', reason: 'bạn đã tìm hiểu và lên kế hoạch mua từ trước' },
      { value: 0, label: 'Tình cờ thấy đang giảm giá / flash sale nên mua luôn', reason: null },
      { value: -1, label: 'Thấy trên mạng xã hội / bạn bè có nên muốn mua theo', reason: 'bạn biết đến món này qua mạng xã hội/bạn bè rủ mua theo' }
    ],
    unsure: { value: 0, label: 'Chưa chắc, không nhớ rõ vì sao' }
  },
  {
    id: 'q4',
    text: 'Bạn nghĩ mình sẽ dùng món này thường xuyên cỡ nào?',
    options: [
      { value: 2, label: 'Gần như mỗi ngày / mỗi tuần', reason: 'bạn dự tính sẽ dùng gần như mỗi ngày/mỗi tuần' },
      { value: 1, label: 'Thỉnh thoảng, vài lần một tháng', reason: null },
      { value: -1, label: 'Có thể dùng vài lần rồi cất', reason: 'có khả năng bạn chỉ dùng vài lần rồi cất đi' }
    ],
    unsure: { value: 0, label: 'Chưa chắc, đồ mới nên khó đoán trước' }
  },
  {
    id: 'q5',
    text: 'Nếu chờ thêm 3 ngày nữa mới quyết định, bạn nghĩ sao?',
    options: [
      { value: 2, label: 'Chắc chắn vẫn muốn mua', reason: 'bạn chắc chắn vẫn sẽ muốn mua kể cả khi chờ thêm vài ngày' },
      { value: -2, label: 'Chắc là sẽ quên luôn / thấy hết cần', reason: 'bạn tự nhận có thể sẽ quên hoặc thấy hết cần nếu chờ thêm vài ngày' }
    ],
    unsure: { value: 0, label: 'Chưa biết được, khó nói trước' },
    unsureInline: true
  }
];

const NECESSITY_LEVEL_META = {
  very: { label: 'Rất cần thiết', min: 7 },
  quite: { label: 'Khá cần thiết', min: 3 },
  consider: { label: 'Nên cân nhắc thêm', min: 0 },
  impulse: { label: 'Nhiều dấu hiệu mua theo cảm xúc', min: -Infinity }
};

export function getNecessityLevel(total) {
  if (total >= 7) return 'very';
  if (total >= 3) return 'quite';
  if (total >= 0) return 'consider';
  return 'impulse';
}

export function getNecessityLabel(level) {
  return NECESSITY_LEVEL_META[level]?.label || '';
}

const BUDGET_LEVEL_META = {
  fit: 'Phù hợp ngân sách',
  near: 'Sắp chạm ngân sách',
  over: 'Đã vượt ngân sách'
};

export function getBudgetLevelLabel(level) {
  return BUDGET_LEVEL_META[level] || '';
}

// Ma trận 3 (ngân sách) x 4 (cần thiết) — đúng bảng ở mục 3 đặc tả.
const ADVICE_MATRIX = {
  fit: {
    very: { verdict: 'Nên mua', tone: 'good' },
    quite: { verdict: 'Có thể mua', tone: 'good' },
    consider: { verdict: 'Thử để trong giỏ 1-2 ngày rồi quyết', tone: 'stable' },
    impulse: { verdict: 'Nên bỏ qua — đây nhiều khả năng là mua theo cảm xúc dù ví vẫn ổn', tone: 'warning' }
  },
  near: {
    very: { verdict: 'Cân nhắc mua, nhưng theo dõi sát chi tiêu còn lại trong tháng', tone: 'stable' },
    quite: { verdict: 'Nên chờ thêm vài ngày', tone: 'stable' },
    consider: { verdict: 'Nên chờ', tone: 'warning' },
    impulse: { verdict: 'Không nên mua lúc này', tone: 'warning' }
  },
  over: {
    very: { verdict: 'Nếu thật sự cần, cân nhắc bù từ khoản chi khác hoặc đợi đầu tháng sau', tone: 'warning' },
    quite: { verdict: 'Nên chờ đến tháng sau', tone: 'warning' },
    consider: { verdict: 'Không nên mua', tone: 'warning' },
    impulse: { verdict: 'Không nên mua — vừa vượt ngân sách vừa không cần thiết', tone: 'warning' }
  }
};

// answers: [{ questionId, value, isUnsure, optionLabel }] — đúng thứ tự 5 câu.
export function scoreNecessity(answers) {
  const total = answers.reduce((sum, a) => sum + Number(a.value || 0), 0);
  const unsureCount = answers.filter((a) => a.isUnsure).length;
  const level = getNecessityLevel(total);
  return { total, unsureCount, level, label: getNecessityLabel(level) };
}

// Ghép dòng "vì sao" từ các câu trả lời cực trị (có `reason`) — ưu tiên lý do
// "tiêu cực" (kéo điểm xuống) khi kết quả nghiêng về cân nhắc/mua theo cảm xúc,
// ưu tiên lý do "tích cực" khi kết quả nghiêng về cần thiết/nên mua.
export function buildNecessityReasoning(answers, level) {
  const withReason = answers.filter((a) => a.reason && !a.isUnsure);
  const favorPositive = level === 'very' || level === 'quite';
  const sorted = [...withReason].sort((a, b) => {
    const score = (x) => (favorPositive ? -x.value : x.value);
    return score(a) - score(b);
  });
  const picked = sorted.slice(0, 2).map((a) => a.reason);
  if (!picked.length) return '';
  return `vì ${picked.join(', và ')}`;
}

export const LOW_CONFIDENCE_NOTE =
  'Bạn có vẻ chưa chắc chắn về khá nhiều điều — đây thường là dấu hiệu tốt để cho mình thêm vài ngày, thay vì để Cawi đoán thay bạn.';

const LOW_CONFIDENCE_VERDICT = {
  verdict: 'Có vẻ chưa đủ căn cứ để chắc chắn — thử để trong giỏ vài ngày xem cảm giác có đổi không',
  tone: 'stable'
};

// Kết hợp trục ngân sách (budgetLevel: 'fit' | 'near' | 'over', đã tính sẵn từ
// getBudgetLevel() trong purchases.js) với trục cần thiết (5 câu hỏi) ra lời
// khuyên cuối cùng. Khi ≥3/5 câu chọn "Chưa chắc", đổi giọng sang mềm hơn theo
// đúng mục 2.1 đặc tả thay vì vẫn chốt hạ khẳng định mạnh như bình thường.
export function computeCombinedAdvice(budgetLevel, answers) {
  const necessity = scoreNecessity(answers);
  const lowConfidence = necessity.unsureCount >= 3;
  const cell = ADVICE_MATRIX[budgetLevel]?.[necessity.level] || ADVICE_MATRIX.fit.consider;
  const final = lowConfidence ? LOW_CONFIDENCE_VERDICT : cell;
  const reasoning = buildNecessityReasoning(answers, necessity.level);

  return {
    necessity,
    budgetLevel,
    verdict: final.verdict,
    tone: final.tone,
    reasoning,
    lowConfidence,
    lowConfidenceNote: lowConfidence ? LOW_CONFIDENCE_NOTE : ''
  };
}
