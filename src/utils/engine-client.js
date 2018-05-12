const SNAKE_MIN_DELAY_MILLIS = 100;

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

async function get(url, query) {
  const fetchResult = await fetch(url + makeQueryString(query));
  return fetchResult.json();
}

function oneLeft(snakes) {
  const alive = snakes.filter(s => !s.Death);
  return alive.length <= 1;
}

function isLastFrameOfGame(game, frame) {
  if (!frame) {
    return false;
  }

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

function httpToWsProtocol(url) {
  const mappings = {
    http: "ws",
    https: "wss"
  };

  for (const from in mappings) {
    const to = mappings[from];
    if (url.substr(0, from.length + 1) === from + ":") {
      return to + url.substr(from.length);
    }
  }

  console.error("Invalid URL: " + url);
  return url;
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
      receiveFrame(game, frame);
    });
  }

  return new Promise((resolve, reject) => {
    const wsUrl = join(httpToWsProtocol(baseUrl), `socket/${gameId}`);
    const ws = new WebSocket(wsUrl);
    ws.addEventListener("message", e => {
      const frame = JSON.parse(e.data);
      onFrame(frame);
      if (isLastFrameOfGame(game, frame)) {
        resolve();
      }
    });

    ws.addEventListener("onerror", e => {
      reject(e);
    });
  });
}
