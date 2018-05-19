import React from "react";
import styled from "react-emotion";

const MAX_HEALTH = 100;
const HEALTH_BAR_WIDTH = 200;

const HealthContainer = styled("div")({
  border: "1px solid black",
  padding: "0",
  margin: "4px",
  width: HEALTH_BAR_WIDTH
});

const VitalityBar = styled("div")(
  {
    height: "20px"
  },
  props => ({
    width: props.barWidth + "px",
    backgroundColor: props.color
  })
);

class HealthBar extends React.Component {
  render() {
    const ratio = this.props.snake.Health / MAX_HEALTH;
    const vitalityWidth = HEALTH_BAR_WIDTH * ratio;

    return (
      <HealthContainer>
        <VitalityBar barWidth={vitalityWidth} color={this.props.snake.Color} />
      </HealthContainer>
    );
    // return <div>{Math.round(percentage * 100)}%</div>;
  }
}

export default HealthBar;
