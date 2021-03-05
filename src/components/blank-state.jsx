import React from "react";

class BlankState extends React.Component {
  render() {
    return (
      <div>
        To run a game you need to specify engine and game parameters in the URL.
        For example:
        <pre>
          {window.location.origin}
          ?engine=&lt;ENGINE_URL&gt;&amp;game=&lt;GAME_ID&gt;
        </pre>
      </div>
    );
  }
}

export default BlankState;
