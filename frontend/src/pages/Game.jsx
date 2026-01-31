import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Game = () => {
  const { levelId } = useParams();
  const { setIsRunning } = useOutletContext();
  const [levelData, setLevelData] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTarget, setShowTarget] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [uiPos, setUiPos] = useState({ x: 0, y: 0 });
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [foundMarkers, setFoundMarkers] = useState([]);

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
    const img = e.target;
    const rect = img.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    console.log(`Sending: ${xPercent.toFixed(2)}%, ${yPercent.toFixed(2)}%`);

    setClickPos({ x: xPercent, y: yPercent });
    setUiPos({ x: x, y: y });
    setShowTarget(true);
  };

  const handleValidation = async (characterName) => {
    if (foundCharacters.includes(characterName)) {
      toast(`You already found ${characterName}!`);
      return;
    }
    const toastId = toast.loading(`Checking for ${characterName}...`);
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
      const data = await response.json();
      if (data.found) {
        const newFoundList = [...foundCharacters, data.character];
        setFoundCharacters(newFoundList);

        const newMarker = {
          name: characterName,
          x: clickPos.x,
          y: clickPos.y,
        };
        setFoundMarkers((prev) => [...prev, newMarker]);

        toast.success(`You found ${data.character}!`, {
          duration: 2000,
          icon: "🎉",
          id: toastId,
        });

        if (newFoundList.length === characters.length) {
          setIsRunning(false);
          handleGameOver();
        }
      } else {
        toast.error(`That's not ${characterName}!`, {
          duration: 1000,
          icon: "❌",
          id: toastId,
        });
      }
    } catch (err) {
      toast.error("Connection failed!", {
        id: toastId,
      });
      console.error(err);
    }

    setShowTarget(false);
  };

  const handleGameOver = async (finalTime) => {
    const result = await MySwal.fire({
      title: <strong>YOU FOUND EVERYONE!</strong>,
      html: <p>Your time was: {finalTime} seconds</p>,
      icon: "success",
      input: "text",
      inputLabel: "Enter your name for the leaderboard:",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
      confirmButtonText: "Submit Score",
      showCancelButton: true,
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      const userName = result.value;
      // Send to backend API...
      console.log(`Saving score for ${userName}...`);
    }
  };

  const removeTarget = () => {
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
            left: uiPos.x,
            top: uiPos.y,
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
            <div>
              <button
                className="dropdown-item btn-cancel"
                onClick={removeTarget}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {foundMarkers.map((marker) => (
        <div
          key={marker.name}
          className="found-marker"
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
          }}
        >
          <span className="marker-label">{marker.name}</span>
        </div>
      ))}
    </main>
  );
};

export default Game;
