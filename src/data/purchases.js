// v63 — Dữ liệu & helper dùng chung cho "Lịch sử mua hàng" (đã có từ Vòng 3) và hai
// tính năng mới của Vòng 4 cần cùng nguồn dữ liệu này: Bộ đếm "Số tiền đã tiết kiệm"
// và Cawi Cố Vấn Chi Tiêu. Toàn bộ vẫn là dữ liệu mô phỏng (demo), đúng nguyên tắc
// minh bạch đã nêu trong Báo cáo cải tiến — không có backend/thanh toán thật.

export const demoPurchases = [
  { id: 'p1', name: 'LEGO Classic', category: 'Đồ chơi', date: '2026-08-08', paid: 420000, reference: 490000, saved: 70000 },
  { id: 'p2', name: 'Nồi cơm điện tử mini Philips HD3170/66', category: 'Đồ gia dụng', date: '2026-08-03', paid: 850000, reference: 930000, saved: 80000 },
  { id: 'p3', name: 'Vở Hồng Hà 200 trang A4', category: 'Học tập', date: '2026-07-28', paid: 25000, reference: 30000, saved: 5000 },
  { id: 'p4', name: 'Chuột Logitech M331', category: 'Đồ điện tử', date: '2026-07-12', paid: 315000, reference: 360000, saved: 45000 },
  { id: 'p5', name: 'Kem chống nắng Anessa', category: 'Mỹ phẩm', date: '2026-06-20', paid: 480000, reference: 560000, saved: 80000 },
  { id: 'p6', name: 'Gấu bông', category: 'Đồ chơi', date: '2026-04-25', paid: 210000, reference: 250000, saved: 40000 },
  { id: 'p7', name: 'Pin dự phòng Anker', category: 'Đồ điện tử', date: '2026-01-20', paid: 690000, reference: 780000, saved: 90000 }
];

// Ngân sách tháng minh hoạ dùng cho Cawi Cố Vấn Chi Tiêu (bản demo — chưa có form
// người dùng tự khai ngân sách, ở bản chính thức sẽ lấy từ hồ sơ/cài đặt).
export const DEMO_MONTHLY_BUDGET = 1500000;

export function getPurchaseRecords() {
  const stored = JSON.parse(localStorage.getItem('cartwise-purchase-history') || 'null');
  return Array.isArray(stored) && stored.length ? stored : demoPurchases;
}

// v81 — Nút tự khai "Đã mua / Chưa mua" ở từng sản phẩm (Khối "Thành tựu tiết kiệm"
// vốn chỉ chạy bằng dữ liệu demo cố định — số "Tổng đã tiết kiệm" không bao giờ đổi
// dù người dùng thao tác gì). Cho phép người dùng TỰ khai đã mua 1 sản phẩm ngay
// trong bản demo để bộ đếm/thành tựu thực sự phản ứng lại — vẫn ghi rõ đây là tự
// khai (không xác minh được đơn hàng thật, cần liên kết tài khoản mua sắm/API đối
// tác để làm được điều đó ở bản chính thức).
function persistPurchaseRecords(records) {
  localStorage.setItem('cartwise-purchase-history', JSON.stringify(records));
}

export function isPurchaseReported(productId) {
  return getPurchaseRecords().some((item) => item.selfReported && item.productId === productId);
}

export function addSelfReportedPurchase(product, paidAmount) {
  if (!product) return null;
  const existing = getPurchaseRecords();
  if (existing.some((item) => item.selfReported && item.productId === product.id)) return null;

  const reference = Number(product.originalPrice || product.basePrice || paidAmount || 0);
  const paid = Number(paidAmount || reference || 0);
  const entry = {
    id: `self-${product.id}-${Date.now()}`,
    productId: product.id,
    name: product.name,
    category: product.category,
    date: new Date().toISOString().slice(0, 10),
    paid,
    reference,
    saved: Math.max(0, reference - paid),
    selfReported: true
  };
  persistPurchaseRecords([entry, ...existing]);
  return entry;
}

export function removeSelfReportedPurchase(productId) {
  const existing = getPurchaseRecords();
  const next = existing.filter((item) => !(item.selfReported && item.productId === productId));
  persistPurchaseRecords(next);
}

export function getPurchasesSince(days) {
  const records = getPurchaseRecords();
  if (!Number.isFinite(days)) return records;
  const since = Date.now() - days * 86400000;
  return records.filter((item) => new Date(item.date).getTime() >= since);
}

// Tổng đã tiết kiệm — nền cho Bộ đếm "Số tiền đã tiết kiệm" (Mục 4.2 báo cáo).
export function getSavingsSummary() {
  const records = getPurchaseRecords();
  const totalSaved = records.reduce((sum, item) => sum + Number(item.saved || 0), 0);
  const purchaseCount = records.length;
  const dates = records.map((item) => new Date(item.date).getTime()).sort((a, b) => a - b);
  const oldestMs = dates[0];
  const coverageDays = oldestMs ? Math.max(1, Math.round((Date.now() - oldestMs) / 86400000)) : 0;
  return { totalSaved, purchaseCount, coverageDays, records };
}

