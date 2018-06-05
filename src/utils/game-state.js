export function formatFrame(frame) {
  cleanFrame(frame);
  return {
    turn: frame.Turn,
    snakes: formatSnakes(frame.Snakes),
    food: formatPositions(frame.Food)
  };
}

function formatSnakes(snakes) {
  return snakes.map(formatSnake);
}

function formatSnake(snake) {
  return {
    body: snake.Body.map((p, i) => formatSnakePart(snake, i)),
    color: snake.Color,
    name: snake.Name,
    health: snake.Health,
    isDead: !!snake.Death,
    death: formatDeath(snake.Death)
  };
}

function formatDeath(death) {
  if (!death) {
    return;
  }

  return {
    cause: death.Cause,
    turn: death.Turn || 0
  };
}

function formatSnakePart(snake, partIndex) {
  const part = snake.Body[partIndex];
  const next = snake.Body[partIndex + 1];
  return {
    direction: next ? getDirection(part, next) : null,
    type: getType(snake, partIndex),
    x: part.X,
    y: part.Y
  };
}

function formatPositions(positions) {
  return positions.map(formatPosition);
}

function formatPosition(pos) {
  return {
    x: pos.X,
    y: pos.Y
  };
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

function getType(snake, partIndex) {
  if (partIndex === snake.Body.length - 1) {
    return "tail";
  }

  if (partIndex === 0) {
    return "head";
  }

  return "body";
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
