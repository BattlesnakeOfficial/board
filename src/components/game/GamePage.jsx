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
  stepToTurn,
  highlightSnake,
  pauseGameAction,
  togglePlayButtons
} from "../../actions";

const options = parseQueryString(window.location.search);
if (typeof options.autoplay !== "undefined") {
  options.autoplay = options.autoplay === "true";
}
if (typeof options.showFrameScrubber !== "undefined") {
  options.showFrameScrubber = options.showFrameScrubber === "true";
}

const mapStateToProps = state => {
  const gameState = state.game;
  const settings = state.settings;

  return {
    options: { ...settings, ...options },
    ruleset: gameState.ruleset,
    grid: gameState.grid,
    gameNotFound: gameState.gameNotFound,
    paused: gameState.paused,
    currentFrame: gameState.currentFrame,
    frames: gameState.frames,
    highlightedSnake: gameState.highlightedSnake,
    theme: options.boardTheme || settings.theme,
    hasAllFrames: !!gameState.endEvent
  };
};

const mapDispatchToProps = dispatch => ({
  setGameOptions: options => dispatch(setGameOptions(options)),
  fetchFrames: () => dispatch(fetchFrames()),
  toggleTheme: theme => dispatch(toggleTheme(theme)),
  reloadGame: () => dispatch(reloadGame()),
  toggleGamePause: paused => dispatch(toggleGamePause(paused)),
  pauseGame: () => dispatch(pauseGameAction()),
  stepForwardFrame: () => dispatch(stepForwardFrame()),
  stepBackwardFrame: () => dispatch(stepBackwardFrame()),
  stepToTurn: i => dispatch(stepToTurn(i)),
  highlightSnake: snakeId => dispatch(highlightSnake(snakeId)),
  togglePlayButtons: showHide => dispatch(togglePlayButtons(showHide))
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
