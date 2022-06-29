import React from "react";
import styled from "@emotion/styled";
import { colors, themes } from "../theme";
import { getReadableCauseOfDeath } from "../utils/engine-client";
import ErrorMessage from "./scoreboard/error-message/ErrorMessage";

import "./scoreboard/avatar/Avatar.css";
import StatusIndicator from "./scoreboard/status-indicator/StatusIndicator";

const AvatarWrapper = styled("div")`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;

  opacity: ${props => (props.isEliminated ? "0.5" : "1.0")};
`;

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
  fontWeight: "400",
  display: "flex",
  flexDirection: "row",
  height: "1.25rem"
});

const Author = styled("span")(({ theme }) => ({
  display: "block",
  flexGrow: 1,
  textShadow: theme === themes.dark ? "0 1px 2px rgba(0,0,0,0.90)" : null
}));

const Latency = styled("span")(({ theme, latency }) => ({
  color: latency === "0" ? "red" : "inherit",
  marginLeft: "auto",
  textShadow: theme === themes.dark ? "0 1px 2px rgba(0,0,0,0.90)" : null,
  display: latency === "" ? "none" : "block"
}));

const HealthBarWrapper = styled("div")({
  marginTop: "0.2rem",
  width: "100%",
  height: "1.0rem",
  background: colors.healthBarBackground,
  borderRadius: "1.5rem"
});

const HealthBar = styled("div")(({ color }) => ({
  height: "100%",
  backgroundColor: color,
  borderRadius: "inherit"
}));

const CauseOfDeath = styled("div")(({ theme }) => ({
  width: "100%",
  marginTop: "0.2rem",
  fontSize: "1rem",
  lineHeight: "1rem",
  color: theme === themes.dark ? colors.lightText : colors.darkText
}));

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false
    };
  }
  render() {
    return (
      <AvatarWrapper isEliminated={this.props.snake.death ? true : false}>
        <div className="row">
          <Name>{this.props.snake.name}</Name>
          <Length>{this.props.snake.body.length}</Length>
        </div>
        <AuthorWrapper>
          <Author>by {this.props.snake.author}</Author>
          <StatusIndicator errorMessage={this.props.snake.error} />
          <Latency latency={this.props.snake.latency}>
            {this.props.snake.latency} ms
          </Latency>
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
        <ErrorMessage
          error={this.props.highlighted ? this.props.snake.error : ""}
        />
      </AvatarWrapper>
    );
  }
}

export default Avatar;
