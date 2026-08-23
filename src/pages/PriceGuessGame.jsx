import { useMemo, useState } from 'react';
import { ArrowLeft, Trophy, Flame, Check, X as XIcon, Sparkles, RotateCcw, Target } from 'lucide-react';
import { products, getBestFinalStore, getFinalCost } from '../data/products.js';
import { formatCurrency } from '../data/currency.js';

// v76 — "Cawi Đố Giá": minigame đoán chi phí dự kiến rẻ nhất (online) của sản phẩm
// thật trong CartWise. Mục tiêu vừa giải trí, vừa gián tiếp cho người chơi thấy rõ
// giá trị cốt lõi của sản phẩm (so sánh tổng chi phí thật giữa các nền tảng) ngay
// trong lúc chơi, không cần giải thích dài dòng — rất hợp để demo trực tiếp trước
// ban giám khảo.
//
// Luôn hiển thị giá bằng VND (không đổi theo đơn vị tiền tệ người dùng chọn ở Cài
// đặt) để số liệu trong game luôn tròn, dễ đọc, không lệch do làm tròn quy đổi.

const ROUNDS_PER_GAME = 8;
const BEST_SCORE_KEY = 'cartwise-priceguess-best-v76';
const DECOY_FACTORS = [0.5, 0.62, 0.74, 1.28, 1.45, 1.65, 1.9];

function loadBest() {
  try {
    const raw = JSON.parse(localStorage.getItem(BEST_SCORE_KEY) || 'null');
    if (raw && typeof raw.bestScore === 'number') return raw;
  } catch (e) { /* dữ liệu cũ hỏng, bỏ qua */ }
  return { bestScore: 0, bestStreak: 0, timesPlayed: 0 };
}

function saveBest(next) {
  localStorage.setItem(BEST_SCORE_KEY, JSON.stringify(next));
}

