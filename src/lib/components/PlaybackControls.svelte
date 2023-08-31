<script lang="ts">
  import { playbackState } from "$lib/playback/stores";
  import { PlaybackMode } from "$lib/playback/types";

  import IconPlay from "~icons/heroicons/play-solid";
  import IconPause from "~icons/heroicons/pause-solid";
  import IconNext from "~icons/heroicons/chevron-right-solid";
  import IconPrev from "~icons/heroicons/chevron-left-solid";
  import IconFirst from "~icons/heroicons/chevron-double-left-solid";
  import IconLast from "~icons/heroicons/chevron-double-right-solid";

  $: disableDuringPlayback = $playbackState ? $playbackState.mode == PlaybackMode.PLAYING : false;
</script>

{#if $playbackState}
  <div>
    <button
      class="mx-2 disabled:text-neutral-400"
      on:click={playbackState.controls.firstFrame}
      disabled={disableDuringPlayback}
    >
      <IconFirst />
    </button>
    <button
      class="mx-2 disabled:text-neutral-400"
      on:click={playbackState.controls.prevFrame}
      disabled={disableDuringPlayback}
    >
      <IconPrev />
    </button>
    {#if $playbackState.mode == PlaybackMode.PLAYING}
      <button class="mx-2" on:click={playbackState.controls.pause}>
        <IconPause />
      </button>
    {:else if $playbackState.mode == PlaybackMode.PAUSED}
      <button class="mx-2" on:click={playbackState.controls.play}>
        <IconPlay />
      </button>
    {/if}
    <button
      class="mx-2 disabled:text-neutral-400"
      on:click={playbackState.controls.nextFrame}
      disabled={disableDuringPlayback}
    >
      <IconNext />
    </button>
    <button
      class="mx-2 disabled:text-neutral-400"
      on:click={playbackState.controls.lastFrame}
      disabled={disableDuringPlayback}
    >
      <IconLast />
    </button>
  </div>
{/if}
