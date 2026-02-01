import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = () => {
  const [resetKey, setResetKey] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

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
    if (location.pathname === "/") {
      setTime(0);
      setIsRunning(false);
    }
  }, [location.pathname]);

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
          <nav className="nav-links">
            <Link to="/instructions">How to Play</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </nav>
          <div className="timer">{formatTime(time)}</div>
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
