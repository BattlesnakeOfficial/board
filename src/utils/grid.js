function cellIndex(game, row, col) {
  return row * game.Game.Width + col;
}

// This is a workaround for fields that are omitted when they have the default
// value. ie: int fields that need to default to 0 rather than undefined.
function cleanFrame(frame) {
  frame.Turn = frame.Turn || 0;

  for (const snake of frame.Snakes) {
    for (const part of snake.Body) {
      part.X = part.X || 0;
      part.Y = part.Y || 0;
    }
  }

  for (const food of frame.Food) {
    food.X = food.X || 0;
    food.Y = food.Y || 0;
  }
}

function makeCellLookup(game, frame) {
  const lookup = {};

  for (const snake of frame.Snakes) {
    for (const part of snake.Body) {
      const index = cellIndex(game, part.Y, part.X);
      lookup[index] = snake;
    }
  }

  return lookup;
}

function makeFoodLookup(game, frame) {
  const lookup = {};

  for (const food of frame.Food) {
    const index = cellIndex(game, food.Y, food.X);
    lookup[index] = true;
  }

  return lookup;
}

export function makeGrid(game, frame) {
  cleanFrame(frame);

  const grid = [];
  const snakeLookup = makeCellLookup(game, frame);
  const foodLookup = makeFoodLookup(game, frame);
  for (let row = 0; row < game.Game.Height; row++) {
    const column = [];
    for (let col = 0; col < game.Game.Height; col++) {
      const index = cellIndex(game, row, col);
      const snake = snakeLookup[index];
      const color = snake && snake.Color ? snake.Color : null;
      const isFood = foodLookup[index];
      const isDead = snake && !!snake.Death;
      column.push({ index, color, isFood, isDead });
    }
    grid.push(column);
  }
  return grid;
}
