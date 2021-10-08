<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
		roomID: {
			type: String,
			required: true,
		},
		players: {
			type: Array,
			required: true,
		},
		hasPassword: {
			validator(value) {
				return ['Yes', 'No'].includes(value);
			},
		},
	},
};
</script>

<template>
	<tr>
		<td>
			<p>{{ name }}</p>
		</td>
		<td>
			<ul>
				<li
						v-for="(player, index) in players"
						:key="index"
						>
						{{ player }}
				</li>
			</ul>
		</td>
		<td>
			<p>{{ password }}</p>
		</td>
	</tr>
</template>

<style scoped lang="sass">
</style>
