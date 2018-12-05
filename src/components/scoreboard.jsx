import React from "react";
import Avatar from "./avatar";

class Scoreboard extends React.Component {
  render() {
    return (
      <React.Fragment>
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
