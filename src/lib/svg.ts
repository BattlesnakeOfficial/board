import type { Point } from '$lib/stores/game';

export type SvgCalcParams = {
    cellSize: number,
    cellSizeHalf: number,
    cellSpacing: number,
    gridBorder: number,
    height: number,
    width: number
}

export function svgCalcCellCenter(params: SvgCalcParams, p: Point): number[] {
    const [x, y] = svgCalcCellTopLeft(params, p);
    return [x + params.cellSizeHalf, y + params.cellSizeHalf];
}

export function svgCalcCellTopLeft(params: SvgCalcParams, p: Point): number[] {
    return [
        params.gridBorder + p.x * (params.cellSize + params.cellSpacing),
        params.height - (params.gridBorder + p.y * (params.cellSize + params.cellSpacing) + params.cellSize)
    ]
}

export function svgCalcCellCircle(params: SvgCalcParams, p: Point) {
    const [x, y] = svgCalcCellCenter(params, p);
    return { cx: x, cy: y }
}

export function svgCalcCellRect(params: SvgCalcParams, p: Point) {
    const [x, y] = svgCalcCellTopLeft(params, p);
    return { x: x, y: y, width: params.cellSize, height: params.cellSize };
}

export function svgCalcCellLabelBottom(params: SvgCalcParams, p: Point) {
    const [cx, cy] = svgCalcCellCenter(params, p)
    return {
        x: cx,
        y: cy + params.cellSizeHalf + params.gridBorder / 2
    }
}

export function svgCalcCellLabelLeft(params: SvgCalcParams, p: Point) {
    const [cx, cy] = svgCalcCellCenter(params, p);
    return {
        x: cx - params.cellSizeHalf - params.gridBorder / 2,
        y: cy
    }
}
