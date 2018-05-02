import { makeGrid } from '../utils/grid';

const frames = (state = {}, action) => {
    switch (action.type) {
        case 'RECEIVE_FRAME':
            return {
                ...state,
                grid: makeGrid(action.game, action.frame)
            };
        case 'REQUEST_FRAMES':
            return { ...state };
        case 'FETCH_FRAMES':
            return { ...state };
        default:
            return { ...state };
    }
};

export default frames;