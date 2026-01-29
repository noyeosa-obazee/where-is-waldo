import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";

const Game = () => {
  const { levelId } = useParams();
  const { setIsRunning } = useOutletContext();

  const [showTarget, setShowTarget] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsRunning(true);
    return () => setIsRunning(false);
  }, []);

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClickPos({ x, y });
    setMenuPos({ x: e.pageX, y: e.pageY });
    setShowTarget(!showTarget);
  };

  const handleValidation = async (characterName) => {
    console.log(
      `Checking for ${characterName} at X:${clickPos.x} Y:${clickPos.y}`,
    );

    // TODO: Send this data to my Backend API
    // const response = await fetch('/api/validate', { ... })

    setShowTarget(false);
  };

  return (
    <main className="game-board">
      <img
        src={`/waldo_images/waldo_snow.jpg`}
        alt="Find Waldo"
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
            {["Waldo", "Odlaw", "Woof", "Wenda", "Wizard Whitebeard"].map(
              (char) => (
                <div
                  key={char}
                  className="dropdown-item"
                  onClick={() => handleValidation(char)}
                >
                  Found {char}
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Game;
