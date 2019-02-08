import { connect } from "react-redux";
import { parseQueryString } from "../utils/url";
import Game from "../components/game";
import {
  fetchFrames,
  reloadGame,
  toggleGamePause,
  setEngineOptions,
  stepForwardFrame,
  stepBackwardFrame,
  highlightSnake
} from "../actions";

const options = parseQueryString(window.location.search);

const mapStateToProps = state => {
  return {
    options: options,
    grid: state.grid,
    paused: state.paused,
    currentFrame: state.currentFrame,
    frames: state.frames,
    highlightedSnake: state.highlightedSnake,
    gameStatus: state.gameStatus
  };
};

const mapDispatchToProps = dispatch => ({
  setEngineOptions: options => dispatch(setEngineOptions(options)),
  fetchFrames: () => dispatch(fetchFrames()),
  reloadGame: () => dispatch(reloadGame()),
  toggleGamePause: paused => dispatch(toggleGamePause(paused)),
  stepForwardFrame: () => dispatch(stepForwardFrame()),
  stepBackwardFrame: () => dispatch(stepBackwardFrame()),
  highlightSnake: snakeId => dispatch(highlightSnake(snakeId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
