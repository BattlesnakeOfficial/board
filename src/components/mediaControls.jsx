import React from "react";
import styled from "react-emotion";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { themes } from "../theme";

const MediaControlsWrapper = styled("div")`
  margin-top: 1rem;
  width: 100%;
`;

const TurnCount = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  marginBottom: "2rem",
  fontSize: "1.4rem"
});

const ButtonWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  marginBottom: "2rem"
});

const Button = styled("button")`
  display: inline-block;
  min-width: 3rem;
  text-align: center;
  background: transparent;
  color: ${({ theme }) => (theme === themes.dark ? "#eee" : "#333")};
  font-size: 1.4rem;
  border: none;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

class MediaControls extends React.Component {
  componentWillMount() {
    this.keyEvents = ["r", "left", "right", "space"];
  }

  render() {
    return this.renderControls();
  }

  handleReload = () => {
    this.props.reloadGame();
  };

  handlePlayPause = () => {
    this.props.toggleGamePause();
  };

  handleBackward = () => {
    this.props.stepBackwardFrame();
  };

  handleForward = () => {
    this.props.stepForwardFrame();
  };

  handleKeyEvent = key => {
    switch (key) {
      case "r":
        this.handleReload();
        break;
      case "left":
        this.handleBackward();
        break;
      case "right":
        this.handleForward();
        break;
      case "space":
        this.handlePlayPause();
        break;
      default:
        break;
    }
  };

  renderControls() {
    const { currentFrame, hideControls, paused, theme } = this.props;

    return (
      <MediaControlsWrapper hide={hideControls}>
        <TurnCount>Turn: {currentFrame.turn}</TurnCount>
        <ButtonWrapper>
          <Button
            onClick={this.handleReload}
            disabled={currentFrame.turn === 0 || !paused}
            theme={theme}
          >
            Reload [r]
          </Button>
          <Button onClick={this.handlePlayPause} theme={theme}>
            {`${paused ? "Play" : "Pause"} [space]`}
          </Button>
          <Button
            onClick={this.handleBackward}
            disabled={currentFrame.turn === 0 || !paused}
            theme={theme}
          >
            Backward [left]
          </Button>
          <Button onClick={this.handleForward} disabled={!paused} theme={theme}>
            Forward [right]
          </Button>
          <KeyboardEventHandler
            handleKeys={this.keyEvents}
            onKeyEvent={this.handleKeyEvent}
          />
        </ButtonWrapper>
      </MediaControlsWrapper>
    );
  }
}

export default MediaControls;
