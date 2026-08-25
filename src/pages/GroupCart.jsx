import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Users, Truck, Copy, Check, PlusCircle, PartyPopper, X, Globe, Lock, UserCheck, Wallet,
  QrCode, CheckCircle2, Crown, Pencil, Eye, Minus, Plus, Trash2, RotateCcw, ShieldAlert
} from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { seedGroupCarts, computeGroupStats, freeshipThresholds, generateMockJoiner, generateGroupCode } from '../data/groupCarts.js';
import { getPlan } from '../data/plans.js';
import PaymentQr from '../components/PaymentQr.jsx';
import { fetchVietQrBanks, FALLBACK_BANKS } from '../utils/vietqr.js';

const EXTRA_KEY = 'cartwise-group-extra-members';
const CUSTOM_KEY = 'cartwise-group-custom';
const SETTLEMENT_KEY = 'cartwise-group-settlements'; // v64 — Ghép Đơn Cùng Bạn Bè: chia tiền + trạng thái đã/chưa thanh toán
const MEMBER_OVERRIDES_KEY = 'cartwise-group-member-overrides'; // v67 — nhóm đã qua chỉnh sửa (thêm/xoá/đổi số lượng sản phẩm)
const SAVED_ACCOUNT_KEY = 'cartwise-saved-bank-account'; // v67 — tài khoản nhận tiền đã lưu để dùng lại lần sau
const LASTNAME_KEY = 'cartwise-group-lastname';

function loadExtraMembers() {
  return JSON.parse(localStorage.getItem(EXTRA_KEY) || '{}');
}
function saveExtraMembers(map) {
  localStorage.setItem(EXTRA_KEY, JSON.stringify(map));
}
function loadCustomGroups() {
  return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
}
function saveCustomGroups(list) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
}
function loadSettlements() {
  return JSON.parse(localStorage.getItem(SETTLEMENT_KEY) || '{}');
}
function saveSettlements(map) {
  localStorage.setItem(SETTLEMENT_KEY, JSON.stringify(map));
}
function loadMemberOverrides() {
  return JSON.parse(localStorage.getItem(MEMBER_OVERRIDES_KEY) || '{}');
}
function saveMemberOverrides(map) {
  localStorage.setItem(MEMBER_OVERRIDES_KEY, JSON.stringify(map));
}
function loadSavedAccount() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_ACCOUNT_KEY) || 'null');
  } catch {
    return null;
  }
}
function saveSavedAccount(value) {
  localStorage.setItem(SAVED_ACCOUNT_KEY, JSON.stringify(value));
}
function clearSavedAccount() {
  localStorage.removeItem(SAVED_ACCOUNT_KEY);
}
function loadViewHistory() {
  try {
    return JSON.parse(localStorage.getItem('cartwise-price-check-history') || '[]');
  } catch {
    return [];
  }
}

function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

const visibilityOptions = [
  { value: 'public', label: 'Công khai', hint: 'Ai vào trang này cũng thấy giỏ chung của bạn', icon: Globe },
  { value: 'private', label: 'Riêng tư', hint: 'Chỉ mình bạn thấy trong danh sách, không hiện công khai', icon: Lock },
  { value: 'friends', label: 'Bạn bè được chia sẻ', hint: 'Ẩn khỏi danh sách chung, chỉ ai có link mời mới vào được', icon: UserCheck }
];

function getVisibilityMeta(value) {
  return visibilityOptions.find((item) => item.value === value) || visibilityOptions[0];
}

