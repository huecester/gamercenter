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
	methods: {
		redirectToGame() {
			this.$router.push({ path: `/games/battlesnake/${this.roomID}` });
		},
	},
};
</script>

<template>
	<tr class="clickable" @click="redirectToGame">
		<td>
			<p class="big">{{ name }}</p>
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
			<p class="big">{{ hasPassword }}</p>
		</td>
	</tr>
</template>

<style scoped lang="sass">
tr
	display: flex
	background-color: $bg-dark

	&:nth-child(even)
		background-color: $bg-medium

td
	flex: 1
	.big
		font-size: 1.25rem

ul
	margin: 1rem 0
	padding: 0
li
	list-style-type: none
</style>
