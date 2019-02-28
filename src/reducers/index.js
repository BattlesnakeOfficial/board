import { formatFrame, sanitizeFrame } from "../utils/game-state";

export default (state = {}, action) => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.theme };
    case "SET_GAME_OPTIONS":
      action.gameOptions.autoplay =
        action.gameOptions.autoplay && action.gameOptions.autoplay === "true";
      action.gameOptions.turn = parseInt(action.gameOptions.turn) || 0;
      return { ...state, gameOptions: action.gameOptions };
    case "PAUSE_GAME":
      return { ...state, paused: true };
    case "GAME_OVER":
      return { ...state, paused: true };
    case "RESUME_GAME":
      return { ...state, paused: false };
    case "SET_CURRENT_FRAME":
      windowPostMessage({
        action: action.type,
        frame: sanitizeFrame(action.frame)
      });
      return { ...state, currentFrame: action.frame };
    case "RECEIVE_FRAME":
      const frame = formatFrame(action.frame);
      return {
        ...state,
        grid: {
          height: action.game.Game.Height,
          width: action.game.Game.Width
        },
        frames: [...state.frames, frame] // Be smart: this consumes A LOT of memory...
      };
    case "REQUEST_FRAMES":
      return { ...state };
    case "FETCH_FRAMES":
      return { ...state };
    case "HIGHLIGHT_SNAKE":
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
