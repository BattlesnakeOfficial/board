import React from "react";
import styled from "react-emotion";
import { colors } from "../theme";

const AvatarWrapper = styled("div")({
  marginBottom: "1.5rem"
});

const Name = styled("span")({
  display: "inline-block",
  paddingBottom: ".5rem",
  fontSize: "2.5rem",
  fontWeight: 400,
  color: colors.darkText
});

const HealthBarOutline = styled("div")({
  position: "relative",
  width: "100%",
  height: "3.5rem",
  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: colors.healthBarOutline,
  color: colors.white
});

const HealthBar = styled("div")(({ color }) => ({
  height: "100%",
  backgroundColor: color
}));

const CauseOfDeath = styled("div")({
  height: "100%",
  padding: "0.5rem",
  fontSize: "1.8rem",
  fontWeight: 400,
  backgroundColor: colors.healthBarDeathBackground
});

class Avatar extends React.Component {
  render() {
    const healthWidthConversion = 96 / 100;
    const healthWidth = Math.floor(
      this.props.snake.health * healthWidthConversion
    );

    return (
      <AvatarWrapper>
        <Name>{this.props.snake.name}</Name>
        <HealthBarOutline>
          {this.props.snake.death ? (
            <CauseOfDeath>{this.props.snake.death.cause}</CauseOfDeath>
          ) : (
            <HealthBar
              color={this.props.snake.color}
              style={{
                width: `${healthWidth}%`
              }}
            />
          )}
        </HealthBarOutline>
      </AvatarWrapper>
    );
  }
}

export default Avatar;
