import React from "react";
import styled from "react-emotion";
import { colors } from "../theme";

const Name = styled("text")({
  fontSize: "5px",
  color: colors.darkText
});

const HealthBar = styled("rect")({
  fill: colors.healthBar
});

const HealthBarOutline = styled("rect")({
  strokeWidth: 1,
  stroke: colors.healthBarOutline
});

const CauseOfDeath = styled("text")({
  fontSize: "4px",
  fill: colors.lightText
});

class Avatar extends React.Component {
  render() {
    const viewBoxWidth = 100;
    const viewBoxHeight = 16;
    const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;
    const healthWidthConversion = 96 / 100;
    const healthWidth = this.props.snake.health * healthWidthConversion;

    return (
      <svg
        x={this.props.x}
        y={this.props.y + 2}
        viewBox={viewBox}
        width={100}
        height={16}
      >
        <Name x="2" y="6">
          {this.props.snake.name}
        </Name>
        <HealthBarOutline x="2" y="8" width="96" height="6" />
        {this.props.snake.death ? (
          <CauseOfDeath x="4" y="12">
            {this.props.snake.death.cause}
          </CauseOfDeath>
        ) : (
          <HealthBar x="2" y="8" width={healthWidth} height="6" />
        )}
      </svg>
    );
  }
}

export default Avatar;
