import { Link } from "react-router-dom";

const HowToPlay = () => {
  return (
    <div className="how-to-play-container">
      <div className="htp-content">
        <h1 className="htp-title">How to Play</h1>

        <div className="htp-image-container">
          <img
            src="/waldo_images/waldo_characters.jpg"
            alt="Characters to find"
            className="htp-hero-image"
          />
        </div>

        <div className="htp-steps">
          <div className="htp-step-card">
            <div className="step-number">1</div>
            <h3>Choose a Level</h3>
            <p>
              Select a scene from the home page. Levels get harder as you go!
            </p>
          </div>

          <div className="htp-step-card">
            <div className="step-number">2</div>
            <h3>Spot the Characters</h3>
            <p>Look for the characters shown at the top of the screen.</p>
          </div>

          <div className="htp-step-card">
            <div className="step-number">3</div>
            <h3>Tag & Win</h3>
            <p>
              Tap on a character and select their name from the list. Find
              everyone fast to top the leaderboard!
            </p>
          </div>
        </div>

        <Link to="/" className="btn-primary htp-cta">
          Start Playing Now
        </Link>
      </div>
    </div>
  );
};

export default HowToPlay;
