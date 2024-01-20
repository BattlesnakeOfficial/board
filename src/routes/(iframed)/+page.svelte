<script lang="ts">
  import { onMount } from "svelte";

  import { beforeNavigate, goto } from "$app/navigation";

  import { keybind } from "$lib/actions/keybind";
  import { tooltip } from "$lib/actions/tooltip";
  import { resize } from "$lib/actions/resize";
  import { initWindowMessages, sendResizeMessage } from "$lib/playback/messages";
  import { playbackError, playbackState } from "$lib/playback/stores";

  import Gameboard from "$lib/components/Gameboard.svelte";
  import PlaybackControls from "$lib/components/PlaybackControls.svelte";
  import Scoreboard from "$lib/components/Scoreboard.svelte";
  import TooltipTemplateHotkeys from "$lib/components/TooltipTemplateHotkeys.svelte";
  import TooltipTemplateSettings from "$lib/components/TooltipTemplateSettings.svelte";
  import Scrubber from "$lib/components/Scrubber.svelte";

  import IconCog from "~icons/heroicons/cog-8-tooth";
  import IconHelp from "~icons/heroicons/question-mark-circle";

  import { getDefaultSettings, loadSettingsWithURLOverrides } from "$lib/settings/stores";
  import { setTheme } from "$lib/theme";

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

  let settings = getDefaultSettings();
  let settingError = true;

  onMount(() => {
    const url = new URL(window.location.href);
    settings = loadSettingsWithURLOverrides(url);

    setTheme(settings.theme);

    if (settings.game.length > 0 && settings.engine.length > 0) {
      settingError = false;
      playbackState.load(fetch, settings);
      initWindowMessages();
    }
  });
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
  {#if settingError}
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
    <TooltipTemplateSettings id={settingsTooltipOptions.templateId} {settings} />
    <div class="w-full h-full flex flex-col md:flex-row">
      <div class="flex flex-col grow">
        {#if settings.title}
          <h1 class="text-center font-bold pt-2 text-lg">{settings.title}</h1>
        {/if}
        <Gameboard showCoordinates={settings.showCoords} />
        {#if settings.showControls}
          {#if settings.showScrubber}
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
      {#if settings.showScoreboard}
        <div class="basis-full md:basis-[45%] order-first p-2 md:order-last">
          <Scoreboard />
        </div>
      {/if}
    </div>
  {:else}
    <p class="p-4 text-lg text-center">Loading game...</p>
  {/if}
</div>
