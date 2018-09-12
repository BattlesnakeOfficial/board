import React from "react";
import Grid from "./grid";
import Scoreboard from "./scoreboard";
import { colors } from "../theme";

class Board extends React.Component {
  render() {
    return (
      <svg
        viewBox="0 0 160 90"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%"
        }}
      >
        <rect
          x="0"
          y="0"
          width="160"
          height="90"
          fill={colors.pageBackground}
        />

        <Grid
          snakes={this.props.snakes}
          food={this.props.food}
          columns={this.props.columns}
          rows={this.props.rows}
          maxWidth={90}
          maxHeight={80}
          x={5}
          y={5}
        />

        <Scoreboard
          snakes={this.props.snakes}
          food={this.props.food}
          maxWidth={60}
          maxHeight={90}
          x={100}
          y={0}
        />
      </svg>
    );
  }
}

export default Board;
