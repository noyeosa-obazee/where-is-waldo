import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";

const Game = () => {
  const { levelId } = useParams();
  const { setIsRunning } = useOutletContext();
  const [levelData, setLevelData] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTarget, setShowTarget] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/levels/${levelId}`,
        );
        const data = await response.json();

        if (response.ok) {
          setLevelData(data);
          setCharacters(data.characters);
          setIsRunning(true);
        } else {
          console.error("Failed to load level");
        }
      } catch (err) {
        console.error("Error fetching level:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
    return () => setIsRunning(false);
  }, [levelId]);

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    console.log(
      `{ minX: ${x - 20}, maxX: ${x + 20}, minY: ${y - 20}, maxY: ${y + 20} }`,
    );

    setClickPos({ x, y });
    setMenuPos({ x: e.pageX, y: e.pageY });
    setShowTarget(!showTarget);
  };

  const handleValidation = async (characterName) => {
    try {
      const response = await fetch("http://localhost:3000/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelId: levelData.name,
          characterName: characterName,
          x: clickPos.x,
          y: clickPos.y,
        }),
      });
    } catch (err) {
      console.error(err);
    }

    setShowTarget(false);
  };

  if (loading)
    return <div style={{ textAlign: "center" }}>Loading Game...</div>;
  if (!levelData)
    return <div style={{ textAlign: "center" }}>Level not found!</div>;

  return (
    <main className="game-board">
      <img
        src={`/waldo_images/waldo_${levelData.name}.jpg`}
        alt="Find Waldo and his friends (or enemies)"
        className="game-image"
        onClick={handleImageClick}
      />
      {showTarget && (
        <div
          className="target-box"
          style={{
            left: clickPos.x,
            top: clickPos.y,
          }}
        >
          <div className="dropdown-menu">
            {characters.map((char) => (
              <div
                key={char.id}
                className="dropdown-item"
                onClick={() => handleValidation(char.name)}
              >
                Found {char.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Game;
