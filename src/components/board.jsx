import React from "react";

const DEAD_OPACITY = 0.15;
const CELL_SIZE = 20;
const CELL_SPACING = 4;

function toGridSpace(slot) {
  return (CELL_SIZE + CELL_SPACING) * slot + CELL_SPACING;
}

function getPartWidth(part) {
  const extraWidth =
    part.direction === "left" || part.direction === "right" ? CELL_SPACING : 0;
  return CELL_SIZE + extraWidth;
}

function getPartHeight(part) {
  const extraHeight =
    part.direction === "up" || part.direction === "down" ? CELL_SPACING : 0;
  return CELL_SIZE + extraHeight;
}

function getPartXOffset(part) {
  const xBias = part.direction === "left" ? -CELL_SPACING : 0;
  return toGridSpace(part.x) + xBias;
}

function getPartYOffset(part) {
  const yBias = part.direction === "up" ? -CELL_SPACING : 0;
  return toGridSpace(part.y) + yBias;
}

function getOpacity(snake) {
  return snake.isDead ? DEAD_OPACITY : 1;
}

function range(size) {
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(i);
  }
  return result;
}

class Board extends React.Component {
  renderLoading() {
    return <p>loading</p>;
  }

  renderBoard() {
    const snakes = this.props.snakes || [];
    const food = this.props.food || [];

    // Make alive snakes render on top of dead snakes by sorting alive first
    snakes.sort((a, b) => {
      const aOrder = a.isDead ? 0 : 1;
      const bOrder = b.isDead ? 0 : 1;
      return aOrder - bOrder;
    });

    const width = toGridSpace(this.props.width);
    const height = toGridSpace(this.props.height);

    return (
      <svg width={width} height={height}>
        <rect width={width} height={height} fill="#ddd" />

        {range(this.props.height).map((_, row) =>
          range(this.props.width).map((_, col) => (
            <rect
              x={toGridSpace(col)}
              y={toGridSpace(row)}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill="#e8e8e8"
              key={"cell" + row + "," + col}
            />
          ))
        )}

        {snakes.map((snake, snakeIndex) =>
          snake.body.map((part, partIndex) => (
            <rect
              x={getPartXOffset(part)}
              y={getPartYOffset(part)}
              width={getPartWidth(part)}
              height={getPartHeight(part)}
              opacity={getOpacity(snake)}
              fill={snake.color}
              key={"part" + snakeIndex + "," + partIndex}
            />
          ))
        )}

        {food.map((f, foodIndex) => (
          <circle
            cx={toGridSpace(f.x) + CELL_SIZE / 2}
            cy={toGridSpace(f.y) + CELL_SIZE / 2}
            r={CELL_SIZE / 2}
            fill="orange"
            key={"food" + foodIndex}
          />
        ))}
      </svg>
    );
  }

  render() {
    if (this.props.snakes) {
      return this.renderBoard();
    } else {
      return this.renderLoading();
    }
  }
}

export default Board;
