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

function sortAliveSnakesOnTop(snakes) {
  return snakes.concat().sort((a, b) => {
    const aOrder = a.isDead ? 0 : 1;
    const bOrder = b.isDead ? 0 : 1;
    return aOrder - bOrder;
  });
}

function directionToRotation(direction) {
  return (
    {
      up: 90,
      down: -90
    }[direction] || 0
  );
}

function directionToScale(direction) {
  return (
    {
      right: "-1 1"
    }[direction] || "1 1"
  );
}

class Board extends React.Component {
  renderLoading() {
    return <p>loading</p>;
  }

  renderPart(snake, snakeIndex, part, partIndex) {
    switch (part.type) {
      case "head":
        return this.renderHeadPart(snake, snakeIndex, part, partIndex);
      case "tail":
        return this.renderTailPart(snake, snakeIndex, part, partIndex);
      default:
        return this.renderMiddlePart(snake, snakeIndex, part, partIndex);
    }
  }

  renderHeadPart(snake, snakeIndex, part, partIndex) {
    const x = getPartXOffset(part);
    const y = getPartYOffset(part);
    const r = directionToRotation(part.direction);
    const s = directionToScale(part.direction);
    const rx = CELL_SIZE / 2 + x;
    const ry = CELL_SIZE / 2 + y;
    const transform = `rotate(${r}, ${rx}, ${ry}) translate(${x}, ${y}) scale(${s})`;
    return (
      <image
        transform={transform}
        width={getPartWidth(part)}
        height={getPartHeight(part)}
        opacity={getOpacity(snake)}
        fill={snake.color}
        key={"part" + snakeIndex + "," + partIndex}
        href="images/snake/head/bendr.svg"
      />
    );
  }

  renderMiddlePart(snake, snakeIndex, part, partIndex) {
    return (
      <rect
        x={getPartXOffset(part)}
        y={getPartYOffset(part)}
        width={getPartWidth(part)}
        height={getPartHeight(part)}
        opacity={getOpacity(snake)}
        fill={snake.color}
        key={"part" + snakeIndex + "," + partIndex}
      />
    );
  }

  renderTailPart(snake, snakeIndex, part, partIndex) {
    const x = getPartXOffset(part);
    const y = getPartYOffset(part);
    const r = -90;
    const rx = CELL_SIZE / 2;
    const ry = CELL_SIZE / 2;
    const transform = `translate(${x}, ${y}) rotate(${r}, ${rx}, ${ry})`;
    return (
      <image
        transform={transform}
        width={getPartWidth(part)}
        height={getPartHeight(part)}
        opacity={getOpacity(snake)}
        fill={snake.color}
        key={"part" + snakeIndex + "," + partIndex}
        href="images/snake/tail/small-rattle.svg"
      />
    );
  }

  renderBoard() {
    const unsortedSnakes = this.props.snakes || [];
    const food = this.props.food || [];

    // Make alive snakes render on top of dead snakes
    const sortedSnakes = sortAliveSnakesOnTop(unsortedSnakes);

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

        {sortedSnakes.map((snake, snakeIndex) =>
          snake.body.map((part, partIndex) =>
            this.renderPart(snake, snakeIndex, part, partIndex)
          )
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
