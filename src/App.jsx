import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import GamePage from "./components/game/GamePage";
import SettingsPage from "./components/settings/SettingsPage";
import "./App.css";

const App = props => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/settings" component={SettingsPage} />
          <Route>
            <GamePage engine={props.engine} game={props.game} />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
