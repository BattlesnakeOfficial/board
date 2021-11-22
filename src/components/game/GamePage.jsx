import { connect } from "react-redux";
import { parseQueryString } from "../../utils/url";
import Game from "../../components/game";
import {
  fetchFrames,
  reloadGame,
  toggleGamePause,
  toggleTheme,
  setGameOptions,
  stepForwardFrame,
  stepBackwardFrame,
  highlightSnake,
  togglePlayButtons
} from "../../actions";
import { rehydrateLocalSettings, storageAvailable } from "../../app/storage";

const options = parseQueryString(window.location.search);
if (typeof options.autoplay !== "undefined") {
  options.autoplay = options.autoplay === "true";
}

let storedSettings = {};
if (storageAvailable("localStorage")) {
  storedSettings = rehydrateLocalSettings();
} else {
  console.info(
    "Please enable localStorage for an improved experience that allows you to persist board settings."
  );
}

const mapStateToProps = state => {
  const gameState = state.game;
  const settings = state.settings;

  return {
    options: { ...storedSettings, ...settings, ...options },
    ruleset: gameState.ruleset,
    grid: gameState.grid,
    gameNotFound: gameState.gameNotFound,
    paused: gameState.paused,
    currentFrame: gameState.currentFrame,
    frames: gameState.frames,
    highlightedSnake: gameState.highlightedSnake,
    theme: settings.theme
  };
};

const mapDispatchToProps = dispatch => ({
  setGameOptions: options => dispatch(setGameOptions(options)),
  fetchFrames: () => dispatch(fetchFrames()),
  toggleTheme: theme => dispatch(toggleTheme(theme)),
  reloadGame: () => dispatch(reloadGame()),
  toggleGamePause: paused => dispatch(toggleGamePause(paused)),
  stepForwardFrame: () => dispatch(stepForwardFrame()),
  stepBackwardFrame: () => dispatch(stepBackwardFrame()),
  highlightSnake: snakeId => dispatch(highlightSnake(snakeId)),
  togglePlayButtons: showHide => dispatch(togglePlayButtons(showHide))
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
