import { streamAll } from "../io/websocket";
import { makeQueryString, httpToWsProtocol, join } from "./url";
import { loadSvgs, getSvg } from "./inline-svg";
import { isLastFrameOfGame } from "./game-state";

const SNAKE_MIN_DELAY_MILLIS = 50;
const DEFAULT_SNAKE_HEAD = "regular";
const DEFAULT_SNAKE_TAIL = "regular";

async function get(url, query) {
  const fetchResult = await fetch(url + makeQueryString(query));
  return fetchResult.json();
}

export function delay(millis = SNAKE_MIN_DELAY_MILLIS) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

export function getReadableCauseOfDeath(cause) {
  // Based on https://github.com/battlesnakeio/engine/blob/master/rules/death_cause.go

  switch (cause) {
    case "snake-collision":
      return "Collided with snake body";
    case "snake-self-collision":
      return "Collided with own body";
    case "starvation":
      return "Starvation";
    case "head-collision":
      return "Head on head collision";
    case "wall-collision":
      return "Collided with a wall";
    default:
      return cause;
  }
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
  // const delayPromise = delay(SNAKE_MIN_DELAY_MILLIS);
  // const svgPromise = setHeadAndTailSvgs(frame.Snakes);
  // await Promise.all([delayPromise, svgPromise]);
  await setHeadAndTailSvgs(frame.Snakes);
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
    return isLastFrameOfGame(frame.Snakes);
  }

  const wsUrl = join(httpToWsProtocol(baseUrl), `socket/${gameId}`);
  await streamAll(wsUrl, onFrame);
  await chain;
}

export function getFrameByTurn(frames, turn) {
  return frames.filter(frame => frame.turn === turn)[0];
}
