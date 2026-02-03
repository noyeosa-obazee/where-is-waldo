import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { LEVEL_SEQUENCE } from "../constants/levels";

const Home = () => {
  const backendUrl = import.meta.env.VITE_API_URL;
  const [unlockedLevels, setUnlockedLevels] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameLevels = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/levels/`);
        const data = await response.json();
        if (response.ok) {
          setLevels(data);
        } else {
          console.error("Failed to load levels");
        }
      } catch (err) {
        console.error("Error fetching levels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGameLevels();
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waldo_unlocked")) || [
      LEVEL_SEQUENCE[0],
    ];
    setUnlockedLevels(stored);
  }, []);

  if (loading)
    return <div style={{ textAlign: "center" }}>Loading Game Levels...</div>;

  return (
    <div
      className="modal-overlay"
      style={{ position: "relative", background: "transparent" }}
    >
      <div className="modal-content" style={{ maxWidth: "800px" }}>
        <h1 className="modal-title">Choose a Level</h1>
        <div className="level-select-grid">
          {levels.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.name);

            const CardContent = (
              <div
                className={`level-card ${isUnlocked ? "unlocked" : "locked"}`}
              >
                {!isUnlocked && (
                  <div className="lock-overlay">
                    <span className="lock-icon">🔒</span>
                    <span className="lock-text">Locked</span>
                  </div>
                )}

                <img
                  src={`/waldo_images/waldo_${level.name}.jpg`}
                  alt={level.name}
                  className="level-thumb"
                />
                <h3>
                  {level.name.charAt(0).toUpperCase() + level.name.slice(1)}
                </h3>
              </div>
            );

            return isUnlocked ? (
              <Link
                key={level.id}
                to={`/game/${level.name}`}
                className="level-link"
              >
                {CardContent}
              </Link>
            ) : (
              <div key={level.id} className="level-link-disabled">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
