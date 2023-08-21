<!--
	On md+ screens we want:
	 - a constant 16x9 frame
	 - centered horizontally and top-aligned
	 - with a max width of 1280px (screen size xl)
    See https://jsfiddle.net/danield770/8VJ38/3/ for a sense of what's happening here.

	On smaller screens we assume a fixed width and reactive iframe height.
-->
<div class="h-screen w-full max-w-screen-xl mx-auto">
	<div class="w-full md:max-w-[177.78vh] md:aspect-video md:max-h-screen md:mx-auto">
		<slot />
	</div>
</div>
