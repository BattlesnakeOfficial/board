import React from "react";
import styled from "react-emotion";

import BlankState from "./blank-state";
import LoadingIndicator from "./loading-indicator";
import Board from "./board";
import Scoreboard from "./scoreboard";
import MediaControls from "./mediaControls";
import Logo from "./logo";
import { breakpoints, colors, themes } from "../theme";

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
  width: "100%",
  height: "100%"
});

const HeaderWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginTop: "1rem",
  paddingRight: "1rem",
  textAlign: "center"
});

const LogoWrapper = styled("div")`
  width: 100%;
  height: 6rem;

  @media (min-width: ${breakpoints.lg}) {
    height: 12rem;
  }
`;

const TurnCount = styled("div")({
  fontSize: "1.4rem"
});

const BoardWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  @media (min-width: ${breakpoints.md}) {
    width: ${({ hideScoreboard }) => (hideScoreboard ? "100%" : "65vw")};
  }
`;

const ScoreboardWrapper = styled("div")`
  display: none;
  width: 35vw;
  margin-left: 2rem;

  @media (min-width: ${breakpoints.md}) {
    display: ${({ hide }) => (hide ? "none" : "block")};
  }
`;

class Game extends React.Component {
  componentWillMount() {
    const { options } = this.props;

    this.theme = options.boardTheme ? options.boardTheme : themes.light;

    if (options.game && options.engine) {
      this.hideScoreboard = options.hideScoreboard === "true";
      this.props.setGameOptions(options);
      this.props.fetchFrames();
    } else {
      this.invalidArgs = true;
    }
  }

  render() {
    const { currentFrame } = this.props;

    if (this.invalidArgs) {
      return <BlankState />;
    }

    if (currentFrame) {
      return this.renderGame();
    }

    return <LoadingIndicator />;
  }

  renderGame() {
    const { currentFrame } = this.props;
    return (
      <PageWrapper theme={this.theme}>
        <GameBoardWrapper>
          <BoardWrapper hideScoreboard={this.hideScoreboard}>
            <Board
              snakes={this.props.currentFrame.snakes}
              food={this.props.currentFrame.food}
              columns={this.props.grid.width}
              rows={this.props.grid.height}
              highlightedSnake={this.props.highlightedSnake}
              theme={this.theme}
            />
            <MediaControls
              currentFrame={this.props.currentFrame}
              hideControls={this.props.options.hideMediaControls === "true"}
              toggleTheme={this.props.toggleTheme}
              reloadGame={this.props.reloadGame}
              toggleGamePause={this.props.toggleGamePause}
              stepBackwardFrame={this.props.stepBackwardFrame}
              stepForwardFrame={this.props.stepForwardFrame}
              paused={this.props.paused}
              theme={this.theme}
            />
          </BoardWrapper>
          {!this.hideScoreboard && (
            <ScoreboardWrapper>
              <HeaderWrapper>
                <LogoWrapper>
                  <Logo />
                </LogoWrapper>
                <TurnCount>Turn: {currentFrame.turn}</TurnCount>
              </HeaderWrapper>
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
