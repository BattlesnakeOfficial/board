import { formatFrame } from "./game-state";

xit("should place snakes on valid board", () => {
  const apiFrame = {
    Turn: 1,
    Food: [
      { X: 5, Y: 2 },
      { X: 1, Y: 8 }
    ],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 80,
        Color: "red",
        Body: [
          { X: 0, Y: 0 },
          { X: 0, Y: 1 },
          { X: 0, Y: 2 }
        ]
      },
      {
        ID: "snake2",
        Name: "snake 2",
        URL: "http://snake2",
        Health: 70,
        Color: "green",
        Body: [
          { X: 5, Y: 3 },
          { X: 6, Y: 3 },
          { X: 6, Y: 4 },
          { X: 7, Y: 4 }
        ]
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
    _id: "snake1",
    name: "snake 1",
    health: 80,
    effectiveSpace: 3,
    color: "red",
    body: [
      { x: 0, y: 0, direction: "up", type: "head" },
      { x: 0, y: 1, direction: "up", type: "body" },
      { x: 0, y: 2, direction: "up", type: "tail" }
    ],
    isDead: false,
    head: undefined,
    tail: undefined,
    headSvg: undefined,
    tailSvg: undefined
  });

  expect(frame.snakes[1]).toEqual({
    _id: "snake2",
    name: "snake 2",
    health: 70,
    effectiveSpace: 4,
    color: "green",
    body: [
      { x: 5, y: 3, direction: "left", type: "head" },
      { x: 6, y: 3, direction: "left", type: "body" },
      { x: 6, y: 4, direction: "up", type: "body" },
      { x: 7, y: 4, direction: "left", type: "tail" }
    ],
    isDead: false,
    head: undefined,
    tail: undefined,
    headSvg: undefined,
    tailSvg: undefined
  });
});

xit("should recognize dead snakes", () => {
  const apiFrame = {
    Turn: 1,
    Food: [
      { X: 5, Y: 2 },
      { X: 1, Y: 8 }
    ],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 80,
        Color: "red",
        Death: { Cause: "asdf", Turn: 3 },
        Body: [
          { X: 1, Y: 1 },
          { X: 0, Y: 1 },
          { X: 0, Y: 0 }
        ]
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
    _id: "snake1",
    name: "snake 1",
    health: 80,
    effectiveSpace: 3,
    color: "red",
    body: [
      { x: 1, y: 1, direction: "right", type: "head" },
      { x: 0, y: 1, direction: "right", type: "body" },
      { x: 0, y: 0, direction: "down", type: "tail" }
    ],
    isDead: true,
    death: { cause: "asdf", turn: 3 },
    head: undefined,
    tail: undefined,
    headSvg: undefined,
    tailSvg: undefined
  });
});

xit("should set undefined numbers to zero", () => {
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
    _id: "snake1",
    name: "snake 1",
    health: 80,
    effectiveSpace: 1,
    color: "red",
    body: [{ x: 0, y: 0, direction: "up", type: "head" }],
    isDead: true,
    death: { cause: "asdf", turn: 0 },
    head: undefined,
    tail: undefined,
    headSvg: undefined,
    tailSvg: undefined
  });
});

xit("should not break on case sensitivity for head and tail types", () => {
  const apiFrame = {
    Turn: 0,
    Food: [{ X: 4, Y: 3 }],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 100,
        HeadType: "dEfaUlT",
        TailType: "BOLT",
        Color: "red",
        Body: [
          { X: 4, Y: 4 },
          { X: 4, Y: 4 },
          { X: 4, Y: 4 }
        ]
      }
    ]
  };

  const frame = formatFrame(apiFrame);

  expect(frame.turn).toBe(0);
  expect(frame.snakes).toHaveLength(1);
  expect(frame.food).toHaveLength(1);

  expect(frame.food[0]).toEqual({ x: 4, y: 3 });

  expect(frame.snakes[0]).toEqual({
    _id: "snake1",
    name: "snake 1",
    health: 100,
    effectiveSpace: 1,
    color: "red",
    body: [
      { x: 4, y: 4, direction: "up", type: "head" },
      { x: 4, y: 4, direction: "up", type: "body", isOverlapped: true },
      { x: 4, y: 4, direction: "up", type: "tail", isOverlapped: true }
    ],
    isDead: false,
    head: "default",
    tail: "bolt",
    headSvg: undefined,
    tailSvg: undefined
  });
});

