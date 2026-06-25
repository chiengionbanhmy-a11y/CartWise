import { useEffect, useRef, useState } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function RobotShape({ small = false, mood = 'normal' }) {
  return (
    <span className={`${small ? 'mini-cawi' : 'cawi-shape'} ${mood}`} aria-hidden="true">
      {/* Robot bản cũ: đã bỏ hoàn toàn quai cầm/handle, giữ phần thân dưới cũ. */}
      <span className="cawi-antenna" />
      <span className="cawi-ear cawi-ear-left" />
      <span className="cawi-ear cawi-ear-right" />
      <span className="cawi-head">
        <span className="cawi-face">
          <span className="cawi-eye"><span /></span>
          <span className="cawi-eye"><span /></span>
        </span>
      </span>
      <span className="cawi-lower-body-old">
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
    { id: 1, type: 'bot', text: 'Chào bạn! 👋 Mình là Cawi CartBot. Mình có thể giúp bạn so sánh giá, kiểm tra phí ship/voucher và cân nhắc mức độ cần thiết trước khi mua.' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [mood, setMood] = useState('normal');
  const [clickCount, setClickCount] = useState(0);
  const [panelPosition, setPanelPosition] = useState(null);
  const chatInputRef = useRef(null);
  const messagesRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const recognitionRef = useRef(null);
  const dragRef = useRef({ active: false, offsetX: 0, offsetY: 0 });

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
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.addEventListener('result', (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim();
      if (transcript) {
        setInput((current) => `${current}${current ? ' ' : ''}${transcript}`);
        requestAnimationFrame(() => chatInputRef.current?.focus());
      }
    });

    recognition.addEventListener('end', () => setIsListening(false));
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => chatInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const header = headerRef.current;
    const panel = panelRef.current;
    if (!header || !panel) return;

    function startDrag(event) {
      if (event.target.closest('button')) return;
      const rect = panel.getBoundingClientRect();
      dragRef.current = {
        active: true,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top
      };
      setPanelPosition({ left: rect.left, top: rect.top });
      header.setPointerCapture(event.pointerId);
    }

    function moveDrag(event) {
      if (!dragRef.current.active) return;
      setPanelPosition({
        left: event.clientX - dragRef.current.offsetX,
        top: event.clientY - dragRef.current.offsetY
      });
    }

    function endDrag(event) {
      dragRef.current.active = false;
      if (header.hasPointerCapture(event.pointerId)) {
        header.releasePointerCapture(event.pointerId);
      }
    }

    header.addEventListener('pointerdown', startDrag);
    header.addEventListener('pointermove', moveDrag);
    header.addEventListener('pointerup', endDrag);
    header.addEventListener('pointercancel', endDrag);

    return () => {
      header.removeEventListener('pointerdown', startDrag);
      header.removeEventListener('pointermove', moveDrag);
      header.removeEventListener('pointerup', endDrag);
      header.removeEventListener('pointercancel', endDrag);
    };
  }, [isOpen]);

  function toggleChat() {
    setIsOpen((current) => !current);
    setMood('normal');
    setClickCount((count) => {
      const next = count + 1;
      if (next % 3 === 0) {
        setMood((currentMood) => currentMood === 'wave' ? 'normal' : 'wave');
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
      let reply = 'Mình đã nhận câu hỏi. Ở bản demo, Cawi sẽ giải thích cách so sánh giá, phí ship, voucher và mức độ phù hợp trước khi mua.';
      if (lower.includes('rẻ') || lower.includes('giá')) {
        reply = 'Mình sẽ ưu tiên tổng chi phí thực trả: giá sản phẩm + phí ship - voucher, rồi mới xét độ tin cậy và thời gian giao hàng.';
      }
      if (lower.includes('cần thiết') || lower.includes('nên mua')) {
        reply = 'Điểm cần thiết nên dựa trên câu trả lời của bạn: nhu cầu, tần suất dùng, ngân sách, sản phẩm thay thế và độ khẩn cấp, không để AI tự phán đoán chủ quan.';
      }
      if (lower.includes('tiền tệ') || lower.includes('đổi tiền')) {
        reply = 'Khi mở chi tiết sản phẩm, bạn có thể đổi nhanh VND, USD, CNY, EUR, JPY hoặc KRW ngay trong khung sản phẩm.';
      }
      setMessages((current) => [...current, { id: Date.now() + 1, type: 'bot', text: reply }]);
    }, 420);
  }

  function handleMic() {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert('Trình duyệt này chưa hỗ trợ nhập giọng nói. Bạn có thể thử trên Chrome hoặc Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      return;
    }

    setIsListening(true);
    recognition.start();
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  }

  const panelStyle = panelPosition ? { left: panelPosition.left, top: panelPosition.top, right: 'auto', bottom: 'auto' } : undefined;

  return (
    <div className={`cawi-widget ${isOpen ? 'open' : ''}`}>
      {!isOpen && <div className="cawi-bubble">{message}</div>}

      <button className="cawi-button" type="button" onClick={toggleChat} aria-label="Mở Cawi CartBot">
        <RobotShape mood={mood} />
      </button>

      <section ref={panelRef} className={`cawi-chat ${isOpen ? 'is-open' : ''}`} style={panelStyle} aria-hidden={!isOpen} aria-label="Cawi CartBot">
        <header ref={headerRef} className="cawi-chat-header">
          <div className="chat-title-row">
            <RobotShape small />
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
              {msg.type === 'bot' && <RobotShape small />}
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="quick-pills" aria-label="Gợi ý câu hỏi nhanh">
          <button type="button" onClick={() => quickAsk('Sản phẩm nào rẻ nhất?')}>Sản phẩm nào rẻ nhất?</button>
          <button type="button" onClick={() => quickAsk('Có nên mua sản phẩm này không?')}>Có nên mua không?</button>
          <button type="button" onClick={() => quickAsk('Cách đổi tiền tệ?')}>Cách đổi tiền tệ?</button>
        </div>

        <form className="cawi-chat-input-shell" onSubmit={sendMessage}>
          <RobotShape small />

          <textarea
            ref={chatInputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Nhập câu hỏi của bạn..."
            aria-label="Nhập câu hỏi của bạn"
          />

          <button className={`cawi-mic-button ${isListening ? 'listening' : ''}`} type="button" onClick={handleMic} aria-label="Nhập bằng giọng nói">
            <svg viewBox="0 0 48 48" role="img" aria-hidden="true" focusable="false">
              <path d="M24 5.8c-4.55 0-8.25 3.7-8.25 8.25v11.2c0 4.55 3.7 8.25 8.25 8.25s8.25-3.7 8.25-8.25v-11.2c0-4.55-3.7-8.25-8.25-8.25Z" />
              <path d="M10.8 23.9v1.35C10.8 32.55 16.7 38.5 24 38.5s13.2-5.95 13.2-13.25V23.9" />
              <path d="M24 38.5v5.7" />
              <path d="M17.6 44.2h12.8" />
            </svg>
          </button>

          <button className="cawi-send-button" type="submit" aria-label="Gửi câu hỏi">
            <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
              <path d="M18 28V8" />
              <path d="M10.5 15.5 18 8l7.5 7.5" />
            </svg>
          </button>
        </form>

        <small className="chat-disclaimer">Cawi CartBot có thể mắc sai sót. Vui lòng kiểm tra lại thông tin quan trọng.</small>
      </section>
    </div>
  );
}

export default CawiRobot;
