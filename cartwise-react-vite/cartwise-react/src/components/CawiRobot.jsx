import { useEffect, useMemo, useRef, useState } from 'react';
import { products, getBestFinalStore, getBestStore, getSavingAmount } from '../data/products.js';
import { formatCurrency } from '../data/currency.js';
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
  { shell: '#F0FFF8', edge: '#CFF3E2', face: '#111E25', ear: '#69D4A5', earDark: '#25A96B', cart: '#5ECB92', cartDark: '#28A865', basketLine: 'rgba(255,255,255,.33)', accent: '#4AC8FF', blush: 'rgba(255,151,192,.70)', glow: 'rgba(111,255,190,.30)' },
  { shell: '#F7F2FF', edge: '#E4D9FF', face: '#1A1730', ear: '#A98CFF', earDark: '#7658E9', cart: '#987BFF', cartDark: '#6F55E8', basketLine: 'rgba(255,255,255,.33)', accent: '#5BE6D6', blush: 'rgba(255,158,200,.72)', glow: 'rgba(177,117,255,.34)' },
  { shell: '#EFFBFF', edge: '#CFEFFF', face: '#122333', ear: '#54BFFF', earDark: '#158DE0', cart: '#F6B84A', cartDark: '#DE9420', basketLine: 'rgba(255,255,255,.34)', accent: '#2FD6AD', blush: 'rgba(255,164,198,.72)', glow: 'rgba(82,191,255,.28)' }
];

const productHints = [
  { id: 'mouse-logitech', terms: ['m331', 'logitech', 'chuột', 'mouse'] },
  { id: 'powerbank-anker', terms: ['anker', 'pin dự phòng', 'powerbank', 'sạc dự phòng'] },
  { id: 'sunscreen-anessa', terms: ['anessa', 'kem chống nắng'] },
  { id: 'lipstick', terms: ['dior', 'lip glow', 'son dưỡng', 'son dior', 'lip balm'] },
  { id: 'rice-cooker', terms: ['philips', 'nồi cơm', 'hd3170'] },
  { id: 'mini-fan', terms: ['quạt', 's-18', 'quạt mini'] },
  { id: 'water-lavie-500', terms: ['lavie', 'nước khoáng', 'nước lavie'] },
  { id: 'haohao', terms: ['hảo hảo', 'hao hao', 'mì', 'mì gói'] },
  { id: 'notebook', terms: ['vở', 'hồng hà', '4586', 'subject a4'] },
  { id: 'casio', terms: ['casio', 'máy tính', 'fx-580', '580vnx'] },
  { id: 'lego-classic', terms: ['lego', 'classic', 'xếp hình'] },
  { id: 'teddy-bear', terms: ['gấu bông', 'thú bông', 'teddy'] }
];

