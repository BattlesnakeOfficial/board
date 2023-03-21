import React from "react";
import { colors, themes } from "../theme";

const HIGHLIGHT_DIM = 0.15;
const DEAD_OPACITY = 0.1;
const OVERLAP_OPACITY = 0.3;
const SNAKE_ON_SNAKE_OPACITY = 0.8;
const FULL_OPACITY = 1.0;

const CELL_SIZE = 20;
const CELL_SPACING = 4;
const FOOD_SIZE = (CELL_SIZE / 3.25).toFixed(2);
const END_OVERLAP = 0.1;

const DIRECTIONS_CW = ["up", "right", "down", "left"];

// let GRID_COLUMNS = 0;  Unused for now.
let GRID_ROWS = 0;

function toGridSpaceX(slot) {
  return (CELL_SIZE + CELL_SPACING) * slot + CELL_SPACING;
}

function toGridSpaceY(slot) {
  // Y-Axis in board space is inverted, positive goes up
  return (CELL_SIZE + CELL_SPACING) * (GRID_ROWS - 1 - slot) + CELL_SPACING;
}

function getPartWidth(part) {
  const extraWidth =
    part.direction === "left" || part.direction === "right"
      ? 2 * CELL_SPACING
      : 0;
  return CELL_SIZE + extraWidth;
}

function getPartHeight(part) {
  const extraHeight =
    part.direction === "up" || part.direction === "down" ? 2 * CELL_SPACING : 0;
  return CELL_SIZE + extraHeight;
}

function getPartXOffset(part) {
  const xBias =
    part.direction === "left" || part.direction === "right" ? -CELL_SPACING : 0;
  return toGridSpaceX(part.x) + xBias;
}

function getPartYOffset(part) {
  const yBias =
    part.direction === "up" || part.direction === "down" ? -CELL_SPACING : 0;
  return toGridSpaceY(part.y) + yBias;
}

function getCornerPartXOffset(part, type) {
  return toGridSpaceX(part.x) - CELL_SPACING;
}

function getCornerPartYOffset(part, type) {
  return toGridSpaceY(part.y) - CELL_SPACING;
}

function getTailXOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "left":
      return toGridSpaceX(part.x) - END_OVERLAP;
    case "right":
      return toGridSpaceX(part.x) + END_OVERLAP;
    default:
      return toGridSpaceX(part.x);
  }
}

function getTailYOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "up":
      return toGridSpaceY(part.y) - END_OVERLAP;
    case "down":
      return toGridSpaceY(part.y) + END_OVERLAP;
    default:
      return toGridSpaceY(part.y);
  }
}

function getHeadXOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "left":
      return toGridSpaceX(part.x) + END_OVERLAP;
    case "right":
      return toGridSpaceX(part.x) - END_OVERLAP;
    default:
      return toGridSpaceX(part.x);
  }
}

function getHeadYOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "up":
      return toGridSpaceY(part.y) + END_OVERLAP;
    case "down":
      return toGridSpaceY(part.y) - END_OVERLAP;
    default:
      return toGridSpaceY(part.y);
  }
}

function getHeadFillerXOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "left":
      return toGridSpaceX(part.x + 1) - CELL_SPACING - END_OVERLAP;
    case "right":
      return toGridSpaceX(part.x) - CELL_SPACING - END_OVERLAP;
    default:
      return toGridSpaceX(part.x);
  }
}

function getHeadFillerYOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "up":
      return toGridSpaceY(part.y - 1) - CELL_SPACING - END_OVERLAP;
    case "down":
      return toGridSpaceY(part.y) - CELL_SPACING - END_OVERLAP;
    default:
      return toGridSpaceY(part.y);
  }
}

function getTailFillerXOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "right":
      return toGridSpaceX(part.x + 1) - CELL_SPACING - END_OVERLAP;
    case "left":
      return toGridSpaceX(part.x) - CELL_SPACING - END_OVERLAP;
    default:
      return toGridSpaceX(part.x);
  }
}

