import React from "react";
import { colors } from "../../../theme";
import "./ErrorMessage.css";

const errorColor = {
  color: colors.danger
};

function getIcon(code) {
  return "error";
}

const ErrorMessage = ({ code, message }) => (
  <div className="error-message" style={errorColor}>
    <span className="material-icons">{getIcon(code)}</span>
    <span>{message}</span>
  </div>
);

export default ErrorMessage;
