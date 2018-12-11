const DEFAULT_HEAD_DIRECTION = "up";

export function formatFrame(frame) {
  cleanFrame(frame);
  const snakes = formatSnakes(frame.Snakes);
  return {
    turn: frame.Turn,
    snakes: snakes,
    food: formatPositions(frame.Food),
    gameOver: isLastFrameOfGame(snakes)
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
    death: formatDeath(snake.Death),
    head: snake.Head,
    tail: snake.Tail,
    headSvg: snake.HeadSvg,
    tailSvg: snake.TailSvg
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

function headDirection(snake) {
  return snake.Body.length > 1
    ? getDirection(snake.Body[1], snake.Body[0])
    : DEFAULT_HEAD_DIRECTION;
}

function isCovered(snake, partIndex) {
  const part = snake.Body[partIndex];
  const next = snake.Body[partIndex - 1];

  return next && next.X === part.X && next.Y === part.Y;
}

function formatSnakePart(snake, partIndex) {
  const part = snake.Body[partIndex];
  const next = snake.Body[partIndex - 1];
  return {
    direction: next ? getDirection(part, next) : headDirection(snake),
    shouldRender: !isCovered(snake, partIndex),
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
  if (partIndex === 0) {
    return "head";
  }

  if (partIndex === snake.Body.length - 1) {
    return "tail";
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

function oneLeft(snakes) {
  const alive = snakes.filter(s => !s.death);
  return alive.length <= 1;
}

export function isLastFrameOfGame(snakes) {
  if (snakes.length === 0) {
    return true;
  }

  if (snakes.length === 1) {
    return !!snakes[0].death;
  }

  return oneLeft(snakes);
}
