import { Route, Switch } from "react-router-dom";
import GamePage from "./components/game/GamePage";
import SettingsPage from "./components/settings/SettingsPage";
import "./App.css";

const App = () => {
  return (
    <main className="light">
      <Switch>
        <Route path="/settings" component={SettingsPage} />
        <Route component={GamePage} />
      </Switch>
    </main>
  );
};

export default App;
