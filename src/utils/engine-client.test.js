import { streamAllEvents } from "./engine-client";
import { streamAll } from "../io/websocket";

jest.mock("../io/websocket", () => {
  return {
    streamAll: jest.fn()
  };
});

function mockStreamAll(resources) {
  return (url, receive) => {
    let chain = Promise.resolve();
    let things = resources[url];
    if (things && things.length) {
      for (const thing of things) {
        chain = chain.then(() => next().then(() => receive(thing)));
      }
    }
    return chain;
  };
}

// Promise that resolves on next event loop iteration. Helps make mock
// functions that act async.
function next() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

function mockFetch(resources) {
  return url =>
    Promise.resolve({
      json: () => resources[url],
      text: () => resources[url]
    });
}

function singleSnakeData() {
  const frame0 = {
    Turn: 0,
    Food: [{ X: 1, Y: 2 }],
    Snakes: [
      {
        ID: "abc",
        Name: "abc",
        URL: "http://localhost:5000",
        Health: 1,
        Body: [
          { X: 3, Y: 3 },
          { X: 3, Y: 4 },
          { X: 3, Y: 5 }
        ]
      }
    ]
  };

  const frame1 = {
    Turn: 1,
    Food: [{ X: 1, Y: 2 }],
    Snakes: [
      {
        ID: "abc",
        Name: "abc",
        URL: "http://localhost:5000",
        Health: 0,
        Body: [
          { X: 3, Y: 4 },
          { X: 3, Y: 5 },
          { X: 3, Y: 6 }
        ],
        Death: { Cause: "out-of-health", Turn: 1 }
      }
    ]
  };

  const gameResponse = {
    Game: {
      ID: "123",
      Status: "stopped",
      Width: 20,
      Height: 20,
      SnakeTimeout: 1000,
      TurnTimeout: 200
    },
    LastFrame: frame1
  };

  const framesResponse = [frame0, frame1];

  const svgText = "<svg />";

  return {
    "http://localhost/games/123": gameResponse,
    "ws://localhost/socket/123": framesResponse,
    "images/snake/head/default.svg": svgText,
    "images/snake/tail/default.svg": svgText
  };
}

function multiSnakeData() {
  const frame0 = {
    Turn: 0,
    Food: [{ X: 1, Y: 2 }],
    Snakes: [
      {
        ID: "abc",
        Name: "abc",
        URL: "http://localhost:5000",
        Health: 1,
        Body: [
          { X: 3, Y: 3 },
          { X: 3, Y: 4 },
          { X: 3, Y: 5 }
        ],
        Head: "default",
        Tail: "default"
      },
      {
        ID: "qwer",
        Name: "qwer",
        URL: "http://localhost:5000",
        Health: 10,
        Body: [
          { X: 6, Y: 3 },
          { X: 6, Y: 4 },
          { X: 6, Y: 5 }
        ],
        Head: "http://illegal/head.svg",
        Tail: "http://illegal/tail.svg"
      }
    ]
  };

  const frame1 = {
    Turn: 1,
    Food: [{ X: 1, Y: 2 }],
    Snakes: [
      {
        ID: "abc",
        Name: "abc",
        URL: "http://localhost:5000",
        Health: 0,
        Body: [
          { X: 3, Y: 4 },
          { X: 3, Y: 5 },
          { X: 3, Y: 6 }
        ],
        Death: { Cause: "out-of-health", Turn: 1 }
      },
      {
        ID: "qwer",
        Name: "qwer",
        URL: "http://localhost:5000",
        Health: 9,
        Body: [
          { X: 6, Y: 4 },
          { X: 6, Y: 5 },
          { X: 6, Y: 6 }
        ]
      }
    ]
  };

  const gameResponse = {
    Game: {
      ID: "123",
      Status: "stopped",
      Width: 20,
      Height: 20,
      SnakeTimeout: 1000,
      TurnTimeout: 200
    },
    LastFrame: frame1
  };

  const framesResponse = [frame0, frame1];

  return {
    "http://localhost/games/123": gameResponse,
    "ws://localhost/socket/123": framesResponse
  };
}

function zeroSnakeData() {
  const frame0 = {
    Turn: 0,
    Food: [{ X: 1, Y: 2 }],
    Snakes: []
  };

  const gameResponse = {
    Game: {
      ID: "123",
      Status: "stopped",
      Width: 20,
      Height: 20,
      SnakeTimeout: 1000,
      TurnTimeout: 200
    },
    LastFrame: frame0
  };

  const framesResponse = [frame0];

  return {
    "http://localhost/games/123": gameResponse,
    "ws://localhost/socket/123": framesResponse
  };
}

function setupData(resources) {
  global.fetch = mockFetch(resources);
  streamAll.mockImplementation(mockStreamAll(resources));
}

xit("doesn't break with zero snakes", async () => {
  setupData(zeroSnakeData());

  let received = 0;
  await streamAllEvents("http://localhost", "123", (game, frame) => {
    received++;
    expect(frame.Snakes).toHaveLength(0);
  });

  expect(received).toEqual(1);
});

xit("gets frames w/ single snake", async () => {
  setupData(singleSnakeData());

  let received = 0;
  await streamAllEvents("http://localhost", "123", (game, frame) => {
    received++;
    expect(game.Game.ID).toEqual("123");
    expect(frame.Snakes).toHaveLength(1);
  });

  expect(received).toEqual(2);
});

xit("gets frames w/ multiple snakes", async () => {
  setupData(multiSnakeData());

  let received = 0;
  await streamAllEvents("http://localhost", "123", (game, frame) => {
    received++;
    expect(game.Game.ID).toEqual("123");
    expect(frame.Snakes).toHaveLength(2);
  });

  expect(received).toEqual(2);
});
