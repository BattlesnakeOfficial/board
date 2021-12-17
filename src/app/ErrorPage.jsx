import React from "react";
import { error } from "./ErrorPage.module.css";

const ErrorPage = props => {
  const { message, invalidArgs } = props;
  return (
    <main className={error}>
      {message && <div>{message}</div>}
      {invalidArgs && (
        <div>
          To run a game you need to specify engine and game parameters in the
          URL. For example:
          <pre>
            {window.location.origin}
            ?engine=&lt;ENGINE_URL&gt;&amp;game=&lt;GAME_ID&gt;
          </pre>
        </div>
      )}
      {!message && !invalidArgs && (
        <div>An error occurred. Please check console log for details.</div>
      )}
    </main>
  );
};

export default ErrorPage;
