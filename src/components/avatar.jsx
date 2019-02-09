import React from "react";
import styled from "react-emotion";
import { colors, themes } from "../theme";
import { getReadableCauseOfDeath } from "../utils/engine-client";

const AvatarWrapper = styled("div")({
  marginBottom: ".5rem",
  paddingTop: "1rem",
  width: "100%",
  paddingBottom: "1rem"
});

const Name = styled("span")({
  display: "block",
  paddingBottom: "1rem"
});

const HealthBarWrapper = styled("div")({
  width: "100%",
  height: "1.8rem",
  background: colors.healthBarBackground,
  borderRadius: "1.5rem"
});

const HealthBar = styled("div")(({ color }) => ({
  height: "100%",
  backgroundColor: color,
  borderRadius: "inherit"
}));

const CauseOfDeath = styled("div")(({ theme }) => ({
  height: "100%",
  padding: ".2rem .5rem",
  fontSize: "1.2rem",
  backgroundColor:
    theme === themes.dark
      ? colors.healthBarDeathBackgroundDark
      : colors.healthBarDeathBackground,
  borderRadius: "inherit",
  color: colors.darkText
}));

class Avatar extends React.Component {
  render() {
    return (
      <AvatarWrapper>
        <Name>{this.props.snake.name}</Name>
        <HealthBarWrapper>
          {this.props.snake.death ? (
            <CauseOfDeath theme={this.props.theme}>
              {getReadableCauseOfDeath(this.props.snake.death.cause)}
            </CauseOfDeath>
          ) : (
            <HealthBar
              color={this.props.snake.color}
              style={{
                width: `${this.props.snake.health}%`
              }}
            />
          )}
        </HealthBarWrapper>
      </AvatarWrapper>
    );
  }
}

export default Avatar;
