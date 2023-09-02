<script lang="ts">
  export let id: string;
</script>

<template {id}>
  <div class="grid grid-cols-2 gap-x-2 gap-y-1 p-2">
    <p class="font-bold col-span-2 mb-2">Keyboard Shortcuts</p>
    <p>Play/Pause</p>
    <p class="text-right">
      <span class="hotkey">Space</span>
      <span class="hotkey">s</span>
      <span class="hotkey">k</span>
    </p>
    <p>Next Turn</p>
    <p class="text-right">
      <span class="hotkey">→</span>
      <span class="hotkey">d</span>
      <span class="hotkey">l</span>
    </p>
    <p>Previous Turn</p>
    <p class="text-right">
      <span class="hotkey">←</span>
      <span class="hotkey">a</span>
      <span class="hotkey">j</span>
    </p>
    <p>Next Elimination</p>
    <p class="text-right">
      <span class="hotkey">e</span>
    </p>
    <p>Previous Elimination</p>
    <p class="text-right">
      <span class="hotkey">q</span>
    </p>
    <p>Jump to Start</p>
    <p class="text-right">
      <span class="hotkey">r</span>
    </p>
    <p>Jump to End</p>
    <p class="text-right">
      <span class="hotkey">t</span>
    </p>
    <p>Settings</p>
    <p class="text-right">
      <span class="hotkey">,</span>
    </p>
  </div>
</template>

<style lang="postcss">
  .hotkey {
    @apply px-2 rounded bg-pink-800/50;
    border: 1px solid #888;
  }
</style>
