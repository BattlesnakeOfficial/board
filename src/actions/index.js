import { readAllFrames } from '../utils/engine-client';

export const gameOver = () => ({
    type: 'GAME_OVER'
});

export const requestFrames = (game, engine) => ({
    type: 'REQUEST_FRAMES'
});

export const receiveFrame = (game, frame) => ({
    type: 'RECEIVE_FRAME',
    game,
    frame
});

export const fetchFrames = (game, engine) => {
    return (dispatch) => {
        dispatch(requestFrames(game, engine));

        return readAllFrames(engine, game, (game, frame) => {
            // Workaround for bug where turn exluded on turn 0
            frame.Turn = frame.Turn || 0;
            dispatch(receiveFrame(game, frame));
        }).then(() => {
            dispatch(gameOver());
        });
    };
}