import cloneDeep from "lodash.clonedeep";

const DEFAULT_DIRECTION = "right";

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
    hazards: formatPositions(frame.Hazards)
  };
}

export function sanitizeFrame(frame) {
  // Copy without reference
  const sanitizedFrame = cloneDeep(frame);

  // nullify some fields
  for (const i in sanitizedFrame.snakes) {
    const snake = sanitizedFrame.snakes[i];
    snake.id = snake._id;
    delete snake._id;

    delete snake.headSvg;
    delete snake.tailSvg;
  }

  return sanitizedFrame;
}

function formatSnakes(snakes) {
  if (snakes) {
    let newSnakes = snakes.map(formatSnake);

    // Populate eliminatedBy names
    newSnakes.forEach(function(snake, index) {
      if (
        snake.death &&
        snake.death.eliminatedBy &&
        snake.death.eliminatedBy.length > 0
      ) {
        for (const i in newSnakes) {
          if (newSnakes[i]._id === snake.death.eliminatedBy) {
            newSnakes[index].death.eliminatedBy = newSnakes[i].name;
            break;
          }
        }
      }
    });
    return newSnakes;
  }
}

function formatSnake(snake) {
  var renderedParts = snake.Body.filter((_, i) => shouldRenderPart(snake, i));
  return {
    body: snake.Body.map((_, i) => formatSnakePart(snake, i)),
    color: snake.Color,
    _id: snake.ID,
    name: snake.Name,
    effectiveSpace: renderedParts.length,
    health: snake.Health,
    latency: snake.Latency,
    error: snake.Error,
    timing: snake.TimingMicros,
    isDead: !!snake.Death,
    death: formatDeath(snake.Death),
    head: snake.HeadType && snake.HeadType.toLowerCase(),
    tail: snake.TailType && snake.TailType.toLowerCase(),
    headSvg: snake.HeadSvg,
    tailSvg: snake.TailSvg,
    squad: snake.Squad,
    author: snake.Author,
    shout: snake.Shout
  };
}

function formatDeath(death) {
  if (!death) {
    return;
  }
  return {
    cause: death.Cause,
    turn: death.Turn || 0,
    eliminatedBy: death.EliminatedBy
  };
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
    !(head.X === currPart.X && head.Y === currPart.Y) &&
    !(nextPart && nextPart.X === currPart.X && nextPart.Y === currPart.Y)
  );
}

function formatSnakePart(snake, partIndex) {
  const part = snake.Body[partIndex];
  const type = getType(snake, partIndex);
  const { x, y } = formatPosition(part);
  const direction = formatDirection(type, snake, part, partIndex);
  const isOverlapped = !shouldRenderPart(snake, partIndex) ? true : undefined;

  return {
    direction,
    type,
    isOverlapped,
    x,
    y
  };
}

function formatPositions(positions) {
  if (positions) {
    return positions.map(formatPosition);
  }
}

function formatPosition(pos) {
  return {
    x: pos.X,
    y: pos.Y
  };
}

function formatDirection(type, snake, part, partIndex) {
  let direction;
  if (type === "head") {
    direction = getDirection(snake.Body[1], snake.Body[0]);
  } else {
    // handle special case where parts overlap
    var prevPart;
    do {
      prevPart = snake.Body[Math.max(partIndex - 1, 0)];
      --partIndex;
    } while (partIndex > 0 && prevPart.X === part.X && prevPart.Y === part.Y);

    direction = getDirection(part, prevPart);
  }

  return direction;
}

function getDirection(a, b) {
  if (a && b) {
    // Handle cases where b is one move after a
    if (a.X + 1 === b.X) {
      return "right";
    } else if (a.X - 1 === b.X) {
      return "left";
    } else if (a.Y + 1 === b.Y) {
      return "up";
    } else if (a.Y - 1 === b.Y) {
      return "down";
    }
    // Handle wrapped cases (we can anchor against one part being on 0 axis)
    if (a.X > b.X && b.X === 0) {
      return "right";
    } else if (a.X < b.X && a.X === 0) {
      return "left";
    } else if (a.Y > b.Y && b.Y === 0) {
      return "up";
    } else if (a.Y < b.Y && a.Y === 0) {
      return "down";
    }
  }
  return DEFAULT_DIRECTION;
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
