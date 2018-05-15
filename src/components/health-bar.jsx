import React from "react";
import "./health-bar.css";

const MAX_HEALTH = 100;
const HEALTH_BAR_WIDTH = 200;

class HealthBar extends React.Component {
  render() {
    const ratio = this.props.snake.Health / MAX_HEALTH;
    const vitalityWidth = HEALTH_BAR_WIDTH * ratio;
    const barStyle = {
      width: vitalityWidth + "px",
      backgroundColor: this.props.snake.Color
    };
    const containerStyle = {
      width: HEALTH_BAR_WIDTH
    };
    return (
      <div className="health-container" style={containerStyle}>
        <div className="vitality-bar" style={barStyle} />
      </div>
    );
    // return <div>{Math.round(percentage * 100)}%</div>;
  }
}

export default HealthBar;
