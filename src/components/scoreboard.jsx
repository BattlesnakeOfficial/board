import React from "react";
import styled from "react-emotion";
import Avatar from "./avatar";
import { colors } from "../theme";

const AvatarWrapper = styled("div")`
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: ${props => (props.highlighted ? "0 0 0 1px #555" : null)};

  &:hover {
    background-color: ${colors.purple};
    cursor: pointer;
  }
`;

const TurnCount = styled("div")({
  width: "100%",
  borderBottom: "solid 1px #ccc",
  marginBottom: "2rem",
  paddingBottom: "1rem",
  color: colors.lightText
});

class Scoreboard extends React.Component {
  state = {
    highlightedSnake: null
  };

  toggleHighlight = snake => {
    const getSnakeToHighlight = (state, snake) => {
      return state.highlightedSnake !== snake._id ? snake._id : null;
    };

    this.props.highlightSnake(getSnakeToHighlight(this.state, snake));

    this.setState(state => ({
      highlightedSnake: getSnakeToHighlight(state, snake)
    }));
  };

  render() {
    const { highlightedSnake } = this.state;
    return (
      <React.Fragment>
        <TurnCount>Turn: {this.props.turn}</TurnCount>
        {this.props.snakes
          ? this.props.snakes.map((snake, i) => (
              <AvatarWrapper
                key={"avatarwrapper" + i}
                onClick={() => this.toggleHighlight(snake)}
                highlighted={highlightedSnake === snake._id}
              >
                <Avatar snake={snake} key={"avatar" + i} />
              </AvatarWrapper>
            ))
          : undefined}
      </React.Fragment>
    );
  }
}

export default Scoreboard;
