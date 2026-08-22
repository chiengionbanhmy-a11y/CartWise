// v58 — Dữ liệu mẫu cho tính năng "Ghép đơn cùng bạn" (đạt ngưỡng miễn phí vận chuyển).
// Đây là dữ liệu demo: mỗi trình duyệt lưu tiến trình riêng bằng localStorage,
// mô phỏng việc mời bạn bè tham gia qua link chia sẻ (?join=<mã nhóm>).
// Ở bản chính thức, việc ghép đơn sẽ đồng bộ qua tài khoản thật (backend/API).

export const freeshipThresholds = {
  Shopee: 150000,
  Lazada: 199000,
  Tiki: 99000
};

export const seedGroupCarts = [
  {
    id: 'GC-CLASS11A3',
    code: 'CLASS11A3',
    storeName: 'Shopee',
    title: 'Nhóm 11A3 gom đơn Shopee cuối tuần',
    ownerName: 'Quân',
    createdAt: '2026-08-18T09:00:00.000Z',
    members: [
      { id: 'm1', name: 'Quân', avatar: 'Q', productId: 'notebook', productLabel: 'Vở Hồng Hà 200 trang A4 (x2 quyển)', amount: 44000, joinedAt: '2026-08-18T09:00:00.000Z' },
      { id: 'm2', name: 'Bảo Trâm', avatar: 'B', productId: 'haohao', productLabel: 'Mì Hảo Hảo tôm chua cay (1 thùng)', amount: 33000, joinedAt: '2026-08-18T10:20:00.000Z' },
      { id: 'm3', name: 'Gia Hân', avatar: 'H', productId: 'water-lavie-500', productLabel: 'Nước Lavie 500ml (1 lốc 6 chai)', amount: 42000, joinedAt: '2026-08-18T14:05:00.000Z' }
    ]
  },
  {
    id: 'GC-BEAUTYLAZ',
    code: 'BEAUTYLAZ',
    storeName: 'Lazada',
    title: 'Ghép đơn mỹ phẩm — Lazada',
    ownerName: 'Lan',
    createdAt: '2026-08-17T08:00:00.000Z',
    members: [
      { id: 'm1', name: 'Lan', avatar: 'L', productId: 'lipstick', productLabel: 'Son Dior Addict Lip Glow 3.2g', amount: 129000, joinedAt: '2026-08-17T08:00:00.000Z' },
      { id: 'm2', name: 'Yến Nhi', avatar: 'Y', productId: 'sunscreen', productLabel: 'Kem chống nắng Anessa (size mini)', amount: 49000, joinedAt: '2026-08-17T15:40:00.000Z' }
    ]
  },
  {
    id: 'GC-GIFTTIKI',
    code: 'GIFTTIKI',
    storeName: 'Tiki',
    title: 'Gom quà tặng cuối tuần — Tiki',
    ownerName: 'Đức',
    createdAt: '2026-08-19T07:30:00.000Z',
    members: [
      { id: 'm1', name: 'Đức', avatar: 'Đ', productId: 'notebook', productLabel: 'Vở Hồng Hà 200 trang A4', amount: 22000, joinedAt: '2026-08-19T07:30:00.000Z' },
      { id: 'm2', name: 'Minh Thư', avatar: 'T', productId: 'haohao', productLabel: 'Mì Hảo Hảo tôm chua cay (1 thùng)', amount: 33000, joinedAt: '2026-08-19T11:15:00.000Z' }
    ]
  }
];

export function computeGroupStats(group) {
  const threshold = freeshipThresholds[group.storeName] || 150000;
  const total = (group.members || []).reduce((sum, m) => sum + Number(m.amount || 0), 0);
  const remaining = Math.max(0, threshold - total);
  const progressPct = Math.min(100, Math.round((total / Math.max(1, threshold)) * 100));
  const isComplete = total >= threshold;
  return { threshold, total, remaining, progressPct, isComplete };
}

const joinerNames = ['Huy', 'Vy', 'Nam', 'Chi', 'Khang', 'An', 'Phúc', 'My', 'Kiên', 'Linh'];

const joinerPicks = [
  { productId: 'notebook', productLabel: 'Vở Hồng Hà 200 trang A4', amount: 22000 },
  { productId: 'haohao', productLabel: 'Mì Hảo Hảo tôm chua cay (1 gói lẻ)', amount: 5500 },
  { productId: 'water-lavie-500', productLabel: 'Nước Lavie 500ml (1 chai)', amount: 7000 },
  { productId: 'casio', productLabel: 'Máy tính Casio học sinh', amount: 459000 },
  { productId: 'teddy-bear', productLabel: 'Gấu bông mini', amount: 99000 }
];

export function generateMockJoiner() {
  const name = joinerNames[Math.floor(Math.random() * joinerNames.length)];
  const pick = joinerPicks[Math.floor(Math.random() * joinerPicks.length)];
  return {
    id: `join-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    avatar: name.charAt(0),
    productId: pick.productId,
    productLabel: pick.productLabel,
    amount: pick.amount,
    joinedAt: new Date().toISOString()
  };
}

export function generateGroupCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