xit("should expect starting turn rendering to be correct", () => {
  const apiFrame = {
    Turn: 0,
    Food: [{ X: 4, Y: 3 }],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 100,
        Color: "red",
        Body: [
          { X: 4, Y: 4 },
          { X: 4, Y: 4 },
          { X: 4, Y: 4 }
        ]
      }
    ]
  };

  const frame = formatFrame(apiFrame);

  expect(frame.turn).toBe(0);
  expect(frame.snakes).toHaveLength(1);
  expect(frame.food).toHaveLength(1);

  expect(frame.food[0]).toEqual({ x: 4, y: 3 });

  expect(frame.snakes[0]).toEqual({
    _id: "snake1",
    name: "snake 1",
    health: 100,
    effectiveSpace: 1,
    color: "red",
    body: [
      { x: 4, y: 4, direction: "up", type: "head" },
      { x: 4, y: 4, direction: "up", type: "body", isOverlapped: true },
      { x: 4, y: 4, direction: "up", type: "tail", isOverlapped: true }
    ],
    isDead: false,
    head: undefined,
    tail: undefined,
    headSvg: undefined,
    tailSvg: undefined
  });
});

describe.skip("should expect tail to be rendered after eating food", () => {
  it("tail up", () => {
    const apiFrame = {
      Turn: 9,
      Food: [{ X: 4, Y: 9 }],
      Snakes: [
        {
          ID: "snake1",
          Name: "snake 1",
          URL: "http://snake1",
          Health: 80,
          Color: "red",
          Body: [
            { X: 4, Y: 4 },
            { X: 4, Y: 5 },
            { X: 4, Y: 6 },
            { X: 4, Y: 6 }
          ]
        }
      ]
    };

    const frame = formatFrame(apiFrame);

    expect(frame.turn).toBe(9);
    expect(frame.snakes).toHaveLength(1);
    expect(frame.food).toHaveLength(1);

    expect(frame.food[0]).toEqual({ x: 4, y: 9 });

    expect(frame.snakes[0]).toEqual({
      _id: "snake1",
      name: "snake 1",
      health: 80,
      effectiveSpace: 3,
      color: "red",
      body: [
        { x: 4, y: 4, direction: "up", type: "head" },
        { x: 4, y: 5, direction: "up", type: "body" },
        { x: 4, y: 6, direction: "up", type: "body", isOverlapped: true },
        { x: 4, y: 6, direction: "up", type: "tail" }
      ],
      isDead: false,
      head: undefined,
      tail: undefined,
      headSvg: undefined,
      tailSvg: undefined
    });
  });

  it("tail right", () => {
    const apiFrame = {
      Turn: 9,
      Food: [{ X: 9, Y: 4 }],
      Snakes: [
        {
          ID: "snake1",
          Name: "snake 1",
          URL: "http://snake1",
          Health: 62,
          Color: "red",
          Body: [
            { X: 7, Y: 4 },
            { X: 6, Y: 4 },
            { X: 5, Y: 4 },
            { X: 4, Y: 4 },
            { X: 3, Y: 4 },
            { X: 3, Y: 4 }
          ]
        }
      ]
    };

    const frame = formatFrame(apiFrame);

    expect(frame.turn).toBe(9);
    expect(frame.snakes).toHaveLength(1);
    expect(frame.food).toHaveLength(1);

    expect(frame.food[0]).toEqual({ x: 9, y: 4 });

    expect(frame.snakes[0]).toEqual({
      _id: "snake1",
      name: "snake 1",
      health: 62,
      effectiveSpace: 5,
      color: "red",
      body: [
        { x: 7, y: 4, direction: "right", type: "head" },
        { x: 6, y: 4, direction: "right", type: "body" },
        { x: 5, y: 4, direction: "right", type: "body" },
        { x: 4, y: 4, direction: "right", type: "body" },
        { x: 3, y: 4, direction: "right", type: "body", isOverlapped: true },
        { x: 3, y: 4, direction: "right", type: "tail" }
      ],
      isDead: false,
      head: undefined,
      tail: undefined,
      headSvg: undefined,
      tailSvg: undefined
    });
  });

  it("tail left", () => {
    const apiFrame = {
      Turn: 1,
      Food: [{ X: 9, Y: 4 }],
      Snakes: [
        {
          ID: "snake1",
          Name: "snake 1",
          URL: "http://snake1",
          Health: 99,
          Color: "red",
          Body: [
            { X: 6, Y: 4 },
            { X: 7, Y: 4 },
            { X: 7, Y: 4 }
          ]
        }
      ]
    };

    const frame = formatFrame(apiFrame);

    expect(frame.turn).toBe(1);
    expect(frame.snakes).toHaveLength(1);
    expect(frame.food).toHaveLength(1);

    expect(frame.food[0]).toEqual({ x: 9, y: 4 });

    expect(frame.snakes[0]).toEqual({
      _id: "snake1",
      name: "snake 1",
      health: 99,
      effectiveSpace: 2,
      color: "red",
      body: [
        { x: 6, y: 4, direction: "left", type: "head" },
        { x: 7, y: 4, direction: "left", type: "body", isOverlapped: true },
        { x: 7, y: 4, direction: "left", type: "tail" }
      ],
      isDead: false,
      head: undefined,
      tail: undefined,
      headSvg: undefined,
      tailSvg: undefined
    });
  });

  it("tail down, eat on first move", () => {
    const apiFrame = {
      Turn: 1,
      Food: [{ X: 9, Y: 4 }],
      Snakes: [
        {
          ID: "snake1",
          Name: "snake 1",
          URL: "http://snake1",
          Health: 100,
          Color: "red",
          Body: [
            { X: 6, Y: 5 },
            { X: 6, Y: 4 },
            { X: 6, Y: 4 },
            { X: 6, Y: 4 }
          ]
        }
      ]
    };

    const frame = formatFrame(apiFrame);

    expect(frame.turn).toBe(1);
    expect(frame.snakes).toHaveLength(1);
    expect(frame.food).toHaveLength(1);

    expect(frame.food[0]).toEqual({ x: 9, y: 4 });

    expect(frame.snakes[0]).toEqual({
      _id: "snake1",
      name: "snake 1",
      health: 100,
      effectiveSpace: 2,
      color: "red",
      body: [
        { x: 6, y: 5, direction: "down", type: "head" },
        { x: 6, y: 4, direction: "down", type: "body", isOverlapped: true },
        { x: 6, y: 4, direction: "down", type: "body", isOverlapped: true },
        { x: 6, y: 4, direction: "down", type: "tail" }
      ],
      isDead: false,
      head: undefined,
      tail: undefined,
      headSvg: undefined,
      tailSvg: undefined
    });
  });
});

