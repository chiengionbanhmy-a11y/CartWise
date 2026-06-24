import { useEffect, useMemo, useRef, useState } from 'react';

const variants = [
  {
    name: 'Cawi Cam',
    body: '#ff6b4a',
    accent: '#2d2945',
    face: '#2d2945',
    cheek: '#ff9bb3',
    smile: '#4ade80',
    antenna: '#5eead4'
  },
  {
    name: 'Cawi Hồng',
    body: '#ec4899',
    accent: '#4c1d95',
    face: '#312e81',
    cheek: '#f9a8d4',
    smile: '#86efac',
    antenna: '#f9a8d4'
  },
  {
    name: 'Cawi Xanh',
    body: '#06b6d4',
    accent: '#083344',
    face: '#164e63',
    cheek: '#67e8f9',
    smile: '#bbf7d0',
    antenna: '#22d3ee'
  },
  {
    name: 'Cawi Tím',
    body: '#8b5cf6',
    accent: '#312e81',
    face: '#1e1b4b',
    cheek: '#c4b5fd',
    smile: '#a7f3d0',
    antenna: '#c4b5fd'
  },
  {
    name: 'Cawi Xanh lá',
    body: '#22c55e',
    accent: '#14532d',
    face: '#052e16',
    cheek: '#86efac',
    smile: '#ccfbf1',
    antenna: '#86efac'
  }
];

const edgePositions = ['bottom-right', 'bottom-left', 'top-left', 'top-right'];

function CawiRobot({ mode = 'floating', message = 'Mình là Cawi Robo!', page = 'home' }) {
  const [variantIndex, setVariantIndex] = useState(
    Number(localStorage.getItem('cawi-variant') || 0)
  );
  const [clickCount, setClickCount] = useState(0);
  const [positionIndex, setPositionIndex] = useState(0);
  const [moving, setMoving] = useState(false);
  const [nudging, setNudging] = useState(false);
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [head, setHead] = useState({ x: 0, y: 0 });

  const lastInteract = useRef(Date.now());
  const robotRef = useRef(null);

  const variant = variants[variantIndex % variants.length];
  const position = edgePositions[positionIndex % edgePositions.length];

  useEffect(() => {
    if (mode !== 'floating') return;
    setMoving(true);
    const timer = setTimeout(() => setMoving(false), 900);
    return () => clearTimeout(timer);
  }, [page, mode]);

  useEffect(() => {
    function markActivity() {
      lastInteract.current = Date.now();
      setMoving(false);
    }

    const events = ['mousemove', 'click', 'scroll', 'keydown', 'touchstart', 'input'];
    events.forEach((eventName) => {
      window.addEventListener(eventName, markActivity, { passive: true });
    });

    const idleInterval = setInterval(() => {
      if (mode !== 'floating') return;

      const inactive = Date.now() - lastInteract.current;

      if (inactive > 15000 && !moving) {
        setMoving(true);
        setPositionIndex((index) => index + 1);

        setTimeout(() => {
          setMoving(false);
        }, 2800);

        lastInteract.current = Date.now();
      }
    }, 1000);

    const nudgeInterval = setInterval(() => {
      if (mode !== 'floating') return;
      if (moving) return;

      setNudging(true);
      setTimeout(() => {
        setNudging(false);
      }, 800);
    }, 5000);

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, markActivity);
      });
      clearInterval(idleInterval);
      clearInterval(nudgeInterval);
    };
  }, [mode, moving]);

  useEffect(() => {
    function onMouseMove(event) {
      const rect = robotRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / 240));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / 200));

      setEye({
        x: dx * 5,
        y: dy * 4
      });

      setHead({
        x: dx * 7,
        y: dy * 3
      });
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const robotStyle = useMemo(
    () => ({
      '--body': variant.body,
      '--accent': variant.accent,
      '--face': variant.face,
      '--cheek': variant.cheek,
      '--smile': variant.smile,
      '--antenna-color': variant.antenna,
      '--eye-x': `${eye.x}px`,
      '--eye-y': `${eye.y}px`,
      '--head-rot': `${head.x}deg`,
      '--head-y': `${head.y}px`
    }),
    [variant, eye, head]
  );

  function handleRobotClick(event) {
    event.stopPropagation();

    const nextClick = clickCount + 1;

    if (nextClick >= 3) {
      const nextVariant = (variantIndex + 1) % variants.length;
      setVariantIndex(nextVariant);
      localStorage.setItem('cawi-variant', String(nextVariant));
      setClickCount(0);
    } else {
      setClickCount(nextClick);
    }
  }

  return (
    <aside
      ref={robotRef}
      className={`cawi cawi-${mode} cawi-${position} ${moving ? 'is-moving' : ''} ${
        nudging ? 'is-nudging' : ''
      }`}
      style={robotStyle}
      onClick={handleRobotClick}
      aria-label="Cawi Robo CartWise"
      title="Click 3 lần để đổi màu robot"
    >
      {mode === 'floating' && <div className="cawi-bubble">{message}</div>}
      {mode === 'inline' && <div className="cawi-bubble inline">{message}</div>}

      <div className="robot">
        <div className="robot-antenna"></div>

        <div className="robot-head-shell">
          <div className="robot-face">
            <span className="robot-eye robot-eye-left"></span>
            <span className="robot-eye robot-eye-right"></span>
            <span className="robot-cheek robot-cheek-left"></span>
            <span className="robot-cheek robot-cheek-right"></span>
            <span className="robot-mouth"></span>
          </div>
        </div>

        <div className="robot-neck"></div>

        <div className="robot-cart">
          <span className="robot-cart-handle"></span>
          <div className="robot-cart-grid"></div>
        </div>

        <div className="robot-wheels">
          <span></span>
          <span></span>
        </div>
      </div>
    </aside>
  );
}

export default CawiRobot;
