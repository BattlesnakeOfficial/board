import React from "react";
import Grid from "./grid";

const BOARD_SIZE = 100;

class Board extends React.Component {
  render() {
    return (
      <svg viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}>
        <Grid
          snakes={this.props.snakes}
          food={this.props.food}
          columns={this.props.columns}
          rows={this.props.rows}
          highlightedSnake={this.props.highlightedSnake}
          theme={this.props.theme}
          maxWidth={BOARD_SIZE}
          maxHeight={BOARD_SIZE}
          x={0}
          y={0}
        />
      </svg>
    );
  }
}

export default Board;
