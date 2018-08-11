import React from "react";
import Board from "./board";
import BlankState from "./blank-state";

class Game extends React.Component {
  componentWillMount() {
    if (this.props.options.game && this.props.options.engine) {
      this.props.fetchFrames(
        this.props.options.game,
        this.props.options.engine
      );
    } else {
      this.invalidArgs = true;
    }
  }

  render() {
    if (this.invalidArgs) {
      return <BlankState />;
    } else {
      return this.renderGame();
    }
  }

  renderGame() {
    return (
      <Board
        snakes={this.props.snakes}
        food={this.props.food}
        columns={this.props.grid.width}
        rows={this.props.grid.height}
      />
    );
  }
}

export default Game;
