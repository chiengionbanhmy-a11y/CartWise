import { useEffect, useMemo, useRef, useState } from 'react';

const floatingStops = ['130px', '34vh', 'calc(100vh - 210px)', '48vh'];

const quickQuestions = [
  'Sản phẩm nào rẻ nhất?',
  'Cách đổi tiền tệ?',
  'Cách mua sản phẩm?',
  'Robot có thể giúp gì?',
  'Tìm ưu đãi hot'
];

function getBotReply(text) {
  const q = text.toLowerCase();

  if (q.includes('rẻ') || q.includes('giá') || q.includes('so sánh')) {
    return 'Bạn hãy bấm “So sánh” ở sản phẩm. Mình sẽ chỉ ra nơi bán rẻ nhất, mức tiết kiệm và link mua trực tiếp.';
  }

  if (q.includes('tiền') || q.includes('usd') || q.includes('vnd') || q.includes('quy đổi')) {
    return 'Khi mở sản phẩm, bạn có thể đổi nhanh VND sang USD, CNY, EUR, JPY hoặc KRW ngay trong khung sản phẩm.';
  }

  if (q.includes('mua') || q.includes('link') || q.includes('cửa hàng')) {
    return 'Bạn bấm “Mua ở đây” ở từng điểm bán. CartWise sẽ mở trang mua hoặc trang tìm kiếm chính thức của cửa hàng đó.';
  }

  if (q.includes('ưu đãi') || q.includes('sale') || q.includes('flash')) {
    return 'Bạn vào mục Flash Sale để xem các sản phẩm đang giảm giá và đồng hồ đếm ngược ưu đãi.';
  }

  if (q.includes('robot') || q.includes('giúp')) {
    return 'Mình là Cawi CartBot. Mình hỗ trợ so sánh giá, gợi ý nơi mua, nhắc ưu đãi và giải thích cách dùng CartWise.';
  }

  return 'Mình đã hiểu. Bạn có thể hỏi mình về so sánh giá, nơi mua rẻ nhất, đổi tiền tệ, flash sale hoặc cách sử dụng CartWise nhé.';
}

