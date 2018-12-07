import React from "react";
import styled from "react-emotion";

import Board from "./board";
import Scoreboard from "./scoreboard";
import BlankState from "./blank-state";

const GameBoardWrapper = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  padding: "0 2rem",
  width: "100%"
});

const BoardWrapper = styled("div")({
  width: "65vw"
});

const ScoreboardWrapper = styled("div")({
  width: "35vw",
  marginLeft: "2rem"
});

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
      <GameBoardWrapper>
        <BoardWrapper>
          <Board
            snakes={this.props.snakes}
            food={this.props.food}
            columns={this.props.grid.width}
            rows={this.props.grid.height}
          />
        </BoardWrapper>
        <ScoreboardWrapper>
          <Scoreboard snakes={this.props.snakes} food={this.props.food} />
        </ScoreboardWrapper>
      </GameBoardWrapper>
    );
  }
}

export default Game;
