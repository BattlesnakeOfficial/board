import React from "react";
import Avatar from "./avatar";
import "./board.css";

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

        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div className="row" key={"row" + rowIndex}>
              {row.map(cell => {
                const foodClass = cell.isFood ? " food" : "";
                const deadClass = cell.isDead ? " dead" : "";
                return (
                  <div
                    className={"cell " + deadClass + foodClass}
                    key={"cell" + cell.index}
                    style={{ backgroundColor: cell.color }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Board;
