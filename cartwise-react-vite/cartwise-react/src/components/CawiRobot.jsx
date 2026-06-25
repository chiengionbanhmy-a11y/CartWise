import { useEffect, useMemo, useRef, useState } from 'react';

const floatingStops = ['112px', '30vh', '54vh', 'calc(100vh - 250px)'];

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
    return 'Bạn bấm “Mua ở đây” ở từng điểm bán. CartWise sẽ mở link tới trang sản phẩm hoặc trang mua chính thức phù hợp.';
  }

  if (q.includes('ưu đãi') || q.includes('sale') || q.includes('flash')) {
    return 'Bạn vào mục Flash Sale để xem các sản phẩm đang giảm giá và đồng hồ đếm ngược ưu đãi.';
  }

  if (q.includes('robot') || q.includes('giúp')) {
    return 'Mình là Cawi Robo. Mình hỗ trợ so sánh giá, gợi ý nơi mua, nhắc ưu đãi và giải thích cách dùng CartWise.';
  }

  return 'Mình đã hiểu. Bạn có thể hỏi mình về so sánh giá, nơi mua rẻ nhất, đổi tiền tệ, flash sale hoặc cách sử dụng CartWise nhé.';
}

function CawiRobot({ mode = 'floating', message = 'Chào bạn, mình là Cawi Robo!' }) {
  const [stopIndex, setStopIndex] = useState(1);
  const [moving, setMoving] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [bubbleText, setBubbleText] = useState(message);
  const [themeIndex, setThemeIndex] = useState(() => Number(localStorage.getItem('cawi-theme') || 0));
  const [input, setInput] = useState('');
  const [chatPosition, setChatPosition] = useState(null);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Mình có thể tư vấn nơi mua rẻ hơn, ưu đãi và cách dùng CartWise.' }
  ]);

  const rootRef = useRef(null);
  const robotRef = useRef(null);
  const bubbleTimer = useRef(null);
  const clickTimer = useRef(null);
  const dragRef = useRef(null);
  const recognitionRef = useRef(null);
  const moveTimeoutRef = useRef(null);
  const lastActivity = useRef(Date.now());
  const lastMove = useRef(Date.now());
  const followRef = useRef({
    rafId: 0,
    current: { pupilX: 0, pupilY: 0, headX: 0, headY: 0, headRot: 0 },
    target: { pupilX: 0, pupilY: 0, headX: 0, headY: 0, headRot: 0 }
  });

  const robotImage = '/cartwise-cartbot-v16-eyefix.png';

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
    return () => {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      if (clickTimer.current) clearTimeout(clickTimer.current);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      recognitionRef.current?.stop?.();
    };
  }, [message]);

  useEffect(() => {
    const onThemeSync = (event) => {
      const nextTheme = Number(event?.detail?.theme ?? localStorage.getItem('cawi-theme') ?? 0);
      setThemeIndex(Number.isNaN(nextTheme) ? 0 : nextTheme);
    };

    window.addEventListener('cawi-theme-sync', onThemeSync);
    window.addEventListener('storage', onThemeSync);
    return () => {
      window.removeEventListener('cawi-theme-sync', onThemeSync);
      window.removeEventListener('storage', onThemeSync);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const applyVars = (state) => {
      root.style.setProperty('--pupil-x', `${state.pupilX}px`);
      root.style.setProperty('--pupil-y', `${state.pupilY}px`);
      root.style.setProperty('--head-x', `${state.headX}px`);
      root.style.setProperty('--head-y', `${state.headY}px`);
      root.style.setProperty('--head-rot', `${state.headRot}deg`);
    };

    applyVars(followRef.current.current);

    const animate = () => {
      const data = followRef.current;
      const c = data.current;
      const t = data.target;
      const ease = 0.42;

      c.pupilX += (t.pupilX - c.pupilX) * ease;
      c.pupilY += (t.pupilY - c.pupilY) * ease;
      c.headX += (t.headX - c.headX) * ease;
      c.headY += (t.headY - c.headY) * ease;
      c.headRot += (t.headRot - c.headRot) * ease;

      applyVars(c);

      const delta =
        Math.abs(t.pupilX - c.pupilX) +
        Math.abs(t.pupilY - c.pupilY) +
        Math.abs(t.headX - c.headX) +
        Math.abs(t.headY - c.headY) +
        Math.abs(t.headRot - c.headRot);

      if (delta > 0.04) {
        data.rafId = window.requestAnimationFrame(animate);
      } else {
        data.rafId = 0;
      }
    };

    const onMouseMove = (event) => {
      const rect = robotRef.current?.getBoundingClientRect();
      if (!rect) return;

      const faceCenterX = rect.left + rect.width * 0.5;
      const faceCenterY = rect.top + rect.height * 0.32;
      const dx = Math.max(-1, Math.min(1, (event.clientX - faceCenterX) / 140));
      const dy = Math.max(-1, Math.min(1, (event.clientY - faceCenterY) / 115));

      followRef.current.target = {
        pupilX: dx * 4.6,
        pupilY: dy * 3.8,
        headX: dx * 2.2,
        headY: dy * 1.6,
        headRot: dx * 6.4
      };

      if (!followRef.current.rafId) {
        followRef.current.rafId = window.requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (followRef.current.rafId) cancelAnimationFrame(followRef.current.rafId);
    };
  }, []);

  useEffect(() => {
    const markActivity = () => {
      lastActivity.current = Date.now();
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      setMoving(false);
      if (sleeping) {
        setSleeping(false);
        showBubble('Bạn đã quay lại rồi ư? Mình sẵn sàng hỗ trợ tiếp nè!', 5000);
      }
    };

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
        moveTimeoutRef.current = setTimeout(() => setMoving(false), 2000);
      }
    }, 1000);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, markActivity));
      clearInterval(interval);
    };
  }, [mode, moving, sleeping]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!dragRef.current) return;
      setChatPosition({
        x: event.clientX - dragRef.current.offsetX,
        y: event.clientY - dragRef.current.offsetY
      });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      document.body.classList.remove('cartbot-dragging');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const widgetStyle = useMemo(() => {
    if (mode === 'floating') {
      return {
        right: '24px',
        top: floatingStops[stopIndex],
        bottom: 'auto',
        left: 'auto'
      };
    }

    return undefined;
  }, [mode, stopIndex]);

  const chatStyle = chatPosition
    ? { left: `${chatPosition.x}px`, top: `${chatPosition.y}px`, right: 'auto', bottom: 'auto' }
    : undefined;

  const toggleTheme = () => {
    const next = (themeIndex + 1) % 5;
    setThemeIndex(next);
    localStorage.setItem('cawi-theme', String(next));
    window.dispatchEvent(new CustomEvent('cawi-theme-sync', { detail: { theme: next } }));
    showBubble('Mình vừa đổi màu rồi đó ✨', 3500);
  };

  const startDrag = (event) => {
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
  };

  const handleRobotClick = (event) => {
    event.stopPropagation();

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      toggleTheme();
      return;
    }

    clickTimer.current = setTimeout(() => {
      setChatOpen((open) => !open);
      setBubbleVisible(false);
      clickTimer.current = null;
    }, 240);
  };

  const sendMessage = (text) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((prev) => [...prev, { from: 'user', text: clean }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: getBotReply(clean) }]);
    }, 420);
  };

  const startVoiceInput = () => {
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
  };

  return (
    <aside
      ref={rootRef}
      className={`cartbot-widget cartbot-${mode} theme-${themeIndex} ${moving ? 'is-moving' : ''} ${sleeping ? 'is-sleeping' : ''} ${hovered ? 'is-hovered' : ''} ${chatOpen ? 'chat-open' : ''}`}
      style={widgetStyle}
      aria-label="Cawi Robo"
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
            <div className="cartbot-chat-ident">
              <div className="cartbot-mini-avatar">
                <img src={robotImage} alt="Cawi Robo" className="cartbot-mini-img" />
                <span className="cartbot-mini-eye-blank left" />
                <span className="cartbot-mini-eye-blank right" />
                <span className="cartbot-mini-pupil left" />
                <span className="cartbot-mini-pupil right" />
              </div>
              <div className="cartbot-chat-ident-text">
                <strong>Cawi Robo</strong>
                <span className="cartbot-status"><i />Đang hoạt động</span>
              </div>
            </div>
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
            <button type="button" className="cartbot-mic" onClick={startVoiceInput} aria-label="Nhập bằng giọng nói">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
                <path d="M19 10a7 7 0 0 1-14 0" />
                <path d="M12 19v2" />
              </svg>
            </button>
            <button type="submit" className="cartbot-send" aria-label="Gửi tin nhắn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 18V6" />
                <path d="M7 11l5-5 5 5" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <div
        ref={robotRef}
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
          <img src={robotImage} alt="Cawi Robo" className="cartbot-img" />
          <span className="cartbot-eye-blank left" />
          <span className="cartbot-eye-blank right" />
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
