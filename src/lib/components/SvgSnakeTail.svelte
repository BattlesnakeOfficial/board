<script lang="ts">
  import type { Snake } from "$lib/playback/types";
  import { fetchCustomizationSvgDef } from "$lib/customizations";
  import { type SvgCalcParams, svgCalcCellRect } from "$lib/svg";
  import { calcDestinationWrapPosition, isAdjacentPoint } from "$lib/geometry";

  export let snake: Snake;
  export let svgCalcParams: SvgCalcParams;

  $: drawTail = calcDrawTail(snake);
  function calcDrawTail(snake: Snake): boolean {
    // Skip drawing the tail if the snake head occupies the same spot
    const head = snake.body[0];
    const tail = snake.body[snake.body.length - 1];

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
        return "";
      }
      preTail = snake.body[preTailIndex];
    }

    // If tail is wrapped we need to calcualte neck position on border
    if (!isAdjacentPoint(preTail, tail)) {
      preTail = calcDestinationWrapPosition(preTail, tail);
    }

    // Return transform based on relative location
    if (preTail.x > tail.x) {
      // Moving right
      return "scale(-1,1) translate(-100,0)";
    } else if (preTail.y > tail.y) {
      // Moving up
      return "scale(-1,1) translate(-100,0) rotate(90, 50, 50)";
    } else if (preTail.y < tail.y) {
      // Moving down
      return "scale(-1,1) translate(-100,0) rotate(-90, 50, 50)";
    }
    // Moving left
    return "";
  }
</script>

{#await fetchCustomizationSvgDef("tail", snake.tail) then tailSvgDef}
  {#if drawTail}
    <svg class="tail" viewBox="0 0 100 100" fill={snake.color} {...tailRectProps}>
      <g transform={tailTransform}>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html tailSvgDef}
      </g>
    </svg>
  {/if}
{/await}
