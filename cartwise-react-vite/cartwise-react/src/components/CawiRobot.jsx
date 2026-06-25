import { useEffect, useMemo, useRef, useState } from 'react';
import './CawiRobot.css';

const floatingStops = ['112px', '30vh', '54vh', 'calc(100vh - 250px)'];

const quickQuestions = [
  'Sản phẩm nào rẻ nhất?',
  'Cách đổi tiền tệ?',
  'Cách mua sản phẩm?',
  'Robot có thể giúp gì?',
  'Tìm ưu đãi hot'
];

const themes = [
  {
    head: '#eef4ff',
    headBorder: '#d6e4ff',
    ear: '#6da5ff',
    earDark: '#387ff1',
    face: '#111827',
    cart: '#eef4ff',
    cartRim: '#64a6ff',
    accent: '#ff9968',
    mouth: '#2fe0bf',
    blush: 'rgba(255, 152, 178, .65)',
    shadow: 'rgba(72, 112, 195, .28)'
  },
  {
    head: '#fff4ec',
    headBorder: '#ffd5bd',
    ear: '#ffb38a',
    earDark: '#ff8a56',
    face: '#1c2435',
    cart: '#fff7f2',
    cartRim: '#ff9d6a',
    accent: '#6ea8ff',
    mouth: '#23d0ab',
    blush: 'rgba(255, 168, 196, .62)',
    shadow: 'rgba(255, 150, 114, .24)'
  },
  {
    head: '#f0fff7',
    headBorder: '#c9f2df',
    ear: '#74d9af',
    earDark: '#38b77f',
    face: '#122027',
    cart: '#f7fffb',
    cartRim: '#5fd0a0',
    accent: '#7b89ff',
    mouth: '#2ec4ff',
    blush: 'rgba(255, 156, 200, .58)',
    shadow: 'rgba(85, 195, 146, .22)'
  },
  {
    head: '#f7f1ff',
    headBorder: '#e2d5ff',
    ear: '#b190ff',
    earDark: '#8463f2',
    face: '#1c1830',
    cart: '#fcf9ff',
    cartRim: '#a382ff',
    accent: '#ffad66',
    mouth: '#4fe0d9',
    blush: 'rgba(255, 156, 199, .56)',
    shadow: 'rgba(140, 110, 240, .24)'
  },
  {
    head: '#eefaff',
    headBorder: '#ccecff',
    ear: '#59c3ff',
    earDark: '#1696e7',
    face: '#142536',
    cart: '#f5fbff',
    cartRim: '#55b5ff',
    accent: '#ffc861',
    mouth: '#1fd0a0',
    blush: 'rgba(255, 172, 204, .58)',
    shadow: 'rgba(31, 157, 227, .24)'
  }
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
    return 'Bạn bấm “Mua ở đây” ở từng điểm bán. CartWise sẽ mở link tới trang mua chính thức phù hợp.';
  }
  if (q.includes('ưu đãi') || q.includes('sale') || q.includes('flash')) {
    return 'Bạn vào mục Flash Sale để xem các sản phẩm đang giảm giá và đồng hồ đếm ngược ưu đãi.';
  }
  if (q.includes('robot') || q.includes('giúp')) {
    return 'Mình là Cawi Robo. Mình hỗ trợ so sánh giá, gợi ý nơi mua, nhắc ưu đãi và giải thích cách dùng CartWise.';
  }

  return 'Mình đã hiểu. Bạn có thể hỏi về so sánh giá, nơi mua rẻ nhất, đổi tiền tệ, flash sale hoặc cách dùng CartWise nhé.';
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
    current: { x: 0, y: 0, tilt: 0, pupilX: 0, pupilY: 0 },
    target: { x: 0, y: 0, tilt: 0, pupilX: 0, pupilY: 0 }
  });

  const palette = themes[themeIndex % themes.length];
  const cssVars = {
    '--cwr-head': palette.head,
    '--cwr-head-border': palette.headBorder,
    '--cwr-ear': palette.ear,
    '--cwr-ear-dark': palette.earDark,
    '--cwr-face': palette.face,
    '--cwr-cart': palette.cart,
    '--cwr-cart-rim': palette.cartRim,
    '--cwr-accent': palette.accent,
    '--cwr-mouth': palette.mouth,
    '--cwr-blush': palette.blush,
    '--cwr-shadow': palette.shadow
  };

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
      root.style.setProperty('--cwr-look-x', `${state.pupilX}px`);
      root.style.setProperty('--cwr-look-y', `${state.pupilY}px`);
      root.style.setProperty('--cwr-head-x', `${state.x}px`);
      root.style.setProperty('--cwr-head-y', `${state.y}px`);
      root.style.setProperty('--cwr-head-tilt', `${state.tilt}deg`);
    };

    const animate = () => {
      const { current, target } = followRef.current;
      const ease = 0.34;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      current.tilt += (target.tilt - current.tilt) * ease;
      current.pupilX += (target.pupilX - current.pupilX) * ease;
      current.pupilY += (target.pupilY - current.pupilY) * ease;
      applyVars(current);
      const delta =
        Math.abs(target.x - current.x) +
        Math.abs(target.y - current.y) +
        Math.abs(target.tilt - current.tilt) +
        Math.abs(target.pupilX - current.pupilX) +
        Math.abs(target.pupilY - current.pupilY);
      if (delta > 0.02) {
        followRef.current.rafId = window.requestAnimationFrame(animate);
      } else {
        followRef.current.rafId = 0;
      }
    };

    const onMouseMove = (event) => {
      const rect = robotRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.25;
      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / 140));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / 110));
      followRef.current.target = {
        x: dx * 3,
        y: dy * 2.2,
        tilt: dx * 5.2,
        pupilX: dx * 5.6,
        pupilY: dy * 4.2
      };
      if (!followRef.current.rafId) {
        followRef.current.rafId = window.requestAnimationFrame(animate);
      }
    };

    applyVars(followRef.current.current);
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
        moveTimeoutRef.current = setTimeout(() => setMoving(false), 1800);
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
      document.body.classList.remove('cwr-dragging');
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
      return { right: '22px', top: floatingStops[stopIndex], bottom: 'auto', left: 'auto' };
    }
    return undefined;
  }, [mode, stopIndex]);

  const chatStyle = chatPosition ? { left: `${chatPosition.x}px`, top: `${chatPosition.y}px`, right: 'auto', bottom: 'auto' } : undefined;

  const toggleTheme = () => {
    const next = (themeIndex + 1) % themes.length;
    setThemeIndex(next);
    localStorage.setItem('cawi-theme', String(next));
    window.dispatchEvent(new CustomEvent('cawi-theme-sync', { detail: { theme: next } }));
    showBubble('Mình vừa đổi màu rồi đó ✨', 3500);
  };

  const startDrag = (event) => {
    if (event.target.closest('button')) return;
    const card = event.currentTarget.closest('.cwr-chat');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    dragRef.current = { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    setChatPosition({ x: rect.left, y: rect.top });
    document.body.classList.add('cwr-dragging');
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

  const renderRobot = (mini = false) => (
    <div className={`cwr-robot ${mini ? 'mini' : 'full'} ${sleeping ? 'sleeping' : ''}`}>
      <div className="cwr-head-wrap">
        <div className="cwr-antenna"><span className="cwr-antenna-stick" /><span className="cwr-antenna-ball" /></div>
        <div className="cwr-head-shell">
          <span className="cwr-ear left" />
          <span className="cwr-ear right" />
          <div className="cwr-face-panel">
            <span className="cwr-brow left" />
            <span className="cwr-brow right" />
            <div className="cwr-eye left"><span className="cwr-pupil" /></div>
            <div className="cwr-eye right"><span className="cwr-pupil" /></div>
            <span className="cwr-cheek left" />
            <span className="cwr-cheek right" />
            <span className="cwr-mouth" />
            <span className="cwr-sleep-line left" />
            <span className="cwr-sleep-line right" />
          </div>
        </div>
      </div>
      <div className="cwr-cart-wrap">
        <span className="cwr-cart-handle" />
        <div className="cwr-cart-rim" />
        <div className="cwr-cart-body">
          <span className="cwr-grid a" />
          <span className="cwr-grid b" />
          <span className="cwr-grid c" />
          <span className="cwr-grid d" />
          <span className="cwr-grid e" />
          <span className="cwr-grid f" />
        </div>
        <span className="cwr-foot-bar" />
        <span className="cwr-wheel left"><i /></span>
        <span className="cwr-wheel right"><i /></span>
      </div>
      <span className="cwr-sleep-text">zzz</span>
    </div>
  );

  return (
    <aside
      ref={rootRef}
      className={`cwr-widget cwr-${mode} ${moving ? 'moving' : ''} ${sleeping ? 'sleeping' : ''} ${hovered ? 'hovered' : ''} ${chatOpen ? 'chat-open' : ''}`}
      style={{ ...cssVars, ...widgetStyle }}
      aria-label="Cawi Robo"
    >
      {bubbleVisible && !chatOpen && (
        <div className="cwr-bubble">
          <p>{bubbleText}</p>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setBubbleVisible(false);
            }}
            aria-label="Đóng lời thoại"
          >×</button>
        </div>
      )}

      {chatOpen && (
        <div className="cwr-chat" style={chatStyle} onClick={(event) => event.stopPropagation()}>
          <header onMouseDown={startDrag} title="Giữ chuột và kéo để di chuyển khung chat">
            <div className="cwr-chat-ident">
              <div className="cwr-mini-avatar">{renderRobot(true)}</div>
              <div className="cwr-chat-ident-text">
                <strong>Cawi Robo</strong>
                <span className="cwr-status"><i />Đang hoạt động</span>
              </div>
            </div>
            <button type="button" onMouseDown={(event) => event.stopPropagation()} onClick={() => setChatOpen(false)}>×</button>
          </header>
          <div className="cwr-messages">
            {messages.map((item, index) => (
              <div key={`${item.from}-${index}`} className={`cwr-msg ${item.from}`}>{item.text}</div>
            ))}
          </div>
          <div className="cwr-quick">
            {quickQuestions.map((q) => <button key={q} type="button" onClick={() => sendMessage(q)}>{q}</button>)}
          </div>
          <form className="cwr-input" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Nhập câu hỏi của bạn..." />
            <button type="button" className="cwr-mic" onClick={startVoiceInput} aria-label="Nhập bằng giọng nói">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
                <path d="M19 10a7 7 0 0 1-14 0" />
                <path d="M12 19v2" />
              </svg>
            </button>
            <button type="submit" className="cwr-send" aria-label="Gửi tin nhắn">
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
        className="cwr-avatar"
        onClick={handleRobotClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Click 1 lần để mở chat, click 2 lần để đổi màu"
      >
        <span className="cwr-fx fx1">✿</span>
        <span className="cwr-fx fx2">❤</span>
        <span className="cwr-fx fx3">❀</span>
        <span className="cwr-pink-glow" />
        {renderRobot(false)}
      </div>
    </aside>
  );
}

export default CawiRobot;
