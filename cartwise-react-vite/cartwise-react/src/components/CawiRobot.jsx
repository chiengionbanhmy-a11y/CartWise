import { useEffect, useMemo, useRef, useState } from 'react';

const closeWaypoints = [
  { left: 'calc(100vw - 150px)', top: 'calc(50vh - 90px)' },
  { left: 'calc(100vw - 150px)', top: 'calc(50vh + 10px)' },
  { left: '28px', top: 'calc(50vh - 70px)' },
  { left: '28px', top: 'calc(50vh + 24px)' }
];

const farWaypoints = [
  { left: 'calc(100vw - 150px)', top: 'calc(50vh - 90px)' },
  { left: '28px', top: 'calc(50vh - 70px)' },
  { left: 'calc(100vw - 150px)', top: 'calc(100vh - 180px)' },
  { left: '28px', top: 'calc(100vh - 180px)' }
];

function CawiRobot({ mode = 'floating', message = 'Chào bạn, mình là Cawi Robo!', page = 'home' }) {
  const [pointIndex, setPointIndex] = useState(0);
  const [moving, setMoving] = useState(false);
  const [poofing, setPoofing] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [themeIndex, setThemeIndex] = useState(Number(localStorage.getItem('cawi-theme') || 0));
  const [bubble, setBubble] = useState(message);

  const lastActivity = useRef(Date.now());
  const lastMove = useRef(Date.now());
  const justWoke = useRef(false);
  const currentPath = useRef(closeWaypoints);

  useEffect(() => {
    if (!sleeping && !hovered) setBubble(message);
  }, [message, page, sleeping, hovered]);

  useEffect(() => {
    if (mode !== 'floating') return;

    function stopAndWake() {
      lastActivity.current = Date.now();
      setMoving(false);
      setPoofing(false);

      if (sleeping) {
        setSleeping(false);
        justWoke.current = true;
        setBubble('Bạn đã quay lại rồi ư?');
        setTimeout(() => {
          justWoke.current = false;
          setBubble(message);
        }, 2800);
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

      if (inactiveFor >= 20000 && now - lastMove.current >= 42000 && !sleeping && !moving && !poofing) {
        const isFarMove = pointIndex % 3 === 2;
        if (isFarMove) {
          currentPath.current = farWaypoints;
          setPoofing(true);
          setTimeout(() => {
            setPointIndex((prev) => (prev + 1) % currentPath.current.length);
          }, 260);
          setTimeout(() => setPoofing(false), 820);
        } else {
          currentPath.current = closeWaypoints;
          setMoving(true);
          setPointIndex((prev) => (prev + 1) % currentPath.current.length);
          setTimeout(() => setMoving(false), 2400);
        }
        lastMove.current = now;
      }
    }, 1000);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, stopAndWake));
      clearInterval(interval);
    };
  }, [message, mode, moving, pointIndex, poofing, sleeping]);

  const points = currentPath.current || closeWaypoints;
  const currentPoint = points[pointIndex % points.length];

  const floatingStyle = useMemo(() => (
    mode === 'floating' ? { left: currentPoint.left, top: currentPoint.top } : undefined
  ), [mode, currentPoint]);

  function handleClick(event) {
    event.stopPropagation();
    const next = (themeIndex + 1) % 5;
    setThemeIndex(next);
    localStorage.setItem('cawi-theme', String(next));
  }

  return (
    <aside
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
        <img src="/robot-cawi-v4.png" alt="Cawi Robo" className="robot-image" />
        <span className="robot-hover-sparkle sparkle-1">✿</span>
        <span className="robot-hover-sparkle sparkle-2">♡</span>
        <span className="robot-hover-sparkle sparkle-3">✦</span>
        <span className="robot-sleep-eyes" />
      </div>
    </aside>
  );
}

export default CawiRobot;
