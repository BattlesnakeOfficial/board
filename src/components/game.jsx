import React from "react";
import Avatar from "./avatar";
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
      <div>
        <div>
          {this.props.snakes
            ? this.props.snakes.map((snake, i) => (
                <Avatar snake={snake} key={"avatar" + i} />
              ))
            : undefined}
        </div>

        <Board
          snakes={this.props.snakes}
          food={this.props.food}
          width={this.props.grid.width}
          height={this.props.grid.height}
        />
      </div>
    );
  }
}

export default Game;
