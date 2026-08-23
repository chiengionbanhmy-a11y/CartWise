import { useRef, useState } from 'react';
import { ShoppingCart, X, Trash2, ArrowLeft, Check } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getBestFinalStore, getFinalCost } from '../data/products.js';

// v67 — 1 dòng sản phẩm trong giỏ hàng so sánh, vuốt sang trái để xoá (kéo bằng
// chuột cũng hoạt động, không chỉ cảm ứng). Vuốt quá ngưỡng HOẶC bấm nút thùng
// rác đều không xoá ngay — luôn hiện hộp xác nhận "Đồng ý / Huỷ" trước.
// v69 — Thêm chế độ "Sửa": khi bật, mỗi dòng hiện ô tích chọn thay vì vuốt để xoá,
// phục vụ xoá nhiều sản phẩm cùng lúc từ thanh hành động phía dưới.
function CartRow({ item, product, currency, onRemove, onOpenProduct, editMode, selected, onToggleSelect }) {
  const [dragX, setDragX] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const dragState = useRef(null);

  const best = product ? getBestFinalStore(product) : null;
  const priceText = best ? formatCurrency(getFinalCost(best), currency) : 'Đang cập nhật giá';

  function onPointerDown(event) {
    if (confirming || editMode) return;
    dragState.current = { startX: event.clientX, lastX: dragX };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function onPointerMove(event) {
    if (!dragState.current) return;
    const delta = event.clientX - dragState.current.startX;
    const clamped = Math.min(0, Math.max(-136, delta));
    dragState.current.lastX = clamped;
    setDragX(clamped);
  }
  function onPointerUp() {
    if (!dragState.current) return;
    const finalX = dragState.current.lastX;
    dragState.current = null;
    if (finalX <= -78) {
      setDragX(-136);
      setConfirming(true);
    } else {
      setDragX(0);
    }
  }

  function handleRowClick() {
    if (editMode) {
      onToggleSelect(item.productId);
      return;
    }
    if (product) onOpenProduct(product);
  }

  return (
    <div className={`cart-row-wrap-v67 ${editMode ? 'edit-mode-v69' : ''}`}>
      {!editMode && <div className="cart-row-delete-bg-v67"><Trash2 size={17} /> Xoá</div>}
      <div
        className={`cart-row-v67 ${selected ? 'row-selected-v69' : ''}`}
        style={{ transform: editMode ? 'none' : `translateX(${dragX}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {editMode && (
          <button type="button" className="cart-row-check-v69" onClick={() => onToggleSelect(item.productId)} aria-label={selected ? `Bỏ chọn ${item.name}` : `Chọn ${item.name}`}>
            {selected && <Check size={14} strokeWidth={3.4} />}
          </button>
        )}
        <button type="button" className="cart-row-thumb-v67" onClick={handleRowClick} disabled={!product && !editMode}>
          <img src={item.image || product?.image} alt={item.name} />
        </button>
        <button type="button" className="cart-row-info-v67" onClick={handleRowClick} disabled={!product && !editMode}>
          <b>{item.name}</b>
          <span>{priceText}</span>
        </button>
        {!editMode && (
          <button type="button" className="cart-row-remove-v67" onClick={() => setConfirming(true)} aria-label={`Xoá ${item.name} khỏi giỏ hàng`}>
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {confirming && (
        <div className="cart-row-confirm-v67">
          <span>Xoá "{item.name}" khỏi giỏ hàng?</span>
          <div>
            <button type="button" className="ghost small" onClick={() => { setConfirming(false); setDragX(0); }}>Huỷ</button>
            <button type="button" className="primary small" onClick={() => onRemove(item.productId)}>Đồng ý xoá</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CartPanel({ open, onClose, items, products, currency, onRemove, onRemoveMany, onClearAll, onOpenProduct }) {
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkConfirm, setBulkConfirm] = useState(false);

  if (!open) return null;

  function toggleSelect(productId) {
    setSelectedIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => (prev.length === items.length ? [] : items.map((item) => item.productId)));
  }

  function exitEditMode() {
    setEditMode(false);
    setSelectedIds([]);
    setBulkConfirm(false);
  }

  function confirmBulkDelete() {
    if (selectedIds.length > 0) {
      onRemoveMany?.(selectedIds);
    } else {
      onClearAll?.();
    }
    setSelectedIds([]);
    setBulkConfirm(false);
  }

  return (
    <div className="cart-panel-backdrop-v67" role="dialog" aria-modal="true" aria-label="Giỏ hàng so sánh" onClick={onClose}>
      <aside className="cart-panel-v67 cart-panel-fullscreen-v69" onClick={(event) => event.stopPropagation()}>
        <header className="cart-panel-head-v67 cart-panel-head-v69">
          <button type="button" className="cart-panel-head-back-v69" onClick={() => (editMode ? exitEditMode() : onClose())} aria-label={editMode ? 'Thoát chế độ sửa' : 'Đóng giỏ hàng'}>
            {editMode ? <ArrowLeft size={18} /> : <X size={18} />}
          </button>
          <span><ShoppingCart size={18} /> Giỏ hàng ({items.length})</span>
          {items.length > 0 ? (
            <button type="button" className="cart-panel-edit-toggle-v69" onClick={() => (editMode ? exitEditMode() : setEditMode(true))}>
              {editMode ? 'Xong' : 'Sửa'}
            </button>
          ) : <span className="cart-panel-edit-toggle-spacer-v69" />}
        </header>
        <p className="cart-panel-hint-v67">
          {editMode
            ? 'Bấm vào sản phẩm để chọn, có thể chọn nhiều sản phẩm cùng lúc rồi xoá ở thanh bên dưới.'
            : 'Sản phẩm bạn đã thêm từ khung so sánh để xem lại sau. Vuốt (hoặc kéo bằng chuột) sang trái 1 sản phẩm, hoặc bấm nút thùng rác, để xoá — luôn có thông báo xác nhận trước khi xoá thật.'}
        </p>
        {items.length === 0 ? (
          <div className="cart-panel-empty-v67">
            <ShoppingCart size={34} />
            <p>Giỏ hàng đang trống. Mở một sản phẩm bất kỳ và bấm "Thêm vào giỏ hàng" ngay trong khung so sánh nhé.</p>
          </div>
        ) : (
          <div className="cart-panel-list-v67">
            {items.map((item) => (
              <CartRow
                key={item.productId}
                item={item}
                product={products.find((p) => p.id === item.productId)}
                currency={currency}
                onRemove={onRemove}
                onOpenProduct={(p) => { onOpenProduct(p); onClose(); }}
                editMode={editMode}
                selected={selectedIds.includes(item.productId)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        )}

        {editMode && items.length > 0 && (
          <footer className="cart-panel-bulkbar-v69">
            <button type="button" className="cart-panel-selectall-v69" onClick={toggleSelectAll}>
              <span className={`cart-panel-selectall-box-v69 ${selectedIds.length === items.length ? 'checked' : ''}`}>
                {selectedIds.length === items.length && <Check size={13} strokeWidth={3.4} />}
              </span>
              Chọn tất cả ({items.length})
            </button>
            <button type="button" className="cart-panel-bulkdelete-v69" onClick={() => setBulkConfirm(true)}>
              <Trash2 size={16} />
              {selectedIds.length > 0 ? `Xoá (${selectedIds.length}) đã chọn` : 'Xoá hết giỏ hàng'}
            </button>
          </footer>
        )}

        {bulkConfirm && (
          <div className="cart-panel-bulkconfirm-backdrop-v69" onClick={() => setBulkConfirm(false)}>
            <div className="cart-panel-bulkconfirm-v69" onClick={(event) => event.stopPropagation()}>
              <span>
                {selectedIds.length > 0
                  ? `Xoá ${selectedIds.length} sản phẩm đã chọn khỏi giỏ hàng?`
                  : 'Xoá toàn bộ giỏ hàng? Mọi sản phẩm đã thêm sẽ bị xoá hết.'}
              </span>
              <div>
                <button type="button" className="ghost small" onClick={() => setBulkConfirm(false)}>Huỷ</button>
                <button type="button" className="primary small" onClick={confirmBulkDelete}>Đồng ý xoá</button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartPanel;
