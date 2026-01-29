import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

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
          <span>Find 5 Characters</span>
        </div>

        <div className="timer">{formatTime(time)}</div>
      </header>
      <div className="app-body">
        <Outlet context={{ setTime, setIsRunning, time }} />
      </div>
    </div>
  );
};

export default Layout;
