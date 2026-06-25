import { useEffect, useMemo, useRef, useState } from 'react';
import './CawiRobot.css';

const floatingStops = ['118px', '32vh', '54vh', 'calc(100vh - 220px)'];

const quickQuestions = [
  'Sản phẩm nào rẻ nhất?',
  'Cách đổi tiền tệ?',
  'Cách mua sản phẩm?',
  'Robot có thể giúp gì?',
  'Tìm ưu đãi hot'
];

const themes = [
  { shell: '#F4F8FF', edge: '#D7E6FF', face: '#121827', ear: '#65A7FF', earDark: '#2F7DF2', cart: '#FF8D67', cartDark: '#F06646', basketLine: 'rgba(255,255,255,.34)', accent: '#46D9C1', blush: 'rgba(255,151,184,.72)', glow: 'rgba(255,111,178,.38)' },
  { shell: '#FFF5EE', edge: '#FFD8C9', face: '#171A28', ear: '#FFB08A', earDark: '#FF7A52', cart: '#67A7FF', cartDark: '#2D7FE9', basketLine: 'rgba(255,255,255,.34)', accent: '#30D0B3', blush: 'rgba(255,156,190,.72)', glow: 'rgba(255,134,184,.38)' },
  { shell: '#F0FFF8', edge: '#CFF3E2', face: '#111E25', ear: '#69D4A5', earDark: '#25A96B', cart: '#5ECB92', cartDark: '#28A865', basketLine: 'rgba(255,255,255,.34)', accent: '#4AC8FF', blush: 'rgba(255,151,192,.70)', glow: 'rgba(111,255,190,.30)' },
  { shell: '#F7F2FF', edge: '#E4D9FF', face: '#1A1730', ear: '#A98CFF', earDark: '#7658E9', cart: '#987BFF', cartDark: '#6F55E8', basketLine: 'rgba(255,255,255,.33)', accent: '#5BE6D6', blush: 'rgba(255,158,200,.72)', glow: 'rgba(177,117,255,.34)' },
  { shell: '#EFFBFF', edge: '#CFEFFF', face: '#122333', ear: '#54BFFF', earDark: '#158DE0', cart: '#F6B84A', cartDark: '#DE9420', basketLine: 'rgba(255,255,255,.34)', accent: '#2FD6AD', blush: 'rgba(255,164,198,.72)', glow: 'rgba(82,191,255,.28)' }
];