// Làm tròn về số "đẹp" theo đúng thói quen nhìn giá tại Việt Nam (giá nhỏ tròn theo
// trăm/nghìn, giá lớn tròn theo chục nghìn) để 4 đáp án trông tự nhiên như giá thật.
function niceRound(value) {
  const v = Math.max(0, value);
  if (v < 20000) return Math.max(500, Math.round(v / 500) * 500);
  if (v < 100000) return Math.round(v / 1000) * 1000;
  if (v < 500000) return Math.round(v / 5000) * 5000;
  return Math.round(v / 10000) * 10000;
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildOptions(correctRaw) {
  const correct = niceRound(correctRaw);
  const decoys = [];
  const pool = shuffle(DECOY_FACTORS);
  for (const factor of pool) {
    if (decoys.length >= 3) break;
    const candidate = niceRound(correctRaw * factor);
    if (candidate > 0 && candidate !== correct && !decoys.includes(candidate)) decoys.push(candidate);
  }
  // Van an toàn: cực hiếm khi xảy ra (trùng lặp sau làm tròn), vẫn đảm bảo luôn đủ 4
  // đáp án khác nhau thay vì để lỗi hiển thị thiếu đáp án.
  let step = 1;
  while (decoys.length < 3) {
    const sign = decoys.length % 2 === 0 ? 1 : -1;
    const candidate = niceRound(correct + sign * step * (correct * 0.3 + 2000));
    if (candidate > 0 && candidate !== correct && !decoys.includes(candidate)) decoys.push(candidate);
    step += 1;
    if (step > 25) break;
  }
  return shuffle([{ value: correct, isCorrect: true }, ...decoys.map((value) => ({ value, isCorrect: false }))]);
}

function buildRounds() {
  const picked = shuffle(products).slice(0, Math.min(ROUNDS_PER_GAME, products.length));
  return picked.map((product) => {
    const bestStore = getBestFinalStore(product);
    const rawCost = bestStore ? getFinalCost(bestStore) : Number.POSITIVE_INFINITY;
    const correctRaw = Number.isFinite(rawCost) ? rawCost : product.basePrice;
    return {
      product,
      storeName: bestStore?.storeName || null,
      correctRaw,
      options: buildOptions(correctRaw)
    };
  });
}

function resultTier(score, maxScore) {
  const pct = maxScore > 0 ? score / maxScore : 0;
  if (pct >= 0.75) return { emoji: '🏆', title: 'Xuất sắc! Bạn là cao thủ săn giá!' };
  if (pct >= 0.5) return { emoji: '🎉', title: 'Khá tốt! Bạn nắm giá khá chắc đó!' };
  if (pct >= 0.25) return { emoji: '🙂', title: 'Cũng ổn, chơi thêm để lên tay nhé!' };
  return { emoji: '💡', title: 'Chơi lại lần nữa để đoán chuẩn hơn nhé!' };
}

function PriceGuessGame({ onBack }) {
  const [screen, setScreen] = useState('intro'); // intro | playing | result
  const [rounds, setRounds] = useState(() => buildRounds());
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreakThisGame, setBestStreakThisGame] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [best, setBest] = useState(loadBest);
  const [justBeatBest, setJustBeatBest] = useState(false);

  const maxPossibleScore = ROUNDS_PER_GAME * 200;
  const current = rounds[roundIndex];

  function startGame() {
    setRounds(buildRounds());
    setRoundIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreakThisGame(0);
    setCorrectCount(0);
    setSelected(null);
    setRevealed(false);
    setJustBeatBest(false);
    setScreen('playing');
  }

  function pickAnswer(option) {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    if (option.isCorrect) {
      const streakBonus = Math.min(streak * 20, 100);
      setScore((s) => s + 100 + streakBonus);
      setCorrectCount((c) => c + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreakThisGame((best2) => Math.max(best2, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  }

  function nextRound() {
    if (roundIndex + 1 >= rounds.length) {
      finishGame();
      return;
    }
    setRoundIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function finishGame() {
    const beatScore = score > best.bestScore;
    const nextBest = {
      bestScore: Math.max(best.bestScore, score),
      bestStreak: Math.max(best.bestStreak, bestStreakThisGame),
      timesPlayed: (best.timesPlayed || 0) + 1
    };
    saveBest(nextBest);
    setBest(nextBest);
    setJustBeatBest(beatScore && score > 0);
    setScreen('result');
  }

  const tier = useMemo(() => resultTier(score, maxPossibleScore), [score, maxPossibleScore]);

  if (screen === 'intro') {
    return (
      <section className="standalone-page-v45 priceguess-page-v76">
        <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

        <div className="standalone-hero-v45 priceguess-hero-v76">
          <span className="eyebrow">🎯 Cawi Đố Giá</span>
          <h1>Đoán chi phí dự kiến rẻ nhất</h1>
          <p>
            Với mỗi sản phẩm thật trong CartWise, hãy đoán xem <strong>tổng chi phí dự kiến rẻ nhất khi mua online</strong>
            {' '}(giá sản phẩm + phí vận chuyển ước tính) là bao nhiêu. Đoán càng đúng, đoán liên tiếp càng nhiều điểm thưởng!
          </p>
        </div>

        <div className="priceguess-rules-v76">
          <article>
            <span className="priceguess-rules-icon-v76"><Target size={20} /></span>
            <strong>{ROUNDS_PER_GAME} câu hỏi</strong>
            <span>Mỗi ván chơi ngẫu nhiên {ROUNDS_PER_GAME} sản phẩm khác nhau trong CartWise.</span>
          </article>
          <article>
            <span className="priceguess-rules-icon-v76"><Sparkles size={20} /></span>
            <strong>+100 điểm / câu đúng</strong>
            <span>Chọn đúng đáp án trong 4 lựa chọn để ghi điểm.</span>
          </article>
          <article>
            <span className="priceguess-rules-icon-v76"><Flame size={20} /></span>
            <strong>Điểm thưởng chuỗi đúng</strong>
            <span>Đúng liên tiếp càng nhiều, điểm thưởng mỗi câu càng cao (tối đa +100).</span>
          </article>
        </div>

        {best.timesPlayed > 0 && (
          <div className="priceguess-best-v76">
            <div>
              <span>Điểm cao nhất</span>
              <strong>{best.bestScore}</strong>
            </div>
            <div>
              <span>Chuỗi đúng dài nhất</span>
              <strong>{best.bestStreak}</strong>
            </div>
            <div>
              <span>Số lần đã chơi</span>
              <strong>{best.timesPlayed}</strong>
            </div>
          </div>
        )}

        <button className="primary priceguess-start-btn-v76" onClick={startGame}>
          {best.timesPlayed > 0 ? 'Chơi lại' : 'Bắt đầu chơi'}
        </button>
      </section>
    );
  }

  if (screen === 'result') {
    return (
      <section className="standalone-page-v45 priceguess-page-v76">
        <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

        <div className="priceguess-result-v76">
          <span className="priceguess-result-emoji-v76">{tier.emoji}</span>
          <h1>{tier.title}</h1>
          {justBeatBest && <span className="priceguess-newbest-badge-v76"><Trophy size={16} /> Kỷ lục mới!</span>}

          <div className="priceguess-result-stats-v76">
            <div>
              <span>Tổng điểm</span>
              <strong>{score}</strong>
            </div>
            <div>
              <span>Trả lời đúng</span>
              <strong>{correctCount}/{rounds.length}</strong>
            </div>
            <div>
              <span>Chuỗi đúng dài nhất</span>
              <strong>{bestStreakThisGame}</strong>
            </div>
          </div>

          <p className="priceguess-result-best-v76">Điểm cao nhất của bạn hiện tại: <strong>{best.bestScore}</strong></p>

          <div className="priceguess-result-actions-v76">
            <button className="primary" onClick={startGame}><RotateCcw size={18} /> Chơi lại</button>
            <button className="ghost" onClick={onBack}>Về trang chủ</button>
          </div>
        </div>
      </section>
    );
  }

  // screen === 'playing'
  return (
    <section className="standalone-page-v45 priceguess-page-v76">
      <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

      <div className="priceguess-topbar-v76">
        <div className="priceguess-progress-v76">
          <span>Câu {roundIndex + 1}/{rounds.length}</span>
          <div className="priceguess-progress-bar-v76">
            <div style={{ width: `${((roundIndex + (revealed ? 1 : 0)) / rounds.length) * 100}%` }} />
          </div>
        </div>
        <div className="priceguess-stats-pill-v76">
          <span><Sparkles size={15} /> {score} điểm</span>
          {streak > 0 && <span className="priceguess-streak-v76"><Flame size={15} /> Chuỗi {streak}</span>}
        </div>
      </div>

      <div className="priceguess-card-v76">
        <div className="priceguess-product-v76">
          <div className="priceguess-product-img-v76">
            <img
              src={current.product.image}
              alt={current.product.name}
              onError={(event) => {
                if (current.product.fallbackImage && event.currentTarget.src !== current.product.fallbackImage) {
                  event.currentTarget.src = current.product.fallbackImage;
                }
              }}
            />
          </div>
          <span className="category-chip">{current.product.category}</span>
          <h2>{current.product.name}</h2>
          <p className="priceguess-question-v76">Tổng chi phí dự kiến rẻ nhất khi mua online của sản phẩm này là bao nhiêu?</p>
        </div>

        <div className="priceguess-options-v76">
          {current.options.map((option) => {
            let stateClass = '';
            if (revealed) {
              if (option.isCorrect) stateClass = 'correct';
              else if (option === selected) stateClass = 'wrong';
              else stateClass = 'muted';
            }
            return (
              <button
                key={option.value}
                type="button"
                className={`priceguess-option-v76 ${stateClass}`}
                onClick={() => pickAnswer(option)}
                disabled={revealed}
              >
                <span>{formatCurrency(option.value, 'VND')}</span>
                {revealed && option.isCorrect && <Check size={18} />}
                {revealed && !option.isCorrect && option === selected && <XIcon size={18} />}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className={`priceguess-feedback-v76 ${selected?.isCorrect ? 'correct' : 'wrong'}`}>
            <p>
              {selected?.isCorrect
                ? `Chính xác! ${current.storeName ? `${current.storeName} ` : ''}đang là lựa chọn có tổng chi phí dự kiến thấp nhất cho sản phẩm này.`
                : `Chưa đúng — chi phí dự kiến rẻ nhất thực tế khoảng ${formatCurrency(current.correctRaw, 'VND')}${current.storeName ? ` (tại ${current.storeName})` : ''}.`}
            </p>
            <button className="primary" onClick={nextRound}>
              {roundIndex + 1 >= rounds.length ? 'Xem kết quả' : 'Câu tiếp theo'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default PriceGuessGame;
