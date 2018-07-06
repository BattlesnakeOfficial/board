import { connect } from "react-redux";
import { parseQueryString } from "../utils/url";
import Game from "../components/game";
import { fetchFrames } from "../actions";

const options = parseQueryString(window.location.search);

const mapStateToProps = state => {
  return {
    options: options,
    grid: state.grid,
    snakes: state.snakes,
    food: state.food
  };
};

const mapDispatchToProps = dispatch => ({
  fetchFrames: (game, engine) => dispatch(fetchFrames(game, engine))
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
