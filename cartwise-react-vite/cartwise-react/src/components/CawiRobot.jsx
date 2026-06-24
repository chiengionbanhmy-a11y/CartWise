import { useEffect, useMemo, useRef, useState } from 'react';

const edgePositions = [
  { name: 'bottom-right', x: 'calc(100vw - 110px)', y: 'calc(100vh - 150px)' },
  { name: 'bottom-left', x: '18px', y: 'calc(100vh - 150px)' },
  { name: 'top-right', x: 'calc(100vw - 110px)', y: '110px' },
  { name: 'top-left', x: '18px', y: '110px' }
];

function CawiRobot({ mode = 'floating', message = 'Mình là Cawi Robo!', page = 'home' }) {
  const [positionIndex, setPositionIndex] = useState(0);
  const [moving, setMoving] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [activeClicks, setActiveClicks] = useState(0);
  const [themeIndex, setThemeIndex] = useState(Number(localStorage.getItem('cawi-theme') || 0));
  const lastInteract = useRef(Date.now());
  const wakeAt = useRef(Date.now());
  const robotRef = useRef(null);

  const position = edgePositions[positionIndex % edgePositions.length];

  useEffect(() => {
    if (mode !== 'floating') return;
    setMoving(true);
    const timer = setTimeout(() => setMoving(false), 1800);
    return () => clearTimeout(timer);
  }, [page, mode]);

  useEffect(() => {
    function markActivity() {
      lastInteract.current = Date.now();
      if (sleeping) {
        setSleeping(false);
        wakeAt.current = Date.now();
      }
      if (moving) setMoving(false);
    }

    const events = ['mousemove', 'click', 'scroll', 'keydown', 'touchstart', 'input'];
    events.forEach((e) => window.addEventListener(e, markActivity, { passive: true }));

    const interval = setInterval(() => {
      if (mode !== 'floating') return;
      const now = Date.now();
      const inactive = now - lastInteract.current;

      if (inactive > 20000) {
        setSleeping(true);
        setMoving(false);
        return;
      }

      if (!sleeping && now - wakeAt.current > 10000 && !moving && inactive > 4500) {
        setMoving(true);
        setPositionIndex((i) => i + 1);
        setTimeout(() => setMoving(false), 8000);
        wakeAt.current = now;
      }
    }, 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActivity));
      clearInterval(interval);
    };
  }, [mode, moving, sleeping]);

  function handleRobotClick() {
    const next = activeClicks + 1;
    if (next >= 3) {
      const updated = (themeIndex + 1) % 5;
      setThemeIndex(updated);
      localStorage.setItem('cawi-theme', String(updated));
      setActiveClicks(0);
    } else {
      setActiveClicks(next);
    }
  }

  const floatingStyle = useMemo(() => (
    mode === 'floating'
      ? { left: position.x, top: position.y }
      : undefined
  ), [mode, position]);

  return (
    <aside
      ref={robotRef}
      className={`cawi cawi-${mode} theme-${themeIndex} ${moving ? 'is-moving' : ''} ${sleeping ? 'is-sleeping' : ''}`}
      style={floatingStyle}
      onClick={handleRobotClick}
      aria-label="Cawi Robo CartWise"
      title="Click 3 lần để đổi màu robot"
    >
      {mode === 'floating' && <div className="cawi-bubble">{sleeping ? 'Zzz... mình đang ngủ một chút nè' : message}</div>}
      {mode === 'inline' && <div className="cawi-bubble inline">{message}</div>}
      <div className="robot-image-wrap">
        <img src="/robot-cawi.png" alt="Cawi Robo" className="robot-image" />
        {sleeping && <span className="sleep-badge">Zzz</span>}
      </div>
    </aside>
  );
}

export default CawiRobot;
