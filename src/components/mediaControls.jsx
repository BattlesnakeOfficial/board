import React from "react";
import styled from "@emotion/styled";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { themes, breakpoints } from "../theme";

const MediaControlsWrapper = styled("div")`
  display: ${({ hide }) => (hide ? "none" : "block")};
  margin-top: 1rem;
  width: 100%;
`;

const TurnCount = styled("div")(({ theme }) => ({
  display: "flex",
  color: theme === themes.dark ? "#eee" : "#333",
  justifyContent: "center",
  marginBottom: "2rem",
  fontSize: "1.4rem"
}));

const KeyboardShortcutsWrapper = styled("div")({
  position: "relative",
  marginLeft: "1rem"
});

const ShortcutsPaneTrigger = styled("div")`
  margin: 0;
  padding: 1rem;
  height: 3rem;
  width: 3rem;
  background: #dfdfdf;
  border-radius: 50%;
  line-height: 0.5;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

const ShortcutsPane = styled("div")`
  position: absolute;
  bottom: 2.5rem;
  right: 2.5rem;
  width: 20rem;
  padding: 1rem;
  border: solid 1px #999;
  background: #fff;

  @media (min-width: ${breakpoints.md}) {
    left: 2.5rem;
    right: 0;
  }

  h4 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
`;

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
  state = {
    paneHidden: true
  };

  constructor(props) {
    super(props);
    this.keyboardCodeMap = {
      KeyR: "r",
      ArrowLeft: "left",
      ArrowRight: "right",
      Space: "space"
    };
  }

  componentDidMount() {
    window.addEventListener("message", this.handleParentKeyboardEvent);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.handleParentKeyboardEvent);
  }

  render() {
    return this.renderControls();
  }

  handleParentKeyboardEvent = e => {
    const { code } = e.data;
    this.handleKeyEvent(this.keyboardCodeMap[code]);
  };

  toggleTheme = () => {
    this.props.toggleTheme();
  };

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

  handleShortcutPaneShowToggle = () => {
    this.setState({
      paneHidden: !this.state.paneHidden
    });
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
        <TurnCount theme={theme}>Turn: {currentFrame.turn}</TurnCount>
        <ButtonWrapper>
          <Button onClick={this.toggleTheme} theme={theme}>
            Toggle Theme
          </Button>
          <Button
            onClick={this.handleReload}
            disabled={currentFrame.turn === 0 || !paused}
            theme={theme}
          >
            Reload
          </Button>
          <Button onClick={this.handlePlayPause} theme={theme}>
            {paused ? "Play" : "Pause"}
          </Button>
          <Button
            onClick={this.handleBackward}
            disabled={currentFrame.turn === 0 || !paused}
            theme={theme}
          >
            Backward
          </Button>
          <Button onClick={this.handleForward} disabled={!paused} theme={theme}>
            Forward
          </Button>
          <KeyboardEventHandler
            handleKeys={Object.values(this.keyboardCodeMap)}
            onKeyEvent={this.handleKeyEvent}
          />
          <KeyboardShortcutsWrapper>
            <ShortcutsPaneTrigger onClick={this.handleShortcutPaneShowToggle}>
              ?
            </ShortcutsPaneTrigger>
            {!this.state.paneHidden && (
              <ShortcutsPane>
                <h4>Keyboard shortcuts</h4>
                <ul>
                  <li>Reload = r</li>
                  <li>Play/Pause = space</li>
                  <li>Backward = left arrow</li>
                  <li>Forward = right arrow</li>
                </ul>
              </ShortcutsPane>
            )}
          </KeyboardShortcutsWrapper>
        </ButtonWrapper>
      </MediaControlsWrapper>
    );
  }
}

export default MediaControls;
