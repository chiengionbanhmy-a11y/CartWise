import { useEffect, useMemo, useRef, useState } from 'react';

const waypoints = [
  { left: 'calc(100vw - 160px)', top: 'calc(50vh - 92px)' },
  { left: 'calc(100vw - 160px)', top: 'calc(50vh + 28px)' },
  { left: 'calc(100vw - 160px)', top: 'calc(100vh - 190px)' },
  { left: 'calc(100vw - 160px)', top: '140px' }
];

function CawiRobot({ mode = 'floating', message = 'Chào bạn, mình là Cawi Robo!', page = 'home' }) {
  const [pointIndex, setPointIndex] = useState(0);
  const [moving, setMoving] = useState(false);
  const [poofing, setPoofing] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [themeIndex, setThemeIndex] = useState(Number(localStorage.getItem('cawi-theme') || 0));
  const [bubble, setBubble] = useState(message);
  const [eyes, setEyes] = useState({ x: 0, y: 0, head: 0 });

  const lastActivity = useRef(Date.now());
  const lastMove = useRef(Date.now());
  const robotRef = useRef(null);

  useEffect(() => {
    if (!sleeping && !hovered) setBubble(message);
  }, [message, page, sleeping, hovered]);

  useEffect(() => {
    function followPointer(event) {
      const rect = robotRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / 260));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / 220));
      setEyes({ x: dx * 5, y: dy * 3.5, head: dx * 4 });
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
        setBubble('Bạn đã quay lại rồi ư?');
        setTimeout(() => setBubble(message), 2800);
      }
    }

    const events = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart', 'input'];
    events.forEach((eventName) => window.addEventListener(eventName, stopAndWake, { passive: true }));

    const interval = setInterval(() => {
      const now = Date.now();
      const inactiveFor = now - lastActivity.current;

      if (inactiveFor >= 30000) {
        setSleeping(true);
        setMoving(false);
        setPoofing(false);
        setBubble('khò khò');
        return;
      }

      if (inactiveFor >= 20000 && now - lastMove.current >= 52000 && !sleeping && !moving && !poofing) {
        const shouldPoof = pointIndex % 3 === 2;
        if (shouldPoof) {
          setPoofing(true);
          setTimeout(() => setPointIndex((prev) => (prev + 1) % waypoints.length), 260);
          setTimeout(() => setPoofing(false), 850);
        } else {
          setMoving(true);
          setPointIndex((prev) => (prev + 1) % waypoints.length);
          setTimeout(() => setMoving(false), 2600);
        }
        lastMove.current = now;
      }
    }, 1000);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, stopAndWake));
      clearInterval(interval);
    };
  }, [message, mode, moving, pointIndex, poofing, sleeping]);

  const currentPoint = waypoints[pointIndex % waypoints.length];
  const floatingStyle = useMemo(() => (
    mode === 'floating' ? {
      left: currentPoint.left,
      top: currentPoint.top,
      '--eye-x': `${eyes.x}px`,
      '--eye-y': `${eyes.y}px`,
      '--head-rot': `${eyes.head}deg`
    } : {
      '--eye-x': `${eyes.x}px`,
      '--eye-y': `${eyes.y}px`,
      '--head-rot': `${eyes.head}deg`
    }
  ), [mode, currentPoint, eyes]);

  function handleClick(event) {
    event.stopPropagation();
    const next = (themeIndex + 1) % 5;
    setThemeIndex(next);
    localStorage.setItem('cawi-theme', String(next));
  }

  return (
    <aside
      ref={robotRef}
      className={`cawi cawi-${mode} theme-${themeIndex} ${moving ? 'is-moving' : ''} ${poofing ? 'is-poofing' : ''} ${sleeping ? 'is-sleeping' : ''} ${hovered ? 'is-hovered' : ''}`}
      style={floatingStyle}
      onMouseEnter={() => {
        setHovered(true);
        if (!sleeping) setBubble('Hehe, mình đang sẵn sàng giúp bạn nè ✨');
      }}
      onMouseLeave={() => {
        setHovered(false);
        setBubble(sleeping ? 'khò khò' : message);
      }}
      onClick={handleClick}
      aria-label="Cawi Robo CartWise"
      title="Chạm vào robot để tương tác"
    >
      <div className={`cawi-bubble ${sleeping ? 'sleeping-bubble' : ''}`}>{bubble}</div>
      <div className="robot-image-wrap">
        <span className="robot-poof" />
        <div className="robot-visual">
          <img src="/robot-cawi-v4.png" alt="Cawi Robo" className="robot-image" />
          <span className="robot-look-eye left-eye" />
          <span className="robot-look-eye right-eye" />
          <span className="robot-sleep-eyes" />
        </div>
        <span className="robot-hover-sparkle sparkle-1">✿</span>
        <span className="robot-hover-sparkle sparkle-2">♡</span>
        <span className="robot-hover-sparkle sparkle-3">✦</span>
      </div>
    </aside>
  );
}

export default CawiRobot;
