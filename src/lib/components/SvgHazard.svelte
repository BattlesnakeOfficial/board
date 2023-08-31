<script lang="ts">
  import type { Point } from "$lib/playback/types";
  import { type SvgCalcParams, svgCalcCellRect } from "$lib/svg";

  export let key: string;
  export let point: Point;
  export let svgCalcParams: SvgCalcParams;

  $: rectProps = svgCalcCellRect(svgCalcParams, point);
</script>

<rect id={`hazard-${key}`} class="hazard fill-black opacity-30" {...rectProps} />
