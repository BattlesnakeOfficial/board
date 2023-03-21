import React from "react";
import Grid from "./grid";

const BOARD_SIZE = 100;

const LABEL_ADJUSTMENT = 10;

class Board extends React.Component {
  render() {
    const boardSize = this.props.showCoordinateLabels
      ? BOARD_SIZE - LABEL_ADJUSTMENT
      : BOARD_SIZE;

    const x = this.props.showCoordinateLabels ? LABEL_ADJUSTMENT : 0;

    return (
      <svg viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}>
        <Grid
          snakes={this.props.snakes}
          food={this.props.food}
          foodImage={this.props.foodImage}
          hazards={this.props.hazards}
          columns={this.props.columns}
          rows={this.props.rows}
          highlightedSnake={this.props.highlightedSnake}
          theme={this.props.theme}
          maxWidth={boardSize}
          maxHeight={boardSize}
          x={x}
          y={0}
          turn={this.props.turn}
          showCoordinateLabels={this.props.showCoordinateLabels}
        />
      </svg>
    );
  }
}

export default Board;
