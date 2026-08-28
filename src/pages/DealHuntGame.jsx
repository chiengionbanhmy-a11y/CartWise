import { useState } from 'react';
import { ArrowLeft, Target, ShoppingBag, Wallet, Check, TrendingDown, RotateCcw, Sparkles } from 'lucide-react';
import { products, getBestFinalStore, getFinalCost } from '../data/products.js';
import { formatCurrency } from '../data/currency.js';

// v78 — "Thử Thách Săn Deal": thay cho "Cawi Đố Giá" (v76) trên thanh nav, theo yêu
// cầu làm 1 game "thiết thực hơn", không "vô tri" — vừa giữ chân người chơi vừa có
// lợi thật cho mục tiêu của web. Khác với "Cawi Đố Giá" (đoán số, mang tính trivia),
// game này bắt người chơi THẬT SỰ luyện đúng hành vi cốt lõi mà CartWise muốn: với
// mỗi món hàng trong 1 "nhiệm vụ" mua sắm có ngân sách giới hạn, phải chọn đúng sàn
// (Shopee/Lazada/Tiki) có TỔNG CHI PHÍ (giá + phí vận chuyển) thấp nhất, dùng đúng dữ
// liệu giá thật trong products.js — không phải đoán mò/trivia tách biệt.
//
// Điểm đặc biệt: "Tổng tiền đã tiết kiệm" được cộng dồn qua localStorage dựa trên
// chênh lệch giá THẬT giữa lựa chọn của người chơi và sàn đắt nhất trong 3 lựa chọn
// — đây là 1 con số thật, không bịa, rất hợp để demo trực tiếp giá trị cốt lõi sản
// phẩm trước ban giám khảo ("người dùng chơi game này đã tiết kiệm được X đồng").
//
// Luôn hiển thị giá bằng VND (không đổi theo đơn vị tiền tệ người dùng chọn ở Cài
// đặt) để số liệu trong game luôn tròn, dễ đọc, giống game v76.

const STATS_KEY = 'cartwise-dealhunt-stats-v78';
const ONLINE_STORES = ['Shopee', 'Lazada', 'Tiki'];

// v85: đã bỏ nhiệm vụ 'hoc-tap' (notebook, casio) và 'qua-tang' (lego-classic,
// teddy-bear) — 4 sản phẩm này không còn trong danh sách sản phẩm.
const MISSIONS = [
  { id: 'phong-tro', title: 'Sắm đồ cho phòng trọ mới', desc: 'Chuyển phòng trọ mới, cần nồi cơm điện mini và quạt để bàn.', items: ['rice-cooker', 'mini-fan'] },
  { id: 'lam-dep', title: 'Set chăm sóc da đi học, đi làm', desc: 'Kem chống nắng và son dưỡng dùng hằng ngày.', items: ['sunscreen', 'lipstick'] },
  { id: 'cong-nghe', title: 'Set phụ kiện công nghệ mini', desc: 'Chuột không dây và pin sạc dự phòng cho việc học, làm từ xa.', items: ['mouse-logitech', 'powerbank-anker'] },
  { id: 'hop-nhom', title: 'Chuẩn bị đồ ăn nhẹ cho buổi học nhóm', desc: 'Mì ăn liền và nước khoáng cho cả nhóm học chung.', items: ['haohao', 'water-lavie-500'] }
];

function niceRound(value) {
  const v = Math.max(0, value);
  if (v < 20000) return Math.max(500, Math.round(v / 500) * 500);
  if (v < 100000) return Math.round(v / 1000) * 1000;
  if (v < 500000) return Math.round(v / 5000) * 5000;
  return Math.round(v / 10000) * 10000;
}

function loadStats() {
  try {
    const raw = JSON.parse(localStorage.getItem(STATS_KEY) || 'null');
    if (raw && typeof raw.totalSaved === 'number') return raw;
  } catch (e) { /* dữ liệu cũ hỏng, bỏ qua */ }
  return { totalSaved: 0, missionsCompleted: 0, bestScore: 0 };
}

function saveStats(next) {
  localStorage.setItem(STATS_KEY, JSON.stringify(next));
}

function getMissionProducts(mission) {
  return mission.items.map((id) => products.find((p) => p.id === id)).filter(Boolean);
}

