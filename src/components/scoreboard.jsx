import React from "react";
import styled from "react-emotion";
import Avatar from "./avatar";
import { colors } from "../theme";

const Wrapper = styled("div")(({ theme }) => ({
  color: theme === colors.themeDark ? colors.lightText : colors.darkText,
  fontWeight: 700
}));

const AvatarWrapper = styled("div")`
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: ${props =>
    props.highlighted ? `0 0 0 1px ${colors.lightText}` : null};

  &:hover {
    background-color: ${props =>
      props.theme === colors.themeDark ? colors.purple : colors.lightGray};
    cursor: pointer;
  }
`;

const TurnCount = styled("div")({
  width: "100%",
  marginBottom: "1rem"
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
      <Wrapper theme={this.props.theme}>
        <TurnCount>Turn: {this.props.turn}</TurnCount>
        {this.props.snakes
          ? this.props.snakes.map((snake, i) => (
              <AvatarWrapper
                key={"avatarwrapper" + i}
                onClick={() => this.toggleHighlight(snake)}
                highlighted={highlightedSnake === snake._id}
                theme={this.props.theme}
              >
                <Avatar
                  snake={snake}
                  key={"avatar" + i}
                  theme={this.props.theme}
                />
              </AvatarWrapper>
            ))
          : undefined}
      </Wrapper>
    );
  }
}

export default Scoreboard;
