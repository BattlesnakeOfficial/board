import React from "react";
import styled from "react-emotion";

import BlankState from "./blank-state";
import Board from "./board";
import Scoreboard from "./scoreboard";
import MediaControls from "./mediaControls";

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
    }

    if (this.props.currentFrame) {
      return this.renderGame();
    }

    return <div>Loading...</div>;
  }

  renderGame() {
    return (
      <React.Fragment>
        <GameBoardWrapper>
          <BoardWrapper>
            <Board
              snakes={this.props.currentFrame.snakes}
              food={this.props.currentFrame.food}
              columns={this.props.grid.width}
              rows={this.props.grid.height}
            />
          </BoardWrapper>
          <ScoreboardWrapper>
            <Scoreboard
              snakes={this.props.currentFrame.snakes}
              food={this.props.currentFrame.food}
            />
          </ScoreboardWrapper>
        </GameBoardWrapper>
        <MediaControls
          toggleGamePause={this.props.toggleGamePause}
          stepBackwardFrame={this.props.stepBackwardFrame}
          stepForwardFrame={this.props.stepForwardFrame}
          paused={this.props.paused}
        />
      </React.Fragment>
    );
  }
}

export default Game;
