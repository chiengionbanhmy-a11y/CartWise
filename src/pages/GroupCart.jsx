import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Users, Truck, Copy, Check, PlusCircle, PartyPopper, X, Globe, Lock, UserCheck, Wallet, QrCode, CheckCircle2, Crown } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { seedGroupCarts, computeGroupStats, freeshipThresholds, generateMockJoiner, generateGroupCode } from '../data/groupCarts.js';
import { getPlan } from '../data/plans.js';
import PaymentQr from '../components/PaymentQr.jsx';
import { fetchVietQrBanks, FALLBACK_BANKS } from '../utils/vietqr.js';

const EXTRA_KEY = 'cartwise-group-extra-members';
const CUSTOM_KEY = 'cartwise-group-custom';
const SETTLEMENT_KEY = 'cartwise-group-settlements'; // v64 — Ghép Đơn Cùng Bạn Bè: chia tiền + trạng thái đã/chưa thanh toán

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

function GroupCart({ appState, onBack, onOpenProduct, onOpenUpgrade }) {
  const { products, currency, planId } = appState;
  const plan = getPlan(planId);
  const [extraMembers, setExtraMembers] = useState(loadExtraMembers);
  const [customGroups, setCustomGroups] = useState(loadCustomGroups);
  const [joinBanner, setJoinBanner] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: '', storeName: 'Shopee', productId: products[0]?.id || '', yourName: '', visibility: 'public' });
  const [settlements, setSettlements] = useState(loadSettlements);
  const [settleOpenId, setSettleOpenId] = useState(null);
  const [settleBankDraft, setSettleBankDraft] = useState({ bankQuery: '', bank: null, accountNo: '', accountName: '' });
  const [banks, setBanks] = useState(FALLBACK_BANKS);

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
      setSettleBankDraft({ bankQuery: '', bank: null, accountNo: '', accountName: group.ownerName || '' });
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

  function canStartSettlement() {
    return Boolean(settleBankDraft.bank && settleBankDraft.accountNo.length >= 6 && settleBankDraft.accountName.trim());
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
    return base.map((group) => ({
      ...group,
      visibility: group.visibility || 'public',
      members: [...group.members, ...(extraMembers[group.id] || [])]
    }));
  }, [customGroups, extraMembers]);

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
          amount: Math.round(Number(product.basePrice || 0)),
          joinedAt: new Date().toISOString()
        }
      ]
    };
    const next = [newGroup, ...customGroups];
    setCustomGroups(next);
    saveCustomGroups(next);
    setCreateOpen(false);
    setForm({ title: '', storeName: 'Shopee', productId: products[0]?.id || '', yourName: '', visibility: 'public' });
  }

  return (
    <section className="standalone-page-v45 groupcart-page-v58">
      <button className="standalone-back-v45" onClick={onBack}><ArrowLeft size={18} /> Quay lại</button>

      <div className="standalone-hero-v45">
        <span className="eyebrow"><Users size={15} /> Ghép Đơn Cùng Bạn Bè</span>
        <h1>Ghép đơn cùng bạn bè và chia tiền rõ ràng</h1>
        <p>Rủ bạn bè cùng góp đơn vào một nơi bán để cả nhóm đạt ngưỡng freeship, rồi chốt số tiền mỗi người cần trả — chia đều hoặc tự nhập, có yêu cầu thanh toán QR và bảng theo dõi ai đã trả, ai chưa.</p>
      </div>

      <div className="history-definition-card-v50 groupcart-explain-v58">
        <Truck size={18} />
        <div>
          <strong>Đây là tính năng demo</strong>
          <span>
            Ngưỡng miễn phí vận chuyển bên dưới là số liệu tham khảo cho bản demo. Tiến trình nhóm lưu trên trình duyệt của bạn (localStorage); mở link mời trên trình duyệt/thiết bị khác sẽ mô phỏng một người bạn vừa tham gia.
            {plan.groupFund.monthlyCap != null && ` Gói Free: đã tạo ${groupsCreatedThisMonth}/${plan.groupFund.monthlyCap} nhóm trong tháng này.`}
          </span>
        </div>
      </div>

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
              <select value={form.productId} onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
          </div>
          <label>
            <span>Tên hiển thị của bạn</span>
            <input value={form.yourName} onChange={(e) => setForm((f) => ({ ...f, yourName: e.target.value }))} placeholder="Ví dụ: Quân" />
          </label>

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
                  <small>{member.productLabel}</small>
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
      </article>
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
                      value={settleBankDraft.accountNo}
                      onChange={(e) => setSettleBankDraft((d) => ({ ...d, accountNo: e.target.value.replace(/\D/g, '') }))}
                    />
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
              </div>
              <div className="groupcart-settle-modes-v63">
                <p>Chọn cách chia tiền cho nhóm này:</p>
                <div className="groupcart-settle-mode-buttons-v63">
                  <button type="button" disabled={!canStartSettlement()} onClick={() => { startSettlement(group, 'even'); setSettleOpenId(null); }}>Chia đều</button>
                  <button type="button" disabled={!canStartSettlement()} onClick={() => { startSettlement(group, 'manual'); setSettleOpenId(null); }}>Tự nhập (giữ số tiền đã góp)</button>
                </div>
                {!canStartSettlement() && <small className="groupcart-settle-hint-v64">Nhập đủ ngân hàng, số tài khoản và tên chủ tài khoản để tạo QR.</small>}
              </div>
            </>
          )}
        </div>
      );
    }

    const paidCount = settlement.requests.filter((r) => r.paid).length;

    return (
      <div className="groupcart-settle-v63 active">
        <div className="groupcart-settle-dashboard-head-v63">
          <QrCode size={16} />
          <b>Yêu cầu thanh toán ({settlement.mode === 'even' ? 'chia đều' : 'tự nhập'})</b>
          <span>{paidCount}/{settlement.requests.length} đã thanh toán</span>
        </div>

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

        {plan.groupFund.qr && settlement.requests.some((r) => !r.paid) && (
          <div className="groupcart-settle-qrs-v63">
            {settlement.requests.filter((r) => !r.paid).map((req) => (
              <PaymentQr
                key={req.memberId}
                memberName={req.name}
                amount={req.amount}
                bin={settlement.bank.bin}
                bankShortName={settlement.bank.shortName}
                accountNo={settlement.accountNo}
                accountName={settlement.accountName}
                groupTitle={group.title}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default GroupCart;
