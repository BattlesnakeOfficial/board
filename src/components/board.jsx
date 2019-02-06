import React from "react";
import Grid from "./grid";
import { colors } from "../theme";

class Board extends React.Component {
  render() {
    return (
      <svg viewBox="0 0 90 90">
        <rect x="0" y="0" width="90" height="90" fill={colors.pageBackground} />

        <Grid
          snakes={this.props.snakes}
          food={this.props.food}
          columns={this.props.columns}
          rows={this.props.rows}
          highlightedSnake={this.props.highlightedSnake}
          theme={this.props.theme}
          maxWidth={90}
          maxHeight={90}
          x={0}
          y={0}
        />
      </svg>
    );
  }
}

export default Board;
