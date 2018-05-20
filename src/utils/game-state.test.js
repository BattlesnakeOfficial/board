import { formatFrame } from "./game-state";

it("should place snakes on valid board", () => {
  const apiFrame = {
    Turn: 1,
    Food: [{ X: 5, Y: 2 }, { X: 1, Y: 8 }],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 80,
        Color: "red",
        Body: [{ X: 0, Y: 0 }, { X: 0, Y: 1 }, { X: 0, Y: 2 }]
      },
      {
        ID: "snake2",
        Name: "snake 2",
        URL: "http://snake2",
        Health: 70,
        Color: "green",
        Body: [{ X: 5, Y: 3 }, { X: 6, Y: 3 }, { X: 6, Y: 4 }, { X: 7, Y: 4 }]
      }
    ]
  };

  const frame = formatFrame(apiFrame);

  expect(frame.turn).toBe(1);
  expect(frame.snakes).toHaveLength(2);
  expect(frame.food).toHaveLength(2);

  expect(frame.food[0]).toEqual({ x: 5, y: 2 });
  expect(frame.food[1]).toEqual({ x: 1, y: 8 });

  expect(frame.snakes[0]).toEqual({
    name: "snake 1",
    health: 80,
    color: "red",
    body: [
      { x: 0, y: 0, direction: "down", type: "tail" },
      { x: 0, y: 1, direction: "down", type: "body" },
      { x: 0, y: 2, direction: null, type: "head" }
    ],
    isDead: false
  });

  expect(frame.snakes[1]).toEqual({
    name: "snake 2",
    health: 70,
    color: "green",
    body: [
      { x: 5, y: 3, direction: "right", type: "tail" },
      { x: 6, y: 3, direction: "down", type: "body" },
      { x: 6, y: 4, direction: "right", type: "body" },
      { x: 7, y: 4, direction: null, type: "head" }
    ],
    isDead: false
  });
});

it("should recognize dead snakes", () => {
  const apiFrame = {
    Turn: 1,
    Food: [{ X: 5, Y: 2 }, { X: 1, Y: 8 }],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 80,
        Color: "red",
        Death: { Cause: "asdf", Turn: 3 },
        Body: [{ X: 1, Y: 1 }, { X: 0, Y: 1 }, { X: 0, Y: 0 }]
      }
    ]
  };

  const frame = formatFrame(apiFrame);

  expect(frame.turn).toBe(1);
  expect(frame.snakes).toHaveLength(1);
  expect(frame.food).toHaveLength(2);

  expect(frame.food[0]).toEqual({ x: 5, y: 2 });
  expect(frame.food[1]).toEqual({ x: 1, y: 8 });

  expect(frame.snakes[0]).toEqual({
    name: "snake 1",
    health: 80,
    color: "red",
    body: [
      { x: 1, y: 1, direction: "left", type: "tail" },
      { x: 0, y: 1, direction: "up", type: "body" },
      { x: 0, y: 0, direction: null, type: "head" }
    ],
    isDead: true,
    death: { cause: "asdf", turn: 3 }
  });
});

it("should set undefined numbers to zero", () => {
  const apiFrame = {
    Food: [{}],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 80,
        Color: "red",
        Death: { Cause: "asdf" },
        Body: [{}]
      }
    ]
  };

  const frame = formatFrame(apiFrame);

  expect(frame.turn).toBe(0);
  expect(frame.snakes).toHaveLength(1);
  expect(frame.food).toHaveLength(1);

  expect(frame.food[0]).toEqual({ x: 0, y: 0 });

  expect(frame.snakes[0]).toEqual({
    name: "snake 1",
    health: 80,
    color: "red",
    body: [{ x: 0, y: 0, direction: null, type: "head" }],
    isDead: true,
    death: { cause: "asdf", turn: 0 }
  });
});
