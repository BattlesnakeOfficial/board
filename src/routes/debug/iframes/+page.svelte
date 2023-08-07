<script lang="ts">
	import { page } from '$app/stores';

	let gameId = $page.url.searchParams.get('game');
	let gameTitle = $page.url.searchParams.get('title') || '';

	const configs = [
		{
			title: 'Recent Games on Leaderboard (1x1)',
			url: 'https://play.battlesnake.com/leaderboards',
			width: '300px',
			aspectRatio: '1 / 1',
			src: `/?game=${gameId}&title=${gameTitle}&showControls=false&showScoreboard=false&autoplay=true&fps=10`
		},
		{
			title: 'SM Screen Size (1x1)',
			url: `https://play.battlesnake.com/game/${gameId}`,
			width: '640px',
			aspectRatio: '1 / 1',
			src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
		},
		{
			title: 'MD Screen Size (1x1)',
			url: `https://play.battlesnake.com/game/${gameId}`,
			width: '768px',
			aspectRatio: '1 / 1',
			src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
		},
		{
			title: 'LG Screen Size (16x9)',
			url: `https://play.battlesnake.com/game/${gameId}`,
			width: '1024px',
			aspectRatio: '16 / 9',
			src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
		},
		{
			title: 'XL Screen Size (16x9)',
			url: `https://play.battlesnake.com/game/${gameId}`,
			width: '1280px',
			aspectRatio: '16 / 9',
			src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
		},
		{
			title: 'Full Width (16x9)',
			url: `https://play.battlesnake.com/game/${gameId}`,
			width: '100%',
			aspectRatio: '16 / 9',
			src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
		}
	];
</script>

<div class="m-4 w-full">
	{#each configs as config}
		<div class="flex flex-col w-full mb-16">
			<p class="text-xl font-bold text-center">{config.title}</p>
			<p class="text-sm text-center text-blue-500 mb-2">
				<a href={config.url}>{config.url}</a>
			</p>
			<div
				class="rounded-sm border-2 border-solid border-pink-500 mx-auto"
				style:width={config.width}
				style:aspect-ratio={config.aspectRatio}
				style:max-height={'720px'}
			>
				<iframe title={config.title} src={config.src} scrolling="no" class="w-full h-full" />
			</div>
		</div>
	{/each}
</div>
