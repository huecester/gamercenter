<script setup>
import { useRouter, defineProps } from '@nuxtjs/composition-api';
const router = useRouter();
const props = defineProps({
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
		default: [],
	},
	hasPassword: {
		type: Boolean,
		default: false,
	},
});

const joinRoom = () => {
	router.push({ path: `/games/battlesnake/${props.roomID}` });
}
</script>

<template>
	<tr class="clickable" @click="joinRoom">
		<td>
			<p class="big">{{ name }}</p>
		</td>

		<td>
			<ul>
				<li
						v-for="player in players"
						:key="player.id"
						>
						{{ player.username }}
				</li>
			</ul>
		</td>

		<td>
			<p class="big">{{ hasPassword ? 'Yes' : 'No' }}</p>
		</td>
	</tr>
</template>

<style scoped lang="scss">
tr {
	display: flex;
	background-color: $bg-dark;
	&:nth-child(even) {
		background-color: $bg-medium;
	}

	td {
		flex: 1;

		.big {
			font-size: 1.25rem;
		}

		ul {
			margin: 1rem 0;
			padding: 0;
			li {
				list-style-type: none;
			}
		}
	}
}
</style>
