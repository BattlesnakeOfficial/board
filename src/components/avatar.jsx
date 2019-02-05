import React from "react";
import styled from "react-emotion";
import { colors } from "../theme";
import { getReadableCauseOfDeath } from "../utils/engine-client";

const healthBarBorderRadius = "15px";

const AvatarWrapper = styled("div")({
  marginBottom: ".5rem",
  padding: "1rem",
  fontSize: "1.5rem",
  fontWeight: 400
});

const Name = styled("span")({
  display: "inline-block",
  paddingBottom: ".5rem",
  color: colors.lightText
});

const HealthBarOutline = styled("div")({
  position: "relative",
  width: "100%",
  height: "1.8rem",
  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: colors.healthBarOutline,
  background: colors.healthBarBackground,
  color: colors.white,
  borderRadius: healthBarBorderRadius
});

const HealthBar = styled("div")(({ color }) => ({
  height: "100%",
  backgroundColor: color,
  borderRadius: "inherit"
}));

const CauseOfDeath = styled("div")({
  height: "100%",
  paddingTop: ".1rem",
  textAlign: "center",
  fontSize: "1.2rem",
  backgroundColor: colors.healthBarDeathBackground,
  borderRadius: "inherit"
});

class Avatar extends React.Component {
  render() {
    return (
      <AvatarWrapper>
        <Name>{this.props.snake.name}</Name>
        <HealthBarOutline>
          {this.props.snake.death ? (
            <CauseOfDeath>
              Dead: {getReadableCauseOfDeath(this.props.snake.death.cause)}
            </CauseOfDeath>
          ) : (
            <HealthBar
              color={this.props.snake.color}
              style={{
                width: `${this.props.snake.health}%`
              }}
            />
          )}
        </HealthBarOutline>
      </AvatarWrapper>
    );
  }
}

export default Avatar;
