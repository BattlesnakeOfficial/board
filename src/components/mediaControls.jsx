import React from "react";
import styled from "@emotion/styled";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { withRouter } from "react-router";
import { themes, breakpoints } from "../theme";

const MediaControlsWrapper = styled("div")`
  display: ${({ hide }) => (hide ? "none" : "block")};
  margin-top: 1rem;
  width: 100%;
`;

const KeyboardShortcutsWrapper = styled("div")({
  position: "relative"
});

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
  width: "100%"
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

  @media (max-width: ${breakpoints.sm}) {
    padding: 2rem 2rem;
  }
`;

const Scrubber = styled("input")`
  width: 100%;
  max-width: 60rem;

  &:disabled,
  &:disabled:hover {
    opacity: 0.2;
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
      Space: "space",
      Settings: ","
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
    this.handleKeyEvent(this.keyboardCodeMap[code], e);
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

  handleScrubMouseDown = () => {
    this.props.pauseGame();
  };

  handleScrubbing = event => {
    this.props.stepToTurn(parseInt(event.target.value));
  };

  handleSettings = () => {
    if (this.props.persistAvailable) {
      this.props.history.push("/settings");
    }
  };

  handleShortcutPaneShowToggle = () => {
    this.setState({
      paneHidden: !this.state.paneHidden
    });
  };

  handleKeyEvent = (key, e) => {
    e.preventDefault();
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
      case ",":
        this.handleSettings();
        break;
      default:
        break;
    }
  };

  renderScrubbing() {
    const value = this.props.hasAllFrames ? this.props.currentFrame.turn : 0;
    const max = this.props.hasAllFrames ? this.props.maxTurn : 0;

    return (
      this.props.showFrameScrubber && (
        <ButtonWrapper>
          <Scrubber
            type="range"
            min="0"
            max={max}
            value={value}
            onMouseDown={this.handleScrubMouseDown}
            onChange={this.handleScrubbing}
            disabled={!this.props.hasAllFrames}
          />
        </ButtonWrapper>
      )
    );
  }

  renderControls() {
    const {
      currentFrame,
      hideControls,
      paused,
      theme,
      persistAvailable
    } = this.props;

    const settingsInfo = persistAvailable
      ? "Configure playback settings"
      : "Enable localStorage to configure playback settings";

    return (
      <MediaControlsWrapper hide={hideControls}>
        {this.renderScrubbing()}
        <ButtonWrapper>
          <Button
            onClick={this.handleBackward}
            disabled={currentFrame.turn === 0 || !paused}
            theme={theme}
          >
            <span className="material-icons icon-image-preview">
              skip_previous
            </span>
          </Button>
          <Button onClick={this.handlePlayPause} theme={theme}>
            <span className="material-icons icon-image-preview">
              {paused ? "play_arrow" : "pause"}
            </span>
          </Button>
          <Button onClick={this.handleForward} disabled={!paused} theme={theme}>
            <span className="material-icons icon-image-preview">skip_next</span>
          </Button>
          <Button
            onClick={this.handleReload}
            disabled={currentFrame.turn === 0 || !paused}
            theme={theme}
          >
            <span className="material-icons icon-image-preview">refresh</span>
          </Button>
          <Button
            onClick={this.handleSettings}
            disabled={!persistAvailable}
            theme={theme}
          >
            <span
              className="material-icons icon-image-preview"
              title={settingsInfo}
            >
              settings
            </span>
          </Button>
          <KeyboardEventHandler
            handleKeys={Object.values(this.keyboardCodeMap)}
            onKeyEvent={this.handleKeyEvent}
          />
          <KeyboardShortcutsWrapper>
            <Button onClick={this.handleShortcutPaneShowToggle} theme={theme}>
              <span className="material-icons icon-image-preview">help</span>
            </Button>
            {!this.state.paneHidden && (
              <ShortcutsPane>
                <h4>Keyboard shortcuts</h4>
                <ul>
                  <li>Reload = r</li>
                  <li>Play/Pause = space</li>
                  <li>Backward = left arrow</li>
                  <li>Forward = right arrow</li>
                  <li>Settings = comma</li>
                </ul>
              </ShortcutsPane>
            )}
          </KeyboardShortcutsWrapper>
        </ButtonWrapper>
      </MediaControlsWrapper>
    );
  }
}

export default withRouter(MediaControls);
