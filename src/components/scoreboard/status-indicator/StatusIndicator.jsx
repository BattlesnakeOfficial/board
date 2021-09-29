import React from "react";
import { colors } from "../../../theme";

const style = {
  color: colors.danger,
  cursor: "pointer"
};

function getIcon(code) {
  return code ? "error" : "warning";
}

const StatusIndicator = ({ errorMessage = "", clickHandler = () => {} }) => {
  // until we can refactor Avatar and not pass the whole error object
  const [code] = errorMessage.toString().split(":");

  if (!Number(code)) {
    return "";
  }
  return (
    <div style={style} onClick={clickHandler}>
      <span className="material-icons">{getIcon(code)}</span>
    </div>
  );
};

export default StatusIndicator;
