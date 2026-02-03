import { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LEVEL_SEQUENCE } from "../constants/levels";

const MySwal = withReactContent(Swal);

const Game = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("waldo_game_username") || "";
  });
  const { time, setIsRunning, handleReset } = useOutletContext();
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

  const unlockNextLevel = (currentLevelId) => {
    const unlocked = JSON.parse(localStorage.getItem("waldo_unlocked")) || [
      LEVEL_SEQUENCE[0],
    ];

    const currentIndex = LEVEL_SEQUENCE.indexOf(currentLevelId);

    if (currentIndex >= 0 && currentIndex < LEVEL_SEQUENCE.length - 1) {
      const nextLevel = LEVEL_SEQUENCE[currentIndex + 1];

      if (!unlocked.includes(nextLevel)) {
        unlocked.push(nextLevel);
        localStorage.setItem("waldo_unlocked", JSON.stringify(unlocked));

        toast.success("New Level Unlocked!");
      }
    }
  };

  const saveUserName = (newName) => {
    localStorage.setItem("waldo_game_username", newName);
    setUsername(newName);
  };

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
          username ? handleGameOver(time) : handleInitialGameOver(time);
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
    try {
      const toastId = toast.loading("Saving score to leaderboard");
      const response = await fetch("http://localhost:3000/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          time: time,
          levelName: levelData.name,
        }),
      });

      if (response.ok) {
        toast.success("Saved score to leaderboard", { id: toastId });
      } else {
        toast.error("Error saving score", { id: toastId });
      }

      unlockNextLevel(levelId);

      const result = await MySwal.fire({
        title: <strong>YOU FOUND EVERYONE!</strong>,
        html: <p>Your time was: {finalTime} seconds</p>,
        icon: "success",
        confirmButtonText: "Play Again",
        cancelButtonText: "Go Home",
        showCancelButton: true,
        allowOutsideClick: false,
      });

      if (result.isConfirmed) {
        handleReset();
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInitialGameOver = async (finalTime) => {
    try {
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
        showCancelButton: false,
        allowOutsideClick: false,
      });

      if (result.isConfirmed) {
        const toastId = toast.loading("Saving score to leaderboard");
        const userName = result.value;
        saveUserName(userName);
        const response = await fetch("http://localhost:3000/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userName,
            time: time,
            levelName: levelData.name,
          }),
        });
        if (response.ok) {
          toast.success("Saved score to leaderboard", { id: toastId });
        } else {
          toast.error("Error saving score", { id: toastId });
        }

        unlockNextLevel(levelId);

        const nextResult = await MySwal.fire({
          title: <strong>YOU FOUND EVERYONE!</strong>,
          html: <p>Your time was: {finalTime} seconds</p>,
          icon: "success",
          confirmButtonText: "Play Again",
          cancelButtonText: "Go Home",
          showCancelButton: true,
          allowOutsideClick: false,
        });

        if (nextResult.isConfirmed) {
          handleReset();
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
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