// Chỉ so sánh trong đúng 3 sàn online mà UI cho chọn (Shopee/Lazada/Tiki) — không
// tính các sàn offline (FPT Shop, Guardian, WinMart...) vì người chơi không có lựa
// chọn đó trong game, tránh số "tiết kiệm được" bị thổi phồng sai lệch.
function getStoreOffers(product) {
  return ONLINE_STORES.map((storeName) => {
    const store = product.stores.find((s) => s.storeName === storeName);
    const available = !!store && store.available !== false && store.storePrice != null;
    return {
      storeName,
      store,
      available,
      finalCost: available ? getFinalCost(store) : Number.POSITIVE_INFINITY
    };
  });
}

function buildMission(excludeId) {
  const pool = MISSIONS.length > 1 && excludeId ? MISSIONS.filter((m) => m.id !== excludeId) : MISSIONS;
  const mission = pool[Math.floor(Math.random() * pool.length)];
  const missionProducts = getMissionProducts(mission);
  const optimalSpend = missionProducts.reduce((sum, p) => {
    const best = getBestFinalStore(p);
    return sum + (best ? getFinalCost(best) : 0);
  }, 0);
  const budget = niceRound(optimalSpend * 1.2);
  return { ...mission, products: missionProducts, optimalSpend, budget };
}

function tierMessage(pct, underBudget) {
  if (pct >= 95 && underBudget) return { emoji: '🏆', title: 'Săn deal cực đỉnh! Gần như tối ưu tuyệt đối.' };
  if (pct >= 80 && underBudget) return { emoji: '🎉', title: 'Rất tốt! Bạn tiết kiệm được kha khá đó.' };
  if (underBudget) return { emoji: '🙂', title: 'Trong ngân sách, nhưng vẫn còn chỗ tối ưu hơn.' };
  return { emoji: '⚠️', title: 'Vượt ngân sách rồi — thử so sánh kỹ hơn ở lượt sau nhé!' };
}