function getTailFillerYOffset(part) {
  // apply slight offset to avoid ugly white line in between parts (works most of the time)
  switch (part.direction) {
    case "down":
      return toGridSpaceY(part.y - 1) - CELL_SPACING - END_OVERLAP;
    case "up":
      return toGridSpaceY(part.y) - CELL_SPACING - END_OVERLAP;
    default:
      return toGridSpaceY(part.y);
  }
}

function getFillerWidth(part) {
  return part.direction === "left" || part.direction === "right"
    ? CELL_SPACING + 2 * END_OVERLAP
    : CELL_SIZE;
}

function getFillerHeight(part) {
  return part.direction === "left" || part.direction === "right"
    ? CELL_SIZE
    : CELL_SPACING + 2 * END_OVERLAP;
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

function getPartOpacity(part) {
  if (part.shadeForOverlap) {
    return SNAKE_ON_SNAKE_OPACITY;
  } else if (part.isOverlapped) {
    return OVERLAP_OPACITY;
  } else {
    return FULL_OPACITY;
  }
}

function getPartColor(snake, part) {
  if (part.shadeForOverlap) {
    return colors.overlapSnake;
  } else {
    return snake.color;
  }
}

function range(size) {
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(i);
  }
  return result;
}

function sortAliveSnakesOnTop(snakes, highlightedSnake) {
  return snakes.concat().sort((a, b) => {
    let aOrder = a.isDead ? 0 : 1;
    let bOrder = b.isDead ? 0 : 1;

    // always put the highlighted snake up top
    if (a._id === highlightedSnake) aOrder = 2;
    if (b._id === highlightedSnake) bOrder = 2;

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
      return `scale(-1,1) translate(-100,0)`;
    case "down":
      return `scale(-1,1) translate(-100,0) rotate(-90 ${halfX} ${halfY})`;
    case "up":
      return `scale(-1,1) translate(-100,0) rotate(90 ${halfX} ${halfY})`;
    default:
      return "";
  }
}

function areAdjacentDirections(d1, d2) {
  // Check if the directions are adjacent in the circular directions array
  // Otherwise they are the same or opposite directions
  return (
    Math.abs(DIRECTIONS_CW.indexOf(d1) - DIRECTIONS_CW.indexOf(d2)) % 2 === 1
  );
}

function checkIfCornerPart(snake, partIndex) {
  // If head or tail of the snake, then false
  if (partIndex === 0 || partIndex === snake.body.length - 1) return false;

  const behind = snake.body[partIndex + 1];
  const current = snake.body[partIndex];

  // Return false if the behind part has the same position as the current.
  // Relevant for when the snake initially spawns.
  if (behind.x === current.x && behind.y === current.y) return false;

  // Check if the directions are adjacent in the circular directions array
  // Otherwise they are the same or opposite directions and should be rendered with a straight part
  return areAdjacentDirections(current.direction, behind.direction);
}

function determineCornerType(snake, partIndex) {
  // If head or tail of the snake, then false
  if (partIndex === 0 || partIndex === snake.body.length - 1) return false;

  const behind = snake.body[partIndex + 1];
  const current = snake.body[partIndex];

  return `${current.direction} ${behind.direction}`;
}

function isOverlappedByTail(snake, part) {
  const head = snake.body[snake.body.length - 1];
  return part.isOverlapped && head.x === part.x && head.y === part.y;
}

class Grid extends React.Component {
  renderPart(snake, snakeIndex, part, partIndex) {
    if (isOverlappedByTail(snake, part)) return;
    switch (part.type) {
      case "head":
        return this.renderHeadPart(snake, snakeIndex, part);
      case "tail":
        return this.renderTailPart(snake, snakeIndex, part);
      default:
        if (checkIfCornerPart(snake, partIndex)) {
          return this.renderCornerPart(snake, snakeIndex, part, partIndex);
        } else {
          return this.renderMiddlePart(snake, snakeIndex, part, partIndex);
        }
    }
  }

  renderHeadPart(snake, snakeIndex, part) {
    const x = getHeadXOffset(part);
    const y = getHeadYOffset(part);
    const box = snake.headSvg.viewBox.baseVal;
    const transform = getHeadTransform(part.direction, box);
    const viewBoxStr = `${box.x} ${box.y} ${box.width} ${box.height}`;
    let color = getPartColor(snake, part);
    let opacity = getPartOpacity(part);

    return (
      <g key={"part" + snakeIndex + ",head"}>
        <svg
          viewBox={viewBoxStr}
          x={x}
          y={y}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={color}
          opacity={opacity}
          shapeRendering="auto"
        >
          <g
            transform={transform}
            dangerouslySetInnerHTML={{ __html: snake.headSvg.innerHTML }}
          />
        </svg>
        {snake.effectiveSpace > 1 && (
          // only add filler if the snake is effectively longer than one tile
          <rect
            x={getHeadFillerXOffset(part)}
            y={getHeadFillerYOffset(part)}
            width={getFillerWidth(part)}
            height={getFillerHeight(part)}
            fill={color}
            opacity={opacity}
            shapeRendering="auto"
          />
        )}
      </g>
    );
  }

  renderMiddlePart(snake, snakeIndex, part, partIndex) {
    let color = getPartColor(snake, part);
    let opacity = getPartOpacity(part);

    return (
      <rect
        key={`part${snakeIndex},${part.x},${part.y}`}
        x={getPartXOffset(part)}
        y={getPartYOffset(part)}
        width={getPartWidth(part)}
        height={getPartHeight(part)}
        fill={color}
        opacity={opacity}
        shapeRendering="auto"
      />
    );
  }

  renderCornerPart(snake, snakeIndex, part, partIndex) {
    let viewBox, transform;
    let path = "M0,20 h60 a60,60 0 0 1 60,60 v60 h-100 v-20 h-20 z";
    let color = getPartColor(snake, part);
    let opacity = getPartOpacity(part);

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
        fill={color}
        opacity={opacity}
        viewBox={viewBox}
        shapeRendering="auto"
      >
        <path d={path} transform={transform} />
      </svg>
    );
  }

  renderTailPart(snake, snakeIndex, part) {
    const x = getTailXOffset(part);
    const y = getTailYOffset(part);
    const box = snake.tailSvg.viewBox.baseVal;
    const transform = getTailTransform(part.direction, box);
    const viewBoxStr = `${box.x} ${box.y} ${box.width} ${box.height}`;
    let color = getPartColor(snake, part);
    let opacity = getPartOpacity(part);

    return (
      <g key={"part" + snakeIndex + ",tail"}>
        <svg
          viewBox={viewBoxStr}
          x={x}
          y={y}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={color}
          opacity={opacity}
          shapeRendering="auto"
        >
          <g
            transform={transform}
            dangerouslySetInnerHTML={{ __html: snake.tailSvg.innerHTML }}
          />
        </svg>
        {snake.effectiveSpace > 1 && (
          // only add filler if the snake is effectively longer than one tile
          <rect
            x={getTailFillerXOffset(part)}
            y={getTailFillerYOffset(part)}
            width={getFillerWidth(part)}
            height={getFillerHeight(part)}
            fill={color}
            opacity={opacity}
            shapeRendering="auto"
          />
        )}
      </g>
    );
  }

  renderLabel(row, col, label) {
    return (
      <foreignObject
        key={"label" + row + col}
        x={toGridSpaceX(col)}
        y={toGridSpaceY(row)}
        width={CELL_SIZE}
        height={CELL_SIZE}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.5
          }}
        >
          <div style={{ fontSize: "80%" }}>{label}</div>
        </div>
      </foreignObject>
    );
  }

  renderLabels() {
    return (
      <>
        {range(this.props.rows).map((_, row) => this.renderLabel(row, -1, row))}

        {range(this.props.columns).map((_, col) =>
          this.renderLabel(-1, col, col)
        )}
      </>
    );
  }

  renderGrid() {
    // GRID_COLUMNS = this.props.columns;
    GRID_ROWS = this.props.rows;

    const unsortedSnakes = this.props.snakes || [];
    const food = this.props.food || [];
    const hazards = this.props.hazards || [];

    // Make alive snakes render on top of dead snakes
    const sortedSnakes = sortAliveSnakesOnTop(
      unsortedSnakes,
      this.props.highlightedSnake
    );

    if (!this.props.highlightedSnake) {
      // track all of the grid cells that will have a snake part drawn in them.  Successive snake parts
      // drawn in the same cell need to be flagged so they render differently and layer properly
      let gridCellsWithSnakeParts = Array(this.props.rows);
      for (let i = 0; i < gridCellsWithSnakeParts.length; i++) {
        gridCellsWithSnakeParts[i] = Array(this.props.columns);
        for (let j = 0; j < this.props.columns; j++) {
          gridCellsWithSnakeParts[i][j] = false;
        }
      }

      // Go through each snake, in the order they will be drawn and mark the cells they will occupy.
      // flag parts that would be drawn in cells that are already claimed
      for (let i = 0; i < sortedSnakes.length; i++) {
        let snake = sortedSnakes[i];
        if (!snake.isDead) {
          for (let x = 0; x < snake.body.length; x++) {
            let part = snake.body[x];
            if (!isOverlappedByTail(snake, part)) {
              if (gridCellsWithSnakeParts[part.y][part.x]) {
                part.shadeForOverlap = true;
              } else {
                gridCellsWithSnakeParts[part.y][part.x] = true;
              }
            }
          }
        }
      }
    }

    const viewBoxWidth =
      (CELL_SIZE + CELL_SPACING) * this.props.columns + CELL_SPACING;
    const viewBoxHeight =
      (CELL_SIZE + CELL_SPACING) * this.props.rows + CELL_SPACING;

    const hazardOpacity = parseFloat(colors.hazardOpacity);

    const overflow = this.props.showCoordinateLabels ? "visible" : "hidden";

    return (
      <svg
        className="grid"
        width={this.props.maxWidth}
        height={this.props.maxHeight}
        x={this.props.x}
        y={this.props.y}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        overflow={overflow}
      >
        {this.props.showCoordinateLabels && this.renderLabels()}
        {range(this.props.rows).map((_, row) =>
          range(this.props.columns).map((_, col) => (
            <rect
              key={"cell" + row + "," + col}
              x={toGridSpaceX(col)}
              y={toGridSpaceY(row)}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={
                this.props.theme === themes.dark
                  ? colors.gridCellBackgroundDark
                  : colors.gridCellBackground
              }
              shapeRendering="auto"
            />
          ))
        )}
        {sortedSnakes.map((snake, snakeIndex) => {
          return (
            <g
              key={`snake${snakeIndex}`}
              className="snake"
              opacity={getOpacity(snake, this.props.highlightedSnake)}
            >
              {[...snake.body]
                .reverse()
                .map((part, partIndex) =>
                  this.renderPart(
                    snake,
                    snakeIndex,
                    part,
                    snake.body.length - partIndex - 1,
                    this.props.highlightedSnake
                  )
                )}
            </g>
          );
        })}
        {hazards.map((o, hazardIndex) => (
          <rect
            key={"hazard" + hazardIndex}
            x={toGridSpaceX(o.x)}
            y={toGridSpaceY(o.y)}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill={colors.hazard}
            fillOpacity={hazardOpacity}
            shapeRendering="auto"
          />
        ))}
        {food.map((f, foodIndex) => {
          if (this.props.foodImage) {
            return (
              <image
                key={"food" + foodIndex}
                x={toGridSpaceX(f.x)}
                y={toGridSpaceY(f.y)}
                width={CELL_SIZE}
                height={CELL_SIZE}
                href={this.props.foodImage}
              />
            );
          } else {
            return (
              <circle
                key={"food" + foodIndex}
                className="food"
                cx={toGridSpaceX(f.x) + CELL_SIZE / 2}
                cy={toGridSpaceY(f.y) + CELL_SIZE / 2}
                r={FOOD_SIZE}
                fill={colors.food}
                shapeRendering="optimizeQuality"
              />
            );
          }
        })}
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
