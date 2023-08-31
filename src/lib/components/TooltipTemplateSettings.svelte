<script lang="ts">
  import type { Settings } from "$lib/settings/stores";

  export let id: string;
  export let settings: Settings;
</script>

<template {id}>
  <div class="grid grid-cols-2 gap-x-2 gap-y-1 p-2">
    <p class="font-bold col-span-2 mb-2">Playback Settings</p>
    <p>autoplay:</p>
    <p class="text-right">{settings.autoplay}</p>
    <p>fps:</p>
    <p class="text-right">{settings.fps}</p>
    <p>showCoords:</p>
    <p class="text-right">{settings.showCoords}</p>
    <p>theme:</p>
    <p class="text-right">{settings.theme}</p>
  </div>
</template>
