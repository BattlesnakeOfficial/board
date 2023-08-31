<script lang="ts">
  import {
    type SvgCalcParams,
    svgCalcCellRect,
    svgCalcCellLabelBottom,
    svgCalcCellLabelLeft
  } from "$lib/svg";

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
        class="grid fill-[#f1f1f1] dark:fill-[#393939]"
        {...svgCalcCellRect(svgCalcParams, { x, y })}
      />
    {/each}
  {/each}
  {#if showLabels}
    {#each { length: gridHeight } as _, x}
      <text
        class="coordinate-label text-[0.35rem] fill-neutral-500"
        text-anchor="middle"
        transform="translate(0, 2)"
        {...svgCalcCellLabelBottom(svgCalcParams, { x: x, y: 0 })}
      >
        {x}
      </text>
    {/each}
    {#each { length: gridHeight } as _, y}
      <text
        class="coordinate-label text-[0.35rem] fill-neutral-500"
        text-anchor="middle"
        transform="translate(0, 2)"
        {...svgCalcCellLabelLeft(svgCalcParams, { x: 0, y: y })}
      >
        {y}
      </text>
    {/each}
  {/if}
</g>
