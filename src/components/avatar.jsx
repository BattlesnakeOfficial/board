import React from "react";
import HealthBar from "./health-bar";
import styled from "react-emotion";

// const DEAD_OPACITY = 0.25;

const Container = styled("div")(
  {
    display: "inline-block",
    border: "2px solid black",
    padding: "5px",
    margin: "0 4px 4px 0",
    minHeight: "48px"
  },
  props => ({ opacity: props.opacity })
);

const SnakeName = styled("span")({}, props => ({
  textDecoration: props.dead ? "line-through" : ""
}));

class Avatar extends React.Component {
  render() {
    const isDead = !!this.props.snake.death;
    // const opacity = isDead ? DEAD_OPACITY : 1;

    // <Container opacity={opacity}>
    return (
      <Container>
        <SnakeName dead={isDead}>{this.props.snake.name}</SnakeName>
        <HealthBar snake={this.props.snake} />
      </Container>
    );
  }
}

export default Avatar;
