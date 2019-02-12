import { formatFrame } from "../utils/game-state";

export default (state = {}, action) => {
  switch (action.type) {
    case "SET_ENGINE_OPTIONS":
      action.engineOptions.autoplay =
        action.engineOptions.autoplay &&
        action.engineOptions.autoplay === "true";
      return { ...state, engineOptions: action.engineOptions };
    case "PAUSE_GAME":
      return { ...state, paused: true };
    case "GAME_OVER":
      return { ...state, paused: true };
    case "RESUME_GAME":
      return { ...state, paused: false };
    case "SET_GAME_STATUS":
      return { ...state, gameStatus: action.status };
    case "SET_CURRENT_FRAME":
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
      postHighlightMessage(state, action);
      return { ...state, highlightedSnake: action.snakeId };
    default:
      return { ...state };
  }
};

function postHighlightMessage(state, action) {
  if (!window.parent) {
    return;
  }
  try {
    window.parent.postMessage(
      {
        action: "HIGHLIGHT_SNAKE",
        id: action.snakeId,
        name: action.snakeId
          ? state.currentFrame.snakes.find(s => s._id === action.snakeId).name
          : null
      },
      "*"
    );
  } catch (e) {
    console.error(e);
  }
}
