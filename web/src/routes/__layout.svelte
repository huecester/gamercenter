<script context="module">
	export const load = async ({ page }) => ({
		props: {
			path: page.path,
		},
	});
</script>

<script>
	import '../app.scss';

	import Header from '$lib/components/Header.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	import { fly } from 'svelte/transition';

	export let path;

	const routes = [
		{ title: 'Home', path: '/' },
		{ title: 'About', path: '/about' },
		{ title: 'Games', path: '/games' },
	];

	const transitionDuration = 400;
</script>


<Header />
<Navbar {routes} {path} />

{#key path}
	<div
		in:fly="{{delay: transitionDuration, duration: transitionDuration, x: -250, opacity: 0}}"
		out:fly="{{duration: transitionDuration, x: 250, opacity: 0}}"
	>
		<slot />
	</div>
{/key}
