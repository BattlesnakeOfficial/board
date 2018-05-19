import React from "react";
import Avatar from "./avatar";
import styled from "react-emotion";

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
  props => ({
    backgroundColor: props.isFood ? "pink" : props.color,
    opacity: props.isDead ? DEAD_OPACITY : 1
  })
);

class Board extends React.Component {
  componentDidMount() {
    this.props.fetchFrames(this.props.options.game, this.props.options.engine);
  }

  render() {
    const grid = this.props.grid;

    return (
      <div>
        <div>
          {this.props.snakes
            ? this.props.snakes.map(snake => <Avatar snake={snake} />)
            : undefined}
        </div>

        <Grid>
          {grid.map((row, rowIndex) => (
            <Row key={"row" + rowIndex}>
              {row.map(cell => (
                <Cell
                  isFood={cell.isFood}
                  isDead={cell.isDead}
                  color={cell.color}
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
