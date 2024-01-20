<script lang="ts">
  import { autoplay, fps, showCoords, showScrubber, theme } from "$lib/settings/stores";

  const playbackSpeedOptions = [
    { value: 2, text: "Slow" },
    { value: 6, text: "Medium" },
    { value: 18, text: "Fast" }
  ];

  function navigateBack(e: MouseEvent) {
    e.preventDefault();

    history.back();
  }
</script>

<div class="p-4 max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold">Settings</h1>
  <hr class="mb-4" />

  <div class="mb-4">
    <label class="block">
      <p class="font-bold">Theme</p>
      <select class="w-full" bind:value={$theme}>
        <option value={"system"}>Use System Preference</option>
        <option value={"light"}>Light</option>
        <option value={"dark"}>Dark</option>
      </select>
    </label>
  </div>

  <div class="mb-4">
    <label class="block">
      <p class="font-bold">Playback Speed</p>
      <select class="w-full" bind:value={$fps}>
        {#each playbackSpeedOptions as option}
          <option value={option.value}>{option.text}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="mb-4">
    <label class="inline-flex items-center">
      <input type="checkbox" bind:checked={$autoplay} />
      <span class="font-bold mx-2">Autoplay</span>
    </label>
    <p class="text-sm">Start playback as soon as the first turn is ready.</p>
  </div>

  <div class="mb-4">
    <label class="inline-flex items-center">
      <input type="checkbox" bind:checked={$showCoords} />
      <span class="font-bold mx-2">Board Coordinates</span>
    </label>
    <p class="text-sm">Show coordinate labels on the game board.</p>
  </div>

  <div class="mb-4">
    <label class="inline-flex items-center">
      <input type="checkbox" bind:checked={$showScrubber} />
      <span class="font-bold mx-2">Scrub Bar</span>
    </label>
    <p class="text-sm">Show a scrubbable progress bar under the game board.</p>
  </div>

  <p><a on:click={navigateBack} href="/">Back</a></p>
</div>
