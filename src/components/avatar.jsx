import React from "react";
import HealthBar from "./health-bar";
import "./avatar.css";

class Avatar extends React.Component {
  render() {
    const isDead = !!this.props.snake.Death;
    const deadClass = isDead ? "dead" : "";
    return (
      <div className={"avatar-container " + deadClass}>
        <div>{this.props.snake.Name}</div>
        <HealthBar snake={this.props.snake} />
      </div>
    );
  }
}

export default Avatar;
