<script>
	export let routes;
</script>

<nav>
	<ul class="delist row">
		{#each routes as route}
			<li>
				<a class="delink" href={route.path}>{route.title}</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav ul {
		margin: 0.5rem 0;
		background-color: $bg-medium;

		li a {
			display: block;
			padding: 0.5rem 1rem;
			font-style: bold;
			font-size: 1.1rem;
			transition: background-color 0.05s;

			&:hover {
				background-color: $fg-medium;
			}
			&:active {
				background-color: $fg-dark;
			}
		}
	}
</style>