// v67 — Ô chọn sản phẩm dạng tìm kiếm: gõ tên để lọc nhanh, hoặc để trống và bấm
// vào ô để xem gợi ý "Đã xem gần đây" / "Gợi ý cho bạn" (dựa theo lịch sử xem sản
// phẩm đã lưu sẵn của CartWise — cùng nguồn dữ liệu với "Lịch sử kiểm tra giá").
function ProductPicker({ products, recentlyViewed, suggested, value, onChange, placeholder }) {
  const [query, setQuery] = useState(value?.name || '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(value?.name || '');
  }, [value?.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [products, query]);

  function pick(product) {
    onChange(product);
    setQuery(product.name);
    setOpen(false);
  }

  return (
    <div className="groupcart-product-picker-v67">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onBlur={() => window.setTimeout(() => setOpen(false), 160)}
      />
      {open && (
        <div className="groupcart-product-suggest-v67">
          {filtered ? (
            filtered.length ? filtered.map((p) => (
              <button type="button" key={p.id} onMouseDown={() => pick(p)}>{p.name}</button>
            )) : <span className="groupcart-product-suggest-empty-v67">Không tìm thấy sản phẩm phù hợp — thử từ khoá khác nhé.</span>
          ) : (
            <>
              {recentlyViewed.length > 0 && (
                <div className="groupcart-product-suggest-group-v67">
                  <small>Đã xem gần đây</small>
                  {recentlyViewed.map((p) => <button type="button" key={p.id} onMouseDown={() => pick(p)}>{p.name}</button>)}
                </div>
              )}
              {suggested.length > 0 && (
                <div className="groupcart-product-suggest-group-v67">
                  <small>Gợi ý cho bạn</small>
                  {suggested.map((p) => <button type="button" key={p.id} onMouseDown={() => pick(p)}>{p.name}</button>)}
                </div>
              )}
              {!recentlyViewed.length && !suggested.length && (
                <span className="groupcart-product-suggest-empty-v67">Gõ tên sản phẩm để tìm kiếm.</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GroupCart({ appState, onBack, onOpenProduct, onOpenUpgrade }) {
  const { products, currency, planId } = appState;
  const plan = getPlan(planId);
  const [extraMembers, setExtraMembers] = useState(loadExtraMembers);
  const [customGroups, setCustomGroups] = useState(loadCustomGroups);
  const [memberOverrides, setMemberOverrides] = useState(loadMemberOverrides);
  const [joinBanner, setJoinBanner] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: '', storeName: 'Shopee', productId: products[0]?.id || '', quantity: 1, yourName: '', visibility: 'public' });
  const [settlements, setSettlements] = useState(loadSettlements);
  const [settleOpenId, setSettleOpenId] = useState(null);
  const [settleBankDraft, setSettleBankDraft] = useState({ bankQuery: '', bank: null, accountNo: '', accountName: '', remember: false });
  const [banks, setBanks] = useState(FALLBACK_BANKS);
  const [hasSavedAccount, setHasSavedAccount] = useState(() => Boolean(loadSavedAccount()));
  // v79 — Mã QR thanh toán giờ hiện qua 1 popup toàn màn hình dùng chung (thay vì
  // hiện nhỏ/thu gọn ngay trong khung nhóm) — bấm "Xem mã QR" ở chế độ chia đều hay
  // ai góp nấy trả đều mở đúng popup này, chỉ khác dữ liệu truyền vào.
  const [qrModal, setQrModal] = useState(null);
  // v67 — màn hình phóng to xem chi tiết / chỉnh sửa 1 nhóm (thay cho hiện mọi thứ
  // ngay trên thẻ nhóm thu gọn). mode: 'view' (xem nhóm + chốt nhóm/QR) hoặc
  // 'edit' (thêm/xoá/đổi số lượng sản phẩm, chủ nhóm mới được xoá thành viên).
  const [detailView, setDetailView] = useState(null);
  const [addProductForm, setAddProductForm] = useState({ name: '', productId: '', quantity: 1 });

  const viewHistory = useMemo(loadViewHistory, []);
  const recentlyViewedProducts = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const entry of viewHistory) {
      if (seen.has(entry.productId)) continue;
      const product = products.find((p) => p.id === entry.productId);
      if (!product) continue;
      seen.add(entry.productId);
      list.push(product);
      if (list.length >= 5) break;
    }
    return list;
  }, [viewHistory, products]);
  const suggestedProducts = useMemo(() => {
    const recentIds = new Set(recentlyViewedProducts.map((p) => p.id));
    const categoryCounts = {};
    viewHistory.forEach((entry) => { if (entry.category) categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1; });
    const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([c]) => c);
    if (!topCategories.length) return [];
    const picks = [];
    for (const cat of topCategories) {
      for (const p of products) {
        if (recentIds.has(p.id) || picks.some((x) => x.id === p.id)) continue;
        if (p.category === cat) picks.push(p);
        if (picks.length >= 5) break;
      }
      if (picks.length >= 5) break;
    }
    return picks;
  }, [viewHistory, products, recentlyViewedProducts]);

  // Tải danh sách ngân hàng hỗ trợ VietQR (công khai, không cần API key).
  // Lỗi mạng thì fetchVietQrBanks tự rơi về FALLBACK_BANKS, không cần xử lý ở đây.
  useEffect(() => {
    let cancelled = false;
    fetchVietQrBanks().then((list) => {
      if (!cancelled && list?.length) setBanks(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleSettleOpen(group) {
    const opening = settleOpenId !== group.id;
    setSettleOpenId(opening ? group.id : null);
    if (opening) {
      const saved = loadSavedAccount();
      if (saved?.bank) {
        setSettleBankDraft({ bankQuery: saved.bankQuery || '', bank: saved.bank, accountNo: saved.accountNo || '', accountName: saved.accountName || group.ownerName || '', remember: true });
      } else {
        setSettleBankDraft({ bankQuery: '', bank: null, accountNo: '', accountName: group.ownerName || '', remember: false });
      }
    }
  }

  function resetSettlement(groupId) {
    setSettlements((prev) => {
      const next = { ...prev };
      delete next[groupId];
      saveSettlements(next);
      return next;
    });
  }

  function requestRedoSettlement(groupId) {
    if (!window.confirm('Đổi lại cách chia tiền sẽ xoá trạng thái đã/chưa thanh toán hiện tại của nhóm và cần chốt nhóm lại từ đầu. Bạn có chắc chắn muốn đổi lại không?')) return;
    resetSettlement(groupId);
  }

  const groupsCreatedThisMonth = useMemo(
    () => customGroups.filter((g) => monthKey(new Date(g.createdAt)) === monthKey()).length,
    [customGroups]
  );
  const monthlyCapReached = plan.groupFund.monthlyCap != null && groupsCreatedThisMonth >= plan.groupFund.monthlyCap;

  function updateSettlement(groupId, next) {
    setSettlements((prev) => {
      const merged = { ...prev, [groupId]: next };
      saveSettlements(merged);
      return merged;
    });
  }

  const accountNoValid = /^\d{6,19}$/.test(settleBankDraft.accountNo);

  function canStartSettlement() {
    return Boolean(settleBankDraft.bank && accountNoValid && settleBankDraft.accountName.trim());
  }

  function startSettlement(group, mode) {
    if (!canStartSettlement()) return;
    const total = group.members.reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const n = Math.max(1, group.members.length);
    const base = Math.floor(total / n);
    const remainder = total - base * n; // dồn phần dư (nếu có) vào người cuối để tổng luôn khớp
    const requests = group.members.map((m, index) => ({
      memberId: m.id,
      name: m.name,
      amount: mode === 'even' ? base + (index === n - 1 ? remainder : 0) : Number(m.amount || 0),
      paid: false
    }));
    updateSettlement(group.id, {
      mode,
      requests,
      bank: settleBankDraft.bank,
      accountNo: settleBankDraft.accountNo,
      accountName: settleBankDraft.accountName.trim(),
      createdAt: new Date().toISOString()
    });
    if (settleBankDraft.remember && settleBankDraft.bank) {
      saveSavedAccount({ bank: settleBankDraft.bank, bankQuery: settleBankDraft.bankQuery, accountNo: settleBankDraft.accountNo, accountName: settleBankDraft.accountName.trim() });
      setHasSavedAccount(true);
    }
  }

  function togglePaid(groupId, memberId) {
    setSettlements((prev) => {
      const current = prev[groupId];
      if (!current) return prev;
      const nextRequests = current.requests.map((r) => (r.memberId === memberId ? { ...r, paid: !r.paid } : r));
      const merged = { ...prev, [groupId]: { ...current, requests: nextRequests } };
      saveSettlements(merged);
      return merged;
    });
  }

  const allGroups = useMemo(() => {
    const base = [...seedGroupCarts, ...customGroups];
    return base.map((group) => {
      const overrideMembers = memberOverrides[group.id];
      const rawMembers = overrideMembers || [...group.members, ...(extraMembers[group.id] || [])];
      return {
        ...group,
        visibility: group.visibility || 'public',
        members: rawMembers.map((m) => ({ ...m, quantity: m.quantity || 1 }))
      };
    });
  }, [customGroups, extraMembers, memberOverrides]);

  const publicGroups = useMemo(() => allGroups.filter((group) => group.visibility === 'public'), [allGroups]);
  const myOtherGroups = useMemo(
    () => allGroups.filter((group) => group.visibility !== 'public' && customGroups.some((c) => c.id === group.id)),
    [allGroups, customGroups]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');

    if (joinCode) {
      const target = allGroups.find((g) => g.code === joinCode);
      if (target) {
        const joiner = generateMockJoiner();
        const current = loadExtraMembers();
        const nextExtra = { ...current, [target.id]: [...(current[target.id] || []), joiner] };
        saveExtraMembers(nextExtra);
        setExtraMembers(nextExtra);
        setJoinBanner({ groupTitle: target.title, joinerName: joiner.name });
      }

      const url = new URL(window.location.href);
      url.searchParams.delete('join');
      window.history.replaceState({}, '', url.toString());
    }
    // Chỉ chạy 1 lần khi mở trang (kể cả qua link mời) — không phụ thuộc allGroups để tránh lặp.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function copyInviteLink(group) {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('join', group.code);
    const link = url.toString();

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        setCopiedId(group.id);
        window.setTimeout(() => setCopiedId(null), 2200);
      }).catch(() => {
        window.prompt('Sao chép link mời bạn bè:', link);
      });
    } else {
      window.prompt('Sao chép link mời bạn bè:', link);
    }
  }

  function submitCreateGroup() {
    if (monthlyCapReached) {
      alert(`Gói Free chỉ tạo tối đa ${plan.groupFund.monthlyCap} nhóm/tháng. Nâng cấp để tạo không giới hạn số nhóm.`);
      return;
    }
    const product = products.find((p) => p.id === form.productId);
    if (!product || !form.title.trim()) {
      alert('Bạn hãy nhập tên nhóm và chọn một sản phẩm trước khi tạo giỏ chung.');
      return;
    }
    const ownerName = form.yourName.trim() || 'Bạn';
    const quantity = Math.max(1, Math.round(Number(form.quantity) || 1));
    const newGroup = {
      id: `GC-CUSTOM-${Date.now()}`,
      code: generateGroupCode(),
      storeName: form.storeName,
      title: form.title.trim(),
      ownerName,
      visibility: form.visibility,
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 'owner',
          name: ownerName,
          avatar: ownerName.charAt(0).toUpperCase(),
          productId: product.id,
          productLabel: product.name,
          quantity,
          amount: Math.round(Number(product.basePrice || 0)) * quantity,
          joinedAt: new Date().toISOString()
        }
      ]
    };
    const next = [newGroup, ...customGroups];
    setCustomGroups(next);
    saveCustomGroups(next);
    setCreateOpen(false);
    setForm({ title: '', storeName: 'Shopee', productId: products[0]?.id || '', quantity: 1, yourName: '', visibility: 'public' });
    localStorage.setItem(LASTNAME_KEY, ownerName);
  }

  // ---- v67 — chỉnh sửa sản phẩm/số lượng trong nhóm (mở từ nút "Chỉnh sửa") ----
  function commitMemberEdit(group, nextMembers) {
    setMemberOverrides((prev) => {
      const merged = { ...prev, [group.id]: nextMembers };
      saveMemberOverrides(merged);
      return merged;
    });
  }

  function changeQuantity(group, memberId, delta) {
    const nextMembers = group.members.map((m) => {
      if (m.id !== memberId) return m;
      const nextQty = Math.max(1, (m.quantity || 1) + delta);
      const product = products.find((p) => p.id === m.productId);
      const unit = product ? Math.round(Number(product.basePrice || 0)) : Math.round(Number(m.amount || 0) / Math.max(1, m.quantity || 1));
      return { ...m, quantity: nextQty, amount: unit * nextQty };
    });
    commitMemberEdit(group, nextMembers);
  }

  function removeGroupMember(group, memberId, memberName) {
    if (group.members.length <= 1) {
      alert('Nhóm cần ít nhất 1 thành viên — không thể xoá người cuối cùng.');
      return;
    }
    if (!window.confirm(`Xoá "${memberName}" khỏi nhóm này? Không thể hoàn tác.`)) return;
    commitMemberEdit(group, group.members.filter((m) => m.id !== memberId));
  }

  function submitAddProduct(group) {
    const product = products.find((p) => p.id === addProductForm.productId);
    const name = addProductForm.name.trim();
    if (!name || !product) {
      alert('Nhập tên hiển thị và chọn một sản phẩm trước khi thêm.');
      return;
    }
    const quantity = Math.max(1, Math.round(Number(addProductForm.quantity) || 1));
    const unit = Math.round(Number(product.basePrice || 0));
    const entry = {
      id: `edit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      avatar: name.charAt(0).toUpperCase(),
      productId: product.id,
      productLabel: product.name,
      quantity,
      amount: unit * quantity,
      joinedAt: new Date().toISOString()
    };
    commitMemberEdit(group, [...group.members, entry]);
    localStorage.setItem(LASTNAME_KEY, name);
    setAddProductForm({ name, productId: '', quantity: 1 });
  }

  function openDetail(group, mode) {
    setDetailView({ groupId: group.id, mode });
    setAddProductForm({ name: localStorage.getItem(LASTNAME_KEY) || '', productId: '', quantity: 1 });
  }

  const activeDetailGroup = detailView ? allGroups.find((g) => g.id === detailView.groupId) : null;

  return (
    <section className="standalone-page-v45 groupcart-page-v58">
      <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

      <div className="standalone-hero-v45">
        <span className="eyebrow"><Users size={15} /> Ghép Đơn Cùng Bạn Bè</span>
        <h1>Ghép đơn cùng bạn bè và chia tiền rõ ràng</h1>
        <p>Rủ bạn bè cùng góp đơn vào một nơi bán để cả nhóm đạt ngưỡng freeship, rồi chốt số tiền mỗi người cần trả — chia đều hoặc ai góp nấy trả, có yêu cầu thanh toán QR và bảng theo dõi ai đã trả, ai chưa.</p>
      </div>

      <div className="history-definition-card-v50 groupcart-explain-v58">
        <Truck size={18} />
        <div>
          <strong>Đây là tính năng demo</strong>
          <span>
            Ngưỡng miễn phí vận chuyển bên dưới là số liệu tham khảo cho bản demo. Tiến trình nhóm lưu trên trình duyệt của bạn (localStorage); mở link mời trên trình duyệt/thiết bị khác sẽ mô phỏng một người bạn vừa tham gia.
          </span>
        </div>
      </div>

      {plan.groupFund.monthlyCap != null && (
        <div className={monthlyCapReached ? 'groupcart-free-limit-banner-v67 full' : 'groupcart-free-limit-banner-v67'}>
          <Crown size={19} />
          <span>Gói Free: đã tạo <b>{groupsCreatedThisMonth}/{plan.groupFund.monthlyCap}</b> nhóm trong tháng này{monthlyCapReached ? ' — đã đạt giới hạn' : ''}.</span>
        </div>
      )}

      {monthlyCapReached && (
        <div className="history-locked-page-v48 groupcart-cap-locked-v63">
          <div><span><Crown size={18} /> Đã đạt giới hạn nhóm/tháng</span><h2>Nâng cấp để tạo không giới hạn số nhóm</h2><p>Gói Free chỉ tạo tối đa {plan.groupFund.monthlyCap} nhóm/tháng. CartWise Plus Student trở lên: không giới hạn số nhóm + QR yêu cầu thanh toán.</p></div>
          <button className="primary" onClick={onOpenUpgrade}>Xem gói nâng cấp</button>
        </div>
      )}

      {joinBanner && (
        <div className="groupcart-join-banner-v58">
          <PartyPopper size={18} />
          <span><b>{joinBanner.joinerName}</b> vừa tham gia "{joinBanner.groupTitle}" qua link mời của bạn!</span>
          <button type="button" onClick={() => setJoinBanner(null)} aria-label="Đóng thông báo"><X size={16} /></button>
        </div>
      )}

      <div className="groupcart-toolbar-v58">
        <span>{allGroups.length} giỏ chung đang hoạt động</span>
        <button className="primary small" onClick={() => setCreateOpen((open) => !open)}>
          <PlusCircle size={16} /> {createOpen ? 'Đóng' : 'Tạo giỏ chung mới'}
        </button>
      </div>

      {createOpen && (
        <div className="groupcart-create-card-v58">
          <label>
            <span>Tên nhóm</span>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ví dụ: Nhóm lớp 12B ghép đơn Shopee" />
          </label>
          <div className="groupcart-create-row-v58">
            <label>
              <span>Sàn</span>
              <select value={form.storeName} onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}>
                {Object.keys(freeshipThresholds).map((store) => (
                  <option key={store} value={store}>{store} — freeship từ {formatCurrency(freeshipThresholds[store], currency)}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Sản phẩm bạn muốn góp</span>
              <ProductPicker
                products={products}
                recentlyViewed={recentlyViewedProducts}
                suggested={suggestedProducts}
                value={products.find((p) => p.id === form.productId) || null}
                onChange={(p) => setForm((f) => ({ ...f, productId: p.id }))}
                placeholder="Gõ tên sản phẩm để tìm..."
              />
            </label>
          </div>
          <div className="groupcart-create-row-v58">
            <label>
              <span>Số lượng</span>
              <input
                type="number" min="1" step="1"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: Math.max(1, Math.round(Number(e.target.value) || 1)) }))}
              />
            </label>
            <label>
              <span>Tên hiển thị của bạn</span>
              <input value={form.yourName} onChange={(e) => setForm((f) => ({ ...f, yourName: e.target.value }))} placeholder="Ví dụ: Quân" />
            </label>
          </div>

          <div className="groupcart-visibility-field-v58">
            <span>Chế độ hiển thị giỏ chung</span>
            <div className="groupcart-visibility-options-v58">
              {visibilityOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    type="button"
                    key={option.value}
                    className={form.visibility === option.value ? 'groupcart-visibility-choice-v58 active' : 'groupcart-visibility-choice-v58'}
                    onClick={() => setForm((f) => ({ ...f, visibility: option.value }))}
                  >
                    <Icon size={16} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
            <small>{getVisibilityMeta(form.visibility).hint}</small>
          </div>

          <button className="primary full" onClick={submitCreateGroup}>Tạo giỏ chung</button>
        </div>
      )}

      <div className="groupcart-grid-v58">
        {publicGroups.map((group) => renderGroupCard(group))}
      </div>

      {myOtherGroups.length > 0 && (
        <div className="groupcart-private-section-v58">
          <div className="groupcart-toolbar-v58">
            <span><Lock size={15} /> Giỏ chung riêng tư / chia sẻ với bạn bè của bạn</span>
          </div>
          <div className="groupcart-grid-v58">
            {myOtherGroups.map((group) => renderGroupCard(group))}
          </div>
        </div>
      )}

      {activeDetailGroup && renderGroupDetail(activeDetailGroup, detailView.mode)}

      {/* v79 — Popup toàn màn hình cho mã QR thanh toán, đặt ở gốc component để luôn
          hiện đè lên trên cả khung xem chi tiết nhóm (z-index cao hơn). */}
      {qrModal && (
        <div className="groupcart-qr-popup-backdrop-v79" role="dialog" aria-modal="true" aria-label="Mã QR thanh toán" onClick={() => setQrModal(null)}>
          <div className="groupcart-qr-popup-panel-v79" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="groupcart-qr-popup-close-v79" onClick={() => setQrModal(null)} aria-label="Đóng mã QR">
              <X size={20} />
            </button>
            <PaymentQr {...qrModal} />
          </div>
        </div>
      )}
    </section>
  );

  function renderGroupCard(group) {
    const stats = computeGroupStats(group);
    const visibilityMeta = getVisibilityMeta(group.visibility);
    const VisibilityIcon = visibilityMeta.icon;
    return (
      <article key={group.id} className={stats.isComplete ? 'groupcart-card-v58 complete' : 'groupcart-card-v58'}>
        <div className="groupcart-card-head-v58">
          <div className="groupcart-tags-row-v58">
            <span className="groupcart-store-tag-v58">{group.storeName}</span>
            <span className={`groupcart-visibility-tag-v58 ${group.visibility}`}><VisibilityIcon size={12} /> {visibilityMeta.label}</span>
          </div>
          <h3>{group.title}</h3>
          <span className="groupcart-owner-v58">Tạo bởi {group.ownerName}</span>
        </div>

        <div className="groupcart-progress-wrap-v58">
          <div className="groupcart-progress-bar-v58">
            <div className="groupcart-progress-fill-v58" style={{ width: `${stats.progressPct}%` }} />
          </div>
          <div className="groupcart-progress-labels-v58">
            <b>{formatCurrency(stats.total, currency)}</b>
            <span>/ {formatCurrency(stats.threshold, currency)} để freeship</span>
          </div>
        </div>

        {stats.isComplete ? (
          <div className="groupcart-status-v58 done">🎉 Đã đủ điều kiện miễn phí vận chuyển!</div>
        ) : (
          <div className="groupcart-status-v58">Còn thiếu <b>{formatCurrency(stats.remaining, currency)}</b> để cả nhóm được freeship</div>
        )}

        <div className="groupcart-members-v58">
          {group.members.map((member) => {
            const product = products.find((p) => p.id === member.productId);
            return (
              <button
                type="button"
                key={member.id}
                className="groupcart-member-row-v58"
                onClick={() => product && onOpenProduct?.(product)}
                disabled={!product}
              >
                <span className="groupcart-avatar-v58">{member.avatar}</span>
                <span className="groupcart-member-info-v58">
                  <b>{member.name}</b>
                  <small>{member.productLabel}{member.quantity > 1 ? ` × ${member.quantity}` : ''}</small>
                </span>
                <span className="groupcart-member-amount-v58">{formatCurrency(member.amount, currency)}</span>
              </button>
            );
          })}
        </div>

        <div className="groupcart-card-actions-v67">
          <button className="secondary groupcart-view-btn-v67" type="button" onClick={() => openDetail(group, 'view')}>
            <Eye size={16} /> Xem nhóm
          </button>
          <button className="secondary groupcart-edit-btn-v67" type="button" onClick={() => openDetail(group, 'edit')}>
            <Pencil size={16} /> Chỉnh sửa
          </button>
        </div>

        <button className="secondary full groupcart-invite-btn-v58" type="button" onClick={() => copyInviteLink(group)}>
          {copiedId === group.id ? <><Check size={16} /> Đã sao chép link!</> : <><Copy size={16} /> Mời bạn bè tham gia</>}
        </button>
      </article>
    );
  }

  // v67 — Màn hình phóng to xem chi tiết/chỉnh sửa 1 nhóm.
  // v72 — Đổi từ "chuyển hẳn sang trang mới" (return sớm thay cả cây JSX) sang dạng
  // MODAL phóng to ngay trên danh sách hiện tại: nhóm được chọn hiện to hơn hẳn, đè
  // lên trên với lớp nền mờ/tối phía sau (giống các popup khác trong app — CartPanel,
  // ProductModal), bấm ra ngoài hoặc nút đóng để quay lại mà không "chuyển trang".
  // mode "view": xem đầy đủ danh sách + phần chốt nhóm/QR. mode "edit": quản lý sản
  // phẩm/số lượng — ai cũng chỉnh được số lượng hoặc thêm sản phẩm mới, nhưng chỉ chủ
  // nhóm (nhóm do chính trình duyệt này tạo) mới được xoá hẳn 1 thành viên.
  function renderGroupDetail(group, mode) {
    const stats = computeGroupStats(group);
    const isOwner = customGroups.some((g) => g.id === group.id);

    return (
      <div className="groupcart-detail-backdrop-v72" role="dialog" aria-modal="true" aria-label={group.title} onClick={() => setDetailView(null)}>
        <section className="groupcart-detail-panel-v72" onClick={(event) => event.stopPropagation()}>
          <button type="button" className="groupcart-detail-close-v72" onClick={() => setDetailView(null)} aria-label="Đóng">
            <X size={18} />
          </button>

          <div className="groupcart-detail-head-v67">
            <div>
              <span className="groupcart-store-tag-v58">{group.storeName}</span>
              <h1>{group.title}</h1>
              <span className="groupcart-owner-v58">Tạo bởi {group.ownerName}{isOwner ? ' · Bạn là chủ nhóm này' : ''}</span>
            </div>
            <div className="groupcart-detail-tabs-v67">
              <button type="button" className={mode === 'view' ? 'active' : ''} onClick={() => setDetailView({ groupId: group.id, mode: 'view' })}><Eye size={15} /> Xem nhóm</button>
              <button type="button" className={mode === 'edit' ? 'active' : ''} onClick={() => setDetailView({ groupId: group.id, mode: 'edit' })}><Pencil size={15} /> Chỉnh sửa</button>
            </div>
          </div>

          <div className="groupcart-progress-wrap-v58 groupcart-detail-progress-v67">
          <div className="groupcart-progress-bar-v58">
            <div className="groupcart-progress-fill-v58" style={{ width: `${stats.progressPct}%` }} />
          </div>
          <div className="groupcart-progress-labels-v58">
            <b>{formatCurrency(stats.total, currency)}</b>
            <span>/ {formatCurrency(stats.threshold, currency)} để freeship</span>
          </div>
        </div>

        {mode === 'view' ? (
          <>
            <div className="groupcart-members-v58 groupcart-detail-members-v67">
              {group.members.map((member) => {
                const product = products.find((p) => p.id === member.productId);
                return (
                  <button
                    type="button"
                    key={member.id}
                    className="groupcart-member-row-v58"
                    onClick={() => product && onOpenProduct?.(product)}
                    disabled={!product}
                  >
                    <span className="groupcart-avatar-v58">{member.avatar}</span>
                    <span className="groupcart-member-info-v58">
                      <b>{member.name}</b>
                      <small>{member.productLabel}{member.quantity > 1 ? ` × ${member.quantity}` : ''}</small>
                    </span>
                    <span className="groupcart-member-amount-v58">{formatCurrency(member.amount, currency)}</span>
                  </button>
                );
              })}
            </div>

            <button className="secondary full groupcart-invite-btn-v58" type="button" onClick={() => copyInviteLink(group)}>
              {copiedId === group.id ? <><Check size={16} /> Đã sao chép link!</> : <><Copy size={16} /> Mời bạn bè tham gia</>}
            </button>

            {renderSettlement(group)}
          </>
        ) : (
          <div className="groupcart-edit-panel-v67">
            <p className="groupcart-edit-hint-v67">
              Mọi thành viên đều có thể đổi số lượng hoặc thêm sản phẩm mới vào nhóm này.{' '}
              {isOwner ? 'Vì bạn là chủ nhóm, bạn có thể xoá hẳn 1 thành viên khỏi nhóm.' : 'Chỉ chủ nhóm mới có thể xoá hẳn 1 thành viên khỏi nhóm.'}
            </p>

            <div className="groupcart-edit-list-v67">
              {group.members.map((member) => {
                const product = products.find((p) => p.id === member.productId);
                return (
                  <div key={member.id} className="groupcart-edit-row-v67">
                    <span className="groupcart-avatar-v58">{member.avatar}</span>
                    <span className="groupcart-edit-row-info-v67">
                      <b>{member.name}</b>
                      <small>{member.productLabel}</small>
                    </span>
                    <div className="groupcart-qty-stepper-v67">
                      <button type="button" onClick={() => changeQuantity(group, member.id, -1)} disabled={member.quantity <= 1} aria-label="Giảm số lượng"><Minus size={14} /></button>
                      <span>{member.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(group, member.id, 1)} aria-label="Tăng số lượng"><Plus size={14} /></button>
                    </div>
                    <span className="groupcart-member-amount-v58">{formatCurrency(member.amount, currency)}</span>
                    {isOwner && (
                      <button type="button" className="groupcart-remove-member-btn-v67" onClick={() => removeGroupMember(group, member.id, member.name)} aria-label={`Xoá ${member.name} khỏi nhóm`}>
                        <Trash2 size={15} />
                      </button>
                    )}
                    {!product && <ShieldAlert size={14} className="groupcart-edit-row-warn-v67" />}
                  </div>
                );
              })}
            </div>

            <div className="groupcart-add-product-card-v67">
              <p><PlusCircle size={16} /> Thêm sản phẩm mới vào nhóm</p>
              <div className="groupcart-create-row-v58">
                <label>
                  <span>Tên hiển thị</span>
                  <input value={addProductForm.name} onChange={(e) => setAddProductForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ví dụ: Khang" />
                </label>
                <label>
                  <span>Sản phẩm</span>
                  <ProductPicker
                    products={products}
                    recentlyViewed={recentlyViewedProducts}
                    suggested={suggestedProducts}
                    value={products.find((p) => p.id === addProductForm.productId) || null}
                    onChange={(p) => setAddProductForm((f) => ({ ...f, productId: p.id }))}
                    placeholder="Gõ tên sản phẩm để tìm..."
                  />
                </label>
              </div>
              <div className="groupcart-create-row-v58">
                <label>
                  <span>Số lượng</span>
                  <input
                    type="number" min="1" step="1"
                    value={addProductForm.quantity}
                    onChange={(e) => setAddProductForm((f) => ({ ...f, quantity: Math.max(1, Math.round(Number(e.target.value) || 1)) }))}
                  />
                </label>
                <div className="groupcart-add-product-submit-wrap-v67">
                  <button type="button" className="primary full" onClick={() => submitAddProduct(group)}>Thêm vào nhóm</button>
                </div>
              </div>
            </div>
          </div>
          )}
        </section>
      </div>
    );
  }

  function renderSettlement(group) {
    const settlement = settlements[group.id];
    const isOpen = settleOpenId === group.id;

    // Yêu cầu thanh toán được chốt trước khi có QR thật (không có thông tin ngân
    // hàng) — cần chốt lại nhóm để nhập tài khoản nhận tiền thì mới tạo được QR.
    if (settlement && !settlement.bank) {
      return (
        <div className="groupcart-settle-v63 active">
          <p className="groupcart-settle-legacy-note-v64">
            Yêu cầu thanh toán này được tạo trước khi có mã QR thật — chốt lại nhóm để nhập tài khoản nhận tiền.
          </p>
          <button type="button" className="ghost full groupcart-settle-toggle-v63" onClick={() => resetSettlement(group.id)}>
            <Wallet size={16} /> Chốt lại nhóm
          </button>
        </div>
      );
    }

    if (!settlement) {
      return (
        <div className="groupcart-settle-v63">
          <button type="button" className="ghost full groupcart-settle-toggle-v63" onClick={() => toggleSettleOpen(group)}>
            <Wallet size={16} /> Chốt nhóm &amp; yêu cầu thanh toán
          </button>
          {isOpen && (
            <>
              <div className="groupcart-settle-bank-form-v64">
                <p>Nhập tài khoản nhận tiền của bạn để tạo mã QR cho từng thành viên:</p>
                <div className="groupcart-settle-bank-row-v64">
                  <label>
                    <span>Ngân hàng</span>
                    <input
                      type="text"
                      list={`gdcbb-banklist-${group.id}`}
                      placeholder="Gõ tên ngân hàng, VD: Techcombank"
                      value={settleBankDraft.bankQuery}
                      onChange={(e) => {
                        const value = e.target.value;
                        const match = banks.find((b) => `${b.shortName} (${b.code})` === value);
                        setSettleBankDraft((d) => ({ ...d, bankQuery: value, bank: match || null }));
                      }}
                    />
                    <datalist id={`gdcbb-banklist-${group.id}`}>
                      {banks.map((b) => (
                        <option key={b.bin} value={`${b.shortName} (${b.code})`} />
                      ))}
                    </datalist>
                  </label>
                  <label>
                    <span>Số tài khoản</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="VD: 19035829999"
                      className={settleBankDraft.accountNo && !accountNoValid ? 'groupcart-input-invalid-v67' : ''}
                      value={settleBankDraft.accountNo}
                      onChange={(e) => setSettleBankDraft((d) => ({ ...d, accountNo: e.target.value.replace(/\D/g, '') }))}
                    />
                    {settleBankDraft.accountNo && !accountNoValid && (
                      <small className="groupcart-field-error-v67"><ShieldAlert size={12} /> Số tài khoản không đúng định dạng (cần 6-19 chữ số) — nhập lại giúp mình nhé.</small>
                    )}
                  </label>
                </div>
                <label>
                  <span>Tên chủ tài khoản</span>
                  <input
                    type="text"
                    placeholder="VD: NGUYEN VAN A"
                    value={settleBankDraft.accountName}
                    onChange={(e) => setSettleBankDraft((d) => ({ ...d, accountName: e.target.value }))}
                  />
                </label>
                <label className="groupcart-remember-account-v67">
                  <input
                    type="checkbox"
                    checked={Boolean(settleBankDraft.remember)}
                    onChange={(e) => setSettleBankDraft((d) => ({ ...d, remember: e.target.checked }))}
                  />
                  <span>Lưu tài khoản này cho những lần chia tiền sau</span>
                </label>
                {hasSavedAccount && (
                  <button
                    type="button"
                    className="groupcart-forget-account-v67"
                    onClick={() => {
                      clearSavedAccount();
                      setHasSavedAccount(false);
                      setSettleBankDraft((d) => ({ ...d, remember: false }));
                    }}
                  >
                    Xoá tài khoản đã lưu trên máy này
                  </button>
                )}
                <small className="groupcart-account-note-v67">
                  Lưu ý: CartWise chỉ kiểm tra được <b>định dạng</b> số tài khoản, chưa thể xác minh tài khoản có thật sự tồn tại hay không vì việc đó cần kết nối API riêng (có phí) của từng ngân hàng. Bạn tự kiểm tra kỹ số tài khoản trước khi chia sẻ mã QR cho cả nhóm nhé.
                </small>
              </div>
              <div className="groupcart-settle-modes-v63">
                <p>Chọn cách chia tiền cho nhóm này:</p>
                <div className="groupcart-settle-mode-buttons-v63">
                  <button type="button" disabled={!canStartSettlement()} onClick={() => { startSettlement(group, 'even'); setSettleOpenId(null); }}>Chia đều</button>
                  <button type="button" disabled={!canStartSettlement()} onClick={() => { startSettlement(group, 'manual'); setSettleOpenId(null); }}>Ai góp nấy trả</button>
                </div>
                {!canStartSettlement() && <small className="groupcart-settle-hint-v64">Nhập đủ ngân hàng, số tài khoản đúng định dạng và tên chủ tài khoản để tạo QR.</small>}
              </div>
            </>
          )}
        </div>
      );
    }

    const paidCount = settlement.requests.filter((r) => r.paid).length;
    const unpaidRequests = settlement.requests.filter((r) => !r.paid);
    // Chia đều thường ra số tiền bằng nhau cho mọi người (trừ trường hợp tổng
    // không chia hết, phần dư dồn vào người cuối) — chỉ khi TẤT CẢ số tiền còn
    // lại đúng bằng nhau mới dùng 1 mã QR chung; nếu lệch nhau (dù chỉ vài đồng)
    // vẫn phải tạo QR riêng từng người để số tiền trên mã luôn đúng tuyệt đối.
    const allUnpaidEqual = unpaidRequests.length > 0 && unpaidRequests.every((r) => r.amount === unpaidRequests[0].amount);
    const useSharedQr = settlement.mode === 'even' && allUnpaidEqual;

    return (
      <div className="groupcart-settle-v63 active">
        <div className="groupcart-settle-dashboard-head-v63">
          <QrCode size={16} />
          <b>Yêu cầu thanh toán ({settlement.mode === 'even' ? 'chia đều' : 'ai góp nấy trả'})</b>
          <span>{paidCount}/{settlement.requests.length} đã thanh toán</span>
        </div>

        <button type="button" className="ghost groupcart-settle-redo-v67" onClick={() => requestRedoSettlement(group.id)}>
          <RotateCcw size={14} /> Đổi lại cách chia tiền
        </button>

        <div className="groupcart-settle-list-v63">
          {settlement.requests.map((req) => (
            <div key={req.memberId} className={req.paid ? 'groupcart-settle-row-v63 paid' : 'groupcart-settle-row-v63'}>
              <button type="button" className="groupcart-settle-status-btn-v63" onClick={() => togglePaid(group.id, req.memberId)}>
                <CheckCircle2 size={16} />
                <span>{req.name}</span>
              </button>
              <b>{formatCurrency(req.amount, 'VND')}</b>
              <span className="groupcart-settle-tag-v63">{req.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
            </div>
          ))}
        </div>

        {plan.groupFund.qr && unpaidRequests.length > 0 && (
          useSharedQr ? (
            // Chia đều, mọi người còn nợ đúng cùng 1 số tiền -> chỉ cần 1 mã QR chung,
            // không cần tạo riêng cho từng thành viên. v79 — bấm mới mở mã QR, hiện to
            // dạng popup toàn màn hình (xem khối "qrModal" ở cuối component) thay vì
            // hiện thẳng nhỏ ngay trong khung nhóm như trước.
            <button
              type="button"
              className="groupcart-qr-open-btn-v79"
              onClick={() => setQrModal({
                label: `Cả nhóm "${group.title}"`,
                amount: unpaidRequests[0].amount,
                bin: settlement.bank.bin,
                bankShortName: settlement.bank.shortName,
                accountNo: settlement.accountNo,
                accountName: settlement.accountName,
                groupTitle: group.title,
                shared: true
              })}
            >
              <QrCode size={16} /> Xem mã QR thanh toán chung
            </button>
          ) : (
            // Ai góp nấy trả (hoặc chia đều nhưng lệch vài đồng do làm tròn): mỗi người
            // một số tiền khác nhau -> danh sách tên bấm để mở, mã QR của đúng người vừa
            // bấm hiện to dạng popup toàn màn hình (dễ đưa điện thoại ra quét hơn hẳn so
            // với hiện thu nhỏ ngay trong khung nhóm như bản trước).
            <div className="groupcart-manual-qr-list-v63">
              {unpaidRequests.map((req) => (
                <button
                  key={req.memberId}
                  type="button"
                  className="groupcart-manual-qr-name-btn-v63"
                  onClick={() => setQrModal({
                    memberName: req.name,
                    amount: req.amount,
                    bin: settlement.bank.bin,
                    bankShortName: settlement.bank.shortName,
                    accountNo: settlement.accountNo,
                    accountName: settlement.accountName,
                    groupTitle: group.title
                  })}
                >
                  <QrCode size={14} />
                  <span>{req.name} — {formatCurrency(req.amount, 'VND')}</span>
                  <span className="groupcart-manual-qr-hint-v63">Xem mã QR</span>
                </button>
              ))}
            </div>
          )
        )}
      </div>
    );
  }
}

export default GroupCart;
