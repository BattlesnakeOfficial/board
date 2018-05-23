import { connect } from "react-redux";
import { parseQueryString } from "../utils/url";
import Board from "../components/board";
import { fetchFrames } from "../actions";

const options = parseQueryString(window.location.search);

const mapStateToProps = state => {
  return {
    options: options,
    grid: state.grid
  };
};

const mapDispatchToProps = dispatch => ({
  fetchFrames: (game, engine) => dispatch(fetchFrames(game, engine))
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
