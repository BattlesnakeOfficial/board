import cloneDeep from "lodash.clonedeep";

const DEFAULT_HEAD_DIRECTION = "up";

const TYPE_HEAD = "head";
const TYPE_TAIL = "tail";
const TYPE_BODY = "body";

export function formatFrame(frame) {
  cleanFrame(frame);
  const snakes = formatSnakes(frame.Snakes);
  return {
    turn: frame.Turn,
    snakes: snakes,
    food: formatPositions(frame.Food),
    gameOver: isLastFrameOfGame(frame)
  };
}

export function sanitizeFrame(frame) {
  // Copy without reference
  const sanitizedFrame = cloneDeep(frame);

  // nullify some fields
  for (const i in sanitizedFrame.snakes) {
    const snake = sanitizedFrame.snakes[i];
    snake.headSvg = null;
    snake.tailSvg = null;
    snake._id = null;
  }

  return sanitizedFrame;
}

function formatSnakes(snakes) {
  return snakes.map(formatSnake);
}

function formatSnake(snake) {
  return {
    body: snake.Body.map((_, i) => {
      if (shouldRenderPart(snake, i)) {
        return formatSnakePart(snake, i);
      }
      return null;
    }).filter(part => part),
    color: snake.Color,
    _id: snake.ID,
    name: snake.Name,
    health: snake.Health,
    isDead: !!snake.Death,
    death: formatDeath(snake.Death),
    head: snake.HeadType && snake.HeadType.toLowerCase(),
    tail: snake.TailType && snake.TailType.toLowerCase(),
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

function shouldRenderPart(snake, partIndex) {
  const headIndex = 0;
  const tailIndex = snake.Body.length - 1;
  const head = snake.Body[headIndex];
  const tail = snake.Body[tailIndex];
  const currPart = snake.Body[partIndex];

  // always render head
  if (partIndex === headIndex) {
    return true;
  }

  // render tail if not covered by head
  if (partIndex === tailIndex) {
    return !(head.X === currPart.X && head.Y === currPart.Y);
  }

  // render middle part if it's in a different position than
  // the next piece closer to head, and not in same spot as tail
  const nextPart = snake.Body[partIndex - 1];
  return (
    !(tail.X === currPart.X && tail.Y === currPart.Y) &&
    !(nextPart && nextPart.X === currPart.X && nextPart.Y === currPart.Y)
  );
}

function formatSnakePart(snake, partIndex) {
  const part = snake.Body[partIndex];
  const type = getType(snake, partIndex);
  const { x, y } = formatPosition(part);
  const direction = formatDirection(type, snake, part);

  return {
    direction,
    type,
    x,
    y
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

function formatDirection(type, snake, part) {
  let direction;
  if (type === "head") {
    direction = headDirection(snake);
  } else {
    // Determine a part's direction by the unique points (x,y)
    // occupied by the snake.
    const uniquePoints = [...new Set(snake.Body.map(p => `${p.X},${p.Y}`))];
    const uniqueIndex = uniquePoints.findIndex(
      p => p === `${part.X},${part.Y}`
    );

    direction = getDirection(
      snake.Body[uniqueIndex],
      snake.Body[Math.max(uniqueIndex - 1, 0)]
    );
  }

  return direction;
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
    return TYPE_HEAD;
  }

  if (partIndex === snake.Body.length - 1) {
    return TYPE_TAIL;
  }

  return TYPE_BODY;
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

export function isLastFrameOfGame(frame) {
  const snakes = formatSnakes(frame.Snakes);

  if (snakes.length === 0) {
    return true;
  }

  if (snakes.length === 1) {
    return !!snakes[0].death;
  }

  return oneLeft(snakes);
}
