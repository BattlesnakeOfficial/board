<script lang="ts">
  import type { Snake } from "$lib/playback/types";
  import type { SvgCalcParams } from "$lib/svg";

  import SvgSnakeTail from "./SvgSnakeTail.svelte";
  import SvgSnakeHead from "./SvgSnakeHead.svelte";
  import SvgSnakeBody from "./SvgSnakeBody.svelte";

  export let snake: Snake;
  export let svgCalcParams: SvgCalcParams;
  export let opacity = 1.0;
</script>

<g id={`snake-${snake.id}`} class="snake" style:opacity>
  <SvgSnakeTail {svgCalcParams} {snake} />
  <SvgSnakeBody {svgCalcParams} {snake} />
  <SvgSnakeHead {svgCalcParams} {snake} />
</g>
