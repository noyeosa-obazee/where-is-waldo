import { Link } from "react-router-dom";

const levels = [
  {
    id: "beach",
    name: "The Beach",
    img: "/waldo_images/waldo_beach.jpg",
  },
  {
    id: "snow",
    name: "Ski Slopes",
    img: "/waldo_images/waldo_snow.jpg",
  },
  {
    id: "space",
    name: "Space Station",
    img: "/waldo_images/waldo_space.jpg",
  },
];

const Home = () => {
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
              to={`/game/${level.id}`}
              className="level-link"
            >
              <div className="level-card">
                <img src={level.img} alt={level.name} className="level-thumb" />
                <h3 style={{ marginTop: "10px" }}>{level.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
