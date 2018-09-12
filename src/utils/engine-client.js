import { streamAll } from "../io/websocket";
import { makeQueryString, httpToWsProtocol, join } from "./url";
import { loadSvgs, getSvg } from "./inline-svg";

const SNAKE_MIN_DELAY_MILLIS = 30;
const DEFAULT_SNAKE_HEAD = "regular";
const DEFAULT_SNAKE_TAIL = "regular";

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

// Gets a list of all unique SVG paths required by the snakes.
function getAllSvgs(snakes) {
  const all = snakes.reduce((result, snake) => {
    return result.concat([snake.Head, snake.Tail]);
  }, []);
  const unique = new Set(all);
  return Array.from(unique);
}

function assignHeadAndTailUrls(snakes) {
  for (const snake of snakes) {
    // Assign default if missing
    if (!snake.Head) {
      snake.Head = DEFAULT_SNAKE_HEAD;
    }
    if (!snake.Tail) {
      snake.Tail = DEFAULT_SNAKE_TAIL;
    }

    // Format as actual URL if it's just a name
    snake.Head = getSnakeHeadSvgUrl(snake.Head);
    snake.Tail = getSnakeTailSvgUrl(snake.Tail);
  }
}

async function setHeadAndTailSvgs(snakes) {
  assignHeadAndTailUrls(snakes);
  await loadSvgs(getAllSvgs(snakes));

  for (const snake of snakes) {
    snake.HeadSvg = getSvg(snake.Head);
    snake.TailSvg = getSvg(snake.Tail);
  }
}

function isIllegalSvgPath(nameOrPath) {
  return nameOrPath.indexOf("/") >= 0 || nameOrPath.indexOf(".") >= 0;
}

function svgUrlFromName(base, relative) {
  return join(base, relative) + ".svg";
}

function getSnakeHeadSvgUrl(path) {
  const effectivePath = isIllegalSvgPath(path) ? DEFAULT_SNAKE_HEAD : path;
  return svgUrlFromName("images/snake/head", effectivePath);
}

function getSnakeTailSvgUrl(path) {
  const effectivePath = isIllegalSvgPath(path) ? DEFAULT_SNAKE_TAIL : path;
  return svgUrlFromName("images/snake/tail", effectivePath);
}

async function prepareFrame(frame) {
  // Make sure SVGs are loaded and wait for at least minimum delay time.
  const delayPromise = delay(SNAKE_MIN_DELAY_MILLIS);
  const svgPromise = setHeadAndTailSvgs(frame.Snakes);
  await Promise.all([delayPromise, svgPromise]);
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
      await prepareFrame(frame);
      return receiveFrame(game, frame);
    });
    return isLastFrameOfGame(game, frame);
  }

  const wsUrl = join(httpToWsProtocol(baseUrl), `socket/${gameId}`);
  await streamAll(wsUrl, onFrame);
  await chain;
}
