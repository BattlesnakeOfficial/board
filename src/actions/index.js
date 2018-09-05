import { streamAllFrames } from "../utils/engine-client";

export const gameOver = () => ({
  type: "GAME_OVER"
});

export const requestFrames = (game, engine) => ({
  type: "REQUEST_FRAMES"
});

export const receiveFrame = (game, frame) => ({
  type: "RECEIVE_FRAME",
  game,
  frame
});

export const fetchFrames = (game, engine) => {
  return async dispatch => {
    dispatch(requestFrames(game, engine));
    const start = new Date().getTime();
    let turn = 0;

    await streamAllFrames(engine, game, (game, frame) => {
      // Workaround for bug where turn exluded on turn 0
      turn++;
      frame.Turn = frame.Turn || 0;
      dispatch(receiveFrame(game, frame));
    });

    const now = new Date().getTime();
    const delta = now - start;
    const millisPerTurn = delta / turn;
    console.log(
      `${turn} turns in ${delta} milliseconds - ${millisPerTurn}/turn`
    );
    dispatch(gameOver());
  };
};
