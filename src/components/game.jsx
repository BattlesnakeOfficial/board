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
  display: "flex",
  flexDirection: "column",
  width: "65vw"
});

const ScoreboardWrapper = styled("div")({
  width: "35vw",
  marginLeft: "2rem"
});

class Game extends React.Component {
  componentWillMount() {
    let autoplay = false;

    if (this.props.options.game && this.props.options.engine) {
      if (this.props.options.autoplay === "true") {
        autoplay = true;
      }

      this.props.fetchFrames(
        this.props.options.game,
        this.props.options.engine,
        autoplay
      );
    } else {
      this.invalidArgs = true;
    }
  }

  render() {
    console.log(this.props.options);
    if (this.invalidArgs) {
      return <BlankState />;
    }

    if (this.props.currentFrame) {
      return this.renderGame();
    }

    return <div>Loading game...</div>;
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
              highlightedSnake={this.props.highlightedSnake}
            />
            <MediaControls
              toggleGamePause={this.props.toggleGamePause}
              stepBackwardFrame={this.props.stepBackwardFrame}
              stepForwardFrame={this.props.stepForwardFrame}
              paused={this.props.paused}
            />
          </BoardWrapper>
          {this.props.options.hideScoreboard !== "true" && (
            <ScoreboardWrapper>
              <Scoreboard
                turn={this.props.currentFrame.turn}
                snakes={this.props.currentFrame.snakes}
                food={this.props.currentFrame.food}
                highlightSnake={this.props.highlightSnake}
              />
            </ScoreboardWrapper>
          )}
        </GameBoardWrapper>
      </React.Fragment>
    );
  }
}

export default Game;
