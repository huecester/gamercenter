<script context="module">
	export const load = async ({ page }) => ({
		props: {
			key: page.path,
		},
	});
</script>

<script>
	import '../app.scss';
	import Header from '$lib/components/Header.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Transition from '$lib/components/Transition.svelte';

	export let key;

	const routes = [
		{ title: 'Home', path: '/' },
		{ title: 'About', path: '/about' },
		{ title: 'Games', path: '/games' },
		{ title: 'Bots', path: '/bots' },
	];
</script>


<Header />
<Navbar {routes} />

{#key key}
	<Transition>
		<slot />
	</Transition>
{/key}
