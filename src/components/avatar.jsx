import React from "react";
import styled from "react-emotion";

const Name = styled("text")({
  fontSize: "5px"
});

const Background = styled("rect")({
  strokeWidth: 1,
  stroke: "#000",
  fill: "#ccc"
});

const HealthBar = styled("rect")({
  fill: "#0f0"
});

const HealthBarOutline = styled("rect")({
  strokeWidth: 1,
  stroke: "#000"
});

const CauseOfDeath = styled("text")({
  fontSize: "4px",
  fill: "#fff"
});

class Avatar extends React.Component {
  render() {
    const headSize = this.props.height - 4;
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
        {/* <Background width={100} height={16} /> */}
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
