import { useEffect, useMemo, useRef, useState } from 'react';

const floatingWaypoints = [
  { top: '120px' },
  { top: '38vh' },
  { top: '58vh' },
  { top: 'calc(100vh - 220px)' }
];

function CawiRobot({ mode = 'floating', message = 'Chào bạn, mình là Cawi Robo!', page = 'home' }) {
  const [pointIndex, setPointIndex] = useState(1);
  const [moving, setMoving] = useState(false);
  const [poofing, setPoofing] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [themeIndex, setThemeIndex] = useState(Number(localStorage.getItem('cawi-theme') || 0));
  const [bubble, setBubble] = useState(message);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [eyes, setEyes] = useState({ x: 0, y: 0, head: 0 });

  const lastActivity = useRef(Date.now());
  const lastMove = useRef(0);
  const bubbleTimer = useRef(null);
  const robotRef = useRef(null);

  const showBubble = (text, duration = 10000) => {
    if (typeof text === 'string') setBubble(text);
    setBubbleVisible(true);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (duration > 0) {
      bubbleTimer.current = setTimeout(() => setBubbleVisible(false), duration);
    }
  };

  useEffect(() => {
    showBubble(message, 10000);
    return () => bubbleTimer.current && clearTimeout(bubbleTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, page]);

  useEffect(() => {
    function followPointer(event) {
      const rect = robotRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / 180));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / 180));
      setEyes({ x: dx * 4.5, y: dy * 3.2, head: dx * 5 });
    }
    window.addEventListener('mousemove', followPointer, { passive: true });
    return () => window.removeEventListener('mousemove', followPointer);
  }, []);

  useEffect(() => {
    if (mode !== 'floating') return;

    function stopAndWake() {
      lastActivity.current = Date.now();
      setMoving(false);
      setPoofing(false);
      if (sleeping) {
        setSleeping(false);
        showBubble('Bạn đã quay lại rồi ư?', 3000);
      }
    }

    const events = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart', 'input'];
    events.forEach((eventName) => window.addEventListener(eventName, stopAndWake, { passive: true }));

    const interval = setInterval(() => {
      const now = Date.now();
      const inactiveFor = now - lastActivity.current;

      if (inactiveFor >= 30000) {
        if (!sleeping) {
          setSleeping(true);
          setMoving(false);
          setPoofing(false);
          setBubbleVisible(false);
        }
        return;
      }

      if (inactiveFor >= 20000 && now - lastMove.current >= 20000 && !sleeping && !moving && !poofing) {
        const nextIndex = (pointIndex + 1) % floatingWaypoints.length;
        const shortMove = Math.abs(nextIndex - pointIndex) === 1;
        if (shortMove) {
          setMoving(true);
          setPointIndex(nextIndex);
          setTimeout(() => setMoving(false), 2200);
        } else {
          setPoofing(true);
          setTimeout(() => setPointIndex(nextIndex), 180);
          setTimeout(() => setPoofing(false), 760);
        }
        lastMove.current = now;
      }
    }, 1000);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, stopAndWake));
      clearInterval(interval);
    };
  }, [mode, moving, pointIndex, poofing, sleeping]);

  const floatingStyle = useMemo(() => {
    const vars = {
      '--eye-x': `${eyes.x}px`,
      '--eye-y': `${eyes.y}px`,
      '--head-rot': `${eyes.head}deg`
    };
    if (mode === 'floating') {
      return {
        ...vars,
        right: '18px',
        top: floatingWaypoints[pointIndex].top,
        left: 'auto'
      };
    }
    return vars;
  }, [eyes, mode, pointIndex]);

  function handleClick(event) {
    event.stopPropagation();
    const next = (themeIndex + 1) % 5;
    setThemeIndex(next);
    localStorage.setItem('cawi-theme', String(next));
    if (!sleeping) showBubble('Mình vừa đổi màu rồi nè ✨', 1800);
  }

  return (
    <aside
      ref={robotRef}
      className={`cawi cawi-${mode} theme-${themeIndex} ${moving ? 'is-moving' : ''} ${poofing ? 'is-poofing' : ''} ${sleeping ? 'is-sleeping' : ''} ${hovered ? 'is-hovered' : ''} ${bubbleVisible ? 'bubble-visible' : 'bubble-hidden'}`}
      style={floatingStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      aria-label="Cawi Robo CartWise"
      title="Chạm vào robot để tương tác"
    >
      {bubbleVisible && !sleeping && <div className="cawi-bubble">{bubble}</div>}
      <div className="robot-image-wrap">
        <span className="robot-poof" />
        <div className="robot-visual">
          <img src="/robot-cawi-v4.png" alt="Cawi Robo" className="robot-image" />
          <span className="robot-eye-mask left-mask" />
          <span className="robot-eye-mask right-mask" />
          <span className="robot-look-eye left-eye" />
          <span className="robot-look-eye right-eye" />
          <span className="robot-sleep-eyes" />
          <span className="robot-zzz">zzz</span>
        </div>
        <span className="robot-hover-sparkle sparkle-1">✿</span>
        <span className="robot-hover-sparkle sparkle-2">♡</span>
        <span className="robot-hover-sparkle sparkle-3">✦</span>
      </div>
    </aside>
  );
}

export default CawiRobot;
