import React from "react";
import Avatar from "./avatar";
import styled from "react-emotion";
import BlankState from "./blank-state";

const DEAD_OPACITY = 0.25;

const Grid = styled("div")({
  borderLeft: "1px solid black",
  borderTop: "1px solid black",
  padding: 0,
  display: "inline-block"
});

const Row = styled("div")({
  margin: 0,
  padding: 0,
  height: "21px"
});

const Cell = styled("div")(
  {
    display: "inline-block",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    width: "20px",
    height: "20px",
    margin: 0,
    padding: 0
  },
  props => {
    const color = props.snakePart ? props.snakePart.color : undefined;
    const isDead = props.snakePart ? props.snakePart.isDead : false;

    return {
      backgroundColor: props.isFood ? "pink" : color,
      opacity: isDead ? DEAD_OPACITY : 1
    };
  }
);

class Board extends React.Component {
  componentWillMount() {
    console.log(this.props.options.game, this.props.options.engine);
    if (this.props.options.game && this.props.options.engine) {
      this.props.fetchFrames(
        this.props.options.game,
        this.props.options.engine
      );
    } else {
      this.invalidArgs = true;
    }
  }

  render() {
    if (this.invalidArgs) {
      return <BlankState />;
    } else {
      return this.renderGame();
    }
  }

  renderGame() {
    const grid = this.props.grid;

    return (
      <div>
        <div>
          {this.props.snakes
            ? this.props.snakes.map((snake, i) => (
                <Avatar snake={snake} key={"avatar" + i} />
              ))
            : undefined}
        </div>

        <Grid>
          {grid.map((row, rowIndex) => (
            <Row key={"row" + rowIndex}>
              {row.map(cell => (
                <Cell
                  isFood={cell.isFood}
                  snakePart={cell.snakePart}
                  key={"cell" + cell.index}
                />
              ))}
            </Row>
          ))}
        </Grid>
      </div>
    );
  }
}

export default Board;
