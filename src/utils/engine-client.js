import { streamAll } from "../io/websocket";
import { makeQueryString, httpToWsProtocol } from "./url";

const SNAKE_MIN_DELAY_MILLIS = 50;

function join(a, b) {
  return a.replace(/\/+$/, "") + "/" + b.replace(/^\/+/, "");
}

async function get(url, query) {
  const fetchResult = await fetch(url + makeQueryString(query));
  return fetchResult.json();
}

function oneLeft(snakes) {
  const alive = snakes.filter(s => !s.Death);
  return alive.length <= 1;
}

function isLastFrameOfGame(game, frame) {
  if (frame.Snakes.length === 0) {
    return true;
  }

  if (frame.Snakes.length === 1) {
    return !!frame.Snakes[0].Death;
  }

  return oneLeft(frame.Snakes);
}

function delay(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

export function getGameInfo(baseUrl, gameId) {
  const url = join(baseUrl, `games/${gameId}`);
  return get(url);
}

export async function streamAllFrames(baseUrl, gameId, receiveFrame) {
  const game = await getGameInfo(baseUrl, gameId);

  let chain = Promise.resolve();

  function onFrame(frame) {
    chain = chain.then(async () => {
      await delay(SNAKE_MIN_DELAY_MILLIS);
      return receiveFrame(game, frame);
    });
    return isLastFrameOfGame(game, frame);
  }

  const wsUrl = join(httpToWsProtocol(baseUrl), `socket/${gameId}`);
  await streamAll(wsUrl, onFrame);
  await chain;
}
