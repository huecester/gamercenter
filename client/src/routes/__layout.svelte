<script>
	import '../app.scss';
	import logo from '../assets/logo-white-200x150.png';
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
</style>
