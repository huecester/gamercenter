<script>
	import '../app.scss';
	import Header from '../components/Header.svelte';
	import Navbar from '../components/Navbar.svelte';

	const routes = [
		{ title: 'Home', path: '/' },
		{ title: 'About', path: '/about' },
		{ title: 'Games', path: '/games' },
		{ title: 'Bots', path: '/bots' },
	];
</script>


<Header />
<Navbar {routes} />

<slot />
