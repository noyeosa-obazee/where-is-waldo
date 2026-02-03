import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = () => {
  const [resetKey, setResetKey] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleReset = () => {
    setTime(0);
    setIsRunning(true);
    setResetKey((prev) => prev + 1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="app">
      <header className="game-header">
        <Link to="/" className="logo" style={{ textDecoration: "none" }}>
          Where's{" "}
          <span style={{ color: "var(--color-secondary)" }}>Waldo?</span>
        </Link>
        <div className="tracker">
          <span className="tracker-label">Find:</span>
          <img
            src="/waldo_images/waldo_characters.jpg"
            alt="Waldo Characters"
            className="tracker-image"
          />
        </div>
        <div className="header-right">
          <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>

            <Link to="/instructions" onClick={() => setIsMenuOpen(false)}>
              How to Play
            </Link>
            <Link to="/leaderboard" onClick={() => setIsMenuOpen(false)}>
              Leaderboard
            </Link>
            <Link to="/scores" onClick={() => setIsMenuOpen(false)}>
              My Scores
            </Link>
          </div>

          <div className="timer">{formatTime(time)}</div>
          <div
            className={`hamburger ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </header>
      <div className="app-body">
        <Outlet
          key={resetKey}
          context={{ setTime, setIsRunning, time, formatTime, handleReset }}
        />
      </div>
    </div>
  );
};

export default Layout;
