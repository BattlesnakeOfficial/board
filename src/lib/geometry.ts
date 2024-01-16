import type { Point } from "./playback/types";

export function isEqualPoint(p1?: Point, p2?: Point): boolean {
  if (p1 == undefined || p2 == undefined) {
    return false;
  }

  return p1.x == p2.x && p1.y == p2.y;
}

export function isAdjacentPoint(p1: Point, p2: Point): boolean {
  return calcManhattan(p1, p2) == 1;
}

export function calcManhattan(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

export function calcSourceWrapPosition(src: Point, dst: Point): Point {
  return {
    x: src.x - Math.sign(dst.x - src.x),
    y: src.y - Math.sign(dst.y - src.y)
  };
}

export function calcDestinationWrapPosition(src: Point, dst: Point): Point {
  return {
    x: dst.x + Math.sign(dst.x - src.x),
    y: dst.y + Math.sign(dst.y - src.y)
  };
}