xit("should expect correctly rendered snake parts after crashing into body segment of self", () => {
  const apiFrame = {
    Turn: 29,
    Food: [{ X: 4, Y: 9 }],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 80,
        Death: { Cause: "self-collision", Turn: 29 },
        Color: "red",
        Body: [
          { X: 5, Y: 6 },
          { X: 6, Y: 6 },
          { X: 6, Y: 7 },
          { X: 5, Y: 7 },
          { X: 5, Y: 6 },
          { X: 5, Y: 5 }
        ]
      }
    ]
  };

  const frame = formatFrame(apiFrame);

  expect(frame.turn).toBe(29);
  expect(frame.snakes).toHaveLength(1);
  expect(frame.food).toHaveLength(1);

  expect(frame.food[0]).toEqual({ x: 4, y: 9 });

  expect(frame.snakes[0]).toEqual({
    _id: "snake1",
    name: "snake 1",
    health: 80,
    effectiveSpace: 5,
    color: "red",
    body: [
      { x: 5, y: 6, direction: "left", type: "head" },
      { x: 6, y: 6, direction: "left", type: "body" },
      { x: 6, y: 7, direction: "up", type: "body" },
      { x: 5, y: 7, direction: "right", type: "body" },
      { x: 5, y: 6, direction: "down", type: "body", isOverlapped: true },
      { x: 5, y: 5, direction: "down", type: "tail" }
    ],
    death: { cause: "self-collision", turn: 29 },
    isDead: true,
    head: undefined,
    tail: undefined,
    headSvg: undefined,
    tailSvg: undefined
  });
});

xit("should expect correctly rendered snake parts after going backwards into body", () => {
  const apiFrame = {
    Turn: 50,
    Food: [{ X: 8, Y: 11 }],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 80,
        Death: { Cause: "self-collision", Turn: 50 },
        Color: "red",
        Body: [
          { X: 0, Y: 10 },
          { X: 0, Y: 11 },
          { X: 0, Y: 10 },
          { X: 0, Y: 9 },
          { X: 0, Y: 8 },
          { X: 1, Y: 8 },
          { X: 1, Y: 9 },
          { X: 1, Y: 10 }
        ]
      }
    ]
  };

  const frame = formatFrame(apiFrame);

  expect(frame.turn).toBe(50);
  expect(frame.snakes).toHaveLength(1);
  expect(frame.food).toHaveLength(1);

  expect(frame.food[0]).toEqual({ x: 8, y: 11 });

  expect(frame.snakes[0]).toEqual({
    _id: "snake1",
    name: "snake 1",
    health: 80,
    effectiveSpace: 7,
    color: "red",
    body: [
      { x: 0, y: 10, direction: "up", type: "head" },
      { x: 0, y: 11, direction: "up", type: "body" },
      { x: 0, y: 10, direction: "down", type: "body", isOverlapped: true },
      { x: 0, y: 9, direction: "down", type: "body" },
      { x: 0, y: 8, direction: "down", type: "body" },
      { x: 1, y: 8, direction: "left", type: "body" },
      { x: 1, y: 9, direction: "up", type: "body" },
      { x: 1, y: 10, direction: "up", type: "tail" }
    ],
    death: { cause: "self-collision", turn: 50 },
    isDead: true,
    head: undefined,
    tail: undefined,
    headSvg: undefined,
    tailSvg: undefined
  });
});
