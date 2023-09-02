<script lang="ts">
  import { playbackState } from "$lib/playback/stores";
  import { highlightedSnakeID } from "$lib/highlight";
  import type { SvgCalcParams } from "$lib/svg";

  import SvgHazard from "./SvgHazard.svelte";
  import SvgSnake from "./SvgSnake.svelte";
  import SvgFood from "./SvgFood.svelte";
  import SvgGrid from "./SvgGrid.svelte";

  // Grid constants
  const CELL_SIZE = 20;
  const CELL_SIZE_HALF = CELL_SIZE / 2;
  const CELL_SPACING = 4;
  const GRID_BORDER = 10;

  export let showCoordinates: boolean;

  $: svgWidth = $playbackState
    ? 2 * GRID_BORDER +
      $playbackState.frame.width * CELL_SIZE +
      Math.max($playbackState.frame.width - 1, 0) * CELL_SPACING
    : 0;
  $: svgHeight = $playbackState
    ? 2 * GRID_BORDER +
      $playbackState.frame.height * CELL_SIZE +
      Math.max($playbackState.frame.height - 1, 0) * CELL_SPACING
    : 0;

  $: svgCalcParams = {
    cellSize: CELL_SIZE,
    cellSizeHalf: CELL_SIZE_HALF,
    cellSpacing: CELL_SPACING,
    gridBorder: GRID_BORDER,
    height: svgHeight,
    width: svgWidth
  } as SvgCalcParams;
</script>

{#if $playbackState}
  <svg class="gameboard flex-shrink" viewBox="0 0 {svgWidth} {svgHeight}">
    <!-- Grid -->
    <SvgGrid
      gridWidth={$playbackState.frame.width}
      gridHeight={$playbackState.frame.height}
      showLabels={showCoordinates}
      {svgCalcParams}
    />

    <!-- Snakes -->
    {#if $highlightedSnakeID}
      <!-- Draw non-highlighted snakes under the highlighted one -->
      {#each $playbackState.frame.snakes as snake}
        {#if snake.id !== $highlightedSnakeID}
          <SvgSnake {snake} {svgCalcParams} opacity={0.1} />
        {/if}
      {/each}
      {#each $playbackState.frame.snakes as snake}
        {#if snake.id === $highlightedSnakeID}
          <SvgSnake {snake} {svgCalcParams} />
        {/if}
      {/each}
    {:else}
      <!-- Draw eliminated snakes under the alive ones -->
      {#each $playbackState.frame.snakes as snake}
        {#if snake.isEliminated}
          <SvgSnake {snake} {svgCalcParams} opacity={0.1} />
        {/if}
      {/each}
      {#each $playbackState.frame.snakes as snake}
        {#if !snake.isEliminated}
          <SvgSnake {snake} {svgCalcParams} />
        {/if}
      {/each}
    {/if}

    <!-- Hazards -->
    {#each $playbackState.frame.hazards as hazard, i}
      <SvgHazard point={hazard} key={`${i}`} {svgCalcParams} />
    {/each}

    <!-- Food -->
    {#each $playbackState.frame.food as food, i}
      <SvgFood point={food} key={`${i}`} {svgCalcParams} />
    {/each}
  </svg>
{/if}

<style lang="postcss">
  /* Add a minimal drop shadow to food and snakes */
  :global(svg.gameboard .food, svg.gameboard .snake) {
    filter: drop-shadow(0.1em 0.1em 0.05em rgba(0, 0, 0, 0.3));
  }
</style>
