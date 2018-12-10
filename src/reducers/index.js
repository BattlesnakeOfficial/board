import { formatFrame } from "../utils/game-state";

export default (state = {}, action) => {
  switch (action.type) {
    case "PAUSE_GAME":
      return { ...state, paused: true };
    case "RESUME_GAME":
      return { ...state, paused: false };
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
    default:
      return { ...state };
  }
};
