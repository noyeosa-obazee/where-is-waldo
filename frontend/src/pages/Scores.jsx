import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

const Scores = () => {
  const username = localStorage.getItem("waldo_game_username");
  const { formatTime } = useOutletContext();
  const [scores, setScores] = useState([]);
  const [currentLevel, setCurrentLevel] = useState("beach");
  const [loading, setLoading] = useState(true);

  const levels = ["beach", "giants", "space", "underwater", "food", "toystore"];

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/scores/${currentLevel}/${username}`,
        );
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [currentLevel]);

  return (
    <div className="leaderboard-container">
      <h1>My Scores</h1>

      <div className="level-tabs">
        {levels.map((level) => (
          <button
            key={level}
            className={`tab-btn ${currentLevel === level ? "active" : ""}`}
            onClick={() => setCurrentLevel(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <div className="score-table-wrapper">
        {loading ? (
          <p>Loading scores...</p>
        ) : scores.length === 0 ? (
          <p className="no-scores">No scores yet! Be the first.</p>
        ) : (
          <table className="score-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={score.id}>
                  <td className="player-time">{formatTime(score.time)}</td>
                  <td>{new Date(score.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Link to="/" className="back-btn">
        Back to Home
      </Link>
    </div>
  );
};

export default Scores;
