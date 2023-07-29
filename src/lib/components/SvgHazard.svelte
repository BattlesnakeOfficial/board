<script lang="ts">
	import type { Point } from '$lib/playback/types';
	import { type SvgCalcParams, svgCalcCellRect } from '$lib/svg';

	const HAZARD_COLOR = '#000000';
	const HAZARD_OPACITY = 0.3;

	export let key: string;
	export let point: Point;
	export let svgCalcParams: SvgCalcParams;
</script>

<rect
	id={`hazard-${key}`}
	class="hazard"
	fill={HAZARD_COLOR}
	fill-opacity={HAZARD_OPACITY}
	{...svgCalcCellRect(svgCalcParams, point)}
/>
