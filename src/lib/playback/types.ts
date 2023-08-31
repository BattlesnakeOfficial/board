export type Point = {
  x: number;
  y: number;
};

export type Elimination = {
  turn: number;
  cause: string;
  by: string;
};

export type Snake = {
  id: string;
  name: string;
  author: string;
  color: string;
  head: string;
  tail: string;
  health: number;
  latency: number;
  body: Point[];
  length: number;
  elimination: Elimination | null;
  // Helpers
  isEliminated: boolean;
};

export type Frame = {
  turn: number;
  width: number;
  height: number;
  snakes: Snake[];
  food: Point[];
  hazards: Point[];
  isFinalFrame: boolean;
};

export enum PlaybackMode {
  PAUSED,
  PLAYING
}

export type PlaybackHandler = () => void;

export type PlaybackState = {
  frame: Frame;
  mode: PlaybackMode;
  finalFrame: null | Frame;
};

// We're lenient with typing data that's received from the game engine
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
type EngineObject = any;

export function engineEventToFrame(
  engineGameInfo: EngineObject,
  engineGameEvent: EngineObject
): Frame {
  const engineCoordsToPoint = function (engineCoords: EngineObject): Point {
    return { x: engineCoords.X, y: engineCoords.Y };
  };

  const engineSnakeToSnake = function (engineSnake: EngineObject): Snake {
    return {
      // Fixed properties
      id: engineSnake.ID,
      name: engineSnake.Name,
      author: engineSnake.Author,
      color: engineSnake.Color,
      head: engineSnake.HeadType,
      tail: engineSnake.TailType,
      // Frame specific
      health: engineSnake.Health,
      latency: engineSnake.Latency,
      body: engineSnake.Body.map(engineCoordsToPoint),
      length: engineSnake.Body.length,
      elimination: engineSnake.Death
        ? {
            turn: engineSnake.Death.Turn,
            cause: engineSnake.Death.Cause,
            by: engineSnake.Death.EliminatedBy
          }
        : null,
      // Helpers
      isEliminated: engineSnake.Death != null
    };
  };

  return {
    turn: engineGameEvent.Turn,
    width: engineGameInfo.Game.Width,
    height: engineGameInfo.Game.Height,
    snakes: engineGameEvent.Snakes.map(engineSnakeToSnake),
    food: engineGameEvent.Food.map(engineCoordsToPoint),
    hazards: engineGameEvent.Hazards.map(engineCoordsToPoint),
    isFinalFrame: false
  };
}
