import { Route, Routes } from "react-router-dom";
import GamePage from "./components/game/GamePage";
import SettingsPage from "./components/settings/SettingsPage";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/*" element={<GamePage />} />
    </Routes>
  );
};

export default App;
