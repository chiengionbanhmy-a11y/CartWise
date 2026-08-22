export const PLAN_LEVELS = {
  free: 0,
  student: 1,
  plus: 2
};

export const PLAN_DETAILS = {
  free: {
    id: 'free',
    name: 'Miễn phí',
    price: '0đ',
    priceLabel: 'Miễn phí',
    priceHistoryDays: [7, 30],
    purchaseAnalyticsDays: 7,
    adFree: false,
    features: ['So sánh tổng chi phí dự kiến', 'Flash Sale', 'Điểm bán', 'Lịch sử kiểm tra giá cơ bản'],
    // v63 — 6 tính năng mới bổ sung Vòng 4, gắn vào 3 gói hiện có (Mục 3 báo cáo cải tiến)
    buySignal: { enabled: false },
    spendingAdvisor: { enabled: false },
    savingsCounter: { variant: 'simple', maxBadges: 0 },
    groupFund: { monthlyCap: 2, qr: true }
  },
  student: {
    id: 'student',
    name: 'CartWise Plus Student',
    price: '19.000đ/tháng',
    priceHistoryDays: [7, 30, 90, 180],
    purchaseAnalyticsDays: 30,
    adFree: false,
    features: ['Lịch sử kiểm tra giá dài hơn', 'Cảnh báo giảm giá', 'Ưu tiên tính năng mới'],
    buySignal: { enabled: false },
    spendingAdvisor: { enabled: false },
    savingsCounter: { variant: 'prominent', maxBadges: 2 },
    groupFund: { monthlyCap: null, qr: true }
  },
  plus: {
    id: 'plus',
    name: 'CartWise Plus',
    price: '49.000đ/tháng',
    priceHistoryDays: [7, 30, 90, 180],
    purchaseAnalyticsDays: 365,
    adFree: true,
    features: ['Lịch sử nâng cao', 'Cảnh báo thông minh', 'Thống kê mua sắm', 'Không quảng cáo'],
    buySignal: { enabled: true },
    spendingAdvisor: { enabled: true, minHistoryDays: 30 },
    savingsCounter: { variant: 'prominent', maxBadges: Infinity },
    groupFund: { monthlyCap: null, qr: true }
  }
};

export function getPlan(id) {
  return PLAN_DETAILS[id] || PLAN_DETAILS.free;
}
