import { useEffect, useMemo, useRef, useState } from 'react';

const variants = [
  { name: 'Cawi Cam', body: '#fb923c', accent: '#111827', blush: '#f97316', antenna: '●' },
  { name: 'Cawi Hồng', body: '#ec4899', accent: '#6d28d9', blush: '#f9a8d4', antenna: '◆' },
  { name: 'Cawi Xanh', body: '#06b6d4', accent: '#0f766e', blush: '#67e8f9', antenna: '★' },
  { name: 'Cawi Gold', body: '#facc15', accent: '#92400e', blush: '#fde68a', antenna: '✦' }
];

const edgePositions = ['bottom-left', 'bottom-right', 'top-right', 'top-left'];

function CawiRobot({ mode = 'floating', message = 'Mình là Cawi Robo!', page = 'home' }) {
  const [variantIndex, setVariantIndex] = useState(Number(localStorage.getItem('cawi-variant') || 0));
  const [clickCount, setClickCount] = useState(0);
  const [positionIndex, setPositionIndex] = useState(0);
  const [moving, setMoving] = useState(false);
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
    function markActivity() { lastInteract.current = Date.now(); }
    const events = ['mousemove', 'click', 'scroll', 'keydown', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, markActivity, { passive: true }));
    const interval = setInterval(() => {
      if (mode !== 'floating') return;
      const inactive = Date.now() - lastInteract.current;
      if (inactive > 10000 && !moving) {
        setMoving(true);
        setPositionIndex((i) => i + 1);
        lastInteract.current = Date.now();
        setTimeout(() => setMoving(false), 2600);
      }
    }, 1200);
    return () => {
      events.forEach((e) => window.removeEventListener(e, markActivity));
      clearInterval(interval);
    };
  }, [mode, moving]);

  useEffect(() => {
    function onMouseMove(e) {
      const rect = robotRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - centerX) / 260));
      const dy = Math.max(-1, Math.min(1, (e.clientY - centerY) / 220));
      setEye({ x: dx * 8, y: dy * 6 });
      setHead({ x: dx * 5, y: dy * 4 });
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const robotStyle = useMemo(() => ({ '--body': variant.body, '--accent': variant.accent, '--blush': variant.blush, '--eye-x': `${eye.x}px`, '--eye-y': `${eye.y}px`, '--head-rot': `${head.x}deg`, '--head-y': `${head.y}px` }), [variant, eye, head]);

  function handleRobotClick() {
    const nextClick = clickCount + 1;
    setClickCount(nextClick);
    if (nextClick >= 3) {
      const nextVariant = (variantIndex + 1) % variants.length;
      setVariantIndex(nextVariant);
      localStorage.setItem('cawi-variant', String(nextVariant));
      setClickCount(0);
    }
  }

  return (
    <aside
      ref={robotRef}
      className={`cawi cawi-${mode} cawi-${position} ${moving ? 'is-moving' : ''}`}
      style={robotStyle}
      onClick={handleRobotClick}
      aria-label="Cawi Robo CartWise"
      title="Click 3 lần để đổi ngoại hình robot"
    >
      {mode === 'floating' && <div className="cawi-bubble">{message}</div>}
      {mode === 'inline' && <div className="cawi-bubble inline">{message}</div>}
      <div className="robot">
        <div className="antenna"><span>{variant.antenna}</span></div>
        <div className="head">
          <div className="screen">
            <span className="eye left"></span>
            <span className="eye right"></span>
          </div>
          <div className="mouth"></div>
        </div>
        <div className="neck"></div>
        <div className="body">
          <div className="core">CW</div>
          <span className="arm left-arm"></span>
          <span className="arm right-arm"></span>
        </div>
        <div className="wheels"><span></span><span></span></div>
      </div>
    </aside>
  );
}

export default CawiRobot;
