import React from "react";
import styled from "react-emotion";
import { colors } from "../theme";
import { getReadableCauseOfDeath } from "../utils/engine-client";

const AvatarWrapper = styled("div")({
  marginBottom: ".5rem",
  padding: "1rem"
});

const Name = styled("span")({
  display: "inline-block",
  paddingBottom: ".5rem",
  fontSize: "2.5rem",
  fontWeight: 400,
  color: colors.lightText
});

const HealthBarOutline = styled("div")({
  position: "relative",
  width: "100%",
  height: "3rem",
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
  padding: ".5rem",
  fontSize: "1.8rem",
  fontWeight: 400,
  backgroundColor: colors.healthBarDeathBackground
});

class Avatar extends React.Component {
  render() {
    return (
      <AvatarWrapper>
        <Name>{this.props.snake.name}</Name>
        <HealthBarOutline>
          {this.props.snake.death ? (
            <CauseOfDeath>
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
        </HealthBarOutline>
      </AvatarWrapper>
    );
  }
}

export default Avatar;
