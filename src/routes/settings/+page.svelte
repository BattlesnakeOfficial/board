<script lang="ts">
	import { autoplay, fps, showCoords } from '$lib/settings/stores';

	const playbackSpeedOptions = [
		{ value: 2, text: 'Slow' },
		{ value: 6, text: 'Medium' },
		{ value: 18, text: 'Fast' }
	];

	function navigateBack() {
		history.back();
	}
</script>

<div class="p-4 max-w-2xl mx-auto">
	<h1 class="text-2xl font-bold">Settings</h1>
	<hr class="mb-4" />

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

	<!-- <div class="mb-4">
		<label class="block">
			<p class="font-bold">Theme</p>
			<select class="w-full">
				<option>Dark</option>
				<option>Light</option>
			</select>
		</label>
	</div> -->

	<div class="mb-4">
		<label class="inline-flex items-center">
			<input type="checkbox" bind:checked={$autoplay} />
			<span class="font-bold mx-2">Autoplay</span>
		</label>
		<p class="text-sm">All games will start playing as soon as the game loads.</p>
	</div>

	<div class="mb-4">
		<label class="inline-flex items-center">
			<input type="checkbox" bind:checked={$showCoords} />
			<span class="font-bold mx-2">Display Coordinates</span>
		</label>
		<p class="text-sm">
			Display coordinate labels on the game board. These go from 0 to the width/height of the board
			to make it easier to debug games.
		</p>
	</div>

	<!-- <div class="mb-4">
		<label class="inline-flex items-center">
			<input type="checkbox" />
			<span class="font-bold mx-2">Frame Scrubber</span>
		</label>
		<p class="text-sm">
			Display progress bar that shows current frame and allows quickly jumping to specific frames.
		</p>
	</div> -->

	<p><a on:click={navigateBack} href="/">Back</a></p>
</div>
