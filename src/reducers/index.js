import { formatFrame } from "../utils/game-state";

const frames = (state = {}, action) => {
  switch (action.type) {
    case "RECEIVE_FRAME":
      const frame = formatFrame(action.frame);
      return {
        ...state,
        grid: {
          height: action.game.Game.Height,
          width: action.game.Game.Width
        },
        snakes: frame.snakes,
        food: frame.food
      };
    case "REQUEST_FRAMES":
      return { ...state };
    case "FETCH_FRAMES":
      return { ...state };
    default:
      return { ...state };
  }
};

export default frames;
