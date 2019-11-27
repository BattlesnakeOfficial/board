import React from "react";
import { colors, themes } from "../theme";

const HIGHLIGHT_DIM = 0.15;
const DEAD_OPACITY = 0.1;

const CELL_SIZE = 20;
const CELL_SPACING = 4;
const FOOD_SIZE = (CELL_SIZE / 3.25).toFixed(2);

function toGridSpace(slot) {
  return (CELL_SIZE + CELL_SPACING) * slot + CELL_SPACING;
}

function getPartWidth(part) {
  const extraWidth =
    part.direction === "left" || part.direction === "right" ? 2 * CELL_SPACING : 0;
  return CELL_SIZE + extraWidth;
}

function getPartHeight(part) {
  const extraHeight =
    part.direction === "up" || part.direction === "down" ? 2 * CELL_SPACING : 0;
  return CELL_SIZE + extraHeight;
}

function getPartXOffset(part) {
  const xBias = part.direction === "left" || part.direction === "right" ? -CELL_SPACING : 0;
  return toGridSpace(part.x) + xBias;
}

function getPartYOffset(part) {
  const yBias = part.direction === "up" || part.direction === "down" ? -CELL_SPACING : 0;
  return toGridSpace(part.y) + yBias;
}

function getCornerPartXOffset(part, type) {
  return toGridSpace(part.x) - CELL_SPACING;
}

function getCornerPartYOffset(part, type) {
  return toGridSpace(part.y) - CELL_SPACING;
}

function getTailXOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "left":
      return toGridSpace(part.x) - 0.1;
    case "right":
      return toGridSpace(part.x) + 0.1;
    default:
      return toGridSpace(part.x);
  }
}

function getTailYOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "up":
      return toGridSpace(part.y) - 0.1;
    case "down":
      return toGridSpace(part.y) + 0.1;
    default:
      return toGridSpace(part.y);
  }
}

function getHeadXOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "left":
      return toGridSpace(part.x) + 0.1;
    case "right":
      return toGridSpace(part.x) - 0.1;
    default:
      return toGridSpace(part.x);
  }
}

function getHeadYOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "up":
      return toGridSpace(part.y) + 0.1;
    case "down":
      return toGridSpace(part.y) - 0.1;
    default:
      return toGridSpace(part.y);
  }
}

