import React from "react";
import styled from "react-emotion";
import KeyboardEventHandler from "react-keyboard-event-handler";

const MediaControlsWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  padding: "2rem 0",
  width: "100%"
});

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
  componentWillMount() {}

  render() {
    return this.renderControls();
  }

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
    return (
      <MediaControlsWrapper>
        <Button onClick={this.handlePlayPause}>
          {this.props.paused ? "Play" : "Pause"}
        </Button>
        <Button onClick={this.handleBackward} disabled={!this.props.paused}>
          Backward
        </Button>
        <Button onClick={this.handleForward} disabled={!this.props.paused}>
          Forward
        </Button>
        <KeyboardEventHandler
          handleKeys={["left", "right", "space"]}
          onKeyEvent={this.handleKeyEvent}
        />
      </MediaControlsWrapper>
    );
  }
}

export default MediaControls;
