import React from "react";
// import HealthBar from "./health-bar";
// import styled from "react-emotion";

// const DEAD_OPACITY = 0.25;

// const Container = styled("div")(
//   {
//     display: "inline-block",
//     border: "2px solid black",
//     padding: "5px",
//     margin: "0 4px 4px 0"
//   },
//   props => ({ opacity: props.opacity })
// );

class Avatar extends React.Component {
  render() {
    // const isDead = !!this.props.snake.Death;
    // const opacity = isDead ? DEAD_OPACITY : 1;

    // return (
    //   <Container opacity={opacity}>
    //     <div>{this.props.snake.name}</div>
    //     <HealthBar snake={this.props.snake} />
    //   </Container>
    // );

    const headSize = this.props.height - 4;
    const viewBoxWidth = 100;
    const viewBoxHeight = viewBoxWidth / (this.props.width / this.props.height);
    const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

    return (
      <svg
        x={this.props.x}
        y={this.props.y + 2}
        viewBox={viewBox}
        width={this.props.width}
        height={this.props.height}
      >
        <g
          dangerouslySetInnerHTML={{
            __html: this.props.snake.headSvg.innerHTML
          }}
        />
      </svg>
    );
  }
}

export default Avatar;
