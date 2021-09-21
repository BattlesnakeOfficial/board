import { formatFrame, sanitizeFrame } from "../utils/game-state";
import * as types from "../actions/action-types";

const reducers = (state = {}, action) => {
  switch (action.type) {
    case types.SET_THEME:
      return { ...state, theme: action.theme };
    case types.SET_GAME_OPTIONS:
      action.gameOptions.autoplay =
        action.gameOptions.autoplay && action.gameOptions.autoplay === "true";
      action.gameOptions.turn = parseInt(action.gameOptions.turn) || 0;
      action.gameOptions.loop =
        action.gameOptions.loop && action.gameOptions.loop === "true";
      return { ...state, gameOptions: action.gameOptions };
    case types.GAME_NOT_FOUND:
      return { ...state, gameNotFound: true };
    case types.PAUSE_GAME:
      return { ...state, paused: true };
    case types.GAME_OVER:
      windowPostMessage({
        action: action.type,
        endEvent: action.endEvent
      });
      return { ...state, paused: true };
    case types.RESUME_GAME:
      return { ...state, paused: false };
    case types.SET_CURRENT_FRAME:
      windowPostMessage({
        action: action.type,
        frame: sanitizeFrame(action.frame)
      });
      return { ...state, currentFrame: action.frame };
    case types.SET_LAST_FRAME:
      return { ...state, frames: [...state.frames, action.frame] };
    case types.RECEIVE_FRAME:
      const frame = formatFrame(action.frame);
      return {
        ...state,
        ruleset: action.game.Game.Ruleset,
        grid: {
          height: action.game.Game.Height,
          width: action.game.Game.Width
        },
        frames: [...state.frames, frame] // Be smart: this consumes A LOT of memory...
      };
    case types.RECEIVE_EVENT_END:
      return { ...state, endEvent: action.endEvent };
    case types.REQUEST_FRAMES:
      return { ...state };
    case types.FETCH_FRAMES:
      return { ...state };
    case types.HIGHLIGHT_SNAKE:
      windowPostMessage({
        action: action.type,
        id: action.snakeId,
        name: action.snakeId
          ? state.currentFrame.snakes.find(s => s._id === action.snakeId).name
          : null
      });
      return { ...state, highlightedSnake: action.snakeId };
    default:
      return { ...state };
  }
};

function windowPostMessage(data) {
  if (!window.parent) {
    return;
  }
  try {
    window.parent.postMessage(data, "*");
  } catch (e) {
    console.error(e);
  }
}

export default reducers;
