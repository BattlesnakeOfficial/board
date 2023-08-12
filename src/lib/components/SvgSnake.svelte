<script lang="ts">
	import type { Point, Snake } from '$lib/playback/types';
	import { fetchCustomizationSvgDef } from '$lib/customizations';

	import { type SvgCalcParams, svgCalcCellCenter, svgCalcCellRect } from '$lib/svg';

	// Used to extend body segments to ensure overlap with head and tail
	const OVERLAP = 0.1;

	export let snake: Snake;
	export let svgCalcParams: SvgCalcParams;
	export let displayClass = '';

	$: drawHead = calcDrawHead(snake);
	function calcDrawHead(snake: Snake): boolean {
		return true; // Snake heads are always drawn!
	}

	$: headRectProps = svgCalcCellRect(svgCalcParams, snake.body[0]);

	$: headTransform = calcHeadTransform(snake);
	function calcHeadTransform(snake: Snake): string {
		const [head, neck] = snake.body.slice(0, 2);

		// Return transform based on relative position between neck and tail.
		// Note that if the neck and tail overlap, we return the default (right).
		// This is intended.
		if (head.x < neck.x) {
			// Moving left
			return 'scale(-1,1) translate(-100, 0)';
		} else if (head.y > neck.y) {
			// Moving up
			return 'rotate(-90, 50, 50)';
		} else if (head.y < neck.y) {
			// Moving down
			return 'rotate(90, 50, 50)';
		}
		// Moving right
		return '';
	}

	$: drawTail = calcDrawTail(snake);
	function calcDrawTail(snake: Snake): boolean {
		// Skip drawing the tail if the snake head occupies the same spot
		const [head, tail] = [snake.body[0], snake.body[snake.body.length - 1]];
		if (head.x == tail.x && head.y == tail.y) {
			return false;
		}
		return true;
	}

	$: tailRectProps = svgCalcCellRect(svgCalcParams, snake.body[snake.body.length - 1]);

	$: tailTransform = calcTailTransform(snake);
	function calcTailTransform(snake: Snake): string {
		const tail = snake.body[snake.body.length - 1];

		// Work backwards from the tail until we reach a segment that isn't stacked.
		let preTailIndex = snake.body.length - 2;
		let preTail = snake.body[preTailIndex];
		while (preTail.x == tail.x && preTail.y == tail.y) {
			preTailIndex -= 1;
			if (preTailIndex < 0) {
				return '';
			}
			preTail = snake.body[preTailIndex];
		}

		// Return transform based on relative location
		if (preTail.x > tail.x) {
			// Moving right
			return 'scale(-1,1) translate(-100,0)';
		} else if (preTail.y > tail.y) {
			// Moving up
			return 'scale(-1,1) translate(-100,0) rotate(90, 50, 50)';
		} else if (preTail.y < tail.y) {
			// Moving down
			return 'scale(-1,1) translate(-100,0) rotate(-90, 50, 50)';
		}
		// Moving left
		return '';
	}

	$: bodyPolylineProps = calcBodyPolylineProps(snake);
	function calcBodyPolylineProps(snake: Snake) {
		// Polyline drawing params
		const strokeWidth = svgCalcParams.cellSize;
		const strokeLinejoin = 'round';
		let strokeLinecap = 'square';

		// Make a copy of snake body and separate into head, tail, and body.
		const body: Point[] = [...snake.body];
		const head = body.shift() as Point;
		const tail = body.pop() as Point;

		// Don't render any body parts that are stacked on the tail
		while (
			body.length > 0 &&
			body[body.length - 1].x == tail.x &&
			body[body.length - 1].y == tail.y
		) {
			body.pop();
		}

		// Get the center point of each body square we're going to render
		const bodyCenterPoints = body.map((p) => {
			const center = svgCalcCellCenter(svgCalcParams, p);
			return { cx: center.x, cy: center.y, x: p.x, y: p.y };
		});

		// If we're drawing *any* body, we want to extend the first and last points
		// to connect to the head and tail across the cell spacing.
		if (bodyCenterPoints.length > 0) {
			// Use overlap to ensure that we connect to head and tail.
			const gapSize = svgCalcParams.cellSpacing + OVERLAP;

			// Extend first point towards head
			const first = bodyCenterPoints[0];
			if (head.x > first.x) {
				bodyCenterPoints.unshift({ cx: first.cx + gapSize, cy: first.cy, x: 0, y: 0 });
			} else if (head.x < first.x) {
				bodyCenterPoints.unshift({ cx: first.cx - gapSize, cy: first.cy, x: 0, y: 0 });
			} else if (head.y > first.y) {
				bodyCenterPoints.unshift({ cx: first.cx, cy: first.cy - gapSize, x: 0, y: 0 });
			} else if (head.y < first.y) {
				bodyCenterPoints.unshift({ cx: first.cx, cy: first.cy + gapSize, x: 0, y: 0 });
			}

			// Extend last point towards tail
			const last = bodyCenterPoints[bodyCenterPoints.length - 1];
			if (tail.x > last.x) {
				bodyCenterPoints.push({ cx: last.cx + gapSize, cy: last.cy, x: 0, y: 0 });
			} else if (tail.x < last.x) {
				bodyCenterPoints.push({ cx: last.cx - gapSize, cy: last.cy, x: 0, y: 0 });
			} else if (tail.y > last.y) {
				bodyCenterPoints.push({ cx: last.cx, cy: last.cy - gapSize, x: 0, y: 0 });
			} else if (tail.y < last.y) {
				bodyCenterPoints.push({ cx: last.cx, cy: last.cy + gapSize, x: 0, y: 0 });
			}
		}

		// If we're drawing no body, but head and tail are different,
		// they still need to be connected.
		if (bodyCenterPoints.length == 0) {
			// We're only filling the spacing gap, so we need to
			// stop the line at the given coordinates.
			strokeLinecap = 'butt'; // lol.

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

		// Finally, translate to svg polyline attribute
		const polylinePoints = bodyCenterPoints
			.map((p) => {
				return `${p.cx},${p.cy}`;
			})
			.join(' ');

		return {
			points: polylinePoints,
			'stroke-width': strokeWidth,
			'stroke-linecap': strokeLinecap,
			'stroke-linejoin': strokeLinejoin
		};
	}
</script>

<g id={`snake-${snake.id}`} class="snake {displayClass}">
	<!-- Tail -->
	{#await fetchCustomizationSvgDef('tail', snake.tail) then tailSvgDef}
		{#if drawTail}
			<svg class="tail" viewBox="0 0 100 100" fill={snake.color} {...tailRectProps}>
				<g transform={tailTransform}>
					{@html tailSvgDef}
				</g>
			</svg>
		{/if}
	{/await}

	<!-- Body -->
	<polyline stroke={snake.color} fill="transparent" {...bodyPolylineProps} />

	<!-- Head -->
	{#await fetchCustomizationSvgDef('head', snake.head) then headSvgDef}
		{#if drawHead}
			<svg class="head" viewBox="0 0 100 100" fill={snake.color} {...headRectProps}>
				<g transform={headTransform}>
					{@html headSvgDef}
				</g>
			</svg>
		{/if}
	{/await}
</g>
