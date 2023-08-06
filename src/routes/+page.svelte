<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';

	import { keybind } from '$lib/actions/keybind';
	import { tooltip } from '$lib/actions/tooltip';
	import { playbackError, playbackState } from '$lib/playback/stores';

	import Gameboard from '$lib/components/Gameboard.svelte';
	import PlaybackControls from '$lib/components/PlaybackControls.svelte';
	import Scoreboard from '$lib/components/Scoreboard.svelte';
	import TooltipTemplateHotkeys from '$lib/components/TooltipTemplateHotkeys.svelte';
	import TooltipTemplateSettings from '$lib/components/TooltipTemplateSettings.svelte';

	import IconCog from '~icons/heroicons/cog-8-tooth';
	import IconHelp from '~icons/heroicons/question-mark-circle';

	import type { PageData } from './$types';
	export let data: PageData;

	const helpTooltipOptions = {
		templateId: 'hotkeysTooltip',
		tippyProps: {
			arrow: false,
			placement: 'top-start'
		}
	};

	const settingsTooltipOptions = {
		templateId: 'settingsTooltip',
		tippyProps: {
			arrow: false,
			placement: 'top-end'
		}
	};

	beforeNavigate(async ({}) => {
		playbackState.controls.pause();
		playbackState.reset();
	});

	function navigateToSettings() {
		goto('/settings');
	}
</script>

<svelte:window
	use:keybind={{ keys: ['space', 's', 'k'], f: playbackState.controls.togglePlayPause }}
	use:keybind={{ keys: ['left', 'a', 'j'], f: playbackState.controls.prevFrame }}
	use:keybind={{ keys: ['right', 'd', 'l'], f: playbackState.controls.nextFrame }}
	use:keybind={{ keys: ['q'], f: playbackState.controls.prevEliminationFrame }}
	use:keybind={{ keys: ['e'], f: playbackState.controls.nextEliminationFrame }}
	use:keybind={{ keys: ['r'], f: playbackState.controls.firstFrame }}
	use:keybind={{ keys: ['t'], f: playbackState.controls.lastFrame }}
	use:keybind={{ keys: [','], f: navigateToSettings }}
/>

{#if data.settingError}
	<div class="h-screen flex flex-col items-center justify-center">
		<p class="p-4 font-bold text-lg text-center">
			To display a game you need to specify a game ID in the URL.
		</p>
		<p class="italic">
			{`https://board.battlesnake.com?game=<GAME_ID>`}
		</p>
	</div>
{:else if $playbackError}
	<div class="h-screen flex items-center justify-center">
		<p class="p-4 text-red-500 text-lg text-center">{$playbackError}</p>
	</div>
{:else if $playbackState}
	<TooltipTemplateHotkeys id={helpTooltipOptions.templateId} />
	<TooltipTemplateSettings id={settingsTooltipOptions.templateId} settings={data.settings} />
	<div class="h-screen w-full max-w-screen-xl mx-auto flex flex-col md:flex-row">
		<div class="flex flex-col grow">
			{#if data.settings.title}
				<h1 class="text-center font-bold text-lg">{data.settings.title}</h1>
			{/if}
			<Gameboard showCoordinates={data.settings.showCoords} />
			{#if data.settings.showControls}
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
			<div class="basis-full md:basis-2/5 order-first md:order-last">
				<Scoreboard />
			</div>
		{/if}
	</div>
{:else}
	<div class="h-screen flex items-center justify-center">
		<p class="p-4 text-lg text-center">Loading game...</p>
	</div>
{/if}
