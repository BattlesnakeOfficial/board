import { connect } from "react-redux";
import { parseQueryString } from "../utils/url";
import Game from "../components/game";
import {
  fetchFrames,
  playAllFrames,
  toggleGamePause,
  stepForwardFrame,
  stepBackwardFrame
} from "../actions";

const options = parseQueryString(window.location.search);

const mapStateToProps = state => {
  return {
    options: options,
    grid: state.grid,
    paused: state.paused,
    currentFrame: state.currentFrame,
    frames: state.frames
  };
};

const mapDispatchToProps = dispatch => ({
  fetchFrames: (game, engine) => dispatch(fetchFrames(game, engine)),
  startGame: () => dispatch(playAllFrames()),
  toggleGamePause: paused => dispatch(toggleGamePause(paused)),
  stepForwardFrame: () => dispatch(stepForwardFrame()),
  stepBackwardFrame: () => dispatch(stepBackwardFrame())
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
