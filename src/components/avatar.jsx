import React from "react";
import HealthBar from "./health-bar";
import styled from "react-emotion";

const DEAD_OPACITY = 0.25;

const Container = styled("div")(
  {
    display: "inline-block",
    border: "2px solid black",
    padding: "5px",
    margin: "0 4px 4px 0"
  },
  props => ({ opacity: props.opacity })
);

class Avatar extends React.Component {
  render() {
    const isDead = !!this.props.snake.Death;
    const opacity = isDead ? DEAD_OPACITY : 1;

    return (
      <Container opacity={opacity}>
        <div>{this.props.snake.name}</div>
        <HealthBar snake={this.props.snake} />
      </Container>
    );
  }
}

export default Avatar;
