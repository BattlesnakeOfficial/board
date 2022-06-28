import React from "react";
import { colors } from "../../../theme";
import "./ErrorMessage.css";

const errorColor = {
  color: colors.danger
};

function getIcon(code) {
  return "error";
}

const ErrorMessage = props => {
  let code, message;

  if (props.error === "") {
    return "";
  }

  [code, message] = props.error.toString().split(":");

  return (
    <div className="error-message" style={errorColor}>
      <span className="material-icons material-icons-inline">
        {getIcon(code)}
      </span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
