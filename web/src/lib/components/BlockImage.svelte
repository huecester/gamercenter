<script>
	import client from '$lib/scripts/sanity.js';

	export let portableText;

	const img = client.getDocument(portableText.block.asset._ref);
</script>

{#await img}
	<div>
		<i class="fas fa-spinner fa-spin" />
	</div>
{:then img}
	<img src={img.url} />
{:catch err}
	<div>
		<i class="fas fa-unlink" />
	</div>
{/await}
