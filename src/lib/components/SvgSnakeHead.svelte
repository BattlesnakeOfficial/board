<script lang="ts">
  import type { Snake } from "$lib/playback/types";
  import { fetchCustomizationSvgDef } from "$lib/customizations";
  import { type SvgCalcParams, svgCalcCellRect } from "$lib/svg";
  import { calcDestinationWrapPosition, isAdjacentPoint } from "$lib/geometry";

  export let snake: Snake;
  export let svgCalcParams: SvgCalcParams;

  $: drawHead = calcDrawHead(snake);
  function calcDrawHead(_: Snake): boolean {
    return true; // Snake heads are always drawn!
  }

  $: headRectProps = svgCalcCellRect(svgCalcParams, snake.body[0]);

  $: headDirection = calcHeadDirection(snake);
  function calcHeadDirection(snake: Snake): string {
    const [head, neckPoint] = snake.body.slice(0, 2);

    let neck = neckPoint;
    // If head is wrapped we need to calcualte neck position on border
    if (!isAdjacentPoint(neck, head)) {
      neck = calcDestinationWrapPosition(neck, head);
    }

    // Determine head direction based on relative position of neck and tail.
    // If neck and tail overlap, we return the default direction (right).
    if (head.x < neck.x) {
      return "left";
    } else if (head.y > neck.y) {
      return "up";
    } else if (head.y < neck.y) {
      return "down";
    }
    return "right";
  }

  $: headTransform = calcHeadTransform(headDirection);
  function calcHeadTransform(headDirection: string): string {
    if (headDirection == "left") {
      return "scale(-1,1) translate(-100, 0)";
    } else if (headDirection == "up") {
      return "rotate(-90, 50, 50)";
    } else if (headDirection == "down") {
      return "rotate(90, 50, 50)";
    }

    // Moving right/default
    return "";
  }

  // If the snake is eliminated by self collision we give its head
  // a drop shadow for dramatic effect.
  $: drawHeadShadow = calcDrawHeadShadow(snake);
  function calcDrawHeadShadow(snake: Snake): boolean {
    return snake.isEliminated && snake.elimination?.cause == "snake-self-collision";
  }
</script>

{#await fetchCustomizationSvgDef("head", snake.head) then headSvgDef}
  {#if drawHead}
    <svg
      class="head {headDirection}"
      class:shadow={drawHeadShadow}
      viewBox="0 0 100 100"
      fill={snake.color}
      {...headRectProps}
    >
      <g transform={headTransform}>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html headSvgDef}
      </g>
    </svg>
  {/if}
{/await}

<style lang="postcss">
  /* Offset shadows in the direction the head is
	   facing to avoid drawing shadow over the body */
  svg.head.up.shadow {
    filter: drop-shadow(0 -0.4rem 0.2rem rgba(0, 0, 0, 0.3));
  }
  svg.head.down.shadow {
    filter: drop-shadow(0 0.4rem 0.2rem rgba(0, 0, 0, 0.3));
  }
  svg.head.left.shadow {
    filter: drop-shadow(-0.4rem 0 0.2rem rgba(0, 0, 0, 0.3));
  }
  svg.head.right.shadow {
    filter: drop-shadow(0.4rem 0 0.2rem rgba(0, 0, 0, 0.3));
  }
</style>
