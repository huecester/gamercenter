<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	export let show;

	const dispatch = createEventDispatcher();
</script>


{#if show}
	<div
		on:click|self={() => dispatch('close')}
		class="background"
		transition:fade="{{ duration: 100 }}"
	>
		<div class="body">
			<slot />
		</div>
	</div>
{/if}


<style lang="scss">
	.background {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.body {
			background-color: $bg-medium;
			border: 1px solid $bg-light;
			padding: 0.25rem 1.25rem;
		}
	}
</style>
