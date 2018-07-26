import React from "react";
import styled from "react-emotion";

const MAX_HEALTH = 100;
const HEALTH_BAR_WIDTH = 200;

const HealthContainer = styled("div")({
  padding: "0",
  width: HEALTH_BAR_WIDTH
});

const VitalityBarWrap = styled("div")({
  border: "1px solid black"
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

const DeathMessage = styled("div")({
  fontSize: "12px",
  color: "#ff0000"
});
const DeathTurn = styled("div")({
  display: "block"
});
const DeathCause = styled("div")({
  display: "block"
});

class HealthBar extends React.Component {
  render() {
    const ratio = this.props.snake.health / MAX_HEALTH;
    const vitalityWidth = HEALTH_BAR_WIDTH * ratio;

    return (
      <HealthContainer>
        {this.props.snake.death && (
          <DeathMessage>
            <DeathTurn>Turn: {this.props.snake.death.turn}</DeathTurn>
            <DeathCause>Cause: {this.props.snake.death.cause}</DeathCause>
          </DeathMessage>
        )}
        {!this.props.snake.death && (
          <VitalityBarWrap>
            <VitalityBar
              barWidth={vitalityWidth}
              color={this.props.snake.color}
            />
          </VitalityBarWrap>
        )}
      </HealthContainer>
    );
  }
}

export default HealthBar;
