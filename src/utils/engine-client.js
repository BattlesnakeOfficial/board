import { streamAll } from "../io/websocket";
import { makeQueryString, httpToWsProtocol, join } from "./url";
import { loadSvgs, getSvg } from "./inline-svg";

const SNAKE_MIN_DELAY_MILLIS = 50;
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
    return result.concat([snake.head, snake.tail]);
  }, []);
  const unique = new Set(all);
  return Array.from(unique);
}

function assignHeadAndTailUrls(snakes) {
  for (const snake of snakes) {
    // Assign default if missing
    if (!snake.head) {
      snake.head = DEFAULT_SNAKE_HEAD;
    }
    if (!snake.tail) {
      snake.tail = DEFAULT_SNAKE_TAIL;
    }

    // Format as actual URL if it's just a name
    snake.head = getSnakeHeadSvgUrl(snake.head);
    snake.tail = getSnakeTailSvgUrl(snake.tail);
  }
}

async function setHeadAndTailSvgs(snakes) {
  assignHeadAndTailUrls(snakes);
  await loadSvgs(getAllSvgs(snakes));

  for (const snake of snakes) {
    snake.headSvg = getSvg(snake.head);
    snake.tailSvg = getSvg(snake.tail);
  }
}

function isAbsolutePath(nameOrPath) {
  return nameOrPath.indexOf("://") >= 0;
}

function svgUrlFromName(base, relative) {
  return join(base, relative) + ".svg";
}

function getSnakeHeadSvgUrl(path) {
  return isAbsolutePath(path)
    ? path
    : svgUrlFromName("images/snake/head", path);
}

function getSnakeTailSvgUrl(path) {
  return isAbsolutePath(path)
    ? path
    : svgUrlFromName("images/snake/tail", path);
}

async function prepareFrame(frame) {
  // Make sure SVGs are loaded and wait for at least minimum delay time.
  const delayPromise = delay(SNAKE_MIN_DELAY_MILLIS);
  const svgPromise = setHeadAndTailSvgs(frame.Snakes);
  await Promise.all([delayPromise, svgPromise]);
}

export function getGameInfo(baseUrl, gameId) {
  const url = join(baseUrl, `games/${gameId}`);
  console.log("GETTING", url);
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
