import React from "react";
import { colors, themes } from "../theme";

const HIGHLIGHT_DIM = 0.15;
const DARK_DIM = 0.9;
const DEAD_OPACITY = 0.1;

const CELL_SIZE = 20;
const CELL_SPACING = 4;
const FOOD_SIZE = (CELL_SIZE / 3.25).toFixed(2);

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

function getHeadXOffset(part) {
  switch (part.direction) {
    case "left":
      return toGridSpace(part.x);
    case "right":
      return toGridSpace(part.x);
    default:
      return toGridSpace(part.x);
  }
}

function getHeadYOffset(part) {
  switch (part.direction) {
    case "up":
      return toGridSpace(part.y);
    case "down":
      return toGridSpace(part.y);
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
        opacity={getOpacity(snake, highlighted)}
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
    if (!part.shouldRender) {
      return <svg key={"part" + snakeIndex + "," + partIndex} />;
    }

    return (
      <rect
        key={`part${snakeIndex},${part.x},${part.y}`}
        x={getPartXOffset(part)}
        y={getPartYOffset(part)}
        width={getPartWidth(part)}
        height={getPartHeight(part)}
        fill={snake.color}
        opacity={getOpacity(snake, highlighted)}
        shapeRendering="optimizeSpeed"
      />
    );
  }

  renderCornerPart(snake, snakeIndex, part, partIndex, highlighted) {
    if (!part.shouldRender) {
      return (
        <svg
          key={`part${snakeIndex},${part.x},${part.y}`}
          shapeRendering="optimizeSpeed"
        />
      );
    }

    let viewBox, transform;
    let path = "M0,0 h40 a60,60 0 0 1 60,60 v80 h-100 z";

    switch (part.direction) {
      case "left":
      case "right":
        viewBox = "0 0 120 100";
        break;
      case "up":
      case "down":
      default:
        viewBox = "0 0 100 120";
        break;
    }

    switch (determineCornerType(snake, partIndex)) {
      case "down left":
        transform = "scale(-1,1) translate(-100, 0)";
        break;
      case "left down":
        transform = "rotate(90,0,0) translate(0,-120)";
        break;
      case "right down":
        transform = "rotate(90,0,0) scale(1,-1)";
        break;
      case "up right":
        transform = "scale(1,-1) translate(0,-120)";
        break;
      case "up left":
        transform = "scale(-1,-1) translate(-100,-120)";
        break;
      case "right up":
        transform = "rotate(-90,0,0) translate(-100,0)";
        break;
      case "left up":
        transform = "rotate(-90,0,0) scale(1,-1) translate(-100,-120)";
        break;
      case "down right":
      default:
        break;
    }

    return (
      <svg
        key={`part${snakeIndex},${part.x},${part.y}`}
        x={getPartXOffset(part)}
        y={getPartYOffset(part)}
        width={getPartWidth(part)}
        height={getPartHeight(part)}
        opacity={getOpacity(snake, highlighted)}
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

    if (!part.shouldRender) {
      return <svg key={"part" + snakeIndex + ",tail"} />;
    }

    return (
      <svg
        key={"part" + snakeIndex + ",tail"}
        viewBox={viewBoxStr}
        x={x}
        y={y}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={snake.color}
        opacity={getOpacity(snake, highlighted)}
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
                  ? colors.gridCellBackground
                  : colors.gridCellBackgroundDark
              }
              opacity={this.props.theme === themes.dark ? DARK_DIM : null}
              shapeRendering="optimizeSpeed"
            />
          ))
        )}

        {sortedSnakes.map((snake, snakeIndex) => {
          return snake.body.map((part, partIndex) =>
            this.renderPart(
              snake,
              snakeIndex,
              part,
              partIndex,
              this.props.highlightedSnake
            )
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
