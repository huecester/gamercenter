<script>
import NavbarItem from './NavbarItem.vue';

export default {
	components: {
		NavbarItem,
	},
	props: {
		navItems: {
			type: Array,
			required: true,
		},
	},
};
</script>

<template>
	<nav>
		<ul>
			<NavbarItem
					v-for="(item, index) in navItems"
					:to="item.path"
					:key="index"
					>
					{{ item.title }}
			</NavbarItem>
		</ul>
	</nav>
</template>

<style scoped lang="sass">
ul
	margin: 0.5rem 0
	padding: 0
	list-style-type: none
	display: flex
	background-color: $bg-medium
</style>
