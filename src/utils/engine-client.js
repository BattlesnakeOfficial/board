const SNAKE_MIN_DELAY_MILLIS = 50;

export let streamAll = websocketStreamAll;

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

function websocketStreamAll(url, receive) {
  let done = false;

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener("message", e => {
      const obj = JSON.parse(e.data);
      done = receive(obj);
      if (done) {
        ws.close();
        resolve();
      }
    });

    ws.addEventListener("onerror", e => {
      reject(e);
    });

    ws.addEventListener("onclose", e => {
      if (!done) {
        done = true;
        resolve();
      }
    });
  });
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
