import type { Point } from "$lib/playback/types";

// Parameters used when drawing the gameboard svg
export type SvgCalcParams = {
  cellSize: number;
  cellSizeHalf: number;
  cellSpacing: number;
  gridBorder: number;
  height: number;
  width: number;
};

// Declare a new type to make it more obvious when translating board space to svg space
export type SvgPoint = {
  x: number;
  y: number;
};

export type SvgCircleProps = {
  cx: number;
  cy: number;
};

export type SvgRectProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function svgCalcCellCenter(params: SvgCalcParams, p: Point): SvgPoint {
  const topLeft = svgCalcCellTopLeft(params, p);
  return {
    x: topLeft.x + params.cellSizeHalf,
    y: topLeft.y + params.cellSizeHalf
  };
}

export function svgCalcCellTopLeft(params: SvgCalcParams, p: Point): SvgPoint {
  return {
    x: params.gridBorder + p.x * (params.cellSize + params.cellSpacing),
    y:
      params.height -
      (params.gridBorder + p.y * (params.cellSize + params.cellSpacing) + params.cellSize)
  };
}

export function svgCalcCellCircle(params: SvgCalcParams, p: Point): SvgCircleProps {
  const center = svgCalcCellCenter(params, p);
  return { cx: center.x, cy: center.y };
}

export function svgCalcCellRect(params: SvgCalcParams, p: Point): SvgRectProps {
  const topLeft = svgCalcCellTopLeft(params, p);
  return { x: topLeft.x, y: topLeft.y, width: params.cellSize, height: params.cellSize };
}

export function svgCalcCellLabelBottom(params: SvgCalcParams, p: Point): SvgPoint {
  const center = svgCalcCellCenter(params, p);
  return {
    x: center.x,
    y: center.y + params.cellSizeHalf + params.gridBorder / 2
  };
}

export function svgCalcCellLabelLeft(params: SvgCalcParams, p: Point): SvgPoint {
  const center = svgCalcCellCenter(params, p);
  return {
    x: center.x - params.cellSizeHalf - params.gridBorder / 2,
    y: center.y
  };
}
