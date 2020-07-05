import React from "react";
import styled from "@emotion/styled";

import { colors } from "../theme";

const NotFoundWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%"
});

class GameNotFound extends React.Component {
  render() {
    return (
      <NotFoundWrapper>
        <h2
          style={{
            color: colors.food
          }}
        >
          Game no longer available, sorry!
        </h2>
      </NotFoundWrapper>
    );
  }
}

export default GameNotFound;
