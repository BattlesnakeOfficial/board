<script lang="ts">
  import { playbackState } from "$lib/playback/stores";

  // Range input properties
  let min = 0;
  let max = 10;
  let step = 1;
  let disabled = true;

  // Scrubber value
  let value = min;

  // Enable the scrubber once the final frame is known
  $: if (disabled && $playbackState && $playbackState.finalFrame) {
    disabled = false;
    max = $playbackState.finalFrame.turn;
  }

  // Update range value to reflect currently displayed frame
  $: if (!disabled && $playbackState) {
    value = $playbackState.frame.turn;
  }

  function onScrub(e: Event) {
    // Jump to frame on scrub event. Note that we can't use
    // the bound `value` here because it hasn't updated yet.
    if (e.target) {
      const frame = parseInt((e.target as HTMLInputElement).value);
      playbackState?.controls.jumpToFrame(frame);
    }
  }

  function onFocus(e: Event) {
    // Prevent input from being focused (it messes with hotkeys)
    if (e.target) {
      (e.target as HTMLElement).blur();
    }
  }
</script>

{#if $playbackState}
  <input
    class="w-full cursor-pointer disabled:cursor-not-allowed"
    type="range"
    {min}
    {max}
    {step}
    {disabled}
    on:focus={onFocus}
    on:input={onScrub}
    bind:value
  />
{/if}