function getOpacity(snake, highlightedSnake) {
  if (!snake.isDead) {
    if (highlightedSnake) {
      return snake._id === highlightedSnake ? 1 : HIGHLIGHT_DIM;
    }
  } else {
    if (highlightedSnake) {
      return snake._id === highlightedSnake ? 1 : 0;
    }
  }

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
      return `scale(-1,1) translate(-100, 0)`;
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

function checkIfCornerPart(snake, partIndex) {
  // If head or tail of the snake, then false
  if (partIndex === 0 || partIndex === snake.body.length - 1) return false;

  const behind = snake.body[partIndex + 1];
  const current = snake.body[partIndex];

  // Return false if the behind part has the same position as the current.
  // Relevant for when the snake initially spawns.
  if (behind.x === current.x && behind.y === current.y) return false;

  return behind.direction !== current.direction;
}

function determineCornerType(snake, partIndex) {
  // If head or tail of the snake, then false
  if (partIndex === 0 || partIndex === snake.body.length - 1) return false;

  const behind = snake.body[partIndex + 1];
  const current = snake.body[partIndex];

  return `${current.direction} ${behind.direction}`;
}

class Grid extends React.Component {
  renderPart(snake, snakeIndex, part, partIndex, highlightedSnake) {
    switch (part.type) {
      case "head":
        return this.renderHeadPart(snake, snakeIndex, part, highlightedSnake);
      case "tail":
        return this.renderTailPart(snake, snakeIndex, part, highlightedSnake);
      default:
        if (checkIfCornerPart(snake, partIndex)) {
          return this.renderCornerPart(
            snake,
            snakeIndex,
            part,
            partIndex,
            highlightedSnake
          );
        } else {
          return this.renderMiddlePart(
            snake,
            snakeIndex,
            part,
            partIndex,
            highlightedSnake
          );
        }
    }
  }

  renderHeadPart(snake, snakeIndex, part, highlighted) {
    const x = getHeadXOffset(part);
    const y = getHeadYOffset(part);
    const box = snake.headSvg.viewBox.baseVal;
    const transform = getHeadTransform(part.direction, box);
    const viewBoxStr = `${box.x} ${box.y} ${box.width} ${box.height}`;

    return (
      <svg
        key={"part" + snakeIndex + ",head"}
        viewBox={viewBoxStr}
        x={x}
        y={y}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={snake.color}
        shapeRendering="optimizeSpeed"
      >
        <g
          transform={transform}
          dangerouslySetInnerHTML={{ __html: snake.headSvg.innerHTML }}
        />
      </svg>
    );
  }

  renderMiddlePart(snake, snakeIndex, part, partIndex, highlighted) {
    return (
      <rect
        key={`part${snakeIndex},${part.x},${part.y}`}
        x={getPartXOffset(part)}
        y={getPartYOffset(part)}
        width={getPartWidth(part)}
        height={getPartHeight(part)}
        fill={snake.color}
        shapeRendering="optimizeSpeed"
      />
    );
  }

  renderCornerPart(snake, snakeIndex, part, partIndex, highlighted) {
    let viewBox, transform;
    let path = "M0,20 h60 a60,60 0 0 1 60,60 v60 h-100 v-20 h-20 z";

    viewBox = "0 0 140 140";

    const cornerType = determineCornerType(snake, partIndex);
    switch (cornerType) {
      case "down left":
      case "right up":
        transform = "rotate(270, 70, 70)";
        break;
      case "left down":
      case "up right":
        transform = "rotate(90, 70, 70)";
        break;
      case "left up":
      case "down right":
        break;
      case "right down":
      case "up left":
        transform = "rotate(180, 70, 70)";
        break;
      default:
        break;
    }

    return (
      <svg
        key={`part${snakeIndex},${part.x},${part.y}`}
        x={getCornerPartXOffset(part, cornerType)}
        y={getCornerPartYOffset(part, cornerType)}
        width={CELL_SIZE + 2 * CELL_SPACING}
        height={CELL_SIZE + 2 * CELL_SPACING}
        fill={snake.color}
        viewBox={viewBox}
        shapeRendering="optimizeSpeed"
      >
        <path d={path} transform={transform} />
      </svg>
    );
  }

  renderTailPart(snake, snakeIndex, part, highlighted) {
    const x = getTailXOffset(part);
    const y = getTailYOffset(part);
    const box = snake.tailSvg.viewBox.baseVal;
    const transform = getTailTransform(part.direction, box);
    const viewBoxStr = `${box.x} ${box.y} ${box.width} ${box.height}`;

    return (
      <svg
        key={"part" + snakeIndex + ",tail"}
        viewBox={viewBoxStr}
        x={x}
        y={y}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={snake.color}
        shapeRendering="optimizeSpeed"
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
      >
        {range(this.props.rows).map((_, row) =>
          range(this.props.columns).map((_, col) => (
            <rect
              key={"cell" + row + "," + col}
              x={toGridSpace(col)}
              y={toGridSpace(row)}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={
                this.props.theme === themes.dark
                  ? colors.gridCellBackgroundDark
                  : colors.gridCellBackground
              }
              shapeRendering="optimizeSpeed"
            />
          ))
        )}

        {sortedSnakes.map((snake, snakeIndex) => {
          return (
            <g
              key={`snake${snakeIndex}`}
              opacity={getOpacity(snake, this.props.highlightedSnake)}
            >
              {snake.body.map((part, partIndex) =>
                this.renderPart(
                  snake,
                  snakeIndex,
                  part,
                  partIndex,
                  this.props.highlightedSnake
                )
              )}
            </g>
          );
        })}

        {food.map((f, foodIndex) => (
          <circle
            key={"food" + foodIndex}
            cx={toGridSpace(f.x) + CELL_SIZE / 2}
            cy={toGridSpace(f.y) + CELL_SIZE / 2}
            r={FOOD_SIZE}
            fill={colors.food}
            shapeRendering="optimizeQuality"
          />
        ))}
      </svg>
    );
  }

  render() {
    if (this.props.snakes) {
      return this.renderGrid();
    } else {
      return;
    }
  }
}

export default Grid;
