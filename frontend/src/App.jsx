import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import Scores from "./pages/Scores";
import HowToPlay from "./pages/HowToPlay";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="game/:levelId" element={<Game />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="scores" element={<Scores />} />
          <Route path="instructions" element={<HowToPlay />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
