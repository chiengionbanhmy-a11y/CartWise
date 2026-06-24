import { useEffect, useMemo, useRef, useState } from 'react';

const waypoints = [
  { left: 'calc(50vw - 44px)', top: '118px' },
  { left: 'calc(100vw - 120px)', top: '168px' },
  { left: 'calc(100vw - 120px)', top: 'calc(50vh - 10px)' },
  { left: '24px', top: 'calc(50vh - 10px)' },
  { left: '24px', top: 'calc(100vh - 160px)' },
  { left: 'calc(100vw - 120px)', top: 'calc(100vh - 160px)' }
];

function CawiRobot({ mode = 'floating', message = 'Chào bạn, mình là Cawi Robo!', page = 'home' }) {
  const [pointIndex, setPointIndex] = useState(0);
  const [moving, setMoving] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [themeIndex, setThemeIndex] = useState(Number(localStorage.getItem('cawi-theme') || 0));
  const [bubble, setBubble] = useState(message);
  const lastActivity = useRef(Date.now());
  const moveCooldown = useRef(Date.now());
  const justWoke = useRef(false);

  useEffect(() => {
    setBubble(message);
  }, [message, page]);

  useEffect(() => {
    if (mode !== 'floating') return;

    function handleActivity() {
      const now = Date.now();
      lastActivity.current = now;
      if (sleeping) {
        setSleeping(false);
        justWoke.current = true;
        setBubble('Bạn đã quay lại rồi ư?');
        setTimeout(() => {
          if (justWoke.current) setBubble(message);
        }, 2600);
      } else if (justWoke.current) {
        justWoke.current = false;
      }
    }

    const events = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart', 'input'];
    events.forEach((eventName) => window.addEventListener(eventName, handleActivity, { passive: true }));

    const interval = setInterval(() => {
      const inactiveFor = Date.now() - lastActivity.current;
      if (inactiveFor >= 30000) {
        setSleeping(true);
        setMoving(false);
        setBubble('khò khò');
        return;
      }
      if (inactiveFor >= 20000 && Date.now() - moveCooldown.current >= 20000 && !sleeping && !moving) {
        setMoving(true);
        setPointIndex((prev) => (prev + 1) % waypoints.length);
        moveCooldown.current = Date.now();
        setTimeout(() => setMoving(false), 7000);
      }
    }, 1000);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
      clearInterval(interval);
    };
  }, [message, mode, moving, sleeping]);

  const currentPoint = waypoints[pointIndex % waypoints.length];
  const floatingStyle = useMemo(() => (
    mode === 'floating' ? { left: currentPoint.left, top: currentPoint.top } : undefined
  ), [mode, currentPoint]);

  function handleClick() {
    const next = (themeIndex + 1) % 5;
    setThemeIndex(next);
    localStorage.setItem('cawi-theme', String(next));
  }

  return (
    <aside
      className={`cawi cawi-${mode} theme-${themeIndex} ${moving ? 'is-moving' : ''} ${sleeping ? 'is-sleeping' : ''} ${hovered ? 'is-hovered' : ''}`}
      style={floatingStyle}
      onMouseEnter={() => {
        setHovered(true);
        if (!sleeping) setBubble('Mình đang mỉm cười với bạn nè ✨');
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
        <img src="/robot-cawi-v2.png" alt="Cawi Robo" className="robot-image" />
        <span className="robot-glow" />
        <span className="robot-smile-overlay" />
        <span className="robot-sleep-eye" />
      </div>
    </aside>
  );
}

export default CawiRobot;