function getBotReply(text) {
  const q = text.toLowerCase();
  if (q.includes('rẻ') || q.includes('giá') || q.includes('so sánh')) return 'Bạn hãy bấm “So sánh” ở sản phẩm. Mình sẽ chỉ ra nơi bán rẻ nhất, mức tiết kiệm và link mua trực tiếp.';
  if (q.includes('tiền') || q.includes('usd') || q.includes('vnd') || q.includes('quy đổi')) return 'Khi mở sản phẩm, bạn có thể đổi nhanh VND sang USD, CNY, EUR, JPY hoặc KRW ngay trong khung sản phẩm.';
  if (q.includes('mua') || q.includes('link') || q.includes('cửa hàng')) return 'Bạn bấm “Mua ở đây” ở từng điểm bán. CartWise sẽ mở link tới trang mua chính thức phù hợp.';
  if (q.includes('ưu đãi') || q.includes('sale') || q.includes('flash')) return 'Bạn vào mục Flash Sale để xem các sản phẩm đang giảm giá và đồng hồ đếm ngược ưu đãi.';
  if (q.includes('robot') || q.includes('giúp')) return 'Mình là Cawi Robo. Mình hỗ trợ so sánh giá, gợi ý nơi mua, nhắc ưu đãi và giải thích cách dùng CartWise.';
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
  const [chatSize, setChatSize] = useState(null);
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Xin chào! Mình có thể tư vấn nơi mua rẻ hơn, ưu đãi và cách dùng CartWise.' }]);

  const rootRef = useRef(null);
  const robotRef = useRef(null);
  const bubbleTimer = useRef(null);
  const clickTimer = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const recognitionRef = useRef(null);
  const moveTimeoutRef = useRef(null);
  const lastActivity = useRef(Date.now());
  const lastMove = useRef(Date.now());
  const followRef = useRef({ rafId: 0, current: { x: 0, y: 0, tilt: 0, pupilX: 0, pupilY: 0 }, target: { x: 0, y: 0, tilt: 0, pupilX: 0, pupilY: 0 } });

  const palette = themes[themeIndex % themes.length];
  const cssVars = {
    '--cw22-shell': palette.shell,
    '--cw22-edge': palette.edge,
    '--cw22-face': palette.face,
    '--cw22-ear': palette.ear,
    '--cw22-ear-dark': palette.earDark,
    '--cw22-cart': palette.cart,
    '--cw22-cart-dark': palette.cartDark,
    '--cw22-line': palette.basketLine,
    '--cw22-accent': palette.accent,
    '--cw22-blush': palette.blush,
    '--cw22-glow': palette.glow
  };

  const showBubble = (text, duration = 15000) => {
    setBubbleText(text);
    setBubbleVisible(true);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (duration > 0) bubbleTimer.current = setTimeout(() => setBubbleVisible(false), duration);
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
      root.style.setProperty('--cw22-look-x', `${state.pupilX}px`);
      root.style.setProperty('--cw22-look-y', `${state.pupilY}px`);
      root.style.setProperty('--cw22-head-x', `${state.x}px`);
      root.style.setProperty('--cw22-head-y', `${state.y}px`);
      root.style.setProperty('--cw22-head-tilt', `${state.tilt}deg`);
    };
    const animate = () => {
      const { current, target } = followRef.current;
      const ease = 0.36;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      current.tilt += (target.tilt - current.tilt) * ease;
      current.pupilX += (target.pupilX - current.pupilX) * ease;
      current.pupilY += (target.pupilY - current.pupilY) * ease;
      applyVars(current);
      const delta = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) + Math.abs(target.tilt - current.tilt) + Math.abs(target.pupilX - current.pupilX) + Math.abs(target.pupilY - current.pupilY);
      if (delta > 0.02) followRef.current.rafId = window.requestAnimationFrame(animate);
      else followRef.current.rafId = 0;
    };
    const onMouseMove = (event) => {
      const rect = robotRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.25;
      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / 140));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / 110));
      followRef.current.target = { x: dx * 3, y: dy * 2.2, tilt: dx * 5, pupilX: dx * 3.6, pupilY: dy * 3.1 };
      if (!followRef.current.rafId) followRef.current.rafId = window.requestAnimationFrame(animate);
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
      if (resizeRef.current) {
        const data = resizeRef.current;
        const minW = 320;
        const minH = 360;

        // v25: Giữ chuột ở BẤT KỲ 1 góc nào cũng có thể phóng to/thu nhỏ cả chiều ngang và chiều dọc.
        // Kéo ra xa tâm khung chat = phóng to. Kéo gần tâm = thu nhỏ.
        // Không giới hạn vị trí/kích thước tối đa, chỉ giữ kích thước tối thiểu để khung chat không bị vỡ.
        const distanceX = Math.abs(event.clientX - data.centerX);
        const distanceY = Math.abs(event.clientY - data.centerY);

        const nextW = Math.max(minW, distanceX * 2);
        const nextH = Math.max(minH, distanceY * 2);

        const nextX = data.centerX - nextW / 2;
        const nextY = data.centerY - nextH / 2;

        setChatPosition({ x: nextX, y: nextY });
        setChatSize({ width: nextW, height: nextH });
        return;
      }

      if (!dragRef.current) return;

      setChatPosition({
        x: event.clientX - dragRef.current.offsetX,
        y: event.clientY - dragRef.current.offsetY
      });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
      document.body.classList.remove('cw22-dragging');
      document.body.classList.remove('cw22-resizing');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const widgetStyle = useMemo(() => {
    if (mode === 'floating') return { right: '20px', top: floatingStops[stopIndex], bottom: 'auto', left: 'auto' };
    return undefined;
  }, [mode, stopIndex]);

  const chatStyle = {
    ...(chatPosition ? { left: `${chatPosition.x}px`, top: `${chatPosition.y}px`, right: 'auto', bottom: 'auto' } : {}),
    ...(chatSize ? { width: `${chatSize.width}px`, height: `${chatSize.height}px` } : {})
  };

  const toggleTheme = () => {
    const next = (themeIndex + 1) % themes.length;
    setThemeIndex(next);
    localStorage.setItem('cawi-theme', String(next));
    window.dispatchEvent(new CustomEvent('cawi-theme-sync', { detail: { theme: next } }));
    showBubble('Mình vừa đổi màu rồi đó ✨', 3500);
  };

  const startDrag = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest('button')) return;

    const card = event.currentTarget.closest('.cw22-chat');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    dragRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height
    };

    setChatPosition({ x: rect.left, y: rect.top });
    setChatSize({ width: rect.width, height: rect.height });
    document.body.classList.add('cw22-dragging');
  };

  const startResize = (corner, event) => {
    event.preventDefault();
    event.stopPropagation();
    const card = event.currentTarget.closest('.cw22-chat');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    resizeRef.current = {
      corner,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2
    };
    setChatPosition({ x: rect.left, y: rect.top });
    setChatSize({ width: rect.width, height: rect.height });
    document.body.classList.add('cw22-resizing');
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
    setTimeout(() => setMessages((prev) => [...prev, { from: 'bot', text: getBotReply(clean) }]), 420);
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
    recognition.onresult = (event) => setInput(event.results?.[0]?.[0]?.transcript || '');
    recognition.onerror = () => setInput((prev) => prev || 'Không nhận được giọng nói, bạn thử lại nhé.');
    recognitionRef.current = recognition;
    recognition.start();
  };

  const renderRobot = (mini = false) => (
    <div className={`cw22-robot ${mini ? 'mini' : 'full'} ${sleeping ? 'sleeping' : ''}`}>
      <div className="cw22-head-wrap">
        <span className="cw22-antenna-stick" />
        <span className="cw22-antenna-ball" />
        <div className="cw22-head">
          <span className="cw22-ear left" />
          <span className="cw22-ear right" />
          <div className="cw22-face">
            <span className="cw22-brow left" />
            <span className="cw22-brow right" />
            <span className="cw22-eye left"><span className="cw22-pupil" /></span>
            <span className="cw22-eye right"><span className="cw22-pupil" /></span>
            <span className="cw22-cheek left" />
            <span className="cw22-cheek right" />
            <span className="cw22-mouth" />
            <span className="cw22-sleep-line left" />
            <span className="cw22-sleep-line right" />
          </div>
        </div>
      </div>
      <div className="cw22-cart">
        <span className="cw22-cart-handle" />
        <span className="cw22-cart-rim" />
        <div className="cw22-basket">
          <span className="v one" /><span className="v two" /><span className="h one" /><span className="h two" />
        </div>
        <span className="cw22-bumper" />
        <span className="cw22-wheel left"><i /></span>
        <span className="cw22-wheel right"><i /></span>
      </div>
      <span className="cw22-sleep-text">zzz</span>
    </div>
  );

  return (
    <aside ref={rootRef} className={`cw22-widget cw22-${mode} ${moving ? 'moving' : ''} ${sleeping ? 'sleeping' : ''} ${hovered ? 'hovered' : ''} ${chatOpen ? 'chat-open' : ''}`} style={{ ...cssVars, ...widgetStyle }} aria-label="Cawi Robo">
      {bubbleVisible && !chatOpen && (
        <div className="cw22-bubble">
          <p>{bubbleText}</p>
          <button type="button" onClick={(event) => { event.stopPropagation(); setBubbleVisible(false); }} aria-label="Đóng lời thoại">×</button>
        </div>
      )}

      {chatOpen && (
        <div className="cw22-chat" style={chatStyle} onClick={(event) => event.stopPropagation()}>
          <header onMouseDown={startDrag} title="Giữ chuột và kéo để di chuyển khung chat">
            <div className="cw22-chat-ident">
              <div className="cw22-mini-avatar">{renderRobot(true)}</div>
              <div className="cw22-chat-ident-text">
                <strong>Cawi Robo</strong>
                <span className="cw22-status"><i />Đang hoạt động</span>
              </div>
            </div>
            <button type="button" onMouseDown={(event) => event.stopPropagation()} onClick={() => setChatOpen(false)}>×</button>
          </header>
          <div className="cw22-messages">
            {messages.map((item, index) => <div key={`${item.from}-${index}`} className={`cw22-msg ${item.from}`}>{item.text}</div>)}
          </div>
          <div className="cw22-quick">
            {quickQuestions.map((q) => <button key={q} type="button" onClick={() => sendMessage(q)}>{q}</button>)}
          </div>
          <form className="cw22-input" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Nhập câu hỏi của bạn..." />
            <button type="button" className="cw22-mic" onClick={startVoiceInput} aria-label="Nhập bằng giọng nói">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" /><path d="M19 10a7 7 0 0 1-14 0" /><path d="M12 19v2" /></svg>
            </button>
            <button type="submit" className="cw22-send" aria-label="Gửi tin nhắn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 18V6" /><path d="M7 11l5-5 5 5" /></svg>
            </button>
          </form>
          <button className="cw22-resize-handle top-left" type="button" aria-label="Kéo để đổi kích cỡ khung chat" onMouseDown={(event) => startResize('top-left', event)} />
          <button className="cw22-resize-handle top-right" type="button" aria-label="Kéo để đổi kích cỡ khung chat" onMouseDown={(event) => startResize('top-right', event)} />
          <button className="cw22-resize-handle bottom-left" type="button" aria-label="Kéo để đổi kích cỡ khung chat" onMouseDown={(event) => startResize('bottom-left', event)} />
          <button className="cw22-resize-handle bottom-right" type="button" aria-label="Kéo để đổi kích cỡ khung chat" onMouseDown={(event) => startResize('bottom-right', event)} />
        </div>
      )}

      <div ref={robotRef} className="cw22-avatar" onClick={handleRobotClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="Click 1 lần để mở chat, click 2 lần để đổi màu">
        <span className="cw22-pink-glow" />
        <span className="cw22-fx fx1">✿</span><span className="cw22-fx fx2">❤</span><span className="cw22-fx fx3">❀</span><span className="cw22-fx fx4">♡</span>
        {renderRobot(false)}
      </div>
    </aside>
  );
}

export default CawiRobot;
