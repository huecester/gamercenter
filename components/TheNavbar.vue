<script setup>
const navItems = [
	{ title: 'Home', path: '/' },
	{ title: 'About', path: '/about' },
	{ title: 'Games', path: '/games' },
	{ title: 'Bots', path: '/bots' },
];
</script>

<template>
	<nav>
		<ul class="delist row">
			<TheNavbarItem
					v-for="(item, index) in navItems"
					:to="item.path"
					:key="index"
					>
					{{ item.title }}
			</TheNavbarItem>
		</ul>
	</nav>
</template>

<style scoped lang="scss">
ul {
	margin: 0.5rem 0;
	background-color: $bg-medium;
}
</style>
