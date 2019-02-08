import React from "react";
import styled from "react-emotion";

import BlankState from "./blank-state";
import Board from "./board";
import Scoreboard from "./scoreboard";
import MediaControls from "./mediaControls";
import { colors, themes } from "../theme";

const PageWrapper = styled("div")`
  position: relative;
  height: 100%;
  width: 100%;
  background: ${({ theme }) =>
    theme === themes.dark ? colors.purple : "transparent"};
  background: ${({ theme }) =>
    theme === themes.dark
      ? `linear-gradient(45deg, #000 0%, ${colors.purple} 100%)`
      : "transparent"};
`;

const GameBoardWrapper = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  padding: "0 2rem",
  width: "100%",
  height: "100%"
});

const BoardWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "65vw",
  height: "100%"
});

const ScoreboardWrapper = styled("div")({
  width: "35vw",
  marginLeft: "2rem"
});

class Game extends React.Component {
  componentWillMount() {
    const { options } = this.props;

    this.theme = this.props.options.boardTheme
      ? this.props.options.boardTheme
      : themes.light;

    if (options.game && options.engine) {
      this.props.setEngineOptions(options);
      this.props.fetchFrames();
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

    return <div>Loading game...</div>;
  }

  renderGame() {
    return (
      <PageWrapper theme={this.theme}>
        <GameBoardWrapper>
          <BoardWrapper>
            <Board
              snakes={this.props.currentFrame.snakes}
              food={this.props.currentFrame.food}
              columns={this.props.grid.width}
              rows={this.props.grid.height}
              highlightedSnake={this.props.highlightedSnake}
              theme={this.theme}
            />
            <MediaControls
              hideControls={this.props.options.hideMediaControls !== "true"}
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
                theme={this.theme}
              />
            </ScoreboardWrapper>
          )}
        </GameBoardWrapper>
      </PageWrapper>
    );
  }
}

export default Game;
