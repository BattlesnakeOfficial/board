import React from "react";
import { colors } from "../../../theme";

const style = {
  color: colors.danger,
  cursor: "pointer",
  margin: 0,
  padding: 0
};

function getIcon(code) {
  return "error";
}

const StatusIndicator = ({ errorMessage }) => {
  if (errorMessage === "") {
    return "";
  }

  // until we can refactor Avatar and not pass the whole error object
  const [code] = errorMessage.toString().split(":");

  return (
    <div style={style}>
      <span className="material-icons material-icons-inline">
        {getIcon(code)}
      </span>
    </div>
  );
};

export default StatusIndicator;
