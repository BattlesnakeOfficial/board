import { delay, getFrameByTurn, streamAllEvents } from "../utils/engine-client";
import { themes } from "../theme";
import * as types from "./action-types";

// Sort of a hack, until we have persisted playback options
let DEFAULT_FPS = 10;
try {
  DEFAULT_FPS = localStorage.getItem("frameRate") || 10;
} catch (err) {
  console.log("unable to load localStorage");
}

export const setGameOptions = gameOptions => ({
  type: types.SET_GAME_OPTIONS,
  gameOptions
});

export const setTheme = theme => ({
  type: types.SET_THEME,
  theme
});

export const gameOver = () => ({
  type: types.GAME_OVER
});

export const gameNotFound = () => ({
  type: types.GAME_NOT_FOUND
});

export const requestFrames = () => ({
  type: types.REQUEST_FRAMES
});

export const receiveFrame = (game, frame) => ({
  type: types.RECEIVE_FRAME,
  game,
  frame
});

export const receiveEventEnd = (game, event) => ({
  type: types.RECEIVE_EVENT_END,
  game,
  endEvent: event
});

export const setCurrentFrame = frame => ({
  type: types.SET_CURRENT_FRAME,
  frame
});

export const setLastFrame = frame => ({
  type: types.SET_LAST_FRAME,
  frame
});

export const pauseGame = () => ({
  type: types.PAUSE_GAME
});

export const resumeGame = () => ({
  type: types.RESUME_GAME
});

export const highlightSnake = snakeId => ({
  type: types.HIGHLIGHT_SNAKE,
  snakeId
});

export const fetchFrames = () => {
  return async (dispatch, getState) => {
    const {
      autoplay,
      engine: engineUrl,
      game: gameId,
      turn
    } = getState().gameOptions;

    dispatch(requestFrames());

    try {
      await streamAllEvents(engineUrl, gameId, (game, eventType, eventData) => {
        if (eventType === "frame") {
          const frame = eventData;
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
        } else if (eventType === "game_end") {
          dispatch(receiveEventEnd(game, eventData));
          const numFrames = getState().frames.length;
          const frame = getState().frames[numFrames - 1];
          frame.isLastFrame = true;
          dispatch(setLastFrame(frame));
        }
      });
    } catch (e) {
      return dispatch(gameNotFound());
    }

    // Only navigate to the specified frame if it is within the
    // amount of frames available in the game
    if (turn && turn <= getState().frames.length) {
      const frame = getState().frames[turn];
      dispatch(setCurrentFrame(frame));
    }
  };
};

export const playFromFrame = frame => {
  return async (dispatch, getState) => {
    const { frameRate } = getState().gameOptions;
    const frames = getState().frames.slice(); // Don't modify in place
    const frameIndex = frames.indexOf(frame);
    const slicedFrames = frames.slice(frameIndex);

    const ceiledFps = Math.ceil(frameRate || DEFAULT_FPS);
    const delayMillis = 1000 / ceiledFps;

    for (const frame of slicedFrames) {
      if (getState().paused) return;
      dispatch(setCurrentFrame(frame));
      await delay(delayMillis);
    }

    const lastFrame = slicedFrames[slicedFrames.length - 1];
    if (lastFrame.gameOver) {
      if (!getState().paused) {
        if (getState().gameOptions.loop) {
          const frame = getFrameByTurn(frames, 0);
          dispatch(playFromFrame(frame));
        } else {
          dispatch(gameOver());
        }
      }
    } else {
      dispatch(playFromFrame(lastFrame));
    }
  };
};

export const reloadGame = () => {
  return async (dispatch, getState) => {
    const { frames, paused } = getState();
    if (paused) {
      const frame = getFrameByTurn(frames, 0);
      dispatch(setCurrentFrame(frame));
    }
  };
};

export const toggleGamePause = () => {
  return async (dispatch, getState) => {
    const { currentFrame, paused } = getState();

    if (paused) {
      dispatch(resumeGame());
      dispatch(playFromFrame(currentFrame));
    } else {
      dispatch(pauseGame());
    }
  };
};

export const toggleTheme = themeToSet => {
  return async (dispatch, getState) => {
    const { theme } = getState();
    dispatch(
      setTheme(themeToSet || theme === themes.dark ? themes.light : themes.dark)
    );
  };
};

export const stepForwardFrame = () => {
  return async (dispatch, getState) => {
    const { currentFrame, frames } = getState();
    const nextFrame = currentFrame.turn + 1;
    const stepToFrame = getFrameByTurn(frames, nextFrame);
    if (stepToFrame) {
      dispatch(setCurrentFrame(stepToFrame));
    }
  };
};

export const stepBackwardFrame = () => {
  return async (dispatch, getState) => {
    const { currentFrame, frames } = getState();
    const prevFrame = currentFrame.turn - 1;
    const stepToFrame = getFrameByTurn(frames, prevFrame);
    if (stepToFrame) {
      dispatch(setCurrentFrame(stepToFrame));
    }
  };
};
