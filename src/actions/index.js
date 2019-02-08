import {
  delay,
  fetchGameStart,
  getFrameByTurn,
  streamAllFrames
} from "../utils/engine-client";

export const setEngineOptions = engineOptions => ({
  type: "SET_ENGINE_OPTIONS",
  engineOptions
});

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

export const setGameStatus = status => ({
  type: "SET_GAME_STATUS",
  status
});

export const pauseGame = () => ({
  type: "PAUSE_GAME"
});

export const resumeGame = () => ({
  type: "RESUME_GAME"
});

export const highlightSnake = snakeId => ({
  type: "HIGHLIGHT_SNAKE",
  snakeId
});

export const fetchFrames = () => {
  return async (dispatch, getState) => {
    const {
      autoplay,
      engine: engineUrl,
      game: gameId
    } = getState().engineOptions;

    dispatch(requestFrames());

    await streamAllFrames(engineUrl, gameId, (game, frame) => {
      dispatch(setGameStatus(game.Game.Status));

      // Workaround for bug where turn exluded on turn 0
      frame.Turn = frame.Turn || 0;
      dispatch(receiveFrame(game, frame));

      // Workaround to render the first frame into the board
      if (frame.Turn === 0) {
        const frame = getState().frames[0];
        dispatch(setCurrentFrame(frame));
        if (autoplay) {
          dispatch(resumeGame());
          dispatch(playFromFrame(frame));
        }
      }
    });
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
    const { currentFrame, gameStatus, paused, engineOptions } = getState();
    if (paused) {
      if (gameStatus === "stopped") {
        await fetchGameStart(engineOptions.engine, engineOptions.game);
        dispatch(fetchFrames());
      }

      dispatch(resumeGame());
      dispatch(playFromFrame(currentFrame));
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
