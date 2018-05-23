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

    await streamAllFrames(engine, game, (game, frame) => {
      // Workaround for bug where turn exluded on turn 0
      frame.Turn = frame.Turn || 0;
      dispatch(receiveFrame(game, frame));
    });
    dispatch(gameOver());
  };
};
