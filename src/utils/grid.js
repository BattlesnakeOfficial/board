function cellIndex(game, row, col) {
  return row * game.Width + col;
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

function getDirection(a, b) {
  if (a.X < b.X) {
    return "right";
  } else if (b.X < a.X) {
    return "left";
  } else if (a.Y < b.Y) {
    return "down";
  }
  return "up";
}

function getType(snake, part) {
  const head = snake.Body[snake.Body.length - 1];
  const tail = snake.Body[0];

  if (head.X === part.X && head.Y === part.Y) {
    return "head";
  }

  if (tail.X === part.X && tail.Y === part.Y) {
    return "tail";
  }

  return "body";
}

function makeSnakeLookup(game, frame) {
  const lookup = {};

  for (const snake of frame.Snakes) {
    let lastPart = null;
    for (const part of snake.Body) {
      const direction = lastPart ? getDirection(lastPart, part) : null;
      const type = getType(snake, part);
      const index = cellIndex(game, part.Y, part.X);
      lookup[index] = {
        direction,
        type,
        color: snake.Color,
        isDead: !!snake.Death
      };
      lastPart = part;
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
  const snakeLookup = makeSnakeLookup(game, frame);
  const foodLookup = makeFoodLookup(game, frame);
  for (let row = 0; row < game.Height; row++) {
    const column = [];
    for (let col = 0; col < game.Width; col++) {
      const index = cellIndex(game, row, col);
      const snakePart = snakeLookup[index];
      const isFood = foodLookup[index];
      column.push({ index, isFood, snakePart });
    }
    grid.push(column);
  }
  return grid;
}
