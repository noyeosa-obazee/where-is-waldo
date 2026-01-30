import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameLevels = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/levels/`);
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
          {levels.map((level) => (
            <Link
              key={level.id}
              to={`/game/${level.name}`}
              className="level-link"
            >
              <div className="level-card">
                <img
                  src={`/waldo_images/waldo_${level.name}.jpg`}
                  alt={level.name}
                  className="level-thumb"
                />
                <h3 style={{ marginTop: "10px" }}>
                  {level.name.charAt(0).toUpperCase() + level.name.slice(1)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
