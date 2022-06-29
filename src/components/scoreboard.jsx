import React from "react";
import styled from "@emotion/styled";
import Avatar from "./avatar";
import { breakpoints, colors, themes } from "../theme";

const orderSnakes = snakes => {
  // Sort by name
  const aliveSnakes = snakes
    .filter(s => !s.isDead)
    .sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();
      if (aLower < bLower) {
        return -1;
      }
      if (aLower > bLower) {
        return 1;
      }
      return 0;
    });

  // Sort by turn died, descending
  const deadSnakes = snakes
    .filter(s => s.isDead)
    .sort((a, b) => a.death.turn - b.death.turn)
    .reverse();

  return aliveSnakes.concat(deadSnakes);
};

const Wrapper = styled("div")`
  display: none;
  color: ${({ theme }) =>
    theme === themes.dark ? colors.lightText : colors.darkText};
  font-weight: 600;
  font-size: 1.4rem;

  @media (min-width: ${breakpoints.md}) {
    display: ${({ hide }) => (hide ? "none" : "block")};
    font-size: 1.8rem;
  }

  @media (min-width: ${breakpoints.xxl}) {
    font-size: 3.2rem;
    letter-spacing: 0.1rem;
  }
`;

const AvatarWrapper = styled("div")`
  padding: 0.75rem;
  transition: background-color 0.2s, box-shadow 0.2s;
  border: 2px solid
    ${props =>
      props.highlighted ? colors.avatarHighlightedBorder : "transparent"};
  &:hover {
    background-color: ${props =>
      props.theme === themes.dark ? colors.purple : colors.light};
    cursor: pointer;
    border-color: ${props =>
      props.highlighted
        ? colors.avatarHighlightedBorder
        : colors.avatarHoverBorder};
  }
`;

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
        {this.props.snakes
          ? orderSnakes(this.props.snakes).map((snake, i) => (
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
                  highlighted={highlightedSnake === snake._id}
                />
              </AvatarWrapper>
            ))
          : undefined}
      </Wrapper>
    );
  }
}

export default Scoreboard;
