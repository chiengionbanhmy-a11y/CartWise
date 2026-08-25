export const PLAN_LEVELS = {
  free: 0,
  student: 1,
  plus: 2
};

// v80 — Theo yêu cầu, chỉnh lại đúng các mốc "Lịch sử kiểm tra giá" mở theo từng
// gói: Free chỉ còn 7 ngày (bỏ mốc 30 ngày cũ); Plus Student mở tới 1 tháng (30
// ngày); CartWise Plus mở cả 2 mốc 6 tháng (180 ngày) VÀ 1 năm (365 ngày) — bỏ
// hẳn mốc 90 ngày cũ, thêm mới mốc 365 ngày (1 năm). Danh sách vẫn theo kiểu cộng
// dồn (gói cao hơn luôn có đủ các mốc của gói thấp hơn + mốc riêng của mình) —
// xem đúng 4 mốc lọc [7, 30, 180, 365] tương ứng trong `CheckHistory.jsx`.
export const PLAN_DETAILS = {
  free: {
    id: 'free',
    name: 'Miễn phí',
    price: '0đ',
    priceLabel: 'Miễn phí',
    priceHistoryDays: [7],
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
    priceHistoryDays: [7, 30],
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
    priceHistoryDays: [7, 30, 180, 365],
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
