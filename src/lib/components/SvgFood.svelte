<script lang="ts">
  import type { Point } from "$lib/playback/types";
  import { type SvgCalcParams, svgCalcCellCircle } from "$lib/svg";

  export let key: string;
  export let point: Point;
  export let svgCalcParams: SvgCalcParams;

  $: circleProps = svgCalcCellCircle(svgCalcParams, point);
  $: foodRadius = (svgCalcParams.cellSize / 3.25).toFixed(2);
</script>

<circle id={`food-${key}`} class="food fill-rose-500" r={foodRadius} {...circleProps} />