function CawiRobot({ mode = 'floating', message = 'Chào bạn, mình là Cawi CartBot!' }) {
  const [stopIndex, setStopIndex] = useState(1);
  const [moving, setMoving] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [bubbleText, setBubbleText] = useState(message);
  const [themeIndex, setThemeIndex] = useState(Number(localStorage.getItem('cawi-theme') || 0));
  const [pointer, setPointer] = useState({ eyeX: 0, eyeY: 0, head: 0 });
  const [input, setInput] = useState('');
  const [chatPosition, setChatPosition] = useState(null);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Mình có thể tư vấn nơi mua rẻ hơn, ưu đãi và cách dùng CartWise.' }
  ]);

  const lastActivity = useRef(Date.now());
  const lastMove = useRef(Date.now());
  const clickTimer = useRef(null);
  const bubbleTimer = useRef(null);
  const robotRef = useRef(null);
  const dragRef = useRef(null);
  const recognitionRef = useRef(null);

  const showBubble = (text, duration = 15000) => {
    setBubbleText(text);
    setBubbleVisible(true);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (duration > 0) {
      bubbleTimer.current = setTimeout(() => setBubbleVisible(false), duration);
    }
  };

  useEffect(() => {
    showBubble(message, 15000);
    return () => bubbleTimer.current && clearTimeout(bubbleTimer.current);
  }, [message]);

  useEffect(() => {
    function followMouse(event) {
      const rect = robotRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.30;
      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / 180));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / 160));

      setPointer({
        eyeX: dx * 7.5,
        eyeY: dy * 5,
        head: dx * 5
      });
    }

    window.addEventListener('mousemove', followMouse, { passive: true });
    return () => window.removeEventListener('mousemove', followMouse);
  }, []);

  useEffect(() => {
    function markActivity() {
      lastActivity.current = Date.now();
      setMoving(false);

      if (sleeping) {
        setSleeping(false);
        showBubble('Bạn đã quay lại rồi ư? Mình sẵn sàng hỗ trợ tiếp nè!', 5000);
      }
    }

    const events = ['mousemove', 'mousedown', 'scroll', 'keydown', 'touchstart', 'input'];
    events.forEach((eventName) => window.addEventListener(eventName, markActivity, { passive: true }));

    const interval = setInterval(() => {
      const now = Date.now();
      const inactiveFor = now - lastActivity.current;

      if (inactiveFor >= 30000) {
        if (!sleeping) {
          setSleeping(true);
          setMoving(false);
          showBubble('khò khò', 0);
        }
        return;
      }

      if (mode === 'floating' && inactiveFor >= 20000 && now - lastMove.current >= 20000 && !moving && !sleeping) {
        setMoving(true);
        setStopIndex((prev) => (prev + 1) % floatingStops.length);
        lastMove.current = now;
        setTimeout(() => setMoving(false), 2300);
      }
    }, 1000);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, markActivity));
      clearInterval(interval);
    };
  }, [mode, moving, sleeping]);

  useEffect(() => {
    function handleMouseMove(event) {
      if (!dragRef.current) return;
      setChatPosition({
        x: event.clientX - dragRef.current.offsetX,
        y: event.clientY - dragRef.current.offsetY
      });
    }

    function handleMouseUp() {
      dragRef.current = null;
      document.body.classList.remove('cartbot-dragging');
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const style = useMemo(() => {
    const vars = {
      '--eye-x': `${pointer.eyeX}px`,
      '--eye-y': `${pointer.eyeY}px`,
      '--head-rot': `${pointer.head}deg`
    };

    if (mode === 'floating') {
      return {
        ...vars,
        right: '22px',
        top: floatingStops[stopIndex],
        bottom: 'auto',
        left: 'auto'
      };
    }

    return vars;
  }, [mode, pointer, stopIndex]);

  const chatStyle = chatPosition
    ? { left: `${chatPosition.x}px`, top: `${chatPosition.y}px`, right: 'auto', bottom: 'auto' }
    : undefined;

  function startDrag(event) {
    if (event.target.closest('button')) return;
    const card = event.currentTarget.closest('.cartbot-chat');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    dragRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    setChatPosition({ x: rect.left, y: rect.top });
    document.body.classList.add('cartbot-dragging');
  }

  function handleRobotClick(event) {
    event.stopPropagation();

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;

      const next = (themeIndex + 1) % 5;
      setThemeIndex(next);
      localStorage.setItem('cawi-theme', String(next));
      showBubble('Mình vừa đổi màu rồi đó ✨', 3500);
      return;
    }

    clickTimer.current = setTimeout(() => {
      setChatOpen((open) => !open);
      setBubbleVisible(false);
      clickTimer.current = null;
    }, 260);
  }

  function sendMessage(text) {
    const clean = text.trim();
    if (!clean) return;

    setMessages((prev) => [...prev, { from: 'user', text: clean }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: getBotReply(clean) }]);
    }, 450);
  }

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput((prev) => prev || 'Trình duyệt này chưa hỗ trợ nhập bằng giọng nói.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setInput(transcript);
    };
    recognition.onerror = () => {
      setInput((prev) => prev || 'Không nhận được giọng nói, bạn thử lại nhé.');
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  return (
    <aside
      ref={robotRef}
      className={`cartbot-widget cartbot-${mode} theme-${themeIndex} ${moving ? 'is-moving' : ''} ${sleeping ? 'is-sleeping' : ''} ${hovered ? 'is-hovered' : ''} ${chatOpen ? 'chat-open' : ''}`}
      style={style}
      aria-label="Cawi CartBot"
    >
      {bubbleVisible && !chatOpen && (
        <div className="cartbot-bubble">
          <p>{bubbleText}</p>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setBubbleVisible(false);
            }}
            aria-label="Đóng lời thoại"
          >
            ×
          </button>
        </div>
      )}

      {chatOpen && (
        <div className="cartbot-chat" style={chatStyle} onClick={(event) => event.stopPropagation()}>
          <header onMouseDown={startDrag} title="Giữ chuột và kéo để di chuyển khung chat">
            <strong>Cawi CartBot</strong>
            <span>Kéo thanh này để đổi vị trí</span>
            <button type="button" onMouseDown={(event) => event.stopPropagation()} onClick={() => setChatOpen(false)}>×</button>
          </header>

          <div className="cartbot-messages">
            {messages.map((item, index) => (
              <div key={`${item.from}-${index}`} className={`cartbot-msg ${item.from}`}>
                {item.text}
              </div>
            ))}
          </div>

          <div className="cartbot-quick">
            {quickQuestions.map((q) => (
              <button key={q} type="button" onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>

          <form
            className="cartbot-input"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
            />
            <button type="button" className="cartbot-mic" onClick={startVoiceInput} aria-label="Nhập bằng giọng nói">🎙</button>
            <button type="submit" className="cartbot-send" aria-label="Gửi tin nhắn">↑</button>
          </form>
        </div>
      )}

      <div
        className="cartbot-avatar"
        onClick={handleRobotClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Click 1 lần để mở chat, click 2 lần để đổi màu"
      >
        <span className="cartbot-flower flower-1">✿</span>
        <span className="cartbot-flower flower-2">❀</span>
        <span className="cartbot-flower flower-3">♡</span>

        <div className="cartbot-head-layer">
          <img src="/cartwise-cartbot-v12-handle.png" alt="Cawi CartBot" className="cartbot-img" />
          <span className="cartbot-eye-mask left" />
          <span className="cartbot-eye-mask right" />
          <span className="cartbot-eye-pupil left" />
          <span className="cartbot-eye-pupil right" />
          <span className="cartbot-sleep-face">
            <i className="left" />
            <i className="right" />
            <b>zzz</b>
          </span>
        </div>
      </div>
    </aside>
  );
}

export default CawiRobot;