// Số ngày dữ liệu lịch sử mua hàng đã tích luỹ — Cawi Cố Vấn Chi Tiêu cần ≥30 ngày.
export function getPurchaseHistoryCoverageDays() {
  return getSavingsSummary().coverageDays;
}

// % ngân sách tháng đã dùng (tín hiệu 1 trong công thức Cố Vấn Chi Tiêu).
export function getMonthlyBudgetUsage(monthlyBudget = DEMO_MONTHLY_BUDGET) {
  const spentThisMonth = getPurchasesSince(30).reduce((sum, item) => sum + Number(item.paid || 0), 0);
  return {
    spent: spentThisMonth,
    budget: monthlyBudget,
    percent: monthlyBudget > 0 ? Math.min(999, Math.round((spentThisMonth / monthlyBudget) * 100)) : 0
  };
}

// Tần suất mua cùng danh mục trong 14-30 ngày qua (tín hiệu 2).
export function getCategoryPurchaseFrequency(category, days = 30) {
  return getPurchasesSince(days).filter((item) => item.category === category).length;
}

// Huy hiệu/mốc thành tích cho Bộ đếm tiết kiệm — mỗi mốc mở khoá theo tổng tiền tiết kiệm.
export const SAVINGS_MILESTONES = [
  { amount: 100000, label: 'Bước đầu tiết kiệm', icon: '🌱' },
  { amount: 300000, label: 'Tiết kiệm thông thái', icon: '💡' },
  { amount: 500000, label: 'Săn giá cừ khôi', icon: '🎯' },
  { amount: 1000000, label: 'Bậc thầy so sánh giá', icon: '🏆' },
  { amount: 2000000, label: 'Huyền thoại tiết kiệm', icon: '👑' }
];

// v63 — "Cawi Cố Vấn Chi Tiêu": lớp tính điểm minh bạch (không phải AI quyết định),
// cộng trọng số 3 tín hiệu — % ngân sách tháng đã dùng, tần suất mua cùng danh mục
// trong 14-30 ngày, sản phẩm có đang nằm trong Flash Sale vừa xem không. Lớp AI chỉ
// diễn giải điểm số thành câu tư vấn tự nhiên, không tự quyết định (Mục 4.2 báo cáo).
export function computeSpendingAdvice(product, monthlyBudget = DEMO_MONTHLY_BUDGET) {
  const budget = getMonthlyBudgetUsage(monthlyBudget);
  const categoryFreq = getCategoryPurchaseFrequency(product.category, 30);
  const inFlashSale = Boolean(product.flashSaleToday);

  let score = 0;
  score += Math.min(45, Math.round((budget.percent / 100) * 45));
  score += categoryFreq >= 2 ? 30 : categoryFreq === 1 ? 15 : 0;
  score += inFlashSale ? 15 : 0;

  let verdict, tone, headline;
  if (score >= 60) {
    verdict = 'Cân nhắc lại';
    tone = 'warning';
    headline = 'Có thể chưa phải thời điểm phù hợp để mua thêm.';
  } else if (score >= 30) {
    verdict = 'Có thể mua nếu cần';
    tone = 'stable';
    headline = 'Vẫn trong tầm kiểm soát, nhưng nên cân nhắc mức độ cần thiết.';
  } else {
    verdict = 'Phù hợp với ngân sách';
    tone = 'good';
    headline = 'Khoản chi này hiện không gây áp lực lên ngân sách tháng của bạn.';
  }

  const detailParts = [
    `Bạn đã dùng ${budget.percent}% ngân sách tháng này (${budget.spent.toLocaleString('vi-VN')}đ/${budget.budget.toLocaleString('vi-VN')}đ).`
  ];
  if (categoryFreq > 0) {
    detailParts.push(`Đã mua ${categoryFreq} sản phẩm cùng danh mục "${product.category}" trong 30 ngày qua.`);
  }
  if (inFlashSale) {
    detailParts.push('Sản phẩm này đang nằm trong Flash Sale — dễ mua theo cảm hứng hơn bình thường.');
  }

  return { verdict, tone, headline, score, detail: detailParts.join(' '), budget, categoryFreq, inFlashSale };
}

export function getSavingsMilestoneProgress(totalSaved) {
  const next = SAVINGS_MILESTONES.find((m) => m.amount > totalSaved) || null;
  const achieved = SAVINGS_MILESTONES.filter((m) => m.amount <= totalSaved);
  const prevAmount = achieved.length ? achieved[achieved.length - 1].amount : 0;
  const targetAmount = next ? next.amount : prevAmount;
  const progressPct = next ? Math.min(100, Math.round(((totalSaved - prevAmount) / (targetAmount - prevAmount)) * 100)) : 100;
  return { achieved, next, progressPct };
}
