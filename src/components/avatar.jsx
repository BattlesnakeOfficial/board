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

  opacity: ${props => props.isEliminated ? "0.5" : "1.0"};
`;

const NameWrapper = styled("div")({
  display: "flex",
  flexDirection: "row"
});

const Name = styled("span")(({ theme }) => ({
  display: "block",
  textShadow: theme === themes.dark ? "0 1px 2px rgba(0,0,0,0.90)" : null
}));


const Length = styled("span")(({ theme }) => ({
  marginLeft: "auto",
  textShadow: theme === themes.dark ? "0 1px 2px rgba(0,0,0,0.90)" : null
}));

const AuthorWrapper = styled("div")({
  fontSize: "1rem",
  display: "flex",
  flexDirection: "row"
});

const Author = styled("span")(({ theme }) => ({
  display: "block",
  textShadow: theme === themes.dark ? "0 1px 2px rgba(0,0,0,0.90)" : null
}));

const Latency = styled("span")(({ theme, latency }) => ({
  color: latency == "0" ? "red" : "inherit",
  marginLeft: "auto",
  textShadow: theme === themes.dark ? "0 1px 2px rgba(0,0,0,0.90)" : null
}));

const HealthBarWrapper = styled("div")({
  marginTop: "1rem",
  width: "100%",
  height: "1.8rem",
  background: colors.healthBarBackground,
  borderRadius: "1.5rem",
  border: `2px solid ${colors.healthBarBackground}`,
});

const HealthBar = styled("div")(({ color }) => ({
  height: "100%",
  backgroundColor: color,
  borderRadius: "inherit"
}));

const CauseOfDeath = styled("div")(({ theme }) => ({
  marginTop: "1rem",
  width: "100%",
  height: "1.8rem",
  padding: ".2rem 0",
  fontSize: "1.5rem",
  lineHeight: "1.3rem",
  color: theme === themes.dark ? colors.lightText : colors.darkText,
}));

class Avatar extends React.Component {
  render() {
    return (
      <AvatarWrapper isEliminated={this.props.snake.death ? true : false}>
        <NameWrapper>
          <Name>{this.props.snake.name}</Name>
          <Length>{this.props.snake.body.length}</Length>
        </NameWrapper>
        <AuthorWrapper>
          <Author>by {this.props.snake.author}</Author>
          <Latency latency={this.props.snake.latency}>{this.props.snake.latency} ms</Latency>
        </AuthorWrapper>

        {this.props.snake.death ? (
          <CauseOfDeath theme={this.props.theme}>
            {getReadableCauseOfDeath(this.props.snake.death)}
          </CauseOfDeath>
        ) : (
            <HealthBarWrapper>
              <HealthBar
                color={this.props.snake.color}
                style={{
                  width: `${this.props.snake.health}%`
                }}
              />
            </HealthBarWrapper>
          )}

      </AvatarWrapper>
    );
  }
}

export default Avatar;
