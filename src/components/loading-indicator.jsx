import React from "react";
import styled from "@emotion/styled";

import { colors } from "../theme";

const LoadingIndicatorWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%"
});

class LoadingIndicator extends React.Component {
  render() {
    return (
      <LoadingIndicatorWrapper>
        <div
          className="la-ball-grid-beat la-dark la-2x"
          style={{
            color: colors.food
          }}
        >
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </LoadingIndicatorWrapper>
    );
  }
}

export default LoadingIndicator;