function DealHuntGame({ onBack }) {
  const [screen, setScreen] = useState('intro'); // intro | playing | result
  const [mission, setMission] = useState(() => buildMission());
  const [selections, setSelections] = useState({});
  const [stats, setStats] = useState(loadStats);
  const [lastResult, setLastResult] = useState(null);

  const missionProducts = mission.products;
  const selectedCount = missionProducts.filter((p) => selections[p.id]).length;
  const allSelected = selectedCount === missionProducts.length && missionProducts.length > 0;

  const runningTotal = missionProducts.reduce((sum, p) => {
    const storeName = selections[p.id];
    if (!storeName) return sum;
    const store = p.stores.find((s) => s.storeName === storeName);
    return sum + (store ? getFinalCost(store) : 0);
  }, 0);

  const overBudget = runningTotal > mission.budget;
  const progressPct = mission.budget > 0 ? Math.min(100, Math.round((runningTotal / mission.budget) * 100)) : 0;

  function startGame() {
    const next = buildMission(mission.id);
    setMission(next);
    setSelections({});
    setLastResult(null);
    setScreen('playing');
  }

  function pickStore(productId, storeName) {
    setSelections((prev) => ({ ...prev, [productId]: storeName }));
  }

  function finishMission() {
    let totalSpend = 0;
    let totalWorstOnline = 0;

    missionProducts.forEach((p) => {
      const offers = getStoreOffers(p);
      const availableCosts = offers.filter((o) => o.available).map((o) => o.finalCost);
      const worstOnline = availableCosts.length ? Math.max(...availableCosts) : 0;
      const chosen = offers.find((o) => o.storeName === selections[p.id]);
      const chosenCost = chosen && chosen.available ? chosen.finalCost : 0;
      totalSpend += chosenCost;
      totalWorstOnline += worstOnline;
    });

    const efficiency = mission.optimalSpend > 0 ? Math.min(1, mission.optimalSpend / totalSpend) : 1;
    const underBudget = totalSpend <= mission.budget;
    const score = Math.round(efficiency * 800) + (underBudget ? 200 : 0);
    const savedThisRound = Math.max(0, totalWorstOnline - totalSpend);

    const nextStats = {
      totalSaved: (stats.totalSaved || 0) + savedThisRound,
      missionsCompleted: (stats.missionsCompleted || 0) + 1,
      bestScore: Math.max(stats.bestScore || 0, score)
    };
    saveStats(nextStats);
    setStats(nextStats);
    setLastResult({
      totalSpend,
      efficiencyPct: Math.round(efficiency * 100),
      underBudget,
      score,
      savedThisRound,
      isNewBest: score > 0 && score >= (stats.bestScore || 0)
    });
    setScreen('result');
  }

  const tier = lastResult ? tierMessage(lastResult.efficiencyPct, lastResult.underBudget) : null;

  if (screen === 'intro') {
    return (
      <section className="standalone-page-v45 dealhunt-page-v78">
        <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

        <div className="standalone-hero-v45 dealhunt-hero-v78">
          <span className="eyebrow">🛍️ Thử Thách Săn Deal</span>
          <h1>Mua đúng nhu cầu, chọn đúng sàn rẻ nhất</h1>
          <p>
            Mỗi lượt chơi là 1 <strong>nhiệm vụ mua sắm thật</strong> với ngân sách giới hạn. Với từng món hàng, hãy chọn
            đúng sàn (Shopee, Lazada hoặc Tiki) có <strong>tổng chi phí thấp nhất</strong> (giá sản phẩm + phí vận
            chuyển) để hoàn thành nhiệm vụ trong ngân sách và tiết kiệm được nhiều nhất có thể.
          </p>
        </div>

        <div className="dealhunt-rules-v78">
          <article>
            <span className="dealhunt-rules-icon-v78"><ShoppingBag size={20} /></span>
            <strong>Nhiệm vụ ngẫu nhiên</strong>
            <span>Mỗi lượt chơi random 1 nhu cầu mua sắm thật, gồm 2 món hàng thật trong CartWise.</span>
          </article>
          <article>
            <span className="dealhunt-rules-icon-v78"><Target size={20} /></span>
            <strong>Chọn đúng sàn rẻ nhất</strong>
            <span>So sánh giá cộng phí vận chuyển thật giữa 3 sàn cho từng món, không phải đoán mò.</span>
          </article>
          <article>
            <span className="dealhunt-rules-icon-v78"><Wallet size={20} /></span>
            <strong>Đừng vượt ngân sách</strong>
            <span>Hoàn thành trong ngân sách để nhận thêm điểm thưởng, càng tối ưu điểm càng cao.</span>
          </article>
        </div>

        {stats.missionsCompleted > 0 && (
          <div className="dealhunt-stats-v78">
            <div>
              <span>Tổng tiền đã tiết kiệm</span>
              <strong>{formatCurrency(stats.totalSaved, 'VND')}</strong>
            </div>
            <div>
              <span>Điểm cao nhất</span>
              <strong>{stats.bestScore}</strong>
            </div>
            <div>
              <span>Nhiệm vụ đã hoàn thành</span>
              <strong>{stats.missionsCompleted}</strong>
            </div>
          </div>
        )}

        <button className="primary dealhunt-start-btn-v78" onClick={startGame}>
          {stats.missionsCompleted > 0 ? 'Nhận nhiệm vụ mới' : 'Bắt đầu nhiệm vụ'}
        </button>
      </section>
    );
  }

  if (screen === 'result' && lastResult) {
    return (
      <section className="standalone-page-v45 dealhunt-page-v78">
        <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

        <div className="dealhunt-result-v78">
          <span className="dealhunt-result-emoji-v78">{tier.emoji}</span>
          <h1>{tier.title}</h1>
          {lastResult.isNewBest && <span className="dealhunt-newbest-badge-v78"><Sparkles size={16} /> Điểm cao nhất mới!</span>}

          <div className="dealhunt-result-stats-v78">
            <div>
              <span>Tổng chi phí của bạn</span>
              <strong>{formatCurrency(lastResult.totalSpend, 'VND')}</strong>
            </div>
            <div>
              <span>Ngân sách nhiệm vụ</span>
              <strong>{formatCurrency(mission.budget, 'VND')}</strong>
            </div>
            <div>
              <span>Mức tối ưu đạt được</span>
              <strong>{lastResult.efficiencyPct}%</strong>
            </div>
          </div>

          <p className={`dealhunt-budget-line-v78 ${lastResult.underBudget ? 'ok' : 'over'}`}>
            {lastResult.underBudget ? <Check size={16} /> : <Wallet size={16} />}
            {lastResult.underBudget ? 'Hoàn thành trong ngân sách' : 'Đã vượt ngân sách nhiệm vụ này'}
          </p>

          <p className="dealhunt-saved-line-v78">
            <TrendingDown size={16} /> Tiết kiệm được <strong>{formatCurrency(lastResult.savedThisRound, 'VND')}</strong> so với chọn sàn đắt nhất cho mỗi món.
          </p>

          <div className="dealhunt-score-v78">
            <span>Điểm nhiệm vụ này</span>
            <strong>{lastResult.score}</strong>
          </div>

          <p className="dealhunt-result-total-v78">Tổng tiền đã tiết kiệm qua tất cả nhiệm vụ: <strong>{formatCurrency(stats.totalSaved, 'VND')}</strong></p>

          <div className="dealhunt-result-actions-v78">
            <button className="primary" onClick={startGame}><RotateCcw size={18} /> Thử nhiệm vụ khác</button>
            <button className="ghost" onClick={onBack}>Về trang chủ</button>
          </div>
        </div>
      </section>
    );
  }

  // screen === 'playing'
  return (
    <section className="standalone-page-v45 dealhunt-page-v78">
      <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

      <div className="dealhunt-mission-head-v78">
        <span className="dealhunt-mission-eyebrow-v78">🛍️ Nhiệm vụ</span>
        <h2>{mission.title}</h2>
        <p>{mission.desc}</p>
      </div>

      <div className="dealhunt-budget-bar-v78">
        <div className="dealhunt-budget-top-v78">
          <span>Đã chọn {selectedCount}/{missionProducts.length} món</span>
          <span className={overBudget ? 'over' : ''}>
            {formatCurrency(runningTotal, 'VND')} / {formatCurrency(mission.budget, 'VND')}
          </span>
        </div>
        <div className="dealhunt-budget-track-v78">
          <div className={overBudget ? 'over' : ''} style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="dealhunt-items-v78">
        {missionProducts.map((p) => {
          const offers = getStoreOffers(p);
          const selected = selections[p.id];
          return (
            <div className="dealhunt-item-card-v78" key={p.id}>
              <div className="dealhunt-item-product-v78">
                <div className="dealhunt-item-img-v78">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={(event) => {
                      if (p.fallbackImage && event.currentTarget.src !== p.fallbackImage) {
                        event.currentTarget.src = p.fallbackImage;
                      }
                    }}
                  />
                </div>
                <div>
                  <span className="category-chip">{p.category}</span>
                  <h3>{p.name}</h3>
                </div>
              </div>

              <div className="dealhunt-offers-v78">
                {offers.map((offer) => (
                  <button
                    key={offer.storeName}
                    type="button"
                    className={`dealhunt-offer-btn-v78 ${selected === offer.storeName ? 'selected' : ''} ${!offer.available ? 'disabled' : ''}`}
                    disabled={!offer.available}
                    onClick={() => pickStore(p.id, offer.storeName)}
                  >
                    <span className="dealhunt-offer-store-v78">{offer.storeName}</span>
                    {offer.available ? (
                      <>
                        <span className="dealhunt-offer-price-v78">{formatCurrency(offer.store.storePrice, 'VND')}</span>
                        <span className="dealhunt-offer-ship-v78">
                          {offer.store.shippingFee > 0 ? `+ ship ${formatCurrency(offer.store.shippingFee, 'VND')}` : 'Miễn phí ship'}
                        </span>
                      </>
                    ) : (
                      <span className="dealhunt-offer-price-v78">Hết hàng</span>
                    )}
                    {selected === offer.storeName && <Check size={16} className="dealhunt-offer-check-v78" />}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button className="primary dealhunt-confirm-btn-v78" disabled={!allSelected} onClick={finishMission}>
        Chốt đơn ({selectedCount}/{missionProducts.length})
      </button>
    </section>
  );
}

export default DealHuntGame;
