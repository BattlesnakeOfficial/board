import { getJson } from "./http-client";

const FRAMES_PER_PAGE = 50;
const RETRY_DELAY_MILLIS = 2000;
const SNAKE_MIN_DELAY_MILLIS = 200;

export function getFrames(baseUrl, gameId, offset, limit) {
    const url = join(baseUrl, `/games/${gameId}/frames`);
    return get(url, { offset, limit });
}

function join(a, b) {
    return a.replace(/\/+$/, "") + "/" + b.replace(/^\/+/, "");
}

function makeQueryString(query) {
    if (!query) {
        return "";
    }

    let sep = "?";
    let result = "";

    for (const key in query) {
        const value = query[key];
        result += sep + key;

        if (value !== undefined) {
            result += "=" + value;
        }

        sep = "&";
    }

    return result;
}

function get(url, query) {
    return getJson(url + makeQueryString(query));
}

function isLastFrameOfGame(game, frame) {
    if (!frame) {
        return false;
    }
    return game.LastFrame && game.LastFrame.Turn <= frame.Turn;
}

function readFramePages(game, baseUrl, receiveFrame, page) {
    const offset = page * FRAMES_PER_PAGE;
    const limit = FRAMES_PER_PAGE;
    const id = game.Game.ID;
    const promise = getFrames(baseUrl, id, offset, FRAMES_PER_PAGE);
    return promise.then(res => {
        res.Frames = res.Frames || [];
        for (const frame of res.Frames) {
             receiveFrame(game, frame);
        }

        const lastFrameOfPage = res.Frames[res.Frames.length - 1];
        if (isLastFrameOfGame(game, lastFrameOfPage)) {
            return;
        }
        
        // Wait for a bit if last call was empty and game is still going so
        // we don't DOS the engine API.
        const delayMillis = res.Frames.length ? 0 : RETRY_DELAY_MILLIS;
        return delay(delayMillis).then(() => {
            readFramePages(game, baseUrl, receiveFrame, page+1);
        });
    });
}

function delay(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

export function getGameInfo(baseUrl, gameId) {
    const url = join(baseUrl, `games/${gameId}`);
    return get(url);
}

export function readAllFrames(baseUrl, gameId, receiveFrame) {
    let chain = Promise.resolve();

    function onFrame(g, f) {
        chain = chain.then(() => {
            return delay(SNAKE_MIN_DELAY_MILLIS).then(() => {
                receiveFrame(g, f);
            });
        });
    }

    return getGameInfo(baseUrl, gameId).then(g => {
        return readFramePages(g, baseUrl, onFrame, 0);
    });
}