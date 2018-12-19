import React from "react";
import Avatar from "./avatar";
import styled from "react-emotion";

const AvatarWrapper = styled("div")`
  box-shadow: ${props =>
    props.highlighted ? "0 0 0 3px red" : "0 0 0 3px transparent"};

  &:hover {
    box-shadow: 0 0 0 3px red;
    cursor: pointer;
  }
`;

const TurnCount = styled("div")({
  width: "100%",
  borderBottom: "solid 1px #ccc",
  marginBottom: "2rem",
  paddingBottom: "1rem"
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
