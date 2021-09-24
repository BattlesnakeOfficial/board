import React from "react";
import { colors } from "../../../theme";
import "./ErrorMessage.css";

const errorColor = {
  color: colors.danger
};

function getIcon(code) {
  return code ? "error" : "";
}

const ErrorMessage = props => {
  const [code, message] = props.error.toString().split(":");

  if (!Number(code)) {
    return "";
  }
  return (
    <div className="error-message" style={errorColor}>
      <span className="material-icons">{getIcon(code)}</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
