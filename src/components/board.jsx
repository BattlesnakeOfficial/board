import React from "react";
import styled from "react-emotion";

const DEAD_OPACITY = 0.15;
const CELL_SIZE = 20;
const CELL_SPACING = 4;

function toGridSpace(slot) {
  return (CELL_SIZE + CELL_SPACING) * slot + CELL_SPACING;
}

const Grid = styled("div")(
  {
    backgroundColor: "#ddd",
    position: "relative"
  },
  props => {
    const width = toGridSpace(props.columns);
    const height = toGridSpace(props.rows);
    return {
      width: width + "px",
      height: height + "px"
    };
  }
);

const SnakePart = styled("div")(props => {
  const xBias = props.direction === "left" ? -CELL_SPACING : 0;
  const yBias = props.direction === "up" ? -CELL_SPACING : 0;
  const xOffset = toGridSpace(props.x) + xBias;
  const yOffset = toGridSpace(props.y) + yBias;

  const extraWidth =
    props.direction === "left" || props.direction === "right"
      ? CELL_SPACING
      : 0;

  const extraHeight =
    props.direction === "up" || props.direction === "down" ? CELL_SPACING : 0;

  return {
    width: CELL_SIZE + extraWidth,
    height: CELL_SIZE + extraHeight,
    left: xOffset + "px",
    top: yOffset + "px",
    backgroundColor: props.color,
    position: "absolute",
    opacity: props.isDead ? DEAD_OPACITY : 1
  };
});

const Food = styled("div")(
  {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: "orange",
    borderRadius: CELL_SIZE / 2 + "px"
  },
  props => {
    const xOffset = toGridSpace(props.x);
    const yOffset = toGridSpace(props.y);
    return {
      left: xOffset + "px",
      top: yOffset + "px",
      position: "absolute"
    };
  }
);

const Cell = styled("div")(
  {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: "#eee"
  },
  props => {
    const xOffset = toGridSpace(props.x);
    const yOffset = toGridSpace(props.y);
    return {
      left: xOffset + "px",
      top: yOffset + "px",
      position: "absolute"
    };
  }
);

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

    return (
      <div>
        <Grid rows={this.props.height} columns={this.props.width}>
          {range(this.props.height).map((_, row) =>
            range(this.props.width).map((_, col) => (
              <Cell x={col} y={row} key={"cell" + row + "," + col} />
            ))
          )}

          {snakes.map((snake, snakeIndex) =>
            snake.body.map((part, partIndex) => (
              <SnakePart
                x={part.x}
                y={part.y}
                color={snake.color}
                direction={part.direction}
                isDead={snake.isDead}
                key={"part" + snakeIndex + "," + partIndex}
              />
            ))
          )}

          {food.map((f, foodIndex) => (
            <Food x={f.x} y={f.y} key={"food" + foodIndex} />
          ))}
        </Grid>
      </div>
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
