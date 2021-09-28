import React from "react";
import { colors } from "../../../theme";

let toggle = false;

const style = {
  color: colors.danger,
  cursor: "pointer"
};

function toggleState(toggle) {
  toggle = !toggle;
  return toggle;
}

function getIcon(code) {
  return code ? "error" : "warning";
}

const StatusIndicator = ({ code, clickHandler = () => {} }) => {
  if (!Number(code)) {
    return "";
  }
  return (
    <div style={style} onClick={clickHandler(code, toggleState(toggle))}>
      <span className="material-icons">{getIcon(code)}</span>
    </div>
  );
};

export default StatusIndicator;