function normalizeText(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findMentionedProduct(query) {
  const normalized = normalizeText(query);
  const hint = productHints.find((item) => item.terms.some((term) => normalized.includes(normalizeText(term))));
  return hint ? products.find((item) => item.id === hint.id) : null;
}

function buildBestStoreReply(product) {
  const best = getBestFinalStore(product) || getBestStore(product);
  if (!best) return `Hiện mình chưa có đủ dữ liệu giá để so sánh rõ cho sản phẩm ${product.name}.`;
  const saving = getSavingAmount(product);
  const bestCost = Number(best.storePrice || 0) + Number(best.shippingFee || 0);
  const savingText = saving > 0 ? ` Bạn có thể tiết kiệm khoảng ${formatCurrency(saving, 'VND')} so với nơi giá cao hơn.` : '';
  return `Với ${product.name}, hiện ${best.storeName} là lựa chọn đáng chú ý nhất trên CartWise với tổng chi phí dự kiến khoảng ${formatCurrency(bestCost, 'VND')}.${savingText}`;
}

function getBotReply(text) {
  const normalized = normalizeText(text);
  const matchedProduct = findMentionedProduct(text);

  if (!normalized) {
    return 'Bạn cứ nhập câu hỏi như: “Sản phẩm nào rẻ nhất?”, “Cách đổi tiền tệ?” hoặc tên sản phẩm cụ thể để mình hỗ trợ nhé.';
  }

  if (matchedProduct && /(gia|re|so sanh|mua|tot nhat|nen mua|chi phi)/.test(normalized)) {
    return buildBestStoreReply(matchedProduct);
  }

  if (/(xin chao|chao|hello|hi|hey)/.test(normalized)) {
    return 'Xin chào! Mình là Cawi Robo — trợ lý mua sắm của CartWise. Bạn có thể hỏi về giá, nơi mua, phí vận chuyển, voucher hoặc cách dùng web nhé.';
  }

  if (/(ban la ai|robot la ai|gioi thieu)/.test(normalized)) {
    return 'Mình là Cawi Robo, trợ lý mua sắm của CartWise. Mình có thể gợi ý nơi mua rẻ hơn, giải thích cách so sánh chi phí dự kiến, hỗ trợ đổi tiền tệ và hướng dẫn dùng website.';
  }

  if (/(re nhat|tot nhat|so sanh gia|so sanh tong chi phi|san pham nao re nhat)/.test(normalized)) {
    const ranked = products
      .map((item) => ({ item, best: getBestFinalStore(item) || getBestStore(item) }))
      .filter((entry) => entry.best)
      .sort((a, b) => (Number(a.best.storePrice || 0) + Number(a.best.shippingFee || 0)) - (Number(b.best.storePrice || 0) + Number(b.best.shippingFee || 0)));
    const top = ranked[0];
    if (!top) return 'Mình chưa có đủ dữ liệu để xếp hạng lúc này.';
    const bestCost = Number(top.best.storePrice || 0) + Number(top.best.shippingFee || 0);
    return `Nếu xét theo dữ liệu hiện có trên web, ${top.item.name} đang có mức tổng chi phí dự kiến thấp nổi bật tại ${top.best.storeName}, khoảng ${formatCurrency(bestCost, 'VND')}. Nếu bạn muốn, hãy nói tên sản phẩm để mình phân tích chi tiết hơn.`;
  }

  if (/(tien te|usd|vnd|eur|jpy|krw|cny|quy doi|doi tien)/.test(normalized)) {
    return 'Bạn có thể đổi đơn vị tiền tệ trong phần cài đặt hoặc ngay trong khung so sánh sản phẩm. Khi bạn nhập voucher dạng giảm tiền, CartWise sẽ hiểu đúng theo đơn vị tiền tệ đang hiển thị.';
  }

  if (/(voucher|giam gia|giam tien|phan tram)/.test(normalized)) {
    return 'Trong phần “Tùy chỉnh theo tài khoản của bạn”, bạn có thể chọn giảm theo tiền hoặc theo %. Phần này áp dụng cho mua online và được tách riêng khỏi bảng so sánh công bằng để tránh làm lệch kết quả chính.';
  }

  if (/(ship|van chuyen|phi ship|freeship)/.test(normalized)) {
    return 'Phí vận chuyển được dùng để ước tính tổng chi phí khi mua online. Khi mở sản phẩm, bạn sẽ thấy phần so sánh online riêng để nhìn rõ giá sản phẩm, phí vận chuyển và tổng dự kiến.';
  }

  if (/(mua|link|mo link|truy cap san pham)/.test(normalized)) {
    return 'Bạn chỉ cần bấm “Mua tại đây” ở từng nền tảng. CartWise sẽ mở đúng link sản phẩm tương ứng để bạn tiếp tục mua sắm.';
  }

  if (/(flash sale|sale|uu dai|giam gia soc)/.test(normalized)) {
    return 'Bạn có thể vào mục Flash Sale để xem các sản phẩm đang có ưu đãi nổi bật. Nếu một sản phẩm đang sale, CartWise cũng có thể hiển thị đồng hồ đếm ngược thời gian kết thúc ưu đãi.';
  }

  if (/(robot|co the giup gi|huong dan|cach dung)/.test(normalized)) {
    return 'Bạn có thể click 1 lần vào robot để mở chat, click 2 lần liên tiếp để đổi màu robot, và kéo thả robot tới vị trí bạn muốn. Mình cũng có thể trả lời các câu hỏi linh hoạt như một trợ lý mua sắm thông minh ngay trong web.';
  }

  if (/(cam on|thank)/.test(normalized)) {
    return 'Rất vui được hỗ trợ bạn. Nếu cần, bạn cứ hỏi thêm về sản phẩm, chi phí dự kiến hoặc cách dùng CartWise nhé!';
  }

  if (matchedProduct) {
    return `${buildBestStoreReply(matchedProduct)} Nếu muốn, bạn có thể hỏi tiếp về voucher, ship hoặc nơi mua của sản phẩm này.`;
  }

  if (/(tong chi phi du kien|chi phi du kien|gia niem yet|gia ban dau)/.test(normalized)) {
    return 'CartWise không chỉ nhìn giá niêm yết. Web sẽ cộng thêm phí vận chuyển ước tính để tạo tổng chi phí dự kiến. Voucher cá nhân được tách riêng để bảng so sánh công bằng không bị sai lệch.';
  }

  return 'Mình có thể chưa hiểu hết ý bạn, nhưng vẫn sẵn sàng hỗ trợ. Bạn thử hỏi ngắn gọn hơn về sản phẩm cụ thể, nơi mua rẻ hơn, cách đổi tiền tệ, voucher hoặc flash sale nhé.';
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
  const [robotPosition, setRobotPosition] = useState(null);
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Xin chào! Mình là Cawi Robo, trợ lý mua sắm của CartWise. Bạn muốn mình so sánh sản phẩm nào hôm nay?' }]);

  const rootRef = useRef(null);
  const robotRef = useRef(null);
  const bubbleTimer = useRef(null);
  const clickTimer = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const robotDragRef = useRef(null);
  const robotWasDraggedRef = useRef(false);
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
      const ease = 0.3;
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
      const centerY = rect.top + rect.height * 0.28;
      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / 140));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / 110));
      followRef.current.target = { x: dx * 3, y: dy * 2.2, tilt: dx * 5, pupilX: dx * 3.5, pupilY: dy * 3.1 };
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
      if (mode === 'floating' && inactiveFor >= 20000 && now - lastMove.current >= 20000 && !moving && !sleeping && !robotPosition) {
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
  }, [mode, moving, sleeping, robotPosition]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (robotDragRef.current) {
        const data = robotDragRef.current;
        const moved = Math.abs(event.clientX - data.startX) + Math.abs(event.clientY - data.startY) > 4;
        data.moved = data.moved || moved;

        if (data.mode === 'floating') {
          setRobotPosition({
            x: event.clientX - data.offsetX,
            y: event.clientY - data.offsetY
          });
        } else {
          const rawX = event.clientX - data.parentLeft - data.offsetX;
          const rawY = event.clientY - data.parentTop - data.offsetY;
          const maxX = Math.max(0, data.parentWidth - data.width);
          const maxY = Math.max(0, data.parentHeight - data.height);
          setRobotPosition({
            x: Math.min(Math.max(0, rawX), maxX),
            y: Math.min(Math.max(0, rawY), maxY)
          });
        }
        return;
      }

      if (resizeRef.current) {
        const data = resizeRef.current;
        const minW = 320;
        const minH = 360;
        const maxW = Math.max(minW, window.innerWidth - 12);
        const maxH = Math.max(minH, window.innerHeight - 12);
        let nextLeft = data.startLeft;
        let nextTop = data.startTop;
        let nextWidth = data.startWidth;
        let nextHeight = data.startHeight;

        if (data.corner.includes('right')) {
          nextWidth = Math.max(minW, Math.min(maxW, event.clientX - data.startLeft));
        }
        if (data.corner.includes('left')) {
          nextWidth = Math.max(minW, Math.min(maxW, data.startRight - event.clientX));
          nextLeft = data.startRight - nextWidth;
        }
        if (data.corner.includes('bottom')) {
          nextHeight = Math.max(minH, Math.min(maxH, event.clientY - data.startTop));
        }
        if (data.corner.includes('top')) {
          nextHeight = Math.max(minH, Math.min(maxH, data.startBottom - event.clientY));
          nextTop = data.startBottom - nextHeight;
        }

        setChatPosition({ x: nextLeft, y: nextTop });
        setChatSize({ width: nextWidth, height: nextHeight });
        return;
      }

      if (!dragRef.current) return;

      setChatPosition({
        x: event.clientX - dragRef.current.offsetX,
        y: event.clientY - dragRef.current.offsetY
      });
    };

    const handleMouseUp = () => {
      if (robotDragRef.current?.moved) {
        robotWasDraggedRef.current = true;
        setTimeout(() => { robotWasDraggedRef.current = false; }, 0);
      }
      robotDragRef.current = null;
      dragRef.current = null;
      resizeRef.current = null;
      document.body.classList.remove('cw22-dragging', 'cw22-resizing', 'cw22-robot-dragging');
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
      if (robotPosition) return { ...cssVars, left: `${robotPosition.x}px`, top: `${robotPosition.y}px`, right: 'auto', bottom: 'auto' };
      return { ...cssVars, right: '20px', top: floatingStops[stopIndex], bottom: 'auto', left: 'auto' };
    }
    if (robotPosition) {
      return { ...cssVars, position: 'absolute', left: `${robotPosition.x}px`, top: `${robotPosition.y}px`, right: 'auto', bottom: 'auto' };
    }
    return cssVars;
  }, [mode, stopIndex, robotPosition, cssVars]);

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
      offsetY: event.clientY - rect.top
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
      startLeft: rect.left,
      startTop: rect.top,
      startWidth: rect.width,
      startHeight: rect.height,
      startRight: rect.left + rect.width,
      startBottom: rect.top + rect.height
    };
    setChatPosition({ x: rect.left, y: rect.top });
    setChatSize({ width: rect.width, height: rect.height });
    document.body.classList.add('cw22-resizing');
  };

  const startRobotDrag = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest('button')) return;
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();

    if (mode === 'floating') {
      robotDragRef.current = {
        mode,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        moved: false
      };
      setRobotPosition({ x: rect.left, y: rect.top });
    } else {
      const parent = root.parentElement;
      const parentRect = parent?.getBoundingClientRect();
      if (!parentRect) return;
      robotDragRef.current = {
        mode,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        parentLeft: parentRect.left,
        parentTop: parentRect.top,
        parentWidth: parentRect.width,
        parentHeight: parentRect.height,
        width: rect.width,
        height: rect.height,
        moved: false
      };
      setRobotPosition({ x: rect.left - parentRect.left, y: rect.top - parentRect.top });
    }
    document.body.classList.add('cw22-robot-dragging');
  };

  const handleRobotClick = (event) => {
    event.stopPropagation();
    if (robotWasDraggedRef.current) {
      robotWasDraggedRef.current = false;
      return;
    }
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
    }, 220);
  };

  const sendMessage = (text) => {
    const clean = text.trim();
    if (!clean) return;

    setMessages((prev) => [...prev, { from: 'user', text: clean }]);
    setInput('');

    window.setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: getBotReply(clean) }]);
    }, 320);
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
    <aside ref={rootRef} className={`cw22-widget cw22-${mode} ${moving ? 'moving' : ''} ${sleeping ? 'sleeping' : ''} ${hovered ? 'hovered' : ''} ${chatOpen ? 'chat-open' : ''}`} style={widgetStyle} aria-label="Cawi Robo">
      {bubbleVisible && !chatOpen && (
        <div className="cw22-bubble">
          <p>{bubbleText}</p>
          <button type="button" onClick={(event) => { event.stopPropagation(); setBubbleVisible(false); }} aria-label="Đóng lời thoại">×</button>
        </div>
      )}

      {chatOpen && (
        <div className="cw22-chat" style={chatStyle} onClick={(event) => event.stopPropagation()}>
          <header onMouseDown={startDrag} title="Giữ chuột ở thanh trên để kéo khung chat">
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
            {messages.map((item, index) => <div key={item.id || `${item.from}-${index}`} className={`cw22-msg ${item.from} ${item.pending ? 'pending' : ''}`}>{item.text}</div>)}
          </div>
          <div className="cw22-quick">
            {quickQuestions.map((q) => <button key={q} type="button" onClick={() => sendMessage(q)}>{q}</button>)}
          </div>
          <form className="cw22-input" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Hỏi Cawi Robo về giá, voucher, phí ship..." />
            <button type="button" className="cw22-mic" onClick={startVoiceInput} aria-label="Nhập bằng giọng nói">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" /><path d="M19 10a7 7 0 0 1-14 0" /><path d="M12 19v2" /></svg>
            </button>
            <button type="submit" className="cw22-send" aria-label="Gửi tin nhắn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 18V6" /><path d="M7 11l5-5 5 5" /></svg>
            </button>
          </form>
          <button className="cw22-resize-handle top-left" type="button" aria-label="Kéo góc để thay đổi kích cỡ khung chat" onMouseDown={(event) => startResize('top-left', event)} />
          <button className="cw22-resize-handle top-right" type="button" aria-label="Kéo góc để thay đổi kích cỡ khung chat" onMouseDown={(event) => startResize('top-right', event)} />
          <button className="cw22-resize-handle bottom-left" type="button" aria-label="Kéo góc để thay đổi kích cỡ khung chat" onMouseDown={(event) => startResize('bottom-left', event)} />
          <button className="cw22-resize-handle bottom-right" type="button" aria-label="Kéo góc để thay đổi kích cỡ khung chat" onMouseDown={(event) => startResize('bottom-right', event)} />
        </div>
      )}

      <div ref={robotRef} className="cw22-avatar" onMouseDown={startRobotDrag} onClick={handleRobotClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="Click 1 lần mở khung chat, click 2 lần liên tiếp để đổi màu, kéo thả để đổi vị trí">
        <span className="cw22-pink-glow" />
        <span className="cw22-fx fx1">✿</span><span className="cw22-fx fx2">❤</span><span className="cw22-fx fx3">❀</span><span className="cw22-fx fx4">♡</span>
        {renderRobot(false)}
      </div>
    </aside>
  );
}

export default CawiRobot;
