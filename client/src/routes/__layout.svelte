<script>
	import '../app.scss';
	import logo from '../assets/logo-white-200x150.png';

	const routes = [
		{ title: 'Home', path: '/' },
		{ title: 'About', path: '/about' },
		{ title: 'Games', path: '/games' },
		{ title: 'Bots', path: '/bots' },
	];
</script>


<header>
	<a href="/">
		<img
			src={logo}
			alt="gamercenter logo"
			width="200"
			height="150"
		/>
	</a>
</header>

<nav>
	<ul class="delist row">
		{#each routes as route}
			<li>
				<a class="delink" href={route.path}>{route.title}</a>
			</li>
		{/each}
	</ul>
</nav>

<slot />


<style lang="scss">
	header {
		text-align: center;
		img {
			width: 100px;
			height: auto;
		}
	}

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
