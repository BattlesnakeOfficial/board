import React from "react";

import { FlexContainer, FlexWrapContainer } from "./styling";
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
        <FlexWrapContainer>
          {this.props.snakes
            ? this.props.snakes.map((snake, i) => (
                <Avatar snake={snake} key={"avatar" + i} />
              ))
            : undefined}
        </FlexWrapContainer>
        <FlexContainer id="game_board">
          <Board
            snakes={this.props.snakes}
            food={this.props.food}
            width={this.props.grid.width}
            height={this.props.grid.height}
          />
        </FlexContainer>
      </div>
    );
  }
}

export default Game;
