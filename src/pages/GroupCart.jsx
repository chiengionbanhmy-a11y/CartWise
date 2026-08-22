import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Users, Truck, Copy, Check, PlusCircle, PartyPopper, X, Globe, Lock, UserCheck, Wallet, QrCode, CheckCircle2, Crown } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { seedGroupCarts, computeGroupStats, freeshipThresholds, generateMockJoiner, generateGroupCode } from '../data/groupCarts.js';
import { getPlan } from '../data/plans.js';
import PaymentQrMock from '../components/PaymentQrMock.jsx';

const EXTRA_KEY = 'cartwise-group-extra-members';
const CUSTOM_KEY = 'cartwise-group-custom';
const SETTLEMENT_KEY = 'cartwise-group-settlements'; // v63 — Nhóm Góp Tiền: chia tiền + trạng thái đã/chưa thanh toán

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
  // v64 — nhóm "tự nhập": mỗi người 1 mã QR riêng, mặc định thu gọn (chỉ hiện tên), bấm vào
  // mới hiện mã QR của đúng người đó. Lưu theo groupId -> memberId đang mở.
  const [qrOpenMember, setQrOpenMember] = useState({});

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

  function startSettlement(group, mode) {
    const total = group.members.reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const evenShare = Math.round(total / Math.max(1, group.members.length));
    const requests = group.members.map((m) => ({
      memberId: m.id,
      name: m.name,
      amount: mode === 'even' ? evenShare : Number(m.amount || 0),
      paid: false
    }));
    updateSettlement(group.id, { mode, requests, createdAt: new Date().toISOString() });
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

  function toggleQrMember(groupId, memberId) {
    setQrOpenMember((prev) => ({ ...prev, [groupId]: prev[groupId] === memberId ? null : memberId }));
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
        <span className="eyebrow"><Users size={15} /> Nhóm Góp Tiền</span>
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

    if (!settlement) {
      return (
        <div className="groupcart-settle-v63">
          <button type="button" className="ghost full groupcart-settle-toggle-v63" onClick={() => setSettleOpenId(isOpen ? null : group.id)}>
            <Wallet size={16} /> Chốt nhóm &amp; yêu cầu thanh toán
          </button>
          {isOpen && (
            <div className="groupcart-settle-modes-v63">
              <p>Chọn cách chia tiền cho nhóm này:</p>
              <div className="groupcart-settle-mode-buttons-v63">
                <button type="button" onClick={() => { startSettlement(group, 'even'); setSettleOpenId(null); }}>Chia đều</button>
                <button type="button" onClick={() => { startSettlement(group, 'manual'); setSettleOpenId(null); }}>Tự nhập (giữ số tiền đã góp)</button>
              </div>
            </div>
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
              <b>{formatCurrency(req.amount, currency)}</b>
              <span className="groupcart-settle-tag-v63">{req.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
            </div>
          ))}
        </div>

        {plan.groupFund.qr && settlement.requests.some((r) => !r.paid) && (
          settlement.mode === 'even' ? (
            // Chia đều: mọi người trả đúng 1 số tiền như nhau -> chỉ cần 1 mã QR chung,
            // không cần tạo riêng cho từng thành viên.
            <div className="groupcart-settle-qrs-v63">
              <PaymentQrMock
                label={`Cả nhóm "${group.title}"`}
                amount={settlement.requests.find((r) => !r.paid)?.amount || 0}
                currency={currency}
                shared
              />
            </div>
          ) : (
            // Tự nhập: mỗi người một số tiền khác nhau -> danh sách tên có thể bấm để mở,
            // chỉ hiện mã QR của đúng người vừa bấm (tránh lẫn lộn nhiều mã cùng lúc).
            <div className="groupcart-manual-qr-list-v63">
              {settlement.requests.filter((r) => !r.paid).map((req) => {
                const isQrOpen = qrOpenMember[group.id] === req.memberId;
                return (
                  <div key={req.memberId} className="groupcart-manual-qr-item-v63">
                    <button
                      type="button"
                      className={isQrOpen ? 'groupcart-manual-qr-name-btn-v63 open' : 'groupcart-manual-qr-name-btn-v63'}
                      onClick={() => toggleQrMember(group.id, req.memberId)}
                    >
                      <QrCode size={14} />
                      <span>{req.name} — {formatCurrency(req.amount, currency)}</span>
                      <span className="groupcart-manual-qr-hint-v63">{isQrOpen ? 'Ẩn mã QR' : 'Xem mã QR'}</span>
                    </button>
                    {isQrOpen && (
                      <PaymentQrMock label={req.name} amount={req.amount} currency={currency} />
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    );
  }
}

export default GroupCart;
