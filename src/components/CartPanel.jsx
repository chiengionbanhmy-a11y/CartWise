import { useRef, useState } from 'react';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { formatCurrency } from '../data/currency.js';
import { getBestFinalStore, getFinalCost } from '../data/products.js';

// v67 — 1 dòng sản phẩm trong giỏ hàng so sánh, vuốt sang trái để xoá (kéo bằng
// chuột cũng hoạt động, không chỉ cảm ứng). Vuốt quá ngưỡng HOẶC bấm nút thùng
// rác đều không xoá ngay — luôn hiện hộp xác nhận "Đồng ý / Huỷ" trước.
function CartRow({ item, product, currency, onRemove, onOpenProduct }) {
  const [dragX, setDragX] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const dragState = useRef(null);

  const best = product ? getBestFinalStore(product) : null;
  const priceText = best ? formatCurrency(getFinalCost(best), currency) : 'Đang cập nhật giá';

  function onPointerDown(event) {
    if (confirming) return;
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

  return (
    <div className="cart-row-wrap-v67">
      <div className="cart-row-delete-bg-v67"><Trash2 size={17} /> Xoá</div>
      <div
        className="cart-row-v67"
        style={{ transform: `translateX(${dragX}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <button type="button" className="cart-row-thumb-v67" onClick={() => product && onOpenProduct(product)} disabled={!product}>
          <img src={item.image || product?.image} alt={item.name} />
        </button>
        <button type="button" className="cart-row-info-v67" onClick={() => product && onOpenProduct(product)} disabled={!product}>
          <b>{item.name}</b>
          <span>{priceText}</span>
        </button>
        <button type="button" className="cart-row-remove-v67" onClick={() => setConfirming(true)} aria-label={`Xoá ${item.name} khỏi giỏ hàng`}>
          <Trash2 size={16} />
        </button>
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

function CartPanel({ open, onClose, items, products, currency, onRemove, onOpenProduct }) {
  if (!open) return null;

  return (
    <div className="cart-panel-backdrop-v67" role="dialog" aria-modal="true" aria-label="Giỏ hàng so sánh" onClick={onClose}>
      <aside className="cart-panel-v67" onClick={(event) => event.stopPropagation()}>
        <header className="cart-panel-head-v67">
          <span><ShoppingCart size={18} /> Giỏ hàng so sánh ({items.length})</span>
          <button type="button" onClick={onClose} aria-label="Đóng giỏ hàng"><X size={18} /></button>
        </header>
        <p className="cart-panel-hint-v67">
          Sản phẩm bạn đã thêm từ khung so sánh để xem lại sau. Vuốt (hoặc kéo bằng chuột) sang trái 1 sản phẩm, hoặc bấm nút thùng rác, để xoá — luôn có thông báo xác nhận trước khi xoá thật.
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
              />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartPanel;
