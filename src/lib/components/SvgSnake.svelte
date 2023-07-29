<script lang="ts">
	import type { Point, Snake } from '$lib/playback/types';
	import { fetchCustomizationSvgDef } from '$lib/customizations';

	import { type SvgCalcParams, svgCalcCellCenter, svgCalcCellRect } from '$lib/svg';

	// Used to extend body segments to ensure overlap with head and tail
	const OVERLAP = 0.1;

	export let snake: Snake;
	export let svgCalcParams: SvgCalcParams;
	export let displayClass = '';

	function displayHead(snake: Snake): boolean {
		// Snake heads are always shown
		return true;
	}

	function displayTail(snake: Snake): boolean {
		// Snake heads take priority
		const [head, tail] = [snake.body[0], snake.body[snake.body.length - 1]];
		if (head.x == tail.x && head.y == tail.y) {
			return false;
		}
		return true;
	}

	function svgPolylinePropsForSnakeBody(body: Point[]) {
		const strokeWidth = svgCalcParams.cellSize;
		const strokeLinejoin = 'round';
		let strokeLinecap = 'square';

		const [head, tail] = [body[0], body[body.length - 1]];

		const bodyCenterPoints = [];
		for (let i = 0; i < body.length; i++) {
			const p = body[i];

			// Ignore points that overlap with the head and tail
			if (head.x == p.x && head.y == p.y) {
				continue;
			} else if (tail.x == p.x && tail.y == p.y) {
				continue;
			}

			const [cx, cy] = svgCalcCellCenter(svgCalcParams, p);
			bodyCenterPoints.push({ cx: cx, cy: cy, x: p.x, y: p.y });
		}

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
				bodyCenterPoints.push({ cx: last.cx + gapSize, cy: last.cy });
			} else if (tail.x < last.x) {
				bodyCenterPoints.push({ cx: last.cx - gapSize, cy: last.cy });
			} else if (tail.y > last.y) {
				bodyCenterPoints.push({ cx: last.cx, cy: last.cy - gapSize });
			} else if (tail.y < last.y) {
				bodyCenterPoints.push({ cx: last.cx, cy: last.cy + gapSize });
			}
		}

		// If we're drawing no body, but head and tail are different,
		// they still need to be connected.
		if (bodyCenterPoints.length == 0) {
			// We're only filling the spacing gap, so we need to
			// stop the line at the given coordinates.
			strokeLinecap = 'butt'; // lol.

			if (head.x != tail.x || head.y != tail.y) {
				const [cx, cy] = svgCalcCellCenter(svgCalcParams, head);
				if (head.x > tail.x) {
					bodyCenterPoints.push({ cx: cx - svgCalcParams.cellSizeHalf + OVERLAP, cy: cy });
					bodyCenterPoints.push({
						cx: cx - svgCalcParams.cellSizeHalf - svgCalcParams.cellSpacing - OVERLAP,
						cy: cy
					});
				} else if (head.x < tail.x) {
					bodyCenterPoints.push({ cx: cx + svgCalcParams.cellSizeHalf - OVERLAP, cy: cy });
					bodyCenterPoints.push({
						cx: cx + svgCalcParams.cellSizeHalf + svgCalcParams.cellSpacing + OVERLAP,
						cy: cy
					});
				} else if (head.y > tail.y) {
					bodyCenterPoints.push({ cx: cx, cy: cy + svgCalcParams.cellSizeHalf - OVERLAP });
					bodyCenterPoints.push({
						cx: cx,
						cy: cy + svgCalcParams.cellSizeHalf + svgCalcParams.cellSpacing + OVERLAP
					});
				} else if (head.y < tail.y) {
					bodyCenterPoints.push({ cx: cx, cy: cy - svgCalcParams.cellSizeHalf + OVERLAP });
					bodyCenterPoints.push({
						cx: cx,
						cy: cy - svgCalcParams.cellSizeHalf - svgCalcParams.cellSpacing - OVERLAP
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

	function svgTransformForSnakeHead(snake: Snake): string {
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

	function svgTransformForSnakeTail(snake: Snake): string {
		const tailIndex = snake.body.length - 1;
		const tail = snake.body[tailIndex];

		// We need to work backwards from the tail until we reach a segment
		// that doesn't overlap or is stacked.
		let preTailIndex = tailIndex - 1;
		let preTail = snake.body[preTailIndex];

		while (preTail.x == tail.x && preTail.y == tail.y) {
			preTailIndex -= 1;
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
</script>

<g id={`snake-${snake.id}`} class="snake {displayClass}">
	<!-- Body -->
	<polyline stroke={snake.color} fill="transparent" {...svgPolylinePropsForSnakeBody(snake.body)} />

	<!-- Head -->
	{#await fetchCustomizationSvgDef('head', snake.head) then headSvgDef}
		{#if displayHead(snake)}
			<svg
				viewBox="0 0 100 100"
				fill={snake.color}
				{...svgCalcCellRect(svgCalcParams, snake.body[0])}
			>
				<g transform={svgTransformForSnakeHead(snake)}>
					{@html headSvgDef}
				</g>
			</svg>
		{/if}
	{/await}

	<!-- Tail -->
	{#await fetchCustomizationSvgDef('tail', snake.tail) then tailSvgDef}
		{#if displayTail(snake)}
			<svg
				viewBox="0 0 100 100"
				fill={snake.color}
				{...svgCalcCellRect(svgCalcParams, snake.body[snake.body.length - 1])}
			>
				<g transform={svgTransformForSnakeTail(snake)}>
					{@html tailSvgDef}
				</g>
			</svg>
		{/if}
	{/await}
</g>
