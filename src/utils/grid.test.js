import { makeGrid } from "./grid";

it("should place snakes on valid board", () => {
  const game = {
    ID: "123",
    Width: 10,
    Height: 15
  };

  const frame = {
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

  const grid = makeGrid(game, frame);
  expect(grid).toHaveLength(15);

  for (const row of grid) {
    expect(row).toHaveLength(10);
  }

  expect(grid[0][0].index).toEqual(0);
  expect(grid[0][1].index).toEqual(1);
  expect(grid[1][1].index).toEqual(11);

  expect(grid[2][5].isFood).toBe(true);
  expect(grid[8][1].isFood).toBe(true);
  expect(grid[5][2].isFood).toBeFalsy();
  expect(grid[1][8].isFood).toBeFalsy();

  expect(grid[0][0].snakePart.color).toBe("red");
  expect(grid[1][0].snakePart.color).toBe("red");
  expect(grid[2][0].snakePart.color).toBe("red");

  expect(grid[3][5].snakePart.color).toBe("green");
  expect(grid[3][6].snakePart.color).toBe("green");
  expect(grid[4][6].snakePart.color).toBe("green");
  expect(grid[4][7].snakePart.color).toBe("green");

  expect(grid[0][1].snakePart).toBeFalsy();
});

it("should default undefined numbers to zero", () => {
  const game = {
    ID: "123",
    Width: 10,
    Height: 15
  };

  const frame = {
    Food: [{ X: 5 }, { Y: 8 }, {}],
    Snakes: [
      {
        ID: "snake1",
        Name: "snake 1",
        URL: "http://snake1",
        Health: 80,
        Color: "red",
        Body: [{}, { Y: 1 }, { X: 1, Y: 1 }, { X: 1 }]
      }
    ]
  };

  const grid = makeGrid(game, frame);

  expect(grid[0][0].isFood).toBe(true);
  expect(grid[8][0].isFood).toBe(true);
  expect(grid[0][5].isFood).toBe(true);

  expect(grid[0][0].snakePart.color).toBe("red");
  expect(grid[1][0].snakePart.color).toBe("red");
  expect(grid[1][1].snakePart.color).toBe("red");
  expect(grid[0][1].snakePart.color).toBe("red");
});
