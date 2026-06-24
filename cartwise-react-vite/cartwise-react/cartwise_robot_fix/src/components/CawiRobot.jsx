import { useEffect, useState } from 'react';

function CawiRobot({ mode = 'floating', message = 'Chào bạn, mình là CartwiRo!' }) {
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [themeIndex, setThemeIndex] = useState(Number(localStorage.getItem('cawi-theme') || 0));

  useEffect(() => {
    setBubbleVisible(true);
    const timer = setTimeout(() => setBubbleVisible(false), 10000);
    return () => clearTimeout(timer);
  }, [message]);

  function handleRobotClick() {
    const nextTheme = (themeIndex + 1) % 5;
    setThemeIndex(nextTheme);
    localStorage.setItem('cawi-theme', String(nextTheme));
    setBubbleVisible(true);
    setTimeout(() => setBubbleVisible(false), 10000);
  }

  return (
    <div className={`cartwise-robot-widget cawi-${mode} theme-${themeIndex}`}>
      {bubbleVisible && (
        <div className="robot-chat-bubble">
          <p>{message || 'Chào bạn, mình là CartwiRo!'}</p>
          <button
            type="button"
            className="robot-close-btn"
            onClick={(event) => {
              event.stopPropagation();
              setBubbleVisible(false);
            }}
            aria-label="Đóng lời thoại robot"
          >
            ×
          </button>
        </div>
      )}

      <div className="robot-avatar-container" onClick={handleRobotClick}>
        <img src="/robot-cawi-v4.png" alt="CartWise Robot" className="robot-img" />
      </div>
    </div>
  );
}

export default CawiRobot;
