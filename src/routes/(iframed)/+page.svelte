<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";

  import { keybind } from "$lib/actions/keybind";
  import { tooltip } from "$lib/actions/tooltip";
  import { resize } from "$lib/actions/resize";
  import { sendResizeMessage } from "$lib/playback/messages";
  import { playbackError, playbackState } from "$lib/playback/stores";

  import Gameboard from "$lib/components/Gameboard.svelte";
  import PlaybackControls from "$lib/components/PlaybackControls.svelte";
  import Scoreboard from "$lib/components/Scoreboard.svelte";
  import TooltipTemplateHotkeys from "$lib/components/TooltipTemplateHotkeys.svelte";
  import TooltipTemplateSettings from "$lib/components/TooltipTemplateSettings.svelte";
  import Scrubber from "$lib/components/Scrubber.svelte";

  import IconCog from "~icons/heroicons/cog-8-tooth";
  import IconHelp from "~icons/heroicons/question-mark-circle";

  import type { PageData } from "./$types";

  export let data: PageData;

  const helpTooltipOptions = {
    templateId: "hotkeysTooltip",
    tippyProps: {
      arrow: false,
      placement: "top-start"
    }
  };

  const settingsTooltipOptions = {
    templateId: "settingsTooltip",
    tippyProps: {
      arrow: false,
      placement: "top-end"
    }
  };

  beforeNavigate(async () => {
    playbackState.controls.pause();
    playbackState.reset();
  });

  function navigateToSettings() {
    goto("/settings");
  }

  function onResize(width: number, height: number) {
    sendResizeMessage(width, height);
  }
</script>

<svelte:window
  use:keybind={{ keys: ["space", "s", "k"], f: playbackState.controls.togglePlayPause }}
  use:keybind={{ keys: ["left", "a", "j"], f: playbackState.controls.prevFrame }}
  use:keybind={{ keys: ["right", "d", "l"], f: playbackState.controls.nextFrame }}
  use:keybind={{ keys: ["q"], f: playbackState.controls.prevEliminationFrame }}
  use:keybind={{ keys: ["e"], f: playbackState.controls.nextEliminationFrame }}
  use:keybind={{ keys: ["r"], f: playbackState.controls.firstFrame }}
  use:keybind={{ keys: ["t"], f: playbackState.controls.lastFrame }}
  use:keybind={{ keys: [","], f: navigateToSettings }}
/>

<div use:resize={{ f: onResize }} class="h-full w-full flex flex-col items-center justify-center">
  {#if data.settingError}
    <p class="p-4 font-bold text-lg text-center">
      To display a game you need to specify the ID in the URL.
    </p>
    <p class="italic">
      {`https://board.battlesnake.com?game=<GAME_ID>`}
    </p>
  {:else if $playbackError}
    <p class="p-4 font-bold text-lg text-center text-red-500">
      {$playbackError}
    </p>
  {:else if $playbackState}
    <TooltipTemplateHotkeys id={helpTooltipOptions.templateId} />
    <TooltipTemplateSettings id={settingsTooltipOptions.templateId} settings={data.settings} />
    <div class="w-full h-full flex flex-col md:flex-row">
      <div class="flex flex-col grow">
        {#if data.settings.title}
          <h1 class="text-center font-bold pt-2 text-lg">{data.settings.title}</h1>
        {/if}
        <Gameboard showCoordinates={data.settings.showCoords} />
        {#if data.settings.showControls}
          {#if data.settings.showScrubber}
            <div class="w-full px-[7.5%]">
              <Scrubber />
            </div>
          {/if}
          <div class="flex justify-evenly text-xl py-2 px-6">
            <div use:tooltip={helpTooltipOptions}>
              <IconHelp />
            </div>
            <PlaybackControls />
            <div use:tooltip={settingsTooltipOptions}>
              <a href="/settings">
                <IconCog />
              </a>
            </div>
          </div>
        {/if}
      </div>
      {#if data.settings.showScoreboard}
        <div class="basis-full md:basis-[45%] order-first p-2 md:order-last">
          <Scoreboard />
        </div>
      {/if}
    </div>
  {:else}
    <p class="p-4 text-lg text-center">Loading game...</p>
  {/if}
</div>
