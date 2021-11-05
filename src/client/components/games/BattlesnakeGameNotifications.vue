<script>
export default {
	props: {
		notifications: {
			type: Array,
			required: true,
		},
	},
};
</script>

<template>
	<ul>
		<li
				v-for="notification in notifications"
				>
				{{ notification.message }}
		</li>
	</ul>
</template>

<style scoped lang="sass">
</style>
