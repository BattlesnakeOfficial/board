import React from "react";
import Avatar from "./avatar";
import styled from "react-emotion";

const TurnCount = styled("div")({
  width: "100%",
  borderBottom: "solid 1px #ccc",
  marginBottom: "2rem",
  paddingBottom: "1rem"
});

class Scoreboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <TurnCount>Turn: {this.props.turn}</TurnCount>
        {this.props.snakes
          ? this.props.snakes.map((snake, i) => (
              <Avatar snake={snake} key={"avatar" + i} />
            ))
          : undefined}
      </React.Fragment>
    );
  }
}

export default Scoreboard;
