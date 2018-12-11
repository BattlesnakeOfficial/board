import { streamAllFrames, getFrameByTurn, delay } from "../utils/engine-client";

export const gameOver = () => ({
  type: "GAME_OVER"
});

export const requestFrames = () => ({
  type: "REQUEST_FRAMES"
});

export const receiveFrame = (game, frame) => ({
  type: "RECEIVE_FRAME",
  game,
  frame
});

export const setCurrentFrame = frame => ({
  type: "SET_CURRENT_FRAME",
  frame
});

export const pauseGame = () => ({
  type: "PAUSE_GAME"
});

export const resumeGame = () => ({
  type: "RESUME_GAME"
});

export const fetchFrames = (game, engine) => {
  return async (dispatch, getState) => {
    dispatch(requestFrames());

    await streamAllFrames(engine, game, (game, frame) => {
      // Workaround for bug where turn exluded on turn 0
      frame.Turn = frame.Turn || 0;
      dispatch(receiveFrame(game, frame));

      // Workaround to render the first frame into the board
      if (frame.Turn === 0) {
        const frame = getState().frames[0];
        dispatch(setCurrentFrame(frame));
      }
    });
  };
};

export const playAllFrames = () => {
  return async (dispatch, getState) => {
    for (const frame of getState().frames) {
      if (getState().paused) return;
      await delay(50);
      dispatch(setCurrentFrame(frame));
    }

    console.log("GAME OVER 1");
    if (!getState().paused) dispatch(gameOver());
  };
};

export const playFromFrame = frame => {
  return async (dispatch, getState) => {
    const frames = getState().frames.slice(); // Don't modify in place
    const frameIndex = frames.indexOf(frame);
    const slicedFrames = frames.slice(frameIndex);

    for (const frame of slicedFrames) {
      if (getState().paused) return;
      await delay(50);
      dispatch(setCurrentFrame(frame));
    }

    const lastFrame = slicedFrames[slicedFrames.length - 1];
    if (lastFrame.gameOver) {
      if (!getState().paused) dispatch(gameOver());
    } else {
      dispatch(playFromFrame(lastFrame));
    }
  };
};

export const toggleGamePause = () => {
  return async (dispatch, getState) => {
    if (getState().paused) {
      dispatch(resumeGame());
      dispatch(playFromFrame(getState().currentFrame));
    } else {
      dispatch(pauseGame());
    }
  };
};

export const stepForwardFrame = () => {
  return async (dispatch, getState) => {
    const { currentFrame, frames } = getState();
    const stepToFrame = getFrameByTurn(frames, currentFrame.turn + 1);
    if (stepToFrame) {
      dispatch(setCurrentFrame(stepToFrame));
    }
  };
};

export const stepBackwardFrame = () => {
  return async (dispatch, getState) => {
    const { currentFrame, frames } = getState();
    const stepToFrame = getFrameByTurn(frames, currentFrame.turn - 1);
    if (stepToFrame) {
      dispatch(setCurrentFrame(stepToFrame));
    }
  };
};
