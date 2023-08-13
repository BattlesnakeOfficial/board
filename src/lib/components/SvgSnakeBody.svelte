<script lang="ts">
	import type { Point, Snake } from '$lib/playback/types';
	import { type SvgCalcParams, type SvgPoint, svgCalcCellCenter } from '$lib/svg';

	// Used to very slightly extend body segments to ensure overlap with head and tail
	const OVERLAP = 0.1;

	export let snake: Snake;
	export let svgCalcParams: SvgCalcParams;

	// Calculate the center points of a line that paths along snake.body
	$: bodyPolylinePoints = calcBodyPolylinePoints(snake);
	function calcBodyPolylinePoints(snake: Snake): SvgPoint[] {
		// Make a copy of snake body and separate into head, tail, and body.
		const body: Point[] = [...snake.body];
		const head = body.shift() as Point;
		const tail = body.pop() as Point;

		// Ignore body parts that are stacked on the tail
		// This ensures that the tail is always shown even when the snake has grown
		while (
			body.length > 0 &&
			body[body.length - 1].x == tail.x &&
			body[body.length - 1].y == tail.y
		) {
			body.pop();
		}

		// Get the center point of each body square we're going to render
		const bodyCenterPoints = body.map((p) => {
			const svgCenter = svgCalcCellCenter(svgCalcParams, p);
			return { cx: svgCenter.x, cy: svgCenter.y, x: p.x, y: p.y };
		});

		// If we're drawing *any* body, we want to extend the first and last points
		// to connect to the head and tail across the cell spacing.
		if (bodyCenterPoints.length > 0) {
			// Use overlap to ensure that we connect to head and tail.
			const gapSize = svgCalcParams.cellSpacing + OVERLAP;

			// Extend first point towards head
			const first = bodyCenterPoints[0];
			if (head.x > first.x) {
				bodyCenterPoints.unshift({
					cx: first.cx + svgCalcParams.cellSizeHalf + gapSize,
					cy: first.cy,
					x: 0,
					y: 0
				});
			} else if (head.x < first.x) {
				bodyCenterPoints.unshift({
					cx: first.cx - svgCalcParams.cellSizeHalf - gapSize,
					cy: first.cy,
					x: 0,
					y: 0
				});
			} else if (head.y > first.y) {
				bodyCenterPoints.unshift({
					cx: first.cx,
					cy: first.cy - svgCalcParams.cellSizeHalf - gapSize,
					x: 0,
					y: 0
				});
			} else if (head.y < first.y) {
				bodyCenterPoints.unshift({
					cx: first.cx,
					cy: first.cy + svgCalcParams.cellSizeHalf + gapSize,
					x: 0,
					y: 0
				});
			}

			// Extend last point towards tail
			const last = bodyCenterPoints[bodyCenterPoints.length - 1];
			if (tail.x > last.x) {
				bodyCenterPoints.push({
					cx: last.cx + svgCalcParams.cellSizeHalf + gapSize,
					cy: last.cy,
					x: 0,
					y: 0
				});
			} else if (tail.x < last.x) {
				bodyCenterPoints.push({
					cx: last.cx - svgCalcParams.cellSizeHalf - gapSize,
					cy: last.cy,
					x: 0,
					y: 0
				});
			} else if (tail.y > last.y) {
				bodyCenterPoints.push({
					cx: last.cx,
					cy: last.cy - svgCalcParams.cellSizeHalf - gapSize,
					x: 0,
					y: 0
				});
			} else if (tail.y < last.y) {
				bodyCenterPoints.push({
					cx: last.cx,
					cy: last.cy + svgCalcParams.cellSizeHalf + gapSize,
					x: 0,
					y: 0
				});
			}
		}

		// If we're drawing no body, but head and tail are different,
		// they still need to be connected.
		if (bodyCenterPoints.length == 0) {
			if (head.x != tail.x || head.y != tail.y) {
				const svgCenter = svgCalcCellCenter(svgCalcParams, head);
				if (head.x > tail.x) {
					bodyCenterPoints.push({
						cx: svgCenter.x - svgCalcParams.cellSizeHalf + OVERLAP,
						cy: svgCenter.y,
						x: 0,
						y: 0
					});
					bodyCenterPoints.push({
						cx: svgCenter.x - svgCalcParams.cellSizeHalf - svgCalcParams.cellSpacing - OVERLAP,
						cy: svgCenter.y,
						x: 0,
						y: 0
					});
				} else if (head.x < tail.x) {
					bodyCenterPoints.push({
						cx: svgCenter.x + svgCalcParams.cellSizeHalf - OVERLAP,
						cy: svgCenter.y,
						x: 0,
						y: 0
					});
					bodyCenterPoints.push({
						cx: svgCenter.x + svgCalcParams.cellSizeHalf + svgCalcParams.cellSpacing + OVERLAP,
						cy: svgCenter.y,
						x: 0,
						y: 0
					});
				} else if (head.y > tail.y) {
					bodyCenterPoints.push({
						cx: svgCenter.x,
						cy: svgCenter.y + svgCalcParams.cellSizeHalf - OVERLAP,
						x: 0,
						y: 0
					});
					bodyCenterPoints.push({
						cx: svgCenter.x,
						cy: svgCenter.y + svgCalcParams.cellSizeHalf + svgCalcParams.cellSpacing + OVERLAP,
						x: 0,
						y: 0
					});
				} else if (head.y < tail.y) {
					bodyCenterPoints.push({
						cx: svgCenter.x,
						cy: svgCenter.y - svgCalcParams.cellSizeHalf + OVERLAP,
						x: 0,
						y: 0
					});
					bodyCenterPoints.push({
						cx: svgCenter.x,
						cy: svgCenter.y - svgCalcParams.cellSizeHalf - svgCalcParams.cellSpacing - OVERLAP,
						x: 0,
						y: 0
					});
				}
			}
		}

		// Finally, return an array of SvgPoints to use for a polyline
		return bodyCenterPoints.map((obj) => {
			return { x: obj.cx, y: obj.cy };
		});
	}

	$: drawBody = bodyPolylinePoints.length > 0;

	$: bodyPolylineProps = calcBodyPolylineProps(bodyPolylinePoints);
	function calcBodyPolylineProps(polylinePoints: SvgPoint[]) {
		// Convert points into a string of the format "x1,y1 x2,y2, ...
		const points = polylinePoints
			.map((p) => {
				return `${p.x},${p.y}`;
			})
			.join(' ');

		return {
			points,
			'stroke-width': svgCalcParams.cellSize,
			'stroke-linecap': 'butt',
			'stroke-linejoin': 'round'
		};
	}
</script>

{#if drawBody}
	<polyline stroke={snake.color} fill="transparent" {...bodyPolylineProps} />
{/if}
