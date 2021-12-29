<script>
	import client from '$lib/scripts/sanity.js';

	export let portableText;

	const img = client.getDocument(portableText.block.asset._ref);
</script>

{#await img then img}
	<img src={img.url} />
{:catch err}
	<p class="error">Failed to load image.</p>
{/await}

<style lang="scss">
	.error {
		color: $error-dk;
	}
</style>
