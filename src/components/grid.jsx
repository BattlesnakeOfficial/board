import React from "react";
import { colors } from "../theme";

const DEAD_OPACITY = 0.15;
const CELL_SIZE = 20;
const CELL_SPACING = 4;

function toGridSpace(slot) {
  return (CELL_SIZE + CELL_SPACING) * slot + CELL_SPACING;
}

function getPartWidth(part) {
  const extraWidth =
    part.direction === "left" || part.direction === "right" ? CELL_SPACING : 0;
  return CELL_SIZE + extraWidth + "px";
}

function getPartHeight(part) {
  const extraHeight =
    part.direction === "up" || part.direction === "down" ? CELL_SPACING : 0;
  return CELL_SIZE + extraHeight + "px";
}

function getPartXOffset(part) {
  const xBias = part.direction === "left" ? -CELL_SPACING : 0;
  return toGridSpace(part.x) + xBias;
}

function getPartYOffset(part) {
  const yBias = part.direction === "up" ? -CELL_SPACING : 0;
  return toGridSpace(part.y) + yBias;
}

function getTailXOffset(part) {
  switch (part.direction) {
    case "left":
      return toGridSpace(part.x) - CELL_SPACING;
    case "right":
      return toGridSpace(part.x) + CELL_SPACING;
    default:
      return toGridSpace(part.x);
  }
}

function getTailYOffset(part) {
  switch (part.direction) {
    case "up":
      return toGridSpace(part.y) - CELL_SPACING;
    case "down":
      return toGridSpace(part.y) + CELL_SPACING;
    default:
      return toGridSpace(part.y);
  }
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

function getHeadTransform(direction, viewBox) {
  const halfX = viewBox.width / 2;
  const halfY = viewBox.height / 2;
  switch (direction) {
    case "left":
      return `rotate(180 ${halfX} ${halfY})`;
    case "up":
      return `rotate(-90 ${halfX} ${halfY})`;
    case "down":
      return `rotate(90 ${halfX} ${halfY})`;
    default:
      return "";
  }
}

function getTailTransform(direction, viewBox) {
  const halfX = viewBox.width / 2;
  const halfY = viewBox.height / 2;
  switch (direction) {
    case "right":
      return `rotate(180 ${halfX} ${halfY})`;
    case "down":
      return `rotate(-90 ${halfX} ${halfY})`;
    case "up":
      return `rotate(90 ${halfX} ${halfY})`;
    default:
      return "";
  }
}

class Grid extends React.Component {
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
    const x = toGridSpace(part.x);
    const y = toGridSpace(part.y);
    const box = snake.headSvg.viewBox.baseVal;
    const transform = getHeadTransform(part.direction, box);
    const viewBoxStr = `${box.x} ${box.y} ${box.width} ${box.height}`;

    return (
      <svg
        fill={snake.color}
        width={CELL_SIZE + "px"}
        height={CELL_SIZE + "px"}
        x={x}
        y={y}
        viewBox={viewBoxStr}
        opacity={getOpacity(snake)}
        key={"part" + snakeIndex + "," + partIndex}
      >
        <g
          transform={transform}
          dangerouslySetInnerHTML={{ __html: snake.headSvg.innerHTML }}
        />
      </svg>
    );
  }

  renderMiddlePart(snake, snakeIndex, part, partIndex) {
    if (!part.shouldRender) {
      return <svg key={"part" + snakeIndex + "," + partIndex} />;
    }

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
    const x = getTailXOffset(part);
    const y = getTailYOffset(part);
    const box = snake.tailSvg.viewBox.baseVal;
    const transform = getTailTransform(part.direction, box);
    const viewBoxStr = `${box.x} ${box.y} ${box.width} ${box.height}`;

    if (!part.shouldRender) {
      return <svg key={"part" + snakeIndex + "," + partIndex} />;
    }

    return (
      <svg
        fill={snake.color}
        width={CELL_SIZE}
        height={CELL_SIZE}
        x={x}
        y={y}
        viewBox={viewBoxStr}
        opacity={getOpacity(snake)}
        key={"part" + snakeIndex + "," + partIndex}
      >
        <g
          transform={transform}
          dangerouslySetInnerHTML={{ __html: snake.tailSvg.innerHTML }}
        />
      </svg>
    );
  }

  renderGrid() {
    const unsortedSnakes = this.props.snakes || [];
    const food = this.props.food || [];

    // Make alive snakes render on top of dead snakes
    const sortedSnakes = sortAliveSnakesOnTop(unsortedSnakes);

    const viewBoxWidth = toGridSpace(this.props.columns);
    const viewBoxHeight = toGridSpace(this.props.rows);

    return (
      <svg
        width={this.props.maxWidth}
        height={this.props.maxHeight}
        x={this.props.x}
        y={this.props.y}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        style={{ border: "2px solid green" }}
      >
        <rect
          width={viewBoxWidth}
          height={viewBoxHeight}
          fill={colors.gridBackground}
        />

        {range(this.props.rows).map((_, row) =>
          range(this.props.columns).map((_, col) => (
            <rect
              x={toGridSpace(col)}
              y={toGridSpace(row)}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={colors.cellBackground}
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
            fill={colors.food}
            key={"food" + foodIndex}
          />
        ))}
      </svg>
    );
  }

  render() {
    if (this.props.snakes) {
      return this.renderGrid();
    } else {
      return this.renderLoading();
    }
  }
}

export default Grid;
