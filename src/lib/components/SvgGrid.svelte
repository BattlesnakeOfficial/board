<script lang="ts">
	import {
		type SvgCalcParams,
		svgCalcCellRect,
		svgCalcCellLabelBottom,
		svgCalcCellLabelLeft
	} from '$lib/svg';

	const CELL_COLOR = '#f1f1f1';
	const COORDS_COLOR = '#888888';

	export let gridWidth: number;
	export let gridHeight: number;
	export let showLabels: boolean;
	export let svgCalcParams: SvgCalcParams;
</script>

<g>
	{#each { length: gridWidth } as _, x}
		{#each { length: gridHeight } as _, y}
			<rect
				id={`grid-${x}-${y}`}
				class="grid"
				fill={CELL_COLOR}
				{...svgCalcCellRect(svgCalcParams, { x, y })}
			/>
		{/each}
	{/each}
	{#if showLabels}
		{#each { length: gridHeight } as _, x}
			<text
				class="coordinate"
				text-anchor="middle"
				font-size="4px"
				fill={COORDS_COLOR}
				transform="translate(0, 2)"
				{...svgCalcCellLabelBottom(svgCalcParams, { x: x, y: 0 })}
			>
				{x}
			</text>
		{/each}
		{#each { length: gridHeight } as _, y}
			<text
				class="coordinate"
				text-anchor="middle"
				font-size="4px"
				fill={COORDS_COLOR}
				transform="translate(0, 2)"
				{...svgCalcCellLabelLeft(svgCalcParams, { x: 0, y: y })}
			>
				{y}
			</text>
		{/each}
	{/if}
</g>
