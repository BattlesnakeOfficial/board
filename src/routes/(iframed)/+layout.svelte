<!--
	On all screens we assume width is fixed and we adjust height accordingly:
	  - On small screens, use whatever height is required
	  - On large screens:
	  	- enforce a 16x9 aspect and use that to set height
	 	- centered horizontally and top-aligned
		- with a max width of 1280px (screen size xl)
-->
<div class="w-full max-w-screen-xl md:aspect-video mx-auto">
  <slot />
</div>
