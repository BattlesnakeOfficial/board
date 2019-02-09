import React from "react";
import styled from "react-emotion";
import KeyboardEventHandler from "react-keyboard-event-handler";

const MediaControlsWrapper = styled("div")(({ hide }) => ({
  display: hide ? "none" : "flex",
  justifyContent: "center",
  padding: "2rem 0",
  width: "100%"
}));

const Button = styled("button")`
  display: inline-block;
  min-width: 10rem;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: solid 1px #bbb;
  border-radius: 5px;
  background: #efefef;
  color: #333;
  font-size: 2rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:hover {
    background: #dfdfdf;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  &:disabled:hover {
    background: #efefef;
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
    const { currentFrame, hideControls, paused } = this.props;

    return (
      <MediaControlsWrapper hide={hideControls}>
        <Button
          onClick={this.handleReload}
          disabled={currentFrame.turn === 0 || !paused}
        >
          Reload
        </Button>
        <Button onClick={this.handlePlayPause}>
          {paused ? "Play" : "Pause"}
        </Button>
        <Button onClick={this.handleBackward} disabled={!paused}>
          Backward
        </Button>
        <Button onClick={this.handleForward} disabled={!paused}>
          Forward
        </Button>
        <KeyboardEventHandler
          handleKeys={this.keyEvents}
          onKeyEvent={this.handleKeyEvent}
        />
      </MediaControlsWrapper>
    );
  }
}

export default MediaControls;
