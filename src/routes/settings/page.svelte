<script>
import { darkMode } from '$lib/settings/stores';
</script>

<main>
	<form>
		<div class="mb-4">
			<label class="inline-flex items-center">
				<input type="checkbox" bind:checked={$darkMode} />
				<span class="font-bold mx-2">Dark Mode</span>
			</label>
		</div>
	</form>
</main>