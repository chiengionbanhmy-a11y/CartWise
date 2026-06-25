import { useEffect, useRef, useState } from 'react';

const positionClasses = ['pos-bottom-right', 'pos-middle-right', 'pos-bottom-left'];
const variantClasses = ['classic', 'orange', 'blue'];

function RobotShape({ small = false, mood = 'normal', variant = 'classic' }) {
  return (
    <span className={`${small ? 'mini-cawi' : 'cawi-shape'} ${mood} ${variant}`} aria-hidden="true">
      <span className="cawi-handle" />
      <span className="cawi-antenna" />
      <span className="cawi-ear cawi-ear-left" />
      <span className="cawi-ear cawi-ear-right" />
      <span className="cawi-head">
        <span className="cawi-face">
          <span className="cawi-eye"><span /></span>
          <span className="cawi-eye"><span /></span>
        </span>
      </span>
      <span className="cawi-cart-body">
        <span className="cawi-core" />
        <span className="cawi-wheel cawi-wheel-left" />
        <span className="cawi-wheel cawi-wheel-right" />
      </span>
      <span className="cawi-shadow" />
    </span>
  );
}

function CawiRobot({ page, message }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Chào bạn! 👋 Mình là Cawi CartBot, trợ lý mua sắm thông minh của bạn. Mình có thể giúp gì cho bạn hôm nay?' },
    { id: 2, type: 'user', text: 'Cách đổi tiền tệ?' },
    { id: 3, type: 'bot', text: 'Khi mở sản phẩm, bạn có thể đổi nhanh VND sang USD, CNY, EUR, JPY hoặc KRW ngay trong khung sản phẩm.' }
  ]);
  const [input, setInput] = useState('');
  const [mood, setMood] = useState('normal');
  const [clickCount, setClickCount] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [positionIndex, setPositionIndex] = useState(0);
  const chatInputRef = useRef(null);
  const messagesRef = useRef(null);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    function trackEyes(event) {
      const shapes = document.querySelectorAll('.cawi-shape, .mini-cawi');
      shapes.forEach((shape) => {
        const rect = shape.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        const limitX = Math.max(-5, Math.min(5, x / 28));
        const limitY = Math.max(-4, Math.min(4, y / 34));
        shape.style.setProperty('--eye-x', `${limitX}px`);
        shape.style.setProperty('--eye-y', `${limitY}px`);
      });
    }

    window.addEventListener('pointermove', trackEyes);
    return () => window.removeEventListener('pointermove', trackEyes);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isOpen) {
        setMood((prev) => prev === 'normal' ? 'blink' : 'normal');
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => chatInputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const resetIdleTimer = () => {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        if (!isOpen) {
          setPositionIndex((index) => (index + 1) % positionClasses.length);
        }
      }, 10000);
    };

    resetIdleTimer();
    window.addEventListener('pointermove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer, { passive: true });

    return () => {
      window.clearTimeout(idleTimerRef.current);
      window.removeEventListener('pointermove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
    };
  }, [isOpen]);

  function toggleChat() {
    setIsOpen((current) => !current);
    setMood('normal');
    setClickCount((count) => {
      const next = count + 1;
      if (next % 3 === 0) {
        setVariantIndex((index) => (index + 1) % variantClasses.length);
        setMood('wave');
      }
      return next;
    });
  }

  function quickAsk(text) {
    setInput(text);
    requestAnimationFrame(() => chatInputRef.current?.focus());
  }

  function sendMessage(event) {
    event?.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((current) => [...current, { id: Date.now(), type: 'user', text }]);
    setInput('');

    window.setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = 'Mình đã nhận câu hỏi. Ở bản demo, Cawi sẽ hỗ trợ bạn so sánh giá, kiểm tra ưu đãi và tìm nơi mua phù hợp hơn.';
      if (lower.includes('rẻ') || lower.includes('giá')) {
        reply = 'Mình sẽ so sánh giá từ các nơi bán, sau đó gợi ý lựa chọn có tổng chi phí hợp lý nhất.';
      }
      if (lower.includes('tiền tệ') || lower.includes('đổi tiền')) {
        reply = 'Khi mở chi tiết sản phẩm, bạn có thể đổi nhanh VND sang USD, CNY, EUR, JPY hoặc KRW ngay trong khung sản phẩm.';
      }
      if (lower.includes('ưu đãi') || lower.includes('sale')) {
        reply = 'Bạn có thể vào mục Flash Sale để xem các ưu đãi nổi bật và sản phẩm đang giảm giá.';
      }
      setMessages((current) => [...current, { id: Date.now() + 1, type: 'bot', text: reply }]);
    }, 420);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  }

  const positionClass = positionClasses[positionIndex];
  const variant = variantClasses[variantIndex];

  return (
    <div className={`cawi-widget ${isOpen ? 'open' : ''} ${positionClass}`}>
      {!isOpen && <div className="cawi-bubble">{message}</div>}

      <button className="cawi-button" type="button" onClick={toggleChat} aria-label="Mở Cawi CartBot">
        <RobotShape mood={mood} variant={variant} />
      </button>

      <section className={`cawi-chat ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} aria-label="Cawi CartBot">
        <header className="cawi-chat-header">
          <div className="chat-title-row">
            <RobotShape small variant={variant} />
            <div>
              <strong>Cawi CartBot</strong>
              <span><i /> Đang hoạt động</span>
            </div>
          </div>
          <div className="chat-header-actions">
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Thu nhỏ">—</button>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Đóng">×</button>
          </div>
        </header>

        <div ref={messagesRef} className="cawi-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`cawi-message-row ${msg.type}`}>
              {msg.type === 'bot' && <RobotShape small variant={variant} />}
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="quick-pills" aria-label="Gợi ý câu hỏi nhanh">
          <button type="button" onClick={() => quickAsk('Sản phẩm nào rẻ nhất?')}>Sản phẩm nào rẻ nhất?</button>
          <button type="button" onClick={() => quickAsk('Cách đổi tiền tệ?')}>Cách đổi tiền tệ?</button>
          <button type="button" onClick={() => quickAsk('Ưu đãi hôm nay')}>Ưu đãi hôm nay</button>
        </div>

        <form className="cawi-chat-input-shell" onSubmit={sendMessage}>
          <textarea
            ref={chatInputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Nhập câu hỏi của bạn..."
            aria-label="Nhập câu hỏi của bạn"
          />

          <button className="cawi-send-button" type="submit" aria-label="Gửi câu hỏi">
            <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <path d="M5 16h19" />
              <path d="m17 9 7 7-7 7" />
            </svg>
          </button>
        </form>

        <small className="chat-disclaimer">Cawi CartBot có thể mắc sai sót. Vui lòng kiểm tra lại thông tin quan trọng.</small>
      </section>
    </div>
  );
}

export default CawiRobot;
