import React from "react";
import styled from "@emotion/styled";
import { breakpoints, colors, themes } from "../theme";
import { getReadableCauseOfDeath } from "../utils/engine-client";

const AvatarWrapper = styled("div")`
  margin-bottom: 0.5rem;
  padding-bottom: 1rem;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;

  @media (min-width: ${breakpoints.lg}) {
    margin-bottom: 1rem;
  }
`;

const NameWrapper = styled("div")({
  paddingBottom: "1rem",
  display: "flex",
  flexDirection: "row"
});

const Name = styled("span")(({ theme }) => ({
  display: "block",
  textShadow: theme === themes.dark ? "0 1px 2px rgba(0,0,0,0.90)" : null
}));

const Latency = styled("span")(({ theme }) => ({
  fontSize: "1rem",
  marginLeft: "auto",
  paddingTop: "0.65rem",
  textShadow: theme === themes.dark ? "0 1px 2px rgba(0,0,0,0.90)" : null
}));

const Length = styled("span")(({ theme }) => ({
  marginLeft: "5px",
  textShadow: theme === themes.dark ? "0 1px 2px rgba(0,0,0,0.90)" : null
}));

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
  padding: ".2rem .8rem",
  fontSize: "1.5rem",
  lineHeight: "1.3rem",
  backgroundColor:
    theme === themes.dark
      ? colors.healthBarDeathBackgroundDark
      : colors.healthBarDeathBackground,
  borderRadius: "inherit",
  color: theme === themes.dark ? colors.lightText : colors.darkText
}));

class Avatar extends React.Component {
  render() {
    return (
      <AvatarWrapper>
        <NameWrapper>
          <Name>{this.props.snake.name}</Name>
          <Latency>{this.props.snake.latency}</Latency>
          <Length>{this.props.snake.body.length}</Length>
        </NameWrapper>
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
